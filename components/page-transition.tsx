"use client";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { EASE_ENTER, EASE_EXIT, TRANSITION_DURATION } from "@/lib/easing";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [frozenPathname, setFrozenPathname] = useState(pathname);
  const transitioning = frozenPathname !== pathname;

  const exitRef = useRef<HTMLDivElement>(null);
  const newRef = useRef<HTMLDivElement>(null);
  const liveRef = useRef<HTMLDivElement>(null);

  // Snapshot: DOM clone + viewport-relative top of liveRef.
  // getBoundingClientRect().top encodes nav offset + scroll in one value,
  // so translateY(top) places the clone exactly where the page was on screen.
  const snapshotRef = useRef<{ node: Node; top: number } | null>(null);
  const prevTransitioningRef = useRef(false);

  const captureSnapshot = () => {
    if (liveRef.current) {
      snapshotRef.current = {
        node: liveRef.current.cloneNode(true),
        top: liveRef.current.getBoundingClientRect().top,
      };
    }
  };

  // Capture on mousedown/touchstart — fires BEFORE Next.js routing starts,
  // so scroll is still at the user's position. This is the reliable moment.
  // biome-ignore lint/correctness/useExhaustiveDependencies: captureSnapshot is stable (refs only)
  useEffect(() => {
    document.addEventListener("mousedown", captureSnapshot, { capture: true });
    document.addEventListener("touchstart", captureSnapshot, {
      capture: true,
      passive: true,
    });
    return () => {
      document.removeEventListener("mousedown", captureSnapshot, {
        capture: true,
      });
      document.removeEventListener("touchstart", captureSnapshot, {
        capture: true,
      });
    };
  }, []);

  // Inject snapshot into exit div when transition starts.
  // Also capture initial snapshot so the first navigation has something to show.
  useLayoutEffect(() => {
    if (!transitioning && !snapshotRef.current) {
      captureSnapshot();
    } else if (transitioning && !prevTransitioningRef.current) {
      if (exitRef.current && snapshotRef.current) {
        const { node, top } = snapshotRef.current;
        // transform:translateZ(0) creates a stacking context + containing block for
        // position:fixed children in the snapshot (e.g. the fixed Header), so they
        // exit WITH the page instead of escaping to the viewport at z-50.
        // overflow:hidden clips the translated clone to the visible area.
        const clipper = document.createElement("div");
        clipper.style.cssText = "position:absolute;inset:0;overflow:hidden;transform:translateZ(0)";
        (node as HTMLElement).style.transform = `translateY(${top}px)`;
        clipper.appendChild(node);
        exitRef.current.appendChild(clipper);
        snapshotRef.current = null;
      }
    }
    prevTransitioningRef.current = transitioning;
  });

  useEffect(() => {
    if (!transitioning) return;

    // Skip animation for docs-internal navigation (sidebar links).
    // Matches /docs and /docs/* — the bare /docs route redirects to /docs/introduction
    // and must also be treated as a docs route.
    const isDocsRoute = (p: string) => p === '/docs' || p.startsWith('/docs/');
    if (isDocsRoute(frozenPathname) && isDocsRoute(pathname)) {
      setFrozenPathname(pathname);
      return;
    }

    // Respect prefers-reduced-motion: skip animation entirely, swap instantly
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setFrozenPathname(pathname);
      return;
    }

    const oldEl = exitRef.current;
    const newEl = newRef.current;

    if (newEl) {
      newEl.style.transition = "none";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!newEl) return;
          newEl.style.transition = `transform ${TRANSITION_DURATION}ms ${EASE_ENTER}`;
          newEl.style.transform = "translateY(0)";
        });
      });
    }

    if (oldEl) {
      oldEl.style.transition = "none";
      oldEl.style.transform = "translateY(0) scale(1)";
      oldEl.style.opacity = "1";
      setTimeout(() => {
        if (!oldEl) return;
        oldEl.style.transition = `transform ${TRANSITION_DURATION}ms ${EASE_EXIT}, opacity ${TRANSITION_DURATION}ms ${EASE_EXIT}`;
        oldEl.style.transform = "translateY(-84%) scale(0.82)";
        oldEl.style.opacity = "0";
      }, 250);
    }

    const t = setTimeout(() => {
      setFrozenPathname(pathname);
    }, TRANSITION_DURATION + 200);

    return () => clearTimeout(t);
  }, [transitioning, pathname]);

  return (
    // Dark background prevents the light body (signalgray-100) from flashing
    // through the scroll container during the one-frame gap between liveRef
    // unmounting and the exit clone being injected in useLayoutEffect.
    <div style={{ position: "relative", minHeight: "100svh", backgroundColor: "var(--signalgray-800)" }}>
      {transitioning && (
        <div
          ref={exitRef}
          className="exit-snapshot-scroller"
          style={{ position: "fixed", inset: 0, zIndex: 0, backgroundColor: "var(--signalgray-800)" }}
        />
      )}

      {transitioning ? (
        <div
          ref={newRef}
          style={{
            position: "relative",
            zIndex: 1,
            minHeight: "100svh",
            transform: "translateY(100vh)",
            willChange: "transform",
          }}
        >
          {children}
        </div>
      ) : (
        <div ref={liveRef} style={{ minHeight: "100svh" }}>
          {children}
        </div>
      )}
    </div>
  );
}
