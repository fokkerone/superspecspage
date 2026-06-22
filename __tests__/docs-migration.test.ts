/**
 * Tests for Task 2.9: docs section migration
 * RED: fail until app/docs/layout.tsx and app/docs/[[...slug]]/page.tsx are updated
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

const docsLayoutPath = resolve(process.cwd(), "app/docs/layout.tsx");
const docsPagePath = resolve(process.cwd(), "app/docs/[[...slug]]/page.tsx");

describe("Task 2.9 — Docs layout migration", () => {
  it("app/docs/layout.tsx uses bg-signalgray-800", () => {
    const src = readFileSync(docsLayoutPath, "utf-8");
    expect(src).toContain("signalgray-800");
  });

  it("app/docs/layout.tsx does NOT contain bg-[#080808]", () => {
    const src = readFileSync(docsLayoutPath, "utf-8");
    expect(src).not.toContain("bg-[#080808]");
  });

  it("app/docs/layout.tsx uses border-white/10 (not border-white/[0.06])", () => {
    const src = readFileSync(docsLayoutPath, "utf-8");
    expect(src).toContain("border-white/10");
    expect(src).not.toContain("border-white/[0.06]");
  });
});

describe("Task 2.9 — Docs prose class migration", () => {
  it("does NOT contain prose-code:text-emerald-400", () => {
    const src = readFileSync(docsPagePath, "utf-8");
    expect(src).not.toContain("prose-code:text-emerald-400");
  });

  it("contains prose-code:text-white", () => {
    const src = readFileSync(docsPagePath, "utf-8");
    expect(src).toContain("prose-code:text-white");
  });

  it("contains prose-code:rounded-sm (not rounded)", () => {
    const src = readFileSync(docsPagePath, "utf-8");
    expect(src).toContain("prose-code:rounded-sm");
    expect(src).not.toContain("prose-code:rounded ");
  });

  it("does NOT contain prose-a:text-emerald-400", () => {
    const src = readFileSync(docsPagePath, "utf-8");
    expect(src).not.toContain("prose-a:text-emerald-400");
  });

  it("contains prose-a:decoration-white/30", () => {
    const src = readFileSync(docsPagePath, "utf-8");
    expect(src).toContain("prose-a:decoration-white/30");
  });

  it("does NOT contain prose-headings:font-bold", () => {
    const src = readFileSync(docsPagePath, "utf-8");
    expect(src).not.toContain("prose-headings:font-bold");
  });

  it("contains prose-headings:font-medium", () => {
    const src = readFileSync(docsPagePath, "utf-8");
    expect(src).toContain("prose-headings:font-medium");
  });

  it("contains prose-p:text-white/70 (bumped from /60)", () => {
    const src = readFileSync(docsPagePath, "utf-8");
    expect(src).toContain("prose-p:text-white/70");
    expect(src).not.toContain("prose-p:text-white/60");
  });

  it("contains prose-li:text-white/70", () => {
    const src = readFileSync(docsPagePath, "utf-8");
    expect(src).toContain("prose-li:text-white/70");
  });

  it("contains prose-th:border-white/15 (bumped from /10)", () => {
    const src = readFileSync(docsPagePath, "utf-8");
    expect(src).toContain("prose-th:border-white/15");
  });
});
