# DESIGN.md — SuperSpecs Homepage

> Machine-readable design system blueprint for AI coding and design agents.
> Reference adopted: `signalgrau` (local archive at `~/Downloads/signalgrau-main`).
> Inspirational: betteroff.studio, richardekwonye.com (typography direction only — palette and motion come from signalgrau).
> Last updated: 2026-06-22 (scroll-motion-style spec)

---

## 1. Brand Identity

**Product:** SuperSpecs — a spec-driven AI development framework.
**Aesthetic:** Editorial dark studio. Warm grey backgrounds via the `signalgray` oklch palette. White text with opacity tiers — no warm-off-white hex tokens. No color accents — pure greyscale hierarchy. Premium, deliberate, unhurried.
**Reference:** signalgrau (verbatim palette + transition mechanic). Editorial typography direction inspired by betteroff.studio + richardekwonye.com.
**Feeling:** The site should feel like the tool it documents — precise, architectural, nothing wasted.

---

## 2. Color Palette

All colors are defined as Tailwind v4 CSS custom properties in `app/globals.css`, declared in oklch.

### Signalgray Scale

| Token | oklch | Approximate hex | Usage |
|---|---|---|---|
| `--signalgray-100` | `oklch(0.9074 0.0087 84.57)` | ~`#e8e2d6` | **Body background + Hero + Features section bg** |
| `--signalgray-200` | `oklch(0.8593 0.0122 79.78)` | ~`#d6cebd` | Feature card backgrounds (light sections) |
| `--signalgray-300` | `oklch(0.5109 0.002 67.78)` | ~`#7e7c77` | Reserved — mid grey for future use |
| `--signalgray-700` | `oklch(0.3985 0.0021 67.76)` | ~`#5e5d59` | Reserved — dark mid grey for future use |
| `--signalgray-800` | `oklch(0.2565 0.004 84.58)` | ~`#383530` | **Primary page background — landing + docs** |
| `--signalgray-900` | `oklch(0.1539 0.0021 106.64)` | ~`#1f1d19` | Inset panels, surface depth, terminal mockup bg |

These tokens are exposed to Tailwind v4 via `@theme inline` as `--color-signalgray-{100..900}`. Use `bg-signalgray-800`, `bg-signalgray-900`, etc.

### Text Colors

All text on dark backgrounds is `text-white` with opacity tiers. No warm-off-white hex tokens.

| Use | Tailwind class | Contrast on `signalgray-800` |
|---|---|---|
| Primary text (body, headings) | `text-white` | 11.7:1 — AAA |
| Strong emphasis | `text-white` (already max) | — |
| Body secondary | `text-white/80` | 9.0:1 — AAA |
| Body muted | `text-white/70` | 7.6:1 — AAA |
| Captions, labels | `text-white/60` | 6.3:1 — AAA |
| Secondary readable | `text-white/50` | 5.1:1 — AA |
| **Floor for readable text** | `text-white/50` | — |
| Decorative metadata only | `text-white/40` | 3.8:1 — fails AA, decorative only |
| Subtle decorative | `text-white/30` | 2.7:1 — decorative only |

### No Accent Color

There is **no accent color** on this site. Signalgrau's `--brand` orange (`oklch(0.686 0.210 41)`) is **NOT** adopted. All hierarchy is achieved through:
- Opacity variation on `text-white`
- Font weight contrast (300 / 400 / 500)
- Spatial rhythm (whitespace)
- Underline motion on hover

**Do not** introduce colored text, colored borders, colored backgrounds, or colored icons anywhere on landing or docs routes.

### Borders

| Use | Tailwind class |
|---|---|
| Default dividers, subtle borders | `border-white/10` |
| Card borders, structural divisions | `border-white/15` |
| Hover-state borders | `border-white/25` |

### Code Blocks (Syntax Highlighting)

Syntax highlighting uses only white opacity tiers — no colored tokens.

| Token type | Color |
|---|---|
| Default / identifier | `text-white` |
| Keyword | `text-white` (weight 500) |
| String | `text-white/70` |
| Comment | `text-white/40` |
| Punctuation | `text-white/60` |
| Number / constant | `text-white/80` |

