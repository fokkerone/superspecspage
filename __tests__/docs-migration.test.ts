/**
 * Tests for Task 2.9: docs section migration
 * RED: fail until app/docs/layout.tsx and app/docs/[[...slug]]/page.tsx are updated
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const veliteConfigPath = resolve(process.cwd(), "velite.config.ts");

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

describe("Task 2.2 — section field", () => {
  it("(a) velite.config.ts source contains a section field definition", () => {
    const src = readFileSync(veliteConfigPath, "utf-8");
    expect(src).toContain("section:");
  });

  it("(b) velite.config.ts source contains the transform logic for section derivation", () => {
    const src = readFileSync(veliteConfigPath, "utf-8");
    expect(src).toContain("parts.length");
  });
});

describe("Task 4.1 — three-column layout", () => {
  it("(a) app/docs/layout.tsx imports DocsSidebar", () => {
    const src = readFileSync(docsLayoutPath, "utf-8");
    expect(src).toContain("DocsSidebar");
  });

  it("(b) app/docs/[[...slug]]/page.tsx imports DocsTOC", () => {
    const src = readFileSync(docsPagePath, "utf-8");
    expect(src).toContain("DocsTOC");
  });

  it("(c) app/docs/layout.tsx does NOT import PageTransition or ScrollContainer", () => {
    const src = readFileSync(docsLayoutPath, "utf-8");
    expect(src).not.toContain("PageTransition");
    expect(src).not.toContain("ScrollContainer");
  });

  it("(d) app/docs/layout.tsx contains hidden lg:block (left sidebar responsive class)", () => {
    const src = readFileSync(docsLayoutPath, "utf-8");
    expect(src).toContain("hidden lg:block");
  });

  it("(e) app/docs/[[...slug]]/page.tsx contains hidden xl:block (right TOC responsive class)", () => {
    const src = readFileSync(docsPagePath, "utf-8");
    expect(src).toContain("hidden xl:block");
  });

  it("(f) app/docs/[[...slug]]/page.tsx contains flattenToc", () => {
    const src = readFileSync(docsPagePath, "utf-8");
    expect(src).toContain("flattenToc");
  });
});

describe("Task 2.1 — Velite config: rehype-slug and s.toc()", () => {
  it("(a) velite.config.ts contains rehype-slug in rehypePlugins", () => {
    const src = readFileSync(veliteConfigPath, "utf-8");
    expect(src).toContain("rehype-slug");
    expect(src).toContain("rehypePlugins");
  });

  it("(b) velite.config.ts contains s.toc() in the docs schema", () => {
    const src = readFileSync(veliteConfigPath, "utf-8");
    expect(src).toContain("s.toc()");
  });

  it("(c) velite.config.ts contains the optional frontmatter toc field definition", () => {
    const src = readFileSync(veliteConfigPath, "utf-8");
    expect(src).toContain("tocOverride");
    expect(src).toContain("s.array(");
    expect(src).toContain(".optional()");
  });
});

describe("Task 1.1 — Syntax highlighting via rehype-pretty-code", () => {
  it("(a) velite.config.ts contains rehype-pretty-code in the rehypePlugins array", () => {
    const src = readFileSync(veliteConfigPath, "utf-8");
    expect(src).toContain("rehype-pretty-code");
    expect(src).toContain("rehypePlugins");
  });

  it("(b) rehype-slug appears before rehype-pretty-code (slug runs first)", () => {
    const src = readFileSync(veliteConfigPath, "utf-8");
    const slugIndex = src.indexOf("rehype-slug");
    const prettyCodeIndex = src.indexOf("rehype-pretty-code");
    expect(slugIndex).toBeGreaterThan(-1);
    expect(prettyCodeIndex).toBeGreaterThan(-1);
    expect(slugIndex).toBeLessThan(prettyCodeIndex);
  });
});

describe("Task 1.2 — Styling highlighted code blocks for dark theme", () => {
  it("(a) app/docs/[[...slug]]/page.tsx still contains the established prose-pre dark-theme classes unchanged", () => {
    const src = readFileSync(docsPagePath, "utf-8");
    expect(src).toContain("prose-pre:bg-white/[0.04]");
    expect(src).toContain("prose-pre:border");
    expect(src).toContain("prose-pre:border-white/10");
    expect(src).toContain("prose-pre:rounded-lg");
  });

  it("(b) velite.config.ts disables rehype-pretty-code's own inline background so Tailwind's prose-pre background controls layering", () => {
    const src = readFileSync(veliteConfigPath, "utf-8");
    expect(src).toContain("keepBackground: false");
  });
});

// Task 4.2's original assertions covered content/docs/introduction.mdx,
// quick-start.mdx, and how-it-works.mdx directly. The docs-content-refresh
// spec superseded those three stub files with a section-organized sitemap
// (see __tests__/docs-content-getting-started.test.ts, which covers the
// same "order frontmatter" intent for their replacements).

describe("Task fix — @tailwindcss/typography plugin actually registered", () => {
  it("(a) package.json declares @tailwindcss/typography as a dependency", () => {
    const src = readFileSync(resolve(process.cwd(), "package.json"), "utf-8");
    expect(src).toContain("@tailwindcss/typography");
  });

  it("(b) globals.css registers the typography plugin via @plugin directive", () => {
    const src = readFileSync(resolve(process.cwd(), "app/globals.css"), "utf-8");
    expect(src).toContain('@plugin "@tailwindcss/typography"');
  });
});

describe("Typography refresh — opengsd-inspired heading/body/table hierarchy on dark theme", () => {
  it("(a) heading scale: h1 largest, h2 mid, h3 smallest, matching opengsd's proportional hierarchy", () => {
    const src = readFileSync(docsPagePath, "utf-8");
    expect(src).toContain("prose-h1:text-4xl");
    expect(src).toContain("prose-h2:text-3xl");
    expect(src).toContain("prose-h3:text-xl");
  });

  it("(b) heading spacing: h1 mb-6, h2 mt-12/mb-4, h3 mt-8/mb-2", () => {
    const src = readFileSync(docsPagePath, "utf-8");
    expect(src).toContain("prose-h1:mb-6");
    expect(src).toContain("prose-h2:mt-12");
    expect(src).toContain("prose-h2:mb-4");
    expect(src).toContain("prose-h3:mt-8");
    expect(src).toContain("prose-h3:mb-2");
  });

  it("(c) body paragraph spacing: prose-p:mb-4 added", () => {
    const src = readFileSync(docsPagePath, "utf-8");
    expect(src).toContain("prose-p:mb-4");
  });

  it("(d) code block padding matches opengsd's spacious 1.5rem (prose-pre:p-6)", () => {
    const src = readFileSync(docsPagePath, "utf-8");
    expect(src).toContain("prose-pre:p-6");
  });

  it("(e) list indentation and item spacing added (prose-ul/ol:pl-6, prose-li:mb-2)", () => {
    const src = readFileSync(docsPagePath, "utf-8");
    expect(src).toContain("prose-ul:pl-6");
    expect(src).toContain("prose-ol:pl-6");
    expect(src).toContain("prose-li:mb-2");
  });

  it("(f) table cell padding matches opengsd's spacious 0.75rem/1rem (prose-th/td:px-4 py-3)", () => {
    const src = readFileSync(docsPagePath, "utf-8");
    expect(src).toContain("prose-th:px-4");
    expect(src).toContain("prose-th:py-3");
    expect(src).toContain("prose-td:px-4");
    expect(src).toContain("prose-td:py-3");
  });

  it("(g) no forbidden colors/weights introduced while matching opengsd proportions", () => {
    const src = readFileSync(docsPagePath, "utf-8");
    expect(src).not.toContain("font-bold");
    expect(src).not.toContain("font-semibold");
    expect(src).not.toMatch(/text-blue-|text-\[#2563eb\]|text-\[#1d4ed8\]/);
    expect(src).not.toContain("bg-black");
  });
});

describe("Task 3.2 — Default /docs route resolves to the new introduction slug", () => {
  it("app/docs/[[...slug]]/page.tsx falls back to docs/getting-started/introduction, not docs/introduction", () => {
    const src = readFileSync(docsPagePath, "utf-8");
    expect(src).toContain("getting-started/introduction");
    expect(src).not.toMatch(/slug\s*&&\s*slug\.length > 0 \? slug\.join\("\/"\) : "introduction"/);
  });
});
