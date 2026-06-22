/**
 * Task 3.1: Global audit — zero tolerance for forbidden patterns
 * across all landing and docs source files.
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const cwd = process.cwd();

// Files to audit
const landingFiles = readdirSync(resolve(cwd, "components/landing"))
  .filter((f) => f.endsWith(".tsx"))
  .map((f) => resolve(cwd, "components/landing", f));

const appFiles = [resolve(cwd, "app/page.tsx"), resolve(cwd, "app/docs/layout.tsx")];

const docsSlugPage = resolve(cwd, "app/docs/[[...slug]]/page.tsx");
if (existsSync(docsSlugPage)) appFiles.push(docsSlugPage);

const allFiles = [...landingFiles, ...appFiles];

function readAll() {
  return allFiles.map((f) => ({ file: f, src: readFileSync(f, "utf-8") }));
}

describe("Task 3.1 — no cold-black backgrounds", () => {
  it("zero bg-[#080808] in any landing or docs file", () => {
    const violations: string[] = [];
    for (const { file, src } of readAll()) {
      if (src.includes("bg-[#080808]")) violations.push(file);
    }
    expect(violations).toEqual([]);
  });

  it("zero bg-black in any landing or docs file", () => {
    const violations: string[] = [];
    for (const { file, src } of readAll()) {
      if (src.includes("bg-black")) violations.push(file);
    }
    expect(violations).toEqual([]);
  });

  it("zero bg-[#111110] in any landing or docs file", () => {
    const violations: string[] = [];
    for (const { file, src } of readAll()) {
      if (src.includes("bg-[#111110]")) violations.push(file);
    }
    expect(violations).toEqual([]);
  });

  it("app/page.tsx main has no hardcoded bg (sections carry their own backgrounds)", () => {
    const src = readFileSync(resolve(cwd, "app/page.tsx"), "utf-8");
    // Sections carry their own bg-signalgray-* — main should be bare
    expect(src).not.toMatch(/<main[^>]*bg-signalgray-800/);
  });
});

describe("Task 3.1 — no emerald accent anywhere", () => {
  it("zero text-emerald- in any landing or docs file", () => {
    const violations: string[] = [];
    for (const { file, src } of readAll()) {
      if (/text-emerald-/.test(src)) violations.push(file);
    }
    expect(violations).toEqual([]);
  });

  it("zero bg-emerald- in any landing or docs file", () => {
    const violations: string[] = [];
    for (const { file, src } of readAll()) {
      if (/bg-emerald-/.test(src)) violations.push(file);
    }
    expect(violations).toEqual([]);
  });

  it("zero prose-code:text-emerald in docs page", () => {
    const src = readFileSync(docsSlugPage, "utf-8");
    expect(src).not.toContain("text-emerald");
  });
});

describe("Task 3.1 — no font-bold or font-semibold", () => {
  it("zero font-bold in any landing file", () => {
    const violations: string[] = [];
    for (const { file, src } of readAll()) {
      if (src.includes("font-bold")) violations.push(file);
    }
    expect(violations).toEqual([]);
  });

  it("zero font-semibold in any landing file", () => {
    const violations: string[] = [];
    for (const { file, src } of readAll()) {
      if (src.includes("font-semibold")) violations.push(file);
    }
    expect(violations).toEqual([]);
  });

  it("zero prose-headings:font-bold in docs", () => {
    const src = readFileSync(docsSlugPage, "utf-8");
    expect(src).not.toContain("prose-headings:font-bold");
  });
});

describe("Task 3.1 — rounded-full only on terminal dots", () => {
  it("every rounded-full occurrence is on a w-2.5 h-2.5 terminal dot", () => {
    const violations: string[] = [];
    for (const { file, src } of readAll()) {
      const lines = src.split("\n");
      for (const line of lines) {
        if (line.includes("rounded-full") && !line.includes("w-2.5")) {
          violations.push(`${file}: ${line.trim()}`);
        }
      }
    }
    expect(violations).toEqual([]);
  });
});

describe("Task 3.1 — no old transition artifacts", () => {
  it("lib/transitions.ts does not exist", () => {
    expect(existsSync(resolve(cwd, "lib/transitions.ts"))).toBe(false);
  });

  it("components/page-transition-wrapper.tsx does not exist", () => {
    expect(existsSync(resolve(cwd, "components/page-transition-wrapper.tsx"))).toBe(false);
  });

  it("zero PageTransitionWrapper references in any source file", () => {
    const violations: string[] = [];
    for (const { file, src } of readAll()) {
      if (src.includes("PageTransitionWrapper")) violations.push(file);
    }
    // Also check layout.tsx
    const layoutSrc = readFileSync(resolve(cwd, "app/layout.tsx"), "utf-8");
    expect(layoutSrc).not.toContain("PageTransitionWrapper");
    expect(violations).toEqual([]);
  });

  it("zero --ease-premium references in any source file", () => {
    const violations: string[] = [];
    for (const { file, src } of readAll()) {
      if (src.includes("--ease-premium")) violations.push(file);
    }
    const cssSrc = readFileSync(resolve(cwd, "app/globals.css"), "utf-8");
    expect(cssSrc).not.toContain("--ease-premium");
    expect(violations).toEqual([]);
  });

  it("zero lib/transitions references in any source file", () => {
    const violations: string[] = [];
    for (const { file, src } of readAll()) {
      if (src.includes("lib/transitions")) violations.push(file);
    }
    expect(violations).toEqual([]);
  });
});

describe("Task 3.1 — no forbidden hex color tokens in components", () => {
  it("zero text-[#e8e6e3] or text-[#6b6a67] in any landing file", () => {
    const violations: string[] = [];
    for (const { file, src } of readAll()) {
      if (src.includes("text-[#e8e6e3]") || src.includes("text-[#6b6a67]")) {
        violations.push(file);
      }
    }
    expect(violations).toEqual([]);
  });

  it("zero text-[#f4f3f0] or text-[#9c9a96] in any landing file", () => {
    const violations: string[] = [];
    for (const { file, src } of readAll()) {
      if (src.includes("text-[#f4f3f0]") || src.includes("text-[#9c9a96]")) {
        violations.push(file);
      }
    }
    expect(violations).toEqual([]);
  });
});

describe("Task 3.1 — no forbidden easing in source files", () => {
  it("zero ease-in-out in CSS or framer-motion contexts in landing files", () => {
    const violations: string[] = [];
    for (const { file, src } of readAll()) {
      if (src.includes("ease-in-out") || src.includes("easeInOut")) {
        violations.push(file);
      }
    }
    expect(violations).toEqual([]);
  });

  it("globals.css has no ease-in-out", () => {
    const src = readFileSync(resolve(cwd, "app/globals.css"), "utf-8");
    expect(src).not.toContain("ease-in-out");
  });
});

describe("Task 3.1 — key positive assertions", () => {
  it("lib/easing.ts exists", () => {
    expect(existsSync(resolve(cwd, "lib/easing.ts"))).toBe(true);
  });

  it("components/page-transition.tsx exists", () => {
    expect(existsSync(resolve(cwd, "components/page-transition.tsx"))).toBe(true);
  });

  it("globals.css has --ease-enter and --ease-exit", () => {
    const src = readFileSync(resolve(cwd, "app/globals.css"), "utf-8");
    expect(src).toContain("--ease-enter: cubic-bezier(0.6, 0, 0.24, 1)");
    expect(src).toContain("--ease-exit: cubic-bezier(0.82, 1, 0.36, 1)");
  });

  it("globals.css has all 6 signalgray tokens", () => {
    const src = readFileSync(resolve(cwd, "app/globals.css"), "utf-8");
    for (const n of ["100", "200", "300", "700", "800", "900"]) {
      expect(src).toContain(`--signalgray-${n}:`);
    }
  });

  it("app/layout.tsx imports PageTransition from page-transition", () => {
    const src = readFileSync(resolve(cwd, "app/layout.tsx"), "utf-8");
    expect(src).toContain('import { PageTransition } from "@/components/page-transition"');
  });
});
