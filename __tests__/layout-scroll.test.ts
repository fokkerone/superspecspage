/**
 * Tests for Task 1.2: layout.tsx + globals.css integration
 * RED: fail until ScrollContainer is wired into layout and body css is set
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const layoutSrc = readFileSync(resolve(process.cwd(), "app/layout.tsx"), "utf-8");
const cssSrc = readFileSync(resolve(process.cwd(), "app/globals.css"), "utf-8");

describe("Task 1.2 — layout.tsx: ScrollContainer outside ThemeProvider+PageTransition", () => {
  it("imports ScrollContainer", () => {
    expect(layoutSrc).toContain("ScrollContainer");
    expect(layoutSrc).toContain("scroll-container");
  });

  it("ScrollContainer appears before ThemeProvider in source order", () => {
    const scrollPos = layoutSrc.indexOf("<ScrollContainer");
    const themePos = layoutSrc.indexOf("<ThemeProvider");
    expect(scrollPos).toBeGreaterThan(-1);
    expect(themePos).toBeGreaterThan(-1);
    expect(scrollPos).toBeLessThan(themePos);
  });

  it("ScrollContainer closing tag appears after ThemeProvider closing tag", () => {
    const scrollClose = layoutSrc.lastIndexOf("</ScrollContainer>");
    const themeClose = layoutSrc.lastIndexOf("</ThemeProvider>");
    expect(scrollClose).toBeGreaterThan(themeClose);
  });

  it("does not put ScrollContainer inside PageTransition", () => {
    // PageTransition should appear inside ScrollContainer, not the other way around
    const scrollOpen = layoutSrc.indexOf("<ScrollContainer");
    const pageTransitionOpen = layoutSrc.indexOf("<PageTransition");
    expect(pageTransitionOpen).toBeGreaterThan(scrollOpen);
  });
});

describe("Task 1.2 — globals.css: body overflow hidden + signalgray-100 background", () => {
  it("body has overflow hidden", () => {
    // Check that overflow: hidden appears after a body { rule
    const bodyIdx = cssSrc.indexOf("body {");
    expect(bodyIdx).toBeGreaterThan(-1);
    const bodyBlock = cssSrc.slice(bodyIdx, cssSrc.indexOf("}", bodyIdx) + 1);
    expect(bodyBlock).toContain("overflow: hidden");
  });

  it("body or html has background-color signalgray-100", () => {
    expect(cssSrc).toMatch(/background-color:\s*var\(--signalgray-100\)/);
  });
});
