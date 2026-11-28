import type { Metadata } from "next";
import NewsList from "@/components/NewsList";

export const metadata: Metadata = {
  title: "News",
  description:
    "Season dates, new programmes and stories from Relate World clubs — Care & Connect Day, education, reading guides, prayer, sports and the store.",
  alternates: { canonical: "/news" },
};

export default function NewsPage() {
  return <NewsList />;
}
