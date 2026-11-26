import { SponsorshipsPage, sponsorshipsMetadata } from "@/components/pages/SponsorshipsPage";

export const metadata = sponsorshipsMetadata("en");

export default function Page() {
  return <SponsorshipsPage locale="en" />;
}
