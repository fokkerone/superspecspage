---
title: Page Transitions
summary: Slide-down exit transition between all routes using framer-motion + Next.js App Router. The outgoing page slides down; the incoming page is revealed at rest behind it. Variant is swappable via a single import in one file.
tags: [ui, animation, routing, framer-motion, page-transitions]
spec: "[[../specs/page-transitions/spec.md]]"
created: 2026-06-22
updated: 2026-06-22
provenance:
  sources:
    - specs/page-transitions/DISCUSS.md
    - specs/page-transitions/spec.md
    - components/page-transition-wrapper.tsx
    - lib/transitions.ts
  extracted: ~75%
  inferred: ~20%
  ambiguous: ~5%
---

# Page Transitions

## Summary

A global page transition system that plays a "slide-down exit" animation on every route change. When navigating, the current page translates downward out of the viewport (`y: 0 → 100%`) while the incoming page is already visible at rest behind it — no enter animation. Reference aesthetic: betteroff.studio (Overview → Work).

## Context

Built to give the SuperSpecs homepage a premium, crafted feel consistent with high-end studio sites. The animation replaces the default instant Next.js route swap. The design requirement was: *the new page lies behind the current one; the current one slides away to reveal it*.

## Architecture

### How it works

`AnimatePresence` (framer-motion) wraps all page content in the root layout. When `usePathname()` returns a new value, React unmounts the old `motion.div` (triggering its exit animation) and mounts the new one (no enter animation — it appears at rest).

```
app/layout.tsx (Server Component)
  └── ThemeProvider (Client)
        └── PageTransitionWrapper (Client)  ← owns AnimatePresence
              └── motion.div key={pathname} ← exit animates, enter is y:0
                    └── {children}          ← page content
```

Key files:
- `components/page-transition-wrapper.tsx` — the single wrapper component
- `lib/transitions.ts` — all variant definitions (swappable here)
- `app/layout.tsx` — integration point

### Why there is no enter animation

The betteroff.studio effect is a **reveal**, not a **swap**. The incoming page must already be visible and static while the outgoing page moves. Enter animations would create a "wipe" instead of a reveal. `initial: { y: 0 }` and `animate: { y: 0 }` on the incoming page achieve this.^[inferred]

## Key Decisions

### AnimatePresence lives in a Client Component wrapper, not in layout.tsx

**Chose:** `PageTransitionWrapper` — a separate `"use client"` component imported into the root Server Component layout.  
**Over:** Adding `"use client"` directly to `app/layout.tsx`.  
**Because:** The App Router root layout must be a Server Component (metadata exports, font loading). A Client Component wrapper is the correct boundary.  
**Trade-off:** One extra file; small indirection.

### `usePathname` as the AnimatePresence key

**Chose:** `key={pathname}` on the `motion.div`, where `pathname = usePathname()`.  
**Over:** Keying on `searchParams`, a counter, or a custom context value.  
**Because:** `usePathname` is stable, changes exactly when the route changes, and requires no additional state.  
**Trade-off:** None — this is the idiomatic framer-motion + App Router pattern.^[inferred]

### `AnimatePresence mode="wait"`

**Chose:** `mode="wait"` — the exit animation completes before the entering component mounts.  
**Over:** `mode="sync"` (both animate simultaneously) or `mode="popLayout"`.  
**Because:** The reveal effect requires the outgoing page to be fully gone before the incoming page takes focus. Simultaneous animation would produce a split-screen artefact.  
**Trade-off:** The full 500ms duration is felt on every navigation; there is no overlap to hide latency.

### Variants isolated in `lib/transitions.ts`

**Chose:** Named `Variants` exports (`slideDown`, `fadeOnly`) in a dedicated file.  
**Over:** Inline variant objects inside `PageTransitionWrapper`.  
**Because:** Explicit product requirement: the transition style must be swappable by changing one import, without touching any page component.  
**Trade-off:** None meaningful — the file is tiny and the boundary is clean.

### `position: fixed; inset: 0; zIndex: 0` on the motion.div

**Chose:** Fixed positioning filling the full viewport, z-index 0.  
**Over:** `position: relative` or `position: absolute`.  
**Because:** The fixed header (`z-50` = z-index 50) must remain visible above the sliding page throughout the animation. With `zIndex: 0` on the wrapper, the header always wins the stacking order.  
**Trade-off:** Page content is inside a `position: fixed` scroll container — `overflowY: auto` is required to restore scroll behaviour.

## Patterns

### Strategy pattern for transition variants

`lib/transitions.ts` exports named `Variants` objects. `PageTransitionWrapper` imports exactly one. Adding a new style = add a new export. Swapping the active style = change one import line.

```ts
// lib/transitions.ts
export const slideDown: Variants = { ... };
export const fadeOnly: Variants = { ... };

// components/page-transition-wrapper.tsx
import { slideDown } from "@/lib/transitions"; // ← swap here only
```

### Exit-only animation pattern

To achieve a reveal (new page at rest, old page exits), set `initial` and `animate` to the target resting state and only define motion in `exit`:

```ts
export const slideDown: Variants = {
  initial: { y: 0 },   // incoming: start at rest
  animate: { y: 0 },   // incoming: stay at rest
  exit: { y: "100%" }, // outgoing: slide down
};
```

### Scroll reset via onExitComplete

Scroll position is reset *after* the exit animation completes — not before. If reset were synchronous with navigation, the incoming page would briefly flash at the previous scroll offset during the animation.

```ts
<AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
```

## Gotchas

- **`motion.div` stacking context vs. fixed header:** `position: fixed` on a `motion.div` creates a new stacking context that can occlude sibling fixed elements. Resolved by setting `zIndex: 0` on the wrapper — the header's `z-50` (50) always wins.

- **`overflowY: auto` is required:** Because page content is inside a `position: fixed` container that fills the viewport, the container itself must own the scroll — not the `<body>`. Without `overflowY: auto`, pages cannot scroll at all.

- **No `_app.tsx` in App Router:** There is no single client-side mount point in the App Router equivalent to Pages Router's `_app.tsx`. The only way to wrap all pages is via the root `app/layout.tsx` — but it must stay a Server Component. Hence the `PageTransitionWrapper` boundary.

- **`mode="wait"` is load-bearing:** Without it, `AnimatePresence` plays entry and exit simultaneously. On a fast machine this is nearly invisible, but on slow connections it produces a brief overlap. `mode="wait"` eliminates this.^[inferred]

## Easing reference

The `slideDown` variant uses `cubic-bezier(0.76, 0, 0.24, 1)` — a strong ease-in-out that front-loads deceleration. This matches the betteroff.studio feel: the page starts fast and settles. Duration: 500ms.^[ambiguous — exact values were chosen as a starting point; fine-tuning expected]

## Open Questions

- [ ] Should `prefers-reduced-motion` disable or shorten the transition? (deferred from spec)
- [ ] Should browser back/forward navigation also animate, or stay instant? (out of scope for this feature)
- [ ] Is 500ms the right duration? Could be shorter (350ms) for perceived snappiness without losing the effect.

## Related

- [[techstack/profile]] — framer-motion listed as optional dependency, now promoted to required
- `components/page-transition-wrapper.tsx` — the wrapper component
- `lib/transitions.ts` — variant definitions
- `app/layout.tsx` — integration point in root layout
