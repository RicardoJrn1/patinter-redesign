import * as en from "@/content/en/a-patinter";
import * as pt from "@/content/a-patinter";
import type { Locale } from "@/lib/i18n";

/** The «A Patinter» / «About us» page's copy in each language: content/a-patinter.ts (Portuguese) and content/en/a-patinter.ts (English). */
export const aboutCopy: Record<Locale, typeof pt> = { pt, en };
