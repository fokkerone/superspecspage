# UI Style — Design System & Visual Language Specification

**Slug:** ui-style
**Status:** grilled
**Depends on:** none
**Reference adopted:** signalgrau (local archive at `~/Downloads/signalgrau-main`)

## Purpose

Migrate the SuperSpecs site from its current cold-black / emerald-accent / pill-button aesthetic to a warm editorial dark design system, as defined in `DESIGN.md`. The system establishes a single source of truth for all visual decisions — color tokens, typography, spacing, motion, and component patterns — and enforces them across every landing-page and docs-section component. After implementation, any AI agent extending the site SHALL be able to read `DESIGN.md` and produce visually consistent output.

The migration replaces three subsystems wholesale:

1. **Color palette** — emerald + cold-black → `signalgray-*` oklch tokens (signalgrau-derived). All text becomes `text-white` with opacity tiers.
2. **Page transition** — framer-motion `AnimatePresence` slide-down → snapshot-clone hand-rolled mechanic (signalgrau-derived). Two-curve easing system replaces the previous single `--ease-premium`.
3. **Pill / bold aesthetic** — `rounded-full` buttons and `font-bold` headings → `rounded-none`/`rounded-sm` geometric shapes and weight range 300–500.

Scope **includes** the docs section (`app/docs/layout.tsx`, `app/docs/[[...slug]]/page.tsx`) for token, color, font, and prose-class alignment only. The docs sidebar layout and MDX pipeline are unchanged.

---

## ⚠️ Architectural Replacement: Page Transition System

This spec **replaces** the existing `page-transitions` feature implementation:

- **DELETES:** `lib/transitions.ts`, `components/page-transition-wrapper.tsx`, `__tests__/transitions.test.ts`, `__tests__/page-transition-wrapper.test.tsx`
- **CREATES:** `lib/easing.ts`, `components/page-transition.tsx`, `__tests__/page-transition.test.tsx`, `__tests__/easing.test.ts`
- **UPDATES:** `app/layout.tsx` import

The previous `page-transitions` feature's "swappable variant via single import" pattern is a **conscious regression**. Re-introducing variants is a future spec.

The `superspec/wiki/ui/page-transitions.md` wiki page SHALL be rewritten as part of this spec (Task 1.6).

---

## Requirements

### Requirement: CSS Design Tokens

The system SHALL define all design tokens as CSS custom properties in `app/globals.css`. The `:root` block declares the oklch palette values; the `@theme inline {}` block exposes them to Tailwind v4 as `--color-signalgray-*` tokens and binds `--font-sans` and `--ease-*` tokens. No hardcoded hex values for landing-page or docs colors SHALL appear in component markup.

#### Scenario: signalgray palette tokens are declared
- GIVEN `app/globals.css` contains the six `--signalgray-{100,200,300,700,800,900}` declarations in `:root`
- WHEN a component uses `bg-signalgray-800` or `border-white/10`
- THEN the browser resolves `bg-signalgray-800` to `oklch(0.2565 0.004 84.58)`
- AND no CSS parse errors occur

#### Scenario: --font-sans is explicitly bound
- GIVEN `app/globals.css` `@theme inline {}` contains `--font-sans: var(--font-geist-sans);`
- WHEN `html { @apply font-sans }` resolves at runtime
- THEN the computed `font-family` on `<html>` includes the Geist Sans variable value
- AND text is not rendered in the browser's default sans-serif fallback

#### Scenario: --ease-enter and --ease-exit are exposed via @theme
- GIVEN `app/globals.css` `@theme inline {}` contains both easing tokens
- WHEN the `.link-underline` CSS class uses `transition: transform 650ms var(--ease-enter)`
- THEN the computed `transition-timing-function` is `cubic-bezier(0.6, 0, 0.24, 1)`

#### Scenario: Existing shadcn/ui tokens coexist
- GIVEN shadcn/ui variables are already present in `globals.css`
- WHEN the new SuperSpecs tokens are added
- THEN no shadcn/ui token is removed or overwritten
- AND the site builds cleanly with `next build`

---

### Requirement: Easing Constants Single Source of Truth

