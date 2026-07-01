# Wave 3: Integration

## Task Status

| Task | Status | Review | Notes |
|------|--------|--------|-------|
| 3.1 | ✅ done | ✅ approved | commit 68c4910 — verified section order, added regression test |
| 3.2 | ✅ done | ✅ approved | commit def4adb — fixed default `/docs` fallback, caught a live 404 |
| 3.3 | ✅ done | ✅ approved | commit 97d130f — closed untagged-code-fence test gap |

## Post-hoc fixes (found via live user testing, outside the original task list)
- **Typography hierarchy request** (commit c486fe6): matched opengsd's heading/body/table proportions, kept dark greyscale theme.
- **`@tailwindcss/typography` never registered** (commit d0acb19): root cause of "h1/h2 have no classes" — plugin missing since `docs-layout`. Fixed; user confirmed the result looks better.

Full suite after wave: 354 passed / 22 pre-existing unrelated failures (verified identical on `main`). `npm run build` succeeds.
