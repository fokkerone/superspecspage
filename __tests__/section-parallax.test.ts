/**
 * Tests for Task 2.1 + 2.2: section parallax on all landing sections
 * RED: fail until useScroll/useTransform parallax is added to each section
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

    it("uses useScroll", () => {
      expect(src).toContain("useScroll");
    });

    it("uses useTransform for section Y", () => {
      expect(src).toContain("useTransform");
    });

    it("uses useReducedMotion", () => {
      expect(src).toContain("useReducedMotion");
    });

    it("has parallax range (60px for dark sections)", () => {
      expect(src).toContain("60");
      expect(src).toContain("-60");
    });

    it("does NOT use sticky positioning", () => {
      expect(src).not.toContain("sticky");
      expect(src).not.toMatch(/position:\s*["']?fixed/);
    });

    it("does NOT use scrollContainer (section parallax uses viewport directly)", () => {
      // Section parallax uses useScroll without container so framer-motion
      // tracks against the viewport — prevents null-ref freeze on SSR
      expect(src).not.toContain("useScrollContainer");
    });
  });
}

describe("Task 2.2 — features: section parallax", () => {
  const src = readFileSync(resolve(cwd, "components/landing/features.tsx"), "utf-8");

  it("uses useScroll for section", () => {
    expect(src).toContain("useScroll");
  });

  it("uses useTransform for section Y", () => {
    expect(src).toContain("useTransform");
  });

  it("uses useReducedMotion", () => {
    expect(src).toContain("useReducedMotion");
  });

  it("has parallax range values (40px for light sections)", () => {
    expect(src).toContain("40");
    expect(src).toContain("-40");
  });

  it("does NOT use sticky positioning", () => {
    expect(src).not.toContain("sticky");
  });
});

describe("Task 2.2 — hero: section-level parallax wrapper", () => {
  const src = readFileSync(resolve(cwd, "components/landing/hero.tsx"), "utf-8");

  it("has section-level parallax Y (sectionY or similar)", () => {
    expect(src).toMatch(/sectionY|sectionParallax|wrapperY/);
  });

  it("section Y uses 40px range (light section)", () => {
    expect(src).toContain("40");
    expect(src).toContain("-40");
  });
});
