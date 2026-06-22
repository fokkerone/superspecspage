# Tasks: Scroll Motion & Light/Dark Section Wechsel

**Spec:** superspec/specs/scroll-motion-style/spec.md
**Slug:** scroll-motion-style

---

## Wave 1 — Foundation (sequential)

Wave 1 muss vollständig abgeschlossen sein bevor Wave 2 beginnt.
Alle Wave-2 Komponenten importieren `useScrollContainer` — der Context muss existieren.

### Task 1.1 — ScrollContainer Component
**File:** `components/scroll-container.tsx` (neu)
**Done when:**
- `ScrollContext`, `useScrollContainer`, `ScrollContainer` exportiert
- `overflowY: auto`, `overflowX: hidden`, `height: 100svh`, `overscrollBehavior: none`
- TypeScript strict, kein Lint-Fehler

### Task 1.2 — Layout Integration + Body Background
**File:** `app/layout.tsx`
**File:** `app/globals.css`
**Depends on:** Task 1.1
**Done when:**
- `ScrollContainer` außen um `ThemeProvider` + `PageTransition` in layout.tsx
- `body { overflow: hidden; background-color: var(--signalgray-100); }`
- `html { overflow: hidden; }`
- Build erfolgreich, keine TypeScript-Fehler

### Task 1.3 — Header: mix-blend-difference
**File:** `components/landing/header.tsx`
**Done when:**
- `mix-blend-difference` auf `<header>`
- `border-b`, `bg-signalgray-800/80`, `backdrop-blur-md` entfernt
- `pointer-events-none` auf `<header>`, `pointer-events-auto` auf innerem Container
- Alle Nav-Links `text-white`
- Kein TypeScript-Fehler

---

## Wave 2 — Page Structure + Hero (sequential)

### Task 2.1 — page.tsx Umbau
**File:** `app/page.tsx`
**Depends on:** Wave 1 complete
**Done when:**
- `Terminal` importiert aus `@/components/landing/terminal`
- `<main>` ohne `bg-signalgray-800 text-white min-h-screen`
- Reihenfolge: Header → Hero → Terminal → Problem → HowItWorks → Features → Agents → Install → Footer
- Build erfolgreich

### Task 2.2 — Terminal Section (Extraktion)
**File:** `components/landing/terminal.tsx` (neu)
**File:** `components/landing/hero.tsx` (Terminal-Block entfernen)
**Depends on:** Wave 1 complete
**Done when:**
- Terminal-Mockup JSX vollständig aus hero.tsx in terminal.tsx verschoben (kein Inhalt geändert)
- `bg-signalgray-800 py-24 md:py-32 px-6 md:px-8` auf Section
- `whileInView={{ opacity: 1, y: 0 }}` von `{ opacity: 0, y: 40 }`, `once: true`, `margin: "-100px"`, `duration: 0.7`, `EASE_ENTER_TUPLE`
- `"use client"` vorhanden
- hero.tsx enthält keinen Terminal-Mockup mehr

### Task 2.3 — Hero: Mega-Headline + Parallax
**File:** `components/landing/hero.tsx`
**Depends on:** Task 1.1 (useScrollContainer), Task 2.2 (Terminal entfernt)
**Done when:**
- `bg-signalgray-100`, `min-h-screen`, `flex flex-col justify-between`, `overflow-hidden` auf `<section>`
- Eyebrow oben: `pt-20 md:pt-24`, `text-signalgray-800/50`
- Mega-Headline: `font-extrabold`, `clamp(5rem, 15vw, 18rem)`, `whitespace-nowrap`, `letterSpacing: "-0.03em"`, `lineHeight: 0.95`
- Parallax: `useScroll({ target: sectionRef, container: scrollContainerRef, offset: ["start start", "end start"] })`, `useTransform([0,1], ["0%", "-25%"])`
- `useReducedMotion()` Fallback: Parallax deaktiviert bei `prefers-reduced-motion`
- `willChange: "transform"` auf `motion.h1`
- Bestehender Clip-Path Entry-Effekt (`shouldAnimate`, `clipPath inset`) erhalten
- Sub-Text: `text-signalgray-800/70`
- CTA-Buttons: dark text variants (`text-signalgray-800`, `border-signalgray-800/15`)
- Kein Terminal-Mockup
- Kein `text-white` in der Komponente

---

## Wave 3 — Section Reveals (parallel)

Wave 3 Tasks können parallel ausgeführt werden — sie haben keine gegenseitigen Abhängigkeiten.

