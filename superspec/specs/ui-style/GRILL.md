# Grill Session: UI Style — Design System & Visual Language

Date: 2026-06-22
Spec reviewed: superspec/specs/ui-style/spec.md
Reference adopted (during grill): `~/Downloads/signalgrau-main` (local archive of fokkerone/signalgrau)

---

## Pre-flight

### Wiki conflicts

1. **Page-transition easing curve** — `superspec/wiki/ui/page-transitions.md:136` documents `cubic-bezier(0.76, 0, 0.24, 1)` as the current easing. The spec acknowledged this conflict (lines 13–17) and committed to update both `lib/transitions.ts` and the wiki page. **Now superseded by Q3/Q5/Q6/Q7**: the entire transition mechanic is replaced by the signalgrau snapshot-clone implementation. The wiki page must be rewritten end-to-end, not just patched.

2. **DESIGN.md self-contradiction** — DESIGN.md §6 (lines 304–310) hardcoded the old `cubic-bezier(0.76, 0, 0.24, 1)` page-transition value while §11 defined `--ease-premium: cubic-bezier(0.62, 0.05, 0.01, 0.99)`. Resolved during grill: DESIGN.md will be rewritten end-to-end to reflect the new two-curve system (`--ease-enter`, `--ease-exit`) and the signalgrau palette.

### Techstack conflicts

1. **DM Sans absent from techstack profile** — Dissolved during grill (Q8). Geist Sans stays, no font migration.

