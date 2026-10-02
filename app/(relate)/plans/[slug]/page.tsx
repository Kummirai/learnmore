import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { getReadingPlan, getPlanSections, getAuthoredPlan } from "@/lib/reading-plans";
import { readingPlanMetadataFromSlug } from "@/lib/seo";
import BibleReadingReader from "@/components/reading/BibleReadingReader";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return readingPlanMetadataFromSlug(slug);
}

export default async function ReadingPlanReaderPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;

  const authored = await getAuthoredPlan(slug);
  const plan = authored?.plan ?? getReadingPlan(slug);
  if (!plan) notFound();

  const sections = authored?.sections ?? getPlanSections(plan);

  return (
    <>
      <Navbar />

      <section className="flex-1 px-4 py-12 bg-white">
        <div className="max-w-4xl mx-auto">
          <BibleReadingReader plan={plan} sections={sections} autoStart={sp?.start === "1"} />
        </div>
      </section>
    </>
  );
}