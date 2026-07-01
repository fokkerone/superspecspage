# Docs Content Refresh Specification

**Slug:** docs-content-refresh
**Status:** implemented
**Depends on:** docs-layout (shell must already exist — sidebar, TOC, three-column layout, Velite schema)

## Purpose

The `/docs` section currently renders three hand-written stub pages that only loosely reflect the project's real process documentation, and code samples render with no syntax highlighting. This feature replaces the stub content with a fuller, multi-page documentation set derived from the project's canonical process docs (`.superspecs/README.md`, `.superspecs/HOWITWORKS.md`, `.superspecs/LOCALDEVELOPMENT.md`), organized into topic sections, and upgrades the rendering pipeline so that (a) code blocks are syntax-highlighted and (b) sequential/step-based content (like the four-phase workflow) renders as a distinct visual component rather than plain prose — matching the documentation-site pattern established by `docs.opengsd.net`, expressed through the project's existing dark design system.

## Requirements

### Requirement: Documentation Sitemap Coverage
The system SHALL organize documentation content into multiple topic pages grouped under four sections: Getting Started, Concepts, Reference, and Development. Every page SHALL be traceable to specific content in `.superspecs/README.md`, `.superspecs/HOWITWORKS.md`, or `.superspecs/LOCALDEVELOPMENT.md`.

#### Scenario: All source content is represented
- GIVEN the three source documents (`README.md`, `HOWITWORKS.md`, `LOCALDEVELOPMENT.md`)
- WHEN the documentation sitemap is built
- THEN every major heading (`##`) from each source document maps to content in at least one doc page
- AND no page introduces claims or instructions absent from the source documents

#### Scenario: Old stub pages no longer exist as-is
- GIVEN the previous stub pages (`introduction.mdx`, `quick-start.mdx`, `how-it-works.mdx`)
- WHEN the new sitemap is in place
- THEN those three files are replaced by the new section-organized set of pages (their content is superseded, not additionally kept)

### Requirement: Section-Grouped Sidebar Navigation
The system SHALL group documentation pages in the sidebar under four labeled sections — "Getting Started", "Concepts", "Reference", "Development" — in that order, using the existing `DocsSidebar` section-grouping mechanism.

#### Scenario: Sections render in intended order
- GIVEN doc pages exist under each of the four sections
- WHEN a user views any doc page
- THEN the sidebar displays section labels in the order Getting Started → Concepts → Reference → Development
- AND pages within a section are ordered by their `order` frontmatter field

#### Scenario: A page with no section still renders
- GIVEN a top-level page not assigned to any section (if any remain, e.g. a root index)
- WHEN the sidebar renders
- THEN that page appears above all section groups, consistent with existing `DocsSidebar` behavior

### Requirement: Default Route Resolves
The system SHALL continue to serve a valid page at the bare `/docs` route after the sitemap changes.

#### Scenario: Bare /docs route still resolves to a real page
- GIVEN the introduction page's slug may change as part of the resitemap
- WHEN a user navigates to `/docs` with no further path segments
- THEN the page fallback logic resolves to the correct entry page (no 404)

### Requirement: Sequential Step Content Rendering
The system SHALL provide a reusable MDX shortcode for rendering ordered, titled steps (used at minimum for the four-phase workflow content), visually distinct from plain paragraphs.

#### Scenario: Workflow content renders as steps
- GIVEN the "Four Phases" / workflow content from the source docs
- WHEN the corresponding doc page is rendered
- THEN each phase appears as a distinct titled step in visual sequence (not as a flat bulleted list)

#### Scenario: Step component used outside MDX has no effect
- GIVEN a doc page that does not use the step shortcode
- WHEN it renders
- THEN it displays as ordinary prose without error

### Requirement: Syntax-Highlighted Code Blocks
The system SHALL render fenced code blocks in MDX content with language-aware syntax highlighting, consistent with the site's existing dark theme.

