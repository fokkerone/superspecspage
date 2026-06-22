/**
 * Tests for Task 1.3: components/landing/header.tsx — mix-blend-difference
 * RED: fail until header.tsx is updated with mix-blend-difference
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const srcPath = resolve(process.cwd(), "components/landing/header.tsx");
const src = readFileSync(srcPath, "utf-8");

describe("Task 1.3 — Header: mix-blend-difference", () => {
  it("has mix-blend-difference class", () => {
    expect(src).toContain("mix-blend-difference");
  });

  it("has no backdrop-blur", () => {
    expect(src).not.toContain("backdrop-blur");
  });

  it("has no bg-signalgray-800 on header element", () => {
    // bg- on header itself should be gone — blend mode replaces it
    expect(src).not.toMatch(/bg-signalgray-800/);
  });

  it("has no border-b on header", () => {
    expect(src).not.toContain("border-b");
  });

  it("header has pointer-events-none", () => {
    expect(src).toContain("pointer-events-none");
  });

  it("inner container has pointer-events-auto", () => {
    expect(src).toContain("pointer-events-auto");
  });

  it("nav links are text-white", () => {
    expect(src).toContain("text-white");
  });

  it("still has link-underline on nav links", () => {
    expect(src).toContain("link-underline");
  });

  it("still has h-14 for inner container height", () => {
    expect(src).toContain("h-14");
  });
});
