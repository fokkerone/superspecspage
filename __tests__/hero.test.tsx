/**
 * Tests for Task 2.1: components/landing/hero.tsx migration
 * RED: fail until hero.tsx is rewritten
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { readFileSync } from "fs";
import { resolve } from "path";

vi.mock("framer-motion", () => ({
  motion: {
    h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h1 {...props}>{children}</h1>
    ),
  },
}));

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

const srcPath = resolve(process.cwd(), "components/landing/hero.tsx");

describe("Task 2.1 — Hero: no old aesthetic tokens", () => {
  it("source has no text-emerald- classes", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).not.toMatch(/text-emerald-/);
  });

  it("source has no bg-emerald- classes", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).not.toMatch(/bg-emerald-/);
  });

  it("source has no font-bold", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).not.toContain("font-bold");
  });

  it("source has no font-semibold", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).not.toContain("font-semibold");
  });

  it("source has no rounded-full on CTA buttons", () => {
    const src = readFileSync(srcPath, "utf-8");
    // rounded-full on terminal dots is allowed (w-2.5 h-2.5 rounded-full)
    // but NOT on buttons/links
    const lines = src.split("\n");
    for (const line of lines) {
      if (line.includes("rounded-full") && !line.includes("w-2.5")) {
        expect.fail(`Found rounded-full on non-terminal-dot element: ${line.trim()}`);
      }
    }
  });

  it("source has no bg-[#080808]", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).not.toContain("bg-[#080808]");
  });

  it("source imports EASE_ENTER_TUPLE from lib/easing", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).toContain("EASE_ENTER_TUPLE");
    expect(src).toContain("@/lib/easing");
  });
});

describe("Task 2.1 — Hero: correct new tokens", () => {
  it("heading has clamp(3rem in style", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).toContain("clamp(3rem");
  });

  it("uses font-light on display heading", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).toContain("font-light");
  });

  it("uses bg-signalgray-900 for terminal mockup", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).toContain("signalgray-900");
  });

  it("primary CTA has border-white/15 (Pattern B)", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).toContain("border-white/15");
  });

  it("primary CTA has rounded-sm", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).toContain("rounded-sm");
  });

  it("has referrer check for shouldAnimate", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).toContain("document.referrer");
    expect(src).toContain("shouldAnimate");
  });

  it("clip-path reveal uses initial={shouldAnimate ? ...", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).toContain("shouldAnimate");
    expect(src).toContain("clipPath");
  });
});
