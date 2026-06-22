# Discussion: Scroll Motion & Light/Dark Section Wechsel

Date: 2026-06-22
Participants: human + AI

## What We're Building

Eine fundamentale visuelle Aufwertung der SuperSpecs Landing Page inspiriert von zwei Referenzen: **signalgrau.vercel.app** (Scroll-animierter Mega-Headline, Parallax) und **betteroff.studio** (Light/Dark Sektionswechsel, Viewport-basierte Reveal-Animationen).

Der Kernmechanismus: Die Seite wechselt beim Scrollen zwischen hellen (signalgray-100/200) und dunklen (signalgray-800/900) Sektionen — genau wie betteroff.studio zwischen `bg-white-off` und `bg-black` wechselt. Der Hero zeigt den Text "AI coding that compounds." als gigantischen Viewport-breiten Headline der sich beim Scrollen parallax-artig bewegt (signalgrau-Mechanic). Alle weiteren Sektionen erhalten Viewport-basierte Reveal-Animationen (fade-up, clip-path-reveals).

## Goals

- Scroll-animierter Mega-Headline im Hero: "AI coding that compounds." überbreit, über den Viewport hinaus, bewegt sich beim Scrollen mit Parallax/Scale (1:1 nach signalgrau.vercel.app)
- Light/Dark Sektionswechsel: Hero hell (signalgray-100), dann dunkel (signalgray-800), dann hell, dann dunkel — Abwechslung wie betteroff.studio
- Viewport-basierte Reveal-Animationen auf allen Sektionen: Elemente faden/clippen ein sobald sie in den Viewport scrollen
- Parallax-Scroll-Effekte auf ausgewählten Elementen (Headline, ggf. Terminal-Mockup)
- Header-Nav mit `mix-blend-difference` damit sie auf beiden Hintergründen funktioniert (wie signalgrau + betteroff.studio beide machen)
- Text-Farben passen sich dem Sektions-Hintergrund an: auf hell → dark text, auf dunkel → white text

## Non-Goals (explicitly out of scope)

- Neue Inhalte / neue Sektionen — nur Styling und Animation bestehender Sektionen
- Horizontales Scrollen oder Slider
- Video-Backgrounds
- GSAP oder andere schwere Animation-Libraries — hand-rolled CSS + framer-motion (bereits im Stack)
- Mobile-specific komplett andere Layouts — responsive muss funktionieren aber kein komplett anderes mobile design
- Docs-Sektion — nur die Landing Page (`app/page.tsx`)

## Constraints

- **Technical:** Framer-motion ist bereits installiert. Die bestehende Snapshot-clone Page-Transition (`components/page-transition.tsx`) darf nicht gebrochen werden. Nur `EASE_ENTER`/`EASE_EXIT` als Easing-Kurven. Keine neuen Animation-Libraries installieren.
- **Scope:** `app/page.tsx`, `app/layout.tsx` (body bg), und `components/landing/*`. Keine Änderungen an Docs oder Page-Transition Logik.
- **Token-Regel:** Light-Sektionen nutzen `signalgray-100` (`oklch(0.9074 0.0087 84.57)`) als Hintergrund. Auf diesen Sektionen: `text-signalgray-800` als primäre Textfarbe (nicht `text-white`). Die Tokens sind bereits in `globals.css` definiert.
- **Shape-Regel:** Weiterhin `rounded-none` / `rounded-sm` auf allen neuen Elementen. Keine Pill-Shapes.
- **Font-Regel:** `font-extrabold` (800) ist **ausschließlich** für den Mega-Headline erlaubt. `font-semibold` (600) und `font-bold` (700) bleiben verboten. Alle anderen Headings weiterhin `font-light`.
- **SSG:** Next.js 15 statisch — kein `useLayoutEffect` ohne `"use client"` Guard.
- **framer-motion:** Bestehender Hero nutzt framer-motion für den Clip-Path-Eintritt — das bleibt erhalten, Parallax kommt on top.

## Key Decisions Made

### Decision: Scroll-Mechanic für Mega-Headline
**We will:** `useScroll` + `useTransform` von framer-motion (bereits im Stack) für Parallax auf dem Headline. Der Text ist `position: sticky` oder scroll-bound via `scrollY`, scale und translateY reagieren auf `scrollYProgress`.
**Because:** signalgrau.vercel.app macht das exakt so (React + framer-motion). Keine neue Lib nötig.
**We won't:** GSAP ScrollTrigger (würde neue Dependency bedeuten).

