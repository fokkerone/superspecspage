"use client";
import { useMotionValue } from "framer-motion";
import { createContext, type RefObject, useContext, useEffect, useRef } from "react";

export const ScrollContext = createContext<RefObject<HTMLDivElement | null>>({
  current: null,
});

export function useScrollContainer() {
  return useContext(ScrollContext);
}

export function ScrollContainer({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <ScrollContext.Provider value={ref}>
      <div
        ref={ref}
        className="scroll-container"
        style={{
          overflowY: "auto",
          overflowX: "clip",
          height: "100svh",
          overscrollBehavior: "none",
        }}
      >
        {children}
      </div>
    </ScrollContext.Provider>
  );
}

/**
 * Returns a framer-motion MotionValue tracking the scroll container's scrollY.
 * Use this for section-level parallax effects in components that need to track
 * global scroll position (not per-section progress).
 *
 * Usage:
 *   const scrollY = useContainerScrollY();
 *   const y = useTransform(scrollY, [sectionTop, sectionTop + viewportH], [60, -60]);
 */
export function useContainerScrollY() {
  const containerRef = useScrollContainer();
  const scrollY = useMotionValue(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => scrollY.set(el.scrollTop);
    el.addEventListener("scroll", update, { passive: true });
    // Set initial value
    scrollY.set(el.scrollTop);

    return () => el.removeEventListener("scroll", update);
  }, [containerRef, scrollY]);

  return scrollY;
}
