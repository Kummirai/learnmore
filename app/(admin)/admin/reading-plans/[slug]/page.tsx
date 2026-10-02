"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ReadingPlanEditor from "@/components/admin/ReadingPlanEditor";
import { Button } from "@/components/admin/ui";
import { fetchAdminReadingPlan, getReadingPlan, getPlanSections } from "@/lib/reading-plans";

export default function AdminReadingPlanEditPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
<section
  className="flex-1 px-4 py-10 md:py-14"
  style={{ background: "linear-gradient(115deg, #f5f8fb 0%, #eff5f9 60%, #f5f8fb 100%)" }}
>
  <div className="max-w-7xl mx-auto">
    <EditBody params={params} />
  </div>
</section>
  );
}

function EditBody({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string | null>(null);
  const [initial, setInitial] = useState<Record<string, any> | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { slug: planSlug } = await params;
      if (cancelled) return;
      setSlug(planSlug);
      try {
        const doc = await fetchAdminReadingPlan(planSlug);
        if (cancelled) return;
        if (doc) {
          setInitial(buildInitial(doc, doc.sections ?? [], doc.status));
          return;
        }
        const catalog = getReadingPlan(planSlug);
        if (!cancelled) {
          if (catalog) {
            setInitial(buildInitial(catalog, getPlanSections(catalog)));
          } else {
            setError("No such plan exists in the catalog or database.");
          }
        }
      } catch {
        if (!cancelled) setError("Couldn't load this plan.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [params]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.2em] text-cyan">Reading plans</p>
          <h1 className="truncate text-xl md:text-2xl font-black tracking-tight text-navy">
            {initial ? (initial.slug ? "Edit plan" : "Resolve plan") : "Loading…"}
          </h1>
          <p className="mt-0.5 truncate text-sm text-slate-gray">{slug}</p>
        </div>
        <Link
          href="/admin/reading-plans"
          className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-alice-blue"
        >
          Back to list
        </Link>
      </div>

      {error ? (
        <div className="rounded-2xl bg-white p-8 text-center shadow-xl">
          <p className="font-bold text-navy">{error}</p>
          <Button className="mt-4" onClick={() => window.history.back()}>
            Go back
          </Button>
        </div>
      ) : initial ? (
        <ReadingPlanEditor initial={initial} />
      ) : (
        <div className="rounded-2xl bg-white p-8 text-center text-sm text-slate-gray shadow-xl">
          Loading plan…
        </div>
      )}
    </div>
  );
}

function buildInitial(
  plan: { slug: string; title: string; tagline?: string; description?: string; category?: string; section?: string; days?: number; gradient?: [string, string]; image?: string },
  sections: Array<Record<string, any>>,
  status = "draft",
) {
  return {
    slug: plan.slug,
    title: plan.title,
    tagline: plan.tagline ?? "",
    description: plan.description ?? "",
    category: plan.category ?? "Bible Reading",
    section: plan.section ?? "",
    days: plan.days ?? 5,
    gradient: plan.gradient ?? ["#0f766e", "#14532d"],
    image: plan.image ?? "",
    status,
    sections: sections.map((s) => ({ ...s })),
  };
}