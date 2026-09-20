"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  FaBookBookmark,
  FaFloppyDisk,
  FaPlus,
  FaTrash,
  FaXmark,
} from "react-icons/fa6";
import PageHero from "@/components/PageHero";
import {
  READING_PLANS,
  READING_PLAN_CATEGORIES,
  type RelateReadingPlan,
} from "@/lib/reading-plans";
import { getSupabase } from "@/lib/supabase";

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
};

const EMPTY: PlanDraft = {
  slug: "",
  title: "",
  tagline: "",
  description: "",
  category: "Bible Reading",
  section: "Whole Bible",
  days: 5,
  gradient: ["#0f766e", "#14532d"],
  image: "",
};

function toDraft(p: RelateReadingPlan): PlanDraft {
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
  };
}

export default function AdminReadingPlansPage() {
  const [plans, setPlans] = useState<PlanDraft[]>([]);
  const [editing, setEditing] = useState<PlanDraft | null>(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [connected, setConnected] = useState<boolean | null>(null);

  const supabaseReady = useMemo(() => Boolean(getSupabase()), []);

  useEffect(() => {
    setConnected(supabaseReady);
    setPlans(READING_PLANS.map(toDraft));
  }, [supabaseReady]);

  async function persist(draft: PlanDraft, isNew: boolean) {
    const db = getSupabase();
    if (!db) {
      setNotice("Supabase not configured — saved to local session only.");
      setPlans((prev) =>
        isNew ? [...prev, draft] : prev.map((p) => (p.slug === draft.slug ? draft : p)),
      );
      return;
    }
    setSaving(true);
    try {
      if (isNew) {
        await db.from("reading_plans").insert({
          slug: draft.slug,
          title: draft.title,
          tagline: draft.tagline,
          description: draft.description,
          category: draft.category,
          section: draft.section,
          days: draft.days,
          gradient: draft.gradient,
          image: draft.image,
        });
      } else {
        await db
          .from("reading_plans")
          .update({
            title: draft.title,
            tagline: draft.tagline,
            description: draft.description,
            category: draft.category,
            section: draft.section,
            days: draft.days,
            gradient: draft.gradient,
            image: draft.image,
          })
          .eq("slug", draft.slug);
      }
      setNotice(isNew ? "Reading plan created." : "Reading plan updated.");
      setPlans((prev) =>
        isNew ? [...prev, draft] : prev.map((p) => (p.slug === draft.slug ? draft : p)),
      );
      setEditing(null);
    } catch (e: unknown) {
      setNotice(`Save failed: ${e instanceof Error ? e.message : "unknown error"}`);
    } finally {
      setSaving(false);
    }
  }

  async function remove(slug: string) {
    const db = getSupabase();
    if (!db) {
      setPlans((prev) => prev.filter((p) => p.slug !== slug));
      setNotice("Supabase not configured — removed locally only.");
      return;
    }
    setSaving(true);
    try {
      await db.from("reading_plans").delete().eq("slug", slug);
      setPlans((prev) => prev.filter((p) => p.slug !== slug));
      setNotice("Reading plan deleted.");
    } catch (e: unknown) {
      setNotice(`Delete failed: ${e instanceof Error ? e.message : "unknown error"}`);
    } finally {
      setSaving(false);
    }
  }

  const categoryPlans = useMemo(
    () => (cat: string) => plans.filter((p) => p.category === cat),
    [plans],
  );

  return (
    <>
      <PageHero
        title={"Admin · Reading Plans"}
        tagline={"Create and manage plans across every category"}
        description={
          "Add new Bible Reading, Marriage, Wellness, Finance and Academic plans — they sync to the shared Supabase project when configured, and fall back to the local catalog otherwise."
        }
        watermark={"RF"}
        meta={[
          { label: "Plans", value: plans.length },
          { label: "Categories", value: READING_PLAN_CATEGORIES.length },
          { label: "Storage", value: connected ? "Supabase" : "Local demo" },
        ]}
      />

      <section className="flex-1 px-4 py-12 bg-white">
        <div className="max-w-5xl mx-auto">
          {notice && (
            <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 flex items-center justify-between gap-4">
              <span>{notice}</span>
              <button onClick={() => setNotice(null)} aria-label="dismiss">
                <FaXmark />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-navy">All plans</h2>
            <button
              onClick={() => setEditing({ ...EMPTY })}
              className="inline-flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-bold text-white hover:bg-navy/90 transition-colors"
            >
              <FaPlus /> New plan
            </button>
          </div>

          {READING_PLAN_CATEGORIES.map((cat) => {
            const list = categoryPlans(cat);
            return (
              <div key={cat} className="mb-10">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">
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
                            href={`/plans/${p.slug}`}
                            className="text-sm font-bold text-navy hover:underline decoration-1 underline-offset-4"
                          >
                            {p.title}
                          </Link>
                          <p className="text-xs text-gray-400 truncate">
                            {p.section} · {p.days} days · /plans/{p.slug}
                          </p>
                        </div>
                        <button
                          onClick={() => setEditing(toDraft(p))}
                          className="text-xs font-semibold text-navy hover:text-cyan transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => remove(p.slug)}
                          className="text-sm text-gray-300 hover:text-red-500 transition-colors"
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
          })}
        </div>
      </section>

      {editing && (
        <PlanEditor
          draft={editing}
          busy={saving}
          onCancel={() => setEditing(null)}
          onSave={(d) => persist(d, !plans.some((x) => x.slug === d.slug))}
        />
      )}
    </>
  );
}

function PlanEditor({
  draft,
  busy,
  onCancel,
  onSave,
}: {
  draft: PlanDraft;
  busy: boolean;
  onCancel: () => void;
  onSave: (d: PlanDraft) => void;
}) {
  const [d, setD] = useState(draft);
  const isNew = !d.slug;

  function field(f: keyof PlanDraft, v: string | number | [string, string]) {
    setD((prev) => ({ ...prev, [f]: v }));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-navy/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-black text-navy">{isNew ? "New reading plan" : `Edit ${d.title}`}</h3>
          <button onClick={onCancel} aria-label="close">
            <FaXmark className="text-slate-gray hover:text-navy transition-colors" />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Title" value={d.title} onChange={(v) => field("title", v)} />
          <Field label="Days" type="number" value={String(d.days)} onChange={(v) => field("days", Number(v) || 1)} />
          <Field label="Tagline" value={d.tagline} onChange={(v) => field("tagline", v)} />
          <Field label="Section" value={d.section} onChange={(v) => field("section", v)} />
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Category</label>
            <select
              value={d.category}
              onChange={(e) => field("category", e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-navy focus:outline-none focus:border-cyan"
            >
              {READING_PLAN_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <Field label="Slug" value={d.slug} disabled={!isNew} onChange={(v) => field("slug", v.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-"))} />
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
            <textarea
              value={d.description}
              onChange={(e) => field("description", e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-navy focus:outline-none focus:border-cyan"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-navy hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(d)}
            disabled={busy || !d.title || !d.slug}
            className="inline-flex items-center gap-2 rounded-xl bg-navy px-5 py-2.5 text-sm font-bold text-white hover:bg-navy/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <FaFloppyDisk /> {busy ? "Saving…" : "Save plan"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  type = "text",
  disabled,
  onChange,
}: {
  label: string;
  value: string;
  type?: string;
  disabled?: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-navy focus:outline-none focus:border-cyan disabled:bg-gray-50 disabled:text-gray-400"
      />
    </div>
  );
}