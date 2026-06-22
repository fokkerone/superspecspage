/**
 * Tests for Task 1.2: lib/easing.ts constants
 * RED: these will fail until lib/easing.ts is created
 */

import { describe, expect, it } from "vitest";

describe("lib/easing — motion constants", () => {
  it("EASE_ENTER equals cubic-bezier(0.6, 0, 0.24, 1)", async () => {
    const { EASE_ENTER } = await import("@/lib/easing");
    expect(EASE_ENTER).toBe("cubic-bezier(0.6, 0, 0.24, 1)");
  });

  it("EASE_EXIT equals cubic-bezier(0.82, 1, 0.36, 1)", async () => {
    const { EASE_EXIT } = await import("@/lib/easing");
    expect(EASE_EXIT).toBe("cubic-bezier(0.82, 1, 0.36, 1)");
  });

  it("EASE_ENTER_TUPLE deep-equals [0.6, 0, 0.24, 1]", async () => {
    const { EASE_ENTER_TUPLE } = await import("@/lib/easing");
    expect(EASE_ENTER_TUPLE).toEqual([0.6, 0, 0.24, 1]);
  });

  it("EASE_EXIT_TUPLE deep-equals [0.82, 1, 0.36, 1]", async () => {
    const { EASE_EXIT_TUPLE } = await import("@/lib/easing");
    expect(EASE_EXIT_TUPLE).toEqual([0.82, 1, 0.36, 1]);
  });

  it("TRANSITION_DURATION equals 1450", async () => {
    const { TRANSITION_DURATION } = await import("@/lib/easing");
    expect(TRANSITION_DURATION).toBe(1450);
  });

  it("EASE_ENTER string contains the same coordinates as EASE_ENTER_TUPLE", async () => {
    const { EASE_ENTER, EASE_ENTER_TUPLE } = await import("@/lib/easing");
    // Extract the four numbers from the cubic-bezier string
    const match = EASE_ENTER.match(/cubic-bezier\(([^)]+)\)/);
    expect(match).not.toBeNull();
    const coords = match?.[1].split(",").map((s) => parseFloat(s.trim()));
    expect(coords).toEqual([...EASE_ENTER_TUPLE]);
  });

  it("EASE_EXIT string contains the same coordinates as EASE_EXIT_TUPLE", async () => {
    const { EASE_EXIT, EASE_EXIT_TUPLE } = await import("@/lib/easing");
    const match = EASE_EXIT.match(/cubic-bezier\(([^)]+)\)/);
    expect(match).not.toBeNull();
    const coords = match?.[1].split(",").map((s) => parseFloat(s.trim()));
    expect(coords).toEqual([...EASE_EXIT_TUPLE]);
  });
});
