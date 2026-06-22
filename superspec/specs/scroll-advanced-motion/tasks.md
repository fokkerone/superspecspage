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

## Wave 2 — Sticky Sections (parallel)

Both tasks are independent — they touch different files.

### Task 2.1 — Hero Sticky
**What:** Add `position: sticky; top: 0` to the Hero `<section>` in `hero.tsx`. Add `z-index: 10` to the Terminal `<section>` in `terminal.tsx` so it renders above the sticky Hero when scrolling over it.

**Files to modify:**
- `components/landing/hero.tsx` (add sticky + z-index 0 to section)
- `components/landing/terminal.tsx` (add z-index 10 to section)

**Test requirement:**
Write tests in `__tests__/sticky-sections.test.ts` (source-based) that verify:
- `hero.tsx` section contains `sticky` class or style
- `hero.tsx` section contains `top-0` or `top: 0`
- `terminal.tsx` section contains `z-10` or `z-index: 10`

**Done when:**
- New tests pass
- All pre-existing tests pass
- `tsc --noEmit` clean

### Task 2.2 — Features Sticky
**What:** Add `position: sticky; top: 0` to the Features `<section>` in `features.tsx`. Add `z-index: 10` to the Agents `<section>` in `agents.tsx`.

**Files to modify:**
- `components/landing/features.tsx` (add sticky to section)
- `components/landing/agents.tsx` (add z-index 10 to section)

**Test requirement:**
Extend `__tests__/sticky-sections.test.ts` with:
- `features.tsx` section contains `sticky` and `top-0` / `top: 0`
- `agents.tsx` section contains `z-10` or `z-index: 10`

**Done when:**
- New tests pass
- All pre-existing tests pass
- `tsc --noEmit` clean

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
- [ ] All tests passing (≥264, zero skipped, zero pending)
- [ ] Every scenario in spec.md has a corresponding passing test
- [ ] `tsc --noEmit` clean
- [ ] `biome check` clean
- [ ] `next build` clean
- [ ] No regressions in pre-existing tests
- [ ] Visually verified in browser: scale+x on headline, sticky Hero + Terminal overlap, sticky Features + Agents overlap