---

## 3. Typography

### Typefaces

| Role | Font | Fallback Stack | Source |
|---|---|---|---|
| Display / Body | **Geist Sans** | `-apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif` | `next/font/google` |
| Monospace | **Geist Mono** | `"Courier New", monospace` | `next/font/google` |

**Why Geist Sans:** Already loaded by the Next.js template. The signalgrau reference also uses Geist Sans. While betteroff.studio and richardekwonye.com use PP Neue Montreal (humanist grotesque) and DM Sans was considered as a free alternative, the cost/benefit of swapping fonts didn't justify the migration. Geist Sans at appropriate weights and sizes carries the editorial direction adequately.

### Loading (Next.js)

```tsx
// app/layout.tsx (existing — DO NOT change)
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
```

The `--font-sans` token in `globals.css` `@theme inline` MUST be explicitly bound to `var(--font-geist-sans)` so the `html { @apply font-sans }` rule resolves correctly.

### Type Scale

All sizes are fluid using `clamp()`. Do not use fixed `text-*` Tailwind classes for headings.

| Role | CSS Value | Tailwind Equivalent |
|---|---|---|
| **Display** (hero) | `clamp(3rem, 8vw, 8rem)` | custom via style prop |
| **H1** | `clamp(2.5rem, 6vw, 6rem)` | custom |
| **H2** | `clamp(1.75rem, 3.5vw, 3rem)` | custom |
| **H3** | `clamp(1.25rem, 2vw, 1.75rem)` | custom |
| **Body large** | `1.25rem` (20px) | `text-xl` |
| **Body** | `1.0625rem` (17px) | `text-[1.0625rem]` |
| **Small / label** | `0.8125rem` (13px) | `text-[0.8125rem]` |
| **Mono / code** | `0.875rem` (14px) | `text-sm` (font-mono) |

### Font Weights

| Weight | Usage |
|---|---|
| `300` (font-light) | Large display headings where lightness creates elegance |
| `400` (font-normal) | Body text default |
| `500` (font-medium) | Labels, UI text, secondary headings, emphasized inline content |

**Do not use** `font-semibold` (600) or `font-bold` (700). Weight hierarchy is achieved within the 300–500 range.

### Line Heights

| Context | Value |
|---|---|
| Display / H1 | `1.0` – `1.05` |
| H2 / H3 | `1.1` – `1.15` |
| Body copy | `1.65` |
| Labels / UI text | `1.2` |
| Code blocks | `1.7` |

### Letter Spacing

| Context | Value |
|---|---|
| Display / H1 | `-0.03em` (tight) |
| H2 | `-0.02em` |
| Body | `0` (normal) |
| Uppercase labels | `0.08em` – `0.12em` |
| Monospace labels | `0` |

### Text Rendering

```css
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-feature-settings: "kern" 1, "liga" 1, "calt" 1;
}
```

---

## 4. Spacing & Layout

### Page Grid

- **Max content width:** `1120px` (`max-w-5xl` or custom `max-w-[70rem]`)
- **Horizontal padding:** `px-5` mobile → `px-10` desktop (`20px` → `40px`)
- **Column grid:** not used explicitly — sections are full-width with internal max-width containers

### Section Vertical Rhythm

| Context | Mobile | Desktop |
|---|---|---|
| Section padding (standard) | `py-24` (`96px`) | `py-40` (`160px`) |
| Section padding (large) | `py-32` (`128px`) | `py-56` (`224px`) |
| Section padding (small) | `py-16` (`64px`) | `py-24` (`96px`) |
| Hero padding-top | `pt-40` (`160px`) | `pt-48` (`192px`) |
| Hero padding-bottom | `pb-32` (`128px`) | `pb-40` (`160px`) |

### Spacing Scale (Custom Tokens)

Use Tailwind's default spacing scale for component-level spacing. Prefer multiples of 4px.

| Use | Value |
|---|---|
| Between label and heading | `1rem` (`4`) |
| Between heading and body | `1.5rem` (`6`) |
| Between body and CTA | `2.5rem` (`10`) |
| Between list items | `1rem` (`4`) |
| Between cards in a grid | `1px` (border via `gap-px` on `bg-white/10`) |
| Between sections (internal gap) | `4rem` – `6rem` |

