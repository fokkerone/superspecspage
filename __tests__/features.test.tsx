/**
 * Tests for Task 2.3: components/landing/features.tsx migration
 * RED: fail until features.tsx is rewritten
 */
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { readFileSync } from "fs";
import { resolve } from "path";

const srcPath = resolve(process.cwd(), "components/landing/features.tsx");

describe("Task 2.3 — Features: no old aesthetic tokens", () => {
  it("source has no emerald class", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).not.toMatch(/emerald/);
  });

  it("source has no font-bold", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).not.toContain("font-bold");
  });

  it("source has no font-semibold", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).not.toContain("font-semibold");
  });

  it("source has no bg-[#080808]", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).not.toContain("bg-[#080808]");
  });

  it("source has no rounded-xl on card grid", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).not.toMatch(/grid[^"]*rounded-xl/);
  });
});

describe("Task 2.3 — Features: correct new tokens", () => {
  it("card grid has gap-px class", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).toContain("gap-px");
  });

  it("uses bg-signalgray-800 for cards", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).toContain("signalgray-800");
  });

  it("uses bg-white/10 for grid background", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).toContain("bg-white/10");
  });

  it("section heading has clamp(1.75rem in style", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).toContain("clamp(1.75rem");
  });

  it("card grid is rounded-none", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).toContain("rounded-none");
  });
});
