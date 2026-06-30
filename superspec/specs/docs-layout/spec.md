# Docs Layout Specification

**Slug:** docs-layout
**Status:** draft
**Depends on:** page-transitions, scroll-motion-style

## Purpose

The documentation section of the SuperSpecs site needs a proper three-column docs layout: a hierarchical left navigation, a center MDX content area, and a right-side Table of Contents. Navigation structure is driven entirely by the MDX file/folder hierarchy in `content/docs/` — no separate nav config. The docs section runs without page transition animations and on native browser scroll, unlike the marketing landing pages.

---

## Requirements

### Requirement: Route Architecture — Docs-Internal Navigation Skips Transition

The system SHALL skip the `PageTransition` animation when navigating between two `/docs/*` routes (sidebar navigation). The animation SHALL play when crossing the marketing ↔ docs boundary (header navigation).

#### Scenario: Navigating between docs pages (sidebar)
- GIVEN a user is on `/docs/introduction`
- WHEN the user clicks a link in the left sidebar to `/docs/quick-start`
- THEN the page SHALL update without any transition animation
- AND the URL SHALL change immediately

#### Scenario: Navigating from landing to docs (header nav)
- GIVEN a user is on the landing page `/`
- WHEN the user clicks a header nav link to `/docs/introduction`
- THEN the snapshot-clone page transition animation SHALL play normally

#### Scenario: Navigating from docs back to landing (header nav)
- GIVEN a user is on `/docs/introduction`
- WHEN the user clicks a header nav link to `/` (or the site logo)
- THEN the snapshot-clone page transition animation SHALL play normally

---

### Requirement: Left Navigation Derived from Content

The system SHALL generate the left sidebar navigation from the `content/docs/` folder and file structure.

- Folders directly under `content/docs/` SHALL appear as main section headings (non-clickable labels).
- MDX files within a folder SHALL appear as sub-items under their section heading.
- MDX files directly under `content/docs/` (not in a subfolder) SHALL appear as top-level nav items without a section heading.
- Items within each section SHALL be sorted by the `order` frontmatter field (ascending). Items without an `order` field SHALL sort last, alphabetically.

#### Scenario: Nested content structure
- GIVEN `content/docs/getting-started/installation.mdx` and `content/docs/getting-started/quick-start.mdx` exist
- WHEN the left nav renders
- THEN "Getting Started" SHALL appear as a section label
- AND "Installation" and "Quick Start" SHALL appear as sub-items beneath it

#### Scenario: Flat content structure
- GIVEN `content/docs/introduction.mdx` exists (no subfolder)
- WHEN the left nav renders
- THEN "Introduction" SHALL appear as a top-level nav item without a parent section label

#### Scenario: Order field respected
- GIVEN two files in the same section with `order: 2` and `order: 1`
- WHEN the nav renders
- THEN the file with `order: 1` SHALL appear above the file with `order: 2`

#### Scenario: Missing order field
- GIVEN a file in a section has no `order` field
- WHEN the nav renders
- THEN that file SHALL sort after all files that have an `order` field, in alphabetical order

---

### Requirement: Active Page Highlighted in Left Nav

The system SHALL visually distinguish the current page from other nav items in the left sidebar.

#### Scenario: Current page is active
- GIVEN the user is on `/docs/introduction`
- WHEN the left nav renders
- THEN the "Introduction" nav item SHALL have an active visual state (distinct from inactive items)

#### Scenario: Different page is active
- GIVEN the user is on `/docs/quick-start`
- WHEN the left nav renders
- THEN "Quick Start" SHALL be active and all other items SHALL be inactive

---

### Requirement: Right-Side Table of Contents

The system SHALL render a Table of Contents on the right side of each docs page, derived from the page's headings.

- The TOC SHALL include H2 and H3 headings from the MDX content.
- H3 entries SHALL be visually indented relative to H2 entries.
- The TOC SHALL be extracted at build time and stored in the Velite `toc` field.
- If the MDX frontmatter provides a `toc` array, it SHALL override the auto-extracted TOC. The frontmatter shape is `{ title: string; id: string; depth?: 2 | 3 }[]` — `depth` defaults to `2` if omitted.
- TOC entries SHALL scroll to their target heading via programmatic `scrollIntoView()`, not native hash navigation (native hash scrolling does not work within the custom `ScrollContainer`).

#### Scenario: Auto-extracted TOC
- GIVEN an MDX file with H2 and H3 headings and no `toc` frontmatter key
- WHEN the docs page renders
- THEN the right-side TOC SHALL list all H2 and H3 headings
- AND H3 items SHALL be indented one level deeper than H2 items

