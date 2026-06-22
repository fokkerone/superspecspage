/**
 * Tests for Task 2.2: terminal.tsx extraction from hero.tsx
 * RED: fail until terminal.tsx exists and hero.tsx has no terminal block
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const heroSrc = readFileSync(resolve(process.cwd(), "components/landing/hero.tsx"), "utf-8");

describe("Task 2.2 — terminal.tsx: new file exists with correct structure", () => {
  it("terminal.tsx file exists", async () => {
    const mod = await import("@/components/landing/terminal");
    expect(mod.Terminal).toBeDefined();
    expect(typeof mod.Terminal).toBe("function");
  });

  it("terminal.tsx has bg-signalgray-800 section", () => {
    const src = readFileSync(resolve(process.cwd(), "components/landing/terminal.tsx"), "utf-8");
    expect(src).toContain("bg-signalgray-800");
  });

  it("terminal.tsx has whileInView animation", () => {
    const src = readFileSync(resolve(process.cwd(), "components/landing/terminal.tsx"), "utf-8");
    expect(src).toContain("whileInView");
  });

  it("terminal.tsx has once: true", () => {
    const src = readFileSync(resolve(process.cwd(), "components/landing/terminal.tsx"), "utf-8");
    expect(src).toContain("once: true");
  });

  it("terminal.tsx uses EASE_ENTER_TUPLE from lib/easing", () => {
    const src = readFileSync(resolve(process.cwd(), "components/landing/terminal.tsx"), "utf-8");
    expect(src).toContain("EASE_ENTER_TUPLE");
  });

  it("terminal.tsx contains terminal content (npx superspecs install)", () => {
    const src = readFileSync(resolve(process.cwd(), "components/landing/terminal.tsx"), "utf-8");
    expect(src).toContain("npx superspecs install");
  });

  it("terminal.tsx has use client directive", () => {
    const src = readFileSync(resolve(process.cwd(), "components/landing/terminal.tsx"), "utf-8");
    expect(src).toContain('"use client"');
  });
});

describe("Task 2.2 — hero.tsx: terminal block removed", () => {
  it("hero.tsx no longer contains terminal mockup div", () => {
    expect(heroSrc).not.toContain("npx superspecs install");
  });

  it("hero.tsx no longer contains bg-signalgray-900", () => {
    expect(heroSrc).not.toContain("bg-signalgray-900");
  });

  it("hero.tsx no longer contains Terminal mockup comment", () => {
    expect(heroSrc).not.toContain("Terminal mockup");
  });
});
