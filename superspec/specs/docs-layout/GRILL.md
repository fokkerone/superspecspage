# Grill Session: Docs Layout

Date: 2026-06-25
Spec reviewed: superspec/specs/docs-layout/spec.md

---

## Pre-flight

### Wiki conflicts
`scroll-architecture.md` states "position: sticky on Docs sidebar: Works correctly." The spec stated ScrollContainer "complicates position: sticky." Contradiction resolved in Q1: ScrollContainer stays, sticky rationale removed.

### Techstack conflicts
Velite does not add `rehype-slug` by default — `rehypePlugins: []` in `velite.config.ts`. The spec required TOC anchor links (`href="#id"`) to work, but rendered MDX headings have no `id` attributes. Gap confirmed and resolved in Q2: add `rehype-slug` to Velite config.

### Internal contradictions
Spec said "navigating from docs to landing the transition SHALL play normally" but proposed route group architecture meant PageTransition in marketing layout had no exit snapshot for docs pages. Resolved in Q1: no route group, conditional skip logic in root PageTransition instead.

---

## Questions & Resolutions

### Q1: ScrollContainer removal rationale + transition architecture
**Recommended:** Drop route group restructure. Keep ScrollContainer in root layout. Modify PageTransition to skip animation when both old and new pathname start with `/docs/`. This handles marketing↔docs boundary transitions correctly while suppressing docs sidebar navigation transitions.

**User clarified:** Page transitions only on level-1 header navigation. Sidebar navigation within docs is plain router — no transition. The route group approach is abandoned entirely.

**Resolved:** PageTransition gains conditional skip: if `frozenPathname.startsWith('/docs/')` AND `pathname.startsWith('/docs/')`, skip the snapshot-clone animation. ScrollContainer stays in root layout for all routes.

**Impact:** Task 1.1 rewritten — no route group restructure, just PatheTransition conditional logic. Scenario language in Requirement 1 updated.

---

### Q2: Hash scrolling within ScrollContainer + rehype-slug
**Recommended:** Native `href="#id"` anchor links don't work inside ScrollContainer (browser scrolls `window` which is always 0). TOC component should use `onClick` + `document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })`. `href` stays set for accessibility/right-click. Add `rehype-slug` to Velite config so heading `id` attributes exist in rendered HTML.

**Resolved:** Confirmed. Both changes applied to spec and Task 3.2.

**Impact:** Task 3.2 updated: TOC uses programmatic scrollIntoView. Task 2.1 updated: add `rehype-slug` to `velite.config.ts` rehypePlugins.

---

### Q3: Manual TOC frontmatter shape
**Recommended:** `title` and `id` required, `depth` optional (defaults to `2`). Minimal author burden.

**Resolved:** Confirmed.

**Impact:** Spec updated: frontmatter TOC type is `{ title: string; id: string; depth?: 2 | 3 }[]`.

---

## Spec Changes Required

- [x] Requirement 1: Replace route group approach with PageTransition conditional skip logic
- [x] Scenario "Navigating within docs": both pathnames `/docs/*` → no animation
- [x] Scenario "Navigating from docs to landing": boundary crossing → animation plays
- [x] Task 1.1: Rewrite to "modify PageTransition skip condition" (not route group)
- [x] Task 2.1: Add `rehype-slug` to Velite `rehypePlugins`
- [x] Task 3.2: TOC scrolling uses `onClick` + `scrollIntoView`, not native hash navigation
- [x] Spec TOC frontmatter type: `depth` optional, defaults to `2`

---

## Deferred Questions

- [ ] Active heading highlighting (IntersectionObserver scroll-spy) — deferred, out of scope. Noted in DISCUSS.md as follow-up spec. The ScrollContainer means IntersectionObserver uses `root: null` (viewport), which works correctly per scroll-architecture wiki.
- [ ] Section label formatting for kebab-case folder names (`getting-started` → "Getting Started") — resolved as standard Title Case conversion, no user input needed.

---

## Verdict

**READY** — All decision branches resolved. Proceed to `/superspecs:pick-spec docs-layout`.
