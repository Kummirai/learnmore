"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FaBookOpen, FaPlus, FaXmark } from "react-icons/fa6";
import { Badge, Button, Card, Field, Input, Select, TextArea } from "@/components/admin/ui";
import BlockEditor from "./BlockEditor";
import ReadEditor from "./ReadEditor";
import { DayPreview, DayPreviewModal } from "./ReadPreview";
import type { DayPreviewData } from "./ReadPreview";
import { emptyReading, readingHasContent } from "@/lib/editor/season";
import type { PubBlock, ReadingStructure } from "@/lib/editor/season";
import { READING_PLAN_CATEGORIES } from "@/lib/reading-plans";
import { BLOCK_TYPES } from "@/lib/editor/catalog";
import { getSupabase } from "@/lib/supabase";

type DayDraft = {
  title: string;
  book: string;
  startCh: number;
  endCh: number;
  verseText: string;
  verseBy: string;
  blocks: PubBlock[];
  reading?: ReadingStructure;
};

type Draft = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  section: string;
  days: number;
  gradient: [string, string];
  image: string;
  status: string;
  sections: DayDraft[];
};

function emptySection(): DayDraft {
  return { title: "", book: "", startCh: 1, endCh: 5, verseText: "", verseBy: "", blocks: [], reading: undefined };
}

