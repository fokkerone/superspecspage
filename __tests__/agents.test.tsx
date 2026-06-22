/**
 * Tests for Task 2.6: components/landing/agents.tsx migration
 * RED: fail until agents.tsx is rewritten
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { readFileSync } from "fs";
import { resolve } from "path";

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

  it("renders agent badges in the DOM", async () => {
    const { Agents } = await import("@/components/landing/agents");
    render(<Agents />);
    expect(screen.getByText("Claude Code")).toBeInTheDocument();
  });
});
