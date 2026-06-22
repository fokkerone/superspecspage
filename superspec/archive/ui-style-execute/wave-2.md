# Wave 2: Component Migration

Started: 2026-06-22
Completed: 2026-06-22

## Task Status

| Task | Status | Review | Notes |
|------|--------|--------|-------|
| 2.1 | ✅ done | ✅ passed | Hero — clip-path reveal, referrer check, terminal mockup |
| 2.2 | ✅ done | ✅ passed | Header — signalgray bg, link-underline, no CTA |
| 2.3 | ✅ done | ✅ passed | Features — gap-px grid, signalgray cards |
| 2.4 | ✅ done | ✅ passed | HowItWorks — fluid phase numbers, signalgray rows |
| 2.5 | ✅ done | ✅ passed | Install — terminal mockup, Pattern A+B CTAs |
| 2.6 | ✅ done | ✅ passed | Agents — rounded-sm badges, no emerald |
| 2.7 | ✅ done | ✅ passed | Footer — opacity:0.4 SPECS, border-white/10 |
| 2.8 | ✅ done | ✅ passed | Problem — unicode ✗, signalgray cards, clamp() |
| 2.9 | ✅ done | ✅ passed | Docs — signalgray-800 bg, prose class migration |

## Review Log Summary

### Critical findings
None.

### Major findings
None.

### Minor findings
None — all forbidden patterns clean. Only `rounded-full` hits are the permitted terminal-dot exception (`w-2.5 h-2.5 rounded-full bg-white/10`).

## Tests
139/139 passing. `tsc --noEmit` clean. `next build` clean.
