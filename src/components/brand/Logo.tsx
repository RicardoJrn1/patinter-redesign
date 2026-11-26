import Image from "next/image";
import logo from "@/assets/brand/patinter-logo.png";

/**
 * Official Patinter logo (patinter.com/temas/patinter/images/logo_topo.png, 230 × 85 px).
 * Raster artwork: it stays sharp up to about its native size, so the large opening logo in the hero
 * is held close to 85 px high until a larger or vector file replaces this asset.
 *
 * `decorative` drops the alt text when the name is already given next to it (the hero's h1 carries
 * it as screen-reader text). `preload` is for the opening logo, which is the first thing painted.
 */
export function Logo({
  className = "",
  height = 30,
  decorative = false,
  preload = false,
}: {
  className?: string;
  height?: number;
  decorative?: boolean;
  preload?: boolean;
}) {
  const width = Math.round((logo.width / logo.height) * height);
  return (
    <Image
      src={logo}
      alt={decorative ? "" : "Patinter"}
      width={width}
      height={height}
      unoptimized
      preload={preload}
      className={className}
      style={{ width, height }}
    />
  );
}
