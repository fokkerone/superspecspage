import type { ReactNode } from "react";

export function Callout({ children }: { children: ReactNode }) {
  return (
    <div
      data-testid="doc-callout"
      className="border-l-2 border-white/15 bg-white/[0.03] px-4 py-3 text-white/70"
    >
      {children}
    </div>
  );
}
