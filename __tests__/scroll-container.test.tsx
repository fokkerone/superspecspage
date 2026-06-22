/**
 * Tests for Task 1.1: components/scroll-container.tsx
 * RED: these will fail until scroll-container.tsx is created
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("ScrollContainer", () => {
  it("renders children inside a scroll container div", async () => {
    const { ScrollContainer } = await import("@/components/scroll-container");
    render(
      <ScrollContainer>
        <div data-testid="child">content</div>
      </ScrollContainer>,
    );
    expect(screen.getByTestId("child")).toBeDefined();
  });

  it("scroll container div has overflow-y auto", async () => {
    const { ScrollContainer } = await import("@/components/scroll-container");
    const { container } = render(
      <ScrollContainer>
        <span>test</span>
      </ScrollContainer>,
    );
    const scrollDiv = container.firstElementChild as HTMLElement;
    expect(scrollDiv.style.overflowY).toBe("auto");
  });

  it("scroll container div has overflow-x clip (not hidden — clip doesn't break position:sticky)", async () => {
    const { ScrollContainer } = await import("@/components/scroll-container");
    const { container } = render(
      <ScrollContainer>
        <span>test</span>
      </ScrollContainer>,
    );
    const scrollDiv = container.firstElementChild as HTMLElement;
    expect(scrollDiv.style.overflowX).toBe("clip");
  });

  it("scroll container div has height 100svh", async () => {
    const { ScrollContainer } = await import("@/components/scroll-container");
    const { container } = render(
      <ScrollContainer>
        <span>test</span>
      </ScrollContainer>,
    );
    const scrollDiv = container.firstElementChild as HTMLElement;
    expect(scrollDiv.style.height).toBe("100svh");
  });

  it("scroll container div has overscrollBehavior none", async () => {
    const { ScrollContainer } = await import("@/components/scroll-container");
    const { container } = render(
      <ScrollContainer>
        <span>test</span>
      </ScrollContainer>,
    );
    const scrollDiv = container.firstElementChild as HTMLElement;
    expect(scrollDiv.style.overscrollBehavior).toBe("none");
  });
});

describe("useScrollContainer", () => {
  it("exports useScrollContainer hook", async () => {
    const mod = await import("@/components/scroll-container");
    expect(typeof mod.useScrollContainer).toBe("function");
  });

  it("exports ScrollContext", async () => {
    const mod = await import("@/components/scroll-container");
    expect(mod.ScrollContext).toBeDefined();
  });
});
