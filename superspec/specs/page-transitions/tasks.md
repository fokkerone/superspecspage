# Implementation Tasks: Page Transitions

## Context Window Budget
Estimated spec + tasks tokens: ~8k / 200k ✅

---

## Wave 1 — Foundation

Install framer-motion and establish the transition variants file. No UI changes yet.

### Task 1.1: Install framer-motion
**What:** Add `framer-motion` to `package.json` dependencies via npm install.
**Files to create/modify:**
- `package.json` (updated by npm)
- `package-lock.json` (updated by npm)
**Test requirement:** Verify `import { motion } from "framer-motion"` compiles without error in a TypeScript file.
**Done when:** `next build` completes cleanly with framer-motion installed; no type errors.

### Task 1.2: Create `lib/transitions.ts`
**What:** Define and export named transition variants. Export `slideDown` as the initial active variant. Also export a second variant `fadeOnly` as a placeholder for swappability demonstration.
**Files to create/modify:**
- `lib/transitions.ts` (new)
**Test requirement:** TypeScript type-checks both exports as `Variants` from framer-motion with no `any` types.
**Done when:** File exports `slideDown` and `fadeOnly`, both typed as `Variants`, `tsc --noEmit` passes.

---

## Wave 2 — Wrapper Component

Build the `PageTransitionWrapper` client component. Depends on Wave 1.

### Task 2.1: Create `components/page-transition-wrapper.tsx`
**What:** Client component that:
1. Calls `usePathname()` to get the current route as a stable key
2. Wraps children in `<AnimatePresence mode="wait">`
3. Wraps children in a `<motion.div>` keyed by pathname, using the `slideDown` variant from `lib/transitions.ts`
4. Sets `position: fixed; inset: 0; overflow-y: auto` on the motion.div so it fills the viewport and the header stacking context is not broken
**Files to create/modify:**
- `components/page-transition-wrapper.tsx` (new)
**Test requirement:** Component renders children without crashing; pathname change causes a re-key (test with React Testing Library or Playwright visual check).
**Done when:** Component renders, TypeScript passes, no `any` types.

### Task 2.2: Integrate wrapper into `app/layout.tsx`
**What:** Import `PageTransitionWrapper` into the root layout and wrap the `{children}` slot with it. The `ThemeProvider` remains the outermost wrapper; `PageTransitionWrapper` is directly inside it, wrapping only `{children}`.
**Files to create/modify:**
- `app/layout.tsx` (modified)
**Test requirement:** `next build` completes; navigating `/` → `/docs` in the browser shows the exit animation.
**Done when:** Build passes, manual browser verification shows slide-down transition.

---

## Wave 3 — Scroll & Z-Index Polish

Fix the two known risks: scroll position and header z-index. Depends on Wave 2.

### Task 3.1: Fix scroll position on navigation
**What:** Ensure the window scrolls to the top of the incoming page only after the exit animation completes. Implement via `onExitComplete` callback on `AnimatePresence` that calls `window.scrollTo(0, 0)`.
**Files to create/modify:**
- `components/page-transition-wrapper.tsx` (modified)
**Test requirement:** Playwright test: scroll 500px on `/`, navigate to `/docs`, assert scroll position is 0 after transition.
**Done when:** No visible scroll-jump; scroll position is 0 on the incoming page.

### Task 3.2: Verify header z-index integrity
**What:** Confirm `Header` component (`components/landing/header.tsx`) remains visually above the sliding page during exit. If the `motion.div` creates a conflicting stacking context, apply `isolation: isolate` or adjust `z-index` on the wrapper.
**Files to create/modify:**
- `components/page-transition-wrapper.tsx` (possibly modified)
- `components/landing/header.tsx` (possibly modified — z-index bump if needed)
**Test requirement:** Playwright screenshot during mid-animation: header is visible over the sliding content.
**Done when:** Header is never occluded during any transition in manual and automated testing.

---

## Done Criteria

The feature is DONE when:
- [ ] All tasks complete
- [ ] `next build` passes with Turbopack — zero errors, zero warnings
- [ ] `tsc --noEmit` passes — zero type errors
- [ ] Navigation `/` → `/docs` shows slide-down exit, new page visible behind
- [ ] Navigation `/docs/introduction` → `/docs/quick-start` shows same transition
- [ ] Header is visible above sliding page throughout
- [ ] Scroll position is 0 on incoming page after transition
- [ ] Swapping import in `PageTransitionWrapper` from `slideDown` to `fadeOnly` changes the animation globally
- [ ] No individual `page.tsx` contains animation code
- [ ] Code review passed — no Critical findings
