---
title: Scroll Motion System — Parallax, Light/Dark Sections, Viewport Reveals
summary: The landing page scroll motion system. Mega-headline parallax on the Hero, alternating light/dark section backgrounds (signalgray-100 / signalgray-800), and whileInView reveal animations on all sections. Inspired by signalgrau.vercel.app and betteroff.studio.
tags: [ui, animation, parallax, scroll, sections, light-dark, scroll-motion-style]
spec: "[[../specs/scroll-motion-style/spec.md]]"
created: 2026-06-22
updated: 2026-06-22
provenance:
  sources:
    - specs/scroll-motion-style/spec.md
    - specs/scroll-motion-style/DISCUSS.md
    - specs/scroll-motion-style/GRILL.md
    - components/landing/hero.tsx
    - components/landing/features.tsx
    - components/landing/terminal.tsx
  extracted: ~80%
  inferred: ~15%
  ambiguous: ~5%
---

# Scroll Motion System — Parallax, Light/Dark Sections, Viewport Reveals

## Summary

Three interconnected visual systems built for the landing page in the `scroll-motion-style` spec:

1. **Mega-headline parallax** — the Hero headline scrolls at −25% speed relative to the page, using framer-motion `useScroll` + `useTransform` bound to the [[scroll-architecture|custom scroll container]].
2. **Light/Dark section alternation** — the page alternates between `signalgray-100` (warm light) and `signalgray-800` (dark) sections, inspired by betteroff.studio.
3. **Viewport reveal animations** — all major section elements fade+slide-up when entering the viewport, using framer-motion `whileInView`.

References: signalgrau.vercel.app (mega-headline mechanic), betteroff.studio (section alternation, page structure).

## Context

Before this spec the landing page was uniformly dark (`bg-signalgray-800`) with no scroll animations beyond the Hero clip-path entry. The entire page felt static and monochrome. The `scroll-motion-style` spec introduced:

- A custom scroll container (see [[scroll-architecture]])
- Light sections (`signalgray-100`) as a visual counterweight to the dark sections
- The signalgrau mega-headline mechanic applied to "AI coding that compounds."
- `whileInView` reveals on every major section as the user scrolls

## Section Map

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

Two light sections — Hero and Features — create two contrast shifts as the user scrolls. More alternations were considered and rejected as visually overwhelming. ^[inferred]

## Mega-Headline Parallax

### How it works

`hero.tsx` uses `useScroll` + `useTransform` from framer-motion, bound to the [[scroll-architecture|custom scroll container]]:

```tsx
const scrollContainer = useScrollContainer();
const { scrollYProgress } = useScroll({
  target: sectionRef,
  container: scrollContainer,
  offset: ["start start", "end start"],
});
const headlineY = useTransform(
  scrollYProgress,
  [0, 1],
  prefersReduced ? ["0%", "0%"] : ["0%", "-25%"],
);
```

`scrollYProgress` goes from `0→1` as the Hero section scrolls from top-of-viewport to off-screen-top. The headline moves −25% at full scroll-through — a subtle, premium parallax rather than a dramatic effect.

### Clip-path entry animation (preserved)

The existing clip-path reveal plays on first load (no referrer = direct visit):

```tsx
<motion.div
  initial={shouldAnimate ? { clipPath: "inset(100% 0 0 0)" } : false}
  animate={{ clipPath: "inset(0% 0 0 0)" }}
  transition={{ duration: 1.25, ease: EASE_ENTER_TUPLE }}
>
  <motion.h1 style={{ y: headlineY }}>...</motion.h1>
</motion.div>
```

Clip-path on the outer `motion.div`, parallax `y` on the inner `motion.h1` — no conflict between the two transforms.

### Mega-headline sizing

```tsx
style={{
  fontSize: "clamp(5rem, 15vw, 18rem)",
  letterSpacing: "-0.03em",
  lineHeight: 0.95,
  willChange: "transform",
}}
className="font-extrabold text-signalgray-800 whitespace-nowrap"
```

