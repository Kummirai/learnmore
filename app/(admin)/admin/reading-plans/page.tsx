"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FaBookBookmark, FaPlus, FaTrash, FaXmark, FaPencil } from "react-icons/fa6";
import { AdminHeader } from "@/components/admin/ui";
import {
  READING_PLANS,
  READING_PLAN_CATEGORIES,
  type RelateReadingPlan,
  getPlanSections,
  type ReadingSection,
} from "@/lib/reading-plans";
import { getSupabase } from "@/lib/supabase";
import type { PubBlock } from "@/lib/editor/season";

type SectionDraft = {
  title: string;
  book: string;
  startCh: number;
  endCh: number;
  verseText: string;
  verseBy: string;
  blocks: PubBlock[];
};

type PlanDraft = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  section: string;
  days: number;
  gradient: [string, string];
  image: string;
  sections: SectionDraft[];
};

function toDraft(p: RelateReadingPlan): PlanDraft {
  const sections: SectionDraft[] = getPlanSections(p).map((s: ReadingSection) => ({
    title: s.title,
    book: s.book || "",
    startCh: s.startCh || 1,
    endCh: s.endCh || 5,
    verseText: s.verseText || "",
    verseBy: s.verseBy || "",
    blocks: s.blocks || [],
  }));
  return {
    slug: p.slug,
    title: p.title,
    tagline: p.tagline,
    description: p.description,
    category: p.category,
    section: p.section,
    days: p.days,
    gradient: p.gradient,
    image: p.image,
    sections,
  };
}

