# Execution Plan: Advanced Scroll Motion

**Spec:** superspec/specs/scroll-advanced-motion/spec.md
**Tasks:** superspec/specs/scroll-advanced-motion/tasks.md
**Context estimate:** ~12k (spec+tasks) + ~35k (codebase context) = ~47k / 200k ✅
**Started:** 2026-06-22

---

## Branch

Branch name: `superspec/scroll-advanced-motion`
Type: branch
Worktree path: N/A
Created from: superspec/scroll-motion-style @ 9c4a224
Created: 2026-06-22

---

## Execution Strategy

Wave order: Wave 0 → Wave 1 → Wave 2 (parallel) → Wave 3
Human checkpoint after Wave 1 and Wave 2.

---

## Wave Summary

### Wave 0 — Foundation
**Sequential** (prerequisite)
Tasks: 0.1
- 0.1: `components/scroll-container.tsx` — `overflow-x: hidden → clip`
Unblocks: Wave 1 + Wave 2 (sticky needs this first)

### Wave 1 — Headline Scale + Horizontal
**Sequential** (single file)
Tasks: 1.1
- 1.1: `components/landing/hero.tsx` — scale + x transforms
Unblocks: Wave 2

### Wave 2 — Sticky Sections
**Parallel** — both tasks independent
Tasks: 2.1, 2.2
- 2.1: `hero.tsx` sticky + `terminal.tsx` z-10
- 2.2: `features.tsx` sticky + `agents.tsx` z-10
Unblocks: Wave 3

### Wave 3 — Build Verification
**Sequential**
Tasks: 3.1
- 3.1: Full suite + tsc + biome + build

---

## Critical Implementation Notes

1. **Wave 0 ist Blocking:** `overflow-x: clip` muss gesetzt sein bevor sticky Sektionen getestet werden. Safari bricht sonst sticky.
2. **Drei Transforms auf motion.h1:** `y` (bestehend), `scale` (neu), `x` (neu) — alle via `useTransform` auf demselben `scrollYProgress`. Kein eigenes `transition`.
3. **useReducedMotion Fallback:** Alle drei Transforms auf `[initial, initial]` bei reduced motion.
4. **z-index Schema:** sticky Sektionen implizit z-0, Terminal + Agents `z-10`, Header `z-50` — nicht brechen.
5. **Easing:** Kein neues `transition` auf den scroll-bound Transforms — sie sind direkt an `scrollYProgress` gebunden.
6. **Visual verification Pflicht:** Automated tests prüfen Source-Korrektheit. Browser-Verifikation ist Pflicht vor Ship.

---

## Human Checkpoints

- **Nach Wave 0+1:** ScrollContainer-Fix verifizieren, Scale+X im Dev-Server visuell prüfen → Freigabe Wave 2
- **Nach Wave 2:** Sticky Hero + Terminal overlap, sticky Features + Agents overlap visuell prüfen → Freigabe Wave 3
- **Nach Wave 3:** Final build check → Ship
