# Discussion: Docs Layout — Left Nav, TOC, No Transitions

Date: 2026-06-25
Participants: human + AI

## What We're Building

A proper documentation layout for the `/docs` section of the SuperSpecs homepage. The layout consists of three columns: a left sidebar with hierarchical navigation (main sections + subsections), a center content area for MDX pages, and a right-side Table of Contents that reflects the current page's headings.

The navigation structure is driven entirely by the MDX content in `content/docs/` — folder structure maps to sections, files within folders map to subsections. The docs section explicitly opts out of the site-wide page transition and custom scroll container, using native browser scroll instead.

## Goals

- Left sidebar with two-level navigation: main sections (folders) and subsections (files within folders)
- Navigation structure auto-derived from `content/docs/` folder/file hierarchy via Velite
- Right-side TOC auto-generated from H2/H3 headings, with optional manual override via MDX frontmatter
- No page transition animations within the docs section
- Native browser scroll for the docs layout (not the custom ScrollContainer)
- Active state highlighting for current page in left nav

## Non-Goals (explicitly out of scope)

- Search / full-text search across docs
- Mobile drawer / hamburger nav (can be added later)
- Versioning of docs content
- Dark/light mode toggle specific to docs (inherits site theme)
- Collapsible/expandable sidebar sections (all sections visible by default)

## Constraints

- **Technical:** Velite provides the `docs` collection from `content/docs/**/*.mdx`. The `slug` field and `order` field are already in the schema — we use these for sorting.
- **Technical:** Root `layout.tsx` wraps everything in `<PageTransition>` and `<ScrollContainer>`. The docs layout must neutralize both — either via a route-group layout that bypasses the root wrappers, or by detecting the docs route inside `PageTransition`/`ScrollContainer` and opting out.
- **Technical:** TOC extraction from compiled MDX body is non-trivial at runtime. Preferred approach: extract headings at build time via a Velite schema field (`toc`) or a remark plugin, so the data is available as static JSON.
- **Scope:** Only the docs sub-site (`/docs/**`). Landing page layout unchanged.

## Key Decisions Made

### Decision: Nav hierarchy from folder structure
**We will:** Use `content/docs/<section>/` folders as main nav items and files within as sub-items. Flat files directly in `content/docs/` appear as top-level items with no sub-nav.
**Because:** Zero config, automatically stays in sync with content. No separate nav config file to maintain.
**We won't:** Use a separate `nav.json` or frontmatter-only approach — too much manual maintenance.

### Decision: No page transitions in docs
**We will:** Exempt the entire `/docs` route from `PageTransition`. The cleanest approach is to check the route inside `PageTransition` and skip the animation, or restructure so the docs layout renders outside `PageTransition`.
**Because:** Docs navigation should feel instant, like a traditional docs site (Tailwind CSS, Next.js docs). Transitions add latency that feels wrong for reference material.
**We won't:** Keep transitions and just speed them up — the user explicitly wants none.

### Decision: Native scroll for docs
**We will:** Render the docs layout outside `ScrollContainer` (or have `ScrollContainer` pass through with `overflow: visible` for the docs route).
**Because:** Sticky sidebars and TOC tracking require predictable native scroll. The custom `ScrollContainer` intercepts scroll events in a way that complicates `position: sticky` and IntersectionObserver-based TOC highlighting.
**We won't:** Keep the custom scroll container and work around it — too fragile.

### Decision: TOC = auto from headings + optional frontmatter override
**We will:** Extract H2/H3 headings at build time (remark plugin → Velite `toc` field). In the page component, render this as the right-side TOC. Frontmatter can provide a `toc` array to override or supplement.
**Because:** Runtime DOM parsing is brittle and requires client-side JS. Build-time extraction is reliable and SSG-friendly.
**We won't:** Use a client-only IntersectionObserver approach as the primary source — it can be added later for active-heading highlighting only.

## Open Questions

- [ ] How to best exempt docs from `PageTransition` + `ScrollContainer` — route group `(marketing)` vs. conditional logic inside the components vs. restructuring `app/layout.tsx`?
- [ ] Should the Velite schema add a `section` field derived from the folder name, or compute it at runtime from the slug?
- [ ] TOC active-heading highlighting via IntersectionObserver — in scope for this spec or follow-up?
- [ ] What `order` values / naming convention for the initial MDX files to establish the nav order?

## Success Criteria

- [ ] `/docs/introduction` renders with left nav showing all sections/subsections from `content/docs/`
- [ ] Navigating between docs pages shows no transition animation
- [ ] Right TOC reflects the H2/H3 headings of the current page
- [ ] Frontmatter `toc` array overrides auto-extracted headings when present
- [ ] Active page is visually highlighted in left nav
- [ ] Sticky left nav and right TOC remain in view while scrolling long content
- [ ] Existing landing page transitions are unaffected

## Risks

- **PageTransition/ScrollContainer coupling:** The root layout tightly couples all routes to these components. Exempting docs cleanly may require a route-group restructure — low risk technically, but touches the root layout which has existing tests.
- **Velite build-time TOC extraction:** Adding a remark plugin to Velite requires config changes; if the plugin is fragile, it could break the build. Mitigation: keep the plugin simple (extract text + id from hast nodes only).
- **Nav order:** Without explicit `order` frontmatter on all files, alphabetical sorting is the fallback — may not match desired reading order. Mitigation: add `order` to all existing MDX files as part of this spec.

## Visual Reference

**https://docs.opengsd.net/** — Mintlify-based docs site. The sidebar hierarchy, active states, TOC layout, and overall editorial aesthetic are the visual target. Adapted to the Signalgray design system (not Mintlify's color scheme).

## Wiki References

- [[ui/scroll-architecture]] — Custom ScrollContainer must be bypassed for docs
- [[ui/page-transitions]] — PageTransition component that docs must opt out of
- [[ui/design-system]] — Signalgray tokens and typography to apply to docs sidebar/TOC
- [[techstack/profile]] — Next.js 15 SSG, Velite, Tailwind
