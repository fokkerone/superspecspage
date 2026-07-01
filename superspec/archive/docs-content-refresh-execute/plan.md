# Execution Plan: Docs Content Refresh

**Spec:** superspec/specs/docs-content-refresh/spec.md
**Tasks:** superspec/specs/docs-content-refresh/tasks.md
**Context estimate:** ~9k (spec+tasks) + ~15-20k (source READMEs + existing docs infra reads per subagent) / 200k ✅
**Started:** 2026-07-01

## Branch

Branch name: `superspec/docs-content-refresh`
Type: branch
Worktree path: N/A
Created from: main @ 224fc03
Created: 2026-07-01

## Execution Strategy

Wave execution order: Wave 1 → Wave 2 → Wave 3 → post-hoc fixes (typography, plugin registration)
Parallelism:
- Wave 1: Tasks 1.1 and 1.2 sequential; 1.3, 1.4 parallel to each other and to 1.1/1.2 (later serialized due to shared `mdx-content.tsx` edits).
- Wave 2: Tasks 2.1–2.6 fully independent, dispatched in true parallel (6 subagents, disjoint content/test files).
- Wave 3: 3.1, 3.2 in sequence with manual verification; 3.3 last.

## Wave Summary

### Wave 1 — Rendering Pipeline Foundation
Tasks: 1.1 (Shiki + rehype-pretty-code), 1.2 (style highlighted code blocks), 1.3 (Steps/Step shortcode), 1.4 (Callout shortcode)
Unblocks: Wave 2

### Wave 2 — Content Pages
Tasks: 2.1 (Getting Started), 2.2 (Concepts — workflow), 2.3 (Concepts — wiki/design principles), 2.4 (Reference), 2.5 (Development), 2.6 (remove old how-it-works.mdx)
Unblocks: Wave 3

### Wave 3 — Integration
Tasks: 3.1 (verify sidebar section ordering), 3.2 (fix default /docs route), 3.3 (full build + regression check)

## Human Checkpoints
- After Wave 1: reviewed Steps/Callout components, found + fixed one High finding (raw `bg-black`)
- After Wave 2: spot-checked content fidelity, found + fixed stale test assertions referencing deleted files
- After Wave 3: user live-tested the dev server, surfaced a real 404 (route fallback bug, fixed) and a real "headings unstyled" bug (missing `@tailwindcss/typography` registration — a pre-existing bug from `docs-layout`, fixed here)
