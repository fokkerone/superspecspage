---
title: Page Transitions
summary: Snapshot-clone page transition between all routes. The outgoing page scales up and fades out; the incoming page slides in from below. Hand-rolled CSS transitions — no framer-motion AnimatePresence. Two-curve easing system from lib/easing.ts.
tags: [ui, animation, routing, page-transitions, snapshot-clone]
spec: "[[../specs/ui-style/spec.md]]"
created: 2026-06-22
updated: 2026-06-22
provenance:
  sources:
    - specs/ui-style/spec.md
    - specs/ui-style/GRILL.md
    - Downloads/signalgrau-main/components/page-transition.tsx
    - lib/easing.ts
    - components/page-transition.tsx
  extracted: ~80%
  inferred: ~15%
  ambiguous: ~5%
---

# Page Transitions

## Summary

A global page transition that plays on every route change. When navigating, the current page scales up and fades out while the new page slides in from below (`translateY(100vh) → 0`). The outgoing page is a **DOM clone** captured just before routing fires — not the live React tree. Reference aesthetic: signalgrau (`~/Downloads/signalgrau-main`).

**This replaces the previous framer-motion `AnimatePresence` slide-down implementation.** The old `lib/transitions.ts`, `components/page-transition-wrapper.tsx`, and associated tests are deleted.

## Context

Built to give the SuperSpecs site a premium, crafted feel. The signalgrau mechanic was chosen over the previous `AnimatePresence` approach because it:
1. Captures scroll position at the exact moment of user intent (mousedown), not at React render time
2. Allows the outgoing page to visually exit *while* the new page enters from below — a genuine reveal, not a swap
3. Doesn't require framer-motion in the transition path (framer-motion stays only for the Hero clip-path reveal)

Duration: `1450ms`. A deliberate, premium timing choice — consistent with the signalgrau reference.

## Architecture

### How it works

`components/page-transition.tsx` is a `"use client"` component wrapped around `{children}` in the root layout.

```
app/layout.tsx (Server Component)
  └── ThemeProvider (Client)
        └── PageTransition (Client)  ← owns the snapshot + animation
              ├── exit overlay div   ← fixed, z-0, holds cloned DOM
              └── new page div       ← relative, z-1, enters from translateY(100vh)
```

Key files:
- `components/page-transition.tsx` — the single transition component (ported from signalgrau)
- `lib/easing.ts` — canonical source for `EASE_ENTER`, `EASE_EXIT`, `TRANSITION_DURATION`
- `app/layout.tsx` — integration point

### Snapshot capture

The component captures a DOM clone on `mousedown` / `touchstart` using event capture (`{capture: true}`). This fires **before** Next.js begins routing, so the snapshot reflects the page exactly as the user saw it (including scroll position).

```ts
const captureSnapshot = () => {
  if (liveRef.current) {
    snapshotRef.current = {
      node: liveRef.current.cloneNode(true),
      top: liveRef.current.getBoundingClientRect().top,
    };
  }
};

document.addEventListener("mousedown", captureSnapshot, { capture: true });
document.addEventListener("touchstart", captureSnapshot, { capture: true, passive: true });
```

`getBoundingClientRect().top` encodes both nav offset and scroll in one value, so `translateY(top)` places the clone exactly where the page was on screen.

### Transition state machine

```
idle:
  frozenPathname === pathname
  liveRef renders children normally

transitioning (frozenPathname !== pathname):
  exitRef:  fixed div, z-0 — receives DOM clone, animates out
  newRef:   relative div, z-1, translateY(100vh) → translateY(0)

after TRANSITION_DURATION + 200ms:
  setFrozenPathname(pathname)
  exits transitioning state
  liveRef renders again
```

### Animation values

From `lib/easing.ts`:

```ts
EASE_ENTER = "cubic-bezier(0.6, 0, 0.24, 1)"    // new page slides in
EASE_EXIT  = "cubic-bezier(0.82, 1, 0.36, 1)"   // old page exits
TRANSITION_DURATION = 1450                        // ms
```

Exit animation (starts after `250ms` delay):
```
transform: translateY(0) scale(1) → translateY(-84%) scale(0.82)
opacity: 1 → 0
```

Enter animation:
```
transform: translateY(100vh) → translateY(0)
```

### Exit overlay clipping

The exit overlay uses a plain `div` (no transform) as the outer container — with `overflow: hidden` — so clipping works correctly. The cloned node gets `transform: translateY(top)` applied. If the same element had both `overflow: hidden` and `transform`, CSS would break the clipping relationship.

```ts
const clipper = document.createElement("div");
clipper.style.cssText = "position:absolute;inset:0;overflow:hidden";
(node as HTMLElement).style.transform = `translateY(${top}px)`;
clipper.appendChild(node);
exitRef.current.appendChild(clipper);
```

### z-index stacking

| Element | z-index | Why |
|---|---|---|
| Exit overlay (`exitRef`) | `0` | Never occludes the new page |
| New page (`newRef`) | `1` | Slides in above the exit overlay |
| Fixed Header | `50` | Always visible above both |

### Reduced motion

Under `prefers-reduced-motion: reduce`, the animation is skipped entirely:

```ts
const prefersReducedMotion = typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

useEffect(() => {
  if (!transitioning) return;
  if (prefersReducedMotion) {
    setFrozenPathname(pathname);   // instant swap
    return;
  }
  // ...full animation...
}, [transitioning, pathname]);
```

The SSR guard (`typeof window !== "undefined"`) prevents server crashes.

## Key Decisions

### Hand-rolled over framer-motion AnimatePresence

