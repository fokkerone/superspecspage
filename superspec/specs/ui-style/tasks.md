# Implementation Tasks: UI Style — Design System & Visual Language

## Context Window Budget
Estimated spec + tasks tokens: ~18k / 200k ✅

---

## Wave 1 — Foundation (global tokens, easing constants, transition replacement)

These tasks establish the global design foundation. All Wave 2 component tasks depend on these being in place. Tasks 1.1, 1.2, 1.3, and 1.5 can run in parallel. Task 1.4 depends on 1.2. Task 1.6 is independent.

### Task 1.1: Add signalgray tokens + ease tokens + --font-sans binding to globals.css

**What:** Update `app/globals.css`:

1. In `:root {}` block, add the six signalgray oklch declarations (do NOT touch any existing shadcn vars):
```css
--signalgray-100: oklch(0.9074 0.0087 84.57);
--signalgray-200: oklch(0.8593 0.0122 79.78);
--signalgray-300: oklch(0.5109 0.002 67.78);
--signalgray-700: oklch(0.3985 0.0021 67.76);
--signalgray-800: oklch(0.2565 0.004 84.58);
--signalgray-900: oklch(0.1539 0.0021 106.64);
```

2. In `@theme inline {}` block, add (do NOT remove any existing shadcn entries):
```css
/* Bind --font-sans so html { @apply font-sans } resolves to Geist Sans */
--font-sans: var(--font-geist-sans);

/* signalgray palette */
--color-signalgray-100: var(--signalgray-100);
--color-signalgray-200: var(--signalgray-200);
--color-signalgray-300: var(--signalgray-300);
--color-signalgray-700: var(--signalgray-700);
--color-signalgray-800: var(--signalgray-800);
--color-signalgray-900: var(--signalgray-900);

/* Easing — canonical source: lib/easing.ts */
--ease-enter: cubic-bezier(0.6, 0, 0.24, 1);
--ease-exit:  cubic-bezier(0.82, 1, 0.36, 1);
```

**Files to modify:** `app/globals.css`

**Test requirement:** Write `__tests__/design-tokens.test.ts` (Vitest, jsdom) asserting:
- `document.documentElement` style has `--signalgray-800` set
- `next build` completes with no CSS parse errors (verify by running build in test script or checking build output)
- Existing `--background` shadcn token is still present (not removed)

**Done when:** All six signalgray tokens declared in `:root`, all exposed in `@theme inline`, `--font-sans` bound, `--ease-enter` and `--ease-exit` defined, existing shadcn tokens intact, `next build` passes.

---

### Task 1.2: Create lib/easing.ts — single source of truth for motion constants

**What:** Create `lib/easing.ts` with exactly these exports:

```ts
export const EASE_ENTER = "cubic-bezier(0.6, 0, 0.24, 1)" as const;
export const EASE_EXIT  = "cubic-bezier(0.82, 1, 0.36, 1)" as const;
export const EASE_ENTER_TUPLE = [0.6, 0, 0.24, 1] as const;
export const EASE_EXIT_TUPLE  = [0.82, 1, 0.36, 1] as const;
export const TRANSITION_DURATION = 1450;
```

No other logic. No imports. Pure constants.

**Files to create:** `lib/easing.ts`

**Test requirement:** Create `__tests__/easing.test.ts` asserting:
- `EASE_ENTER` equals `"cubic-bezier(0.6, 0, 0.24, 1)"`
- `EASE_EXIT` equals `"cubic-bezier(0.82, 1, 0.36, 1)"`
- `EASE_ENTER_TUPLE` deep-equals `[0.6, 0, 0.24, 1]`
- `EASE_EXIT_TUPLE` deep-equals `[0.82, 1, 0.36, 1]`
- `TRANSITION_DURATION` equals `1450`
- `EASE_ENTER` contains the same coordinates as `EASE_ENTER_TUPLE` (string-parse check: extract the four numbers from `EASE_ENTER` and compare to `EASE_ENTER_TUPLE`)

**Done when:** `lib/easing.ts` exists, all tests pass, `tsc --noEmit` passes.

---

### Task 1.3: Add .link-underline CSS utility class to globals.css

**What:** Add the `.link-underline` double-underline scrub class to `app/globals.css` using `var(--ease-enter)`. Add it after the `@layer base {}` block:

```css
@layer utilities {
  .link-underline {
    position: relative;
    display: inline-flex;
  }
  .link-underline::before {
    content: "";
    position: absolute;
    bottom: -0.2em;
    left: 0;
    right: 0;
    height: 1px;
    background: currentColor;
    transform: scaleX(1);
    transform-origin: right;
    transition: transform 650ms var(--ease-enter);
  }
  .link-underline:hover::before {
    transform: scaleX(0);
    transform-origin: right;
  }
  .link-underline::after {
    content: "";
    position: absolute;
    bottom: -0.2em;
    left: 0;
    right: 0;
    height: 1px;
    background: currentColor;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 650ms var(--ease-enter) 0.2s;
  }
  .link-underline:hover::after {
    transform: scaleX(1);
    transform-origin: left;
  }
}
```

**Files to modify:** `app/globals.css`

**Test requirement:** Add a test to `__tests__/design-tokens.test.ts` (or a new `__tests__/link-underline.test.ts`) asserting:
- `globals.css` source contains `.link-underline::before`
- `globals.css` source contains `var(--ease-enter)` (not a hardcoded cubic-bezier literal) in the transition
- `globals.css` source contains `650ms` for the transition duration
- Both `::before` and `::after` are defined

A file-read check (using `fs.readFileSync`) is sufficient — no browser rendering needed.

**Done when:** `.link-underline` class in `globals.css`, uses `var(--ease-enter)`, both pseudo-elements defined, `next build` passes.

---

### Task 1.4: Replace page transition — snapshot-clone mechanic

**What:** This task replaces the entire page-transition subsystem.

**Step 1 — Delete old files:**
- Delete `lib/transitions.ts`
- Delete `components/page-transition-wrapper.tsx`
- Delete `__tests__/transitions.test.ts`
- Delete `__tests__/page-transition-wrapper.test.tsx`

**Step 2 — Create `components/page-transition.tsx`:**

Port the signalgrau snapshot-clone component verbatim from `~/Downloads/signalgrau-main/components/page-transition.tsx`, with these modifications:

1. Import easing constants from `lib/easing.ts`:
```ts
import { EASE_ENTER, EASE_EXIT, TRANSITION_DURATION } from "@/lib/easing";
```

2. Replace the hardcoded constants at the top of the signalgrau file:
```ts
// DELETE these signalgrau lines:
const DURATION = 1450;
const EASE_ENTER = "cubic-bezier(0.6, 0, 0.24, 1)";
const EASE_EXIT = "cubic-bezier(0.82, 1, 0.36, 1)";

// They now come from the import above.
// In the component body, DURATION → TRANSITION_DURATION
```

3. Add `prefers-reduced-motion` check at the top of the animation `useEffect`:
```ts
const prefersReducedMotion = typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

useEffect(() => {
  if (!transitioning) return;
  if (prefersReducedMotion) {
    setFrozenPathname(pathname);
    return;
  }
  // ... rest of signalgrau animation logic unchanged ...
}, [transitioning, pathname]);
```