### Task 3.1 — Problem: whileInView Reveals
**File:** `components/landing/problem.tsx`
**Done when:**
- `<motion.h2>`: `initial={{ opacity: 0, y: 40 }}`, `whileInView={{ opacity: 1, y: 0 }}`, `once: true`, `margin: "-100px"`, `duration: 0.7`, `EASE_ENTER_TUPLE`
- `<motion.p>` Body-Text: gleiches Pattern, `delay: 0.15`
- Hintergrund `signalgray-800`, Textfarben `text-white/*` unverändert
- `"use client"` vorhanden

### Task 3.2 — HowItWorks: whileInView Reveals
**File:** `components/landing/how-it-works.tsx`
**Done when:**
- Jede Phase-Karte: `initial={{ opacity: 0, y: 40 }}`, `whileInView={{ opacity: 1, y: 0 }}`, `once: true`, `margin: "-80px"`, `duration: 0.7`, `delay: i * 0.1`, `EASE_ENTER_TUPLE`
- Section-Heading ebenfalls animiert
- Hintergrund `signalgray-800` unverändert
- `"use client"` vorhanden

### Task 3.3 — Features: Light Section + Reveals
**File:** `components/landing/features.tsx`
**Done when:**
- `bg-signalgray-100` auf Section
- Alle `text-white/*` ersetzt gemäß korrigierter Mapping-Tabelle (min. `/70` für Body-Text)
- `border-white/10` → `border-signalgray-800/10`
- Card-BG: `bg-signalgray-200`, Card-Hover: `bg-signalgray-300/20`
- Jede Feature-Card: `whileInView`, gestaffelt mit `delay: i * 0.08`, `duration: 0.6`
- Section-Heading animiert
- `"use client"` vorhanden

### Task 3.4 — Agents: whileInView Reveals
**File:** `components/landing/agents.tsx`
**Done when:**
- Section-Heading: `whileInView={{ opacity: 1, y: 0 }}` von `{ opacity: 0, y: 40 }`, `once: true`, `duration: 0.7`, `EASE_ENTER_TUPLE`
- Agent-Tags-Grid: `whileInView`, `delay: 0.15`
- Hintergrund `signalgray-800` unverändert
- `"use client"` vorhanden

### Task 3.5 — Install: whileInView Reveals
**File:** `components/landing/install.tsx`
**Done when:**
- Section-Heading + Sub-Text + CTA-Block: `whileInView={{ opacity: 1, y: 0 }}` von `{ opacity: 0, y: 40 }`, gestaffelt (`delay: 0`, `0.15`, `0.3`)
- Hintergrund `signalgray-800` unverändert
- `"use client"` vorhanden

---

## Wave 4 — Cleanup (sequential)

### Task 4.1 — DESIGN.md Update
**File:** `DESIGN.md`
**Done when:**
- `font-extrabold` (800) als explizite Ausnahme für Mega-Headline dokumentiert
- Body-Hintergrund `signalgray-100` dokumentiert
- Custom Scroll Container Architektur (Option B) dokumentiert
- Hell-Hintergrund Opacity-Regel dokumentiert: `/70` Minimum für lesbaren Text auf `signalgray-100`

---

## Easing Import Reminder

Alle `"use client"` Komponenten mit framer-motion verwenden:
```tsx
import { EASE_ENTER_TUPLE } from "@/lib/easing";
// framer-motion transition:
transition={{ duration: 0.7, ease: EASE_ENTER_TUPLE }}
```

Nie inline Easing-Literals. Nie `EASE_ENTER` (String-Form) in framer-motion Props.

---

## Done Criteria (gesamter Spec)

- [ ] `window.scrollY` ist immer `0` — Scroll passiert im Container
- [ ] Body `background-color` ist `signalgray-100`
- [ ] Hero: `bg-signalgray-100`, Eyebrow oben, Headline unten, `font-extrabold`
- [ ] Hero Mega-Headline: Parallax spielt beim Scrollen
- [ ] Hero Mega-Headline: Clip-Path Entry-Animation spielt beim Erstlad
- [ ] Terminal: eigene `bg-signalgray-800` Sektion, `whileInView` Reveal
- [ ] Features: `bg-signalgray-100`, AA-konforme Textfarben
- [ ] Mindestens 8 Elemente haben `whileInView` Animationen
- [ ] Header: `mix-blend-difference`, kein `backdrop-blur`, kein `bg-*`
- [ ] PageTransition: unverändert, funktioniert korrekt
- [ ] `biome check` ohne Fehler
- [ ] `tsc --noEmit` ohne Fehler
- [ ] `next build` erfolgreich
