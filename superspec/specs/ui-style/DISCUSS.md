# Discussion: UI Style — Design System & Visual Language

Date: 2026-06-22
Participants: human + AI

## What We're Building

A comprehensive visual design system for the SuperSpecs homepage, documented in a machine-readable `DESIGN.md` at the project root. The design language is inspired by two reference sites — betteroff.studio and richardekwonye.com — and defines every visual decision an AI coding agent would need to implement or extend the site consistently.

The style direction is: **warm editorial dark**. No color accents. Pure greyscale hierarchy. Deliberate, premium motion. Humanist grotesque typography. The aesthetic should feel like the tool it documents — precise and architectural, nothing wasted.

## Goals

- Establish a single source of truth for all visual decisions (colors, typography, spacing, motion, components)
- Make the design language machine-readable so AI agents can implement any new component consistently
- Replace the current cold-black + emerald-accent + pill-button aesthetic with the warm, greyscale, editorial reference aesthetic
- Define a font migration path: Geist Sans → DM Sans (free PP Neue Montreal alternative)
- Define motion language: underline-scrub hovers, clip-path reveals, `cubic-bezier(0.62, 0.05, 0.01, 0.99)` easing throughout

## Non-Goals (explicitly out of scope)

- Implementing the design changes (this discussion and DESIGN.md are planning artifacts — implementation is a separate spec)
- Light mode for the landing page
- Custom font licensing (PP Neue Montreal) — using DM Sans as a free alternative
- Docs section redesign (same tokens apply but docs layout is a separate concern)
- Any backend, API, or content changes
- Mobile navigation / hamburger menu (landing page is simple enough without it)

## Constraints

- **Technical:** Next.js 15 App Router + Tailwind v4 + SSG. All tokens defined as CSS custom properties via `@theme inline {}` in `globals.css`.
- **Technical:** Framer-motion already installed (`^12.40.0`). All intentional animations use it. CSS transitions only for immediate feedback (200ms color/opacity shifts).
- **Technical:** DM Sans loaded via `next/font/google` — replaces current Geist Sans. Geist Mono stays for code/mono contexts.
- **Scope:** `DESIGN.md` is a documentation artifact. The implementation spec (migrating existing components) is a follow-on task.
- **Scope:** The emerald accent (`#34d399`) is removed entirely. No color accent replaces it.

## Key Decisions Made

### Decision: No color accent
**We will:** Use a pure greyscale palette. Hierarchy through opacity, weight, and whitespace only.
**Because:** Both reference sites achieve premium feel without accent color. Emerald in the current site signals "startup template" more than "deliberate design."
**We won't:** Replace emerald with another accent (lavender, yellow-green, teal). One fewer decision for every future component.

### Decision: DM Sans over PP Neue Montreal
**We will:** Use DM Sans (Google Fonts, free) as the display and body typeface.
**Because:** PP Neue Montreal (€59 license) is used by both references for its humanist grotesque quality. DM Sans is the closest freely available equivalent — open apertures, neutral warmth, similar weight distribution.
**We won't:** Keep Geist Sans. It reads as a developer tool font (geometric, neutral, cold) which conflicts with the editorial warmth of the references.

### Decision: Warm near-black over cold near-black
**We will:** Use `#111110` as the background (warm undertone, ~2300K equivalent) instead of `#080808` (cold, blue-cast).
**Because:** betteroff.studio uses `#1e1e1e`. richardekwonye.com uses warm light grey. Both avoid pure-black. The warmth reads as intentional, not default.
**We won't:** Use `#000000` or pure cold blacks anywhere in the palette.

### Decision: Off-white primary text
**We will:** Use `#e8e6e3` as primary text color (warm off-white).
**Because:** betteroff uses `#e5e7df`. richard uses `#e1dfdd`. Pure white on dark reads as harsh; warm off-white reads as crafted.
**We won't:** Use `text-white` on the landing page.

