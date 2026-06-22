# Discussion: Advanced Scroll Motion — Headline Scale+Translate & Layered Sections

Date: 2026-06-22
Participants: human + AI

## What We're Building

Zwei visuelle Upgrades auf dem bestehenden Scroll-System:

1. **Headline Scale + Horizontal Motion** — Der Mega-Headline-Text auf dem Hero skaliert beim Scrollen von `scale(1.0)` auf `scale(1.15)` und bewegt sich gleichzeitig horizontal nach links (`x: 0% → -8%`). Kombiniert mit dem bestehenden vertikalen Parallax (`y: 0% → -25%`) entsteht der Effekt dass der Text "auf dich zukommt und dabei rausfährt" — direkt nach dem signalgrau.vercel.app Vorbild.

2. **Layered Section Stack** — Die hellen Sektionen (Hero, Features) werden `position: sticky` — sie kleben am Viewport-Top während die nachfolgende dunkle Sektion von unten drüber scrollt. Das verstärkt den Light/Dark-Wechsel: die dunkle Sektion "bedeckt" die helle dramatisch statt sie einfach abzulösen. Technisch: sticky Hero + Terminal scrollt drüber; sticky Features + Agents scrollt drüber.

## Goals

- Mega-Headline erhält scroll-gebundene Horizontal-Bewegung (`x: 0 → -8%`) plus Scale-Wachstum (`scale: 1.0 → 1.15`) — zusätzlich zum bestehenden vertikalen Parallax
- Hero-Sektion wird `position: sticky; top: 0` — Terminal-Sektion scrollt von unten drüber
- Features-Sektion wird `position: sticky; top: 0` — Agents-Sektion scrollt von unten drüber
- Bestehende Animationen (clipPath entry, `y` parallax, `whileInView` reveals) bleiben erhalten
- `useReducedMotion()` Fallback für alle neuen Transforms

## Non-Goals (explicitly out of scope)

- Alle anderen Sektionen als sticky — nur Hero + Features
- Horizontale Scroll-Strecke über die Breite des Viewports hinaus (kein Marquee/Ticker)
- Neue Sektionen oder Inhaltsänderungen
- Mobile-spezifische andere Layouts
- Docs-Sektion

## Constraints

- **Technical:** Alles baut auf `ScrollContext` / `useScrollContainer()` — `useScroll({ container })` ist Pflicht. Keine neuen Libraries.
- **Sticky + ScrollContainer:** `position: sticky` im Custom Scroll Container (`overflow-y: auto`) funktioniert — sticky braucht einen scrollenden Vorfahren, das ist der Container. Kein `overflow: hidden` auf dem Container-Parent erlaubt (wird nicht gebrochen).
- **Z-Index:** Die drüber-scrollende dunkle Sektion braucht `z-index` um über der sticky hellen Sektion zu liegen. Hero ist implizit z-0; Terminal + nachfolgende dunkle Sektionen brauchen `z-index: 1` oder höher.
- **PageTransition:** Bleibt vollständig unverändert.
- **Easing:** Nur `EASE_ENTER_TUPLE` für framer-motion. Scale und X-Transform sind `useTransform` — kein eigenes `transition`.
- **Font-Regel:** `font-extrabold` bleibt nur für Mega-Headline — keine neue Ausnahme.

## Key Decisions Made

### Decision: Scale + Horizontal — scroll-gebunden, nicht load-gebunden
**We will:** `useTransform(scrollYProgress, [0, 1], [1, 1.15])` für scale, `useTransform(scrollYProgress, [0, 1], ["0%", "-8%"])` für x. Beide laufen über denselben `scrollYProgress` wie der bestehende `y` parallax.
**Because:** Scroll-gebunden ist konsistenter mit dem bestehenden System und kollidiert nicht mit der `clipPath` Entry-Animation beim Laden.
**We won't:** Separate load-Animation für scale/x — zu viele konkurrierende Transforms auf demselben Element.

### Decision: Scale-Range 1.0 → 1.15
**We will:** `scale: [1, 1.15]` — 15% Wachstum beim vollständigen Scroll-Through des Hero.
**Because:** Subtil genug für Premium-Gefühl ohne Übelkeit. Stärker (1.3+) würde bei langen Headlines aus dem Container brechen.
**We won't:** Scale > 1.2 ohne visuellen Test — zu riskant bei `whitespace-nowrap` Text.

### Decision: Horizontal-Range 0% → -8%
**We will:** `x: ["0%", "-8%"]` — Text wandert leicht nach links.
**Because:** Kombiniert mit Scale entsteht der "kommt auf dich zu und fährt nach links raus" Effekt. -8% bei 18rem Font-Size = ca. 144px Bewegung — spürbar aber nicht dramatisch.
**We won't:** Stärkere Werte ohne Test. Deferred: nach erstem Render prüfen.