### Dividers

Sections are separated by `border-t border-white/10`. Decorative, not structural.

```tsx
<section className="border-t border-white/10">
```

---

## 5. Border Radius & Shape

The design language is **geometric and flat**. Rounded shapes signal cheapness against the editorial reference aesthetic.

| Element | Border Radius |
|---|---|
| Cards / panels | `rounded-none` (0) or `rounded-sm` (2px) maximum |
| Code blocks / terminal mockups | `rounded-lg` (8px) — exception: code needs softening |
| Inline labels / badges | `rounded-sm` (2px) |
| Buttons (text-based) | `rounded-none` — no pill shapes |
| Image containers | `rounded-none` |
| **Terminal window dots (decorative)** | `rounded-full` — **explicit exception** for the three macOS-style dots in terminal mockups |

**Remove all `rounded-full` pill buttons.** CTA buttons become underlined text links or minimal-border rectangular elements. The only permissible `rounded-full` usage is the trio of decorative dots in terminal mockups (`w-2.5 h-2.5 rounded-full bg-white/10`).

---

## 6. Motion & Animation

### Two-Curve Easing System

The site uses **two named easing curves**, derived from signalgrau:

```css
/* In @theme inline {} — for CSS consumers */
--ease-enter: cubic-bezier(0.6, 0, 0.24, 1);
--ease-exit:  cubic-bezier(0.82, 1, 0.36, 1);
```

**Canonical source of truth:** `lib/easing.ts` exports both as TS constants in two forms (string + tuple).

```ts
// lib/easing.ts
export const EASE_ENTER = "cubic-bezier(0.6, 0, 0.24, 1)" as const;
export const EASE_EXIT  = "cubic-bezier(0.82, 1, 0.36, 1)" as const;
export const EASE_ENTER_TUPLE = [0.6, 0, 0.24, 1] as const;
export const EASE_EXIT_TUPLE  = [0.82, 1, 0.36, 1] as const;
export const TRANSITION_DURATION = 1450;
```

| Curve | Used for |
|---|---|
| `--ease-enter` (`EASE_ENTER`) | Hover underlines, clip-path text reveals, page-transition **enter** animation |
| `--ease-exit` (`EASE_EXIT`) | Page-transition **exit** animation only |

Never use `ease-in-out`, `linear`, `ease`, or any other easing.

### Duration Scale

| Context | Duration |
|---|---|
| Color / opacity shifts (CSS utility transitions) | `200ms` |
| Underline hover animations | `650ms` (`--ease-enter`) |
| Page transition (full cycle, both enter and exit) | `1450ms` (`TRANSITION_DURATION`) |
| Hero clip-path reveal (first load only) | `1250ms` (`--ease-enter`) |
| Modal open/close (future) | `700ms` (`--ease-enter`) |

### Hover Patterns

**Do not** use `hover:text-white` or `hover:bg-white/[0.02]` as primary hover feedback. These are too subtle and feel broken on the editorial aesthetic.

**Use instead:** Underline scrub animation:

```css
/* Underline that draws in from left, retracts from right */
.link-underline {
  position: relative;
  display: inline-flex;
}
.link-underline::before {
  content: "";
  position: absolute;
  bottom: -0.2em;
  left: 0;
  right: 0;
  height: 1px;
  background: currentColor;
  transform: scaleX(1);
  transform-origin: right;
  transition: transform 650ms var(--ease-enter);
}
.link-underline:hover::before {
  transform: scaleX(0);
  transform-origin: right;
}
.link-underline::after {
  content: "";
  position: absolute;
  bottom: -0.2em;
  left: 0;
  right: 0;
  height: 1px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 650ms var(--ease-enter) 0.2s;
}
.link-underline:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}
```

### Text Reveal Animation (Hero, First Load Only)

The Hero headline reveals on first page load using `clipPath` + `y` offset via framer-motion. On internal navigation (e.g. coming back from `/docs/intro` to `/`), the reveal is **skipped** — the text appears immediately at its rest state.

