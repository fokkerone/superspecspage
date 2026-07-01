# Execution Plan: Docs Layout

**Spec:** superspec/specs/docs-layout/spec.md
**Tasks:** superspec/specs/docs-layout/tasks.md
**Context estimate:** ~18k / 200k ✅
**Started:** 2026-06-25

---

## Branch

Branch name: `superspec/docs-layout`
Type: standard branch
Worktree path: N/A
Created from: main @ 6675d09
Created: 2026-06-25

---

## Execution Strategy

Wave execution order: Wave 1 → Wave 2 → Wave 3 → Wave 4
Parallelism: Wave 2 (tasks 2.1 + 2.2 parallel), Wave 3 (tasks 3.1 + 3.2 parallel), Wave 4 sequential.

---

## Wave Summary

### Wave 1 — Route Architecture
**Sequential** (single task)
Tasks: 1.1 — Modify PageTransition conditional skip
Unblocks: Wave 2

**Critical context for executor:**
- `components/page-transition.tsx` — the component to modify
- Condition: `frozenPathname.startsWith('/docs/') && pathname.startsWith('/docs/')` → instant swap, no animation
- Root `layout.tsx` and `ScrollContainer` are NOT touched
- Existing tests in `__tests__/page-transition.test.tsx` must continue to pass

---

### Wave 2 — Content Schema Extension
**Parallel** (both tasks independent, both touch `velite.config.ts` — coordinate carefully)
Tasks: 2.1 (TOC + rehype-slug), 2.2 (section field)
Unblocks: Wave 3

**Note:** Since both tasks modify `velite.config.ts`, run sequentially in practice or merge into one task. Treat as sequential 2.1 → 2.2.

---

### Wave 3 — UI Components
**Parallel** (independent components)
Tasks: 3.1 (DocsSidebar), 3.2 (DocsTOC)
Unblocks: Wave 4

---

### Wave 4 — Integration
**Sequential** (4.2 can run any time after Wave 2)
Tasks: 4.1 (wire docs layout), 4.2 (order frontmatter on MDX)
Final wave.

---

## Executor Instructions

Each subagent receives:
1. `spec.md` (full) — behavioral contract
2. `tasks.md` (their task only) — what to build and how to test it
3. The codebase on branch: `superspec/docs-layout`
4. No prior chat history

Key files executors must read before implementing:
- `components/page-transition.tsx` — Wave 1
- `velite.config.ts` — Wave 2
- `app/docs/layout.tsx` — Wave 4
- `superspec/wiki/ui/scroll-architecture.md` — scroll/sticky context
- `superspec/wiki/ui/design-system.md` — Signalgray tokens

Visual reference: https://docs.opengsd.net/ (Mintlify aesthetic — adapt to Signalgray)

---

## Human Checkpoints

- **After Wave 1:** Confirm PageTransition skip works — navigating between docs pages shows no animation, landing↔docs still animates.
- **After Wave 2:** Confirm `velite build` succeeds and types include `toc` + `section`.
- **After Wave 3:** Review DocsSidebar + DocsTOC components before wiring.
- **After Wave 4:** Full visual check — three-column layout at 1280px+, responsive breakpoints, sticky sidebars, TOC scroll behavior.
