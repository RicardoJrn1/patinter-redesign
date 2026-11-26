// Single place where GSAP and its plugins are registered (client side only).
"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
  gsap.defaults({ ease: "expo.out", duration: 1.1 });
  // on phones the address bar showing/hiding resizes the viewport constantly; without this every
  // one of those fires a refresh, which tears down and rebuilds any pinned section mid-scroll
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/** True when the visitor asked the OS to reduce motion. */
export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
