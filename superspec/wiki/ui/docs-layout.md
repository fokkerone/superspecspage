---
title: Docs Layout
summary: Three-column documentation layout — left sidebar derived from MDX content structure, center article, right TOC. No transitions between doc pages. Mintlify-inspired aesthetic adapted to Signalgray design system. 11-page content sitemap, Shiki syntax highlighting, Steps/Callout MDX shortcodes, and a critical @tailwindcss/typography registration gotcha added by docs-content-refresh.
tags: [ui, docs, layout, mdx, velite, toc, sidebar, docs-layout, shiki, syntax-highlighting, tailwind-typography, docs-content-refresh]
spec: "[[../specs/docs-layout/spec.md]]"
created: 2026-06-30
updated: 2026-07-01
provenance:
  sources:
    - specs/docs-layout/spec.md
    - specs/docs-layout/GRILL.md
    - phases/docs-layout-execute/review-log.md
    - specs/docs-content-refresh/spec.md
    - specs/docs-content-refresh/GRILL.md
    - phases/docs-content-refresh-execute/review-log.md
    - components/docs/docs-sidebar.tsx
    - components/docs/docs-toc.tsx
    - components/docs/steps.tsx
    - components/docs/callout.tsx
    - components/mdx-content.tsx
    - app/docs/layout.tsx
    - app/docs/[[...slug]]/page.tsx
    - velite.config.ts
    - app/globals.css
  extracted: ~75%
  inferred: ~15%
  ambiguous: ~10%
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

## Content Sitemap (docs-content-refresh)

The original 3 stub pages (`introduction.mdx`, `quick-start.mdx`, `how-it-works.mdx`) were replaced with an 11-page sitemap derived from `.superspecs/README.md`, `.superspecs/HOWITWORKS.md`, `.superspecs/LOCALDEVELOPMENT.md`, organized into four sidebar sections:

| Section | Pages | `order` range |
|---|---|---|
| Getting Started | introduction, installation, quick-start | 1–3 |
| Concepts | workflow, the-wiki, design-principles | 11–13 |
| Reference | skill-reference, wiki-operations | 21–22 |
| Development | how-skills-work, creating-a-skill, local-development | 31–33 |

**Non-overlapping `order` ranges are load-bearing, not cosmetic.** `DocsSidebar` sorts all docs globally by `order` then `title`, and derives section display order from first-appearance in that sorted list. If every section's first page used `order: 1`, ties would fall back to alphabetical title sort and scramble the intended section sequence (verified during the `docs-content-refresh` grill session by reading `docs-sidebar.tsx` directly). Any new section added in the future needs its own reserved `order` block (e.g. next available: 41+).

## Syntax Highlighting Pipeline

`rehype-pretty-code` (Shiki-based) was added to `velite.config.ts`'s `mdx.rehypePlugins`, **after** `rehype-slug` in the array (order matters — slug must run first so heading IDs still generate). Theme: `vitesse-dark`, chosen as the closest stock Shiki theme to `signalgray-800`'s warm oklch tone (avoided pure-blue/black themes like `github-dark`).

```ts
mdx: {
  rehypePlugins: [
    rehypeSlug,
    [rehypePrettyCode, { theme: "vitesse-dark", keepBackground: false }],
  ],
}
```

**`keepBackground: false` gotcha:** `rehype-pretty-code` bakes its own inline `style={{backgroundColor:...}}` onto the compiled `<pre>` element by default. Inline styles always win over Tailwind utility classes regardless of specificity, so without this option the existing `prose-pre:bg-white/[0.04]` class is silently overridden by a near-black `#121212` background baked into the compiled MDX output. Setting `keepBackground: false` removes Shiki's own background/color inline styles from the `<pre>` wrapper (per-token `<span style={{color:...}}>` syntax-color spans are unaffected), letting the Tailwind prose classes control the container background as intended.

## MDX Shortcodes: Steps / Callout

Two new MDX components, registered in `components/mdx-content.tsx`'s `components` map (passed as `<Component components={components} />` to the compiled MDX function):

