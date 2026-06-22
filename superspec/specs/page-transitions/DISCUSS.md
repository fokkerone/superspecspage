# Discussion: Page Transitions

Date: 2026-06-22
Participants: human + AI

## What We're Building

Beim Navigieren über die Hauptnavigation soll die aktuelle Seite nach unten wegscrollen, während die neue Seite dahinter bereits sichtbar wird — wie bei betteroff.studio (Overview → Work). Der Effekt ist ein gestaffeltes "Slide-down exit": die ausgehende Seite fährt nach unten aus dem Viewport heraus, die eingehende Seite liegt von Beginn an im Hintergrund dahinter.

Die Transition wird über einen zentralen `PageTransition`-Wrapper gebaut, sodass der Animationsstil später ausgetauscht werden kann, ohne die einzelnen Seiten anfassen zu müssen.

## Goals

- Beim Seitenwechsel fährt die aktuelle Seite nach unten aus dem Viewport (exit: y 0 → 100%)
- Die neue Seite ist während des Exits bereits sichtbar im Hintergrund (z-index Staffelung)
- Alle Routen bekommen die Transition — keine Ausnahmen nötig
- Der Transitions-Typ ist austauschbar (Strategie-Pattern): swap in via einer einzigen Konfigurationsvariable
- framer-motion ist die Animations-Engine
- Funktioniert mit Next.js App Router (nicht Pages Router)

## Non-Goals (explicitly out of scope)

- Kein Enter-Animation der neuen Seite (die liegt still dahinter — nur Exit der alten)
- Keine unterschiedlichen Transitions pro Route
- Keine scroll-gesteuerte Animation (kein parallax)
- Keine Transition bei Browser-Back/Forward (vorerst)
- Kein Preloading / prefetch-Logik (das macht Next.js bereits)
- Kein Reduced-Motion-Support in diesem Scope (kann später ergänzt werden)

## Constraints

- **Technical:** Next.js 15 App Router — `usePathname` / `AnimatePresence` müssen in einem `"use client"`-Wrapper leben; das Root-Layout ist ein Server Component
- **Technical:** Turbopack aktiv — keine webpack-spezifischen Workarounds
- **Technical:** framer-motion ist noch nicht installiert (`package.json` zeigt keinen Eintrag)
- **Scope:** Nur die Hauptnavigation (Header-Links); Docs-Sidebar-Links profitieren automatisch, da alle Routen gewrappt werden
- **Scope:** SSG — kein Server-State, keine API-Calls während Transition nötig

## Key Decisions Made

### Decision: Animations-Architektur
**We will:** Einen `PageTransitionProvider` (Client Component) in `app/layout.tsx` einbauen, der `usePathname` als key für `AnimatePresence` nutzt. Jede Page wird in eine `motion.div` eingeschlossen.
**Because:** App Router hat kein `_app.tsx`-Äquivalent. Der einzige Ort wo alle Routen gewrappt werden können ist das Root-Layout — aber da es ein Server Component ist, muss der Animations-Wrapper ein separater Client Component sein.
**We won't:** Jede einzelne `page.tsx` mit `motion.div` wrappen — das ist nicht austauschbar und fehleranfällig.

### Decision: Exit-Effekt (betteroff.studio-Style)
**We will:** `exit: { y: "100%", transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] } }` — die ausgehende Seite fährt nach unten. Die eingehende Seite startet bei `y: 0` (keine enter-animation), liegt aber unter der ausgehenden via `z-index`.
**Because:** Das ist exakt der betteroff.studio-Effekt: neue Seite liegt still dahinter, alte fährt weg.
**We won't:** Eine symmetrische Enter+Exit-Animation (würde zu einem "Wipe"-Effekt führen, nicht dem gewünschten Reveal).

### Decision: Austauschbarkeit
**We will:** Die Animations-Variants in eine separate Datei `lib/transitions.ts` auslagern. Der Wrapper importiert eine benannte Transition (z.B. `slideDown`). Wechsel des Typs = eine Zeile ändern.
**Because:** Explizite Anforderung: der Transition-Typ muss austauschbar bleiben.
**We won't:** Die Variants inline in den Wrapper hardcoden.

### Decision: framer-motion Installation
**We will:** `framer-motion` installieren (ist bereits in der Techstack-Empfehlung als "optional" gelistet).
**Because:** Kein anderes Animations-Framework ist im Stack. CSS transitions allein können `AnimatePresence`-Stacking nicht replizieren.
**We won't:** Eine eigene Animations-Lösung bauen.

## Open Questions

- [ ] Soll der Header während der Transition sichtbar bleiben (fixed, z-index über allem) oder mitfaden? — Annahme: Header bleibt fixed und ist immer sichtbar
- [ ] Soll `prefers-reduced-motion` respektiert werden? — Für späteren Scope markiert
- [ ] Dauer und Easing exakt wie betteroff.studio oder frei anpassbar? — Startwert: 0.5s, cubic-bezier(0.76, 0, 0.24, 1), dann nachjustieren

## Success Criteria

- [ ] Navigation von `/` → `/docs` zeigt die aktuelle Seite nach unten wegfahren
- [ ] Navigation zwischen `/docs/introduction` → `/docs/quick-start` zeigt dieselbe Transition
- [ ] Die neue Seite ist während des Exits sichtbar im Hintergrund
- [ ] Transition-Typ ist durch Ändern eines Imports in `lib/transitions.ts` austauschbar
- [ ] Kein Layout-Flash, kein Scroll-Jump während der Transition
- [ ] TypeScript strict — keine `any`-Types
- [ ] Turbopack-Build fehlerfrei

## Risks

- **AnimatePresence + App Router:** `AnimatePresence` benötigt einen stabilen `key` der sich bei Routenwechsel ändert. `usePathname` liefert das zuverlässig, aber der Wrapper muss korrekt positioniert sein (direkt um den `children`-Slot des Root-Layouts).
- **Fixed Header Z-Index:** Während der Exit-Animation muss der Header (z-50) über der wegfahrenden Seite liegen. CSS stacking context durch `motion.div` kann das unterbrechen — muss getestet werden.
- **Scroll position:** Next.js scrollt beim Routenwechsel nach oben. Mit Transition kann es einen kurzen Moment geben, wo die neue Seite mitten im Scroll erscheint. Lösung: `scroll: false` auf den Links oder `scrollTo` im `onAnimationComplete`-Hook.

## Wiki References

- [[techstack/profile]] — Stack-Constraints: Next.js 15 App Router, framer-motion als "optional" gelistet, SSG, Turbopack
