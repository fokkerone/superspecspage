# Spec: Scroll Motion & Light/Dark Section Wechsel

**Slug:** scroll-motion-style
**Status:** READY
**Date:** 2026-06-22
**Discussion:** DISCUSS.md

---

## Summary

Fundamentale visuelle Aufwertung der SuperSpecs Landing Page. Zwei Kernmechanismen:

1. **Custom Scroll Container** — `body` bekommt `overflow: hidden`, ein dedizierter `div.scroll-container` übernimmt das Scrollen. Body-Hintergrund wird `signalgray-100` für bessere Page-Transition.
2. **Mega-Headline Parallax + Light/Dark Sektionswechsel** — Hero wird hell (`signalgray-100`), Terminal in eigene dunkle Sektion, Features wieder hell, Rest dunkel. Mega-Headline in `font-extrabold` scrollt mit Parallax. Alle Key-Elemente erhalten `whileInView` Reveals.

Referenzen: signalgrau.vercel.app (Scroll-Mechanic, Mega-Headline), betteroff.studio (Sektionswechsel, Scroll-Architektur).

---

## Architecture Overview

### Scroll Container

```
body { overflow: hidden; background: signalgray-100 }
  └── ScrollContainer { overflow-y: auto; overflow-x: hidden; height: 100svh }  ← NEU, AUSSEN
       └── ThemeProvider (existing — unverändert)
            └── PageTransition (existing — vollständig unverändert)
                 └── <main> (landing page)
```

**Wichtig:** ScrollContainer steht **außen** um ThemeProvider + PageTransition. PageTransition bleibt vollständig unverändert — `liveRef.getBoundingClientRect().top` misst korrekt gegen den Viewport weil der ScrollContainer `height: 100svh` hat und `getBoundingClientRect()` immer viewport-relativ misst.

Der `scroll-container` wird als React Context (`ScrollContext`) bereitgestellt, damit alle Child-Komponenten `useScroll({ container: scrollRef })` verwenden können.

### Sektions-Sequenz

| # | Sektion | Hintergrund | Textfarbe |
|---|---------|-------------|-----------|
| 1 | Hero (Mega-Headline + Sub-Text + CTA) | `signalgray-100` | `signalgray-800` |
| 2 | Terminal | `signalgray-800` | `white` |
| 3 | Problem | `signalgray-800` | `white` |
| 4 | HowItWorks | `signalgray-800` | `white` |
| 5 | Features | `signalgray-100` | `signalgray-800` |
| 6 | Agents | `signalgray-800` | `white` |
| 7 | Install | `signalgray-800` | `white` |
| 8 | Footer | `signalgray-800` | `white` |

### Header

`mix-blend-difference` auf dem gesamten `<header>` — Logo und Nav-Links sind `text-white`, invertieren sich über hellen Sektionen zu Dunkel automatisch. Kein `backdrop-blur`, kein `bg-*` auf dem Header.

---

## Task 1 — Custom Scroll Container

**File:** `components/scroll-container.tsx` (neu)
**File:** `app/layout.tsx` (update)
**File:** `app/globals.css` (update body)

### 1.1 ScrollContext

```tsx
// components/scroll-container.tsx
"use client";
import { createContext, useContext, useRef, type RefObject } from "react";

export const ScrollContext = createContext<RefObject<HTMLDivElement | null>>({
  current: null,
});

export function useScrollContainer() {
  return useContext(ScrollContext);
}

export function ScrollContainer({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <ScrollContext.Provider value={ref}>
      <div
        ref={ref}
        className="scroll-container"
        style={{
          overflowY: "auto",
          overflowX: "hidden",
          height: "100svh",
          overscrollBehavior: "none",
        }}
      >
        {children}
      </div>
    </ScrollContext.Provider>
  );
}
```

### 1.2 Layout Integration

`app/layout.tsx` — `ScrollContainer` wraps **außen** um ThemeProvider + PageTransition:

```tsx
// ScrollContainer ist der äußerste Client-Wrapper im body
<ScrollContainer>
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
    <PageTransition>{children}</PageTransition>
  </ThemeProvider>
</ScrollContainer>
```

**PageTransition bleibt vollständig unverändert.** `liveRef.getBoundingClientRect().top` misst korrekt weil der ScrollContainer dieselbe Höhe wie der Viewport hat (`100svh`) und `getBoundingClientRect()` immer viewport-relativ misst — inklusive des Scroll-Offsets im Container.

### 1.3 Body Background

`app/globals.css` — body Hintergrundfarbe:

