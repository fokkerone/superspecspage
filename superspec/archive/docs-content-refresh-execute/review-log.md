# Review Log: Docs Content Refresh

## Review: Wave 1 (Tasks 1.1–1.4) — 2026-07-01

### Pass 1: Spec Compliance
All four Wave 1 requirements (Syntax-Highlighted Code Blocks, Sequential Step Content Rendering, Callout Rendering, Existing Docs Shell Remains Functional) verified ✅ via `__tests__/docs-migration.test.ts`, `__tests__/docs-steps.test.tsx`, `__tests__/docs-callout.test.tsx`. One gap noted: no test for the "untagged code block" scenario (Medium, deferred to Wave 3, later closed in Task 3.3).

### Pass 2: Code Quality
**Findings:**
- [High, resolved] `components/docs/steps.tsx` used a raw `bg-black` on the step-number marker instead of a `signalgray-*` token, breaking the oklch-based design system. Fixed → `bg-signalgray-900`. Committed as `b3ae55d`.
- [Medium, deferred] Missing test for untagged code fence scenario — deferred to Wave 3, closed in commit `97d130f`.

**Decision:** APPROVED (0 Critical, 1 High resolved, 1 Medium deferred).

## Review: Wave 2 (Tasks 2.1–2.6) — 2026-07-01

### Pass 1: Spec Compliance
Documentation Sitemap Coverage verified ✅ — 11 new pages spot-checked against source (verbatim table transcription in `skill-reference.mdx` confirmed, including the `your-org/superspecs` URL genuinely present in source). Old stub pages confirmed deleted.

### Pass 2: Code Quality
**Findings:**
- [High, resolved] Stale test assertions in `__tests__/docs-migration.test.ts` ("Task 4.2 — MDX order frontmatter") referenced the three deleted stub files directly, causing 3 failures. Every Wave 2 subagent correctly avoided touching the shared file and flagged the issue instead. Removed the obsolete block with a pointer to its replacement coverage. Committed as `d4f8e79`.
- [Low, not required] No Wave 2 page exercises the `Callout` component yet (two blockquote-style asides in `quick-start.mdx` could have used it) — optional, not blocking.

**Decision:** APPROVED (0 Critical, 1 High resolved, 1 Low noted).

## Review: Wave 3 (Tasks 3.1–3.3) + post-hoc fixes — 2026-07-01

### Pass 1: Spec Compliance
Section-Grouped Sidebar Navigation, Default Route Resolves, and the deferred "no-language code block" scenario all verified ✅. Non-functional requirement (build succeeds, no regressions) verified across 7 separate build/test runs during this wave.

### Pass 2: Code Quality
**Findings:**
- [Critical, caught via live user testing, not automated review] `@tailwindcss/typography` was never installed or registered (`app/globals.css` had no `@plugin` directive, `package.json` had no dependency) — pre-existing since the `docs-layout` phase, not introduced by this feature. Every `prose-*`/`prose-h1:*` class site-wide had zero effect the entire time; this was invisible to source-string assertion tests (which only check that a class *name* exists in source, never that it produces any CSS) and only surfaced visually in a browser, which is how the user caught it. Fixed by installing the plugin and registering it via `@plugin "@tailwindcss/typography";`. User was offered the option to remove it in favor of manual per-tag classes but chose to keep it after confirming the fix visually. Committed as `d0acb19`.
- [Medium, resolved] User requested docs typography match `docs.opengsd.net`'s heading/body/table proportions. Flagged the conflict up front (that reference site uses light-mode colors + bold weights, violating this project's design-system rules) before implementing; user confirmed "proportions only, keep dark theme." Applied to `app/docs/[[...slug]]/page.tsx`. No rule violations (explicitly tested). Committed as `c486fe6`.
- Additionally fixed: the default `/docs` route fallback still pointed at the pre-refresh slug (`docs/introduction`), causing a real live 404 the user hit directly. Fixed in `def4adb`.

**Process note for future waves:** Source-string assertions (this repo's dominant test style) cannot detect a missing Tailwind plugin registration. A live dev-server/browser check should be part of Done criteria for any task touching `prose-*` or other Tailwind-plugin-dependent classes.

**Decision:** APPROVED (1 Critical resolved, 1 Medium resolved).
