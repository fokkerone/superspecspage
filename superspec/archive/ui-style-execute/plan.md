# Execution Plan: UI Style — Design System & Visual Language

**Spec:** superspec/specs/ui-style/spec.md
**Tasks:** superspec/specs/ui-style/tasks.md
**Context estimate:** ~14k / 200k ✅
**Started:** 2026-06-22

## Branch

Branch name: `superspec/ui-style`
Type: branch
Worktree path: N/A
Created from: main @ adbc810
Created: 2026-06-22

---

## Execution Strategy

Wave execution order: Wave 1 → Wave 2 → Wave 3
Human checkpoint required between each wave before proceeding.

Wave 1 tasks 1.1, 1.2, 1.3 are fully independent and run in parallel.
Wave 1 task 1.4 depends on 1.2 (imports from `lib/easing.ts`) — runs after 1.2.
Wave 1 task 1.6 (wiki update) is independent — runs in parallel with 1.1–1.4.
Wave 2 tasks are all independent of each other — run fully in parallel once Wave 1 is complete.
Wave 3 tasks run sequentially (3.1 audit first, 3.2 build verify after).

---

## Wave Summary

### Wave 1 — Foundation
**Parallel group A (can start together):** Tasks 1.1, 1.2, 1.3, 1.6
**Sequential after 1.2:** Task 1.4

| Task | What | Files |
|---|---|---|
| 1.1 | signalgray tokens + ease tokens + `--font-sans` binding in globals.css | `app/globals.css` |
| 1.2 | Create `lib/easing.ts` with 5 exports | `lib/easing.ts` (new) |
| 1.3 | Add `.link-underline` CSS utility to globals.css | `app/globals.css` |
| 1.4 | Replace page transition subsystem (snapshot-clone) | `components/page-transition.tsx` (new), `app/layout.tsx`, delete 4 old files |
| 1.6 | Rewrite wiki page for new transition architecture | `superspec/wiki/ui/page-transitions.md` |

**Unblocks:** Wave 2

---

### Wave 2 — Component Migration
**All parallel.** Each subagent receives spec.md + their single task only.

| Task | Component | Files |
|---|---|---|
| 2.1 | Hero | `components/landing/hero.tsx` |
| 2.2 | Header | `components/landing/header.tsx` |
| 2.3 | Features | `components/landing/features.tsx` |
| 2.4 | HowItWorks | `components/landing/how-it-works.tsx` |
| 2.5 | Install (CTA) | `components/landing/install.tsx` |
| 2.6 | Agents | `components/landing/agents.tsx` |
| 2.7 | Footer | `components/landing/footer.tsx` |
| 2.8 | Problem | `components/landing/problem.tsx` |
| 2.9 | Docs migration | `app/docs/layout.tsx`, `app/docs/[[...slug]]/page.tsx` |

**Unblocks:** Wave 3

---

### Wave 3 — Global Audit & Integration
**Sequential.**

| Task | What | Files |
|---|---|---|
| 3.1 | Global audit — catch remaining violations across all landing + docs files | Any remaining `components/landing/*.tsx`, `app/page.tsx`, `app/docs/**/*.tsx` |
| 3.2 | Build verification — `next build`, `tsc --noEmit`, `biome check` | None (verification only) |

---

## Executor Instructions

Each subagent receives:
1. `DESIGN.md` (full — source of truth for visual decisions)
2. `superspec/specs/ui-style/spec.md` (full)
3. Their single task from `superspec/specs/ui-style/tasks.md`
4. The codebase at branch: `ui-style`
5. No prior chat history

**Critical context for all subagents:**
- The signalgrau reference is at `~/Downloads/signalgrau-main`. Task 1.4 must read `components/page-transition.tsx` from that directory — it is the source to port.
- `lib/easing.ts` must exist before Tasks 1.4, 2.1 run. Wave 1 enforces this ordering.
- Wave 2 tasks import from `lib/easing.ts` — Task 1.2 must be complete.
- The `.link-underline` CSS class must be in `globals.css` before Wave 2 header migration — Task 1.3 must be complete.
- All Wave 2 tasks use `bg-signalgray-800` / `bg-signalgray-900` — these tokens must exist in `globals.css` before Wave 2 renders are testable. Task 1.1 must be complete.

---

## Human Checkpoints

**After Wave 1:**
- Verify `next build` passes
- Verify `lib/easing.ts` exists with all 5 exports
- Verify `components/page-transition.tsx` exists and `page-transition-wrapper.tsx` is deleted
- Verify `.link-underline` class exists in `globals.css` with `var(--ease-enter)`
- Verify `bg-signalgray-800` resolves in browser
- Approve before dispatching Wave 2

**After Wave 2:**
- Run all tests: `vitest run`
- Visual spot-check: landing page and `/docs/introduction` in browser
- Confirm zero emerald classes in any component
- Confirm no `rounded-full` on non-terminal-dot elements
- Approve before dispatching Wave 3

**After Wave 3:**
- All three commands pass: `next build`, `tsc --noEmit`, `biome check`
- All tests pass: `vitest run`
- Ready for `/superspecs-verify`