```tsx
// components/landing/hero.tsx (pattern)
"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { EASE_ENTER_TUPLE } from "@/lib/easing";

export function Hero() {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const isInternalNav = document.referrer &&
      new URL(document.referrer).origin === window.location.origin;
    if (!isInternalNav) setShouldAnimate(true);
  }, []);

  return (
    <motion.h1
      initial={shouldAnimate ? { clipPath: "inset(100% 0 0 0)", y: "80%" } : false}
      animate={{ clipPath: "inset(0% 0 0 0)", y: "0%" }}
      transition={{ duration: 1.25, ease: EASE_ENTER_TUPLE }}
    >
      …
    </motion.h1>
  );
}
```

`initial={false}` in framer-motion means "skip the entrance animation and render immediately at the `animate` state." This achieves the "internal nav skips reveal" behavior.

### Page Transitions — Snapshot-Clone Mechanic

The page transition is a **hand-rolled component**, not framer-motion `AnimatePresence`. Adopted verbatim from the signalgrau reference (`~/Downloads/signalgrau-main/components/page-transition.tsx`).

**File:** `components/page-transition.tsx` (replaces the old `components/page-transition-wrapper.tsx`).

**Mechanic:**
1. On `mousedown` / `touchstart` (BEFORE Next.js routing fires), the component captures a DOM clone of the current page plus the current scroll offset (`getBoundingClientRect().top`).
2. When `usePathname()` returns a new value, `transitioning = true` and the rendered tree splits:
   - Old page (the captured clone) sits in a fixed overlay at `z-index: 0`, gets a `translateY` of the captured scroll offset (so it appears exactly where it was on screen), and then animates `translateY(0) scale(1) opacity(1)` → `translateY(-84%) scale(0.82) opacity(0)` over `1450ms` with `--ease-exit`. Exit starts after a `250ms` delay.
   - New page is rendered at `translateY(100vh)` (off-screen below), then animates to `translateY(0)` over `1450ms` with `--ease-enter`.
3. After `TRANSITION_DURATION + 200ms`, `frozenPathname` updates and the overlay is removed.

The new page is always at `z-index: 1`, the exit overlay at `z-index: 0`. The fixed header (`z-index: 50`) stays above both throughout.

### Reduced Motion

**Page transition:** Under `prefers-reduced-motion: reduce`, the snapshot-clone mechanic is **completely skipped**. `frozenPathname` updates synchronously on route change. No snapshot capture, no overlay, no slide. Equivalent to default Next.js routing.

```tsx
const prefersReducedMotion = typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

useEffect(() => {
  if (!transitioning) return;
  if (prefersReducedMotion) {
    setFrozenPathname(pathname);
    return;
  }
  // ...full animation logic...
}, [transitioning, pathname]);
```

**Hero clip-path reveal:** Already gated by the first-load referrer check (Q13). On `prefers-reduced-motion: reduce`, the Hero MAY further short-circuit `shouldAnimate = false` — recommended but not required, since the reveal already plays only on direct entries (rare for repeat users).

**Other CSS transitions** (hover underline, color shifts): not gated. Acceptable per WCAG — they're brief and don't involve large motion.

---

## 7. Component Patterns

### Navigation Header

- Fixed, full-width, `h-14` (56px)
- Background: `bg-signalgray-800/80 backdrop-blur-md`
- Logo: `font-mono font-medium tracking-tight` — wordmark only, no icon
- Nav links: `link-underline` class for hover (see §6)
- No CTA button in header — navigation-only
- Border-bottom: `border-white/10`
- On mobile: hide nav links, keep logo only (no hamburger menu)

```tsx
// Logo pattern
<span className="font-mono font-medium text-sm tracking-tight text-white">
  SUPER<span style={{ opacity: 0.4 }}>SPECS</span>
</span>
```

### Section Label (Eyebrow)

```tsx
<p className="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-white/50 mb-4">
  {label}
</p>
```

### Section Heading