The system SHALL define easing curves and transition duration as TypeScript constants in `lib/easing.ts`. CSS consumers reference `var(--ease-enter)` / `var(--ease-exit)`; TS consumers import from `lib/easing.ts`. Tests assert against the constants, not against literal values.

#### Scenario: lib/easing.ts exports canonical constants
- GIVEN `lib/easing.ts` is created
- WHEN the file is imported
- THEN it exports `EASE_ENTER = "cubic-bezier(0.6, 0, 0.24, 1)"`
- AND it exports `EASE_EXIT = "cubic-bezier(0.82, 1, 0.36, 1)"`
- AND it exports `EASE_ENTER_TUPLE = [0.6, 0, 0.24, 1] as const`
- AND it exports `EASE_EXIT_TUPLE = [0.82, 1, 0.36, 1] as const`
- AND it exports `TRANSITION_DURATION = 1450`

#### Scenario: CSS tokens match TS constants
- GIVEN both `--ease-enter` in `globals.css` and `EASE_ENTER` in `lib/easing.ts` are declared
- WHEN their values are compared
- THEN they encode the same cubic-bezier coordinates

---

### Requirement: Color Palette — Signalgray Tokens, No Accent

The system SHALL replace all cold-black backgrounds, pure white text, and emerald accent colors with the signalgray oklch palette. The page background SHALL be `bg-signalgray-800` on both landing and docs routes. No color accent SHALL appear anywhere on either route.

#### Scenario: Landing background is signalgray-800
- GIVEN any landing-page section is rendered
- WHEN the DOM is inspected
- THEN the `<main>` element has class `bg-signalgray-800`
- AND no instance of `bg-[#080808]`, `bg-black`, or `bg-[#111110]` appears on the landing page

#### Scenario: Docs background is signalgray-800
- GIVEN `/docs/*` is rendered
- WHEN the DOM is inspected
- THEN the root docs container has class `bg-signalgray-800`
- AND no instance of `bg-[#080808]` appears in `app/docs/layout.tsx`

#### Scenario: Primary text is text-white
- GIVEN any paragraph or heading is rendered on landing or docs
- WHEN the computed color is inspected
- THEN primary text resolves to `text-white`
- AND no instance of `text-[#e8e6e3]` or warm-off-white hex values appears

#### Scenario: Emerald accent is removed entirely
- GIVEN all landing-page and docs components are migrated
- WHEN any landing or docs source file is searched
- THEN zero instances of `emerald`, `text-emerald-`, `bg-emerald-`, `#34d399`, or `prose-code:text-emerald` appear
- AND no replacement color accent is introduced

#### Scenario: Signalgrau brand orange is NOT adopted
- GIVEN the signalgrau reference uses `--brand: oklch(0.686 0.210 41)` (orange)
- WHEN the SuperSpecs `globals.css` is inspected
- THEN no `--brand` variable is declared
- AND no orange color appears in any landing or docs component

---

### Requirement: Typography — Geist Sans Stays

The system SHALL retain Geist Sans and Geist Mono as already loaded via `next/font/google` in `app/layout.tsx`. No font migration occurs in this spec. The `--font-sans` token MUST be explicitly bound to `var(--font-geist-sans)` in `@theme inline {}` so the `html { @apply font-sans }` rule resolves correctly.

#### Scenario: Geist Sans is the resolved font-family
- GIVEN `app/layout.tsx` loads Geist Sans (unchanged from current implementation)
- AND `globals.css` `@theme inline` binds `--font-sans: var(--font-geist-sans)`
- WHEN any body text or heading is rendered
- THEN `getComputedStyle(element).fontFamily` includes the Geist Sans variable's value

#### Scenario: Geist Mono is used for mono contexts
- GIVEN any component uses `font-mono`
- WHEN the page renders
- THEN that text renders in Geist Mono

---

### Requirement: Typography Scale — Fluid Headings via clamp()

The system SHALL apply fluid font sizes to all heading levels using `clamp()` expressions, per `DESIGN.md §3`. Fixed Tailwind heading classes (`text-5xl`, `text-7xl`, etc.) SHALL NOT be used on landing-page or docs headings.