```css
html, body {
  background-color: var(--signalgray-100);
  overflow: hidden;
}
```

Das bewirkt: Beim Page-Transition-Effekt (Seite scrollt raus) sieht man den signalgray-100 Body-Hintergrund — kein schwarzes Loch.

### 1.4 Acceptance Criteria

- GIVEN User scrollt die Seite WHEN ScrollContainer gemountet ist THEN scrollt `div.scroll-container` (nicht `window`)
- GIVEN `window.scrollY` THEN ist immer `0` — Scroll passiert im Container
- GIVEN Page Transition THEN funktioniert weiterhin korrekt (Snapshot-Clone, scale+translateY)
- GIVEN Body THEN `background-color` ist `signalgray-100` (~`#e8e2d6`)

---

## Task 2 — Header: mix-blend-difference

**File:** `components/landing/header.tsx`

### 2.1 Änderungen

```tsx
// VORHER:
<header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-signalgray-800/80 backdrop-blur-md">

// NACHHER:
<header className="fixed top-0 left-0 right-0 z-50 mix-blend-difference pointer-events-none">
  <div className="pointer-events-auto ...">
    {/* content */}
  </div>
</header>
```

- Entfernen: `border-b border-white/10`, `bg-signalgray-800/80`, `backdrop-blur-md`
- Hinzufügen: `mix-blend-difference`
- Logo-Text und Nav-Links: `text-white` (die Inversion durch `mix-blend-difference` macht den Rest)
- `pointer-events-none` auf `<header>`, `pointer-events-auto` auf dem inneren Container — damit der Header die darunter liegenden Scroll-Events nicht blockiert

### 2.2 Acceptance Criteria

- GIVEN Header über `signalgray-100` (hell) THEN Logo/Nav erscheinen dunkel (invertiert via blend)
- GIVEN Header über `signalgray-800` (dunkel) THEN Logo/Nav erscheinen hell
- GIVEN Click auf Nav-Link THEN funktioniert (pointer-events korrekt)
- GIVEN kein `backdrop-blur` THEN kein visueller Blur-Artefakt beim Übergang zwischen Sektionen

---

## Task 3 — Hero: Mega-Headline + Parallax

**File:** `components/landing/hero.tsx`

### 3.1 Layout-Struktur

Der Hero wird neu strukturiert. Er enthält **nur** Eyebrow, Mega-Headline, Sub-Text und CTAs — kein Terminal mehr.

Layout: `justify-between` — Eyebrow oben (betteroff-Style), Headline + CTA unten. Viel Luft in der Mitte.

```tsx
// Hintergrund: signalgray-100, Textfarbe: signalgray-800
<section
  ref={sectionRef}
  className="bg-signalgray-100 min-h-screen flex flex-col justify-between overflow-hidden"
>
  {/* Eyebrow — oben, unter dem fixen Header */}
  <div className="px-6 md:px-8 pt-20 md:pt-24">
    <p className="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-signalgray-800/50">
      Works with Claude Code · Cursor · OpenCode · Copilot · Codex · Gemini CLI
    </p>
  </div>

  {/* Unterer Block — Mega-Headline + Sub-Text + CTA */}
  <div className="pb-16 md:pb-24">
    {/* Mega-Headline — Viewport-überbreit, Parallax */}
    <div className="overflow-hidden mb-6">
      <motion.div
        initial={shouldAnimate ? { clipPath: "inset(100% 0 0 0)" } : false}
        animate={{ clipPath: "inset(0% 0 0 0)" }}
        transition={{ duration: 1.25, ease: EASE_ENTER_TUPLE }}
      >
        <motion.h1
          style={{
            y: headlineY,
            fontSize: "clamp(5rem, 15vw, 18rem)",
            letterSpacing: "-0.03em",
            lineHeight: 0.95,
            willChange: "transform",
          }}
          className="font-extrabold text-signalgray-800 whitespace-nowrap leading-none px-6 md:px-8"
        >
          AI coding that compounds.
        </motion.h1>
      </motion.div>
    </div>

    {/* Sub-Text + CTA */}
    <div className="px-6 md:px-8 max-w-5xl">
      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3, ease: EASE_ENTER_TUPLE }}
        className="text-[1.0625rem] leading-[1.65] text-signalgray-800/70 max-w-2xl mb-10"
      >
        Spec-driven planning. Parallel TDD execution.{" "}
        <span className="text-signalgray-800/90">A wiki that never forgets.</span>
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.45, ease: EASE_ENTER_TUPLE }}
        className="flex flex-col sm:flex-row items-start gap-4"
      >
        {/* CTA buttons — same content as before, dark text variants */}
      </motion.div>
    </div>
  </div>
</section>
```

