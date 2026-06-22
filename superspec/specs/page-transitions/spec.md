# Page Transitions Specification

**Slug:** page-transitions
**Status:** draft
**Depends on:** none

## Purpose

When a user navigates between any two routes via the main header navigation, the current page SHALL slide downward out of the viewport while the incoming page is revealed beneath it — a "slide-down exit" effect. The new page is already visible at rest behind the outgoing page; only the outgoing page moves. The animation engine is framer-motion. The transition variant is defined in a single isolated file so the style can be swapped without touching any page component.

---

## Requirements

### Requirement: Slide-Down Exit on Route Change

The system SHALL animate the outgoing page by translating it from `y: 0` to `y: 100%` whenever the active route changes.

#### Scenario: Navigate from landing to docs
- GIVEN the user is on `/`
- WHEN they click the "Docs" link in the header
- THEN the `/` page slides downward out of the viewport over 500ms
- AND the `/docs` page is visible at rest behind it throughout the animation

#### Scenario: Navigate between two doc pages
- GIVEN the user is on `/docs/introduction`
- WHEN they click "Quick Start" in the sidebar
- THEN the `/docs/introduction` page slides downward out of the viewport
- AND `/docs/quick-start` is visible behind it throughout

#### Scenario: Rapid navigation (click before exit completes)
- GIVEN the exit animation of page A is in progress
- WHEN the user navigates to page C
- THEN page A's animation is interrupted
- AND page C is shown immediately at rest

---

### Requirement: Incoming Page is Stationary

The system SHALL NOT animate the incoming page's entry. It SHALL be positioned at `y: 0` with `opacity: 1` from the moment the navigation begins.

#### Scenario: New page does not fly in
- GIVEN the user triggers a navigation
- WHEN the exit animation plays
- THEN the incoming page does not translate, fade, or scale — it is static

---

### Requirement: Central Transition Wrapper

The system SHALL provide a single `PageTransitionWrapper` client component that wraps all page content inside `app/layout.tsx`. Individual `page.tsx` files SHALL NOT contain any animation code.

#### Scenario: New page added to the app
- GIVEN a developer adds a new route `app/pricing/page.tsx`
- WHEN a user navigates to `/pricing`
- THEN the transition plays automatically with no changes to `page.tsx`

---

### Requirement: Swappable Transition Variant

The system SHALL define all animation variants (initial, animate, exit, transition config) in `lib/transitions.ts` as named exports. The `PageTransitionWrapper` SHALL import exactly one named variant as the active transition.

#### Scenario: Switching to a different transition style
- GIVEN `lib/transitions.ts` exports `slideDown` and `fadeOnly`
- WHEN a developer changes the import in `PageTransitionWrapper` from `slideDown` to `fadeOnly`
- THEN all route transitions use the new style
- AND no page component needs to be changed

---

### Requirement: Header Remains Above Transitioning Content

The system SHALL ensure the fixed header (`z-index: 50`) is visually above the outgoing page at all times during the transition. The `motion.div` wrapping page content SHALL NOT create a stacking context that elevates the page above the header.

#### Scenario: Header stays visible during exit
- GIVEN the exit animation is playing
- WHEN the page slides down
- THEN the header is visible over the sliding page at all times

---

### Requirement: No Scroll Jump

The system SHALL reset the window scroll position to the top of the incoming page only after the exit animation completes, or SHALL prevent the scroll position of the incoming page from being visible mid-transition.

#### Scenario: User is scrolled down, then navigates
- GIVEN the user is 800px scrolled down on `/`
- WHEN they navigate to `/docs`
- THEN the `/docs` page does not briefly show at scroll offset 800px
- AND the scroll position is at the top when `/docs` is fully revealed

---

## Error Behavior

- The system SHALL fall back to an instant route change (no animation) if framer-motion fails to load or `AnimatePresence` is unavailable.
- The system SHALL NOT throw a React error if `usePathname` returns `null`.

---

## Non-Functional Requirements

- **Performance:** The exit animation SHALL run at 60fps on a mid-range device. No layout recalculations SHALL be triggered during the animation (use `transform: translateY` only — not `top` or `margin`).
- **Bundle:** framer-motion SHALL be imported only in the client component wrapper; it SHALL NOT be included in Server Component bundles.
- **Type safety:** All animation variant objects SHALL be typed with framer-motion's `Variants` type. No `any` types.
- **Build:** The implementation SHALL produce a clean `next build` with Turbopack enabled.

---

## Out of Scope

- Enter animation on the incoming page
- Per-route different transition styles
- Browser back/forward transition
- Scroll-driven or gesture-driven animation
- `prefers-reduced-motion` support
- Prefetch or preloading logic
- Mobile-specific gesture transitions

---

## Glossary

- **Exit animation:** The motion applied to the page that is leaving the viewport.
- **Transition variant:** A named framer-motion `Variants` object defining `initial`, `animate`, and `exit` states plus a `transition` config.
- **PageTransitionWrapper:** The single client component that owns `AnimatePresence` and wraps `children` in the root layout.
- **Stacking context:** A CSS rendering layer; a `motion.div` with `position: fixed` or certain transform values can unintentionally create one.
