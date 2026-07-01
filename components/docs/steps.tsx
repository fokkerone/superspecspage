import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";

export function Steps({ children }: { children: ReactNode }) {
  const items = Children.toArray(children);
  return (
    <div className="flex flex-col">
      {items.map((child, index) => {
        if (isValidElement(child)) {
          return cloneElement(child as ReactElement<StepProps>, {
            index: index + 1,
            isLast: index === items.length - 1,
            key: index,
          });
        }
        return child;
      })}
    </div>
  );
}

type StepProps = {
  title: string;
  children: ReactNode;
  index?: number;
  isLast?: boolean;
};

export function Step({ title, children, index, isLast }: StepProps) {
  const number = String(index ?? 1).padStart(2, "0");
  return (
    <div
      data-testid="doc-step"
      className={`relative pl-8 ${isLast ? "pb-0" : "border-l border-white/10 pb-8"}`}
    >
      <span className="absolute -left-3 top-0 flex h-6 w-6 items-center justify-center rounded-sm border border-white/15 bg-signalgray-900 font-mono text-sm font-medium text-white/70">
        {number}
      </span>
      <h4 className="font-normal text-white">{title}</h4>
      <div className="mt-1 text-white/70">{children}</div>
    </div>
  );
}
