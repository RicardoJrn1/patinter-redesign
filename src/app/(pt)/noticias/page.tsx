import { NewsPage, newsMetadata } from "@/components/pages/NewsPage";

export const metadata = newsMetadata("pt");

export default function Page() {
  return <NewsPage locale="pt" />;
}
