import type { Metadata } from "next";
import { LogoMorphLab } from "@/components/prototypes/logo-morph/LogoMorphLab";

// Isolated test page for the logo morph. Not part of the site: kept out of search engines.
export const metadata: Metadata = {
  title: "Protótipo — logo morphing",
  robots: { index: false, follow: false },
};

export default function LogoMorphPrototypePage() {
  return (
    <>
      {/* the site reserves a scrollbar gutter on <html> (globals.css), which would show as a strip of the
          paper background beside this black page; this rule only exists while this page is mounted */}
      <style>{"html{background:#000}"}</style>
      <LogoMorphLab />
    </>
  );
}
