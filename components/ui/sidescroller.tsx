"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { animate, motion, motionValue } from "motion/react";
import { useDebounceCallback, useResizeObserver } from "usehooks-ts";

export function InfiniteBoxCarousel({
  children,
}: {
  children: React.ReactNode;
}) {
  // KONFIGURATION - Hier anpassen
  const delayPerBox = 0.15; // Verzögerung pro Box in Sekunden

  // Anzahl der Boxen aus Children ermitteln
  const childrenArray = React.Children.toArray(children);
  const boxCount = childrenArray.length;

  // CSS definiert Größen - JavaScript liest sie aus
  const containerClass = `flex gap-[20px] overflow-x-clip w-full`;
  const ref = useRef<HTMLDivElement>(null);

  // State für gemessene Werte aus dem DOM
  const [layoutMetrics, setLayoutMetrics] = useState<{
    boxWidth: number;
    boxGap: number;
  }>({
    boxWidth: 0,
    boxGap: 0,
  });

  // Resize Handler: Miss tatsächliche Box-Breite und Gap aus dem DOM
  const onResize = useDebounceCallback(() => {
    if (!ref.current) return;

    const firstBox = ref.current.querySelector<HTMLDivElement>("[data-box]");
    if (!firstBox) return;

    // Lese tatsächliche Box-Breite aus
    const boxRect = firstBox.getBoundingClientRect();
    const boxWidth = boxRect.width;

    // Lese Gap aus dem Container
    const containerStyles = window.getComputedStyle(ref.current);
    const gap = parseFloat(containerStyles.gap) || 0;

    setLayoutMetrics({ boxWidth, boxGap: gap });
  }, 200);

  useResizeObserver({
    ref: ref as React.RefObject<HTMLDivElement>,
    onResize,
  });

  // MotionValues: Dynamisch erzeugt basierend auf boxCount
  // Verwendet useMemo + motionValue() für dynamische Erzeugung
  const motionValues = useMemo(() => {
    // Erstelle Array mit der gewünschten Anzahl von Motion Values
    return Array.from({ length: boxCount }, () => motionValue(0));
  }, [boxCount]);

  // Extrahiere Metriken für einfacheren Zugriff
  const { boxWidth, boxGap } = layoutMetrics;

  // boxes ist ein Array mit start-Position und MotionValue
  // Erstelle einmalig mit useState (lazy initialization)
  const [boxes] = useState(() =>
    motionValues.map((_m) => ({
      start: 0, // Startet bei 0, wird beim ersten Render gesetzt
      _m,
    })),
  );

  // Berechne start-Positionen bei jedem Layout-Wechsel neu
  useEffect(() => {
    if (boxWidth > 0) {
      boxes.forEach((box, i) => {
        box.start = i * (boxWidth + boxGap);
      });
    }
  }, [boxes, boxWidth, boxGap]);

  // Ref um zu verhindern dass mehrere Animationszyklen gleichzeitig laufen
  const isAnimatingRef = useRef(false);
  const completedAnimationsRef = useRef(0);
  const animateAllRef = useRef<(() => void) | undefined>(undefined);

  const handleAllAnimationsComplete = useCallback(() => {
    if (!isAnimatingRef.current) return;

    const step = Math.round(boxWidth + boxGap); // Ganzzahl!

    // 1. Sammle aktuelle visuelle Positionen (start + transform)
    const positions = boxes.map((box) => ({
      box,
      visualPosition: Math.round(box.start + box._m.get()),
    }));

    // 2. Sortiere nach visueller Position (links nach rechts)
    positions.sort((a, b) => a.visualPosition - b.visualPosition);

    // 3. Weise neue Slots zu und berechne Transforms
    // Linkeste Box (index 0) → ans Ende
    // Alle anderen rücken vor
    positions.forEach((item, sortedIndex) => {
      let newSlot;
      if (sortedIndex === 0) {
        // Linkeste Box geht ans Ende
        newSlot = boxes.length - 1;
      } else {
        // Alle anderen rücken eine Position vor
        newSlot = sortedIndex - 1;
      }

      // Berechne neue visuelle Zielposition
      const targetPosition = Math.round(newSlot * step);

      // Transform = Zielposition - start
      // start bleibt FEST (Flexbox-Position basierend auf DOM-Index)
      const newTransform = Math.round(targetPosition - item.box.start);
      item.box._m.set(newTransform);
    });

    // Starte neue Animationsrunde
    requestAnimationFrame(() => {
      if (isAnimatingRef.current && animateAllRef.current) {
        animateAllRef.current();
      }
    });
  }, [boxes, boxWidth, boxGap]);

  const handleSingleAnimationComplete = useCallback(() => {
    if (!isAnimatingRef.current) return;

    completedAnimationsRef.current += 1;

    // Prüfe ob alle Animationen fertig sind
    if (completedAnimationsRef.current >= boxes.length) {
      completedAnimationsRef.current = 0;
      handleAllAnimationsComplete();
    }
  }, [boxes.length, handleAllAnimationsComplete]);

  const animateAll = useCallback(() => {
    if (!isAnimatingRef.current) return;

    // Reset counter
    completedAnimationsRef.current = 0;

    // Sammle und sortiere Boxen nach visueller Position für korrekte Verzögerung
    const visualPositions = boxes.map((box) => ({
      box,
      visualPosition: box.start + box._m.get(),
    }));

    // Sortiere nach visueller Position (links nach rechts)
    visualPositions.sort((a, b) => a.visualPosition - b.visualPosition);

    // Animiere alle Boxen gleichmäßig nach links, mit Verzögerung basierend auf visueller Position
    visualPositions.forEach((item, visualIndex) => {
      const { box } = item;
      const { _m } = box;
      const currentTransform = _m.get();
      const targetTransform = currentTransform - (boxWidth + boxGap);

      animate(_m, targetTransform, {
        duration: 1,
        ease: [0.1, 0.2, 0.3, 1],
        delay: visualIndex * delayPerBox + 2, // Verzögerung basierend auf visueller Position
        onComplete: handleSingleAnimationComplete,
      });
    });
  }, [boxes, boxWidth, boxGap, delayPerBox, handleSingleAnimationComplete]);

  // Update ref wenn sich animateAll ändert
  useEffect(() => {
    animateAllRef.current = animateAll;
  }, [animateAll]);

  useEffect(() => {
    if (boxWidth === 0) return;

    // Stoppe alle laufenden Animationen
    isAnimatingRef.current = false;
    boxes.forEach((box) => {
      box._m.stop();
    });

    // Reset bei Layout-Änderungen - setze Transform auf 0
    // start-Positionen werden bereits im anderen useEffect gesetzt
    boxes.forEach((box) => {
      box._m.set(0);
    });

    // Starte Animation nach kurzer Verzögerung
    const timeoutId = setTimeout(() => {
      isAnimatingRef.current = true;
      animateAll();
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      isAnimatingRef.current = false;
      // Cleanup - stoppe alle Animationen
      boxes.forEach((box) => {
        box._m.stop();
      });
    };
  }, [boxWidth, boxGap, boxes, animateAll]);

  return (
    <div className={containerClass} ref={ref}>
      {childrenArray.map((child, i) => {
        const box = boxes[i];
        if (!box) return null;

        // Wrappe Child in Motion Wrapper
        return (
          <motion.div
            key={i}
            data-box
            style={{ x: box._m }}
            className="overflow-hidden h-[60vh] basis-[calc(100%/2)] md:basis-[calc(100%/4)] lg:basis-[calc(100%/5)] shrink-0 aspect-6/4"
          >
            {child}
          </motion.div>
        );
      })}
    </div>
  );
}
