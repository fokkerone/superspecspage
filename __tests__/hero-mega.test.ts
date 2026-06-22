/**
 * Tests for Task 2.3: hero.tsx — Mega-Headline + Parallax + light bg
 * RED: fail until hero.tsx is fully rewritten
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const src = readFileSync(resolve(process.cwd(), "components/landing/hero.tsx"), "utf-8");

describe("Task 2.3 — Hero: light background", () => {
  it("section has bg-signalgray-100", () => {
    expect(src).toContain("bg-signalgray-100");
  });

  it("section has overflow-hidden", () => {
    expect(src).toContain("overflow-hidden");
  });

  it("section uses justify-between (eyebrow top, headline bottom)", () => {
    expect(src).toContain("justify-between");
  });

  it("no text-white on hero section (uses signalgray-800 variants)", () => {
    // text-white should not appear as primary text color — only signalgray-800
    // CTA border uses border-white? No — dark variant. Check no naked text-white
    expect(src).not.toMatch(/className="[^"]*text-white[^"]*"/);
  });
});

describe("Task 2.3 — Hero: Mega-Headline", () => {
  it("headline uses font-extrabold", () => {
    expect(src).toContain("font-extrabold");
  });

  it("headline uses clamp for font-size", () => {
    expect(src).toContain("clamp(5rem");
  });

  it("headline uses whitespace-nowrap", () => {
    expect(src).toContain("whitespace-nowrap");
  });

  it("headline uses lineHeight 0.95", () => {
    expect(src).toContain("0.95");
  });

  it("headline has willChange transform", () => {
    expect(src).toContain("willChange");
  });
});

describe("Task 2.3 — Hero: Parallax", () => {
  it("uses useScroll from framer-motion", () => {
    expect(src).toContain("useScroll");
  });

  it("uses useTransform from framer-motion", () => {
    expect(src).toContain("useTransform");
  });

  it("uses useScrollContainer for container ref", () => {
    expect(src).toContain("useScrollContainer");
  });

  it("parallax offset is start start to end start", () => {
    expect(src).toContain("start start");
    expect(src).toContain("end start");
  });

  it("parallax transform goes to -25%", () => {
    expect(src).toContain("-25%");
  });

  it("uses useReducedMotion for accessibility", () => {
    expect(src).toContain("useReducedMotion");
  });
});

describe("Task 2.3 — Hero: entry animation preserved", () => {
  it("clip-path entry animation still present", () => {
    expect(src).toContain("clipPath");
    expect(src).toContain("inset(100%");
  });

  it("shouldAnimate referrer check still present", () => {
    expect(src).toContain("shouldAnimate");
    expect(src).toContain("document.referrer");
  });

  it("uses EASE_ENTER_TUPLE", () => {
    expect(src).toContain("EASE_ENTER_TUPLE");
  });
});

describe("Task 2.3 — Hero: eyebrow and sub-text", () => {
  it("eyebrow has pt-20 for header clearance", () => {
    expect(src).toContain("pt-20");
  });

  it("eyebrow uses text-signalgray-800/50", () => {
    expect(src).toContain("text-signalgray-800/50");
  });

  it("sub-text uses text-signalgray-800/70", () => {
    expect(src).toContain("text-signalgray-800/70");
  });

  it("no terminal mockup in hero", () => {
    expect(src).not.toContain("npx superspecs install");
  });
});
