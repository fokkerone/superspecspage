# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

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
