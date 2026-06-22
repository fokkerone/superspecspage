/**
 * Tests for Task 2.7: components/landing/footer.tsx migration
 * RED: fail until footer.tsx is rewritten
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { readFileSync } from "fs";
import { resolve } from "path";

vi.mock("next/link", () => ({
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}));

const srcPath = resolve(process.cwd(), "components/landing/footer.tsx");

describe("Task 2.7 — Footer: no old aesthetic tokens", () => {
  it("source has no emerald class", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).not.toMatch(/emerald/);
  });

  it("source has no font-bold", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).not.toContain("font-bold");
  });
});

describe("Task 2.7 — Footer: correct new tokens", () => {
  it("logo span uses opacity: 0.4 on SPECS", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).toContain("opacity: 0.4");
  });

  it("uses border-white/10 for dividers", () => {
    const src = readFileSync(srcPath, "utf-8");
    expect(src).toContain("border-white/10");
  });

  it("logo renders SUPER and SPECS text", async () => {
    const { Footer } = await import("@/components/landing/footer");
    render(<Footer />);
    // SUPER and SPECS are in the same <span> but split by an inner <span>
    // Check the combined text content of the logo link
    const logoLink = document.querySelector("a[href='/']");
    expect(logoLink?.textContent).toContain("SUPER");
    expect(logoLink?.textContent).toContain("SPECS");
  });
});