```tsx
<h2
  style={{ fontSize: "clamp(1.75rem, 3.5vw, 3rem)", letterSpacing: "-0.02em", lineHeight: 1.1 }}
  className="font-sans font-light text-white"
>
  {children}
</h2>
```

### Body Copy

```tsx
<p className="text-[1.0625rem] leading-[1.65] text-white/70 max-w-prose">
  {children}
</p>
```

### CTA / Primary Action

No pill buttons. Two patterns:

**Pattern A — Text link with underline:**
```tsx
<a className="link-underline font-medium text-white text-sm">
  View on GitHub →
</a>
```

**Pattern B — Minimal bordered rectangle:**
```tsx
<a className="inline-block border border-white/15 px-6 py-3 text-sm font-medium
              text-white hover:border-white/25 transition-colors duration-200
              rounded-sm">
  {children}
</a>
```

### Cards / Feature Grid

```tsx
<div className="grid md:grid-cols-3 gap-px bg-white/10 rounded-none">
  {items.map(item => (
    <div className="bg-signalgray-800 p-10 hover:bg-signalgray-900 transition-colors duration-200">
      {/* content */}
    </div>
  ))}
</div>
```

### Terminal / Code Mockup

```tsx
<div className="rounded-lg border border-white/10 bg-signalgray-900 overflow-hidden">
  {/* Title bar */}
  <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
    {/* The ONLY rounded-full permitted on the landing page */}
    <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
    <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
    <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
    <span className="ml-2 text-[0.75rem] text-white/40 font-mono">terminal</span>
  </div>
  {/* Content */}
  <div className="p-6 font-mono text-sm leading-[1.7]">
    <span className="text-white/70">$</span>
    <span className="text-white ml-3">npx superspecs install</span>
  </div>
</div>
```

### Phase / Step Items (How It Works)

```tsx
<span className="font-mono text-[clamp(4rem,8vw,7rem)] font-light text-white/[0.05] leading-none">
  {phase.number}
</span>
<div className="font-mono text-[0.7rem] tracking-[0.1em] uppercase text-white/50 mt-1">
  {phase.label}
</div>
```

### Divider / Section Separator

```tsx
<hr className="border-t border-white/10" />
```

---

## 8. Page Structure

The landing page is a **single scrolling document**:

| Order | Section | Intent |
|---|---|---|
| 1 | `Header` | Navigation — fixed, minimal, wordmark only |
| 2 | `Hero` | Headline + sub + one action + terminal mockup |
| 3 | `Problem` | Agitation — what breaks without this |
| 4 | `HowItWorks` | Process — 5 numbered phases |
| 5 | `Features` | Grid of 6 capabilities |
| 6 | `Agents` | Agent compatibility proof |
| 7 | `Install` | Final CTA — install command + GitHub link |
| 8 | `Footer` | Links + legal |

### Hero
- Headline: fluid display size (`clamp(3rem, 8vw, 8rem)`), font-weight 300, tracking `-0.03em`, `text-white`
- Clip-path reveal: first page load only (see §6)
- No badge/pill label — use plain monospace eyebrow text
- One primary action — text link or minimal bordered button
- Terminal mockup below the fold-line
- No decorative glow or grid background overlays

### Footer
Minimal. Two rows: links grid above, legal/copyright below. No social icons. No newsletter form.

---

## 9. Iconography & Symbols

No icon library. No SVG icon sets. No Lucide, Heroicons, or similar.

Acceptable symbolic elements:
- Unicode geometric shapes as section markers: `●`, `◈`, `◎`, `◻`, `⊞`, `◉`, `⊙`
- Arrow: plain unicode `→` or `↓` — never styled icon arrows
- Checkmark: `✓` (plain text) — never a badge or icon

All symbols are rendered in `font-mono` at the same size as surrounding text, using `text-white/50` (muted) unless emphasis is needed.

---

## 10. Do / Don't Rules for AI Agents

### DO