### 3.2 Parallax Mechanik

```tsx
"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useScrollContainer } from "@/components/scroll-container";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainer = useScrollContainer();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    container: scrollContainer,
    offset: ["start start", "end start"],
  });

  // Headline bewegt sich nach oben während User durch Hero scrollt
  const headlineY = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);

  // Bestehender Clip-Path Entry-Effekt bleibt erhalten:
  // clipPath: "inset(100% 0 0 0)" → "inset(0% 0 0 0)"
  // wird auf dem h1 als initial/animate beibehalten
}
```

### 3.3 Entry-Animation (bestehend, erhalten)

Der bestehende `shouldAnimate`-Check und der `clipPath` Eintritt bleibt. Er wird auf ein `<motion.div>` gewrapped das den Headline-Container umschließt:

```tsx
<motion.div
  initial={shouldAnimate ? { clipPath: "inset(100% 0 0 0)" } : false}
  animate={{ clipPath: "inset(0% 0 0 0)" }}
  transition={{ duration: 1.25, ease: EASE_ENTER_TUPLE }}
>
  <motion.h1 style={{ y: headlineY }}>
    AI coding that compounds.
  </motion.h1>
</motion.div>
```

### 3.4 Eyebrow-Label

Das `font-mono` Eyebrow ("Works with Claude Code · ...") bleibt erhalten, bekommt aber `text-signalgray-800/50` statt `text-white/50`.

### 3.5 Acceptance Criteria

- GIVEN Hero THEN Hintergrund ist `signalgray-100`
- GIVEN Headline THEN `font-extrabold`, `font-size` via `clamp(5rem, 15vw, 18rem)`, `whitespace-nowrap`
- GIVEN Headline THEN breiter als Viewport (Overflow nach rechts sichtbar oder `overflow-hidden` Container)
- GIVEN User scrollt durch Hero THEN Headline bewegt sich mit `translateY` Parallax (ca. −25% bei vollständigem Scroll-Through)
- GIVEN Seiten-Erstlad (kein Referrer) THEN Clip-Path Entry-Animation spielt
- GIVEN kein Terminal-Mockup THEN keiner im Hero vorhanden
- GIVEN Textfarben THEN alle `text-signalgray-800` Varianten, kein `text-white`

---

## Task 4 — Terminal Section (neue Sektion)

**File:** `components/landing/terminal.tsx` (neu, extrahiert aus hero.tsx)

### 4.1 Struktur

Der Terminal-Mockup aus `hero.tsx` wird in eine eigene Sektion ausgelagert:

```tsx
export function Terminal() {
  return (
    <section className="bg-signalgray-800 py-24 md:py-32 px-6 md:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: EASE_ENTER_TUPLE }}
        >
          {/* Exakt der bestehende Terminal-Mockup JSX aus hero.tsx */}
        </motion.div>
      </div>
    </section>
  );
}
```

### 4.2 Acceptance Criteria

- GIVEN Terminal-Sektion THEN `bg-signalgray-800`
- GIVEN Terminal-Mockup THEN exakt selber Content wie bisher (keine inhaltlichen Änderungen)
- GIVEN Viewport-Entry THEN `whileInView` fade+slide-up Animation

---

## Task 5 — Problem, HowItWorks: whileInView Reveals

**File:** `components/landing/problem.tsx`
**File:** `components/landing/how-it-works.tsx`

### 5.1 Problem Section

Hintergrund bleibt `signalgray-800`. Alle `text-white/*` Klassen bleiben unverändert.

Neue Animationen:
- Section-Heading `<h2>`: `whileInView={{ opacity: 1, y: 0 }}` von `{ opacity: 0, y: 40 }`
- Body-Text `<p>`: gleiches Pattern, `delay: 0.15`

```tsx
<motion.h2
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.7, ease: EASE_ENTER_TUPLE }}
>
```

### 5.2 HowItWorks Section

Hintergrund bleibt `signalgray-800`.

Jede Phase-Karte (`number`, `label`, `description`) erhält `whileInView` mit gestaffeltem `delay`:

```tsx
phases.map((phase, i) => (
  <motion.div
    key={phase.number}
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.7, delay: i * 0.1, ease: EASE_ENTER_TUPLE }}
  >
```

### 5.3 Acceptance Criteria