### Decision: Light-Section Hintergrundfarbe
**We will:** `bg-signalgray-100` (`~#e8e2d6`) für helle Sektionen. Text: `text-signalgray-800`.
**Because:** Diese Tokens sind bereits in `globals.css` definiert und explizit für "light section bg" reserviert. Kein neues CSS nötig.
**We won't:** `bg-white` oder eigene Hex-Werte — bleibt im signalgray-Ökosystem.

### Decision: Sektions-Aufteilung Hell/Dunkel
**We will:** Hero → **hell** (signalgray-100) | Terminal-Sektion (eigenständig) → **dunkel** (signalgray-800) | Problem/HowItWorks → **dunkel** (signalgray-800) | Features → **hell** (signalgray-100) | Agents/Install → **dunkel** (signalgray-800) | Footer → **dunkel**
**Because:** Terminal-Mockup braucht dunklen Hintergrund — wird in eigene Sektion direkt nach Hero ausgelagert. Der Kontrast-Wechsel macht den Style aus.
**We won't:** Terminal auf hellem Hintergrund — sieht falsch aus.

### Decision: Mega-Headline Gewicht
**We will:** `font-extrabold` (800) für den Mega-Headline — exakt wie signalgrau.vercel.app. Explizite Ausnahme von der allgemeinen Font-Regel, dokumentiert in DESIGN.md.
**Because:** Der visuelle Punch des Effekts kommt aus der Kombination von Übergröße + extremem Gewicht. `font-light` bei dieser Größe wirkt zerfasert, nicht editorial.
**We won't:** `font-light` für den Mega-Headline — falsche Wirkung.

### Decision: Custom Scroll Container
**We will:** Einen Custom-Scroll-Container implementieren — `body { overflow: hidden }`, ein `div.js-page-content` mit `overflow-y: auto; height: 100svh` als echter Scroll-Container. `useScroll({ container: scrollRef })` von framer-motion bindet alle Parallax-Effekte daran. Die Page-Transition erhält den Scroll-Container als Target für den Snapshot-Clone.
**Because:** Präzise Parallax-Kontrolle, smooth scrolling via CSS (`scroll-behavior: smooth`), und die Page-Transition funktioniert besser wenn der Scroll-Container fixiert ist — genau wie betteroff.studio und signalgrau.
**We won't:** Natürliches Browser-Scroll — zu wenig Kontrolle für die geplante Scroll-Dichte.

### Decision: Body-Hintergrundfarbe
**We will:** `body { background-color: signalgray-100 }` — die helle Signalgray-Farbe als Body-Hintergrund.
**Because:** Auf signalgrau.vercel.app hat der Body `bg-signalgray-200` — dadurch wirkt die Page-Transition natürlicher, weil der Rand der herausscrollenden Seite auf einer ähnlichen Farbe liegt statt auf absolutem Schwarz. Kein "schwarzes Loch" beim Übergang.
**We won't:** `bg-signalgray-800` als Body-Hintergrund — das war der Status quo und macht die Transition abrupt.

### Decision: Header Navigation
**We will:** `mix-blend-difference` auf dem Header wie signalgrau + betteroff.studio — der Header-Text invertiert sich automatisch je nach Hintergrund darunter.
**Because:** Damit funktioniert der Header visuell korrekt auf hellen UND dunklen Sektionen ohne JavaScript-Scroll-Tracking.
**We won't:** Den Header-Hintergrund dynamisch per JS wechseln — zu komplex und fragil.

### Decision: Viewport Reveal Animationen
**We will:** framer-motion `whileInView` + `viewport={{ once: true, margin: "-100px" }}` auf Section-Headings, Cards, und anderen Key-Elementen. Animationen: `opacity: 0 → 1`, `y: 40 → 0`, mit `EASE_ENTER` und ca. 0.7s Duration.
**Because:** Bereits im Stack. `once: true` verhindert dass Elemente re-animieren beim Rückscrollen.
**We won't:** Intersection Observer manuell — framer-motion's `whileInView` ist das sauberere Abstraktionsniveau für diesen Stack.

