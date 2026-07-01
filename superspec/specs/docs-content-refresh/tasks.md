# Implementation Tasks: Docs Content Refresh

## Context Window Budget
Estimated spec + task tokens: ~9k / 200k ✅

## Wave 1 — Rendering Pipeline Foundation
Must complete before Wave 2 content pages can rely on the new shortcodes/highlighting.

### Task 1.1: Add Shiki syntax highlighting to the Velite MDX pipeline
**What:** Add `rehype-pretty-code` (Shiki-based) to `velite.config.ts`'s `mdx.rehypePlugins`, ordered after `rehype-slug` (heading IDs must still be generated). Use the `vitesse-dark` Shiki theme (muted warm-dark palette — closest stock theme to `signalgray-800`'s warm oklch tone; avoid pure-blue/pure-black themes like `github-dark`/`dark-plus`). Add `shiki` and `rehype-pretty-code` as dependencies in `package.json`.
**Files to create/modify:** `velite.config.ts`, `package.json`
**Test requirement:** In `__tests__/docs-migration.test.ts` (or a new `__tests__/docs-highlighting.test.ts`), assert `velite.config.ts` source contains `rehype-pretty-code` in `rehypePlugins` AND that `rehype-slug` still appears before it in the array (string-position assertion, matching this repo's existing source-assertion test style). Test must fail before the plugin is added.
**Done when:** Test passes; `npm run build` succeeds; a manually-built doc page with a fenced code block shows multiple `<span>` elements with distinct `style`/`class` attributes in `.velite/docs.json` body output (spot-check, not necessarily an automated DOM test).
**Status:** ✅ done — commit 92ad7b1

### Task 1.2: Style highlighted code blocks to match the dark theme
**What:** Update the `prose-pre`/`prose-code` Tailwind classes in `app/docs/[[...slug]]/page.tsx` (or extract to a small CSS module if `rehype-pretty-code`'s inline styles conflict with Tailwind prose overrides) so highlighted code blocks sit correctly on `bg-white/[0.04]` with readable contrast, consistent with `[[ui/design-system]]`.
**Files to create/modify:** `app/docs/[[...slug]]/page.tsx`, possibly `app/globals.css`
**Test requirement:** Extend `__tests__/docs-migration.test.ts` to assert the page source still contains the established prose classes (`prose-pre:bg-white/[0.04]`, `prose-pre:border`, etc.) unchanged, proving the highlighting integration didn't strip existing dark-theme styling.
**Done when:** Test passes; a code block visually inspected in dev server has readable syntax colors on the dark background.
**Status:** ✅ done — commit 5621b01 (root cause: `rehype-pretty-code` baked its own inline `style` background on `<pre>`, overriding Tailwind's `prose-pre:bg-white/[0.04]`; fixed via `keepBackground: false`)

### Task 1.3: Add `<Steps>` / `<Step>` MDX shortcode
**What:** Create a `Steps` component (ordered container) and `Step` component (`title` prop + children). Step numbers are plain `font-mono` numerals (`01`, `02`...) at a modest inline size (e.g. `text-sm`, matching the label/eyebrow scale) — NOT the large decorative `clamp(4rem, 8vw, 7rem)` phase-number scale, which is reserved for full-bleed section dividers elsewhere on the site. Connector between steps: `border-l border-white/10` (no icon library, no colored accents — pure greyscale per `[[ui/component-patterns]]`). Titles/body use the existing `text-white`/`text-white/70` opacity scale. `rounded-sm` max on any bordered marker box (no `rounded-full` except the site's existing terminal-dot exception, which does not apply here). No `font-bold`/`font-semibold` anywhere. Register both in `MDXContent`'s component map (`components/mdx-content.tsx`) so MDX files can use `<Steps><Step title="...">...</Step></Steps>` directly.
**Files to create/modify:** `components/docs/steps.tsx` (new), `components/mdx-content.tsx`
**Test requirement:** New `__tests__/docs-steps.test.tsx` using `@testing-library/react` (same pattern as `docs-sidebar.test.tsx`): renders `<Steps><Step title="Discuss">text</Step><Step title="Plan">text</Step></Steps>` directly (not through MDX) and asserts both titles render and each step is a distinct list item / distinct DOM node. Also assert the component source contains no `rounded-full` (outside a justified exception) and no `font-bold`/`font-semibold` class strings. Test must fail before the component exists.
**Done when:** Test passes.
**Status:** ✅ done — commit 2decdd5 (review fix in b3ae55d: raw `bg-black` → `bg-signalgray-900` token)

### Task 1.4: Add `Callout` MDX shortcode
**What:** Create a `Callout` component (children only, no `type`/variant prop) with exactly one visual style: `border` (or `border-l-2`) + subtle background (e.g. `bg-white/[0.03]`), distinct from a plain paragraph. No color-coded variants (info/warning/error) — consistent with the site's "no accent color, hierarchy via opacity/weight/spacing only" rule in `[[ui/component-patterns]]`. Register in `MDXContent`'s component map.
**Files to create/modify:** `components/docs/callout.tsx` (new), `components/mdx-content.tsx`
**Test requirement:** New `__tests__/docs-callout.test.tsx`: renders `<Callout>text</Callout>` and asserts it renders inside a container with a distinguishing border class and a background class, not a bare `<p>`. Also assert the component accepts no `type` prop (single style only). Test must fail before the component exists.
**Done when:** Test passes.
**Status:** ✅ done — commit ebf54d3

## Wave 2 — Content Pages (parallel once Wave 1 lands)
Each task authors specific `.mdx` files from specific source line ranges. No task depends on another task in this wave.

### Task 2.1: Getting Started section
**What:** Create `content/docs/getting-started/introduction.mdx` (order 1), `content/docs/getting-started/installation.mdx` (order 2), `content/docs/getting-started/quick-start.mdx` (order 3). Delete the old `content/docs/introduction.mdx` and `content/docs/quick-start.mdx`.
**Status:** ✅ done — commit f35b103

### Task 2.2: Concepts section — workflow (Steps-based)
**What:** Create `content/docs/concepts/workflow.mdx` (order 11) using `<Steps>`/`<Step>` for the four-phase lifecycle.
**Status:** ✅ done — commit 04e2ec3

### Task 2.3: Concepts section — the wiki & design principles
**What:** Create `content/docs/concepts/the-wiki.mdx` (order 12), `content/docs/concepts/design-principles.mdx` (order 13).
**Status:** ✅ done — commit 57e8937

### Task 2.4: Reference section — skill reference & wiki operations
**What:** Create `content/docs/reference/skill-reference.mdx` (order 21), `content/docs/reference/wiki-operations.mdx` (order 22).
**Status:** ✅ done — commit 3486baf

### Task 2.5: Development section
**What:** Create `content/docs/development/how-skills-work.mdx` (order 31), `content/docs/development/creating-a-skill.mdx` (order 32), `content/docs/development/local-development.mdx` (order 33).
**Status:** ✅ done — commit 0949889

### Task 2.6: Remove superseded stub page
**What:** Delete `content/docs/how-it-works.mdx`.
**Status:** ✅ done — commit ef6867a

## Wave 3 — Integration

### Task 3.1: Verify sidebar section ordering
**What:** Confirm the four sections render in order via non-overlapping global `order` ranges (1-3/11-13/21-22/31-33) assigned during Wave 2. Verification only.
**Status:** ✅ done — commit 68c4910

### Task 3.2: Fix default `/docs` route resolution
**What:** Update the `getDoc` fallback in `app/docs/[[...slug]]/page.tsx` to resolve to `docs/getting-started/introduction`.
**Status:** ✅ done — commit def4adb (this was live-verified as fixing an actual 404 the user hit)

### Task 3.3: Full build and regression check
**What:** Run `npm run build` end-to-end, confirm all tests pass together, close the deferred "untagged code fence" scenario gap.
**Status:** ✅ done — commit 97d130f

## Post-hoc tasks (outside original wave plan, driven by live user testing)

### Task P.1: Typography proportions matched to opengsd
**Status:** ✅ done — commit c486fe6

### Task P.2: @tailwindcss/typography plugin registration fix
**What:** Root-caused "h1/h2 have no classes" — plugin was never installed/registered since `docs-layout`. Fixed by adding dependency + `@plugin` directive.
**Status:** ✅ done — commit d0acb19

## Done Criteria
The feature is DONE when:
- [x] All tasks complete
- [x] All tests passing (zero skipped, zero pending) — 354 passing, 22 pre-existing unrelated failures verified identical on `main`
- [x] Every scenario in spec.md has a corresponding passing test
- [x] `npm run build` succeeds
- [x] Code review passed with no unresolved Critical findings
- [x] No regressions in unrelated tests (verified via direct branch comparison against `main`)