- Use `bg-signalgray-800` for primary page background (landing + docs)
- Use `bg-signalgray-900` for inset panels, terminal mockups, surface depth
- Use `text-white` for primary text
- Use `text-white/70` / `text-white/60` / `text-white/50` for secondary/muted text
- Use `text-white/40` and below for decorative only — not readable body text
- Use `border-white/10` for standard dividers, `border-white/15` for stronger borders
- Use `font-light` (300) for large display headings, `font-medium` (500) for emphasized text
- Use `font-mono` for all labels, eyebrows, code, numbers, and metadata
- Use `gap-px bg-white/10` for card grids
- Use `link-underline` CSS pattern for nav and text link hovers
- Use `var(--ease-enter)` (or `EASE_ENTER_TUPLE`) for all enter/hover/reveal animations
- Use `var(--ease-exit)` (or `EASE_EXIT_TUPLE`) for page-exit animation only
- Use `transition-colors duration-200` only for immediate feedback states
- Use `clamp()` for all heading font sizes
- Keep sections vertically generous — `py-40` on desktop is a baseline
- Keep `max-w-5xl` or `max-w-[70rem]` as the content container width
- Use `rounded-none` or `rounded-sm` on cards and buttons
- Import easing constants from `lib/easing.ts`, not inline literals

### DON'T

- Don't use `text-white/40` or below as readable body text — decorative only
- Don't use `bg-[#080808]`, `bg-black`, or any cold-black tone — use `bg-signalgray-800`
- Don't use any color accent (`emerald`, `blue`, `purple`, etc.)
- Don't use signalgrau's `--brand` orange — SuperSpecs is greyscale
- Don't use `rounded-full` on any element except the three terminal mockup window dots
- Don't use pill-shaped buttons
- Don't add decorative glows (`blur-[120px]` radial gradients)
- Don't add grid-line backgrounds
- Don't use `font-bold` (700) or `font-semibold` (600) — max weight is 500
- Don't use `hover:text-white` as the sole hover indicator
- Don't use `animate-pulse` or other looping CSS animations in the hero
- Don't use icon libraries — use unicode symbols only
- Don't use `ease-in-out`, `linear`, or `ease`
- Don't use more than two typefaces (Geist Sans + Geist Mono)
- Don't add light mode support to the landing page
- Don't use framer-motion `AnimatePresence` for page transitions — the snapshot-clone mechanic owns that
- Don't import easing values as inline literals — always import from `lib/easing.ts`
- Don't fire the Hero clip-path reveal on internal navigation — check `document.referrer`

---

## 11. CSS Variables to Define

Add to `app/globals.css` inside `@theme inline {}`:

```css
@theme inline {
  /* Existing shadcn vars stay unchanged ... */

  /* Bind --font-sans so html { @apply font-sans } resolves */
  --font-sans: var(--font-geist-sans);

  /* SuperSpecs design tokens — signalgray oklch palette */
  --color-signalgray-100: var(--signalgray-100);
  --color-signalgray-200: var(--signalgray-200);
  --color-signalgray-300: var(--signalgray-300);
  --color-signalgray-700: var(--signalgray-700);
  --color-signalgray-800: var(--signalgray-800);
  --color-signalgray-900: var(--signalgray-900);

  /* Easing — canonical source in lib/easing.ts */
  --ease-enter: cubic-bezier(0.6, 0, 0.24, 1);
  --ease-exit:  cubic-bezier(0.82, 1, 0.36, 1);
}

:root {
  /* Existing shadcn :root vars stay unchanged ... */

  /* signalgray oklch palette */
  --signalgray-100: oklch(0.9074 0.0087 84.57);
  --signalgray-200: oklch(0.8593 0.0122 79.78);
  --signalgray-300: oklch(0.5109 0.002 67.78);
  --signalgray-700: oklch(0.3985 0.0021 67.76);
  --signalgray-800: oklch(0.2565 0.004 84.58);
  --signalgray-900: oklch(0.1539 0.0021 106.64);
}
```

The `.dark` variant block stays unchanged (existing shadcn dark theme overrides are unrelated).

---

## 12. Reference Annotations

### From signalgrau (`~/Downloads/signalgrau-main`)

