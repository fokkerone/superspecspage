/**
 * Tests for Task 2.5: components/landing/install.tsx migration
 * RED: fail until install.tsx is rewritten
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const srcPath = resolve(process.cwd(), "components/landing/install.tsx");

describe("Task 2.5 — Install: no old aesthetic tokens", () => {
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

  it("source has no rounded-full on CTA elements", () => {
    const src = readFileSync(srcPath, "utf-8");
    const lines = src.split("\n");
    for (const line of lines) {
      if (line.includes("rounded-full") && !line.includes("w-2.5")) {
        expect.fail(`rounded-full on non-terminal-dot: ${line.trim()}`);
      }
    }
  });

  it("source has no bg-[#080808] or bg-black", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).not.toContain("bg-[#080808]");
    expect(src).not.toContain("bg-black");
  });
});

describe("Task 2.5 — Install: correct new tokens", () => {
  it("primary CTA has border-white/15", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).toContain("border-white/15");
  });

  it("secondary CTA has link-underline class", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).toContain("link-underline");
  });

  it("terminal uses bg-signalgray-900", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).toContain("signalgray-900");
  });

  it("terminal has rounded-lg", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).toContain("rounded-lg");
  });

  it("section heading has clamp(1.75rem in style", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).toContain("clamp(1.75rem");
  });
});
