"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  FaBookBookmark,
  FaFloppyDisk,
  FaPlus,
  FaTrash,
  FaXmark,
  FaChevronDown,
} from "react-icons/fa6";
import PageHero from "@/components/PageHero";
import BlockEditor from "@/components/admin/BlockEditor";
import {
  READING_PLANS,
  READING_PLAN_CATEGORIES,
  type RelateReadingPlan,
  getPlanSections,
  type ReadingSection,
} from "@/lib/reading-plans";
import { getSupabase } from "@/lib/supabase";
import { BLOCK_TYPES } from "@/lib/editor/catalog";
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

const EMPTY_SECTION = (): SectionDraft => ({
  title: "",
  book: "",
  startCh: 1,
  endCh: 5,
  verseText: "",
  verseBy: "",
  blocks: [],
});

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
  sections: Array.from({ length: 5 }, EMPTY_SECTION),
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

function blankBlock(type: string): PubBlock {
  const base: PubBlock = { type: type as PubBlock["type"] };
  if (type === "paragraph" || type === "heading" || type === "quote") base.text = "";
  if (type === "quote") base.by = "";
  if (type === "image") {
    base.uri = "";
    base.caption = "";
  }
  if (type === "list" || type === "checklist") {
    base.title = "";
    base.items = [];
  }
  if (type === "quiz") {
    base.question = "";
    base.options = [];
    base.correctIndex = 0;
    base.explain = "";
  }
  if (type === "reflection") {
    base.prompt = "";
    base.placeholder = "";
  }
  if (type === "pray") {
    base.title = "";
    base.items = [];
  }
  return base;
}

