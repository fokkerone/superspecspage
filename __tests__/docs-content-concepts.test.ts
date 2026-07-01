import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(__dirname, "..");

const pages = [
  { file: path.join(root, "content/docs/concepts/the-wiki.mdx"), order: 12 },
  { file: path.join(root, "content/docs/concepts/design-principles.mdx"), order: 13 },
];

describe("docs content refresh: concepts section", () => {
  it("creates the concepts pages", () => {
    for (const page of pages) {
      expect(existsSync(page.file), `${page.file} should exist`).toBe(true);
    }
  });

  it("sets a non-empty title in frontmatter for each page", () => {
    for (const page of pages) {
      const content = readFileSync(page.file, "utf-8");
      const match = content.match(/^title:\s*(.+)$/m);
      expect(match, `${page.file} should have a title field`).not.toBeNull();
      expect(match?.[1].trim().length).toBeGreaterThan(0);
    }
  });

  it("sets a non-empty description in frontmatter for each page", () => {
    for (const page of pages) {
      const content = readFileSync(page.file, "utf-8");
      const match = content.match(/^description:\s*(.+)$/m);
      expect(match, `${page.file} should have a description field`).not.toBeNull();
      expect(match?.[1].trim().length).toBeGreaterThan(0);
    }
  });

  it("sets the correct order in frontmatter for each page", () => {
    for (const page of pages) {
      const content = readFileSync(page.file, "utf-8");
      const match = content.match(/^order:\s*(\d+)/m);
      expect(match, `${page.file} should have an order field`).not.toBeNull();
      expect(Number(match?.[1])).toBe(page.order);
    }
  });
});
