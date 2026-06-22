/**
 * Tests for Task 3.3: features.tsx — Light Section + Reveals
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const src = readFileSync(resolve(process.cwd(), "components/landing/features.tsx"), "utf-8");

describe("Task 3.3 — Features: light background", () => {
  it("section has bg-signalgray-100", () => {
    expect(src).toContain("bg-signalgray-100");
  });

  it("no border-t border-white/10 on section (removed)", () => {
    expect(src).not.toMatch(/section[^>]*border-t border-white\/10/);
  });

  it("heading uses text-signalgray-800", () => {
    expect(src).toContain("text-signalgray-800");
  });

  it("no text-white on heading (light section)", () => {
    // heading should not have bare text-white
    expect(src).not.toMatch(/className="font-light text-white/);
  });

  it("card background is bg-signalgray-200", () => {
    expect(src).toContain("bg-signalgray-200");
  });

  it("card grid uses bg-signalgray-800/10 as gap color (not bg-white/10)", () => {
    expect(src).toContain("bg-signalgray-800/10");
    expect(src).not.toContain("bg-white/10");
  });

  it("card description uses text-signalgray-800/70 (AA-compliant on light)", () => {
    expect(src).toContain("text-signalgray-800/70");
  });
});

describe("Task 3.3 — Features: whileInView reveals", () => {
  it("is a use client component", () => {
    expect(src).toContain('"use client"');
  });

  it("has whileInView on cards", () => {
    expect(src).toContain("whileInView");
  });

  it("uses once: true", () => {
    expect(src).toContain("once: true");
  });

  it("uses EASE_ENTER_TUPLE", () => {
    expect(src).toContain("EASE_ENTER_TUPLE");
  });

  it("cards have staggered delay (i * 0.08)", () => {
    expect(src).toContain("0.08");
  });

  it("section heading also animates", () => {
    // multiple whileInView — one for heading, one for cards
    const matches = src.match(/whileInView/g);
    expect(matches).not.toBeNull();
    expect(matches!.length).toBeGreaterThanOrEqual(2);
  });
});