**Chose:** Raw DOM manipulation + CSS transitions.
**Over:** `AnimatePresence` + framer-motion `Variants` (previous implementation).
**Because:** The snapshot-clone mechanic requires capturing the DOM *before* React unmounts it. `AnimatePresence` controls exit timing via React's reconciler — it cannot reference the pre-routing DOM state. Raw event capture on `mousedown` can.
**Trade-off:** More code, less declarative. Fragile for programmatic navigation (mitigated by `useLayoutEffect` fallback).

### 1450ms duration

**Chose:** `1450ms` (verbatim from signalgrau).
**Over:** `500ms` (previous implementation), `700ms` (compromise considered during grill).
**Because:** The scale + translate + opacity exit animation needs time to read. The "premium" feel is specifically the long settle. `700ms` felt rushed; `500ms` looked like a glitch.
**Trade-off:** Doc-heavy users experience ~1.5s wait per click. Accepted as a deliberate aesthetic choice.
**Deferred:** Visual tuning after first render — duration may be adjusted in a follow-up.

### Two-curve system (`EASE_ENTER` / `EASE_EXIT`)

**Chose:** Two named curves, each semantically scoped.
**Over:** Single `--ease-premium` curve for everything (previous spec).
**Because:** Enter and exit serve different purposes — enter should feel welcoming, exit should feel authoritative. The signalgrau curves were calibrated as a pair for this exact 1450ms mechanic.
**Trade-off:** Two imports per consumer instead of one. Solved by `lib/easing.ts` — one import gives both.

### `lib/easing.ts` as canonical source

**Chose:** TS constants file exporting string + tuple forms of both curves.
**Over:** Inline literals in each component (signalgrau pattern), or CSS-only `var()` tokens.
**Because:** Three consumers need the values in different forms: `page-transition.tsx` uses the string form (CSS `transition` property), `hero.tsx` uses the tuple form (framer-motion `ease` prop), `globals.css` uses the CSS string form for `.link-underline`. One file, one change point.
**Trade-off:** CSS `globals.css` duplicates the values once (as `--ease-enter` / `--ease-exit`). Acceptable.

### Swappable-variants pattern abandoned

**Chose:** Single hardcoded transition style in `page-transition.tsx`.
**Over:** The previous `lib/transitions.ts` "swap by changing one import" pattern.
**Because:** The snapshot-clone mechanic is not easily parameterised — the exit animation shape (scale + translate + opacity) is integral to the component logic, not a pluggable `Variants` object.
**Trade-off:** Changing the transition style requires editing the component directly. Acceptable for a single-site context.

## Patterns

### Easing constants import

```ts
import { EASE_ENTER, EASE_EXIT, TRANSITION_DURATION } from "@/lib/easing";
// In CSS transition strings:
newEl.style.transition = `transform ${TRANSITION_DURATION}ms ${EASE_ENTER}`;
// In framer-motion:
import { EASE_ENTER_TUPLE } from "@/lib/easing";
transition={{ ease: EASE_ENTER_TUPLE, duration: 1.25 }}
```

### `.link-underline` hover easing

CSS consumers reference the token, not the literal:
```css
.link-underline::before {
  transition: transform 650ms var(--ease-enter);
}
```

## Gotchas

- **Programmatic navigation without mousedown:** `router.push()` called programmatically (not from a user click) won't trigger the `mousedown` capture. The `useLayoutEffect` fallback calls `captureSnapshot()` when `!transitioning && !snapshotRef.current` — this covers the first navigation and programmatic pushes at rest.

- **Fast double-click:** If the user clicks a second link before the first transition completes, `frozenPathname` hasn't updated yet — the new click fires on the new page (which is already mounted). The second `mousedown` captures a snapshot of the entering page. Visually acceptable; no crash.

- **Fixed header z-index:** The header uses `z-50` (Tailwind = `z-index: 50`). The exit overlay is `z-0` and new page is `z-1`. No conflict. This is the same resolution as the previous implementation.

- **scroll position on `liveRef`:** `liveRef` is a plain `div` with `minHeight: 100svh`. Scroll is owned by the `body` or `html` element, not `liveRef` — so `getBoundingClientRect().top` may be `0` or negative depending on current scroll. The `translateY(top)` compensates. The signalgrau note: "A plain div (no transform) so overflow:hidden correctly clips the translated clone."

- **`exit-snapshot-scroller` CSS:** `globals.css` includes `.exit-snapshot-scroller { scrollbar-width: none }` — retained from the signalgrau reference for the exit overlay container.

## Easing reference

| Constant | Value | Used for |
|---|---|---|
| `EASE_ENTER` | `cubic-bezier(0.6, 0, 0.24, 1)` | New page enter, hover underlines, Hero clip-path reveal |
| `EASE_EXIT` | `cubic-bezier(0.82, 1, 0.36, 1)` | Old page exit only |

`EASE_ENTER` is a balanced ease-in-out. `EASE_EXIT` is front-loaded — fast start, long settle. The contrast creates the sensation that the old page "launches away" while the new page "arrives" with intention.

## Open Questions

- [ ] Should `TRANSITION_DURATION` be tunable by route type? (docs-to-docs faster than landing-to-docs?) — deferred to post-ship observation.
- [ ] Should browser back/forward navigation also animate, or stay instant? — out of scope.
- [ ] Is `1450ms` still correct after first real-browser render? — deferred for visual tuning.

## Related

- [[techstack/profile]] — framer-motion listed as required (for Hero clip-path reveal, not page transitions)
- `components/page-transition.tsx` — the transition component
- `lib/easing.ts` — easing constants
- `app/layout.tsx` — integration point in root layout
- `specs/ui-style/spec.md` — the spec that introduced this architecture
