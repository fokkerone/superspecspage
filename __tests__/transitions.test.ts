/**
 * Tests for lib/transitions.ts
 *
 * Spec coverage:
 * - Requirement: Swappable Transition Variant
 *   Scenario: lib/transitions.ts exports slideDown and fadeOnly as named Variants
 * - Requirement: Slide-Down Exit on Route Change
 *   Scenario: slideDown exit moves page to y: 100%
 * - Requirement: Incoming Page is Stationary
 *   Scenario: slideDown initial/animate are y: 0 (no enter animation)
 */

import { describe, it, expect } from "vitest";
import { slideDown, fadeOnly } from "@/lib/transitions";

describe("lib/transitions — Swappable Transition Variant", () => {
  it("exports slideDown as a named export", () => {
    expect(slideDown).toBeDefined();
  });

  it("exports fadeOnly as a named export", () => {
    expect(fadeOnly).toBeDefined();
  });

  describe("slideDown variant", () => {
    it("initial state has y: 0 — incoming page is stationary", () => {
      expect(slideDown.initial).toMatchObject({ y: 0 });
    });

    it("animate state has y: 0 — no enter animation", () => {
      expect(slideDown.animate).toMatchObject({ y: 0 });
    });

    it("exit state translates to y: 100% — slide-down exit", () => {
      expect(slideDown.exit).toMatchObject({ y: "100%" });
    });

    it("exit transition duration is 0.5s", () => {
      const exit = slideDown.exit as { transition: { duration: number } };
      expect(exit.transition.duration).toBe(0.5);
    });

    it("exit transition uses cubic-bezier easing matching betteroff.studio", () => {
      const exit = slideDown.exit as { transition: { ease: number[] } };
      expect(exit.transition.ease).toEqual([0.76, 0, 0.24, 1]);
    });
  });

  describe("fadeOnly variant", () => {
    it("initial state has opacity: 1", () => {
      expect(fadeOnly.initial).toMatchObject({ opacity: 1 });
    });

    it("animate state has opacity: 1 — no enter animation", () => {
      expect(fadeOnly.animate).toMatchObject({ opacity: 1 });
    });

    it("exit state fades to opacity: 0", () => {
      expect(fadeOnly.exit).toMatchObject({ opacity: 0 });
    });
  });
});
