# Grill Session: Advanced Scroll Motion

Date: 2026-06-22
Spec reviewed: superspec/specs/scroll-advanced-motion/spec.md

---

## Pre-flight

### Wiki conflicts
**KRITISCH (gelöst):** `overflow-x: hidden` auf dem `ScrollContainer` bricht `position: sticky` in Safari. Der ScrollContainer hat `overflowX: "hidden"` (gesetzt in scroll-motion-style Task 1.1). Per CSS-Spec und Safari-Verhalten: ein Ancestor mit `overflow-x: hidden` blockiert `position: sticky` bei Nachkommen.

**Lösung:** `overflow-x: "hidden"` → `overflow-x: "clip"` auf dem ScrollContainer. `overflow: clip` clippt Content ohne einen Scroll-Container zu erstellen — blockiert kein sticky in keinem Browser. Wave 0 (Task 0.1) wurde für diese Änderung ergänzt.

### Techstack conflicts
Keine.

### Internal contradictions
Keine.

---

## Questions & Resolutions

### Q1: overflow-x: hidden bricht sticky in Safari — wie lösen?
**Recommended:** Option B — `overflow-x: hidden` entfernen vom ScrollContainer. Die Hero-Section clippt bereits lokal.
**Resolved:** Option A — `overflow-x: "clip"` statt `"hidden"`. Eleganter, kein Clip-Verlust, keine neue Abhängigkeit.
**Impact:** Wave 0 (Task 0.1) neu erstellt. `scroll-container.tsx` + Test werden angepasst.

### Q2: useScroll offset ["start start", "end start"] noch korrekt mit sticky?
**Recommended:** Kein Handlungsbedarf — useScroll misst natürliche Dokumentposition, nicht visuelle Position.
**Resolved:** Kein Handlungsbedarf. offset bleibt unverändert.
**Impact:** Keine.

### Q3: Sticky + min-h-screen — wann endet Kleben?
**Recommended:** Kein Handlungsbedarf — Hero und Features sticky nie gleichzeitig, kein z-index Konflikt.
**Resolved:** Korrekt. Nach 100vh Scroll endet Hero-Sticky, Features-Sticky beginnt erst nach weiteren ~1400px.
**Impact:** Keine.

### Q4: z-index Schema — brauchen Problem + HowItWorks auch z-index?
**Recommended:** Nein — nur Terminal (über sticky Hero) und Agents (über sticky Features) brauchen z-10.
**Resolved:** Korrekt. Problem/HowItWorks/Install/Footer brauchen kein explizites z-index.
**Impact:** Keine.

### Q5: framer-motion useScroll mit sticky target?
**Recommended:** Korrekt — framer-motion 12.40.0 misst natürliche DOM-Position, sticky beeinflusst das nicht.
**Resolved:** Kein Handlungsbedarf.
**Impact:** Keine.

### Q6: scale(1.15) + overflow-hidden — bricht der Clip?
**Recommended:** Nein — overflow-hidden auf der Section clippt den skalierten Text am selben Rand. Kein Scrollbar.
**Resolved:** Bereits bekanntes Gotcha aus scroll-motion-style, funktioniert korrekt.
**Impact:** Keine.

### Q7: Testbarkeit visueller Effekte ohne Browser?
**Recommended:** Source-based Tests prüfen Korrektheit des Codes. Visuelle Verifikation im Browser als explizite Pflicht dokumentieren.
**Resolved:** Non-Functional Requirement ergänzt: "Visual behavior SHALL be manually verified in a real browser before ship."
**Impact:** spec.md Non-Functional Requirements ergänzt.

### Q8: overflow-x: clip bricht whileInView IntersectionObserver?
**Recommended:** Nein — clip erstellt keinen neuen Scroll-Container, IntersectionObserver mit root:null bleibt unberührt.
**Resolved:** Kein Handlungsbedarf.
**Impact:** Keine.

### Q9: Task 0.1 fehlt — overflow-x fix ist Voraussetzung für sticky
**Recommended:** Wave 0 mit Task 0.1 ergänzen.
**Resolved:** Wave 0 (Task 0.1) in tasks.md eingefügt.
**Impact:** tasks.md Wave 0 neu erstellt.

### Q10: whileInView auf Cards in sticky Features-Section?
**Recommended:** Kein Problem — whileInView triggert beim Viewport-Entry der Section, once:true verhindert Re-trigger.
**Resolved:** Kein Handlungsbedarf.
**Impact:** Keine.

---

## Spec Changes Required

1. **Non-Functional Requirements** — Visual verification Pflicht ergänzt (Q7). ✅ Angewendet.
2. **tasks.md Wave 0** — Task 0.1 `overflow-x: clip` Migration (Q9). ✅ Angewendet.

---

## Deferred Questions

- [ ] `transform-origin` auf Mega-Headline (`left center` vs `center center`) — deferred zu post-first-render visueller Review. Default `center center` ist der Ausgangspunkt.
- [ ] iOS sticky flicker mit Transform — deferred. `translateZ(0)` Hack nötig? Erst nach Real-Device-Test entscheiden.
- [ ] Sticky + PageTransition Snapshot-Clone — Clone hat kein Sticky-Verhalten. Akzeptabel, da Clone nur animiert-aus. Beobachten.

---

## Verdict

**READY** — Alle Decision-Branches aufgelöst. 2 Spec-Änderungen angewendet (spec.md + tasks.md). Proceed to `/pick-spec`.
