import type { ReactNode } from "react";

/**
 * Hover microinteraction: the label rolls up and an identical copy rolls in from below.
 * The parent link/button must carry the `group` class. Pure CSS (transform only).
 */
export function RollText({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`relative inline-flex overflow-hidden ${className}`}>
      <span className="block transition-transform duration-500 ease-out-expo group-hover:-translate-y-full group-focus-visible:-translate-y-full motion-reduce:transition-none">
        {children}
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-out-expo group-hover:translate-y-0 group-focus-visible:translate-y-0 motion-reduce:transition-none"
      >
        {children}
      </span>
    </span>
  );
}
