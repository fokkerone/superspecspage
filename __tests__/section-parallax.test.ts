/**
 * Tests for Task 2.1 + 2.2: section parallax on all landing sections
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const cwd = process.cwd();

const darkSections = [
  "components/landing/terminal.tsx",
  "components/landing/problem.tsx",
  "components/landing/how-it-works.tsx",
  "components/landing/agents.tsx",
  "components/landing/install.tsx",
];

for (const file of darkSections) {
  const name = file.split("/").pop()!.replace(".tsx", "");
  describe(`Task 2.1 — ${name}: section parallax`, () => {
    const src = readFileSync(resolve(cwd, file), "utf-8");

    it("uses useScroll with container", () => {
      expect(src).toContain("useScroll");
      expect(src).toContain("useScrollContainer");
    });

    it("uses useTransform for section Y", () => {
      expect(src).toContain("useTransform");
    });

    it("uses useReducedMotion", () => {
      expect(src).toContain("useReducedMotion");
    });

    it("has vh parallax range with starts at 0, translates up as section exits", () => {
      expect(src).toContain("-10vh");
      expect(src).toContain("-10vh");
    });

    it("does NOT use sticky positioning", () => {
      expect(src).not.toContain("sticky");
      expect(src).not.toMatch(/position:\s*["']?fixed/);
    });
  });
}

describe("Task 2.2 — features: section parallax", () => {
  const src = readFileSync(resolve(cwd, "components/landing/features.tsx"), "utf-8");

  it("uses useScroll with container", () => {
    expect(src).toContain("useScroll");
    expect(src).toContain("useScrollContainer");
  });

  it("uses useTransform for section Y", () => {
    expect(src).toContain("useTransform");
  });

  it("uses useReducedMotion", () => {
    expect(src).toContain("useReducedMotion");
  });

  it("has vh parallax range (light section)", () => {
    expect(src).toContain("-8vh");
  });

  it("does NOT use sticky positioning", () => {
    expect(src).not.toContain("sticky");
  });
});

describe("Task 2.2 — hero: section-level parallax wrapper", () => {
  const src = readFileSync(resolve(cwd, "components/landing/hero.tsx"), "utf-8");

  it("has section-level parallax Y", () => {
    expect(src).toMatch(/sectionY|sectionParallax|wrapperY/);
  });

  it("section Y uses vh range (light section)", () => {
    expect(src).toContain("-8vh");
  });
});