4. Add `"use client"` directive at the top (already present in signalgrau — verify it's there).

All other logic (snapshot capture, `useLayoutEffect`, `exitRef`/`newRef`/`liveRef`, DOM clipper, `setTimeout` cleanup) is ported exactly as-is from signalgrau.

**Step 3 — Update `app/layout.tsx`:**
- Replace `import { PageTransitionWrapper } from "@/components/page-transition-wrapper"` with `import { PageTransition } from "@/components/page-transition"`
- Replace `<PageTransitionWrapper>` with `<PageTransition>` (and `</PageTransitionWrapper>` with `</PageTransition>`)
- No other changes to `app/layout.tsx`

**Files to delete:** `lib/transitions.ts`, `components/page-transition-wrapper.tsx`, `__tests__/transitions.test.ts`, `__tests__/page-transition-wrapper.test.tsx`
**Files to create:** `components/page-transition.tsx`
**Files to modify:** `app/layout.tsx`

**Test requirement:** Create `__tests__/page-transition.test.tsx` (Vitest + jsdom + @testing-library/react) asserting:

```
1. Renders children without crashing
2. Does NOT contain "framer-motion", "AnimatePresence", or "motion." in its source
3. EASE_ENTER constant from lib/easing.ts matches the string used in the component's CSS transitions
4. EASE_EXIT constant from lib/easing.ts matches the string used in the component's CSS transitions
5. TRANSITION_DURATION from lib/easing.ts equals 1450
6. Snapshot capture: simulate mousedown on document, assert snapshotRef is populated (test via reading the component source for the mousedown capture pattern)
7. Reduced motion: mock window.matchMedia to return matches:true; simulate pathname change; assert frozenPathname updates synchronously (use fake timers)
8. No animation code in app/page.tsx (file read check: no framer-motion import)
9. No animation code in app/docs/[[...slug]]/page.tsx (file read check: no framer-motion import)
10. app/layout.tsx imports PageTransition (not PageTransitionWrapper) — file read check
```

**Done when:** Old files deleted, new component exists, `app/layout.tsx` updated, all 10 tests pass, `tsc --noEmit` passes, `next build` passes.

---

### Task 1.5: Add underline-scrub CSS utility class to globals.css

*(Already covered in Task 1.3 above. This task slot is reserved for the wiki update.)*

### Task 1.6: Update superspec/wiki/ui/page-transitions.md

**What:** Rewrite `superspec/wiki/ui/page-transitions.md` to document the new snapshot-clone architecture. The old framer-motion `AnimatePresence` architecture is completely removed. The new page should document:

- Summary: snapshot-clone page transition, 1450ms, two-curve easing
- Architecture: `components/page-transition.tsx`, imports from `lib/easing.ts`, mounted in `app/layout.tsx`
- How it works: mousedown capture → pathname change → exit overlay + new page enter
- Key decisions: why hand-rolled over AnimatePresence, why 1450ms, why two curves
- Patterns: reduced-motion instant swap
- Gotchas: programmatic navigation fallback, fixed header z-index
- Easing reference: `EASE_ENTER` / `EASE_EXIT` from `lib/easing.ts`

**Files to modify:** `superspec/wiki/ui/page-transitions.md`

**Test requirement:** None (wiki doc only). Verify the file no longer mentions `AnimatePresence`, `slideDown`, or `lib/transitions.ts`.

**Done when:** Wiki page updated, no references to old architecture remain.

---

## Wave 2 — Component Migration (all parallel)

All Wave 2 tasks are independent and can run in parallel once Wave 1 is complete. Each task must read `DESIGN.md` and `spec.md` before implementation.

### Task 2.1: Migrate Hero component

**What:** Rewrite `components/landing/hero.tsx`:

**Remove:**
- `bg-emerald-500/10 blur-[120px]` glow div
- Grid background overlay (`backgroundImage: linear-gradient(...)`)
- `rounded-full` pill badge with `animate-pulse` dot
- `text-emerald-400` on "compounds." heading span
- `font-bold` on `<h1>`
- Emerald-filled primary CTA (`bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-full`)
- Secondary CTA `rounded-full`
- `import { Badge }` (dead import if present)

**Add:**
- Monospace eyebrow: `<p className="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-white/50 mb-4">`
- Fluid heading: `<h1 style={{ fontSize: "clamp(3rem, 8vw, 8rem)", letterSpacing: "-0.03em", lineHeight: 1.05 }} className="font-light text-white">`
- Hero clip-path reveal (first-load only, referrer check):
  ```tsx
  "use client";
  import { useEffect, useState } from "react";
  import { motion } from "framer-motion";
  import { EASE_ENTER_TUPLE } from "@/lib/easing";

  const [shouldAnimate, setShouldAnimate] = useState(false);
  useEffect(() => {
    const isInternalNav = Boolean(document.referrer) &&
      new URL(document.referrer).origin === window.location.origin;
    if (!isInternalNav) setShouldAnimate(true);
  }, []);
  // ...
  <motion.h1
    initial={shouldAnimate ? { clipPath: "inset(100% 0 0 0)", y: "80%" } : false}
    animate={{ clipPath: "inset(0% 0 0 0)", y: "0%" }}
    transition={{ duration: 1.25, ease: EASE_ENTER_TUPLE }}
  >
  ```
- One primary CTA (Pattern B: `border border-white/15 px-6 py-3 text-sm font-medium text-white hover:border-white/25 transition-colors duration-200 rounded-sm`)
- Terminal mockup per `DESIGN.md §7` with `bg-signalgray-900`, window dots `w-2.5 h-2.5 rounded-full bg-white/10` (explicit terminal-dot exception)
- Monospace prompt: `text-white/70` for `$`, `text-white` for command text

**Files to modify:** `components/landing/hero.tsx`

**Test requirement:** Write `__tests__/hero.test.tsx` asserting:
- (a) No `text-emerald-*` or `bg-emerald-*` in rendered HTML
- (b) No `rounded-full` on the primary CTA element
- (c) The `<h1>` or `motion.h1` has `style` containing `clamp(3rem`
- (d) `shouldAnimate` is `false` when `document.referrer` matches current origin (mock `document.referrer` in test)
- (e) `shouldAnimate` is `true` when `document.referrer` is empty string (first load)
- (f) No `font-bold` or `font-semibold` in component source (file-read check)

**Done when:** All 6 assertions pass, no emerald classes remain, `next build` passes.

---

### Task 2.2: Migrate Header component

**What:** Rewrite `components/landing/header.tsx`:

**Remove:**
- `bg-[#080808]/80` → replace with `bg-signalgray-800/80`
- `border-white/[0.06]` → replace with `border-white/10`
- `text-emerald-400` on "SPECS" span
- `font-bold` on logo
- Emerald-filled "Get Started" CTA button (entire `<Link>` block)
- `hover:text-white transition-colors` on nav links → replace with `.link-underline`
- `import { Badge }` (dead import if present)

**Add:**
- Background: `bg-signalgray-800/80 backdrop-blur-md`
- Logo: `<span className="font-mono font-medium text-sm tracking-tight text-white">SUPER<span style={{ opacity: 0.4 }}>SPECS</span></span>`
- Nav links: add `link-underline` class, remove `hover:text-white`
- No CTA button in header

**Files to modify:** `components/landing/header.tsx`

**Test requirement:** Write `__tests__/header.test.tsx` asserting:
- (a) No `emerald` class anywhere in rendered output
- (b) Header element has `h-14` class
- (c) Each nav `<Link>` has `link-underline` in its className
- (d) No `font-bold` in component source (file-read check)
- (e) No "Get Started" CTA button rendered (`bg-emerald-500` not present)
- (f) Mobile: nav links are hidden at `375px` viewport (assert `hidden` class on nav)

**Done when:** All 6 assertions pass, `next build` passes.

---

### Task 2.3: Migrate Features component

**What:** Rewrite `components/landing/features.tsx`:

**Remove:**
- `text-emerald-400/60` on icon spans
- `font-bold` and `font-semibold` on headings
- Fixed `text-3xl md:text-4xl` heading class
- `text-xs font-mono text-emerald-400` eyebrow text
- `rounded-xl overflow-hidden` on card grid → `rounded-none`
- `bg-white/[0.06]` on grid → `bg-white/10`
- `bg-[#080808]` on cards → `bg-signalgray-800`
- `hover:bg-white/[0.02]` on cards → `hover:bg-signalgray-900`

**Add:**
- Section label: `<p className="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-white/50 mb-4">`
- Section heading: `<h2 style={{ fontSize: "clamp(1.75rem, 3.5vw, 3rem)", letterSpacing: "-0.02em", lineHeight: 1.1 }} className="font-light text-white mb-16">`
- Card grid: `<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 rounded-none">`
- Card: `<div className="bg-signalgray-800 p-10 hover:bg-signalgray-900 transition-colors duration-200">`
- Icon: `<div className="text-2xl text-white/50 mb-4 font-mono">{feature.icon}</div>`
- Feature title: `<h3 className="font-medium text-white mb-3">`
- Feature body: `<p className="text-white/60 text-[1.0625rem] leading-[1.65]">`

**Files to modify:** `components/landing/features.tsx`

**Test requirement:** Write `__tests__/features.test.tsx` asserting:
- (a) No `emerald` class in rendered output
- (b) Card grid has `gap-px` class
- (c) No `font-bold` or `font-semibold` in source (file-read check)
- (d) Section heading `style` contains `clamp(1.75rem`
- (e) Card has `bg-signalgray-800` class

**Done when:** All 5 assertions pass, `next build` passes.

---

### Task 2.4: Migrate How It Works component

**What:** Rewrite `components/landing/how-it-works.tsx`:

**Remove:**
- `text-emerald-400` on eyebrow/label
- `font-bold` on phase number span
- `group-hover:text-emerald-400/20` on number
- Fixed `text-3xl md:text-4xl` heading class
- `rounded-xl overflow-hidden` on phases container
- `bg-[#080808]` on phase rows → `bg-signalgray-800`
- `hover:bg-white/[0.015]` → `hover:bg-signalgray-900`

**Add:**
- Section label pattern (uppercase mono, `text-white/50`)
- Section heading: fluid `clamp(1.75rem, 3.5vw, 3rem)`, `font-light text-white`
- Phase number: `<span className="font-mono font-light text-white/[0.05] leading-none" style={{ fontSize: "clamp(4rem, 8vw, 7rem)" }}>`
- Phase label: `<div className="font-mono text-[0.7rem] tracking-[0.1em] uppercase text-white/50 mt-1">`
- Phase container: `<div className="space-y-px bg-white/10 rounded-none">`
- Phase row: `<div className="bg-signalgray-800 p-8 ...  hover:bg-signalgray-900 transition-colors">`

**Files to modify:** `components/landing/how-it-works.tsx`

**Test requirement:** Write `__tests__/how-it-works.test.tsx` asserting:
- (a) No `emerald` class in rendered output
- (b) No `font-bold` in source (file-read check)
- (c) Phase number span has `style` containing `clamp(4rem`

**Done when:** All 3 assertions pass, `next build` passes.

---

### Task 2.5: Migrate Install (CTA) component

**What:** Rewrite `components/landing/install.tsx`:

**Remove:**
- `bg-emerald-500/10 blur-[80px]` glow
- `text-emerald-400` on eyebrow and prompt `$` characters
- `font-bold` on heading
- `rounded-2xl` on outer card → `rounded-none` or `rounded-sm`
- Both `rounded-full` CTA buttons
- Emerald-filled primary CTA (`bg-emerald-500 hover:bg-emerald-400 text-black font-semibold`)
- `bg-black/40 rounded-xl` on terminal → `bg-signalgray-900 rounded-lg`

**Add:**
- Section label pattern (mono uppercase, `text-white/50`)
- Fluid heading: `clamp(1.75rem, 3.5vw, 3rem)`, `font-light text-white`
- Terminal mockup per `DESIGN.md §7`: `bg-signalgray-900 rounded-lg border border-white/10`, window dots `w-2.5 h-2.5 rounded-full bg-white/10` (terminal-dot exception), prompt `text-white/70`
- Primary CTA (Pattern B — bordered rectangle): `border border-white/15 px-6 py-3 text-sm font-medium text-white hover:border-white/25 transition-colors duration-200 rounded-sm`
- Secondary CTA (Pattern A — text link): `link-underline font-medium text-white text-sm`

**Files to modify:** `components/landing/install.tsx`

**Test requirement:** Write `__tests__/install.test.tsx` asserting:
- (a) No `emerald` class in rendered output
- (b) No `rounded-full` on CTA elements (terminal dots are exempt — check specifically the CTA `<a>` elements)
- (c) No `font-bold` in source (file-read check)
- (d) Primary CTA has `border-white/15` class
- (e) Secondary CTA has `link-underline` class

**Done when:** All 5 assertions pass, `next build` passes.

---

### Task 2.6: Migrate Agents component

**What:** Update `components/landing/agents.tsx`:

**Remove:**
- `rounded-full` from agent name badge `<span>` → `rounded-sm`
- `hover:text-white/60` patterns → `hover:text-white/50`

**What to keep:** The `border-white/[0.08]` border on badges is fine — bump to `border-white/10`.

**Files to modify:** `components/landing/agents.tsx`

**Test requirement:** Write `__tests__/agents.test.tsx` asserting:
- (a) No `rounded-full` on badge `<span>` elements
- (b) Badge `<span>` has `rounded-sm` class
- (c) No `emerald` class in rendered output

**Done when:** All 3 assertions pass, `next build` passes.

---

### Task 2.7: Migrate Footer component

**What:** Update `components/landing/footer.tsx`:

**Remove:**
- `font-bold` on logo
- `text-emerald-400` on "SPECS" wordmark span
- `text-emerald-400/50` on agents list in footer bottom bar
- `hover:text-white` on footer links → `hover:text-white/80`

**Add:**
- Logo pattern: `<span className="font-mono font-medium text-sm tracking-tight text-white">SUPER<span style={{ opacity: 0.4 }}>SPECS</span></span>`
- Agents bottom bar: `text-white/40` (no emerald)
- `border-white/[0.06]` → `border-white/10`

**Files to modify:** `components/landing/footer.tsx`

**Test requirement:** Write `__tests__/footer.test.tsx` asserting:
- (a) No `emerald` class anywhere in rendered output
- (b) No `font-bold` in source (file-read check)
- (c) Logo renders "SUPER" + "SPECS" with the SPECS span at opacity 0.4

**Done when:** All 3 assertions pass, `next build` passes.

---

### Task 2.8: Migrate Problem component

**What:** Audit and update `components/landing/problem.tsx`:

**Remove:**
- `text-emerald-400` on eyebrow
- `font-bold` on heading
- `rounded-full bg-red-500/10 border border-red-500/20` on symptom icon → replace with unicode `✗` in `font-mono text-white/50`, no circle div
- Fixed `text-3xl md:text-4xl` → fluid `clamp(1.75rem, 3.5vw, 3rem)`
- `font-semibold` on symptom title → `font-medium`
- `bg-[#080808]` on symptom cards → `bg-signalgray-800`
- `rounded-xl overflow-hidden` on grid → `rounded-none`
- `bg-white/[0.06]` on grid → `bg-white/10`

**Add:**
- Section label: `<p className="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-white/50 mb-4">`
- Section heading: fluid size, `font-light text-white`
- Symptom cards: `bg-signalgray-800 p-8`, title `font-medium text-white`, body `text-white/60`
- Unicode icon: `<span className="font-mono text-white/30 text-lg mb-4 block">✗</span>`

**Files to modify:** `components/landing/problem.tsx`

**Test requirement:** Write `__tests__/problem.test.tsx` asserting:
- (a) No `emerald` class in rendered output
- (b) No `font-bold` in source (file-read check)
- (c) Section heading `style` contains `clamp(`
- (d) No `rounded-full` on symptom icon elements

**Done when:** All 4 assertions pass, `next build` passes.

---

### Task 2.9: Migrate Docs section

**What:** Update `app/docs/layout.tsx` and `app/docs/[[...slug]]/page.tsx`.

**`app/docs/layout.tsx`:**
- Line 16: `<div className="min-h-screen bg-[#080808] text-white">` → `<div className="min-h-screen bg-signalgray-800 text-white">`
- `hover:text-white` on sidebar links → `hover:text-white/80`
- `border-white/[0.06]` → `border-white/10`
- No structural changes.

**`app/docs/[[...slug]]/page.tsx`:**

Apply exact class replacements from `DESIGN.md §13`:
```
prose-code:text-emerald-400 → prose-code:text-white
prose-code:rounded            → prose-code:rounded-sm
prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline
  → prose-a:text-white prose-a:underline prose-a:decoration-white/30 hover:prose-a:decoration-white
prose-headings:font-bold      → prose-headings:font-medium
prose-p:text-white/60         → prose-p:text-white/70
prose-li:text-white/60        → prose-li:text-white/70
prose-th:text-white/70        → prose-th:text-white/80
prose-th:border-white/10      → prose-th:border-white/15
prose-td:text-white/50        → prose-td:text-white/60
prose-td:border-white/[0.04]  → prose-td:border-white/10
```

**Files to modify:** `app/docs/layout.tsx`, `app/docs/[[...slug]]/page.tsx`

**Test requirement:** Write `__tests__/docs-migration.test.ts` (file-read assertions):
- `app/docs/layout.tsx` contains `bg-signalgray-800`
- `app/docs/layout.tsx` does NOT contain `bg-[#080808]`
- `app/docs/[[...slug]]/page.tsx` does NOT contain `text-emerald-400`
- `app/docs/[[...slug]]/page.tsx` contains `prose-code:text-white`
- `app/docs/[[...slug]]/page.tsx` contains `prose-headings:font-medium`
- `app/docs/[[...slug]]/page.tsx` does NOT contain `prose-headings:font-bold`
- `app/docs/[[...slug]]/page.tsx` contains `prose-a:decoration-white/30`

**Done when:** All 7 assertions pass, `next build` passes.

---

## Wave 3 — Global Audit & Integration

### Task 3.1: Global background, text, and shape audit

**What:** Final audit of ALL landing and docs files. Fix any remaining violations:

**Check for and remove:**
- Any `bg-[#080808]`, `bg-black`, `bg-[#111110]` — replace with `bg-signalgray-800` or `bg-signalgray-900`
- Any `emerald` color class anywhere in `components/landing/*.tsx`, `app/page.tsx`, `app/docs/**/*.tsx`
- Any `font-bold` or `font-semibold` in landing or docs source
- Any `rounded-full` not on a terminal-dot element (class `w-2.5 h-2.5 rounded-full bg-white/10`)
- Any `text-[#e8e6e3]`, `text-[#6b6a67]`, `text-[#f4f3f0]`, `text-[#9c9a96]` hex color tokens — replace with `text-white` + appropriate opacity
- Any `hover:text-white` as the only hover indicator on a link (must have `link-underline` or `hover:text-white/80`)
- Any `ease-in-out`, `linear`, `easeInOut` in framer-motion or CSS contexts
- Any `--ease-premium` (deleted concept) — should be zero

Also check `app/page.tsx`:
- `<main>` has `bg-signalgray-800 text-white` (not `bg-[#080808]`)

**Files to modify:** Any `components/landing/*.tsx`, `app/page.tsx`, `app/globals.css`, `app/docs/layout.tsx`

**Test requirement:** Write `__tests__/global-audit.test.ts` (file-read grep checks) asserting zero occurrences of each violation pattern across all target files. Use `fs.readFileSync` + string search. Patterns to check:
- `bg-\[#080808\]`
- `bg-black`
- `text-emerald`
- `bg-emerald`
- `font-bold`
- `font-semibold`
- `ease-in-out`
- `--ease-premium`
- `lib/transitions`
- `PageTransitionWrapper`
- `rounded-full` (outside of terminal-dot context — check that any remaining `rounded-full` is accompanied by `w-2.5 h-2.5`)

**Done when:** Zero violations found, `next build` passes, `biome check` passes.

---

### Task 3.2: Build verification and baseline

**What:** Full build and quality gate.

1. Run `next build` (Turbopack enabled) — must exit 0
2. Run `tsc --noEmit` — must exit 0
3. Run `biome check .` — must exit 0
4. Verify `lib/transitions.ts` does NOT exist
5. Verify `components/page-transition-wrapper.tsx` does NOT exist
6. Verify `lib/easing.ts` DOES exist
7. Verify `components/page-transition.tsx` DOES exist

**Files to modify:** None (verification only)

**Test requirement:** `next build` exits 0. `tsc --noEmit` exits 0. `biome check .` exits 0.

**Done when:** All three commands pass cleanly and all 7 file-existence checks pass.

---

## Done Criteria

The feature is DONE when:
- [ ] All tasks complete
- [ ] All tests passing (zero skipped, zero pending)
- [ ] Every scenario in spec.md has a corresponding passing test
- [ ] Code review passed with no Critical findings
- [ ] `next build` passes with zero errors
- [ ] `tsc --noEmit` passes with zero errors
- [ ] `biome check` passes with zero errors
- [ ] Zero emerald-family color values in any landing or docs component
- [ ] Zero `rounded-full` classes on non-terminal-dot elements
- [ ] Zero `font-bold` or `font-semibold` on landing or docs elements
- [ ] `lib/easing.ts` exists with all five exports
- [ ] `components/page-transition.tsx` exists (signalgrau snapshot-clone mechanic)
- [ ] `lib/transitions.ts` DELETED
- [ ] `components/page-transition-wrapper.tsx` DELETED
- [ ] `app/layout.tsx` imports `PageTransition` (not `PageTransitionWrapper`)
- [ ] `bg-signalgray-800` is the background on both landing and docs routes
- [ ] `superspec/wiki/ui/page-transitions.md` updated to new architecture