#### Scenario: Display heading is fluid
- GIVEN a hero headline uses `style={{ fontSize: "clamp(3rem, 8vw, 8rem)" }}`
- WHEN the viewport is resized from 375px to 1440px
- THEN the font size transitions smoothly without a breakpoint jump

#### Scenario: Body copy is fixed size
- GIVEN a body paragraph uses `text-[1.0625rem]`
- WHEN the component renders
- THEN the font size is fixed at 17px

---

### Requirement: Typography — Weight Range 300–500, No Semibold or Bold

The system SHALL use font weights 300, 400, or 500 only on landing-page and docs components. `font-bold` (700) and `font-semibold` (600) SHALL NOT appear in any landing-page or docs source file.

#### Scenario: No bold or semibold on landing
- GIVEN all landing-page component files are audited
- WHEN `font-bold` or `font-semibold` or inline `fontWeight: 700` or `fontWeight: 600` is searched
- THEN zero instances are found in `components/landing/*.tsx` and `app/page.tsx`

#### Scenario: No bold or semibold on docs
- GIVEN the docs prose configuration is audited
- WHEN `prose-headings:font-bold` is searched
- THEN zero instances are found in `app/docs/**/*.tsx`
- AND `prose-headings:font-medium` is the active class

---

### Requirement: Shape — No Pill Shapes (Terminal-Dot Exception)

The system SHALL use `rounded-none` or `rounded-sm` (max 2px) on all cards, panels, and CTA buttons. `rounded-full` SHALL NOT appear on any landing-page or docs element **except** the three decorative window dots in terminal mockup components. Code block / terminal exteriors MAY use `rounded-lg`.

#### Scenario: CTA button is rectangular
- GIVEN any primary action button or link is rendered
- WHEN its computed `border-radius` is inspected
- THEN the value is 0px or 2px

#### Scenario: Terminal mockup outer container uses rounded-lg
- GIVEN the terminal mockup component is rendered
- WHEN the outer container's computed `border-radius` is inspected
- THEN the value is 8px (`rounded-lg`)

#### Scenario: Terminal window dots use rounded-full (explicit exception)
- GIVEN a terminal mockup is rendered
- WHEN its three macOS-style window dots are inspected
- THEN they have classes `w-2.5 h-2.5 rounded-full bg-white/10`
- AND this is the ONLY `rounded-full` usage permitted on the landing page or docs

#### Scenario: No other rounded-full usage
- GIVEN all landing and docs components are audited
- WHEN `rounded-full` is searched outside of terminal mockup window-dot elements
- THEN zero additional instances exist

---

### Requirement: Motion — Two-Curve Easing System

The system SHALL use two named easing curves, defined in `lib/easing.ts` and exposed via CSS variables in `globals.css`. `--ease-enter` (`cubic-bezier(0.6, 0, 0.24, 1)`) applies to all enter, hover, and reveal animations. `--ease-exit` (`cubic-bezier(0.82, 1, 0.36, 1)`) applies to the page-transition exit only.

#### Scenario: Underline hover uses --ease-enter
- GIVEN a nav link or text link with the `.link-underline` class is hovered
- WHEN the CSS transition is inspected
- THEN the `transition-timing-function` is `cubic-bezier(0.6, 0, 0.24, 1)`
- AND the duration is `650ms`

#### Scenario: Page-transition enter uses EASE_ENTER
- GIVEN a route change is in progress
- WHEN the new page's inline `transition` style is inspected
- THEN it includes `transform 1450ms cubic-bezier(0.6, 0, 0.24, 1)`

#### Scenario: Page-transition exit uses EASE_EXIT
- GIVEN a route change is in progress
- WHEN the exit overlay's inline `transition` style is inspected
- THEN it includes `transform 1450ms cubic-bezier(0.82, 1, 0.36, 1)`

#### Scenario: No forbidden easing curves
- GIVEN all landing, docs, and component source files are audited
- WHEN `ease-in-out`, `linear`, `easeInOut`, `easeIn`, or `easeOut` is searched in CSS or framer-motion contexts
- THEN zero instances are found
- (Note: `--ease-enter` and `--ease-exit` are the only permitted easing tokens.)

---