### Decision: Sticky nur auf Hero + Features
**We will:** `position: sticky; top: 0` auf `hero.tsx` section und `features.tsx` section. Terminal, Agents und nachfolgende dunkle Sektionen scrollten mit `position: relative; z-index: 1` drüber.
**Because:** Die zwei Übergänge hell→dunkel (Hero→Terminal, Features→Agents) sind die visuell stärksten Momente. Alle Sektionen sticky zu machen wäre überwältigend für einen ersten Versuch.
**We won't:** Alle 8 Sektionen sticky — zu komplex, zu viel z-index Management in einem ersten Spec.

### Decision: Z-Index Schema
**We will:** Sticky Sektionen `z-index: 0` (implizit), drüber-scrollende Sektionen `z-index: 10`. Damit kann die PageTransition bei `z-index: 0/1` ungestört funktionieren.
**Because:** Einfachstes Schema das den Effekt produziert ohne den bestehenden z-index Stack (Header `z-50`, PageTransition exit `z-0`, new page `z-1`) zu brechen.
**We won't:** Negative z-index auf sticky Sektionen — riskant für andere stacked elements.

### Decision: Sticky Height
**We will:** Sticky Sektionen behalten ihre `min-h-screen` — sie sind beim Kleben am Top viewport-hoch sichtbar. Die drüber-scrollende Sektion hat normalen Flow (kein extra padding nötig).
**Because:** Kein extra Scroll-"Parking-Space" nötig — beim ersten Scroll beginnt Terminal sofort von unten zu kommen, Hero klebt.
**We won't:** Wrapper-Divs mit extra `height` für Scroll-Delay — unnötige Komplexität für den ersten Versuch.

## Open Questions

- [ ] Muss `will-change: transform` auf `motion.h1` erweitert werden für scale + x? (aktuell nur `willChange: "transform"` — das deckt alle transforms ab, sollte ausreichen)
- [ ] Soll `transform-origin` auf dem Headline explizit gesetzt werden? Default ist `center center` — Scale wächst nach allen Seiten. `transform-origin: left center` würde nach rechts wachsen lassen (Text wächst "raus"). Zu testen nach erstem Render.
- [ ] Sticky + PageTransition Snapshot: Der Clone-Mechanismus klont `liveRef` inkl. sticky Sektionen — die geklonte Version hat kein Scroll, also kein Sticky-Verhalten im Clone. Das ist akzeptabel (Clone animiert nur aus, kein Sticky nötig). Zu beobachten.

## Success Criteria

- [ ] Beim Scrollen durch Hero: Headline wird sichtbar größer (ca. 15%) und wandert nach links
- [ ] Scale + Horizontal laufen synchron mit dem bestehenden vertikalen Parallax
- [ ] Terminal-Sektion scrollt sichtbar über den klebenden Hero drüber
- [ ] Features-Sektion klebt, Agents-Sektion scrollt drüber
- [ ] Kein visueller Riss oder Sprung beim Sticky-Übergang
- [ ] `useReducedMotion()` deaktiviert scale + x (wie bisher y)
- [ ] Header (`mix-blend-difference`, `z-50`) funktioniert noch korrekt über sticky Sektionen
- [ ] PageTransition unverändert
- [ ] `tsc`, `biome`, `next build` clean

## Risks

- **`position: sticky` in Custom Scroll Container:** Sticky braucht keinen `overflow: hidden` auf einem Vorfahren. Der `ScrollContainer` hat `overflow-y: auto` — das ist kein Problem. **Aber:** Falls `overflow-x: hidden` auf dem Container sticky bricht, muss es entfernt oder auf einen Wrapper verschoben werden.
- **Scale + whitespace-nowrap Overflow:** Bei `scale(1.15)` auf einem bereits viewport-breiten Text kann der Text seitlich aus dem Container brechen. `overflow-hidden` auf der Section fängt das ab — muss verifiziert werden.
- **Z-Index + Header:** Header ist `position: fixed; z-50`. Sticky Sektionen mit hohem z-index könnten den Header überdecken. Das Schema `z-index: 10` für drüber-scrollende Sektionen + `z-50` für Header sollte korrekt sein.
- **Mobile sticky performance:** Sticky Sektionen mit Transform können auf alten iOS-Versionen flackern. `transform: translateZ(0)` als Hack nötig? Deferred.

## Wiki References

- [[ui/scroll-architecture]] — `useScrollContainer()`, ScrollContainer Placement-Regel
- [[ui/scroll-motion-system]] — bestehende Parallax-Pattern, offene Fragen explizit dokumentiert
- [[ui/easing]] — `EASE_ENTER_TUPLE` Pflicht
- [[ui/page-transitions]] — Snapshot-Clone darf nicht gebrochen werden
- [[ui/design-system]] — `overflow-hidden` auf Hero bereits vorhanden
