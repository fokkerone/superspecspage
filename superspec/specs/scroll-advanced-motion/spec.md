# Advanced Scroll Motion Specification

**Slug:** scroll-advanced-motion
**Status:** draft
**Depends on:** scroll-motion-style (shipped)

---

## Purpose

Zwei ergänzende visuelle Effekte auf der bestehenden Landing Page Scroll-Architektur. Erstens: Der Mega-Headline-Text im Hero skaliert beim Scrollen von `scale(1.0)` auf `scale(1.15)` und bewegt sich gleichzeitig horizontal nach links (`x: 0% → -8%`), kombiniert mit dem bereits bestehenden vertikalen Parallax — der Effekt "Text kommt auf dich zu und fährt raus". Zweitens: Die hellen Sektionen (Hero, Features) werden `position: sticky` — die nachfolgende dunkle Sektion scrollt von unten drüber und "bedeckt" die helle. Das verstärkt den Light/Dark-Kontrast dramatisch.

---

## Requirements

### Requirement: Headline Scale Transform

The system SHALL apply a scroll-bound scale transform to the mega-headline in `hero.tsx`.

#### Scenario: Scale increases as user scrolls through Hero
- GIVEN the Hero section is fully visible (scroll position at top)
- WHEN the user scrolls downward through the Hero
- THEN the headline scale increases from `1.0` toward `1.15` proportional to scroll progress
- AND the scale is bound to `scrollYProgress` of the Hero section (`offset: ["start start", "end start"]`)

#### Scenario: Scale is frozen at 1.0 on initial load
- GIVEN the user has not scrolled
- WHEN the page first renders
- THEN the headline scale is exactly `1.0` (no initial transform applied)

#### Scenario: Scale respects prefers-reduced-motion
- GIVEN the user has `prefers-reduced-motion: reduce` set
- WHEN the user scrolls
- THEN the headline scale remains at `1.0` (no scale transform applied)

---

### Requirement: Headline Horizontal Transform

The system SHALL apply a scroll-bound horizontal translate to the mega-headline.

#### Scenario: Text moves left as user scrolls through Hero
- GIVEN the Hero section is fully visible
- WHEN the user scrolls downward through the Hero
- THEN the headline translateX moves from `0%` toward `-8%` proportional to scroll progress

#### Scenario: Horizontal motion respects prefers-reduced-motion
- GIVEN the user has `prefers-reduced-motion: reduce` set
- WHEN the user scrolls
- THEN the headline translateX remains at `0%`

#### Scenario: Overflow is clipped
- GIVEN the headline grows via scale and moves left
- WHEN scale reaches `1.15` and x reaches `-8%`
- THEN no horizontal scrollbar appears
- AND no content escapes the Hero section visually

---

### Requirement: Existing Parallax Preserved

The system SHALL preserve all existing headline transforms from `scroll-motion-style`.

#### Scenario: Three transforms run simultaneously
- GIVEN the user scrolls through the Hero
- WHEN `scrollYProgress` updates
- THEN `y`, `scale`, and `x` all update simultaneously on the same element
- AND the `clipPath` entry animation on page load is unaffected

#### Scenario: useReducedMotion disables all three transforms
- GIVEN `prefers-reduced-motion: reduce`
- WHEN the page renders
- THEN `y`, `scale`, and `x` are all locked at their initial values (`0%`, `1.0`, `0%`)

---

### Requirement: Section Parallax Scroll

The system SHALL apply a subtle vertical parallax transform to selected landing page sections as they scroll through the viewport. Each section moves at a slightly different speed than native scroll, creating a layered gliding effect between sections.

#### Scenario: Dark sections translate upward faster than native scroll
- GIVEN a dark section (Terminal, Problem, HowItWorks, Agents, Install) is entering the viewport from below
- WHEN the user scrolls downward
- THEN the section translates with a subtle Y offset (`"3%" → "-3%"`) proportional to its `scrollYProgress`
- AND the section moves at a slightly different rate than the section above it

#### Scenario: Light sections translate at a different rate
- GIVEN a light section (Hero, Features) is in or entering the viewport
- WHEN the user scrolls
- THEN the light section's content has a parallax offset that differs from the adjacent dark sections
- AND the visual boundary between sections appears to glide rather than cut

#### Scenario: Parallax respects prefers-reduced-motion
- GIVEN `prefers-reduced-motion: reduce` is set
- WHEN the user scrolls
- THEN all section parallax transforms are locked at `"0%"` — no motion applied

#### Scenario: No layout shifts or gaps between sections
- GIVEN sections have parallax Y transforms applied
- WHEN transforms are at their maximum values
- THEN no visible gap or overlap of background colors appears between sections
- AND the page layout remains visually continuous

---

### Requirement: Existing Sections Unaffected by Parallax Approach

The system SHALL NOT use `position: sticky`, `position: fixed`, or `position: absolute` for the layered section effect. All sections remain in normal document flow.

#### Scenario: Sections scroll off-screen normally
- GIVEN any section on the page
- WHEN the user scrolls past it
- THEN the section scrolls out of view following normal document flow
- AND no section pins or freezes at the viewport top

---

## Error Behavior

- The system SHALL NOT introduce horizontal scrollbars at any scroll position
- The system SHALL NOT make the Header (z-50) invisible at any scroll position
- The system SHALL NOT break `PageTransition` — the snapshot-clone behavior must function identically
- The system SHALL NOT use `position: sticky` or `position: fixed` for the layered effect
- The system SHALL NOT remove any section from normal document flow

---

## Non-Functional Requirements

- **Performance:** All section parallax transforms SHALL use `will-change: transform` on animated elements
- **Accessibility:** All section parallax transforms SHALL be disabled (`"0%"` → `"0%"`) when `prefers-reduced-motion: reduce` is active
- **Build:** `tsc --noEmit`, `biome check`, and `next build` SHALL pass with zero errors
- **Regressions:** All 275 pre-existing tests SHALL continue to pass
- **Visual verification:** Automated tests verify source-code correctness. The parallax gliding effect SHALL be manually verified in a real browser before ship.

---

## Out of Scope

- `position: sticky` or fixed positioning for any section
- Horizontal parallax beyond the headline (already in Wave 1)
- New page sections or content changes
- Mobile-specific alternative layouts
- Docs section (`/docs/*`)
- Per-section different parallax factors per section type (all sections use same ±3% range)

---

## Glossary

- **section parallax:** A scroll-bound `translateY` transform applied to a section as it passes through the viewport, giving a subtle speed differential between adjacent sections
- **scrollYProgress:** A framer-motion value from `useScroll` ranging `0→1` as the target section scrolls from entering to leaving the viewport (`offset: ["start end", "end start"]`)
- **layered gliding:** The visual effect where sections appear to glide smoothly past each other due to differing scroll speeds
