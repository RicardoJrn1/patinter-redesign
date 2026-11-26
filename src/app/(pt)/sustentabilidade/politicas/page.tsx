import { PoliciesPage, policiesMetadata } from "@/components/pages/PoliciesPage";

export const metadata = policiesMetadata("pt");

export default function Page() {
  return <PoliciesPage locale="pt" />;
}
