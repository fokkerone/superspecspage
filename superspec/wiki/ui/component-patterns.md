---
title: Component Patterns — UI Primitives
summary: Reusable UI patterns for the SuperSpecs landing page and docs. Link-underline hover scrub, CTA button variants (Pattern A text link, Pattern B bordered rectangle), section label eyebrow, and card grid layout.
tags: [ui, components, patterns, hover, cta, ui-style]
spec: "[[../specs/ui-style/spec.md]]"
created: 2026-06-22
updated: 2026-06-22
provenance:
  sources:
    - specs/ui-style/spec.md
    - DESIGN.md
    - components/landing/header.tsx
    - components/landing/hero.tsx
    - components/landing/install.tsx
    - app/globals.css
  extracted: ~75%
  inferred: ~20%
  ambiguous: ~5%
---

# Component Patterns — UI Primitives

## Summary

Reusable patterns established by the `ui-style` spec. These are the building blocks every future component should use — not invent alternatives for. The patterns enforce the greyscale-only, no-pill-shape, underline-motion aesthetic.

## Context

Before `ui-style`, each component invented its own hover state (`hover:text-white`), CTA shape (`rounded-full bg-emerald-500`), and section header treatment. `ui-style` replaces all of these with a small set of composable primitives that can be combined freely.

## Patterns

### `.link-underline` — Hover Underline Scrub

The primary hover indicator for all nav links and text links. A double-underline scrub: the default underline retracts from the right while a new underline draws in from the left. Gives a "wipe" effect without any color change.

**CSS class in `app/globals.css` `@layer utilities`:**

```css
.link-underline {
  position: relative;
  display: inline-flex;
}
.link-underline::before {
  /* default underline — visible at rest, retracts on hover */
  content: "";
  position: absolute;
  bottom: -0.2em;
  left: 0; right: 0;
  height: 1px;
  background: currentColor;
  transform: scaleX(1);
  transform-origin: right;
  transition: transform 650ms var(--ease-enter);
}
.link-underline:hover::before {
  transform: scaleX(0);
}
.link-underline::after {
  /* hover underline — hidden at rest, draws in on hover */
  content: "";
  position: absolute;
  bottom: -0.2em;
  left: 0; right: 0;
  height: 1px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 650ms var(--ease-enter) 0.2s; /* 200ms delay — stagger */
}
.link-underline:hover::after {
  transform: scaleX(1);
}
```

