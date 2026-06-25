# Discussion: Hero Spray Blob

Date: 2026-06-23
Participants: human + AI

## What We're Building

Ein WebGL-Farbblob der hinter den Texten der Hero-Section schwebt. Der Blob besteht aus mehreren ineinander fließenden Knallfarben (Gelb, Orange, Grün, Violett, Pink) die sich wie Farbnebel aus Spraydosen verhalten — weiche organische Ränder, kein harter Rahmen. Die Farben mischen und bewegen sich in Echtzeit basierend auf initialer Animation, Mausposition und Scroll-Geschwindigkeit.

Technisch umgesetzt mit React Three Fiber + custom GLSL Fragment Shader der den Spray-Effekt (mehrere radiale Farbwolken mit Perlin/Simplex Noise) simuliert. Der Canvas liegt als `position: absolute` hinter den Hero-Texten.

## Goals
- Satten, opaken Mehrfarben-Blob mit Spray-Charakter (weiche Kanten, keine harten Grenzen)
- Farben mischen sich dynamisch: initiale Einlauf-Animation + Reaktion auf Mausposition + Scroll-Speed
- Hinter allen Hero-Texten (z-index unterhalb)
- WebGL via React Three Fiber für GPU-Performance

## Non-Goals (explicitly out of scope)
- Kein Effekt auf anderen Sections außer Hero
- Keine Click-Interaktion
- Kein Fallback-Canvas (prefers-reduced-motion: Blob bleibt statisch sichtbar, keine Animation)

## Constraints
- **Technical:** Next.js App Router — R3F Canvas muss `"use client"` sein, kein SSR
- **Technical:** Canvas als `position: absolute inset-0` hinter Hero-Content, `z-index: 0`, Content auf `z-index: 1`
- **Scope:** Nur Hero-Section, nicht global
- **Performance:** `willChange: transform` bereits auf Section — Canvas mit `dpr` begrenzen auf `[1, 2]`

## Key Decisions Made

### Decision: Rendering-Ansatz
**We will:** Custom GLSL Fragment Shader mit mehreren `smoothstep`-basierten Farbwolken + Simplex Noise für organische Bewegung
**Because:** Gibt den authentischen Spray-Effekt mit weichen Übergängen; GPU-nativ, kein Canvas2D-Overhead
**We won't:** CSS-Blur-Filter oder SVG — zu statisch, kein echter Spray-Charakter

### Decision: Farben
**We will:** Gelb `#FFE600`, Orange `#FF6B00`, Grün `#00FF7F`, Violett `#8B00FF`, Pink `#FF0099` — Knallfarben, opak
**Because:** Explizit vom User gewünscht: "alles knallfarben, mehr knallen"
**We won't:** Signalgray-Palette oder gedämpfte Töne

### Decision: Interaktion
**We will:** Mouse-Position als uniform → verschiebt Blob-Zentren subtil; Scroll-Speed als uniform → beschleunigt Noise-Animation
**Because:** Lebendiges, reaktives Gefühl ohne CPU-Last
**We won't:** Physics-Simulation oder Partikel — zu komplex, kein Mehrwert

### Decision: Bibliothek
**We will:** `@react-three/fiber` + `@react-three/drei` (nur für helpers falls nötig)
**Because:** Bereits Next.js/React — R3F ist der Standard-Weg für deklaratives WebGL in React
**We won't:** Vanilla Three.js direkt — zu viel Boilerplate für React-Integration

## Open Questions
- [ ] Soll der Blob beim Page-Load eingeblendet werden (fade-in) oder direkt sichtbar?

## Success Criteria
- [ ] Blob sichtbar hinter Hero-Texten auf Desktop + Mobile
- [ ] Mausbewegung bewegt Farben spürbar aber nicht überwältigend
- [ ] Scroll beschleunigt die interne Farbmischbewegung
- [ ] Initiale Animation: Blob "baut sich auf" in ~1.5s
- [ ] Keine Layout-Shifts, kein SSR-Fehler

## Risks
- **SSR:** R3F Canvas auf Server rendern → `dynamic(() => import(...), { ssr: false })` löst das
- **Mobile Performance:** Shader-Komplexität auf Mobile begrenzen via `dpr` cap

## Wiki References
None
