"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { useRef } from "react";

interface InfiniteSideCarouselProps {
  children: ReactNode;
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  vertical?: boolean;
  repeat?: number;
  autoFill?: boolean;
  ariaLabel?: string;
  ariaLive?: "off" | "polite" | "assertive";
  ariaRole?: string;
}

export function InfiniteSideCarousel({
  children,
  className,
  reverse = false,
  pauseOnHover = false,
  vertical = false,
  repeat = 4,
  ariaLabel,
  ariaLive = "off",
  ariaRole = "marquee",
}: InfiniteSideCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <div
      role={ariaRole}
      aria-label={ariaLabel}
      aria-live={ariaLive}
      className={cn(
        "group flex overflow-hidden [--duration:40s] [--gap:1rem]",
        vertical ? "flex-col" : "flex-row",
        className,
      )}
    >
      <div
        ref={trackRef}
        className={cn(
          "flex min-w-full shrink-0 gap-[--gap]",
          vertical ? "flex-col animate-marquee-vertical" : "flex-row animate-marquee",
          reverse && "[animation-direction:reverse]",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
        )}
        style={{ animationDuration: "var(--duration)" }}
      >
        {children}
      </div>
      {Array.from({ length: repeat - 1 }).map((_, i) => (
        <div
          key={i}
          aria-hidden="true"
          className={cn(
            "flex min-w-full shrink-0 gap-[--gap]",
            vertical ? "flex-col animate-marquee-vertical" : "flex-row animate-marquee",
            reverse && "[animation-direction:reverse]",
            pauseOnHover && "group-hover:[animation-play-state:paused]",
          )}
          style={{ animationDuration: "var(--duration)" }}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