| Element | Value | Applied to |
|---|---|---|
| Palette | `--signalgray-{100..900}` oklch | All colors |
| Page background | `bg-signalgray-800` | `app/page.tsx`, `app/docs/layout.tsx` |
| Page-transition file | `components/page-transition.tsx` | Replaces `page-transition-wrapper.tsx` |
| `EASE_ENTER` | `cubic-bezier(0.6, 0, 0.24, 1)` | Hovers, reveals, page enter |
| `EASE_EXIT` | `cubic-bezier(0.82, 1, 0.36, 1)` | Page exit only |
| `TRANSITION_DURATION` | `1450` ms | Full page-transition cycle |
| Snapshot-clone mechanic | DOM cloning on `mousedown`/`touchstart`, fixed overlay at `z-0` | Page transitions |
| Font | Geist Sans | Display + body |
| Hand-rolled CSS transitions (not framer-motion AnimatePresence) | — | Page-transition technique |

### From betteroff.studio (inspirational, not normative)

| Element | Value | Status |
|---|---|---|
| Off-white text | `#e5e7df` | **NOT adopted** (using `text-white` opacity tiers) |
| Underline-scrub hover | Double `::before` + `::after` CSS pattern | Adopted (with `--ease-enter`) |
| Section label style | Uppercase font-mono, low opacity | Adopted |
| Card grid pattern | `gap-px bg-[border-color]` | Adopted |
| Font (display) | Founders Grotesk X / PP Neue Montreal | **NOT adopted** (Geist Sans instead) |

### From richardekwonye.com (inspirational, not normative)

