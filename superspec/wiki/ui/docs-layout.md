---
title: Docs Layout
summary: Three-column documentation layout — left sidebar derived from MDX content structure, center article, right TOC. No transitions between doc pages. Mintlify-inspired aesthetic adapted to Signalgray design system.
tags: [ui, docs, layout, mdx, velite, toc, sidebar, docs-layout]
spec: "[[../specs/docs-layout/spec.md]]"
created: 2026-06-30
updated: 2026-06-30
provenance:
  sources:
    - specs/docs-layout/spec.md
    - specs/docs-layout/GRILL.md
    - phases/docs-layout-execute/review-log.md
    - components/docs/docs-sidebar.tsx
    - components/docs/docs-toc.tsx
    - app/docs/layout.tsx
    - app/docs/[[...slug]]/page.tsx
    - velite.config.ts
  extracted: ~75%
  inferred: ~20%
  ambiguous: ~5%
---

# Docs Layout

## Summary

A three-column documentation layout for `/docs/**` routes. Left sidebar = hierarchical nav derived from MDX file structure. Center = MDX article. Right = per-page TOC auto-extracted from headings (or manually overridden via frontmatter). No page transition animations between doc pages — sidebar nav uses plain Next.js router.

Visual reference: [docs.opengsd.net](https://docs.opengsd.net/) (Mintlify aesthetic) adapted to the Signalgray dark design system.

## Context

Built to host the SuperSpecs process documentation. The sidebar structure is entirely data-driven: any new MDX file in `content/docs/` automatically appears in the nav without touching any config. The layout is a standard Next.js App Router route layout at `app/docs/layout.tsx`.

## Architecture

### Column layout

```
app/docs/layout.tsx (Server Component)
  ├── Header
  └── max-w-7xl flex container
        ├── aside (hidden lg:block, w-56 xl:w-64)  ← sidebar
        │     └── DocsSidebar (Client)
        └── div.flex-1.min-w-0                      ← children
              └── [page.tsx renders article + aside together]

app/docs/[[...slug]]/page.tsx (Server Component)
  └── div.flex.gap-8
        ├── article.flex-1.prose-invert             ← MDX article
        └── aside (hidden xl:block, w-48, sticky)   ← TOC
              └── DocsTOC (Client)
```

The TOC lives **inside the page**, not inside the layout. This avoids the need for React Context or parallel routes to pass per-page TOC data through the Server Component boundary. The layout provides the outer flex grid; each page owns its center and right columns.

### Responsive breakpoints

| Column | Breakpoint | Width |
|--------|-----------|-------|
| Sidebar | `lg:block` (≥1024px) | `w-56` (224px) / `w-64` (256px) at xl |
| TOC | `xl:block` (≥1280px) | `w-48` (192px) |
| Article | always visible | `flex-1 min-w-0` |

### No-transition rule for docs

Sidebar links are plain Next.js router — no `PageTransition` animation plays. This is enforced inside `PageTransition` via the `isDocsRoute` helper:

```ts
const isDocsRoute = (p: string) => p === '/docs' || p.startsWith('/docs/');
if (isDocsRoute(frozenPathname) && isDocsRoute(pathname)) {
  setFrozenPathname(pathname);  // instant swap, no animation
  return;
}
```

The bare `/docs` path must be explicitly matched (`=== '/docs'`) because `startsWith('/docs/')` returns false for it. See [[page-transitions]] for the blink-fix context.

## Content Modeling (Velite)

MDX files live at `content/docs/**/*.mdx`. Velite transforms them at build time.

### Schema fields

```ts
const docs = defineCollection({
  name: "Doc",
  pattern: "docs/**/*.mdx",
  schema: s.object({
    title: s.string(),
    description: s.string().optional(),
    slug: s.path(),                    // e.g. "docs/getting-started/installation"
    order: s.number().optional().default(99),
    published: s.boolean().default(true),
    body: s.mdx(),
    toc: s.toc(),                      // NESTED tree — must be flattened (see below)
    tocOverride: s.array(s.object({
      title: s.string(),
      id: s.string(),
      depth: s.number().optional().default(2),
    })).optional(),
    section: s.path().transform((path) => {
      const parts = path.split('/');
      return parts.length >= 3 ? parts[1] : null;  // "docs/section/page" → "section"
    }),
  }),
});
```

### `s.toc()` shape — critical gotcha

`s.toc()` outputs a **nested tree**, not a flat array:

```ts
// Actual shape:
[
  { title: "Introduction", url: "#introduction", items: [
    { title: "Why SuperSpecs", url: "#why-superspecs", items: [] },
    { title: "Core Concepts", url: "#core-concepts", items: [
      { title: "Spec-driven", url: "#spec-driven", items: [] }
    ]}
  ]}
]
```

The `url` field includes a `#` prefix. Flatten before use with `flattenToc()` (defined in `page.tsx`):

```ts
type VeliteTocNode = { title: string; url: string; items?: VeliteTocNode[] };
type FlatTocEntry = { title: string; id: string; depth: number };

function flattenToc(nodes: VeliteTocNode[], depth = 1): FlatTocEntry[] {
  return nodes.flatMap((node) => {
    const id = node.url.slice(1);  // strip '#'
    const entries: FlatTocEntry[] = depth >= 2 ? [{ title: node.title, id, depth }] : [];
    return [...entries, ...flattenToc(node.items ?? [], depth + 1)];
  });
}
```

Depth 1 = H1 (skipped — the page title). Depth 2 = H2. Depth 3 = H3 (indented in TOC).

### rehype-slug requirement

MDX headings need `id` attributes for the TOC `scrollIntoView` calls to work. This requires `rehype-slug` in the Velite MDX pipeline:

```ts
// velite.config.ts
import rehypeSlug from "rehype-slug";

export default defineConfig({
  mdx: { rehypePlugins: [rehypeSlug], remarkPlugins: [] },
});
```

Without `rehype-slug`, heading `id` attributes are absent and `document.getElementById(id)` returns null.

## Components

### DocsSidebar (`components/docs/docs-sidebar.tsx`)

Client component. Receives all published docs as props from the Server Component layout.

**Section detection:** A doc with `section: null` is top-level (directly in `content/docs/`). A doc with `section: "getting-started"` belongs to the `content/docs/getting-started/` subdirectory. Section name is derived by the Velite `s.path().transform()` on the `section` field.

**Ordering:** Docs sort by `order` field first, then `title` alphabetically. Section labels appear in the order their first doc appears in the sorted list.

**Active item:** Uses `usePathname()` to compare `pathname === '/' + doc.slug`. Active items show `border-l-2 border-white pl-3`; inactive items show `text-white/50 hover:text-white pl-3.5`.

**Mintlify visual patterns:**
- Section label: `text-xs font-mono uppercase tracking-wider text-white/30`
- Active item: `border-l-2 border-white pl-3 text-white`
- Inactive item: `text-white/50 hover:text-white pl-3.5`

### DocsTOC (`components/docs/docs-toc.tsx`)

Client component. Receives `FlatTocEntry[]` from the page.

**Scroll behavior:** Uses `scrollIntoView()` — NOT native hash scrolling. The site uses a custom `ScrollContainer` (`overflow-y: auto; height: 100svh`), which means `window.scrollY` is always `0` and native `#hash` anchor navigation does nothing.

```ts
const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
  e.preventDefault();                                         // block native scroll
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  window.location.hash = id;                                  // update URL bar
};
```

**Visual patterns:**
- Label: `"On this page"` in `text-xs font-mono uppercase tracking-wider text-white/30`
- H2 entries: `text-white/40 hover:text-white/80`
- H3 entries: same + `pl-3` indent

## Key Decisions

### TOC in page, not in layout

**Chose:** `DocsTOC` rendered inside each page component alongside the article.
**Over:** React Context passed from layout to a TOC slot in the layout's right column.
**Because:** TOC data is per-page. Layouts are Server Components — they can't receive per-page data via Context. Parallel routes (`@slot`) would work but add folder complexity for a simple case.
**Trade-off:** The outer flex container has two columns (sidebar + content), and the inner page flex has two more (article + TOC). The layout is slightly nested.

### Sidebar derived from MDX structure

**Chose:** Sidebar auto-derived from Velite-compiled docs at build time.
**Over:** Manual `nav.config.ts` file listing sections and items.
**Because:** Any new MDX file should appear in the nav automatically. The `section` transform in Velite schema extracts the subfolder name for grouping.
**Trade-off:** Nav structure is constrained to match folder structure — can't rearrange nav items without moving files.

### No-transition in PageTransition (not route group)

**Chose:** Conditional skip inside `PageTransition` via `isDocsRoute()`.
**Over:** Route groups `(marketing)/` and `(docs)/` with separate layouts and separate PageTransition wrappers.
**Because:** The transition is only needed on header-level navigation (marketing ↔ docs). Sidebar nav within docs should be instant. A route group restructure would have required moving all existing marketing pages.
**Trade-off:** The skip logic lives in the global transition component rather than being architecturally enforced.

## Gotchas

- **`s.toc()` is a nested tree, not a flat array.** Build-time output looks flat in the schema definition but the actual `.velite/docs.json` reveals nested `items[]`. Always flatten before passing to `DocsTOC`. See `flattenToc()` in `app/docs/[[...slug]]/page.tsx`.

- **rehype-slug must be in the Velite MDX pipeline.** Not in the default Velite config. Missing it means all headings lack `id` attributes and TOC clicks do nothing.

- **ScrollContainer kills native hash scrolling.** `window.scrollY` always returns `0` inside the custom scroll container. `document.getElementById(id)?.scrollIntoView()` is the only reliable way to scroll to a heading.

- **Bare `/docs` route needs explicit match.** `'/docs'.startsWith('/docs/')` is `false`. The `isDocsRoute` helper must check both `p === '/docs'` and `p.startsWith('/docs/')` to cover the redirect case where `/docs` serves the same content as `/docs/introduction`.

- **Section order in sidebar.** `sectionOrder` is derived by scanning `sorted` for unique sections in order of first appearance — this preserves the intended section order (by the earliest `order` value in each section) rather than alphabetical.

## Interface / Contract

```ts
// Props
DocsSidebar: { docs: Doc[] }         // Doc from @/.velite
DocsTOC: { toc: FlatTocEntry[] }     // flattened, depth stripped of #

type FlatTocEntry = {
  title: string;
  id: string;      // heading id (no # prefix)
  depth: number;   // 2 = H2, 3 = H3
};
```

## Open Questions

- [ ] Mobile navigation: sidebar is `hidden lg:block`. No mobile nav (hamburger, drawer) exists yet. Will be needed when docs are published for non-desktop users.
- [ ] Search across docs content — not implemented. Velite compiles all content at build time, making a simple fuse.js client-side search viable.
- [ ] TOC active-section highlighting on scroll — not implemented. Would require `IntersectionObserver` inside the ScrollContainer.

## Related

- [[page-transitions]] — docs-skip pattern + blink fix are documented as gotchas there
- [[scroll-architecture]] — custom ScrollContainer is why native hash scrolling doesn't work
- `components/docs/docs-sidebar.tsx` — sidebar component
- `components/docs/docs-toc.tsx` — TOC component
- `app/docs/layout.tsx` — Server Component layout
- `app/docs/[[...slug]]/page.tsx` — page with flattenToc + DocsTOC
- `velite.config.ts` — Velite schema with s.toc(), section transform, rehypeSlug
