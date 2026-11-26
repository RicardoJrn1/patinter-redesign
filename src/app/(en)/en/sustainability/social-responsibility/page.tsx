import { SocialPage, socialMetadata } from "@/components/pages/SocialPage";

export const metadata = socialMetadata("en");

export default function Page() {
  return <SocialPage locale="en" />;
}
