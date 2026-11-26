import { CommitmentsPage, commitmentsMetadata } from "@/components/pages/CommitmentsPage";

export const metadata = commitmentsMetadata("en");

export default function Page() {
  return <CommitmentsPage locale="en" />;
}
