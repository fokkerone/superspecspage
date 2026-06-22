# Execution Plan: Scroll Motion & Light/Dark Section Wechsel

**Spec:** superspec/specs/scroll-motion-style/spec.md
**Tasks:** superspec/specs/scroll-motion-style/tasks.md
**Context estimate:** ~27k (spec+tasks) + ~40k (codebase context) = ~67k / 200k ✅
**Started:** 2026-06-22

---

## Execution Strategy

Wave order: Wave 1 → Wave 2 → Wave 3 (parallel) → Wave 4
Human checkpoint after each Wave before next begins.

---

## Wave Summary

### Wave 1 — Foundation
**Sequential** (1.2 depends on 1.1)
Tasks: 1.1, 1.2, 1.3
- 1.1: `components/scroll-container.tsx` (neu)
- 1.2: `app/layout.tsx` + `app/globals.css` — ScrollContainer außen, body bg
- 1.3: `components/landing/header.tsx` — mix-blend-difference
Unblocks: Wave 2 (alle Wave-2 Komponenten brauchen `useScrollContainer`)

### Wave 2 — Page Structure + Hero
**Sequential** (2.1 braucht 2.2 import, 2.3 braucht 2.2 für hero cleanup)
Tasks: 2.2, 2.1, 2.3
- 2.2: `components/landing/terminal.tsx` (neu) + Terminal aus hero entfernen
- 2.1: `app/page.tsx` — Terminal import, main ohne bg
- 2.3: `components/landing/hero.tsx` — Mega-Headline, Parallax, light bg
Unblocks: Wave 3

### Wave 3 — Section Reveals
**Parallel** — alle 5 Tasks unabhängig voneinander
Tasks: 3.1, 3.2, 3.3, 3.4, 3.5
- 3.1: `components/landing/problem.tsx`
- 3.2: `components/landing/how-it-works.tsx`
- 3.3: `components/landing/features.tsx` — light bg + dark text + reveals
- 3.4: `components/landing/agents.tsx`
- 3.5: `components/landing/install.tsx`
Unblocks: Wave 4

### Wave 4 — Cleanup
**Sequential**
Tasks: 4.1
- 4.1: `DESIGN.md` update

---

## Critical Implementation Notes (alle Waves)

1. **ScrollContainer Placement:** `ScrollContainer` **außen** um `ThemeProvider + PageTransition` in layout.tsx — niemals innen. PageTransition bleibt vollständig unverändert.
2. **Easing:** Immer `EASE_ENTER_TUPLE` importieren aus `@/lib/easing` für framer-motion. Nie inline Literals.
3. **Opacity auf hell:** Auf `bg-signalgray-100` ist `/70` das Minimum für lesbaren Body-Text. `/60` und `/50` sind nicht AA-konform.
4. **Header padding:** Hero-Eyebrow braucht `pt-20 md:pt-24` damit er nicht unter dem fixen Header (`h-14` = 56px) verschwindet.
5. **mix-blend-difference Artefakt:** Während PageTransition (~1.45s) kippt der Header-Text kurz die Farbe. Erwartetes Verhalten — kein Bug, nicht fixen.

---

## Executor Instructions

Jeder Subagent erhält:
1. `superspec/specs/scroll-motion-style/spec.md` (voll)
2. `superspec/specs/scroll-motion-style/tasks.md` (nur seine Task)
3. Die Codebase
4. Keine Prior-Chat-History

Build-Verifikation nach jeder Task:
```bash
npx tsc --noEmit
npx biome check .
```

Build-Verifikation nach Wave 2 + Wave 3:
```bash
npm run build
```

---

## Human Checkpoints

- **Nach Wave 1:** Build läuft, Scroll-Container funktioniert, Header mix-blend visuell prüfen → Freigabe Wave 2
- **Nach Wave 2:** Hero Parallax + Terminal-Sektion visuell prüfen → Freigabe Wave 3
- **Nach Wave 3:** Alle Reveals + Features-Light-Sektion visuell prüfen → Freigabe Wave 4
- **Nach Wave 4:** Vollständige Verifikation (`/superspecs:verify`) → Ship