- GIVEN Problem-Heading THEN animiert beim Viewport-Entry
- GIVEN HowItWorks-Phasen THEN jede Karte animiert mit gestaffeltem Delay
- GIVEN `viewport={{ once: true }}` THEN Animationen spielen nur einmal (nicht beim Rückscrollen)

---

## Task 6 — Features: Light Section + Reveals

**File:** `components/landing/features.tsx`

### 6.1 Hintergrundwechsel

```tsx
// VORHER:
<section className="py-24 md:py-40 px-5 md:px-10 border-t border-white/10">

// NACHHER:
<section className="bg-signalgray-100 py-24 md:py-40 px-6 md:px-8">
```

**Opacity-Mapping für hellen Hintergrund (AA-konform):**

Die Design-System Opacity-Tiers wurden für dunkle Hintergründe kalibriert. Direkte 1:1-Übersetzung ist **nicht** korrekt — `/60` und `/50` auf `signalgray-100` unterschreiten AA (3.5:1). Korrigierte Werte:

| Vorher (dunkel) | Nachher (hell) | Kontrast auf signalgray-100 |
|--------|---------|------|
| `text-white` (Heading) | `text-signalgray-800` | ~11:1 AAA ✅ |
| `text-white/80` | `text-signalgray-800` | ~11:1 AAA ✅ |
| `text-white/70` (Body) | `text-signalgray-800/90` | ~9:1 AAA ✅ |
| `text-white/60` (Muted) | `text-signalgray-800/70` | ~6:1 AA ✅ |
| `text-white/50` (Labels) | `text-signalgray-800/70` | ~6:1 AA ✅ |
| `text-white/40` (Deko) | `text-signalgray-800/50` | ~4.5:1 AA ✅ |
| `border-white/10` | `border-signalgray-800/10` | — (strukturell) |
| `bg-signalgray-800` (card bg) | `bg-signalgray-200` | — |
| `bg-signalgray-900` (card hover) | `bg-signalgray-300/20` | — |

**Regel:** Auf `signalgray-100` ist `/70` das Minimum für lesbaren Body-Text. Alles darunter ist dekorativ.

### 6.2 Card Grid Reveal

Jede Feature-Card erhält `whileInView`:

```tsx
<motion.div
  initial={{ opacity: 0, y: 32 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-60px" }}
  transition={{ duration: 0.6, delay: i * 0.08, ease: EASE_ENTER_TUPLE }}
>
```

### 6.3 Acceptance Criteria

- GIVEN Features-Sektion THEN `bg-signalgray-100` Hintergrund
- GIVEN Feature-Cards THEN dunkle Textfarben (nicht `text-white`)
- GIVEN Feature-Cards THEN animieren gestaffelt beim Viewport-Entry
- GIVEN Card-Grid-Trennlinien THEN `border-signalgray-800/10` (gleiche optische Wirkung wie `border-white/10` auf dunklem Bg)

---

## Task 7 — Agents, Install: whileInView Reveals

**File:** `components/landing/agents.tsx`
**File:** `components/landing/install.tsx`

Beide Sektionen: Hintergrund bleibt `signalgray-800`. Nur `whileInView` Animationen werden hinzugefügt.

### 7.1 Pattern (identisch für beide)

Section-Heading + primäre Content-Blöcke:

```tsx
<motion.h2
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.7, ease: EASE_ENTER_TUPLE }}
>
```

### 7.2 Acceptance Criteria

- GIVEN Agents-Heading THEN fade+slide-up beim Viewport-Entry
- GIVEN Install-Heading + CTA THEN fade+slide-up beim Viewport-Entry

---

## Task 8 — page.tsx Update

**File:** `app/page.tsx`

### 8.1 Neue Sektion-Reihenfolge

```tsx
import { Terminal } from "@/components/landing/terminal";

export default function Home() {
  return (
    <main>  {/* kein bg-* auf main — Sektionen tragen ihre eigenen Hintergründe */}
      <Header />
      <Hero />         {/* bg-signalgray-100 */}
      <Terminal />     {/* bg-signalgray-800 — NEU */}
      <Problem />      {/* bg-signalgray-800 */}
      <HowItWorks />   {/* bg-signalgray-800 */}
      <Features />     {/* bg-signalgray-100 */}
      <Agents />       {/* bg-signalgray-800 */}
      <Install />      {/* bg-signalgray-800 */}
      <Footer />       {/* bg-signalgray-800 */}
    </main>
  );
}
```

`min-h-screen bg-signalgray-800 text-white` wird von `<main>` entfernt — Hintergrundfarben kommen aus den Sektionen.

### 8.2 Acceptance Criteria

