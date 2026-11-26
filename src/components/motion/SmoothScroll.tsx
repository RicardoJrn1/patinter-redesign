"use client";

// Lenis smooth scrolling driven by GSAP's ticker, so ScrollTrigger and Lenis share one clock and
// never fight. Lenis honours prefers-reduced-motion by itself (1:1 scrolling, instant scrollTo).
import { createContext, useContext, useEffect, useRef, type ReactNode, type RefObject } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const LenisContext = createContext<RefObject<Lenis | null>>({ current: null });

/** Ref to the page's Lenis instance (read `.current` in handlers/effects; null before mount). */
export function useLenis() {
  return useContext(LenisContext);
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenis = useRef<Lenis | null>(null);

  useEffect(() => {
    // Strict Mode remounts reset <html> attributes that JSX does not manage: keep the JS flag on
    document.documentElement.setAttribute("data-js", "");

    const instance = new Lenis({
      autoRaf: false,
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      stopInertiaOnNavigate: true,
    });

    // In-page links: glide to the target below the fixed header, keep the URL hash, and move focus
    // to the section so keyboard and screen-reader users land where the page scrolled to.
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      const hash = link?.getAttribute("href");
      if (!link || !hash || hash === "#") return;
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!target) return;
      event.preventDefault();
      // No offset: Lenis already stops short by <html>'s scroll-padding-top (globals.css: the header's
      // height plus a breath), the same place the browser's own jump lands without JS.
      // A pinned section (the home's hero) is fixed or parked at the end of its pin while pinned, so
      // its own box is not where it starts: aim at its pin spacer, which is.
      const anchor = target.parentElement?.classList.contains("pin-spacer") ? target.parentElement : target;
      instance.scrollTo(anchor, {
        onComplete: () => {
          if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
        },
      });
      history.pushState(null, "", hash);
    };
    document.addEventListener("click", onClick);
    const offScroll = instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    lenis.current = instance;

    // layout can still move after fonts swap in: re-measure every trigger once they are ready
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      document.removeEventListener("click", onClick);
      offScroll();
      gsap.ticker.remove(tick);
      instance.destroy();
      lenis.current = null;
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
