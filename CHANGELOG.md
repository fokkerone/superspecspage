# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- **Docs Layout** (`docs-layout` spec):
  - Three-column docs layout (`DocsSidebar` left, content center, `DocsTOC` right) — responsive: sidebar hidden below `lg`, TOC hidden below `xl`
  - `DocsSidebar` with section grouping, `order`-based sort, and active-link highlight via `usePathname()`
  - `DocsTOC` with `scrollIntoView` click handler — works inside `ScrollContainer` (no native `#id` navigation)
  - Velite docs schema extended with `toc` (auto-extracted via `s.toc()` + `rehype-slug`, or overridden by frontmatter) and `section` (derived from slug path)
  - `PageTransition` conditional skip for docs-internal navigation — no animation between `/docs/*` routes
  - 114 new tests — 315 total, 15/15 spec scenarios covered
  - Wiki: `ui/docs-layout`, updated `ui/page-transitions`

- **Advanced Scroll Motion** (`scroll-advanced-motion` spec):
  - Headline `scale(1.0→1.15)` + `x(0%→-8%)` scroll transforms — 3 simultaneous transforms on mega-headline (Y, Scale, X)
  - Section-level parallax on all 7 landing sections: `y: 0vh → -10vh` (dark), `0vh → -8vh` (light) — sections float slightly faster than native scroll
  - `useContainerScrollY()` helper exported from `scroll-container.tsx` — raw scrollTop MotionValue for custom scroll consumers
  - `overflow-x: clip` on ScrollContainer (replaces `hidden`) — fixes `position: sticky` in Safari
  - 43 new tests — 307 total, 16/16 spec scenarios covered

- **Scroll Motion & Light/Dark Sections** (`scroll-motion-style` spec):
  - Custom scroll container (`components/scroll-container.tsx`) — `body: overflow hidden`, `ScrollContext` for framer-motion parallax
  - Hero mega-headline: `font-extrabold`, `clamp(5rem, 15vw, 18rem)`, `whitespace-nowrap`, Parallax −25% on scroll via `useScroll + useTransform`
  - Light/dark section alternation: Hero + Features (`bg-signalgray-100`), all others `bg-signalgray-800`
  - Header `mix-blend-difference` — auto-inverts on both backgrounds, no `backdrop-blur`
  - `whileInView` reveal animations on all landing sections (fade+slide-up, `once: true`)
  - Terminal section extracted to `components/landing/terminal.tsx` — own dark section with reveal
  - Body background `signalgray-100` — warm light behind page transitions, no black void
  - `useReducedMotion()` fallback for all parallax and reveal animations
  - 98 new tests — 264 total, 26/26 spec scenarios covered
  - Wiki: `ui/scroll-architecture`, `ui/scroll-motion-system`

- Design system & visual language: signalgrau-derived signalgray oklch palette, `lib/easing.ts` motion constants, `.link-underline` hover utility, `DESIGN.md` machine-readable design reference
- Snapshot-clone page transition: `components/page-transition.tsx` replaces framer-motion `AnimatePresence` — DOM clone on mousedown, 1450ms two-curve animation, reduced-motion support
- Hero clip-path reveal animation on first page load (skipped on internal navigation via `document.referrer` check)
- 13 new test files, 164 total tests covering all 56 spec scenarios
- `biome.json` migrated from schema 2.0.0 to 2.5.0

### Changed

- Landing page background: `bg-[#080808]` → `bg-signalgray-800` (`oklch(0.2565 0.004 84.58)`)
- Docs section background: same migration + full `prose-*` class update (emerald → white opacity tiers, `font-medium` headings)
- All landing components: emerald accent removed, `font-bold`/`font-semibold` replaced with `font-light`/`font-medium`, `rounded-full` pill shapes replaced with `rounded-none`/`rounded-sm`, `hover:text-white` replaced with `.link-underline` pattern
- `--font-sans: var(--font-sans)` circular self-reference fixed to `--font-sans: var(--font-geist-sans)`

### Removed

- `components/page-transition-wrapper.tsx` (replaced by `components/page-transition.tsx`)
- `lib/transitions.ts` (replaced by `lib/easing.ts`)
- Emerald accent (`#34d399`) from all components
- `__tests__/transitions.test.ts`, `__tests__/page-transition-wrapper.test.tsx` (replaced by new tests)