2. **framer-motion was "optional" in techstack profile, but is load-bearing** — Page transition no longer uses framer-motion (it's hand-rolled), but Hero clip-path reveal still does. framer-motion remains a hard dependency. The techstack profile is stale on this point — flag for `/superspecs:verify` to update.

### Internal contradictions

1. **Header is shared between `/` and `/docs/*`** — `app/docs/layout.tsx:2` imports `@/components/landing/header`. The original spec marked `/docs/*` "out of scope" while planning to rewrite Header. **Resolved by Q1**: scope expanded to include `/docs/*` for token/color/font alignment.

2. **`app/docs/layout.tsx` + `app/docs/[[...slug]]/page.tsx` use the old palette and emerald** — Same root cause as #1. Resolved by Q1 (scope expansion) and Q9 (concrete `prose-*` class migration).

3. **Existing `__tests__/transitions.test.ts` would fail under spec's Task 1.4** — Resolved by Q7: `lib/transitions.ts` is deleted entirely, this test file is deleted with it, replaced by new tests against `lib/easing.ts` and `page-transition.tsx`.

4. **`--font-sans` was referenced but never declared in `globals.css`** — Resolved by Q8: Task 1.1 explicitly binds `--font-sans: var(--font-geist-sans)` in `@theme inline`.

5. **Spec didn't carve out the terminal-dot `rounded-full` exception** — Task 3.1 mentions it, but no Requirement statement documented it. Will be added to spec.md during rewrite.

---

## Questions & Resolutions

### Q1: Does this spec implicitly include `/docs/*`?

**Recommended:** Expand scope minimally to include `app/docs/layout.tsx` and `app/docs/[[...slug]]/page.tsx` for token/color/font alignment only — no layout redesign.
**Resolved:** Expand scope AND let it look like betteroff.studio from color scheme and UI style.
**Impact:** Scope expanded. Triggered cascade Q2 → Q5 (reference change to signalgrau).

### Q2: Adopt actual betteroff values or DESIGN.md's interpretation?

**Recommended:** Re-base DESIGN.md on actual betteroff values; keep "no accent colors" as a SuperSpecs-specific rule.
**Resolved:** Option A — re-base on actual betteroff values, keep "no accent colors" rule.
**Impact:** All DESIGN.md color, easing, font weight, and shape decisions had to be re-evaluated.

### Q3: Page-transition easing — switch to betteroff curve or keep richardekwonye curve?

**Recommended:** Use `cubic-bezier(0.19, 1, 0.22, 1)` (betteroff's curve) for `lib/transitions.ts`.
**Resolved:** Superseded by Q4 — user pivoted reference from betteroff to signalgrau.
**Impact:** This decision was abandoned. Easing values came from signalgrau instead.

### Q4: Source of truth — where is signalgrau?

**Recommended:** Provide local clone, paste snippets, or abandon external reference.
**Resolved:** Local archive at `~/Downloads/signalgrau-main` (zip extract).
**Impact:** Read globals.css, page-transition.tsx, nav.tsx, layout.tsx, package.json to extract actual values.

### Q5: Which parts of signalgrau to adopt?

**Recommended:** Option A — wholesale clone.
**Resolved:** Option B — tokens + transition mechanics; keep editorial typography direction.
**Impact:**
- Palette switches to `--signalgray-{100..900}` oklch tokens
- Page bg → `signalgray-800`, all text `text-white` with opacity tiers
- Drop signalgrau's orange `--brand` accent (SuperSpecs is greyscale)
- Page transition replaced by signalgrau snapshot-clone mechanic
- Two-curve easing system
- Editorial typography rules (weight ceiling, fluid clamp, underline-scrub) **retained from original spec**
- `rounded-none` / `rounded-sm` for cards/buttons **retained from original spec** (signalgrau uses `rounded-lg` — we override)
- Icons stay unicode-only (signalgrau uses lucide — we override)

### Q6: With two-curve transition, what's the canonical hover/reveal easing?

**Recommended:** Option 1 — adopt `EASE_ENTER` as the canonical curve for all non-exit motion; drop `--ease-premium`.
**Resolved:** Option 1.
**Impact:** Two named curves: `--ease-enter` (hovers, reveals, page enter) and `--ease-exit` (page exit only). `--ease-premium` removed from DESIGN.md and spec.

### Q7: Integrate the new PageTransition with docs section?

**Sub-decisions resolved (all confirmed):**
1. ✅ Replace file `components/page-transition-wrapper.tsx` → `components/page-transition.tsx` with signalgrau implementation; update `app/layout.tsx` import.
2. ✅ Rewrite `__tests__/page-transition-wrapper.test.tsx` → `__tests__/page-transition.test.tsx`; delete `__tests__/transitions.test.ts`; delete `lib/transitions.ts`.
3. ✅ Update `superspec/wiki/ui/page-transitions.md` as part of this spec.
4. ✅ Transitions fire on `/` ↔ `/docs/*` navigation as expected behavior.

**Impact:** The `page-transitions` feature's "swappable variant via single import" pattern is **abandoned** as a conscious deviation. Documented as a known regression — re-introducing variants would be a follow-up spec.

### Q8: Drop or keep the DM Sans migration?

**Recommended:** Keep DM Sans.
**Resolved:** Use Geist Sans.
**Impact:**
- Pre-flight blocker #4 (`--font-sans` undefined) dissolves with explicit Task 1.1 binding
- Task 1.2 (font migration) deleted
- Spec Requirement "Typography — DM Sans replaces Geist Sans" + 3 scenarios deleted
- DESIGN.md §3 swaps DM Sans for Geist Sans
- DISCUSS.md decision "DM Sans over PP Neue Montreal" superseded (recorded here, not modified)
- Weight ceiling rule revisited in Q9 (relaxed for Geist Sans)

### Q9: `app/page.tsx`, `app/docs/layout.tsx`, docs prose migration, weight ceiling

**Sub-decisions resolved (all confirmed):**
1. ✅ Background everywhere: `bg-signalgray-800`
2. ✅ Docs `prose-*` migration with exact class replacements (see DESIGN.md §13 after rewrite)
3. ✅ Weight rule relaxed: allow `font-light` (300), `font-normal` (400), `font-medium` (500). Forbid `font-semibold` (600) and `font-bold` (700).

**Impact:**
- `app/page.tsx:12` migration: `bg-[#080808] text-white` → `bg-signalgray-800 text-white`
- `app/docs/layout.tsx:16` migration: same
- `app/docs/[[...slug]]/page.tsx` prose class swaps (emerald → white opacity tiers; `prose-headings:font-bold` → `prose-headings:font-medium`)
- Spec Requirement "Typography — Weight Ceiling at 500" relaxed: now "Weight Range 300–500, No Semibold or Bold"
- Note: `signalgray-800` is ~`#383530` (lighter than old `#080808`), so opacity tiers for muted text are bumped (`/40` → `/50` as the new readable floor)

### Q10: Where do the easing values live?

**Recommended:** Option A — single source of truth in `lib/easing.ts`.
**Resolved:** Option A.
**Impact:**
- New Task 1.5: create `lib/easing.ts` exporting `EASE_ENTER`, `EASE_EXIT`, `EASE_ENTER_TUPLE`, `EASE_EXIT_TUPLE`, `TRANSITION_DURATION = 1450`
- `globals.css` duplicates values once as `--ease-enter` / `--ease-exit` for `.link-underline` CSS utility; comment marks `lib/easing.ts` canonical
- `components/page-transition.tsx`, `components/landing/hero.tsx` import constants
- Tests assert against constants, not literals

### Q11: Is 1450ms the right page-transition duration?

**Recommended:** Option B — 700ms compromise.
**Resolved:** Option A — 1450ms verbatim (signalgrau).
**Impact:**
- `TRANSITION_DURATION = 1450` in `lib/easing.ts`
- Doc-heavy users will experience ~1.5s wait per navigation. Conscious choice for the "premium" feel.
- Exit-delay stays at signalgrau-default `250ms`

### Q12: Reduced-motion behavior with 1450ms transition?

**Recommended:** Option A — skip animation entirely on `prefers-reduced-motion: reduce`.
**Resolved:** Option A (skip animation). Initial answer "exact animation from example" was reversed in follow-up: "if reduce skip animation completely, otherwise use animation."
**Impact:**
- `components/page-transition.tsx` checks `window.matchMedia("(prefers-reduced-motion: reduce)").matches` at render
- If true: instant `frozenPathname` update; no snapshot, no overlay, no slide
- If false: identical 1450ms signalgrau behavior
- New spec scenario: "Reduced motion skips page transition"
- New tests: assert `frozenPathname` updates synchronously under matched media; assert no snapshot capture on `mousedown`
- **Deviates from signalgrau verbatim** — signalgrau ignores `prefers-reduced-motion`. We add this as an accessibility improvement on top.

### Q13: Hero clip-path reveal during page-entry transition

**Recommended:** Option C — delayed clip-path during transition, immediate on first load.
**Resolved:** Option B — Hero clip-path fires only on first page load (referrer empty or external); skipped on internal navigation.
**Impact:**
- `components/landing/hero.tsx` uses `useEffect` + `document.referrer` check to determine `shouldAnimate`
- Internal nav: `motion.h1 initial={false}` → no clip-path animation, text visible immediately
- First load / external referrer: clip-path reveal plays at 1250ms with `--ease-enter`
- Refresh of `/` counts as internal nav (referrer is `/`) — no clip-path replay. Acceptable.
- Spec scenarios updated: "Hero clip-path reveal fires on first page load only" + "Hero clip-path reveal skipped on internal navigation"

### Q14: Any last decision points?

**Recommended:** Keep all six `signalgray-*` tokens defined, even if light tokens (`100`, `200`) are currently unused.
**Resolved:** Proceed. "We might extend this later."
**Impact:**
- All `signalgray-100, -200, -300, -700, -800, -900` defined in `globals.css`
- No additional out-of-scope items deferred

---

## Spec Changes Required

Applied to `superspec/specs/ui-style/spec.md`, `DESIGN.md`, and `tasks.md`:

### spec.md
- **Purpose paragraph:** rewrite to reflect signalgrau-based palette and two-curve easing
- **Conflict notice (lines 13–17):** rewrite to describe full architecture replacement, not curve patch
- **Scope:** explicitly include `app/page.tsx`, `app/docs/layout.tsx`, `app/docs/[[...slug]]/page.tsx`
- **Out of Scope (line 277):** remove `/docs/*` exclusion; keep `app/docs/[[...slug]]` *layout* changes excluded but include token/color/prose migration
- **DELETE:** Requirement "Typography — DM Sans replaces Geist Sans" + 3 scenarios
- **REPLACE:** Requirement "CSS Design Tokens" → list signalgray-* + ease-enter/exit tokens
- **REPLACE:** Requirement "Color Palette" → signalgray tokens, no emerald, `bg-signalgray-800`
- **RELAX:** Requirement "Weight Ceiling at 500" → "Weight Range 300–500, No Semibold or Bold"
- **REPLACE:** Requirement "Motion — Primary Easing Curve" → "Two-Curve Easing System (Enter + Exit)"
- **REPLACE:** Requirement "Motion — Text Reveal on Page Load" → "Hero Clip-Path Reveal on First Load Only"
- **REPLACE:** Requirement related to page transitions → "Page Transition — Snapshot-Clone Mechanic"
- **ADD:** Requirement "Reduced Motion Skips Page Transition"
- **ADD:** Requirement "Docs Prose Migration" (covers `prose-*` class swaps)
- **CARVE-OUT:** Add to "No Pill Shapes" requirement: terminal mockup window dots MAY use `rounded-full` (decorative exception)
- Update all Scenarios for new values; bump muted opacity floors (`/40` → `/50`)

### DESIGN.md
- §2 Color Palette → complete rewrite with `--signalgray-*` oklch tokens
- §3 Typography → Geist Sans (not DM Sans); weight rule relaxed
- §5 Border Radius → minor update (terminal dots exception)
- §6 Motion → complete rewrite for two-curve system + signalgrau snapshot-clone transition
- §7 Component Patterns → update all `text-[#e8e6e3]` → `text-white`, `text-[#6b6a67]` → `text-white/50`, etc.
- §10 DO/DON'T → update with new tokens
- §11 CSS Variables → replace `--color-bg`/etc. with `--signalgray-*` oklch declarations; add `--ease-enter`/`--ease-exit`; bind `--font-sans: var(--font-geist-sans)`
- §12 Reference Annotations → add signalgrau section, mark betteroff/richard as inspirational (not normative)
- **ADD §13:** Docs Section Migration (prose class replacements)

### tasks.md
- Wave 1: Add Task 1.5 (`lib/easing.ts`). Delete Task 1.2 (DM Sans migration). Update Task 1.1 (signalgray palette + ease tokens + `--font-sans` binding). Update Task 1.4 (replace `PageTransitionWrapper` + `lib/transitions.ts` with `PageTransition` + `lib/easing.ts`).
- Wave 2: Update Task 2.1 (Hero with referrer check). Update Task 2.6 (Agents: `signalgray` opacity tiers). Add Task 2.9 (docs prose migration).
- Wave 3: Update Task 3.1 to scan `app/docs/*` too. Update Task 3.2 to verify `signalgray-800` background contrast.

---

## Deferred Questions

- [ ] **Light-mode signalgray tokens** (`signalgray-100`, `200`) defined but unused. Reserved for future light-bg sections (e.g. Compare block). No spec scenario asserts them.
- [ ] **Swappable transition variants** — `lib/transitions.ts` swappable-variant pattern from the original `page-transitions` feature is abandoned. If future work needs multiple transition styles, that's a follow-up spec to refactor `page-transition.tsx`.
- [ ] **PageTransition snapshot-clone edge cases** — programmatic navigation (`router.push` without a user gesture) won't capture a snapshot. Fallback exists (capture in `useLayoutEffect`) but is fragile. Defer to implementation discovery.
- [ ] **Tune Hero clip-path delay if visual mismatch** — internal nav skips the reveal entirely (Option B). If the entry feels too abrupt after first render, reconsider Option C (delayed reveal). Visual judgment after Task 2.1 lands.
- [ ] **Techstack profile staleness** — `framer-motion: optional` in `superspec/wiki/techstack/profile.md` is wrong. Fix in `/superspecs:verify` or next techstack rev.

---

## Verdict

**READY** — All 14 decision branches resolved. Spec changes applied. Pre-flight conflicts resolved.

Proceed to `/superspecs:pick-spec ui-style`.