#### Scenario: A fenced code block with a known language is highlighted
- GIVEN an MDX page with a ```` ```bash ```` or ```` ```ts ```` fenced code block
- WHEN the page is built and rendered
- THEN the output HTML contains per-token styling (not a single uncolored text block)

#### Scenario: A fenced code block with no language still renders safely
- GIVEN a fenced code block with no language annotation (` ``` ` only)
- WHEN the page is built
- THEN the block still renders as a readable, monospaced code block without a build error

### Requirement: Callout Rendering
The system SHALL provide a way to render supplementary/meta information (e.g. links to external indices, warnings) as a visually distinct callout rather than a plain paragraph, matching the blockquote-callout pattern observed in the opengsd reference.

#### Scenario: A callout renders distinctly from body text
- GIVEN MDX content marking a passage as a callout
- WHEN the page renders
- THEN the callout is visually distinguished (e.g. border/background) from surrounding prose

### Requirement: Existing Docs Shell Remains Functional
The system SHALL NOT require changes to `app/docs/layout.tsx`'s column structure, `DocsTOC`'s scroll behavior, or the no-transition routing rule in order to support the new content and rendering features.

#### Scenario: TOC still works on new pages
- GIVEN a new doc page with multiple H2/H3 headings
- WHEN a user clicks a TOC entry
- THEN the page scrolls to the corresponding heading via the existing `scrollIntoView` mechanism (unchanged)

## Error Behavior

- The system SHALL fail the build (`npm run build`) if a doc page references an MDX shortcode (e.g. `<Steps>`) that is not registered in the component map, rather than silently rendering broken output.
- The system SHALL NOT silently drop headings from the TOC when new content is added — `rehype-slug` id generation SHALL continue to run for all doc pages.

## Non-Functional Requirements

- The system SHALL continue to build successfully via the existing `npm run build` script (`velite && next build`) after all content and pipeline changes.
- Adding syntax highlighting SHALL NOT regress existing passing tests for `docs-sidebar`, `docs-toc`, or `docs-migration`.

## Out of Scope

- Redesigning `app/docs/layout.tsx`'s column structure, breakpoints, or `DocsSidebar`/`DocsTOC` visual styling beyond what's needed for new section grouping.
- Adopting opengsd's literal color palette, spacing, or typography scale — only the structural *patterns* (steps, tables, callouts) are adopted, rendered in the existing signalgray dark theme.
- Mobile navigation (hamburger/drawer) for the docs sidebar.
- Full-text search across docs content.
- TOC active-section highlighting on scroll (`IntersectionObserver`).
- Content versioning or i18n.
- Any change to the actual wiki system, SuperSpecs CLI, or skills — this feature only documents them.

## Glossary

- **Section:** One of the four top-level sidebar groupings (Getting Started, Concepts, Reference, Development), derived from the subfolder a doc page's `.mdx` file lives in (per the existing `section` Velite transform).
- **Step shortcode:** An MDX component (e.g. `<Steps>`/`<Step>`) for rendering ordered, titled sequential content.
- **Callout:** An MDX component for rendering visually distinct supplementary text blocks.

## Post-Execution Addenda

Two items were addressed during execution/verification that extend beyond the original scope, both driven by direct user testing against the live dev server:

1. **Typography proportions matched to opengsd** — heading/body/table sizing and spacing scaled to match `docs.opengsd.net`'s hierarchy (H1/H2/H3 sizes, code block padding, list/table spacing), while keeping this project's dark greyscale theme (no color/weight rule violations). See `app/docs/[[...slug]]/page.tsx` prose modifier classes.
2. **`@tailwindcss/typography` plugin registration fix** — discovered the plugin was never installed/registered since the original `docs-layout` phase, meaning every `prose-*` class site-wide had been inert. Fixed by adding the dependency and a `@plugin "@tailwindcss/typography";` directive in `app/globals.css`.
