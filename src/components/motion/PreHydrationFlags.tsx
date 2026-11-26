"use client";

import { useServerInsertedHTML } from "next/navigation";

// Flags that JS is available (so GSAP-revealed items can start hidden without a flash) and arms a
// safety net that shows everything if the app never hydrates. Must run before first paint.
const preHydration = `document.documentElement.setAttribute('data-js','');setTimeout(function(){document.documentElement.setAttribute('data-reveal-timeout','')},4500);`;

/**
 * Injects the pre-hydration script into <head> during the server render only.
 *
 * Rendering a plain <script> inside a component instead makes React 19.3+ log "Encountered a script
 * tag while rendering React component", because React never executes scripts it renders on the
 * client. useServerInsertedHTML emits it outside the React tree, so the browser runs it while
 * parsing <head> — before first paint and without depending on hydration. next/script's
 * beforeInteractive is not an option here: it defers inline code through Next's runtime, which lands
 * it after the body and would reintroduce the flash it exists to prevent.
 */
export function PreHydrationFlags() {
  useServerInsertedHTML(() => <script dangerouslySetInnerHTML={{ __html: preHydration }} />);
  return null;
}