function blankDraft(): Draft {
  return {
    slug: "",
    title: "",
    tagline: "",
    description: "",
    category: "Bible Reading",
    section: "Whole Bible",
    days: 5,
    gradient: ["#0f766e", "#14532d"],
    image: "",
    status: "draft",
    sections: Array.from({ length: 5 }, emptySection),
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

function hydrateSection(raw: Record<string, any>): DayDraft {
  const copies = Array.isArray(raw.blocks) ? (raw.blocks as PubBlock[]).map((b) => ({ ...b })) : ([] as PubBlock[]);
  const readingBlock = copies.find((b) => b?.type === "reading");
  const ch = (n: unknown, fallback: number) => (typeof n === "number" ? n : fallback);
  const start = ch(raw.start_ch ?? raw.startCh, 1);
  return {
    title: raw.title || "",
    book: raw.book || "",
    startCh: start,
    endCh: ch(raw.end_ch ?? raw.endCh, start),
    verseText: raw.verse_text || raw.verseText || "",
    verseBy: raw.verse_by || raw.verseBy || "",
    blocks: copies.filter((b) => b?.type !== "reading"),
    reading: readingBlock?.structure || undefined,
  };
}

function blocksForPayload(day: DayDraft): PubBlock[] {
  const blocks = [...day.blocks];
  if (day.reading && readingHasContent(day.reading)) {
    blocks.unshift({ type: "reading", structure: day.reading });
  }
  return blocks;
}

export default function ReadingPlanEditor({
  initial,
}: {
  initial?: Record<string, any> | null;
}) {
  const router = useRouter();
  const isEdit = !!initial;
  const [draft, setDraft] = useState<Draft>(() => {
    if (!initial) return blankDraft();
    const d = blankDraft();
    d.slug = initial.slug || "";
    d.title = initial.title || "";
    d.tagline = initial.tagline || "";
    d.description = initial.description || "";
    d.category = initial.category || "Bible Reading";
    d.section = initial.section || "Whole Bible";
    d.days = initial.days || 5;
    d.gradient = Array.isArray(initial.gradient) && initial.gradient.length === 2 ? (initial.gradient as [string, string]) : ["#0f766e", "#14532d"];
    d.image = initial.image || initial.cover || "";
    d.status = initial.status || "draft";
    const rows = Array.isArray(initial.sections) ? initial.sections : [];
    d.sections = rows.length ? rows.map((r: Record<string, any>) => hydrateSection(r)) : Array.from({ length: d.days }, emptySection);
    return d;
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [activePreviewOpen, setActivePreviewOpen] = useState(false);

  const isBible = draft.category === "Bible Reading";
  const previewAccent = draft.gradient[0] || "#0f766e";

  const activePreview = useMemo<DayPreviewData | null>(() => {
    if (activeIdx == null || !draft.sections[activeIdx]) return null;
    const day = draft.sections[activeIdx];
    return {
      title: day.title,
      weekday: `Day ${activeIdx + 1}`,
      date: "",
      verse: day.verseText || day.verseBy ? { text: day.verseText, by: day.verseBy || undefined } : null,
      blocks: blocksForPayload(day),
    };
  }, [activeIdx, draft.sections]);

  const set = (patch: Partial<Draft>) => setDraft((prev) => ({ ...prev, ...patch }));

  function setDay(i: number, patch: Partial<DayDraft>) {
    setDraft((prev) => ({ ...prev, sections: prev.sections.map((s, j) => (j === i ? { ...s, ...patch } : s)) }));
  }

  function syncDays(days: number) {
    const n = Math.max(1, Math.min(30, days));
    setDraft((prev) => {
      const sections = [...prev.sections];
      while (sections.length < n) sections.push(emptySection());
      return { ...prev, days: n, sections: sections.slice(0, n) };
    });
  }

  function moveDay(i: number, dir: -1 | 1) {
    setDraft((prev) => {
      const next = [...prev.sections];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return { ...prev, sections: next };
    });
  }

  function moveBlock(i: number, bi: number, dir: -1 | 1) {
    setDraft((prev) => ({
      ...prev,
      sections: prev.sections.map((s, j) => {
        if (j !== i) return s;
        const next = [...s.blocks];
        const k = bi + dir;
        if (k < 0 || k >= next.length) return s;
        [next[bi], next[k]] = [next[k], next[bi]];
        return { ...s, blocks: next };
      }),
    }));
  }

  async function save() {
    if (!draft.title || !draft.slug) {
      setError("Title and slug are required.");
      return;
    }
    setSaving(true);
    setError(null);
    setSaved(false);
    const db = getSupabase();
    try {
      if (!db) {
        setError("Supabase isn't configured — nothing was saved.");
        return;
      }
      const planFields = {
        title: draft.title,
        tagline: draft.tagline || null,
        description: draft.description || null,
        category: draft.category,
        section: draft.section || null,
        days: draft.days,
        gradient: draft.gradient,
        image: draft.image || null,
        status: draft.status || "draft",
      };
      if (isEdit) {
        await db.from("reading_plans").update(planFields).eq("slug", draft.slug);
      } else {
        await db.from("reading_plans").insert({ slug: draft.slug, ...planFields, sort: 0 });
      }

      await db.from("plan_sections").delete().eq("plan_slug", draft.slug);
      const rows = draft.sections
        .filter((s) => s.title || s.verseText || s.blocks.length || (s.reading && readingHasContent(s.reading)))
        .map((s, i) => ({
          plan_slug: draft.slug,
          title: s.title || `Day ${i + 1}`,
          book: isBible && s.book ? s.book : null,
          start_ch: isBible ? s.startCh : null,
          end_ch: isBible ? s.endCh : null,
          verse_text: s.verseText || null,
          verse_by: s.verseBy || null,
          blocks: blocksForPayload(s),
          sort: i,
        }));
      if (rows.length) await db.from("plan_sections").insert(rows);

      setSaved(true);
      router.push("/admin/reading-plans");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-start gap-6">
      {/* Editor column (≈65%) */}
      <div className="min-w-0 w-full lg:w-[65%] space-y-5">
        {/* Identity & cover */}
        <Card>
          <h3 className="mb-4 text-lg font-black tracking-tight text-navy">Identity &amp; cover</h3>
          <div className="grid grid-cols-1 gap-4">
            <Field label="Plan slug" hint="URL path, e.g. mark-in-30-days">
              <Input
                value={draft.slug}
                onChange={(e) => set({ slug: e.target.value.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-") })}
                placeholder="mark-in-30-days"
                disabled={isEdit}
              />
            </Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Title">
                <Input value={draft.title} onChange={(e) => set({ title: e.target.value })} placeholder="Rooted in the Word — Mark" />
              </Field>
              <Field label="Duration (days)">
                <Input type="number" value={String(draft.days)} onChange={(e) => syncDays(Number(e.target.value) || 1)} />
              </Field>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-500">Category</label>
                <Select value={draft.category} onChange={(e) => set({ category: e.target.value })}>
                  {READING_PLAN_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </div>
              <Field label="Section label" hint="e.g. Whole Bible, Book of Mark, Stress">
                <Input value={draft.section} onChange={(e) => set({ section: e.target.value })} placeholder="Whole Bible" />
              </Field>
            </div>
            <Field label="Tagline">
              <Input value={draft.tagline} onChange={(e) => set({ tagline: e.target.value })} placeholder="Walk through Mark in 30 days" />
            </Field>
            <Field label="Description">
              <TextArea value={draft.description} onChange={(e) => set({ description: e.target.value })} />
            </Field>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <Field label="Cover image URL">
                  <Input value={draft.image} onChange={(e) => set({ image: e.target.value })} placeholder="https://…" />
                </Field>
              </div>
              {draft.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={draft.image} alt="cover preview" className="mt-6 h-[72px] w-[52px] shrink-0 rounded-md object-cover ring-1 ring-gray-200" />
              ) : null}
            </div>
          </div>
        </Card>

        {/* Days & daily reads */}
        <Card>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black tracking-tight text-navy">Days &amp; daily reads</h3>
              <p className="mt-0.5 text-sm text-slate-gray">
                {isBible
                  ? "Each day is a section: set the book + chapters, then write the commentary and extra blocks."
                  : "Author each day: a verse, a structured reading (hook, thesis, supporting details) and extra content blocks."}
              </p>
            </div>
            <Button
              variant="accent"
              onClick={() =>
                setDraft((prev) => {
                  const sections = [...prev.sections, emptySection()];
                  return { ...prev, days: sections.length, sections };
                })
              }
            >
              <FaPlus /> Add day
            </Button>
          </div>

          <div className="space-y-4">
            {draft.sections.map((day, i) => (
              <details key={i} open={draft.sections.length <= 7} className="group overflow-hidden rounded-2xl border border-gray-200">
                <summary
                  onClick={() => setActiveIdx(i)}
                  className="flex cursor-pointer select-none items-center justify-between gap-2 bg-alice-blue/50 px-4 py-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-navy">{day.title || `Day ${i + 1}`}</p>
                      <p className="truncate text-xs text-slate-gray">
                        {isBible && day.book ? `${day.book} ${day.startCh}–${day.endCh} · ` : ""}
                        {day.verseBy || "—"}
                        {day.blocks.length ? ` · ${day.blocks.length} blocks` : ""}
                        {day.reading && readingHasContent(day.reading) ? " · reading" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <MoveButton disabled={i === 0} onClick={() => moveDay(i, -1)}>↑</MoveButton>
                    <MoveButton disabled={i === draft.sections.length - 1} onClick={() => moveDay(i, 1)}>↓</MoveButton>
                    <button
                      aria-label={`remove day ${i + 1}`}
                      onClick={(e) => {
                        e.preventDefault();
                        if (draft.sections.length > 1) {
                          setDraft((prev) => ({
                            ...prev,
                            days: Math.max(1, prev.days - 1),
                            sections: prev.sections.filter((_, j) => j !== i),
                          }));
                        }
                      }}
                      className="ml-1 rounded p-1 text-slate-gray hover:bg-red-50 hover:text-red-500"
                    >
                      <FaXmark />
                    </button>
                  </div>
                </summary>

                <div className="space-y-4 border-t border-gray-100 p-4">
                  <div className="flex items-center gap-2">
                    <Badge tone="sky">Day {i + 1}</Badge>
                    {isBible ? <Badge tone="amber">{day.book || "No book set"}</Badge> : null}
                  </div>

                  {/* Day identity */}
                  <div className="grid grid-cols-1 gap-3">
                    <Field label="Day title">
                      <Input value={day.title} onChange={(e) => setDay(i, { title: e.target.value })} placeholder="The hidden root" />
                    </Field>
                    {isBible ? (
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <Field label="Book">
                          <Input value={day.book} onChange={(e) => setDay(i, { book: e.target.value })} placeholder="Mark" />
                        </Field>
                        <Field label="Start chapter">
                          <Input type="number" value={String(day.startCh)} onChange={(e) => setDay(i, { startCh: Number(e.target.value) || 1 })} />
                        </Field>
                        <Field label="End chapter">
                          <Input type="number" value={String(day.endCh)} onChange={(e) => setDay(i, { endCh: Number(e.target.value) || day.startCh })} />
                        </Field>
                      </div>
                    ) : null}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <Field label="Today's verse">
                        <Input value={day.verseText} onChange={(e) => setDay(i, { verseText: e.target.value })} placeholder="For God so loved the world…" />
                      </Field>
                      <Field label="Verse reference">
                        <Input value={day.verseBy} onChange={(e) => setDay(i, { verseBy: e.target.value })} placeholder="John 3:16" />
                      </Field>
                    </div>
                  </div>

                  {/* Structured READ content */}
                  <div className="rounded-xl border border-l-[3px] border-cyan border-gray-200 bg-white p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-cyan text-[10px] font-bold text-white">
                        <FaBookOpen className="text-[9px]" />
                      </span>
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-navy">
                        {isBible ? "Commentary & notes" : "Reading content"}
                      </p>
                    </div>
                    <ReadEditor value={day.reading ?? emptyReading()} onChange={(reading) => setDay(i, { reading })} />
                  </div>

                  {/* Extra blocks */}
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-gray">Extra blocks</p>
                      <div className="ml-auto flex items-center gap-1.5">
                        <AddBlockButton onAdd={(t) => setDay(i, { blocks: [...day.blocks, blankBlock(t)] })} />
                      </div>
                    </div>
                    {day.blocks.length === 0 ? (
                      <p className="rounded-xl border border-dashed border-gray-200 px-4 py-4 text-center text-sm text-gray-400">
                        Add quotes, images, lists, prayers or quizzes — like a magazine section.
                      </p>
                    ) : (
                      <div className="space-y-2.5">
                        {day.blocks.map((b, bi) => (
                          <div key={bi} className="relative">
                            <BlockEditor
                              block={b}
                              onChange={(nb) => setDay(i, { blocks: day.blocks.map((x, j) => (j === bi ? nb : x)) })}
                              onRemove={() => setDay(i, { blocks: day.blocks.filter((_, j) => j !== bi) })}
                            />
                            <div className="absolute -top-2 right-3 flex gap-1">
                              <MoveButton disabled={bi === 0} onClick={() => moveBlock(i, bi, -1)}>↑</MoveButton>
                              <MoveButton disabled={bi === day.blocks.length - 1} onClick={() => moveBlock(i, bi, 1)}>↓</MoveButton>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </details>
            ))}
          </div>
        </Card>

        {/* Actions */}
        <div className="flex flex-col items-start gap-3">
          {error ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
          {saved ? <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">Saved.</p> : null}
          <div className="flex gap-3">
            <Button onClick={save} disabled={saving || !draft.slug || !draft.title}>
              {saving ? "Saving…" : isEdit ? "Save changes" : "Create plan"}
            </Button>
            <Button variant="ghost" onClick={() => router.push("/admin/reading-plans")}>
              Cancel
            </Button>
          </div>
        </div>
      </div>

      {/* Preview column (≈35%, sticky) */}
      <aside className="sticky top-0 hidden w-[35%] shrink-0 max-h-screen self-start overflow-y-auto overscroll-contain pr-1 lg:block">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-widest text-cyan">Live preview</p>
            {activePreview ? <Badge tone="sky">updates as you type</Badge> : null}
          </div>
          {activePreview ? (
            <>
              <DayPreview day={activePreview} accent={previewAccent} />
              <button
                onClick={() => setActivePreviewOpen(true)}
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-semibold text-slate-gray transition hover:bg-alice-blue"
              >
                Open full screen
              </button>
            </>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-6 text-center">
              <p className="text-sm font-semibold text-slate-gray">Day preview</p>
              <p className="mt-1.5 text-xs leading-5 text-gray-400">
                Click any day above to preview its verse, reading and blocks here — updating live as you type.
              </p>
            </div>
          )}
        </div>
      </aside>

      <DayPreviewModal open={activePreviewOpen} onClose={() => setActivePreviewOpen(false)} day={activePreview} accent={previewAccent} />
    </div>
  );
}

function AddBlockButton({ onAdd, label = "+ Add block" }: { onAdd: (type: string) => void; label?: string }) {
  const [type, setType] = useState("paragraph");
  return (
    <div className="flex items-center gap-2">
      <Select
        className="w-auto rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        {BLOCK_TYPES.map((b) => (
          <option key={b.type} value={b.type}>
            {b.label}
          </option>
        ))}
      </Select>
      <Button variant="ghost" onClick={() => onAdd(type)}>
        {label}
      </Button>
    </div>
  );
}

function MoveButton({ children, disabled, onClick }: { children: React.ReactNode; disabled?: boolean; onClick: () => void }) {
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