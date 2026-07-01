import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(__dirname, "..");

const oldStubs = [
  path.join(root, "content/docs/introduction.mdx"),
  path.join(root, "content/docs/quick-start.mdx"),
];

const newPages = [
  { file: path.join(root, "content/docs/getting-started/introduction.mdx"), order: 1 },
  { file: path.join(root, "content/docs/getting-started/installation.mdx"), order: 2 },
  { file: path.join(root, "content/docs/getting-started/quick-start.mdx"), order: 3 },
];

describe("docs content refresh: getting-started section", () => {
  it("removes the old stub pages", () => {
    for (const stub of oldStubs) {
      expect(existsSync(stub), `${stub} should not exist`).toBe(false);
    }
  });

  it("creates the new getting-started pages", () => {
    for (const page of newPages) {
      expect(existsSync(page.file), `${page.file} should exist`).toBe(true);
    }
  });

  it("sets the correct order in frontmatter for each new page", () => {
    for (const page of newPages) {
      const content = readFileSync(page.file, "utf-8");
      const match = content.match(/^order:\s*(\d+)/m);
      expect(match, `${page.file} should have an order field`).not.toBeNull();
      expect(Number(match?.[1])).toBe(page.order);
    }
  });
});
