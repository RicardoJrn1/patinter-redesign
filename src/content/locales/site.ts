import * as en from "@/content/en/site";
import * as pt from "@/content/site";
import type { Locale } from "@/lib/i18n";

/** The site-wide copy (menu, home page, footer) in each language: content/site.ts (Portuguese) and content/en/site.ts (English). */
export const siteCopy: Record<Locale, typeof pt> = { pt, en };
