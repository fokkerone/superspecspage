import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(__dirname, "..");

const pages = [
  { file: path.join(root, "content/docs/reference/skill-reference.mdx"), order: 21 },
  { file: path.join(root, "content/docs/reference/wiki-operations.mdx"), order: 22 },
];

describe("docs content refresh: reference section", () => {
  it("creates the new reference pages", () => {
    for (const page of pages) {
      expect(existsSync(page.file), `${page.file} should exist`).toBe(true);
    }
  });

  it("sets the correct order in frontmatter for each new page", () => {
    for (const page of pages) {
      const content = readFileSync(page.file, "utf-8");
      const match = content.match(/^order:\s*(\d+)/m);
      expect(match, `${page.file} should have an order field`).not.toBeNull();
      expect(Number(match?.[1])).toBe(page.order);
    }
  });

  it("renders the skill reference as a real markdown table", () => {
    const content = readFileSync(
      path.join(root, "content/docs/reference/skill-reference.mdx"),
      "utf-8"
    );
    const lines = content.split("\n");
    const tableHeaderLine = lines.find(
      (line) => line.trim().startsWith("|") && line.trim().split("|").length > 2
    );
    expect(tableHeaderLine, "skill-reference.mdx should contain a markdown table").not.toBeUndefined();
  });
});