export default function AdminReadingPlansPage() {
  const [plans, setPlans] = useState<PlanDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    setPlans(READING_PLANS.map(toDraft));
    setLoading(false);
  }, []);

  async function loadAuthored() {
    const db = getSupabase();
    if (!db) return;
    try {
      const { data } = await db
        .from("reading_plans")
        .select("slug,title,tagline,description,category,section,days,gradient,image,status")
        .order("sort", { ascending: true });
      if (!data || !data.length) return;
      const local = (await Promise.all(
        (data as Array<Record<string, any>>).map(async (row) => {
          const base = READING_PLANS.find((p) => p.slug === row.slug);
          const { data: secs } = await db
            .from("plan_sections")
            .select("title,book,start_ch,end_ch,verse_text,verse_by,blocks,sort")
            .eq("plan_slug", row.slug)
            .order("sort", { ascending: true });
          const sections: SectionDraft[] =
            secs && secs.length
              ? (secs as Array<Record<string, any>>).map((s) => ({
                  title: s.title || "",
                  book: s.book || "",
                  startCh: s.start_ch ?? 1,
                  endCh: s.end_ch ?? 5,
                  verseText: s.verse_text || "",
                  verseBy: s.verse_by || "",
                  blocks: Array.isArray(s.blocks) ? (s.blocks as PubBlock[]) : [],
                }))
              : getPlanSections({
                  slug: row.slug,
                  title: row.title,
                  tagline: row.tagline || "",
                  description: row.description || "",
                  category: row.category || "Bible Reading",
                  section: row.section || "Whole Bible",
                  days: row.days ?? 5,
                  gradient: (Array.isArray(row.gradient) && row.gradient.length === 2
                    ? row.gradient
                    : ["#111827", "#1f2937"]) as [string, string],
                  image: row.image || "",
                }).map((s: ReadingSection) => ({
                  title: s.title,
                  book: s.book || "",
                  startCh: s.startCh || 1,
                  endCh: s.endCh || 5,
                  verseText: s.verseText || "",
                  verseBy: s.verseBy || "",
                  blocks: s.blocks || [],
                }));
          return {
            slug: row.slug,
            title: row.title,
            tagline: row.tagline || base?.tagline || "",
            description: row.description || base?.description || "",
            category: row.category || "Bible Reading",
            section: row.section || base?.section || "Whole Bible",
            days: row.days ?? base?.days ?? 5,
            gradient: (Array.isArray(row.gradient) && row.gradient.length === 2
              ? row.gradient
              : base?.gradient ?? ["#111827", "#1f2937"]) as [string, string],
            image: row.image || base?.image || "",
            sections,
          } satisfies PlanDraft;
        }),
      )) as PlanDraft[];
      setPlans(local);
    } catch {
      // fall back to the catalog
    }
  }

  useEffect(() => {
    void loadAuthored();
  }, []);

  async function remove(slug: string) {
    const name = plans.find((p) => p.slug === slug)?.title || slug;
    if (!confirm(`Delete "${name}"? This also removes its authored sections.`)) return;
    const db = getSupabase();
    setBusy(true);
    try {
      if (db) {
        await db.from("reading_plans").delete().eq("slug", slug);
        await db.from("plan_sections").delete().eq("plan_slug", slug);
        void loadAuthored();
      } else {
        setPlans((prev) => prev.filter((p) => p.slug !== slug));
      }
      setNotice("Reading plan deleted.");
    } catch (e: unknown) {
      setNotice(`Delete failed: ${e instanceof Error ? e.message : "unknown error"}`);
    } finally {
      setBusy(false);
    }
  }

  const categoryPlans = useMemo(
    () => (cat: string) => plans.filter((p) => p.category === cat),
    [plans],
  );

  return (
    <>
      <div className="mx-auto max-w-5xl px-4 pt-8 md:px-0">
        <AdminHeader
          eyebrow="Content"
          title="Reading Plans"
          sub="Create and manage plans across every category. Open any plan in the full-page editor to author daily chapters or topic days."
        />
      </div>

      <section className="flex-1 px-4 py-12 bg-white">
        <div className="max-w-5xl mx-auto">
          {notice && (
            <div className="mb-6 rounded-xl border border-gold-200 bg-gold-50 px-4 py-3 text-sm text-gold-800 flex items-center justify-between gap-4">
              <span>{notice}</span>
              <button onClick={() => setNotice(null)} aria-label="dismiss">
                <FaXmark />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-navy">All plans</h2>
            <Link
              href="/admin/reading-plans/new"
              className="inline-flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-bold text-white hover:bg-navy/90 transition-colors"
            >
              <FaPlus /> New plan
            </Link>
          </div>

          {loading ? (
            <p className="text-sm text-slate-gray">Loading plans…</p>
          ) : (
            READING_PLAN_CATEGORIES.map((cat) => {
              const list = categoryPlans(cat);
              return (
                <div key={cat} className="mb-10">
                  <h3 className="text-[11px] font-medium uppercase tracking-[0.2em] text-gray-400 mb-3">
                    {cat} ({list.length})
                  </h3>
                  {list.length === 0 ? (
                    <p className="text-sm text-gray-400">No plans in this category yet.</p>
                  ) : (
                    <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl">
                      {list.map((p) => (
                        <div key={p.slug} className="flex items-center gap-4 px-4 py-3">
                          <div
                            className="size-10 rounded-xl shrink-0 flex items-center justify-center text-white"
                            style={{ background: `linear-gradient(120deg, ${p.gradient[0]}, ${p.gradient[1]})` }}
                          >
                            <FaBookBookmark />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/admin/reading-plans/${p.slug}`}
                              className="text-sm font-bold text-navy hover:underline decoration-1 underline-offset-4"
                            >
                              {p.title}
                            </Link>
                            <p className="text-xs text-gray-400 truncate">
                              {p.section} · {p.days} days · {p.sections.length} sections
                            </p>
                          </div>
                          <Link
                            href={`/admin/reading-plans/${p.slug}`}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-alice-blue px-3 py-1.5 text-xs font-bold text-navy hover:bg-ice-blue transition-colors"
                          >
                            <FaPencil className="text-[11px]" /> Edit
                          </Link>
                          <Link
                            href={`/plans/${p.slug}`}
                            className="hidden sm:inline text-xs font-semibold text-slate-gray hover:text-cyan transition-colors"
                          >
                            View
                          </Link>
                          <button
                            onClick={() => remove(p.slug)}
                            disabled={busy}
                            className="text-sm text-gray-300 hover:text-red-500 transition-colors disabled:opacity-40"
                            aria-label={`delete ${p.title}`}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>
    </>
  );
}