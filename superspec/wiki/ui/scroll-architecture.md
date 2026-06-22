---
title: Scroll Architecture — Custom Container
summary: The site uses a custom scroll container (not native window scroll) to enable precise parallax control, mix-blend-difference on the header, and clean Page Transition behavior. ScrollContainer sits outside PageTransition in the React tree.
tags: [ui, scroll, architecture, parallax, scroll-motion-style]
spec: "[[../specs/scroll-motion-style/spec.md]]"
created: 2026-06-22
updated: 2026-06-22
provenance:
  sources:
    - specs/scroll-motion-style/spec.md
    - specs/scroll-motion-style/DISCUSS.md
    - specs/scroll-motion-style/GRILL.md
    - components/scroll-container.tsx
    - app/layout.tsx
    - app/globals.css
  extracted: ~80%
  inferred: ~15%
  ambiguous: ~5%
---

# Scroll Architecture — Custom Container

## Summary

The SuperSpecs site uses a custom `ScrollContainer` div instead of native `body`/`window` scroll. The `body` has `overflow: hidden`; all scrolling happens inside `div.scroll-container` (`overflow-y: auto; height: 100svh`). This enables precise framer-motion parallax, smooth `mix-blend-difference` on the header, and cleaner page transition behavior with signalgrau-100 visible at the edges.

## Context

Before `scroll-motion-style`, scroll was native (`body` scroll). This was sufficient for a static dark page but incompatible with two requirements that arrived together:

1. **framer-motion parallax** — `useScroll({ container })` requires a scrolling container ref; without it, parallax is bound to `window` and breaks on mobile or with custom scroll behavior.
2. **betteroff.studio page layout** — betteroff uses `overflow: hidden` on the page container with a custom scroll div for precise scroll-layered effects.

The custom container also resolves a visual artifact: with the body dark (`signalgray-800`), the Page Transition exit animation exposed a black void at the edges. With body set to `signalgray-100`, the warm light background fills that space.

## Architecture

```
body { overflow: hidden; background: signalgray-100 }
  └── ScrollContainer { overflow-y: auto; overflow-x: hidden; height: 100svh }
       └── ThemeProvider
            └── PageTransition  ← UNVERÄNDERT
                 └── pages
```

**Critical placement rule:** `ScrollContainer` is **outside** `ThemeProvider` + `PageTransition`. Never inside.

### Why outside PageTransition?

`PageTransition` captures page snapshots via `liveRef.current.getBoundingClientRect().top`. This value encodes the scroll offset at the moment of capture. If `ScrollContainer` were inside `PageTransition`, `liveRef` would be the outer wrapper (not the scroll container), and `getBoundingClientRect().top` would always return `0` — the clone would render at the wrong position.

With `ScrollContainer` outside, `PageTransition`'s `liveRef` sits inside the scroll container. `getBoundingClientRect().top` measures against the viewport — which already accounts for the container's scroll offset because `getBoundingClientRect()` is always viewport-relative. Result: page transitions remain pixel-perfect at any scroll position.

See [[page-transitions]] for the full `liveRef` snapshot mechanic.

## Implementation

**`components/scroll-container.tsx`** — new file:

```tsx
"use client";
import { createContext, type RefObject, useContext, useRef } from "react";

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
        style={{ overflowY: "auto", overflowX: "hidden", height: "100svh", overscrollBehavior: "none" }}
      >
        {children}
      </div>
    </ScrollContext.Provider>
  );
}
```

**`app/layout.tsx`** — placement:

```tsx
<ScrollContainer>
  <ThemeProvider ...>
    <PageTransition>{children}</PageTransition>
  </ThemeProvider>
</ScrollContainer>
```

**`app/globals.css`** — body:

```css
html { overflow: hidden; }
body { overflow: hidden; background-color: var(--signalgray-100); }
```

## Consuming scroll in components

All components that use framer-motion scroll must reference the container:

```tsx
import { useScrollContainer } from "@/components/scroll-container";
import { useScroll, useTransform } from "framer-motion";

const scrollContainer = useScrollContainer();
const { scrollYProgress } = useScroll({
  target: sectionRef,
  container: scrollContainer,       // ← always pass the container
  offset: ["start start", "end start"],
});
```

**Rule:** Never use `useScroll()` without `container: scrollContainer`. Without it, framer-motion falls back to `window` scroll which is always `0` in this architecture.

## Body Background

`body { background-color: var(--signalgray-100) }` — the warm light signalgrau color.

**Why:** During the Page Transition exit animation, the outgoing page scales up and fades out. Before this change, the body behind it was `signalgray-800` (dark) — creating a visible dark void at the edges. With `signalgray-100`, the warm light background shows through naturally, matching the Hero section color. The transition reads as the page "launching into" the light rather than into a void.

## Key Decisions

### ScrollContainer outside PageTransition (Option B)

**Chose:** `ScrollContainer` wraps `ThemeProvider + PageTransition` in layout.tsx.
**Over:** `ScrollContainer` as a child inside `PageTransition`'s render (Option A).
**Because:** `getBoundingClientRect().top` in `PageTransition` must remain viewport-relative. Option A would have broken the snapshot-clone mechanic. See Grill Q1 in `specs/scroll-motion-style/GRILL.md`.
**Trade-off:** None — Option B is strictly better. PageTransition is completely untouched.

### overscrollBehavior: none

**Chose:** `overscrollBehavior: "none"` on the scroll container.
**Over:** Default (which allows pull-to-refresh and bounce on some browsers).
**Because:** Parallax effects and the Page Transition animation conflict visually with browser-native bounce/overscroll. Removing it gives predictable scroll behavior. ^[inferred]

## Gotchas

- **`window.scrollY` is always 0:** This is expected. All scroll state lives in the container. Code that reads `window.scrollY` will always see `0` — use `scrollContainerRef.current.scrollTop` instead, or `useScroll({ container })`.

- **`position: sticky` on Docs sidebar:** Works correctly — `position: sticky` needs a scrolling ancestor, and `ScrollContainer` provides one. No special handling needed.

- **`whileInView` viewport measurement:** framer-motion's `whileInView` uses `IntersectionObserver` with `root: null` (the browser viewport). Since `ScrollContainer` is `height: 100svh` and covers the full viewport, the observed area equals the visible area. No `root` prop needed on `viewport={{}}`.

- **mix-blend-difference during Page Transition:** The fixed header has `mix-blend-difference`. During the ~1450ms page transition, `newRef` gets `position: relative + z-index + transform` — creating a stacking context that `mix-blend-difference` blends against. This causes a brief color artifact on the header during transition. Expected and accepted behavior — the animation dominates visually. ^[inferred]

## Open Questions

- [ ] Should `ScrollContainer` be extracted from `layout.tsx` into a separate server/client boundary to reduce client JS on all routes? Currently it makes all layout children implicitly client-aware. ^[inferred]

## Related

- [[page-transitions]] — the snapshot-clone mechanic that `ScrollContainer` placement must not break
- [[scroll-motion-system]] — parallax + light/dark section system built on this architecture
- `components/scroll-container.tsx` — the container component + context
- `app/layout.tsx` — integration point
- `app/globals.css` — `overflow: hidden` + `background-color: var(--signalgray-100)`
