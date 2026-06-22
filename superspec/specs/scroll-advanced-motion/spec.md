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

### Requirement: Hero Section is Sticky

The system SHALL make the Hero section `position: sticky` at `top: 0`.

#### Scenario: Hero sticks while Terminal scrolls over it
- GIVEN the user begins scrolling past the Hero
- WHEN the Hero would normally scroll off-screen
- THEN the Hero remains pinned at the top of the scroll container viewport
- AND the Terminal section scrolls upward over the Hero from below

#### Scenario: Terminal section renders above Hero in stacking order
- GIVEN the Hero is sticky at z-index 0
- WHEN the Terminal section scrolls over the Hero
- THEN the Terminal section is fully visible above the Hero content
- AND no Hero content bleeds through the Terminal

#### Scenario: Header remains above sticky Hero
- GIVEN the Hero section is sticky
- WHEN the Terminal scrolls over the Hero
- THEN the fixed Header (z-50) remains visible above both sections at all times

---

### Requirement: Features Section is Sticky

The system SHALL make the Features section `position: sticky` at `top: 0`.

#### Scenario: Features sticks while Agents scrolls over it
- GIVEN the user scrolls past the Features section
- WHEN the Features section would normally scroll off-screen
- THEN the Features section remains pinned at the top of the scroll container viewport
- AND the Agents section scrolls upward over the Features from below

#### Scenario: Agents section renders above Features in stacking order
- GIVEN the Features section is sticky at z-index 0
- WHEN the Agents section scrolls over it
- THEN the Agents section is fully visible above the Features content

---

### Requirement: Non-Sticky Sections Unaffected

The system SHALL leave Terminal, Problem, HowItWorks, Agents, Install, and Footer with their existing positioning and z-index behavior.

#### Scenario: Non-sticky dark sections scroll normally
- GIVEN Terminal, Problem, HowItWorks, Agents, Install sections
- WHEN the user scrolls
- THEN these sections scroll with normal document flow
- AND their `whileInView` reveal animations remain functional

---

## Error Behavior

- The system SHALL NOT introduce horizontal scrollbars at any scroll position
- The system SHALL NOT make the Header (z-50) invisible behind any sticky or non-sticky section
- The system SHALL NOT break `PageTransition` — the snapshot-clone behavior must function identically
- The system SHALL NOT apply sticky to any section other than Hero and Features
- The system SHALL NOT use `overflow: hidden` on any ancestor of the sticky sections that would break sticky positioning

---

## Non-Functional Requirements

- **Performance:** All three headline transforms (`y`, `scale`, `x`) SHALL use `will-change: transform` on the animated element
- **Accessibility:** All motion transforms SHALL be disabled when `prefers-reduced-motion: reduce` is active
- **Build:** `tsc --noEmit`, `biome check`, and `next build` SHALL pass with zero errors
- **Regressions:** All 264 pre-existing tests SHALL continue to pass
- **Visual verification:** Automated tests verify source-code correctness (correct transform values, correct CSS classes). Visual behavior (actual scale growth, section overlap) SHALL be manually verified in a real browser before ship. Automated tests do not replace browser verification for motion effects.

---

## Out of Scope

- Sticky on any section other than Hero and Features
- Horizontal scroll distance beyond 8% (no marquee/ticker effect)
- New page sections or content changes
- Mobile-specific alternative layouts
- Docs section (`/docs/*`)
- `transform-origin` tuning — deferred to post-first-render visual review
- iOS sticky flicker fix — deferred

---

## Glossary

- **sticky section:** A section with `position: sticky; top: 0` that pins to the top of the scroll container while subsequent sections scroll over it
- **scrollYProgress:** A framer-motion value from `useScroll` ranging `0→1` as the target section scrolls from entering to leaving the viewport
- **z-index schema:** sticky sections at z-index 0 (implicit), non-sticky dark sections at z-index 10, Header at z-50
