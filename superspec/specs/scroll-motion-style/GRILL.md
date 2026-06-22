# Grill Session: Scroll Motion & Light/Dark Section Wechsel

Date: 2026-06-22
Spec reviewed: superspec/specs/scroll-motion-style/spec.md

---

## Pre-flight

### Wiki conflicts

**KRITISCH (gelöst):** `getBoundingClientRect().top` in PageTransition bricht mit Custom Scroll Container.

Die Page-Transition wiki-Seite dokumentiert: "Scroll is owned by the `body` or `html` element." Mit Custom Scroll Container wechselt der Scroll-Owner zu `div.scroll-container` — `liveRef.getBoundingClientRect().top` würde immer `0` liefern. Snapshot-Clone würde immer an falscher Position platziert.

**Lösung (Q1, Option B):** ScrollContainer kommt **außen** um ThemeProvider + PageTransition in layout.tsx. PageTransition bleibt vollständig unverändert. `getBoundingClientRect().top` misst korrekt gegen Viewport.

### Techstack conflicts

Keine.

### Internal contradictions

**Gelöst:** Task 1.2 (Architecture Diagram) zeigte ScrollContainer als Kind von PageTransition — das ist inkompatibel mit dem Snapshot-Clone-Mechanismus. Korrigiert auf Option B (ScrollContainer außen).

**Gelöst:** Task 6.1 Mapping-Tabelle — direkte Übersetzung `text-white/60` → `text-signalgray-800/60` ist auf hellem Hintergrund nicht AA-konform. Korrigiert (Q13).

---

## Questions & Resolutions

### Q1: PageTransition + Custom Scroll Container: `getBoundingClientRect().top` korrekt?
**Recommended:** Option B — ScrollContainer außen um ThemeProvider + PageTransition. PageTransition unverändert.
**Resolved:** Option B bestätigt.
**Impact:** Task 1.2 (Architecture Overview + Layout Integration) im Spec korrigiert.

### Q2: ThemeProvider `enableSystem: true` auf hell/dunkel-wechselnder Seite
**Recommended:** Kein Handlungsbedarf — Landing-Komponenten nutzen keine `dark:`-Varianten.
**Resolved:** ThemeProvider bleibt out of scope.
**Impact:** Keine.

### Q3: Hero `min-h-screen` mit Custom Scroll Container
**Recommended:** `100vh` und `100svh` sind deckungsgleich — kein Problem.
**Resolved:** Kein Handlungsbedarf.
**Impact:** Keine.

### Q4: `useScroll({ container })` und SSR mit `null` Ref
**Recommended:** framer-motion 12 fällt auf `window` zurück bei `null` — kein Crash, kein sichtbarer Bug auf SSG.
**Resolved:** Kein Handlungsbedarf.
**Impact:** Keine.

### Q5: `mix-blend-difference` Header während PageTransition
**Recommended:** Akzeptieren — ~1.45s Artefakt während Transition, visuell von Übergang dominiert. Als Gotcha dokumentieren.
**Resolved:** Akzeptiert.
**Impact:** In GRILL.md als bekanntes Gotcha dokumentiert.

### Q6: Mega-Headline Overflow — `overflow-hidden` auf Section oder sichtbar?
**Recommended:** `overflow-hidden` auf Hero-Section + `overflow-x: hidden` auf Scroll-Container.
**Resolved:** `overflow-hidden` bestätigt. Wird mit Motion weiter animiert.
**Impact:** Task 3.1 + Task 1.1 im Spec präzisiert.

### Q7: `whileInView` mit Custom Scroll Container als Root
**Recommended:** Kein `root`-Prop nötig — Container ist `height: 100svh`, deckungsgleich mit Viewport.
**Resolved:** Kein Handlungsbedarf.
**Impact:** Keine.

### Q8: Docs-Route mit Custom Scroll Container (`sticky` Sidebar)
**Recommended:** `position: sticky` funktioniert korrekt mit scrollendem Container-Vorfahren.
**Resolved:** Kein Konflikt.
**Impact:** Keine.

### Q9: Hero Layout — `justify-end` oder `justify-between`?
**Recommended:** `justify-between` — Eyebrow oben (betteroff-Style), Headline + CTA unten.
**Resolved:** `justify-between` bestätigt. Eyebrow oben mit `pt-20 md:pt-24`.
**Impact:** Task 3.1 im Spec korrigiert.

### Q10: Padding Hero-Eyebrow unter festem Header
**Recommended:** `pt-20 md:pt-24` (80–96px) auf Eyebrow-Container — Header ist `h-14` (56px).
**Resolved:** Implementierungsdetail, kein Spec-Change nötig — als Gotcha für Subagenten notiert.
**Impact:** Gotcha in GRILL.md.

### Q11: `tasks.md` fehlt
**Recommended:** Am Ende des Grills erstellen.
**Resolved:** Wird jetzt erstellt.
**Impact:** tasks.md wird neu erstellt.

### Q12: `useScroll offset: ["start start", "end start"]` korrekt?
**Recommended:** Korrekt — framer-motion berechnet scrollYProgress als Position des target relativ zum container.
**Resolved:** Kein Handlungsbedarf.
**Impact:** Keine.

### Q13: Kontrastwerte `text-signalgray-800/60` auf `bg-signalgray-100`
**Recommended:** `/60` und `/50` auf hellem Hintergrund unterschreiten AA (3.5:1). Mapping-Tabelle im Spec korrigieren.
**Resolved:** Korrektur bestätigt.
**Impact:** Task 6.1 Mapping-Tabelle im Spec aktualisiert.

---

## Spec Changes Required

1. **Architecture Overview / Task 1.2** — ScrollContainer außen um ThemeProvider+PageTransition (Option B), nicht innen. Diagram korrigiert.
2. **Task 1.1** — `overflow-x: hidden` auf `div.scroll-container` ergänzt.
3. **Task 3.1** — `justify-end` → `justify-between`. Eyebrow in oberem Block, Headline+CTA in unterem Block.
4. **Task 6.1** — Mapping-Tabelle: korrekte Opacity-Werte für hellen Hintergrund (AA-konform).

---

## Deferred Questions

- [ ] `mix-blend-difference` Artefakt während PageTransition (~1.45s) — deferred als bekanntes Gotcha. Visuell akzeptiert, ggf. Follow-up-Spec für elegantere Lösung.
- [ ] Weitere Overflow-Motion-Animationen auf dem Mega-Headline — explizit als "wird mit Motion weiter animiert" deferred in follow-up spec.
- [ ] Header `pt-20 md:pt-24` auf Hero-Eyebrow — Implementierungsdetail, kein Spec-Change.

---

## Known Gotchas (für Subagenten)

1. **`mix-blend-difference` während Transition:** Header-Text kippt die Farbe kurz (~1.45s) während PageTransition läuft. Erwartetes Verhalten — kein Bug.
2. **Hero-Eyebrow Abstand:** Header ist `h-14` (56px). Hero braucht `pt-20 md:pt-24` auf dem Eyebrow-Block damit dieser klar unter dem Header sitzt.
3. **ScrollContainer außen:** In `layout.tsx` muss ScrollContainer **außen** um ThemeProvider + PageTransition stehen. Nicht innen.
4. **`text-signalgray-800` Opacity auf hell:** Die Opacity-Tiers aus dem Design-System wurden für dunkle Hintergründe kalibriert. Auf `signalgray-100` müssen die Werte stärker sein (mind. `/70` für lesbaren Body-Text).

---

## Verdict

**READY** — Alle Decision-Branches aufgelöst. 4 Spec-Änderungen angewendet. Proceed to `/pick-spec`.
