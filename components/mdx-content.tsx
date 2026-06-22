"use client";

import * as runtime from "react/jsx-runtime";
import { useMemo } from "react";

function useMDXComponent(code: string) {
  return useMemo(() => {
    const fn = new Function(code);
    return fn({ ...runtime }).default as React.ComponentType<{
      components?: Record<string, React.ComponentType>;
    }>;
  }, [code]);
}

export function MDXContent({ code }: { code: string }) {
  const Component = useMDXComponent(code);
  return <Component />;
}
