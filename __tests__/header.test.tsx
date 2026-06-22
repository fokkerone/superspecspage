/**
 * Tests for Task 2.2: components/landing/header.tsx migration
 * RED: fail until header.tsx is rewritten
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

const srcPath = resolve(process.cwd(), "components/landing/header.tsx");

describe("Task 2.2 — Header: no old aesthetic tokens", () => {
  it("source has no emerald class", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).not.toMatch(/emerald/);
  });

  it("source has no font-bold", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).not.toContain("font-bold");
  });

  it("source has no bg-[#080808]", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).not.toContain("bg-[#080808]");
  });

  it("source has no rounded-full", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).not.toContain("rounded-full");
  });

  it("source has no hover:text-white as sole hover indicator (must use link-underline)", () => {
    const src = readFileSync(srcPath, "utf-8");
    // If hover:text-white exists it should be alongside link-underline not standalone
    if (src.includes("hover:text-white")) {
      expect(src).toContain("link-underline");
    }
  });
});

describe("Task 2.2 — Header: correct new tokens", () => {
  it("uses mix-blend-difference (replaces bg-signalgray-800/80)", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).toContain("mix-blend-difference");
  });

  it("uses h-14 for header height", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).toContain("h-14");
  });

  it("nav links have link-underline class", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).toContain("link-underline");
  });

  it("no border-b (mix-blend-difference replaces bordered header)", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).not.toContain("border-b");
  });

  it("logo uses opacity: 0.4 on SPECS span", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).toContain("opacity: 0.4");
  });

  it("renders with no Get Started emerald CTA", async () => {
    const { Header } = await import("@/components/landing/header");
    render(<Header />);
    expect(document.querySelector("[class*='bg-emerald']")).toBeNull();
  });

  it("nav links hidden on mobile (has hidden class on nav)", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).toContain("hidden md:flex");
  });
});