**Key constraints:**
- Uses `var(--ease-enter)` — never hardcode the cubic-bezier literal
- Duration is 650ms (not 200ms — that's only for color/opacity immediate feedback)
- Uses `currentColor` — inherits whatever `color` the element has, so opacity tiers work correctly
- The 0.2s delay on `::after` creates the stagger between retract and draw-in

**Use on:** nav links, text links, footer links, CTA secondary links.
**Do NOT use:** `hover:text-white` as the sole hover indicator — this was the old pattern and is now forbidden.

### CTA — Pattern A: Text Link

```tsx
<a className="link-underline font-medium text-white text-sm">
  View on GitHub →
</a>
```

Simple underlined text link. No border, no background. Use for secondary actions.

### CTA — Pattern B: Bordered Rectangle

```tsx
<a className="inline-block border border-white/15 px-6 py-3 text-sm font-medium
              text-white hover:border-white/25 transition-colors duration-200
              rounded-sm">
  npm install -g superspecs
</a>
```

Minimal bordered rectangle. No fill, no pill. `border-white/15` at rest, `border-white/25` on hover, `transition-colors duration-200` (fast feedback). `rounded-sm` (2px) maximum.

**Rules for both patterns:**
- No `rounded-full`
- No filled background (`bg-emerald-*`, `bg-white`, etc.)
- No `font-bold` or `font-semibold` — `font-medium` (500) is the maximum

### Section Label (Eyebrow)

Uppercase monospaced label above section headings. Low opacity — purely decorative orientation.

```tsx
<p className="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-white/50 mb-4">
  {label}
</p>
```

### Section Heading

Fluid-sized heading in font-light. All headings use inline `style` for `clamp()` — never fixed Tailwind `text-*` size classes.

```tsx
<h2
  style={{ fontSize: "clamp(1.75rem, 3.5vw, 3rem)", letterSpacing: "-0.02em", lineHeight: 1.1 }}
  className="font-light text-white mb-16"
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

Body text is fixed size (17px) — never fluid. Secondary body uses `text-white/60`. Decorative/metadata uses `text-white/40` or below.

### Card Grid

The betteroff-derived `gap-px` grid pattern. The grid container's background color becomes the visual divider between cards.

```tsx
<div className="grid md:grid-cols-3 gap-px bg-white/10 rounded-none">
  {items.map(item => (
    <div className="bg-signalgray-800 p-10 hover:bg-signalgray-900 transition-colors duration-200">
      {/* card content */}
    </div>
  ))}
</div>
```

Key: `bg-white/10` on the grid + `gap-px` creates 1px white/10 borders between cards. `rounded-none` on the grid — no pill/rounded corners.

### Terminal Mockup

Standard code/terminal display block:

```tsx
<div className="rounded-lg border border-white/10 bg-signalgray-900 overflow-hidden">
  {/* Title bar */}
  <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
    {/* Only permitted rounded-full on the site: */}
    <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
    <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
    <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
    <span className="ml-2 text-[0.75rem] text-white/40 font-mono">terminal</span>
  </div>
  <div className="p-6 font-mono text-sm leading-[1.7]">
    <span className="text-white/70">$</span>
    <span className="text-white ml-3">command here</span>
  </div>
</div>
```

The three `w-2.5 h-2.5 rounded-full bg-white/10` dots are the **only** permitted `rounded-full` usage on the site. Any other `rounded-full` is a violation enforced by the global audit test.

### Logo Wordmark

Used in Header and Footer:

```tsx
<span className="font-mono font-medium text-sm tracking-tight text-white">
  SUPER<span style={{ opacity: 0.4 }}>SPECS</span>
</span>
```

The `opacity: 0.4` on the "SPECS" portion creates visual hierarchy within the wordmark while keeping it purely in the greyscale system. ^[inferred]

### Divider / Section Separator

```tsx
<section className="border-t border-white/10 py-24 md:py-40">
```

Sections are separated by `border-t border-white/10` on the section element itself — not `<hr>` tags or `border-b` on the preceding section.

## Iconography

No icon libraries on landing or docs. All symbols are Unicode characters rendered in `font-mono`:

| Symbol | Use |
|---|---|
| `◈` `◎` `◻` `⊞` `◉` `⊙` | Feature/section markers |
| `→` `↓` | Direction arrows in CTAs |
| `✓` | Confirmation / list items |
| `✗` | Problem / failure indicators |
| `●` | Section eyebrow bullets |

The signalgrau reference uses `lucide-react` — this was intentionally not adopted.

## Key Decisions

### `.link-underline` over `hover:text-white`

**Chose:** Double underline scrub via CSS pseudo-elements.
**Over:** `hover:text-white` (previous pattern) or framer-motion `layoutId` indicator (signalgrau's nav pattern).
**Because:** `hover:text-white` is too subtle and reads as broken on a dark editorial site. The framer-motion `layoutId` pattern (used in signalgrau's nav) creates a shared underline indicator across links rather than a per-link scrub — not the right behavior for a static nav.
**Trade-off:** The CSS pseudo-element pattern doesn't work on elements with `display: block` without additional `position: relative` setup. The class sets `display: inline-flex` which handles most cases.

### No icon libraries

**Chose:** Unicode symbols only.
**Over:** Lucide, Heroicons, or any SVG library.
**Because:** Icon libraries add bundle weight and visual inconsistency — the editorial aesthetic relies on typographic elements only. Unicode symbols rendered in `font-mono` are the right fidelity for this site's density.
**Trade-off:** Limited symbol vocabulary. For complex iconography needs, this constraint would need revisiting.

### `rounded-sm` max on buttons/cards

**Chose:** `rounded-none` or `rounded-sm` (2px max) for all interactive shapes.
**Over:** `rounded-full` pill shapes (the old pattern) or `rounded-lg` (signalgrau's button style).
**Because:** Rounded shapes, especially pill buttons, signal consumer-app aesthetics. The editorial direction requires geometric rigidity. Both reference sites (betteroff, richardekwonye) use flat/zero-radius shapes for interactive elements.
**Trade-off:** CTA buttons may feel less "clickable" to users conditioned by rounded-corner affordances. The border (`border-white/15`) and hover state (`border-white/25`) compensate.

## Gotchas

- **`.link-underline` requires `position: relative` on the parent:** The `::before`/`::after` pseudo-elements are `position: absolute`. If an ancestor clips overflow, the underline may not be visible. Use `overflow: visible` on ancestors that contain link-underline elements.

- **`text-white/40` is decorative-only:** Always use `text-white/50` or stronger for any text that users need to read. `text-white/40` on `signalgray-800` is 3.8:1 contrast ratio — below WCAG AA. The global audit does not enforce this opacity floor for individual text nodes (too complex), so it's a style guide rule, not an automated check.

## Related

- [[design-system]] — Full palette, typography, shape rules
- [[easing]] — `var(--ease-enter)` used in `.link-underline`
- [[page-transitions]] — Uses `EASE_ENTER` / `EASE_EXIT` from the same system
- `app/globals.css` — `.link-underline` definition in `@layer utilities`
- `DESIGN.md §7` — Component pattern reference for AI agents
