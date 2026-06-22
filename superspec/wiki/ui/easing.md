---
title: Easing System — Two-Curve Motion Constants
summary: The two-curve easing system for all intentional animations. EASE_ENTER for hovers, reveals, and page-entry; EASE_EXIT for page-exit only. Single source of truth in lib/easing.ts with CSS variable mirrors in globals.css.
tags: [ui, animation, easing, motion, ui-style]
spec: "[[../specs/ui-style/spec.md]]"
created: 2026-06-22
updated: 2026-06-22
provenance:
  sources:
    - specs/ui-style/spec.md
    - specs/ui-style/GRILL.md
    - lib/easing.ts
    - app/globals.css
    - Downloads/signalgrau-main/components/page-transition.tsx
  extracted: ~85%
  inferred: ~10%
  ambiguous: ~5%
---

# Easing System — Two-Curve Motion Constants

## Summary

All intentional animations on the site use one of two named easing curves, both derived from the signalgrau reference. `EASE_ENTER` (`cubic-bezier(0.6, 0, 0.24, 1)`) governs everything that enters or reveals. `EASE_EXIT` (`cubic-bezier(0.82, 1, 0.36, 1)`) governs the page-transition exit only. Constants are defined once in `lib/easing.ts` and mirrored as CSS custom properties in `app/globals.css`.

## Context

The previous spec (`page-transitions`) used a single `--ease-premium: cubic-bezier(0.62, 0.05, 0.01, 0.99)` curve borrowed from richardekwonye.com for all intentional motion. The `ui-style` spec replaced the entire page-transition mechanic with the signalgrau snapshot-clone approach, which uses two calibrated curves: one for the entering page (ease-in-out balanced) and one for the exiting page (front-loaded — fast start, long settle). This asymmetry creates the sensation that the old page "launches away" while the new page "arrives with intention." ^[inferred]

A third curve was considered (keeping `--ease-premium` for hovers/reveals while using the signalgrau pair for page transitions). Rejected during grill session Q6 as too complex — one entry curve for all non-exit motion is simpler and consistent.

## Constants

**Canonical source: `lib/easing.ts`**

```ts
export const EASE_ENTER = "cubic-bezier(0.6, 0, 0.24, 1)" as const;
export const EASE_EXIT  = "cubic-bezier(0.82, 1, 0.36, 1)" as const;
export const EASE_ENTER_TUPLE = [0.6, 0, 0.24, 1] as const;
export const EASE_EXIT_TUPLE  = [0.82, 1, 0.36, 1] as const;
export const TRANSITION_DURATION = 1450;
```

**Why two forms (string + tuple)?**

- `EASE_ENTER` / `EASE_EXIT` (string form): used where raw CSS `transition` string is constructed — specifically in `components/page-transition.tsx` where CSS transitions are set via `element.style.transition`.
- `EASE_ENTER_TUPLE` / `EASE_EXIT_TUPLE` (number array): used where framer-motion's `ease` prop expects `[x1, y1, x2, y2]` — specifically in `components/landing/hero.tsx` for the clip-path reveal.

## CSS Variable Mirrors

`app/globals.css` duplicates the values as CSS custom properties for consumers that can't import TypeScript:

```css
@theme inline {
  --ease-enter: cubic-bezier(0.6, 0, 0.24, 1);
  --ease-exit:  cubic-bezier(0.82, 1, 0.36, 1);
}
```

Used by `.link-underline` in `@layer utilities`:

```css
.link-underline::before {
  transition: transform 650ms var(--ease-enter);
}
```

**Rule:** CSS consumers use `var(--ease-enter)` — never hardcode the literal. TS consumers import from `lib/easing.ts` — never inline literals.

## Duration Scale

| Context | Duration | Curve |
|---|---|---|
| Color / opacity feedback | `200ms` | CSS `transition-colors` only |
| Underline hover (`.link-underline`) | `650ms` | `--ease-enter` |
| Page transition (full cycle) | `1450ms` | `EASE_ENTER` + `EASE_EXIT` |
| Hero clip-path reveal | `1250ms` | `EASE_ENTER_TUPLE` |

The `1450ms` page-transition duration was adopted verbatim from signalgrau. It was contested during grill session Q11 (700ms was recommended as a compromise). The decision was to keep 1450ms — the scale + translate + opacity exit animation needs time to read. Doc-heavy users experience ~1.5s wait per navigation; this was accepted as a deliberate aesthetic choice. Deferred for visual tuning post-merge.

## Usage by Consumer

| Consumer | Form | Import |
|---|---|---|
| `components/page-transition.tsx` | string `EASE_ENTER`, `EASE_EXIT` | `import { EASE_ENTER, EASE_EXIT, TRANSITION_DURATION } from "@/lib/easing"` |
| `components/landing/hero.tsx` | tuple `EASE_ENTER_TUPLE` | `import { EASE_ENTER_TUPLE } from "@/lib/easing"` |
| `app/globals.css` `.link-underline` | CSS var `var(--ease-enter)` | n/a (CSS) |
| Tests | any form | `import { EASE_ENTER, ... } from "@/lib/easing"` — tests assert constants, not literals |

## Key Decisions

### Two curves instead of one

**Chose:** Asymmetric enter/exit curves.
**Over:** Single `--ease-premium` curve for everything (previous spec) or three curves (enter, exit, hover).
**Because:** The signalgrau snapshot-clone transition is calibrated specifically for its two curves. Using a single curve would produce a symmetric page transition that loses the "old page launches, new page arrives" sensation. ^[inferred]
**Trade-off:** Slightly more cognitive overhead for new contributors — two curve names to remember instead of one.

### `lib/easing.ts` as canonical source

**Chose:** TypeScript constants file, not CSS-variables-only.
**Over:** Inlining literals per-consumer (signalgrau's own pattern), or CSS-only via `getComputedStyle` at runtime.
**Because:** Three consumers need the values in different forms. One file, three exports, one change point. Tests can assert against the constants rather than pattern-match against strings in component source.
**Trade-off:** CSS `globals.css` duplicates the values once. Acceptable — it's a 2-line addition with a comment pointing to `lib/easing.ts`.

## Gotchas

- **Biome auto-fix regression:** During `biome check --write`, Biome added `captureSnapshot` to the `useEffect` deps array in `page-transition.tsx`. This was incorrect — `captureSnapshot` is intentionally a stable closure over refs only. Reverted to `[]` with a `biome-ignore lint/correctness/useExhaustiveDependencies` suppression comment documenting the reason.

- **`--ease-premium` is deleted:** The previous spec used `--ease-premium`. This token no longer exists. All references to `--ease-premium` were removed and the global audit enforces zero occurrences.

## Open Questions

- [ ] Should `TRANSITION_DURATION` be tunable by route context (docs-to-docs faster)? Deferred — requires PageTransition to inspect from/to paths, adds significant complexity.
- [ ] Is 1450ms the right duration after seeing it in a real browser? Deferred for visual judgment post-merge.

## Related

- [[design-system]] — Palette, typography, shape rules
- [[component-patterns]] — Where `.link-underline` and `var(--ease-enter)` are used
- [[page-transitions]] — Full documentation of the snapshot-clone transition mechanic
- `lib/easing.ts` — Source of truth (5 exports)
- `app/globals.css` — CSS mirror (`--ease-enter`, `--ease-exit`)
