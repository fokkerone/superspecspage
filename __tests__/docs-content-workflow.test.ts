import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(__dirname, "..");
const file = path.join(root, "content/docs/concepts/workflow.mdx");

describe("docs content refresh: concepts/workflow (Steps-based)", () => {
  it("creates the workflow page", () => {
    expect(existsSync(file), `${file} should exist`).toBe(true);
  });

  it("uses the Steps shortcode", () => {
    const content = readFileSync(file, "utf-8");
    expect(content).toContain("<Steps>");
  });

  it("has a Step for each of the four phases", () => {
    const content = readFileSync(file, "utf-8");
    for (const phase of ["Plan", "Execute", "Verify", "Ship"]) {
      expect(content).toContain(phase);
      expect(content).toMatch(/<Step title=/);
    }
  });

  it("sets order: 11 in frontmatter", () => {
    const content = readFileSync(file, "utf-8");
    expect(content).toMatch(/^order:\s*11\s*$/m);
  });
});