- **`<Steps>`/`<Step title="...">`** (`components/docs/steps.tsx`) — ordered container for sequential content (used for the four-phase workflow page). Step numbers render as plain `font-mono text-sm` zero-padded numerals (`01`, `02`...) in a `rounded-sm` marker box on `bg-signalgray-900` — explicitly NOT the site's large decorative `clamp(4rem, 8vw, 7rem)` phase-number type scale, which is reserved for full-bleed section dividers elsewhere on the site. Connector: `border-l border-white/10`.
- **`<Callout>`** (`components/docs/callout.tsx`) — single visual style only (`border-l-2 border-white/15 bg-white/[0.03]`), deliberately has **no `type`/variant prop**. Color-coded variants (info/warning/error) were considered and explicitly rejected during spec grilling — they'd violate the site's "no accent color, hierarchy via opacity/weight/spacing only" rule (see [[component-patterns]]).

Both components must accept and spread through arbitrary props (especially `id`, injected by `rehype-slug` on headings) — a naive override that doesn't spread `...props` silently breaks TOC scroll-to-heading behavior.

## Critical Gotcha: `@tailwindcss/typography` was never registered

**This is the most expensive lesson from this feature.** The original `docs-layout` phase built the entire docs page around Tailwind's `prose`/`prose-h1:*`/`prose-invert` element-modifier classes — but `@tailwindcss/typography` was never added as a dependency, and no `@plugin "@tailwindcss/typography";` directive existed in `app/globals.css`. Result: **every prose class across the whole docs feature had zero effect from day one.** Headings, body text, code blocks, tables all rendered as bare unstyled HTML.

This went undetected through the entire `docs-layout` spec, its grill session, and this feature's Wave 1/2/3 code reviews, because this repo's dominant test style is source-string assertion (`expect(src).toContain("prose-h1:text-4xl")`) — which only proves a class *name* string exists in a source file, never that the plugin exists or that any CSS rule is actually generated for it. It was only caught when a human opened the page in a real browser and reported "html tags wie h1 h2 etc haben keine klassen aus dem mdx."

**Fix:** `npm install -D @tailwindcss/typography` + add `@plugin "@tailwindcss/typography";` to `app/globals.css` (Tailwind v4 CSS-first plugin registration — no `tailwind.config.js` in this project).

**Process implication:** any future task that adds or modifies `prose-*` (or any other Tailwind-plugin-dependent) classes needs a live dev-server/browser check as part of its Done criteria — source-string tests alone cannot catch a missing plugin registration.

## Open Questions

- [ ] Mobile navigation: sidebar is `hidden lg:block`. No mobile nav (hamburger, drawer) exists yet. Will be needed when docs are published for non-desktop users.
- [ ] Search across docs content — not implemented. Velite compiles all content at build time, making a simple fuse.js client-side search viable.
- [ ] TOC active-section highlighting on scroll — not implemented. Would require `IntersectionObserver` inside the ScrollContainer.
- [ ] No page yet uses `<Callout>` in real content (only component-level tests exercise it) — candidate: the two blockquote-style asides in `getting-started/quick-start.mdx`.

## Related

- [[page-transitions]] — docs-skip pattern + blink fix are documented as gotchas there
- [[scroll-architecture]] — custom ScrollContainer is why native hash scrolling doesn't work
- [[component-patterns]] — Steps/Callout join the existing pattern library; no-accent-color and shape rules governed the Callout "no type prop" decision
- [[design-system]] — signalgray tokens used by Steps' marker background; typography proportions matched to opengsd while staying inside this palette
- `components/docs/docs-sidebar.tsx` — sidebar component
- `components/docs/docs-toc.tsx` — TOC component
- `components/docs/steps.tsx` — Steps/Step MDX shortcode
- `components/docs/callout.tsx` — Callout MDX shortcode
- `components/mdx-content.tsx` — MDX component map (Steps/Step/Callout registration)
- `app/docs/layout.tsx` — Server Component layout
- `app/docs/[[...slug]]/page.tsx` — page with flattenToc + DocsTOC + prose typography classes
- `velite.config.ts` — Velite schema with s.toc(), section transform, rehypeSlug, rehype-pretty-code
- `superspec/specs/docs-content-refresh/spec.md` — full requirements for this content refresh
