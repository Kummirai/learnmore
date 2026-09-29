import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { getReadingPlan, getPlanSections, getAuthoredPlan } from "@/lib/reading-plans";
import { readingPlanMetadataFromSlug } from "@/lib/seo";
import BibleReadingReader from "@/components/reading/BibleReadingReader";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return readingPlanMetadataFromSlug(slug);
}

export default async function ReadingPlanReaderPage({ params }: Props) {
  const { slug } = await params;

  const authored = await getAuthoredPlan(slug);
  const plan = authored?.plan ?? getReadingPlan(slug);
  if (!plan) notFound();

  const sections = authored?.sections ?? getPlanSections(plan);
  const isBible = sections.some((s) => s.book);

  return (
    <>
      <PageHero
        title={plan.title}
        mobileTitle={plan.title.split(/\s+/).slice(0, 1).join(" ")}
        tagline={plan.tagline}
        description={
          isBible
            ? "Read the chapters of a section, mark them done, and keep your place — you take it right here inside the plan, and your progress stays with your club."
            : "A guided plan, day by day — verse, reading and reflection content you can work through at your own pace."
        }
        watermark={`${plan.days}d`}
        meta={[
          { label: plan.category, value: "" },
          { label: "Sections", value: String(sections.length) },
          { label: isBible ? "Chapters / section" : "Duration", value: isBible ? "5" : `${plan.days} days` },
        ]}
      />

      <section className="flex-1 px-4 py-12 bg-white">
        <div className="max-w-4xl mx-auto">
          <BibleReadingReader plan={plan} sections={sections} />
        </div>
      </section>
    </>
  );
}