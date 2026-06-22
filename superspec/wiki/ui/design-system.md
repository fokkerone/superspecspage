---
title: Design System — Signalgray Palette & Tokens
summary: The SuperSpecs homepage design system. Warm-dark editorial aesthetic derived from the signalgrau reference. Signalgray oklch palette, CSS custom property token architecture, typography rules, and shape constraints.
tags: [ui, design-system, tokens, typography, signalgray, ui-style, scroll-motion-style]
spec: "[[../specs/ui-style/spec.md]]"
created: 2026-06-22
updated: 2026-06-22
provenance:
  sources:
    - specs/ui-style/spec.md
    - specs/ui-style/DISCUSS.md
    - specs/ui-style/GRILL.md
    - DESIGN.md
    - app/globals.css
    - phases/ui-style-execute/review-log.md
  extracted: ~80%
  inferred: ~15%
  ambiguous: ~5%
---

# Design System — Signalgray Palette & Tokens

## Summary

The SuperSpecs homepage uses a warm editorial dark aesthetic derived from the signalgrau reference project (`~/Downloads/signalgrau-main`). The palette is pure greyscale — no color accents. All visual decisions are encoded as CSS custom properties in `app/globals.css` and `DESIGN.md` at the repo root acts as the machine-readable source of truth for AI agents.

## Context

The original site used cold-black (`#080808`) backgrounds, emerald accent (`#34d399`), and pill-shaped buttons — a recognisable startup-template aesthetic. The `ui-style` spec replaced this wholesale with a system that reads as deliberate and editorial. The signalgrau project was selected as the palette reference because it had already solved the same problem in a compatible stack (Next.js, Tailwind v4, Geist Sans).

Two references inspired the direction but were not adopted verbatim:
- **betteroff.studio** — editorial dark layout, card grid patterns, section label style
- **richardekwonye.com** — typographic confidence, clip-path reveals

The actual values in production come from **signalgrau**.

## Palette

### Signalgray oklch tokens

All colors are defined as oklch values for perceptually uniform manipulation. Declared in `:root` in `app/globals.css`, exposed to Tailwind v4 via `@theme inline {}`.

| Token | oklch | Approx hex | Primary use |
|---|---|---|---|
| `--signalgray-100` | `oklch(0.9074 0.0087 84.57)` | ~`#e8e2d6` | **Body bg + Hero + Features section bg** |
| `--signalgray-200` | `oklch(0.8593 0.0122 79.78)` | ~`#d6cebd` | Feature card backgrounds (light sections) |
| `--signalgray-300` | `oklch(0.5109 0.002 67.78)` | ~`#7e7c77` | Reserved — mid grey (future) |
| `--signalgray-700` | `oklch(0.3985 0.0021 67.76)` | ~`#5e5d59` | Reserved — dark mid grey (future) |
| `--signalgray-800` | `oklch(0.2565 0.004 84.58)` | ~`#383530` | **Primary dark section background** |
| `--signalgray-900` | `oklch(0.1539 0.0021 106.64)` | ~`#1f1d19` | Inset panels, terminal mockup bg |

`signalgray-100` and `signalgray-200` are now active — used by the Hero, Features, and body background. The "Reserved" note no longer applies. See [[scroll-motion-system]] for the light/dark section system.

### Text color model

All text on dark backgrounds is `text-white` with opacity tiers. No warm off-white hex values.

| Opacity class | Contrast on signalgray-800 | Use |
|---|---|---|
| `text-white` | 11.7:1 AAA | Primary text, headings |
| `text-white/80` | 9.0:1 AAA | Strong secondary |
| `text-white/70` | 7.6:1 AAA | Body copy, muted |
| `text-white/60` | 6.3:1 AAA | Captions, card body |
| `text-white/50` | 5.1:1 AA | **Readable floor** — labels, metadata |
| `text-white/40` | 3.8:1 | Decorative only |
| `text-white/30` | 2.7:1 | Decorative only |

**Rule:** `text-white/40` and below are decorative — never use for readable body text.

### No accent color

There is no accent color on this site. The signalgrau reference has an orange `--brand` token (`oklch(0.686 0.210 41)`) — this was **explicitly not adopted**. SuperSpecs is a developer tool; the pure greyscale enforces that hierarchy is carried by opacity, weight, and spacing only. Do not introduce any colored text, borders, or backgrounds.

