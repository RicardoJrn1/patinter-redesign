import type { ComponentProps, ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { RollText } from "./RollText";

type AnchorProps = ComponentProps<"a"> & { children: ReactNode };

/** Primary call to action: ink pill, label rolls on hover, arrow drifts, background warms to red. */
export function ButtonLink({ children, className = "", size = "md", ...props }: AnchorProps & { size?: "sm" | "md" }) {
  const sizing = size === "sm" ? "h-10 pl-4 pr-3 text-[0.8125rem] gap-2.5" : "h-[3.25rem] pl-6 pr-4 text-[0.9375rem] gap-4";
  return (
    <a
      {...props}
      className={`group inline-flex shrink-0 items-center rounded-full bg-ink font-medium tracking-[-0.01em] text-paper transition-colors duration-500 ease-out-expo hover:bg-red-deep focus-visible:bg-red-deep ${sizing} ${className}`}
    >
      <RollText>{children}</RollText>
      <span
        className={`grid place-items-center overflow-hidden rounded-full bg-paper/12 ${size === "sm" ? "size-6" : "size-8"}`}
        aria-hidden="true"
      >
        <ArrowUpRight
          className={`transition-transform duration-500 ease-out-expo group-hover:translate-x-[2px] group-hover:-translate-y-[2px] motion-reduce:transition-none ${size === "sm" ? "size-3.5" : "size-4"}`}
          strokeWidth={1.75}
        />
      </span>
    </a>
  );
}

/** Secondary link: the text links' hover (the brand's red-and-yellow line, globals.css .link-line)
 *  and a drifting arrow. */
export function ArrowLink({ children, className = "", ...props }: AnchorProps) {
  return (
    <a {...props} className={`group inline-flex items-center gap-2.5 text-[0.9375rem] font-medium tracking-[-0.01em] ${className}`}>
      <span className="link-line">{children}</span>
      <ArrowRight
        aria-hidden="true"
        className="size-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-1 motion-reduce:transition-none"
        strokeWidth={1.75}
      />
    </a>
  );
}