export default function AdminReadingPlansPage() {
  const [plans, setPlans] = useState<PlanDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PlanDraft | null>(null);
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
      if (data && data.length) {
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
                : getPlanSections(
                    {
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
                    },
                  ).map((s: ReadingSection) => ({
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
      }
    } catch {
      // fall back to the catalog
    }
  }

  useEffect(() => {
    void loadAuthored();
  }, []);

  async function persist(draft: PlanDraft, isNew: boolean) {
    const db = getSupabase();
    setBusy(true);
    try {
      if (db) {
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
            status: "published",
            sort: 0,
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

        // Replace the plan's sections wholesale.
        await db.from("plan_sections").delete().eq("plan_slug", draft.slug);
        const rows = draft.sections
          .filter((s) => s.title || s.book || s.blocks.length || s.verseText)
          .map((s, i) => ({
            plan_slug: draft.slug,
            title: s.title || `Day ${i + 1}`,
            book: s.book || null,
            start_ch: s.startCh || null,
            end_ch: s.endCh || null,
            verse_text: s.verseText || null,
            verse_by: s.verseBy || null,
            blocks: s.blocks,
            sort: i,
          }));
        if (rows.length) await db.from("plan_sections").insert(rows);
        void loadAuthored();
        setNotice(isNew ? "Reading plan created." : "Reading plan updated.");
      } else {
        setPlans((prev) =>
          isNew ? [...prev, draft] : prev.map((p) => (p.slug === draft.slug ? draft : p)),
        );
        setNotice("Supabase not configured — saved to local session only.");
      }
      setEditing(null);
    } catch (e: unknown) {
      setNotice(`Save failed: ${e instanceof Error ? e.message : "unknown error"}`);
    } finally {
      setBusy(false);
    }
  }

  async function remove(slug: string) {
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
      <PageHero
        title={"Admin · Reading Plans"}
        tagline={"Create and manage plans across every category"}
        description={
          "Author full reading plans — Bible chapters per day with commentary, or topic plans with verses and reading blocks — synced to the shared Supabase project when configured."
        }
        watermark={"RF"}
        meta={[
          { label: "Plans", value: plans.length },
          { label: "Categories", value: READING_PLAN_CATEGORIES.length },
          { label: "Storage", value: "Supabase-ready" },
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

          {loading ? (
            <p className="text-sm text-slate-gray">Loading plans…</p>
          ) : (
            READING_PLAN_CATEGORIES.map((cat) => {
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
                              {p.section} · {p.days} days · {p.sections.length} sections
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
            })
          )}
        </div>
      </section>

      {editing && (
        <PlanEditor
          draft={editing}
          busy={busy}
          onCancel={() => setEditing(null)}
          onSave={(d) => persist(d, !READING_PLANS.some((x) => x.slug === d.slug))}
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
  const isBible = d.category === "Bible Reading";

  function field<K extends keyof PlanDraft>(f: K, v: PlanDraft[K]) {
    setD((prev) => ({ ...prev, [f]: v }));
  }

  function setSection(i: number, patch: Partial<SectionDraft>) {
    setD((prev) => ({
      ...prev,
      sections: prev.sections.map((s, j) => (j === i ? { ...s, ...patch } : s)),
    }));
  }

  function setSectionBlocks(i: number, blocks: PubBlock[]) {
    setD((prev) => ({
      ...prev,
      sections: prev.sections.map((s, j) => (j === i ? { ...s, blocks } : s)),
    }));
  }

  function syncDays(days: number) {
    const n = Math.max(1, Math.min(30, days));
    setD((prev) => {
      const sections = [...prev.sections];
      while (sections.length < n) sections.push(EMPTY_SECTION());
      return { ...prev, days: n, sections: sections.slice(0, n) };
    });
  }

  function moveBlock(i: number, bi: number, dir: -1 | 1) {
    setSectionBlocks(i, moveIn(d.sections[i].blocks, bi, dir));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-navy/60 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-4xl rounded-3xl bg-white p-6 shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5 sticky top-0 bg-white z-10 pb-3">
          <h3 className="text-xl font-black text-navy">{isNew ? "New reading plan" : `Edit ${d.title}`}</h3>
          <button onClick={onCancel} aria-label="close">
            <FaXmark className="text-slate-gray hover:text-navy transition-colors" />
          </button>
        </div>

        {/* ── Metadata ─────────────────────────────────────────────── */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Title" value={d.title} onChange={(v) => field("title", v)} />
          <Field
            label="Duration (days)"
            type="number"
            value={String(d.days)}
            onChange={(v) => syncDays(Number(v) || 1)}
          />
          <Field label="Tagline" value={d.tagline} onChange={(v) => field("tagline", v)} />
          <Field label="Section label" value={d.section} onChange={(v) => field("section", v)} />
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
          <Field
            label="Slug"
            value={d.slug}
            disabled={!isNew}
            onChange={(v) => field("slug", v.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
          />
          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
            <textarea
              value={d.description}
              onChange={(e) => field("description", e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-navy focus:outline-none focus:border-cyan"
            />
          </div>
        </div>

        {/* ── Authoring per section/day ───────────────────────────── */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="font-black text-navy">Days &amp; reading content</h4>
              <p className="text-xs text-slate-gray">
                {isBible
                  ? "Set the book + chapters read each day, add a verse and commentary blocks."
                  : "Author each day: verse plus reading material — paragraphs, quotes, images, prayers, quizzes."}
              </p>
            </div>
            <button
              onClick={() => {
                const { sections } = { ...d };
                sections.push(EMPTY_SECTION());
                setD((prev) => ({ ...prev, days: sections.length, sections }));
              }}
              className="inline-flex items-center gap-1.5 rounded-full bg-navy px-3 py-1.5 text-xs font-bold text-white hover:bg-navy/90 transition-colors"
            >
              <FaPlus /> Add day
            </button>
          </div>

          <div className="space-y-4">
            {d.sections.map((s, i) => (
              <details key={i} open={d.sections.length <= 7} className="group rounded-2xl border border-gray-200 overflow-hidden">
                <summary className="flex items-center justify-between gap-3 bg-alice-blue/50 px-4 py-3 cursor-pointer select-none">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-navy truncate">{s.title || `${isBible ? "Section" : "Day"} ${i + 1}`}</p>
                      {isBible ? (
                        <p className="text-xs text-slate-gray">
                          {s.book || "—"} · Ch {s.startCh}–{s.endCh}
                          {s.verseBy ? ` · ${s.verseBy}` : ""}
                          {s.blocks.length ? ` · ${s.blocks.length} blocks` : ""}
                        </p>
                      ) : (
                        <p className="text-xs text-slate-gray">
                          {s.verseBy || s.blocks.length ? `${s.blocks.length} blocks${s.verseBy ? ` · ${s.verseBy}` : ""}` : "Not started"}
                        </p>
                      )}
                    </div>
                  </div>
                  <FaChevronDown className="shrink-0 text-slate-gray group-open:rotate-180 transition-transform" />
                </summary>

                <div className="p-4 space-y-4 border-t border-gray-100">
                  {/* Section identity */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <Field label="Title" value={s.title} onChange={(v) => setSection(i, { title: v })} />
                    {isBible ? (
                      <>
                        <Field label="Book" value={s.book} onChange={(v) => setSection(i, { book: v })} placeholder="e.g. Mark" />
                        <div className="grid grid-cols-2 gap-3">
                          <Field
                            label="Start ch"
                            type="number"
                            value={String(s.startCh)}
                            onChange={(v) => setSection(i, { startCh: Number(v) || 1 })}
                          />
                          <Field
                            label="End ch"
                            type="number"
                            value={String(s.endCh)}
                            onChange={(v) => setSection(i, { endCh: Number(v) || s.startCh })}
                          />
                        </div>
                      </>
                    ) : null}
                  </div>

                  {/* Verse */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Field
                      label="Today's verse"
                      value={s.verseText}
                      onChange={(v) => setSection(i, { verseText: v })}
                      placeholder="For God so loved the world…"
                    />
                    <Field
                      label="Verse reference"
                      value={s.verseBy}
                      onChange={(v) => setSection(i, { verseBy: v })}
                      placeholder="John 3:16"
                    />
                  </div>

                  {/* Content blocks */}
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                        {isBible ? "Commentary & notes" : "Reading material"}
                      </p>
                      <div className="flex items-center gap-1.5 ml-auto">
                        <AddBlock onAdd={(t) => setSectionBlocks(i, [...s.blocks, blankBlock(t)])} />
                      </div>
                    </div>
                    {s.blocks.length === 0 ? (
                      <p className="text-sm text-gray-400 rounded-xl border border-dashed border-gray-200 px-4 py-6 text-center">
                        Add verses, quotes, images, lists, prayers or quizzes.
                      </p>
                    ) : (
                      <div className="space-y-2.5">
                        {s.blocks.map((b, bi) => (
                          <div key={bi} className="relative">
                            <BlockEditor
                              block={b}
                              onChange={(nb) => setSectionBlocks(i, s.blocks.map((x, j) => (j === bi ? nb : x)))}
                              onRemove={() => setSectionBlocks(i, s.blocks.filter((_, j) => j !== bi))}
                            />
                            <div className="absolute -top-2 right-3 flex gap-1">
                              <MoveBtn disabled={bi === 0} onClick={() => moveBlock(i, bi, -1)}>↑</MoveBtn>
                              <MoveBtn disabled={bi === s.blocks.length - 1} onClick={() => moveBlock(i, bi, 1)}>↓</MoveBtn>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {d.sections.length > 1 && (
                    <div className="flex justify-end">
                      <button
                        onClick={() =>
                          setD((prev) => ({
                            ...prev,
                            days: Math.max(1, prev.days - 1),
                            sections: prev.sections.filter((_, j) => j !== i),
                          }))
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors"
                      >
                        <FaTrash /> Remove day
                      </button>
                    </div>
                  )}
                </div>
              </details>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 sticky bottom-0 bg-white pt-3 border-t border-gray-100">
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

function AddBlock({ onAdd }: { onAdd: (type: string) => void }) {
  const [type, setType] = useState("paragraph");
  return (
    <div className="flex items-center gap-1.5">
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-700 focus:outline-none"
      >
        {BLOCK_TYPES.map((b) => (
          <option key={b.type} value={b.type}>{b.label}</option>
        ))}
      </select>
      <button
        onClick={() => onAdd(type)}
        className="inline-flex items-center gap-1 rounded-lg bg-cyan px-2.5 py-1 text-xs font-bold text-navy hover:bg-cyan-dark transition-colors"
      >
        <FaPlus /> Add
      </button>
    </div>
  );
}

function MoveBtn({ children, disabled, onClick }: { children: React.ReactNode; disabled?: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded-lg bg-white px-2 py-0.5 text-xs font-bold text-slate-gray shadow-sm ring-1 ring-gray-200 transition hover:bg-alice-blue disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function moveIn<T>(arr: T[], i: number, dir: -1 | 1): T[] {
  const next = [...arr];
  const j = i + dir;
  if (j < 0 || j >= next.length) return next;
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

function Field({
  label,
  value,
  type = "text",
  disabled,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  type?: string;
  disabled?: boolean;
  placeholder?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-navy focus:outline-none focus:border-cyan disabled:bg-gray-50 disabled:text-gray-400"
      />
    </div>
  );
}