### Decision: Mega-Headline Sizing
**We will:** Viewport-breiter Text wie auf signalgrau — `font-size: clamp(5rem, 14vw, 16rem)` oder dynamisch berechnet dass der Text über den Viewport hinausreicht. `overflow-hidden` auf dem Container. `whitespace-nowrap`.
**Because:** Der visuelle Effekt entsteht durch die Überdimensionierung. Der Text soll nicht umbrechen.
**We won't:** Den bestehenden `clamp(3rem, 8vw, 8rem)` Hero-Headline behalten — das ist zu klein für den signalgrau-Effekt.

### Decision: Parallax Implementation
**We will:** `useScroll({ target: sectionRef })` + `useTransform(scrollYProgress, [0, 1], ["0%", "-20%"])` für einen subtilen Parallax-Offset auf dem Mega-Headline-Text.
**Because:** Subtil (−20% max) ist genug für den Premium-Effekt ohne Motion-Sickness. Stärkere Werte wirken billig.
**We won't:** `parallax` auf allen Elementen — nur auf dem Hero-Headline und ggf. einem zweiten prominenten Element.

## Open Questions

Alle offenen Fragen durch User-Entscheidungen geschlossen:
- ✅ Terminal → eigene dunkle Sektion nach Hero
- ✅ Mega-Headline → `font-extrabold` (808), explizite Ausnahme
- ✅ Custom Scroll Container → wird implementiert
- ✅ Body-Hintergrund → `signalgray-100` für bessere Page-Transition

## Success Criteria

- [ ] Hero-Headline "AI coding that compounds." ist sichtbar größer als Viewport-Breite und scrollt mit Parallax-Effekt
- [ ] Mindestens zwei helle Sektionen (signalgray-100) auf der Seite sichtbar
- [ ] Sektionswechsel von hell auf dunkel ist visuell sauber — kein abrupter Übergang
- [ ] Header mit `mix-blend-difference` funktioniert korrekt auf hellen und dunklen Sektionen (Text bleibt lesbar)
- [ ] Mindestens 4 Sektions-Elemente haben `whileInView` Reveal-Animationen
- [ ] Bestehende Page-Transition funktioniert noch
- [ ] Lighthouse Performance Score bleibt ≥ 85 (keine massive JS-Overhead durch Animationen)
- [ ] `clamp()`-basierte Schriftgrößen — keine fixen px-Werte auf Headings
- [ ] Kein `font-bold`/`font-semibold` eingeführt (es sei denn explizit für Mega-Headline entschieden)

## Risks

- **`mix-blend-difference` + signalgray-100:** Auf dem hellen Hintergrund invertiert `mix-blend-difference` das weiße Logo zu Schwarz — das ist der gewünschte Effekt, muss aber getestet werden da signalgray-100 kein reines Weiß ist.
- **Performance framer-motion scroll:** Viele `useScroll`/`useTransform` Instanzen gleichzeitig können auf Mobile zu Frame-Drops führen. Lösung: `will-change: transform` und `useReducedMotion()` Fallback.
- **SSG + `useScroll`:** framer-motion's `useScroll` benötigt `"use client"` — alle betroffenen Komponenten müssen Client-Komponenten werden. Das war bei Hero.tsx bereits der Fall.
- **Mega-Headline bricht bestehenden Clip-Path-Eintritt:** Der bestehende `clipPath: "inset(100% 0 0 0)"` Eintritt muss mit dem neuen Parallax kombiniert werden — das ist eine technische Herausforderung.
- **font-bold für Mega-Headline:** Wenn wir `font-extrabold` wie signalgrau wählen, bricht das die bestehende Designregel. Muss explizit als Ausnahme dokumentiert werden.

## Wiki References

- [[ui/design-system]] — Signalgray-100/200 Tokens bereits definiert, Text-Farbmodell, Shape-Regeln
- [[ui/easing]] — EASE_ENTER / EASE_EXIT, die einzigen erlaubten Kurven
- [[ui/component-patterns]] — Bestehende Primitives die erhalten bleiben müssen
- [[ui/page-transitions]] — Snapshot-clone Transition darf nicht gebrochen werden
- [[techstack/profile]] — framer-motion bereits im Stack, Next.js 15 SSG
