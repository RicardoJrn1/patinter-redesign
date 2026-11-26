"use client";

import { ChevronDown } from "lucide-react";
import { type ReactNode, useId, useState } from "react";

/**
 * A heading entry whose own entries stay folded away until it is clicked (the menu's and the footer's
 * "Sustentabilidade"). The button says whether it is open (aria-expanded) and the arrow turns; the
 * entries slide open (grid rows from 0fr to 1fr, CSS only) and, folded, are inert, so the keyboard and
 * screen readers skip them as the eye does. Reduced motion: it simply opens and closes.
 *
 * `className`: the entry's type, without a display (the button lays out its label and arrow itself).
 *
 * The fold clips (overflow hidden, for the slide): the children must leave room inside themselves —
 * some bottom and right padding — for what their entries draw outside their own boxes, the link line
 * under the last one and the focus outline (2px, 3px out), or the line under "Patrocínios" is cut off.
 */
export function Disclosure({ label, className, children }: { label: string; className: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 text-left ${className}`}
      >
        <span className="link-line">{label}</span>
        <ChevronDown
          aria-hidden="true"
          strokeWidth={1.75}
          className={`size-[0.9em] shrink-0 transition-transform duration-500 ease-out-expo motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        id={id}
        inert={!open}
        className={`grid transition-[grid-template-rows] duration-500 ease-out-expo motion-reduce:transition-none ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="min-h-0 overflow-hidden">{children}</div>
      </div>
    </>
  );
}
