/**
 * Tests for Task 1.4: components/page-transition.tsx
 * Snapshot-clone page transition — replaces PageTransitionWrapper
 *
 * RED: these will fail until page-transition.tsx is created and layout.tsx updated
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock next/navigation
const mockPathname = vi.fn(() => "/");
vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}));

describe("Task 1.4 — file existence and deletion checks", () => {
  it("components/page-transition.tsx exists", () => {
    const fs = require("node:fs");
    expect(fs.existsSync(resolve(process.cwd(), "components/page-transition.tsx"))).toBe(true);
  });

  it("components/page-transition-wrapper.tsx does NOT exist (deleted)", () => {
    const fs = require("node:fs");
    expect(fs.existsSync(resolve(process.cwd(), "components/page-transition-wrapper.tsx"))).toBe(
      false,
    );
  });

  it("lib/transitions.ts does NOT exist (deleted)", () => {
    const fs = require("node:fs");
    expect(fs.existsSync(resolve(process.cwd(), "lib/transitions.ts"))).toBe(false);
  });

  it("app/layout.tsx imports PageTransition not PageTransitionWrapper", () => {
    const content = readFileSync(resolve(process.cwd(), "app/layout.tsx"), "utf-8");
    expect(content).toContain('import { PageTransition } from "@/components/page-transition"');
    expect(content).not.toContain("PageTransitionWrapper");
  });
});

describe("Task 1.4 — page-transition.tsx source checks", () => {
  it("does NOT import from framer-motion", () => {
    const content = readFileSync(resolve(process.cwd(), "components/page-transition.tsx"), "utf-8");
    expect(content).not.toContain("framer-motion");
    expect(content).not.toContain("AnimatePresence");
    expect(content).not.toContain("motion.");
  });

  it("imports EASE_ENTER, EASE_EXIT, TRANSITION_DURATION from lib/easing", () => {
    const content = readFileSync(resolve(process.cwd(), "components/page-transition.tsx"), "utf-8");
    expect(content).toContain("EASE_ENTER");
    expect(content).toContain("EASE_EXIT");
    expect(content).toContain("TRANSITION_DURATION");
    expect(content).toContain("@/lib/easing");
  });

  it("includes prefers-reduced-motion check", () => {
    const content = readFileSync(resolve(process.cwd(), "components/page-transition.tsx"), "utf-8");
    expect(content).toContain("prefers-reduced-motion");
    expect(content).toContain("matchMedia");
  });

  it("has use client directive", () => {
    const content = readFileSync(resolve(process.cwd(), "components/page-transition.tsx"), "utf-8");
    expect(content).toContain('"use client"');
  });

  it("captures snapshot on mousedown with capture:true", () => {
    const content = readFileSync(resolve(process.cwd(), "components/page-transition.tsx"), "utf-8");
    expect(content).toContain("mousedown");
    expect(content).toContain("capture: true");
    expect(content).toContain("cloneNode");
  });

  it("new page starts at translateY(100vh)", () => {
    const content = readFileSync(resolve(process.cwd(), "components/page-transition.tsx"), "utf-8");
    expect(content).toContain("translateY(100vh)");
  });

  it("exit overlay uses translateY(-84%) scale(0.82)", () => {
    const content = readFileSync(resolve(process.cwd(), "components/page-transition.tsx"), "utf-8");
    expect(content).toContain("translateY(-84%)");
    expect(content).toContain("scale(0.82)");
  });

  it("uses TRANSITION_DURATION + 200 for frozenPathname timeout", () => {
    const content = readFileSync(resolve(process.cwd(), "components/page-transition.tsx"), "utf-8");
    expect(content).toContain("TRANSITION_DURATION + 200");
  });

  it("does not have hardcoded 1450 constant (uses import)", () => {
    const content = readFileSync(resolve(process.cwd(), "components/page-transition.tsx"), "utf-8");
    // Should not define a local const with value 1450
    expect(content).not.toMatch(/const\s+DURATION\s*=\s*1450/);
    expect(content).not.toMatch(/const\s+EASE_ENTER\s*=/);
    expect(content).not.toMatch(/const\s+EASE_EXIT\s*=/);
  });
});

describe("Task 1.4 — PageTransition renders children", () => {
  beforeEach(() => {
    mockPathname.mockReturnValue("/");
  });

  it("renders children without crashing", async () => {
    const { PageTransition } = await import("@/components/page-transition");
    render(
      <PageTransition>
        <div data-testid="child">content</div>
      </PageTransition>,
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("renders children text", async () => {
    const { PageTransition } = await import("@/components/page-transition");
    render(
      <PageTransition>
        <p>Hello world</p>
      </PageTransition>,
    );
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });
});

describe("Task 1.4 — reduced motion instant swap", () => {
  beforeEach(() => {
    mockPathname.mockReturnValue("/");
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("skips animation and swaps instantly under prefers-reduced-motion", async () => {
    // Mock matchMedia to report reduced motion
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === "(prefers-reduced-motion: reduce)",
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    const { PageTransition } = await import("@/components/page-transition");

    const { rerender } = render(
      <PageTransition>
        <div>page A</div>
      </PageTransition>,
    );

    // Simulate navigation
    mockPathname.mockReturnValue("/docs");
    rerender(
      <PageTransition>
        <div>page B</div>
      </PageTransition>,
    );

    // Under reduced motion: frozenPathname should update synchronously
    // (no 1650ms wait) — page B content visible without needing to advance timers
    expect(screen.getByText("page B")).toBeInTheDocument();
  });
});

describe("Task 1.1 — docs-internal navigation skip", () => {
  beforeEach(() => {
    mockPathname.mockReturnValue("/docs/a");
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("(a) docs→docs: pathname resolves instantly with no timer needed", async () => {
    // Mock matchMedia to report NO reduced motion (so the docs-skip is the only early-return path)
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    const { PageTransition } = await import("@/components/page-transition");

    const { rerender } = render(
      <PageTransition>
        <div>page A</div>
      </PageTransition>,
    );

    // Simulate docs-internal navigation
    mockPathname.mockReturnValue("/docs/b");
    rerender(
      <PageTransition>
        <div data-testid="page-b">page B</div>
      </PageTransition>,
    );

    // Should resolve instantly — page B visible without advancing timers
    expect(screen.getByTestId("page-b")).toBeInTheDocument();
    // The transitioning overlay (exit-snapshot-scroller) should NOT be present
    expect(document.querySelector(".exit-snapshot-scroller")).toBeNull();
  });

  it("(b) marketing→docs: transition enters transitioning state (full animation path)", async () => {
    // Start on marketing route
    mockPathname.mockReturnValue("/");

    // Mock matchMedia: no reduced motion
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    const { PageTransition } = await import("@/components/page-transition");

    const { rerender } = render(
      <PageTransition>
        <div>home page</div>
      </PageTransition>,
    );

    // Navigate to docs
    mockPathname.mockReturnValue("/docs/introduction");
    rerender(
      <PageTransition>
        <div data-testid="docs-page">docs introduction</div>
      </PageTransition>,
    );

    // Should be in transitioning state — timers pending means instant swap was NOT called
    expect(vi.getTimerCount()).toBeGreaterThan(0);
  });

  it("(c) /docs→/docs/introduction: bare /docs route is treated as docs-internal (no transition)", async () => {
    // The bare /docs route must match the isDocsRoute check, same as /docs/*
    mockPathname.mockReturnValue("/docs");

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    const { PageTransition } = await import("@/components/page-transition");

    const { rerender } = render(
      <PageTransition>
        <div>docs root</div>
      </PageTransition>,
    );

    // Navigate from /docs to /docs/introduction (second-level nav)
    mockPathname.mockReturnValue("/docs/introduction");
    rerender(
      <PageTransition>
        <div data-testid="docs-intro">introduction</div>
      </PageTransition>,
    );

    // Should resolve instantly — no timers, no exit overlay
    expect(screen.getByTestId("docs-intro")).toBeInTheDocument();
    expect(document.querySelector(".exit-snapshot-scroller")).toBeNull();
    expect(vi.getTimerCount()).toBe(0);
  });
});

describe("Task 1.4 — no animation code in page files", () => {
  it("app/page.tsx does not import framer-motion", () => {
    const content = readFileSync(resolve(process.cwd(), "app/page.tsx"), "utf-8");
    expect(content).not.toContain("framer-motion");
    expect(content).not.toContain("motion.");
    expect(content).not.toContain("AnimatePresence");
  });

  it("app/layout.tsx does not use motion.div directly", () => {
    const content = readFileSync(resolve(process.cwd(), "app/layout.tsx"), "utf-8");
    expect(content).not.toContain("motion.div");
    expect(content).not.toContain("AnimatePresence");
    expect(content).toContain("PageTransition");
  });
});
