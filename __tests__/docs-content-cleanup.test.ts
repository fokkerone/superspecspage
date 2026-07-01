import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

describe("docs content cleanup", () => {
  it("removes the superseded content/docs/how-it-works.mdx stub", () => {
    const stubPath = resolve(process.cwd(), "content/docs/how-it-works.mdx");
    expect(existsSync(stubPath)).toBe(false);
  });
});
