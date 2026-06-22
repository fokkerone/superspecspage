---
title: UI Domain — Index
tags: [ui, index]
created: 2026-06-22
updated: 2026-06-22
---

# UI Domain

Frontend patterns, component architecture, routing behaviour, and styling decisions for the SuperSpecs homepage.

## Pages

| Page | Summary |
|------|---------|
| [[design-system]] | Signalgray palette, CSS token architecture, typography, shape rules, font-extrabold exception |
| [[easing]] | Two-curve easing system (`EASE_ENTER` / `EASE_EXIT`), `lib/easing.ts` |
| [[component-patterns]] | Link-underline, CTA patterns A+B, section label, card grid, terminal mockup |
| [[page-transitions]] | Snapshot-clone page transition: DOM clone on mousedown, 1450ms, two-curve easing |
| [[scroll-architecture]] | Custom scroll container: why it's outside PageTransition, body bg, ScrollContext |
| [[scroll-motion-system]] | Mega-headline parallax, light/dark sections, whileInView reveals |

## Related domains

- [[techstack/profile]] — full stack overview including UI dependencies
