"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FaBookBookmark, FaPlus, FaTrash, FaXmark, FaPencil } from "react-icons/fa6";
import { AdminHeader } from "@/components/admin/ui";
import {
  READING_PLANS,
  READING_PLAN_CATEGORIES,
  getPlanSections,
  fetchAdminReadingPlans,
} from "@/lib/reading-plans";

type ListItem = {
  slug: string;
  title: string;
  section: string;
  days: number;
  category: string;
  gradient: [string, string];
  status: "published" | "draft";
  source: "catalog" | "db";
  sectionsCount: number;
};

function catalogItems(): ListItem[] {
  return READING_PLANS.map((p) => ({
    slug: p.slug,
    title: p.title,
    section: p.section,
    days: p.days,
    category: p.category,
    gradient: p.gradient,
    status: "published" as const,
    source: "catalog" as const,
    sectionsCount: getPlanSections(p).length,
  }));
}

export default function AdminReadingPlansPage() {
  const [plans, setPlans] = useState<ListItem[]>(catalogItems);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  async function loadPlans() {
    try {
      const rows = await fetchAdminReadingPlans();
      setPlans(
        rows.map((row) => ({
          slug: row.slug,
          title: row.title,
          section: row.section,
          days: row.days,
          category: row.category,
          gradient: row.gradient,
          status: row.status === "draft" ? "draft" : "published",
          source: row.source === "db" ? "db" : "catalog",
          sectionsCount: row.sectionsCount ?? row.sections?.length ?? 0,
        })),
      );
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Couldn't reach the API — showing the built-in catalog.");
    }
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (cancelled) return;
      await loadPlans();
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function remove(slug: string) {
    const name = plans.find((p) => p.slug === slug)?.title || slug;
    if (!confirm(`Delete "${name}"? This removes the saved plan and its sections.`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/reading-plans/${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setNotice(typeof json?.error === "string" ? json.error : "Delete failed.");
        return;
      }
      setNotice("Reading plan deleted.");
      await loadPlans();
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
                              {p.section} · {p.days} days · {p.sectionsCount} sections
                              {p.status === "draft" ? (
                                <span className="ml-1.5 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">DRAFT</span>
                              ) : null}
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