`font-extrabold` (800) is explicitly permitted only for this element. All other headings remain `font-light` (300). See [[design-system#font-extrabold exception]].

The headline is intentionally wider than the viewport — `whitespace-nowrap` prevents wrapping; the section's `overflow-hidden` clips the overflow. The overflow will be further animated in a future spec. ^[inferred]

### Hero layout

`justify-between` — Eyebrow at top (`pt-20 md:pt-24` for header clearance), Mega-Headline + Sub-Text + CTA at bottom. Large empty space in the middle creates editorial breathing room.

## Light Section — Opacity Tier Mapping

The dark-background opacity tiers (`text-white/60` etc.) are **not** directly portable to `signalgray-100`. On a light background, low opacities produce insufficient contrast.

| Usage | Dark-bg class | Light-bg equivalent | Contrast on signalgray-100 |
|---|---|---|---|
| Headings | `text-white` | `text-signalgray-800` | ~11:1 AAA ✅ |
| Body | `text-white/70` | `text-signalgray-800/90` | ~9:1 AAA ✅ |
| Muted body | `text-white/60` | `text-signalgray-800/70` | ~6:1 AA ✅ |
| Captions/labels | `text-white/50` | `text-signalgray-800/70` | ~6:1 AA ✅ |
| **Minimum readable** | — | `text-signalgray-800/70` | — |
| Decorative | `text-white/40` | `text-signalgray-800/50` | ~4.5:1 ✅ |

**Rule:** `/70` is the floor for readable text on `signalgray-100`. Never use `/60` or below for body copy on light sections. This was caught in the grill session (Q13) before implementation.

## whileInView Reveal Pattern

All major section elements use the same pattern:

```tsx
<motion.h2
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.7, ease: EASE_ENTER_TUPLE }}
>
```

Key decisions:
- `once: true` — elements animate in once, never re-animate on scroll-back
- `margin: "-100px"` — triggers slightly before the element enters the viewport (earlier reveal)
- `duration: 0.7` — consistent with the easing system's "medium reveal" duration
- `EASE_ENTER_TUPLE` — the canonical entry curve from [[easing]]
- `y: 40` initial offset — enough to read as motion, not so much as to feel theatrical

### Staggered variants

HowItWorks phase cards use index-based delay:
```tsx
transition={{ duration: 0.7, delay: i * 0.1, ease: EASE_ENTER_TUPLE }}
```

Feature cards use a tighter stagger:
```tsx
transition={{ duration: 0.6, delay: i * 0.08, ease: EASE_ENTER_TUPLE }}
```

### whileInView and the scroll container

framer-motion's `whileInView` uses `IntersectionObserver` with `root: null` (viewport). Since `ScrollContainer` is `height: 100svh`, the observable area equals the visible area. No `root` prop is needed — standard `viewport={{ once: true, margin: "..." }}` works correctly.

## Terminal Section

The Terminal mockup was extracted from `hero.tsx` into its own `components/landing/terminal.tsx` during this spec. Reasons:

1. A dark terminal on a light Hero background looked wrong visually
2. It was conceptually a separate "Install / First Look" section
3. It gives its own `bg-signalgray-800` background and `whileInView` reveal

The terminal content itself is unchanged. See `components/landing/terminal.tsx`.

## Key Decisions

### font-extrabold only for Mega-Headline

**Chose:** `font-extrabold` (800) as explicit exception for the Hero h1.
**Over:** Keeping `font-light` (300) which is the rule for all other headings.
**Because:** The visual impact of the mega-headline comes from the combination of extreme size + extreme weight. At `clamp(5rem, 15vw, 18rem)`, `font-light` reads as fragile and unintentional. signalgrau.vercel.app uses `font-extrabold` for the same mechanic. ^[inferred]
**Trade-off:** One more exception to track. Documented in `DESIGN.md §17` and enforced by the global audit test.

### Eyebrow top, Headline bottom (justify-between)

**Chose:** `justify-between` — eyebrow pinned top, headline+CTA pinned bottom.
**Over:** `justify-end` (all content at bottom) or `justify-start` (all at top).
**Because:** betteroff.studio uses this layout — the large empty space in the middle creates an editorial "above-the-fold" feeling. The eyebrow functions as a subtle context-setter without competing with the headline.
**Trade-off:** The empty center space may feel sparse on small viewports. Accepted — the headline fills much of the vertical space at small sizes due to `clamp(5rem, 15vw, 18rem)`.

### Two light sections (not more)

**Chose:** Hero + Features as light (`signalgray-100`). All others dark.
**Over:** More alternations (e.g. every other section).
**Because:** Two contrast shifts within one page is the betteroff.studio pattern. More alternations were considered but felt "striped" and reduced the impact of each shift.
**Trade-off:** The page skews dark overall. The Hero being light is the primary first impression.

### Parallax at −25% max

**Chose:** `["0%", "-25%"]` — subtle parallax, 25% max offset.
**Over:** Stronger values (−40%, −50%) for more dramatic effect.
**Because:** Values above 30% cause visible "lag" that reads as a bug rather than a design. −25% reads as intentional and premium. Stronger values will be introduced in a future "overflow-motion" spec when the headline animates further. ^[inferred]
**Trade-off:** The effect is subtle on small screens. Accepted.

## Gotchas

- **`"use client"` on all animated components:** framer-motion's `useScroll`, `useTransform`, `useReducedMotion`, and `whileInView` require client-side execution. All five landing sections that use animations must be `"use client"` components.

- **`useReducedMotion()` fallback:** All parallax transforms use `prefersReduced ? ["0%", "0%"] : ["0%", "-25%"]`. Without this, the site fails WCAG 2.3.3 (no animation preference). Tests verify `useReducedMotion` is imported in hero.tsx.

- **Overflow management:** Hero section has `overflow-hidden`. The scroll container has `overflow-x: hidden`. Both are needed — the hero clips the headline's right overflow; the container prevents a horizontal scrollbar if anything leaks.

## Open Questions

- [ ] Horizontal overflow motion on the mega-headline (text sliding in from right on load) — deferred to a future spec. The `overflow-hidden` infrastructure is already in place.
- [ ] Parallax on sections beyond the Hero — considered and deferred. The Terminal and Features sections are candidates. ^[inferred]
- [ ] Mobile parallax performance — on low-end devices, `will-change: transform` on large elements may cause paint issues. Not yet tested on real hardware.

## Related

- [[scroll-architecture]] — the custom scroll container this system depends on
- [[page-transitions]] — snapshot-clone mechanic; placement of ScrollContainer must not break it
- [[easing]] — `EASE_ENTER_TUPLE` used for all reveal transitions
- [[design-system]] — signalgray-100/200 tokens, opacity tiers
- `components/landing/hero.tsx` — mega-headline, parallax, justify-between layout
- `components/landing/terminal.tsx` — extracted terminal section
- `components/landing/features.tsx` — light section, AA-compliant text mapping
