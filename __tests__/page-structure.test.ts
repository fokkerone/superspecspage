/**
 * Tests for Task 2.1: app/page.tsx structure update
 * RED: fail until page.tsx has Terminal import and correct section order
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const src = readFileSync(resolve(process.cwd(), "app/page.tsx"), "utf-8");

describe("Task 2.1 — page.tsx: Terminal import and section order", () => {
  it("imports Terminal from landing/terminal", () => {
    expect(src).toContain("Terminal");
    expect(src).toContain("landing/terminal");
  });

  it("renders <Terminal /> component", () => {
    expect(src).toContain("<Terminal");
  });

  it("main has no bg-signalgray-800 class", () => {
    expect(src).not.toMatch(/<main[^>]*bg-signalgray-800/);
  });

  it("main has no min-h-screen class", () => {
    expect(src).not.toMatch(/<main[^>]*min-h-screen/);
  });

  it("main has no text-white class", () => {
    expect(src).not.toMatch(/<main[^>]*text-white/);
  });

  it("Terminal appears after Hero in source order", () => {
    const heroPos = src.indexOf("<Hero");
    const terminalPos = src.indexOf("<Terminal");
    expect(heroPos).toBeGreaterThan(-1);
    expect(terminalPos).toBeGreaterThan(-1);
    expect(terminalPos).toBeGreaterThan(heroPos);
  });

  it("Terminal appears before Problem in source order", () => {
    const terminalPos = src.indexOf("<Terminal");
    const problemPos = src.indexOf("<Problem");
    expect(terminalPos).toBeLessThan(problemPos);
  });

  it("Features appears after HowItWorks in source order", () => {
    const howPos = src.indexOf("<HowItWorks");
    const featPos = src.indexOf("<Features");
    expect(howPos).toBeGreaterThan(-1);
    expect(featPos).toBeGreaterThan(howPos);
  });
});