#### Scenario: Manual TOC override
- GIVEN an MDX file with a `toc` array in frontmatter
- WHEN the docs page renders
- THEN the right-side TOC SHALL use only the items defined in the frontmatter `toc` array
- AND the auto-extracted headings SHALL NOT appear

#### Scenario: Page with no headings
- GIVEN an MDX file with no H2 or H3 headings and no `toc` frontmatter
- WHEN the docs page renders
- THEN the right-side TOC area SHALL be empty (no error, no empty panel)

#### Scenario: TOC click scrolls to heading
- GIVEN a TOC entry for an H2 heading "Quick Start" with id `quick-start`
- WHEN the user clicks the TOC entry
- THEN the docs content area SHALL scroll smoothly to the heading element with `id="quick-start"`
- AND the URL hash SHALL update to `#quick-start`

---

### Requirement: Three-Column Docs Layout

The system SHALL render the docs section in a three-column layout: left nav, center content, right TOC.

- The left sidebar and right TOC SHALL be `position: sticky`, remaining visible while the user scrolls the content column.
- On viewports narrower than `lg` (1024px), the left sidebar SHALL be hidden.
- On viewports narrower than `xl` (1280px), the right TOC SHALL be hidden.
- The center content column SHALL remain readable at all supported viewport widths.

#### Scenario: Wide viewport
- GIVEN a viewport ≥ 1280px wide
- WHEN any docs page renders
- THEN all three columns (left nav, content, right TOC) SHALL be visible
- AND both sidebars SHALL remain sticky when scrolling long content

#### Scenario: Tablet viewport
- GIVEN a viewport between 1024px and 1279px wide
- WHEN any docs page renders
- THEN the left nav SHALL be visible
- AND the right TOC SHALL be hidden

#### Scenario: Mobile viewport
- GIVEN a viewport < 1024px wide
- WHEN any docs page renders
- THEN only the content column SHALL be visible (both sidebars hidden)

---

## Error Behavior

- The system SHALL NOT throw an error or crash when a doc slug resolves to no Velite document — it SHALL call Next.js `notFound()`.
- The system SHALL NOT render the right TOC if the TOC data is empty — it SHALL render nothing in the right column space.
- The system SHALL NOT render a section heading in the nav if the section has zero visible sub-items.

---

## Visual Design Reference

Reference: **https://docs.opengsd.net/** (built on Mintlify). The SuperSpecs docs layout SHALL follow this aesthetic — adapted to the Signalgray design system.

Key patterns to match:

**Left sidebar:**
- Section group labels: `text-xs font-mono uppercase tracking-wider text-white/30` — non-clickable, purely structural
- Nav items: `text-sm text-white/50`, hover `text-white`, transition on color
- Active item: distinct foreground (`text-white`) plus a left-border accent or subtle background pill — clearly distinguishable, not just a color change
- Sub-items indented `~12–16px` relative to section label baseline
- Sidebar width: ~`w-56` to `w-64`

**Right TOC:**
- Section label "On this page" at top: `text-xs font-mono uppercase tracking-wider text-white/30`
- H2 entries: `text-sm text-white/40`, hover `text-white/80`
- H3 entries: same but `pl-3` or `pl-4` indent
- Right TOC width: ~`w-48` to `w-56`

**Content area:**
- Max-width ~`720px` for prose readability, centered between the two sidebars
- Existing `prose prose-invert` classes carry over

**Overall:** Clean, high-contrast dark editorial. No decorative borders between columns — whitespace does the separation. The Signalgray-800 background is correct; token hierarchy (white/70, white/50, white/30) maps directly to Mintlify's opacity layering.

## Non-Functional Requirements

- The left nav and right TOC SHALL each have no more than one level of indentation (sections → items, H2 → H3).
- TOC extraction SHALL happen at build time, not client-side runtime.
- The docs layout SHALL use the existing Signalgray design tokens (signalgray-800 background, white/opacity text hierarchy) consistent with the current docs layout and the reference aesthetic above.

---

## Out of Scope

- Full-text search across docs
- Mobile nav drawer / hamburger menu
- Active heading highlighting (IntersectionObserver scroll-spy) — follow-up spec
- Versioning of docs content
- Breadcrumb navigation
- Previous / Next page navigation links
- Collapsible sidebar sections
- Programmatic TOC scrolling (smooth scroll-to on click is in scope; active-state tracking is not)

---

## Glossary

- **Section:** A first-level folder under `content/docs/`. Displayed as a non-clickable nav label grouping its sub-pages.
- **Sub-item:** An MDX file inside a section folder. Appears as a clickable nav link.
- **Top-level item:** An MDX file directly in `content/docs/` (no subfolder). Appears as a nav link with no parent section.
- **TOC:** Table of Contents — the right-column list of in-page anchor links derived from H2/H3 headings.
