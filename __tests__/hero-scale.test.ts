/**
 * Tests for Task 1.1: hero.tsx — scale + x transforms on mega-headline
 * RED: fail until hero.tsx gets scale and x useTransform values
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const src = readFileSync(resolve(process.cwd(), "components/landing/hero.tsx"), "utf-8");

describe("Task 1.1 — Hero: scale transform", () => {
  it("hero.tsx contains scale useTransform", () => {
    expect(src).toContain("scale");
  });

  it("scale range is 1 to 1.15", () => {
    expect(src).toContain("1.15");
  });

  it("scale has useReducedMotion fallback locked at [1, 1]", () => {
    // Both reduced and non-reduced values must appear
    // The pattern: prefersReduced ? [1, 1] : [1, 1.15]
    expect(src).toMatch(/\[1,\s*1\]/);
    expect(src).toMatch(/\[1,\s*1\.15\]/);
  });
});

describe("Task 1.1 — Hero: x transform", () => {
  it("hero.tsx contains x useTransform", () => {
    // x should be used as a style prop on motion.h1
    expect(src).toContain("headlineX");
  });

  it("x range is 0% to -8%", () => {
    expect(src).toContain("-8%");
  });

  it("x has useReducedMotion fallback locked at 0%", () => {
    expect(src).toContain('"0%"');
  });
});

describe("Task 1.1 — Hero: existing transforms preserved", () => {
  it("y parallax still present", () => {
    expect(src).toContain("headlineY");
  });

  it("clipPath entry animation still present", () => {
    expect(src).toContain("clipPath");
    expect(src).toContain("inset(100%");
  });

  it("useReducedMotion still imported", () => {
    expect(src).toContain("useReducedMotion");
  });

  it("all three transforms applied to motion.h1 style prop", () => {
    // style prop should contain y, scale, x
    expect(src).toContain("headlineY");
    expect(src).toContain("headlineScale");
    expect(src).toContain("headlineX");
  });

  it("willChange: transform still present", () => {
    expect(src).toContain("willChange");
  });
});
