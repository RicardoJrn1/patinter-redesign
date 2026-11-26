import * as en from "@/content/en/media";
import * as pt from "@/content/media";
import type { Locale } from "@/lib/i18n";

/** The news archive (Media) in each language: content/media.ts (Portuguese) and content/en/media.ts (English). */
export const mediaCopy: Record<Locale, typeof pt> = { pt, en };
