import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import { getReadingPlan, getPlanSections } from "@/lib/reading-plans";
import BibleReadingReader from "@/components/reading/BibleReadingReader";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ReadingPlanReaderPage({ params }: Props) {
  const { slug } = await params;
  const plan = getReadingPlan(slug);
  if (!plan) notFound();

  const sections = getPlanSections(plan);

  return (
    <>
      <PageHero
        title={plan.title}
        tagline={plan.tagline}
        description={
          "Read five chapters of a section, mark them done, and the inline Bible Quiz for that section unlocks — you take it right here inside the plan. Your scored attempts land on your club's own top-5 board."
        }
        watermark={`${plan.days}d`}
        meta={[
          { label: plan.category, value: "" },
          { label: "Sections", value: String(sections.length) },
          { label: "Chapters / section", value: "5" },
        ]}
      />

      <section className="flex-1 px-4 py-12 bg-white">
        <div className="max-w-4xl mx-auto">
          <BibleReadingReader plan={plan} sections={sections} accent="#065f46" />
        </div>
      </section>
    </>
  );
}
