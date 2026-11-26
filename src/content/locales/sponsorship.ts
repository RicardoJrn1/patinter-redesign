import * as en from "@/content/en/patrocinios";
import * as pt from "@/content/patrocinios";
import type { Locale } from "@/lib/i18n";

/** The Sponsorships page's copy in each language: content/patrocinios.ts (Portuguese) and content/en/patrocinios.ts (English). */
export const sponsorshipCopy: Record<Locale, typeof pt> = { pt, en };