### Requirement: Motion — Underline-Scrub Hover Pattern

The system SHALL implement the double-underline scrub pattern from `DESIGN.md §6` as the standard hover indicator for all nav links and text links on the landing page. The CSS utility class `.link-underline` SHALL be defined in `app/globals.css`. `hover:text-white` SHALL NOT be the primary hover feedback on landing-page links.

#### Scenario: Nav link hover draws underline
- GIVEN a header nav link is in its default state (no hover)
- WHEN the user moves their cursor over the link
- THEN an underline draws in from the left at 650ms with `--ease-enter`
- AND the first underline retracts from the right simultaneously
- AND the text color does not change

#### Scenario: .link-underline CSS class is defined
- GIVEN `app/globals.css` is inspected
- WHEN searched for `.link-underline`
- THEN the class is defined with `::before` and `::after` pseudo-elements
- AND both pseudo-elements use `var(--ease-enter)` in their transition

---

### Requirement: Motion — Hero Clip-Path Reveal on First Load Only

The Hero headline SHALL animate via a framer-motion `clipPath` + `y` reveal on first page load only. When the user navigates to `/` from an internal route (e.g. `/docs/intro`), the reveal SHALL be skipped — the Hero text renders immediately at its rest state. The discriminator SHALL be `document.referrer` origin matching `window.location.origin`.

#### Scenario: Hero clip-path reveal fires on first page load
- GIVEN the user lands on `/` from an external source (direct URL entry, bookmark, external link)
- AND `document.referrer` is empty OR its origin differs from `window.location.origin`
- WHEN the Hero component mounts
- THEN it animates `clipPath: inset(100% 0 0 0), y: "80%"` → `clipPath: inset(0% 0 0 0), y: "0%"`
- AND the duration is 1250ms with `EASE_ENTER_TUPLE`

#### Scenario: Hero clip-path reveal skipped on internal navigation
- GIVEN the user navigates from `/docs/intro` to `/` via an in-site `<Link>`
- AND `document.referrer.origin === window.location.origin`
- WHEN the Hero component mounts during the page transition
- THEN `motion.h1` has `initial={false}`
- AND the Hero text is rendered immediately at its `animate` rest state
- AND no clip-path animation plays

#### Scenario: Browser refresh on / counts as internal navigation
- GIVEN the user refreshes `/` directly
- AND `document.referrer` is `/` (same origin)
- WHEN the Hero remounts
- THEN no clip-path reveal animation plays

---

### Requirement: Page Transition — Snapshot-Clone Mechanic

The system SHALL replace the existing `framer-motion` `AnimatePresence` page-transition implementation with a hand-rolled snapshot-clone component, ported from the signalgrau reference. The new component SHALL be `components/page-transition.tsx`. The old `lib/transitions.ts` and `components/page-transition-wrapper.tsx` SHALL be deleted.

The component captures a DOM clone of the live page on `mousedown`/`touchstart` (before Next.js routing fires), then on pathname change:
- Renders the captured clone in a fixed overlay at `z-index: 0`
- Animates exit: `translateY(0) scale(1) opacity(1)` → `translateY(-84%) scale(0.82) opacity(0)` over `1450ms` with `EASE_EXIT`, starting after `250ms` delay
- Renders the new page at `z-index: 1`, animating `translateY(100vh)` → `translateY(0)` over `1450ms` with `EASE_ENTER`
- After `TRANSITION_DURATION + 200ms`, removes the overlay and updates `frozenPathname`

#### Scenario: components/page-transition.tsx replaces page-transition-wrapper.tsx
- GIVEN the migration is complete
- WHEN `components/` is listed
- THEN `page-transition.tsx` exists
- AND `page-transition-wrapper.tsx` does not exist
- AND `lib/transitions.ts` does not exist

#### Scenario: app/layout.tsx imports PageTransition
- GIVEN `app/layout.tsx` is inspected
- WHEN searched for transition imports
- THEN it imports `PageTransition` from `@/components/page-transition`
- AND it does NOT import `PageTransitionWrapper`

