// "Sobre nós > Sustentabilidade > Patrocínios" / "Company > Sustainability > Sponsorships": the official
// page (patinter.com/pt|en/gca/index.php?id=69) on the home page's stage. No opening band: the official
// page has no photograph of its own, so the label, the title and the lead open the form's own section,
// beside the form (SponsorshipSection.tsx). All copy lives in src/content/patrocinios.ts and
// src/content/en/patrocinios.ts.
import { PageShell, pageMetadata } from "@/components/pages/PageShell";
import { PageContact } from "@/components/sections/page/PageContact";
import { SponsorshipSection } from "@/components/sections/sustentabilidade/SponsorshipSection";
import { sponsorshipCopy } from "@/content/locales/sponsorship";
import type { Locale } from "@/lib/i18n";

export const sponsorshipsMetadata = (locale: Locale) => {
  const { sponsorshipOpening } = sponsorshipCopy[locale];
  return pageMetadata({ locale, page: "sponsorships", title: sponsorshipOpening.title, description: sponsorshipOpening.lead });
};

export function SponsorshipsPage({ locale }: { locale: Locale }) {
  return (
    <PageShell locale={locale} page="sponsorships">
      <SponsorshipSection locale={locale} />
      <PageContact locale={locale} {...sponsorshipCopy[locale].sponsorshipContact} />
    </PageShell>
  );
}