### Border tokens

| Use | Class |
|---|---|
| Default dividers | `border-white/10` |
| Structural borders | `border-white/15` |
| Hover states | `border-white/25` |

## CSS Token Architecture

All tokens are declared in `app/globals.css` in two places:

```css
/* 1. Raw values in :root */
:root {
  --signalgray-800: oklch(0.2565 0.004 84.58);
  /* ... */
}

/* 2. Tailwind v4 exposure in @theme inline */
@theme inline {
  --color-signalgray-800: var(--signalgray-800);
  --font-sans: var(--font-geist-sans);      /* fixes circular self-reference */
  --ease-enter: cubic-bezier(0.6, 0, 0.24, 1);
  --ease-exit:  cubic-bezier(0.82, 1, 0.36, 1);
}
```

**Important:** The original `globals.css` had `--font-sans: var(--font-sans)` — a circular self-reference that silently fell back to the browser default. This was corrected to `--font-sans: var(--font-geist-sans)` as part of this spec.

Easing constants also live in `lib/easing.ts` as TypeScript exports. See [[easing]] for the full story.

## Typography

### Typeface

Geist Sans (display + body) and Geist Mono (code, labels, metadata). Both loaded via `next/font/google` in `app/layout.tsx` — unchanged from the project template. The geometric nature of Geist Sans is offset by keeping headings at font-weight 300 (light) which reads as more editorial. ^[inferred]

A DM Sans migration (closer to PP Neue Montreal, used by both reference sites) was considered and rejected during the grill session (Q8). Geist Sans was retained to stay consistent with the signalgrau reference and avoid the migration risk.

### Weight rules

| Weight | Class | Use |
|---|---|---|
| 300 | `font-light` | All display headings, section headings |
| 400 | `font-normal` | Body text (default) |
| 500 | `font-medium` | Labels, UI text, section titles |
| **800** | **`font-extrabold`** | **Hero mega-headline only — explicit exception** |

**Forbidden:** `font-semibold` (600) and `font-bold` (700). This is enforced by the global audit test.

