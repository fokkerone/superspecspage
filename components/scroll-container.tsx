"use client";
import { createContext, type RefObject, useContext, useRef } from "react";

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
          overflowX: "hidden",
          height: "100svh",
          overscrollBehavior: "none",
        }}
      >
        {children}
      </div>
    </ScrollContext.Provider>
  );
}
