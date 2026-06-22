/**
 * Tests for Task 2.4: components/landing/how-it-works.tsx migration
 * RED: fail until how-it-works.tsx is rewritten
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const srcPath = resolve(process.cwd(), "components/landing/how-it-works.tsx");

describe("Task 2.4 — HowItWorks: no old aesthetic tokens", () => {
  it("source has no emerald class", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).not.toMatch(/emerald/);
  });

  it("source has no font-bold", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).not.toContain("font-bold");
  });

  it("source has no bg-[#080808]", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).not.toContain("bg-[#080808]");
  });

  it("source has no rounded-xl overflow-hidden on container", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).not.toMatch(/rounded-xl[^"]*overflow-hidden/);
  });
});

describe("Task 2.4 — HowItWorks: correct new tokens", () => {
  it("phase number span has clamp(4rem in style", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).toContain("clamp(4rem");
  });

  it("section heading has clamp(1.75rem in style", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).toContain("clamp(1.75rem");
  });

  it("uses bg-signalgray-800 for phase rows", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).toContain("signalgray-800");
  });

  it("uses bg-white/10 for container divider", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).toContain("bg-white/10");
  });

  it("phase number uses text-white/[0.05] low opacity", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).toContain("text-white/[0.05]");
  });
});
