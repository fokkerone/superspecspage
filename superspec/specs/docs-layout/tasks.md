# Implementation Tasks: Docs Layout

## Context Window Budget
Estimated spec + tasks tokens: ~18k / 200k ✅

---

## Wave 1 — Route Architecture

Must complete before any other wave. Restructures root layout so docs is cleanly isolated.

### Task 1.1: PageTransition conditional skip for docs-internal navigation
**What:** Modify `components/page-transition.tsx` to skip the snapshot-clone animation when navigating between two `/docs/*` routes. Add a check: if both `frozenPathname` and `pathname` start with `/docs/`, call `setFrozenPathname(pathname)` immediately (instant swap, no animation). The existing transition plays for all other route changes including the marketing↔docs boundary. `ScrollContainer` and root `layout.tsx` are unchanged.
**Files to create/modify:**
- `components/page-transition.tsx` — add conditional skip in the `useEffect` that drives the transition
**Test requirement:** Extend `__tests__/page-transition.test.tsx` with two cases: (a) navigating `/docs/a` → `/docs/b` results in instant pathname update with no animation classes applied; (b) navigating `/` → `/docs/introduction` still triggers the full transition.
**Done when:** Both new test cases pass. Existing page-transition tests pass. Navigating sidebar links in docs shows no animation.

---

## Wave 2 — Content Schema Extension

Runs after Wave 1. Tasks 2.1 and 2.2 are independent and can run in parallel.

### Task 2.1: Velite TOC extraction + rehype-slug
**What:** Two changes to `velite.config.ts`: (1) Add `rehype-slug` to the MDX `rehypePlugins` array so rendered headings get `id` attributes (e.g. `<h2 id="quick-start">`). (2) Add a `toc` field to the docs schema using Velite's built-in `s.toc()` — it uses `github-slugger` to extract headings at build time, producing `{ title: string; id: string; depth: number }[]`. Also add an optional frontmatter `toc` field (`{ title: string; id: string; depth?: 2 | 3 }[]`) — when present, it overrides `s.toc()` output. Run `velite build` to verify `.velite/index.d.ts` reflects the new fields.
**Files to create/modify:**
- `velite.config.ts` — add `rehype-slug` to rehypePlugins, add `toc` and optional frontmatter `toc` to schema
- `package.json` — add `rehype-slug` dependency if not already installed
**Test requirement:** Extend `__tests__/docs-migration.test.ts`: (a) a doc with H2/H3 headings produces a non-empty `toc` array with matching `id` values; (b) a doc with a frontmatter `toc` array uses that array instead of auto-extracted headings.
**Done when:** `velite build` succeeds, `.velite` type includes `toc`, both test cases pass.

### Task 2.2: Velite section field
**What:** Add a `section` field to the Velite `docs` collection schema, derived from the slug path. If the slug is `docs/getting-started/installation`, section = `"getting-started"`. If the slug is `docs/introduction` (no subfolder), section = `null`. This field drives the left nav grouping.
**Files to create/modify:**
- `velite.config.ts` — add `section` computed field using `s.path()` transform
**Test requirement:** Write a test asserting that a doc at `content/docs/agents/overview.mdx` has `section: "agents"` and a doc at `content/docs/introduction.mdx` has `section: null`.
**Done when:** Test passes. `velite build` succeeds.

---

## Wave 3 — UI Components

Runs after Wave 2. Tasks 3.1 and 3.2 are independent and can run in parallel.

### Task 3.1: DocsSidebar component
**What:** Build a `components/docs/docs-sidebar.tsx` component. Accepts the full list of `Doc` items from Velite. Groups them by `section`: items with `section: null` render as top-level links; items with a section render under a non-clickable section label. Within each group, sort by `order` (ascending, nulls last, then alphabetical). Highlights the active item by comparing each item's slug to the current pathname (use Next.js `usePathname()`).
**Files to create/modify:**
- `components/docs/docs-sidebar.tsx` — new
**Test requirement:** Write `__tests__/docs-sidebar.test.tsx` asserting: (a) items with matching section are grouped under a label, (b) top-level items appear without a label, (c) the item matching the current pathname has an active class/aria-current, (d) items sort correctly by `order`.
**Done when:** All test cases pass.

### Task 3.2: DocsTOC component
**What:** Build a `components/docs/docs-toc.tsx` component. Accepts `toc: { title: string; id: string; depth: 2 | 3 }[]`. Renders each entry as a button/link. H3 entries are indented relative to H2. If the array is empty, renders nothing. Click handler: `onClick` calls `document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })` then updates `window.location.hash = id` — does NOT use native `href="#id"` navigation (which fails within `ScrollContainer`). The `href` attribute is set to `#id` for accessibility and right-click only, with `e.preventDefault()` on click. Uses Signalgray design tokens (text-white/40 default, text-white hover).
**Files to create/modify:**
- `components/docs/docs-toc.tsx` — new
**Test requirement:** Write `__tests__/docs-toc.test.tsx` asserting: (a) H3 items have an indent class that H2 items don't, (b) empty toc array renders no DOM output, (c) each entry has `href="#<id>"`, (d) clicking an entry calls `scrollIntoView` on the matching element.
**Done when:** All test cases pass.

---

## Wave 4 — Integration

Runs after Wave 3. Tasks 4.1 and 4.2 are sequential.

### Task 4.1: Wire docs layout
**What:** Update `app/docs/layout.tsx` to implement the three-column layout: left (`DocsSidebar`), center (`{children}`), right (`DocsTOC`). Fetch all docs from Velite and pass to `DocsSidebar`. Scroll is provided by the root `ScrollContainer` — the docs layout does not add or override scroll behavior. `position: sticky` works correctly within `ScrollContainer` (per `scroll-architecture` wiki). Apply responsive breakpoints: left nav hidden below `lg`, right TOC hidden below `xl`. The page component (`app/docs/[[...slug]]/page.tsx`) passes `doc.toc` directly to `DocsTOC`.
**Files to create/modify:**
- `app/docs/layout.tsx` — full rewrite of the three-column layout
- `app/docs/[[...slug]]/page.tsx` — pass `toc` data to TOC component
**Test requirement:** Extend or replace `__tests__/docs-migration.test.ts` to assert: (a) the docs layout renders `DocsSidebar`, (b) the docs layout renders `DocsTOC`, (c) `DocsSidebar` receives all docs as props.
**Done when:** All tests pass. Visual check: three columns visible at 1280px+, one column at mobile.

### Task 4.2: Add order frontmatter to existing MDX files
**What:** Add `order` frontmatter to all existing MDX files in `content/docs/` so the nav sorts predictably. `introduction.mdx` → `order: 1`, `quick-start.mdx` → `order: 2`, `how-it-works.mdx` → `order: 3`.
**Files to create/modify:**
- `content/docs/introduction.mdx`
- `content/docs/quick-start.mdx`
- `content/docs/how-it-works.mdx`
**Test requirement:** Existing Velite schema test or a new assertion that all docs in the collection have an `order` value (either explicit or default `99`).
**Done when:** `velite build` succeeds. Nav renders in the correct order.

---

## Done Criteria

The feature is DONE when:
- [ ] All tasks complete
- [ ] All tests passing (zero skipped, zero pending)
- [ ] Every scenario in spec.md has a corresponding passing test
- [ ] Code review passed with no Critical findings
- [ ] No regressions in landing page transitions or scroll behavior
- [ ] Visual check: three-column layout renders correctly at 1280px+
- [ ] Visual check: navigating docs-to-docs shows no transition animation
