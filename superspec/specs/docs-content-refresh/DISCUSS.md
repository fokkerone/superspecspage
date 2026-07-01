# Discussion: Docs Content Refresh (opengsd-style, Velite + Shiki)

Date: 2026-07-01
Participants: human + AI

## What We're Building

The docs infra (`app/docs/`, `velite.config.ts`, sidebar, TOC) already exists from the earlier `docs-layout` phase, but the content is thin: 3 hand-written MDX pages that only loosely mirror the real source docs, and there's no code syntax highlighting or reusable MDX shortcodes yet.

This phase does two things:
1. **Converts the three canonical source docs** — `.superspecs/README.md`, `.superspecs/HOWITWORKS.md`, `.superspecs/LOCALDEVELOPMENT.md` — into a proper multi-page doc sitemap (Getting Started / Concepts / Reference / Development), replacing the current 3 stub pages so everything derives from one source of truth.
2. **Upgrades the MDX rendering pipeline** to match the look of `docs.opengsd.net` (Steps/Step component for sequential workflows, clean tables, blockquote callouts) and adds real syntax highlighting via `rehype-pretty-code` + Shiki, replacing the current highlight-less code blocks.

## Goals
- Split the 3 source READMEs into multiple focused doc pages instead of 3 monolithic ones (e.g. Installation, Quick Start, Workflow/Phases, The Wiki, Skill Reference, Local Development).
- Add a `<Steps>`/`<Step>` MDX shortcode (opengsd-style) for the phase-loop / workflow content, registered in `MDXContent`'s component map.
- Add `rehype-pretty-code` + `shiki` for real syntax-highlighted code blocks (replacing the current plain `<pre>` styling), keeping our existing dark theme (signalgray-800 background, white/opacity text scale) rather than adopting opengsd's literal color palette.
- Keep the current `DocsSidebar` / `DocsTOC` / three-column layout — this phase is about content + rendering, not the shell.
- Existing 3 pages (`introduction.mdx`, `quick-start.mdx`, `how-it-works.mdx`) are replaced/restructured as part of the new sitemap, not kept as-is.

## Non-Goals (explicitly out of scope)
- No redesign of the docs shell/layout/sidebar itself (already shipped in `docs-layout`).
- No literal 1:1 visual clone of opengsd's color scheme/spacing — we adopt the *pattern* (Steps component, table style, callouts), not the palette.
- No search functionality, versioning, or i18n for docs.
- No changes to the wiki system itself — only documenting it.

## Constraints
- **Technical:** Must stay inside the existing stack — Next.js App Router, Velite `s.mdx()`/`s.toc()`, current `MDXContent` client component using `new Function()` + `react/jsx-runtime`. Adding `rehype-pretty-code` requires adding `shiki` as a dependency (not yet installed — only `rehype-slug` and `velite` are in `package.json`).
- **Scope:** Source content must be traceable back to `.superspecs/README.md`, `.superspecs/HOWITWORKS.md`, `.superspecs/LOCALDEVELOPMENT.md` — no invented content.
- **Other:** Velite's `s.toc()` / rehype-slug gotchas already documented in `[[ui/docs-layout]]` wiki page — must be respected (existing heading-ID / TOC-sync workaround).

## Key Decisions Made

### Decision: Source scope
**We will:** Use all three docs — `README.md`, `HOWITWORKS.md`, `LOCALDEVELOPMENT.md` — as source material, split across multiple subpages per topic (not one page per file).
**Because:** The files overlap in content (e.g. the four-phase lifecycle appears in both README and HOWITWORKS) and the user wants an opengsd-like granular sitemap (install / how / concepts as separate pages), not a 1:1 file-to-page mapping.
**We won't:** Keep a single "how-it-works" mega-page or map 1 file → 1 page.

### Decision: Replace existing stub pages
**We will:** Replace `introduction.mdx`, `quick-start.mdx`, `how-it-works.mdx` entirely as part of the new sitemap.
**Because:** They were hand-written approximations, not derived from source — keeping them alongside new pages would create two inconsistent narratives.
**We won't:** Preserve their current content/slugs untouched.

### Decision: Visual style — pattern over palette
**We will:** Adopt opengsd's layout *patterns* — a `<Steps>/<Step>` shortcode for sequential content (maps directly to the "Four Phases" / workflow content), clean bordered tables, blockquote-style callouts — implemented with our existing dark theme (signalgray-800, white/opacity text scale) already established in `[[ui/design-system]]`.
**Because:** Full 1:1 visual clone would clash with the rest of the app's established design system.
**We won't:** Copy opengsd's literal colors/spacing tokens.

### Decision: Code highlighting — rehype-pretty-code + Shiki
**We will:** Add `rehype-pretty-code` (Shiki-based) to `velite.config.ts`'s `mdx.rehypePlugins`, alongside the existing `rehype-slug`, with a theme chosen to match our dark UI (not generic github-dark).
**Because:** Real syntax highlighting is more useful for a docs site with actual command/code examples than opengsd's plain `theme={null}` blocks, and matches the tehseen.io Velite reference pattern.
**We won't:** Ship code blocks with no highlighting.

## Open Questions
- [x] Exact final sitemap/page list and slugs — resolved in spec.md: Getting Started (Introduction, Installation, Quick Start), Concepts (Workflow, The Wiki, Design Principles), Reference (Skill Reference, Wiki Operations), Development (How Skills Work, Creating a Skill, Local Development).
- [x] Exact Shiki theme name — resolved during grill: `vitesse-dark`.
- [x] Section grouping mechanism — resolved: existing `section` Velite transform derived from subfolder, non-overlapping global `order` ranges per section (1-3, 11-13, 21-22, 31-33).

## Success Criteria
- [x] All meaningful content from the 3 source docs is represented across the new doc pages (no silent content loss).
- [x] Code blocks in docs render with real syntax highlighting via Shiki.
- [x] A `<Steps>/<Step>` MDX component exists and is used for at least the phase-loop/workflow content.
- [x] Existing docs shell (sidebar, TOC, three-column layout, TOC-sync workaround) continues to work unmodified.
- [x] `npm run build` (which runs `velite && next build`) succeeds with the new content and plugins.

## Risks
- **Velite MDX component resolution:** Custom shortcodes like `<Steps>` used inside `.mdx` files need to be passed through `MDXContent`'s component map correctly — mismatch here silently renders as literal text or errors. Mitigation: verify against the same `s.mdx()`/`useMDXComponent` pattern already working for existing pages, test one page early.
- **rehype-pretty-code + rehype-slug ordering:** Plugin order matters for heading IDs vs. code block wrapping. Mitigation: check the tehseen.io reference order (`rehypeSlug` → `rehypePrettyCode` → `rehypeAutolinkHeadings`) and the existing TOC gotcha noted in `[[ui/docs-layout]]`.
- **Content drift during split:** Splitting 3 files into ~8-10 pages risks losing or duplicating content. Mitigation: do a explicit source-line mapping per new page during `/spec`.

## Wiki References
- [[ui/docs-layout]] — existing docs shell, Velite `s.toc()` gotcha, rehype-slug, no-transition skip, ScrollContainer hash-scroll workaround. Directly relevant: this phase builds on top of that shell without touching it.
- [[ui/design-system]] — signalgray-100/200 dark theme tokens, font-extrabold exception. Governs the "pattern over palette" decision above.
- [[ui/component-patterns]] — existing reusable UI patterns (link-underline, CTA, card grid, terminal mockup) — candidate for reuse/consistency with new `<Steps>`/`<Callout>` shortcodes.
- [[techstack/profile]] — confirms Next.js/Velite/MDX stack this phase must work within.
