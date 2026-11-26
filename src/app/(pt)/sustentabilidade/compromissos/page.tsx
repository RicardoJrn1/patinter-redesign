import { CommitmentsPage, commitmentsMetadata } from "@/components/pages/CommitmentsPage";

export const metadata = commitmentsMetadata("pt");

export default function Page() {
  return <CommitmentsPage locale="pt" />;
}