#### Scenario: PageTransition does not use framer-motion AnimatePresence
- GIVEN `components/page-transition.tsx` is inspected
- WHEN searched for `framer-motion`, `AnimatePresence`, or `motion.`
- THEN zero instances are found
- (The component uses raw CSS transitions and DOM manipulation.)

#### Scenario: Snapshot captured on mousedown
- GIVEN the PageTransition component is mounted
- WHEN a `mousedown` event fires on `document` (with `{capture: true}`)
- THEN `snapshotRef.current` is populated with a cloned DOM node and a `top` offset
- AND the cloned node is created via `liveRef.current.cloneNode(true)`

#### Scenario: Exit overlay clipped by parent
- GIVEN a page transition is in progress
- WHEN the exit overlay is inspected
- THEN it contains a plain `div` clipper (no transform) with `overflow:hidden`
- AND the cloned page node inside has `transform: translateY(<captured top>px)`

#### Scenario: New page enters from translateY(100vh)
- GIVEN a page transition is in progress
- WHEN the new page wrapper's initial inline style is inspected
- THEN it includes `transform: translateY(100vh)`
- AND after `requestAnimationFrame * 2`, the transform animates to `translateY(0)` with the EASE_ENTER curve

#### Scenario: Old page overlay sits at z-0, new page at z-1, header at z-50
- GIVEN a page transition is in progress
- WHEN element z-indices are inspected
- THEN exit overlay has `zIndex: 0`
- AND new page wrapper has `zIndex: 1`
- AND the fixed header (existing `z-50`) is visible above both

#### Scenario: frozenPathname updates after duration + 200ms
- GIVEN a page transition is in progress
- WHEN `setTimeout` fires after `TRANSITION_DURATION + 200` (`1650ms`)
- THEN `frozenPathname` is updated to the new `pathname`
- AND the overlay is removed from the DOM

#### Scenario: Transitions fire on landing ↔ docs routes
- GIVEN the user is on `/`
- WHEN they navigate to `/docs/introduction`
- THEN the snapshot-clone transition plays (1450ms cycle)
- AND the same applies in reverse from `/docs/*` to `/`

---

### Requirement: Reduced Motion Skips Page Transition

The system SHALL skip the snapshot-clone page transition entirely when the user has `prefers-reduced-motion: reduce` set. Under reduced motion, route changes SHALL produce an instant content swap (default Next.js behavior). The Hero clip-path reveal SHALL also be effectively bypassed on internal navigation (already gated by the referrer check).

#### Scenario: Reduced motion skips snapshot capture
- GIVEN the user has `prefers-reduced-motion: reduce` set in their OS
- AND the PageTransition component is mounted
- WHEN a `mousedown` event fires
- THEN no snapshot is captured (or, equivalently, snapshot is discarded before use)

#### Scenario: Reduced motion produces instant route swap
- GIVEN the user has `prefers-reduced-motion: reduce` set
- WHEN they navigate from `/` to `/docs/introduction`
- THEN `frozenPathname` is updated to `/docs/introduction` synchronously on pathname change
- AND no exit overlay is rendered
- AND no `translateY(100vh)` initial transform is applied to the new page
- AND no 1450ms timer fires

#### Scenario: PageTransition checks matchMedia
- GIVEN `components/page-transition.tsx` is inspected
- WHEN searched for reduced-motion handling
- THEN it calls `window.matchMedia("(prefers-reduced-motion: reduce)").matches`
- AND it includes the SSR guard `typeof window !== "undefined"`

---

### Requirement: Component Patterns — Navigation Header

The system SHALL implement the navigation header per `DESIGN.md §7`: fixed, `h-14`, warm-tinted blur background using `signalgray-800/80`, wordmark-only logo, underline-scrub nav links via `.link-underline`, no CTA button in header, bottom border `border-white/10`.

#### Scenario: Header background is signalgray-800/80
- GIVEN the header is rendered
- WHEN the DOM is inspected
- THEN it has class `bg-signalgray-800/80 backdrop-blur-md`
- AND no instance of `bg-[#080808]/80` remains

#### Scenario: Header stays fixed on scroll
- GIVEN the user scrolls down 500px on the landing page
- WHEN the header position is inspected
- THEN it remains fixed at the top of the viewport
- AND the backdrop blur is visible over content beneath

