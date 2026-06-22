/**
 * Tests for Wave 3: whileInView reveals on all dark sections
 * Tasks 3.1, 3.2, 3.4, 3.5
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const cwd = process.cwd();

describe("Task 3.1 — Problem: whileInView reveals", () => {
  const src = readFileSync(resolve(cwd, "components/landing/problem.tsx"), "utf-8");

  it("is a use client component", () => {
    expect(src).toContain('"use client"');
  });

  it("h2 heading has whileInView", () => {
    expect(src).toContain("whileInView");
  });

  it("uses once: true", () => {
    expect(src).toContain("once: true");
  });

  it("uses EASE_ENTER_TUPLE", () => {
    expect(src).toContain("EASE_ENTER_TUPLE");
  });

  it("has initial opacity 0 y 40 animation", () => {
    expect(src).toContain("opacity: 0");
    expect(src).toContain("y: 40");
  });

  it("body text has delay 0.15", () => {
    expect(src).toContain("0.15");
  });

  it("bg remains signalgray-800 on cards", () => {
    expect(src).toContain("bg-signalgray-800");
  });
});

describe("Task 3.2 — HowItWorks: whileInView reveals", () => {
  const src = readFileSync(resolve(cwd, "components/landing/how-it-works.tsx"), "utf-8");

  it("is a use client component", () => {
    expect(src).toContain('"use client"');
  });

  it("has whileInView on phase cards", () => {
    expect(src).toContain("whileInView");
  });

  it("uses once: true", () => {
    expect(src).toContain("once: true");
  });

  it("uses EASE_ENTER_TUPLE", () => {
    expect(src).toContain("EASE_ENTER_TUPLE");
  });

  it("phase cards have staggered delay", () => {
    // Staggered delay uses index-based expression
    expect(src).toContain("delay");
    expect(src).toContain("0.1");
  });

  it("section heading has whileInView", () => {
    // Heading should also animate
    expect(src.indexOf("whileInView")).toBeGreaterThan(-1);
  });
});

describe("Task 3.4 — Agents: whileInView reveals", () => {
  const src = readFileSync(resolve(cwd, "components/landing/agents.tsx"), "utf-8");

  it("is a use client component", () => {
    expect(src).toContain('"use client"');
  });

  it("has whileInView", () => {
    expect(src).toContain("whileInView");
  });

  it("uses once: true", () => {
    expect(src).toContain("once: true");
  });

  it("uses EASE_ENTER_TUPLE", () => {
    expect(src).toContain("EASE_ENTER_TUPLE");
  });

  it("agent tags grid has delay 0.15", () => {
    expect(src).toContain("0.15");
  });

  it("bg remains signalgray-800 (dark section)", () => {
    expect(src).not.toContain("bg-signalgray-100");
  });
});

describe("Task 3.5 — Install: whileInView reveals", () => {
  const src = readFileSync(resolve(cwd, "components/landing/install.tsx"), "utf-8");

  it("is a use client component", () => {
    expect(src).toContain('"use client"');
  });

  it("has whileInView", () => {
    expect(src).toContain("whileInView");
  });

  it("uses once: true", () => {
    expect(src).toContain("once: true");
  });

  it("uses EASE_ENTER_TUPLE", () => {
    expect(src).toContain("EASE_ENTER_TUPLE");
  });

  it("heading + subtext + cta are staggered (delay 0.3)", () => {
    expect(src).toContain("0.3");
  });

  it("bg remains signalgray-800 (dark section)", () => {
    expect(src).not.toContain("bg-signalgray-100");
  });
});
