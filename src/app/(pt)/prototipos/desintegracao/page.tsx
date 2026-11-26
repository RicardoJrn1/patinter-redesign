import type { Metadata } from "next";
import { DisintegrationLab } from "@/components/prototypes/disintegration/DisintegrationLab";

// Isolated test page for the disintegrating symbol. Not part of the site: kept out of search engines.
export const metadata: Metadata = {
  title: "Protótipo — desintegração do símbolo",
  robots: { index: false, follow: false },
};

export default function DisintegrationPrototypePage() {
  return (
    <>
      {/* the site reserves a scrollbar gutter on <html> (globals.css), which would show as a strip of the
          paper background beside this black page; this rule only exists while this page is mounted */}
      <style>{"html{background:#000}"}</style>
      <DisintegrationLab />
    </>
  );
}