#### Scenario: Mobile header hides nav links
- GIVEN the viewport width is 375px (mobile)
- WHEN the header renders
- THEN only the logo wordmark is visible — no nav links
- AND there is no hamburger menu icon

#### Scenario: Nav links carry .link-underline class
- GIVEN the header is rendered on desktop
- WHEN nav link elements are inspected
- THEN each `<Link>` has `className` containing `link-underline`
- AND no `hover:text-white` pattern is present

---

### Requirement: Component Patterns — CTA Button Style

The system SHALL render all primary action CTAs as either (A) a text link with `.link-underline` class, or (B) a minimal bordered rectangle with `rounded-sm` and `border-white/15`. Neither pattern uses a filled background color.

#### Scenario: Primary CTA has no filled background
- GIVEN any CTA button is rendered on landing
- WHEN its computed `background-color` is inspected
- THEN the value is transparent
- AND no emerald, colored, or `bg-white` fill exists

#### Scenario: Bordered CTA uses rounded-sm
- GIVEN a Pattern B (bordered rectangle) CTA is rendered
- WHEN its computed `border-radius` is inspected
- THEN the value is 2px (`rounded-sm`)

---

### Requirement: Iconography — No Icon Libraries

The system SHALL NOT use Lucide, Heroicons, or any SVG icon library on landing-page or docs components. All symbolic elements SHALL be Unicode characters rendered in `font-mono`. (The signalgrau reference uses `lucide-react`; this is intentionally **not** adopted.)

#### Scenario: Section markers use unicode
- GIVEN any section eyebrow or section marker is rendered
- WHEN the markup is inspected
- THEN the symbol is a plain unicode character (`●`, `→`, `◈`, etc.) in a `<span>` with `font-mono`
- AND no `<svg>` icon element from a third-party icon library is present

#### Scenario: lucide-react is not imported by landing or docs components
- GIVEN all `components/landing/*.tsx` and `app/docs/**/*.tsx` files are audited
- WHEN imports are searched
- THEN no file imports from `lucide-react`

---

### Requirement: Section Spacing — Vertical Rhythm

The system SHALL apply generous section vertical padding per `DESIGN.md §4`. Standard landing sections SHALL use a minimum of `py-24` on mobile and `py-40` on desktop.

#### Scenario: Standard section meets minimum padding
- GIVEN any non-hero landing section
- WHEN its computed vertical padding is measured on a 1280px viewport
- THEN the top and bottom padding is at least 160px (`py-40`)

---

### Requirement: Docs Section Migration

The system SHALL migrate the docs section (`app/docs/layout.tsx` and `app/docs/[[...slug]]/page.tsx`) to use the new tokens. The sidebar layout, navigation structure, and MDX rendering pipeline are unchanged. Only color, font, and prose classes are swapped.

#### Scenario: Docs container uses signalgray-800
- GIVEN `app/docs/layout.tsx` is inspected
- WHEN searched for the root container
- THEN it has class `bg-signalgray-800 text-white`
- AND no `bg-[#080808]` remains

#### Scenario: Docs prose code class is migrated
- GIVEN `app/docs/[[...slug]]/page.tsx` is inspected
- WHEN searched for `prose-code:`
- THEN the prose code styling is `prose-code:text-white prose-code:bg-white/[0.04] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-sm prose-code:text-xs`
- AND no `prose-code:text-emerald-400` remains

#### Scenario: Docs prose anchor class is migrated
- GIVEN `app/docs/[[...slug]]/page.tsx` is inspected
- WHEN searched for `prose-a:`
- THEN the prose anchor styling is `prose-a:text-white prose-a:underline prose-a:decoration-white/30 hover:prose-a:decoration-white`
- AND no `prose-a:text-emerald-400` remains

#### Scenario: Docs prose headings are not bold
- GIVEN `app/docs/[[...slug]]/page.tsx` is inspected
- WHEN searched for `prose-headings:`
- THEN the heading styling uses `prose-headings:font-medium prose-headings:tracking-tight`
- AND no `prose-headings:font-bold` remains

