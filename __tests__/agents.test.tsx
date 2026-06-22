/**
 * Tests for Task 2.6: components/landing/agents.tsx migration
 * RED: fail until agents.tsx is rewritten
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const srcPath = resolve(process.cwd(), "components/landing/agents.tsx");

describe("Task 2.6 — Agents: no old aesthetic tokens", () => {
  it("source has no emerald class", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).not.toMatch(/emerald/);
  });

  it("source has no rounded-full on badge elements", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).not.toContain("rounded-full");
  });
});

describe("Task 2.6 — Agents: correct new tokens", () => {
  it("badge spans use rounded-sm", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).toContain("rounded-sm");
  });

  it("uses border-white/10 on badge borders", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).toContain("border-white/10");
  });

  it("source contains Claude Code agent name", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).toContain("Claude Code");
  });
});