| Element | Value | Status |
|---|---|---|
| Primary easing | `cubic-bezier(0.62, 0.05, 0.01, 0.99)` | **NOT adopted** (using signalgrau's two-curve system) |
| Underline hover | Double underline scrub | Adopted (via betteroff implementation) |
| Type scale | `clamp()` fluid sizing | Adopted |

---

## 13. Docs Section Migration

The docs section (`/docs/*`) uses the same design tokens as the landing page. The `prose-*` classes in `app/docs/[[...slug]]/page.tsx` are migrated as follows:

### Class Replacements

```
prose-code:text-emerald-400 prose-code:bg-white/[0.04] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs
→
prose-code:text-white prose-code:bg-white/[0.04] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-sm prose-code:text-xs

prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline
→
prose-a:text-white prose-a:underline prose-a:decoration-white/30 hover:prose-a:decoration-white

prose-headings:font-bold prose-headings:tracking-tight
→
prose-headings:font-medium prose-headings:tracking-tight

prose-p:text-white/60
→
prose-p:text-white/70

prose-strong:text-white
→
prose-strong:text-white   (unchanged — emphasis stays full white)

prose-li:text-white/60
→
prose-li:text-white/70

prose-th:text-white/70 prose-th:border-white/10
→
prose-th:text-white/80 prose-th:border-white/15

prose-td:text-white/50 prose-td:border-white/[0.04]
→
prose-td:text-white/60 prose-td:border-white/10
```

### Container Migration

```
app/docs/layout.tsx:16
<div className="min-h-screen bg-[#080808] text-white">
→
<div className="min-h-screen bg-signalgray-800 text-white">
```

The docs section retains its existing sidebar layout, MDX rendering pipeline, and `Header` import (shared with landing). No structural changes — only token swaps.

---

## 14. Implementation Source-of-Truth Files

After implementation, the following files act as the runtime source of truth:

| File | Purpose |
|---|---|
| `lib/easing.ts` | Easing curves and transition duration constants |
| `app/globals.css` | CSS custom property declarations (`--signalgray-*`, `--ease-enter`, `--ease-exit`, `--font-sans`) |
| `components/page-transition.tsx` | Snapshot-clone page transition mechanic |
| `components/scroll-container.tsx` | Custom scroll container + ScrollContext |
| `app/layout.tsx` | Font loading + ScrollContainer (outside PageTransition) |
| `DESIGN.md` (this file) | Visual decisions reference for AI agents |

---

## 15. Scroll Architecture (scroll-motion-style spec)

### Custom Scroll Container

The site uses a custom scroll container instead of native `body`/`window` scroll.

```
body { overflow: hidden; background: signalgray-100 }
  └── ScrollContainer { overflow-y: auto; overflow-x: hidden; height: 100svh }
       └── ThemeProvider
            └── PageTransition  ← unverändert, getBoundingClientRect() korrekt
                 └── pages
```

**Rule:** `ScrollContainer` is **outside** `ThemeProvider` + `PageTransition`. Never inside. `PageTransition` stays completely untouched — `getBoundingClientRect().top` measures correctly against the viewport because the container is `height: 100svh`.

**Consuming scroll in components:**

```tsx
import { useScrollContainer } from "@/components/scroll-container";
import { useScroll, useTransform } from "framer-motion";

const scrollContainer = useScrollContainer();
const { scrollYProgress } = useScroll({
  target: sectionRef,
  container: scrollContainer,
  offset: ["start start", "end start"],
});
```

### Body Background

`body` has `background-color: var(--signalgray-100)` — the warm light color. This ensures the Page Transition exit animation (page scales up and fades out) shows a warm light background at the edges instead of black. Matches the signalgrau reference.

---

## 16. Light/Dark Section System (scroll-motion-style spec)

The landing page alternates between light (`signalgray-100`) and dark (`signalgray-800`) sections:

| Section | Background | Text model |
|---|---|---|
| Hero | `bg-signalgray-100` | `text-signalgray-800` + opacity tiers |
| Terminal | `bg-signalgray-800` | `text-white` + opacity tiers |
| Problem | `bg-signalgray-800` | `text-white` + opacity tiers |
| HowItWorks | `bg-signalgray-800` | `text-white` + opacity tiers |
| Features | `bg-signalgray-100` | `text-signalgray-800` + opacity tiers |
| Agents | `bg-signalgray-800` | `text-white` + opacity tiers |
| Install | `bg-signalgray-800` | `text-white` + opacity tiers |
| Footer | `bg-signalgray-800` | `text-white` + opacity tiers |

### Opacity tiers on light backgrounds (signalgray-100)

The dark-background opacity tiers (`text-white/60` etc.) are **not** directly portable to light sections. On `signalgray-100`, `/60` and below fail AA contrast. Use:

| Usage | Light-bg class | Contrast |
|---|---|---|
| Headings | `text-signalgray-800` | ~11:1 AAA ✅ |
| Body | `text-signalgray-800/90` | ~9:1 AAA ✅ |
| Muted body | `text-signalgray-800/70` | ~6:1 AA ✅ |
| Labels / captions | `text-signalgray-800/70` | ~6:1 AA ✅ |
| **Minimum readable** | `text-signalgray-800/70` | — |
| Decorative | `text-signalgray-800/50` | ~4.5:1 ✅ |

**Rule:** `/70` is the minimum for readable text on `signalgray-100`. Never use `/60` or below for body text on light sections.

### Header on light/dark sections

The header uses `mix-blend-difference` — no background, no backdrop-blur. Logo and nav links are `text-white` and automatically invert to dark over light sections. `pointer-events-none` on `<header>`, `pointer-events-auto` on the inner container.

---

## 17. Mega-Headline Exception (scroll-motion-style spec)

### font-extrabold (800) — explicit exception

`font-extrabold` (weight 800) is **only permitted** on the Hero mega-headline. All other headings remain `font-light` (300). This is an explicit exception to the general font-weight rules.

**The mega-headline:**
```tsx
<motion.h1
  style={{
    fontSize: "clamp(5rem, 15vw, 18rem)",
    letterSpacing: "-0.03em",
    lineHeight: 0.95,
    willChange: "transform",
  }}
  className="font-extrabold text-signalgray-800 whitespace-nowrap"
>
  AI coding that compounds.
</motion.h1>
```

- `font-extrabold` — maximum visual weight for the oversize headline
- `clamp(5rem, 15vw, 18rem)` — fluid sizing, intentionally wider than the viewport
- `whitespace-nowrap` — never wraps; overflow is clipped by the section's `overflow-hidden`
- Parallax: `useScroll + useTransform`, `−25%` translateY as user scrolls through Hero
- `useReducedMotion()` fallback: parallax disabled at `0% → 0%`

When the implementation deviates from this document, **this document is updated** — not the other way around. Stale design docs are worse than no design docs.