#### Scenario: Docs prose body opacity tiers are bumped
- GIVEN `app/docs/[[...slug]]/page.tsx` is inspected
- WHEN searched for body and list prose classes
- THEN `prose-p:text-white/70` is the body color (bumped from `/60`)
- AND `prose-li:text-white/70` is the list color
- AND `prose-th:text-white/80 prose-th:border-white/15` is the table header style
- AND `prose-td:text-white/60 prose-td:border-white/10` is the table data style

---

## Error Behavior

- The system SHALL NOT throw a TypeScript compile error on `next build` after migration (`tsc --noEmit` must pass).
- The system SHALL NOT introduce any Biome linting errors after migration.
- The system SHALL NOT break route navigation — every route accessible before migration remains accessible.
- The system SHALL NOT render any layout shift (CLS > 0.1) attributable to the migration.
- The PageTransition component SHALL handle programmatic navigation (`router.push` without a preceding `mousedown`) gracefully — falling back to `captureSnapshot()` in `useLayoutEffect` when no snapshot exists.

---

## Non-Functional Requirements

- **Performance:** Lighthouse Performance score SHALL remain ≥ 90 after the migration.
- **CLS:** Cumulative Layout Shift SHALL be < 0.1.
- **Bundle:** No new JavaScript dependencies are introduced. The new `page-transition.tsx` is plain React + DOM APIs; it does NOT add framer-motion to the transition path. (framer-motion remains for the Hero clip-path reveal.)
- **Build:** `next build` with Turbopack enabled SHALL complete without errors related to this migration.
- **Accessibility:** Color contrast for primary text (`text-white` on `signalgray-800` ≈ `oklch(0.2565 0 0)`) SHALL meet WCAG AAA (computed ratio ≈ 11.7:1). Body secondary text uses `text-white/70` (≈ 7.6:1, AAA). Floor for readable secondary text is `text-white/50` (≈ 5.1:1, AA). `text-white/40` and below are decorative-only.
- **Accessibility — Reduced Motion:** Page transitions SHALL be skipped under `prefers-reduced-motion: reduce`. The Hero clip-path reveal is gated by the first-load referrer check and is effectively rare under repeat visits.

---

## Out of Scope

- Light mode for the landing page or docs
- Docs section structural redesign (sidebar layout, MDX pipeline, content hierarchy unchanged)
- Mobile navigation / hamburger menu
- Hero section typographic redesign (terminal mockup replacement vs. editorial treatment — deferred)
- `<Install />` CTA section format change (full-bleed vs. card — deferred)
- Any backend, API, or content changes
- i18n / localization
- Re-introducing swappable page-transition variants (the previous `lib/transitions.ts` swappable-import pattern is consciously abandoned — future spec)
- Tuning the page-transition `TRANSITION_DURATION` after first render (locked at 1450ms; visual judgment deferred to post-merge feedback)
- Adopting signalgrau's `--brand` orange or any color accent
- Adopting signalgrau's `lucide-react` icon usage

---

## Glossary

- **Design token:** A named CSS custom property encoding a single visual decision (color, easing, etc.).
- **Signalgray:** The oklch greyscale palette adopted from the signalgrau reference, defined as `--signalgray-{100..900}`.
- **Underline-scrub:** A hover animation where one underline retracts from the right while a new one draws in from the left.
- **Clip-path reveal:** An entrance animation where text slides up into view from behind a clipping rectangle.
- **--ease-enter:** `cubic-bezier(0.6, 0, 0.24, 1)` — primary easing for hovers, reveals, and page-transition enter.
- **--ease-exit:** `cubic-bezier(0.82, 1, 0.36, 1)` — page-transition exit only.
- **Snapshot-clone mechanic:** Hand-rolled page transition that captures a DOM clone of the current page on `mousedown`, then animates the clone out while the new page slides in.
- **`TRANSITION_DURATION`:** 1450ms — the full page-transition cycle duration.
- **Internal navigation:** `document.referrer.origin === window.location.origin` — a route change within the site (vs. external entry).
- **DESIGN.md:** The machine-readable design system document at the repo root. Source of truth for visual decisions.
- **`lib/easing.ts`:** Canonical TS module exporting easing constants. Source of truth for motion timing.
