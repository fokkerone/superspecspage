/**
 * Tests for Tasks 2.1 + 2.2: sticky sections
 * RED: fail until sticky classes are added to hero/features
 * and z-10 is added to terminal/agents
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const cwd = process.cwd();

describe("Task 2.1 — Hero: sticky positioning", () => {
  const src = readFileSync(resolve(cwd, "components/landing/hero.tsx"), "utf-8");

  it("hero section has sticky class", () => {
    expect(src).toContain("sticky");
  });

  it("hero section has top-0", () => {
    expect(src).toMatch(/top-0|top:\s*0/);
  });

  it("hero section does not have a high z-index that would override header", () => {
    // Hero should be at implicit z-0, not z-10 or higher
    expect(src).not.toMatch(/\bz-10\b|\bz-20\b|\bz-30\b|\bz-40\b/);
  });
});

describe("Task 2.1 — Terminal: z-index above sticky Hero", () => {
  const src = readFileSync(resolve(cwd, "components/landing/terminal.tsx"), "utf-8");

  it("terminal section has z-10", () => {
    expect(src).toMatch(/\bz-10\b/);
  });

  it("terminal section has relative positioning", () => {
    expect(src).toMatch(/\brelative\b/);
  });
});

describe("Task 2.2 — Features: sticky positioning", () => {
  const src = readFileSync(resolve(cwd, "components/landing/features.tsx"), "utf-8");

  it("features section has sticky class", () => {
    expect(src).toContain("sticky");
  });

  it("features section has top-0", () => {
    expect(src).toMatch(/top-0|top:\s*0/);
  });
});

describe("Task 2.2 — Agents: z-index above sticky Features", () => {
  const src = readFileSync(resolve(cwd, "components/landing/agents.tsx"), "utf-8");

  it("agents section has z-10", () => {
    expect(src).toMatch(/\bz-10\b/);
  });

  it("agents section has relative positioning", () => {
    expect(src).toMatch(/\brelative\b/);
  });
});
