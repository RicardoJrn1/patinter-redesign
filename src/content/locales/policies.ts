import * as en from "@/content/en/politicas";
import * as pt from "@/content/politicas";
import type { Locale } from "@/lib/i18n";

/** The Management Systems and Policies page's copy in each language: content/politicas.ts (Portuguese) and content/en/politicas.ts (English). */
export const policiesCopy: Record<Locale, typeof pt> = { pt, en };
