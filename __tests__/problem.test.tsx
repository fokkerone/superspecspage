/**
 * Tests for Task 2.8: components/landing/problem.tsx migration
 * RED: fail until problem.tsx is rewritten
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

const srcPath = resolve(process.cwd(), "components/landing/problem.tsx");

describe("Task 2.8 — Problem: no old aesthetic tokens", () => {
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

  it("source has no rounded-full on symptom icon elements", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).not.toContain("rounded-full");
  });

  it("source has no bg-[#080808]", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).not.toContain("bg-[#080808]");
  });

  it("source has no red-500 accent color", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).not.toMatch(/red-\d+/);
  });
});

describe("Task 2.8 — Problem: correct new tokens", () => {
  it("section heading has clamp( in style", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).toContain("clamp(");
  });

  it("uses bg-signalgray-800 for symptom cards", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).toContain("signalgray-800");
  });

  it("uses unicode ✗ symbol instead of icon div", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).toContain("✗");
  });

  it("uses bg-white/10 for card grid background", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).toContain("bg-white/10");
  });

  it("card grid is rounded-none", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).toContain("rounded-none");
  });
});