### Decision: Underline-scrub hover pattern
**We will:** Use a double-underline scrub animation (draw in from left, retract from right) for all nav and text link hovers.
**Because:** Both references use this pattern. It's slower (650ms), more deliberate, and signals premium without color.
**We won't:** Use `hover:text-white` or `hover:opacity-100` as primary hover feedback.

### Decision: No border-radius on cards and buttons
**We will:** Use `rounded-none` for cards, panels, and CTA buttons. `rounded-sm` (2px) maximum.
**Because:** Both references are strictly geometric. Rounded shapes (especially `rounded-full` pills) signal consumer app aesthetics, which conflicts with the editorial positioning.
**We won't:** Use `rounded-full` for any button, badge, or pill shape.

### Decision: Easing curve
**We will:** Use `cubic-bezier(0.62, 0.05, 0.01, 0.99)` as the primary easing for all intentional motion.
**Because:** This is the exact curve from richardekwonye.com. It starts fast, settles extremely deliberately. The deceleration at the end is what creates the "premium" feel.
**We won't:** Use `ease-in-out`, `linear`, or Tailwind's default `cubic-bezier(0.4, 0, 0.2, 1)`.

### Decision: Font weights capped at 500
**We will:** Use weights 300 (display), 400 (body), 500 (labels/UI) only.
**Because:** PP Neue Montreal (and DM Sans) achieve visual hierarchy through the 300→500 contrast. 700 reads as aggressive next to the refined editorial style.
**We won't:** Use `font-bold` or `font-semibold` anywhere on the landing page.

### Decision: Fluid type scale via clamp()
**We will:** Use `clamp()` for all heading font sizes, defined as inline styles or CSS custom properties.
**Because:** Both references use viewport-relative fluid type (`vw` units with clamp bounds). Fixed Tailwind text classes create abrupt scale jumps at breakpoints.
**We won't:** Use `text-5xl md:text-7xl` patterns for display headings.

## Open Questions

- [ ] Should DM Sans be loaded at all weights (100–900) or just 300/400/500? (affects bundle size)
- [ ] Should the terminal mockup in the Hero section be replaced with a more typographic/editorial treatment — closer to how the references handle hero social proof?
- [ ] Does the docs section use the same greyscale design tokens, or is it allowed to have slightly more structure/contrast given its utility nature?
- [ ] Should the `<Install />` CTA section maintain its centered card format or be redesigned as a full-bleed editorial text block (closer to betteroff's big-type CTA)?

## Success Criteria

- [ ] `DESIGN.md` exists at repo root and is readable/parseable by an AI agent
- [ ] All color tokens are defined (background, foreground, muted, subtle, border, surface)
- [ ] Typography section covers typeface, scale, weights, line-heights, letter-spacing
- [ ] Motion section covers easing curve, duration scale, hover patterns, and text reveal patterns
- [ ] Component section covers: Header, Section Label, Heading, Body, CTA, Cards, Terminal Mockup, Dividers
- [ ] Do/Don't rules section explicitly lists what AI agents must not do
- [ ] Reference annotations section documents which values came from which reference site

## Risks

- **DM Sans parity:** DM Sans is not identical to PP Neue Montreal. At large display sizes the difference may be noticeable. Mitigation: evaluate at `clamp(3rem, 8vw, 8rem)` before committing.
- **Greyscale legibility:** Removing all color accent requires text hierarchy and spacing to carry full weight. If the implementation is dense, the lack of accent will read as blank rather than refined. Mitigation: enforce generous `py-40` section spacing in DESIGN.md.
- **Emerald removal breaks existing brand recognition:** The emerald accent is visible in GitHub repo, README, and any screenshots. Mitigation: this is a deliberate brand evolution, not a regression. Document it explicitly.

## Wiki References

- [[techstack/profile]] — stack constraints (Next.js 15, Tailwind v4, framer-motion)
- [[ui/page-transitions]] — existing motion system that DESIGN.md motion section must not contradict
