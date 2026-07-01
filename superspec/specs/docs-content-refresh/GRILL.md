# Grill Session: Docs Content Refresh

Date: 2026-07-01
Spec reviewed: superspec/specs/docs-content-refresh/spec.md

## Pre-flight

### Wiki conflicts
Found one, resolved during interview: `tasks.md` (Task 1.3/1.4) didn't originally encode `[[ui/component-patterns]]`'s hard rules (no accent color, no icon libraries, `rounded-sm` max, no `font-bold`/`font-semibold`) for the new `Steps`/`Callout` MDX shortcodes. Fixed by adding explicit constraints to both tasks.

### Techstack conflicts
None for this spec. `techstack/profile.md` already recommends Shiki for docs syntax highlighting and has a production-readiness checklist item for it — this spec directly satisfies that. (Pre-existing, unrelated deviation noted: `techstack/profile.md` lists `next-mdx-remote` as recommended, but the actual `docs-layout` implementation uses a custom `MDXContent` via `new Function()` + `react/jsx-runtime`. This predates this spec and is out of scope to fix here.)

### Internal contradictions
None found.

## Questions & Resolutions

### Q1: Should `Callout` support a `type` prop (info/warning/note) with color-coded variants, or one single neutral style?
**Recommended:** One single style — neutral border + subtle background, no color variants, consistent with the site's no-accent-color rule.
**Resolved:** Confirmed — background color (subtle, neutral) + border, no `type` prop.
**Impact:** `tasks.md` Task 1.4 updated to explicitly forbid a `type` prop and specify single-style border + background.

### Q2: Should `<Steps>` step numbers use the large decorative phase-number type scale (`clamp(4rem, 8vw, 7rem)`) already defined for full-bleed section dividers, or a smaller inline treatment?
**Recommended:** Smaller inline `font-mono` numerals (`01`, `02`...) at label-scale size, since the large decorative scale is reserved for full-width section dividers elsewhere on the site, not inline doc content.
**Resolved:** Agreed.
**Impact:** `tasks.md` Task 1.3 updated with explicit sizing guidance and greyscale/no-icon-library constraints.

### Q3: Wave 2 tasks run in parallel across separate subagents with fresh contexts — none can see what `order` values sibling tasks choose. Verified in `docs-sidebar.tsx` that `DocsSidebar` sorts all docs globally by `order` then `title`, and derives section display order from first-appearance in that global sort. If every section's first page uses `order: 1`, ties fall back to alphabetical title sort, which would scramble the intended Getting Started → Concepts → Reference → Development sequence.
**Recommended:** Assign non-overlapping global `order` ranges per section directly in `tasks.md` now, rather than leaving reconciliation to a Wave-3 cleanup task.
**Resolved:** Agreed — ranges assigned: Getting Started 1–3, Concepts 11–13, Reference 21–22, Development 31–33.
**Impact:** `tasks.md` updated — every Wave 2 task now specifies its files' exact `order` values. Task 3.1 downgraded from "adjust order values" to "verify the outcome" (no code/content change expected if Wave 2 was followed correctly).

## Spec Changes Required

No changes to `spec.md` were required — all resolutions were scoped to `tasks.md` (task-level implementation guidance), since the spec itself already stated the behavioral requirements (section ordering, no accent color implied by "Out of Scope: adopting opengsd's literal palette") without prescribing implementation details.

## Deferred Questions

- [x] **Source line-number staleness:** deferred because the line numbers were computed from the current file state moments before this grill session, each reference is paired with a heading name for cross-check. Resolution: no drift occurred, all Wave 2 tasks located correct content by heading.
- [x] **Shiki theme fine-tuning:** `vitesse-dark` was picked as the closest stock theme to `signalgray-800`'s warm oklch tone. Resolution: kept as-is through execution, no visual issue reported.

## Verdict

**READY** — All decision branches resolved. Proceed to `/superspecs:pick-spec docs-content-refresh`.
