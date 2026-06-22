# Implementation Tasks: Advanced Scroll Motion

**Spec:** superspec/specs/scroll-advanced-motion/spec.md
**Slug:** scroll-advanced-motion

---

## Context Window Budget
Estimated spec + task tokens: ~20k / 200k ✅

---

## Wave 0 — Foundation (prerequisite for sticky)

Must complete before any sticky work. `overflow-x: hidden` on the ScrollContainer blocks `position: sticky` in Safari.

### Task 0.1 — ScrollContainer: overflow-x: hidden → overflow-x: clip
**What:** Change `overflowX: "hidden"` to `overflowX: "clip"` in `components/scroll-container.tsx`. `overflow: clip` clips content without creating a scroll container — does not block `position: sticky` in any browser. Also update the test in `__tests__/scroll-container.test.tsx` that asserts `overflow-x: hidden` (if one exists).

**Files to modify:**
- `components/scroll-container.tsx`

**Test requirement:**
Update `__tests__/scroll-container.test.tsx`:
- Change the `overflow-x hidden` assertion to verify `overflowX` is `"clip"` (not `"hidden"`)

**Done when:**
- Updated test passes
- All pre-existing scroll-container tests pass
- `tsc --noEmit` clean
- `biome check` clean

---

## Wave 1 — Headline Scale + Horizontal (hero.tsx only)

Single file change. No dependencies on Wave 2.

### Task 1.1 — Headline Scale + X Transform
**What:** Add `scale` and `x` `useTransform` values to the mega-headline in `hero.tsx`. Both use the existing `scrollYProgress` (same `useScroll` call, same `offset`). All three transforms (`y`, `scale`, `x`) applied to the same `motion.h1`. `useReducedMotion()` fallback: `scale` locked at `[1, 1]`, `x` locked at `["0%", "0%"]` when reduced motion is preferred.

**Files to modify:** `components/landing/hero.tsx`

**Test requirement:**
Write tests in `__tests__/hero-scale.test.ts` (source-based) that verify:
- `hero.tsx` contains `scale` transform reference
- `hero.tsx` contains `x` transform reference  
- `hero.tsx` still contains `useReducedMotion`
- `hero.tsx` still contains `y` transform (existing parallax preserved)
- `hero.tsx` still contains `clipPath` (entry animation preserved)

**Done when:**
- All new tests pass
- All 264 pre-existing tests pass
- `tsc --noEmit` clean
- `biome check` clean

---

## Wave 2 — Section Parallax (parallel)

Both tasks are logically independent — different component files.

### Task 2.1 — Dark Sections Parallax
**What:** Add a subtle vertical parallax transform to Terminal, Problem, HowItWorks, Agents, and Install sections. Each section gets its own `useRef` + `useScroll({ target, container, offset: ["start end", "end start"] })` + `useTransform(scrollYProgress, [0, 1], ["3%", "-3%"])`. Apply the transform as `y` on the section's outer wrapper via `motion.section` or a wrapping `motion.div`. `useReducedMotion()` fallback: `["0%", "0%"]`. All sections remain in normal document flow — no `position: sticky` or `fixed`.

**Files to modify:**
- `components/landing/terminal.tsx`
- `components/landing/problem.tsx`
- `components/landing/how-it-works.tsx`
- `components/landing/agents.tsx`
- `components/landing/install.tsx`

**Test requirement:**
Write tests in `__tests__/section-parallax.test.ts` (source-based) that verify for each file:
- Contains `useScroll` import or usage
- Contains `useTransform` import or usage
- Contains `useReducedMotion`
- Contains `"3%"` and `"-3%"` (parallax range)
- Does NOT contain `sticky` or `position: fixed`

**Done when:**
- All new tests pass
- All 275 pre-existing tests pass
- `tsc --noEmit` clean
- `biome check` clean

### Task 2.2 — Light Sections Parallax (Hero + Features)
**What:** Add the same parallax pattern to Hero (in addition to existing scale+x+y) and Features. Hero already has `useScroll` — add `sectionParallaxY = useTransform(scrollYProgress, [0, 1], ["2%", "-2%"])` as a wrapper-level Y on the outer container div (not on the headline — that already has its own transforms). Features gets its own `useRef` + `useScroll` + `useTransform(scrollYProgress, [0, 1], ["2%", "-2%"])` applied to a `motion.section` or wrapping `motion.div`.

Note: Hero's existing `scrollYProgress` uses `offset: ["start start", "end start"]` for the headline — the section-level parallax uses `offset: ["start end", "end start"]` for the full viewport pass-through. These are two different `useScroll` calls, or the existing one is reused if the offset works.

**Files to modify:**
- `components/landing/hero.tsx`
- `components/landing/features.tsx`

**Test requirement:**
Extend `__tests__/section-parallax.test.ts` with:
- `hero.tsx` contains section-level parallax (separate from headline transforms) — look for `sectionY` or second `useTransform` for the outer wrapper
- `features.tsx` contains `useScroll` and parallax Y transform

**Done when:**
- New tests pass
- All pre-existing tests pass
- `tsc --noEmit` clean
- `biome check` clean

---

## Wave 3 — Build Verification

### Task 3.1 — Final Build + Regression Check
**What:** Run the full test suite, `tsc --noEmit`, `biome check`, and `next build`. Verify zero regressions. Verify Header z-50 is not overridden in any modified file.

**Files to check:** All modified files from Waves 1–2

**Test requirement:** No new tests — this task is verification only.

**Done when:**
- `npx vitest run` → all tests pass (≥264, zero failing, zero skipped)
- `npx tsc --noEmit` → clean
- `npx biome check .` → clean  
- `npm run build` → clean

---

## Done Criteria

The feature is DONE when:
- [ ] All tasks complete
- [ ] All tests passing (≥275, zero skipped, zero pending)
- [ ] Every scenario in spec.md has a corresponding passing test
- [ ] `tsc --noEmit` clean
- [ ] `biome check` clean
- [ ] `next build` clean
- [ ] No regressions in pre-existing tests
- [ ] Visually verified in browser: scale+x on headline, sections glide smoothly with parallax offsets, no gaps between sections
