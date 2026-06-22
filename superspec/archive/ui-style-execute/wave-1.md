# Wave 1: Foundation

Started: 2026-06-22
Completed: 2026-06-22

## Task Status

| Task | Status | Review | Notes |
|------|--------|--------|-------|
| 1.1 | ✅ done | ✅ passed | globals.css: signalgray tokens + ease tokens + --font-sans |
| 1.2 | ✅ done | ✅ passed | lib/easing.ts — 50/50 tests passing |
| 1.3 | ✅ done | ✅ passed | .link-underline uses var(--ease-enter) |
| 1.4 | ✅ done | ✅ passed | snapshot-clone PageTransition, old files deleted |
| 1.6 | ✅ done | n/a | wiki updated during planning phase |

## Review Log Summary

### Critical findings
None.

### Major findings
None.

### Medium findings
- **biome.json schema mismatch (pre-existing):** `biome.json` references schema 2.0.0 but CLI is 2.5.0. Keys `ignore`, `organizeImports`, and `linter.rules.recommended` are invalid in 2.5.0. This was present before Wave 1 and must be fixed before Task 3.2 (`biome check` verification). Needs `biome migrate` + config cleanup.

### Minor findings
- `globals.css:13` — `--font-heading: var(--font-sans)` is a forward-reference within `@theme inline`. Valid in Tailwind v4, but could confuse future agents. Acceptable as-is.

## Tests
50/50 passing. `tsc --noEmit` clean. `next build` clean.
