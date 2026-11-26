import { PoliciesPage, policiesMetadata } from "@/components/pages/PoliciesPage";

export const metadata = policiesMetadata("en");

export default function Page() {
  return <PoliciesPage locale="en" />;
}
