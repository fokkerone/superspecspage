import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(__dirname, "..");

const pages = [
  { file: path.join(root, "content/docs/development/how-skills-work.mdx"), order: 31 },
  { file: path.join(root, "content/docs/development/creating-a-skill.mdx"), order: 32 },
  { file: path.join(root, "content/docs/development/local-development.mdx"), order: 33 },
];

describe("docs content refresh: development section", () => {
  it("creates the development pages", () => {
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

  it("sets the correct order in frontmatter for each page", () => {
    for (const page of pages) {
      const content = readFileSync(page.file, "utf-8");
      const match = content.match(/^order:\s*(\d+)/m);
      expect(match, `${page.file} should have an order field`).not.toBeNull();
      expect(Number(match?.[1])).toBe(page.order);
    }
  });
});