- GIVEN Seite lädt THEN kein `bg-signalgray-800` auf `<main>`
- GIVEN Terminal-Import THEN korrekt aus `@/components/landing/terminal`
- GIVEN Sektions-Reihenfolge THEN Hero → Terminal → Problem → HowItWorks → Features → Agents → Install → Footer

---

## Task 9 — DESIGN.md Update

**File:** `DESIGN.md`

Zwei Ergänzungen:

1. `font-extrabold` (800) als explizite Ausnahme für Mega-Headline dokumentieren
2. Body-Hintergrund (`signalgray-100`) dokumentieren
3. Custom Scroll Container Architektur dokumentieren

---

## Non-Functional Requirements

### Performance

- Jede `"use client"` Komponente mit `useScroll`/`useTransform` implementiert `useReducedMotion()` Fallback:

```tsx
import { useReducedMotion } from "framer-motion";

const prefersReduced = useReducedMotion();
const headlineY = useTransform(
  scrollYProgress,
  [0, 1],
  prefersReduced ? ["0%", "0%"] : ["0%", "-25%"]
);
```

- `will-change: transform` auf dem Mega-Headline `<motion.h1>` via inline style
- `whileInView` mit `once: true` auf allen Reveal-Animationen — keine Re-Trigger beim Rückscrollen

### Accessibility

- `prefers-reduced-motion`: Alle Parallax- und Reveal-Animationen haben Null-Fallback
- Sektions-Hintergrundwechsel darf keine Kontrast-Unterschreitung verursachen:
  - `text-signalgray-800` auf `bg-signalgray-100` → ausreichend Kontrast (dunkler Text auf hell-warmem Grund)

### Browser Support

- `oklch()` — alle modernen Browser (2023+), akzeptierter Trade-off (dokumentiert in design-system wiki)
- `100svh` — alle modernen Browser, Fallback auf `100vh` wenn nötig

---

## Files Created / Modified

| Datei | Aktion |
|-------|--------|
| `components/scroll-container.tsx` | **NEU** |
| `components/landing/terminal.tsx` | **NEU** (extrahiert aus hero.tsx) |
| `app/layout.tsx` | Update: ScrollContainer einbinden |
| `app/globals.css` | Update: body overflow:hidden, bg signalgray-100 |
| `app/page.tsx` | Update: Terminal-Sektion, main ohne bg |
| `components/landing/header.tsx` | Update: mix-blend-difference |
| `components/landing/hero.tsx` | Update: Mega-Headline, light bg, Parallax, Terminal entfernen |
| `components/landing/problem.tsx` | Update: whileInView Reveals |
| `components/landing/how-it-works.tsx` | Update: whileInView Reveals |
| `components/landing/features.tsx` | Update: light bg, dark text, Reveals |
| `components/landing/agents.tsx` | Update: whileInView Reveals |
| `components/landing/install.tsx` | Update: whileInView Reveals |
| `DESIGN.md` | Update: Ausnahmen + Scroll-Container dokumentieren |

---

## Implementation Order

1. Task 1 (Scroll Container + body bg) — Fundament, alles andere baut darauf
2. Task 2 (Header mix-blend) — isoliert, kein Risk
3. Task 8 (page.tsx Struktur) — Terminal-Sektion anlegen
4. Task 4 (Terminal Sektion) — Extraktion aus Hero
5. Task 3 (Hero Mega-Headline) — größte Komplexität
6. Task 5 (Problem + HowItWorks Reveals)
7. Task 6 (Features Light)
8. Task 7 (Agents + Install Reveals)
9. Task 9 (DESIGN.md)

---

## Risk Mitigations

| Risk | Mitigation |
|------|------------|
| PageTransition bricht durch ScrollContainer | ScrollContainer als Kind von PageTransition — der Clone-Mechanismus klont den gesamten Container |
| mix-blend-difference auf signalgray-100 nicht ideal | signalgray-100 ist warm-hell, nicht reines Weiß — Inversion erzeugt warm-dunklen Ton, akzeptabel. Testen mit echtem Browser. |
| Parallax + Clip-Path Entry kombinieren | Clip-Path auf äußerem `motion.div`, Parallax auf innerem `motion.h1` — kein Konflikt |
| useScroll ohne container-Ref | Alle `useScroll` Calls erhalten `container: scrollContainerRef` via Context |
| Signalgray-800 Textopazitäten auf signalgray-100 | `text-signalgray-800/60` etc. funktionieren nur wenn `--color-signalgray-800` in `@theme inline` exponiert ist — bereits in globals.css vorhanden |
