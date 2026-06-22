/**
 * Tests for Task 1.1: signalgray tokens + ease tokens + --font-sans in globals.css
 * Tests for Task 1.3: .link-underline CSS utility in globals.css
 *
 * RED: these will fail until globals.css is updated
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const globalsPath = resolve(process.cwd(), "app/globals.css");
const css = readFileSync(globalsPath, "utf-8");

describe("Task 1.1 — signalgray palette tokens in globals.css", () => {
  it("declares --signalgray-800 in :root", () => {
    expect(css).toContain("--signalgray-800: oklch(0.2565 0.004 84.58)");
  });

  it("declares --signalgray-900 in :root", () => {
    expect(css).toContain("--signalgray-900: oklch(0.1539 0.0021 106.64)");
  });

  it("declares --signalgray-100 in :root", () => {
    expect(css).toContain("--signalgray-100: oklch(0.9074 0.0087 84.57)");
  });

  it("declares --signalgray-200 in :root", () => {
    expect(css).toContain("--signalgray-200: oklch(0.8593 0.0122 79.78)");
  });

  it("declares --signalgray-300 in :root", () => {
    expect(css).toContain("--signalgray-300: oklch(0.5109 0.002 67.78)");
  });

  it("declares --signalgray-700 in :root", () => {
    expect(css).toContain("--signalgray-700: oklch(0.3985 0.0021 67.76)");
  });

  it("exposes --color-signalgray-800 in @theme inline", () => {
    expect(css).toContain("--color-signalgray-800: var(--signalgray-800)");
  });

  it("exposes --color-signalgray-900 in @theme inline", () => {
    expect(css).toContain("--color-signalgray-900: var(--signalgray-900)");
  });

  it("exposes all six --color-signalgray-* tokens in @theme inline", () => {
    expect(css).toContain("--color-signalgray-100: var(--signalgray-100)");
    expect(css).toContain("--color-signalgray-200: var(--signalgray-200)");
    expect(css).toContain("--color-signalgray-300: var(--signalgray-300)");
    expect(css).toContain("--color-signalgray-700: var(--signalgray-700)");
  });

  it("defines --ease-enter in @theme inline", () => {
    expect(css).toContain("--ease-enter: cubic-bezier(0.6, 0, 0.24, 1)");
  });

  it("defines --ease-exit in @theme inline", () => {
    expect(css).toContain("--ease-exit: cubic-bezier(0.82, 1, 0.36, 1)");
  });

  it("binds --font-sans to var(--font-geist-sans) in @theme inline", () => {
    expect(css).toContain("--font-sans: var(--font-geist-sans)");
  });

  it("does NOT redefine --font-sans as var(--font-sans) (circular reference eliminated)", () => {
    // The old globals.css had: --font-sans: var(--font-sans) which is a circular self-ref
    expect(css).not.toContain("--font-sans: var(--font-sans)");
  });

  it("preserves existing shadcn --background token", () => {
    expect(css).toContain("--background:");
  });

  it("preserves existing shadcn --border token", () => {
    expect(css).toContain("--border:");
  });

  it("preserves existing shadcn --primary token", () => {
    expect(css).toContain("--primary:");
  });
});

describe("Task 1.3 — .link-underline CSS utility in globals.css", () => {
  it("defines .link-underline class", () => {
    expect(css).toContain(".link-underline");
  });

  it("defines .link-underline::before pseudo-element", () => {
    expect(css).toContain(".link-underline::before");
  });

  it("defines .link-underline::after pseudo-element", () => {
    expect(css).toContain(".link-underline::after");
  });

  it("uses var(--ease-enter) in ::before transition (not a hardcoded cubic-bezier)", () => {
    // Verify the transition in ::before uses the CSS variable, not a literal
    const beforeSection = css.split(".link-underline::before")[1];
    // Get just the first rule block after ::before
    const ruleBlock = beforeSection?.split("}")[0] ?? "";
    expect(ruleBlock).toContain("var(--ease-enter)");
    expect(ruleBlock).not.toMatch(/cubic-bezier\(0\.6/);
  });

  it("uses var(--ease-enter) in ::after transition", () => {
    const afterSection = css.split(".link-underline::after")[1];
    const ruleBlock = afterSection?.split("}")[0] ?? "";
    expect(ruleBlock).toContain("var(--ease-enter)");
  });

  it("uses 650ms duration on ::before transition", () => {
    const beforeSection = css.split(".link-underline::before")[1];
    const ruleBlock = beforeSection?.split("}")[0] ?? "";
    expect(ruleBlock).toContain("650ms");
  });

  it("uses 650ms duration on ::after transition", () => {
    const afterSection = css.split(".link-underline::after")[1];
    const ruleBlock = afterSection?.split("}")[0] ?? "";
    expect(ruleBlock).toContain("650ms");
  });

  it("sets transform: scaleX(1) on ::before (default visible)", () => {
    const beforeSection = css.split(".link-underline::before")[1];
    const ruleBlock = beforeSection?.split("}")[0] ?? "";
    expect(ruleBlock).toContain("scaleX(1)");
  });

  it("sets transform: scaleX(0) on ::after (default hidden)", () => {
    const afterSection = css.split(".link-underline::after")[1];
    const ruleBlock = afterSection?.split("}")[0] ?? "";
    expect(ruleBlock).toContain("scaleX(0)");
  });
});