**`font-extrabold` exception:** The Hero mega-headline ("AI coding that compounds.") uses `font-extrabold` (800). This is the only permitted use. The visual impact of the mega-headline requires extreme weight at extreme size — `font-light` at `clamp(5rem, 15vw, 18rem)` reads as fragile. See [[scroll-motion-system#mega-headline parallax]].

### Fluid type scale

All headings use `clamp()` for fluid sizing. Fixed Tailwind heading classes (`text-5xl`, `text-7xl`) are forbidden on landing and docs headings.

| Role | Value |
|---|---|
| **Mega-headline (Hero)** | **`clamp(5rem, 15vw, 18rem)`** |
| H2 / section | `clamp(1.75rem, 3.5vw, 3rem)` |
| Phase number (decorative) | `clamp(4rem, 8vw, 7rem)` |
| Body | `1.0625rem` (fixed — 17px) |
| Labels / eyebrows | `0.75rem` (fixed — 12px) |

Applied as inline `style` props or Tailwind arbitrary values, never as standard Tailwind text-size classes for headings.

## Shape Rules

The design is geometric and flat. All cards, panels, and buttons use `rounded-none` or `rounded-sm` (max 2px).

**One explicit exception:** terminal mockup window dots use `rounded-full`. The rule is: `rounded-full` is only permitted on elements that also have `w-2.5 h-2.5` (i.e., the three macOS-style dots). This exception is enforced by the global audit test.

| Element | Permitted radius |
|---|---|
| Cards / panels | `rounded-none` or `rounded-sm` |
| CTA buttons | `rounded-none` or `rounded-sm` |
| Terminal exterior | `rounded-lg` |
| Terminal window dots | `rounded-full` (explicit exception) |

## Section Label Pattern

Uppercase monospaced eyebrow above section headings. No color — pure muted opacity.

```tsx
<p className="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-white/50 mb-4">
  {label}
</p>
```

## Card Grid Pattern

The betteroff-derived `gap-px` grid pattern, where the grid background becomes the visual border between cards.

```tsx
<div className="grid md:grid-cols-3 gap-px bg-white/10 rounded-none">
  <div className="bg-signalgray-800 p-10 hover:bg-signalgray-900 transition-colors duration-200">
    {/* card content */}
  </div>
</div>
```

The `gap-px` on `bg-white/10` creates a 1px border between cards derived from the grid container's background — no explicit `border` on individual cards.

## Docs Section

The docs section (`/docs/*`) uses the same design tokens as the landing page. Key prose class migrations from the old emerald-accent style:

| Old | New |
|---|---|
| `prose-code:text-emerald-400` | `prose-code:text-white` |
| `prose-a:text-emerald-400` | `prose-a:text-white prose-a:underline prose-a:decoration-white/30` |
| `prose-headings:font-bold` | `prose-headings:font-medium` |
| `prose-p:text-white/60` | `prose-p:text-white/70` (bumped for signalgray-800 bg) |

Opacity tiers are generally one step stronger than for the old `#080808` bg because signalgray-800 (`oklch(0.2565...)` ≈ `#383530`) is lighter than the old cold-black.

## Key Decisions

### signalgray palette over custom hex tokens

**Chose:** oklch-based `--signalgray-{100..900}` tokens from the signalgrau reference.
**Over:** The initially planned warm hex tokens (`#111110`, `#e8e6e3`, `#6b6a67`) from DESIGN.md v1.
**Because:** signalgrau is an existing running site in the same stack — values were extracted from real CSS, not theorized. The oklch encoding gives perceptually uniform steps between shades. The re-base happened during the grill session (Q5, Option B).
**Trade-off:** oklch requires modern browsers. All target browsers (2023+) support it. Old browsers will fallback to transparent/black which is undesirable but considered acceptable for this audience. ^[inferred]

### No accent color — SuperSpecs-specific rule

**Chose:** Pure greyscale, no accent.
**Over:** Adopting signalgrau's orange `--brand` token.
**Because:** SuperSpecs is a developer productivity tool, not a creative studio. The orange brand color would shift the identity toward "design agency" rather than "engineering discipline." ^[inferred]
**Trade-off:** CTAs and interactive elements must rely on shape, border, and motion to signal interactivity. The `.link-underline` hover pattern and `border-white/15` bordered buttons carry this weight.

### Geist Sans retained (DM Sans rejected)

**Chose:** Keep Geist Sans.
**Over:** Migrating to DM Sans (closer to PP Neue Montreal used by reference sites).
**Because:** signalgrau itself uses Geist Sans. The migration risk was non-zero (CLS, FOUT) and the visual difference at the weight/size combinations used (font-light display, font-medium labels) is minimal. See DISCUSS.md for the full original reasoning.
**Trade-off:** Geist Sans is more geometric and "developer tool" in character than DM Sans. The `font-light` + `clamp()` usage mitigates this significantly. ^[inferred]

## Gotchas

- **`--font-sans` circular self-reference (fixed):** The original `globals.css` had `--font-sans: var(--font-sans)` — a value that references itself. In practice this silently fell through to the browser default sans-serif. Fixed by binding to `var(--font-geist-sans)`. Future agents should not copy the self-reference pattern.

- **signalgray-800 is lighter than #080808:** The old cold-black was near-pure black. The new background (`oklch(0.2565...)` ≈ `#383530`) is significantly lighter. As a result, all opacity tiers for muted text need to be one step stronger to maintain the same perceived contrast.

- **biome.json schema drift (resolved):** The project's `biome.json` was on schema 2.0.0 when the CLI had advanced to 2.5.0. Keys `ignore`, `organizeImports`, and `linter.rules.recommended` were invalid. Fixed during Task 3.2 by updating to schema 2.5.0 and migrating the deprecated keys.

## Open Questions

- [x] ~~Light-bg sections using signalgray-100/200~~ — resolved by `scroll-motion-style` spec. Hero + Features use `signalgray-100`; feature cards use `signalgray-200`.
- [ ] Dark-mode toggle for the docs section: `next-themes` is installed but light mode was explicitly out of scope for this spec. The docs section has no light mode.

## Related

- [[easing]] — Two-curve easing system, `lib/easing.ts`
- [[component-patterns]] — Link-underline, CTA patterns, section label
- [[page-transitions]] — Snapshot-clone transition using the easing system
- [[techstack/profile]] — Full stack profile, dependencies
- `DESIGN.md` — Machine-readable design system reference at repo root
- `app/globals.css` — CSS custom property declarations
