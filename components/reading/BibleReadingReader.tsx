/**
 * Reading plan reader (client view).
 *
 * Renders one section (day) at a time in the same format as the mobile day
 * reader: header eyebrow/title → VERSE / READ / REFLECT / RESPOND sections
 * with a scroll-spy stepper → in-page Mark complete + Share action row →
 * prev/next paging.
 *
 * Authored content (verse + blocks + commentary) comes from the backend when
 * the admin editor has saved it; otherwise sections fall back to the seeded
 * catalog via lib/reading-plans.
 */
"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import {
  FaBookOpen,
  FaBookmark,
  FaCheck,
  FaCircleCheck,
  FaHeart,
  FaShareNodes,
  FaCircleXmark,
} from "react-icons/fa6";
import type { RelateReadingPlan } from "@/lib/reading-plans";
import type { ReadingSection } from "@/lib/reading-plans";
import type { PubBlock, ReadingMedia, ReadingStructure } from "@/lib/editor/season";
import { emptyReading } from "@/lib/editor/season";

type Props = {
  plan: RelateReadingPlan;
  sections: ReadingSection[];
  /** Opens the plan in started mode (from the list "Start plan" button). */
  autoStart?: boolean;
};

type StoredProgress = { startedAt: number; done: string[] };

const progressKey = (slug: string) => `rp-progress:${slug}`;

// Surge club palette — same constants the mobile day reader uses.
const SURGE_ACCENT = "#C2410C";
const SURGE_COLOR = "#FF6B00";
const EYEBROW = "#13c5dd";
const MUTED = "#6b7a8d";
const CHECKED_BG = "#1d2a4d";
const SUCCESS = "#10b981";
const ERROR = "#ef4444";

const INTERACTIVE = ["checklist", "quiz", "reflection", "pray"];
const REFLECT_TYPES = ["checklist", "quiz", "reflection"];

function loadLocal(slug: string): string[] | null {
  try {
    const raw = window.localStorage.getItem(progressKey(slug));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredProgress;
    return Array.isArray(parsed.done) ? parsed.done.map(String) : [];
  } catch {
    return null;
  }
}

function saveLocal(slug: string, done: string[]) {
  try {
    window.localStorage.setItem(progressKey(slug), JSON.stringify({ startedAt: Date.now(), done }));
  } catch {
    // private mode / quota — progress stays in memory
  }
}

/** Progress lives in the backend (`user_study_progress`) for signed-in readers. */
async function postProgress(slug: string, title: string, completed: string[], total: number): Promise<void> {
  const res = await fetch("/api/study-progress", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slug, title, completedLessons: completed, totalLessons: total }),
  });
  if (!res.ok) throw new Error(`study-progress ${res.status}`);
}

/**
 * Progress keys are 1-based day numbers — the same scheme the mobile app
 * writes, so both platforms share one row. Older rows stored section ids;
 * normalize them back to day numbers when reading.
 */
const dayKey = (s: ReadingSection) => String(s.sort + 1);

function toDayKeys(values: string[], sections: ReadingSection[]): string[] {
  const byId = new Map(sections.map((sec) => [sec.id, dayKey(sec)]));
  const days = new Set<string>();
  for (const value of values) {
    if (/^\d+$/.test(value)) {
      if (Number(value) > 0) days.add(value);
      continue;
    }
    const mapped = byId.get(value);
    if (mapped) days.add(mapped);
  }
  return [...days];
}

function SectionHead({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-3.5">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: EYEBROW }}>
        {eyebrow}
      </p>
      <h4 className="mt-1 text-base font-bold leading-5" style={{ color: SURGE_COLOR }}>
        {title}
      </h4>
    </div>
  );
}

function QuoteCard({ text, by, source }: { text: string; by?: string; source?: string }) {
  return (
    <blockquote
      className="mb-1.5 rounded-[10px] border-l-4 bg-ghost-white px-3 text-sm italic leading-[22px] text-navy"
      style={{ borderLeftColor: EYEBROW }}
    >
      &ldquo;{text}&rdquo;
      {by || source ? (
        <footer className="mt-1 text-[11px] font-semibold not-italic text-slate-gray">
          {by ? `— ${by}` : ""}
          {by && source ? " · " : ""}
          {source || ""}
        </footer>
      ) : null}
    </blockquote>
  );
}

export default function BibleReadingReader({ plan, sections, autoStart = false }: Props) {
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState<Set<string>>(new Set());
  const [started, setStarted] = useState(false);
  const [onServer, setOnServer] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const articleRef = useRef<HTMLElement | null>(null);

  const safeIndex = Math.min(Math.max(index, 0), Math.max(sections.length - 1, 0));
  const current = sections.length ? sections[safeIndex] : undefined;

  const steps = useMemo(() => {
    if (!current) return [];
    const list: string[] = [];
    if (current.verseText) list.push("VERSE");
    list.push("READ");
    const blocks = current.blocks ?? [];
    if (blocks.some((b) => REFLECT_TYPES.includes(b.type))) list.push("REFLECT");
    if (blocks.some((b) => b.type === "pray")) list.push("RESPOND");
    return list;
  }, [current]);

  // Season-guide scroll spy: the last section whose top crossed the threshold
  // is the current step; tabs jump to their section.
  useEffect(() => {
    const compute = () => {
      let step = 0;
      steps.forEach((label, idx) => {
        const el = articleRef.current?.querySelector<HTMLElement>(`[data-step="${label}"]`);
        if (el && el.getBoundingClientRect().top <= 140) step = idx;
      });
      setActiveStep(step);
    };
    compute();
    window.addEventListener("scroll", compute, { passive: true });
    return () => window.removeEventListener("scroll", compute);
  }, [steps]);

  // Hydrate: signed-in readers pull progress from the backend; guests use
  // local storage. Sample opens clean, Start plan creates the record.
  useEffect(() => {
    if (!plan) return;
    let cancelled = false;
    (async () => {
      let startedNow = false;
      let doneNow: string[] = [];
      let signedIn = false;
      try {
        const res = await fetch("/api/study-progress", { headers: { Accept: "application/json" } });
        if (res.ok) {
          signedIn = true;
          const json = (await res.json()) as { data?: Array<Record<string, unknown>> };
          const rows = Array.isArray(json.data) ? json.data : [];
          const row = rows.find((r) => r.slug === plan.slug);
          if (row) {
            startedNow = true;
            doneNow = Array.isArray(row.completedLessons)
              ? (row.completedLessons as unknown[]).map(String)
              : [];
          }
        }
      } catch {
        // offline / API down → local fallback below
      }
      if (!signedIn) {
        const local = loadLocal(plan.slug);
        if (local) {
          startedNow = true;
          doneNow = local;
        }
      }
      if (cancelled) return;
      setOnServer(signedIn);
      if (startedNow) {
        setDone(new Set(doneNow));
        setStarted(true);
      } else if (autoStart) {
        setStarted(true);
        if (signedIn) {
          void postProgress(plan.slug, plan.title, [], sections.length).catch(() => {
            saveLocal(plan.slug, []);
          });
        } else {
          saveLocal(plan.slug, []);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [plan, autoStart, sections.length]);

  if (!plan) {
    return (
      <section className="flex items-center justify-center py-24">
        <p className="text-sm text-slate-gray">That reading plan was not found.</p>
      </section>
    );
  }

  if (!sections.length) {
    return (
      <p className="rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-slate-gray">
        No sections yet for this plan.
      </p>
    );
  }

  // One article at a time: read it, mark it complete, move with prev/next.
  const i = safeIndex;
  const s = sections[i];
  const isCompact = !s.book && s.startCh == null;
  const doneDays = new Set(toDayKeys([...done], sections));
  const isDone = doneDays.has(dayKey(s));
  const range =
    [s.book, s.startCh != null && s.endCh != null ? `${s.startCh}–${s.endCh}` : ""]
      .filter(Boolean)
      .join(" ") || null;

  const blocks = s.blocks ?? [];
  const readBlocks = blocks.filter((b) => !INTERACTIVE.includes(b.type));
  const reflectBlocks = blocks.filter((b) => REFLECT_TYPES.includes(b.type));
  const prayBlocks = blocks.filter((b) => b.type === "pray");

  const chapters: number[] = [];
  if (s.book && s.startCh != null) {
    const end = Math.min(typeof s.endCh === "number" ? s.endCh : s.startCh, s.startCh + 40);
    for (let c = s.startCh; c <= end; c++) chapters.push(c);
  }

  const shownStep = Math.min(activeStep, Math.max(steps.length - 1, 0));

  const persist = async (ids: string[], withStart: boolean) => {
    if (!plan) return;
    if (withStart) setStarted(true);
    if (onServer) {
      try {
        await postProgress(plan.slug, plan.title, ids, sections.length);
        return;
      } catch {
        // backend unavailable or auth failed — keep local progress
      }
    }
    saveLocal(plan.slug, ids);
  };

  const toggleComplete = async () => {
    const next = new Set(doneDays);
    const key = dayKey(s);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setDone(next);
    await persist([...next], !started);
  };

  const startPlan = async () => {
    await persist([...doneDays], true);
  };

  const shareSection = () => {
    const url = typeof window !== "undefined" ? `${window.location.origin}/plans/${plan.slug}` : "";
    const parts = [`${plan.title} — Day ${s.sort + 1}: ${s.title}`];
    if (s.verseText) parts.push(`“${s.verseText}”${s.verseBy ? ` — ${s.verseBy}` : ""}`);
    if (range) parts.push(`Read: ${range}`);
    parts.push(`Day ${s.sort + 1} of ${plan.days} · ${plan.tagline}`);
    const text = parts.join("\n\n");
    void fetch("/api/reading-shares", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: plan.slug, day: s.sort + 1, title: s.title, via: "web" }),
    }).catch(() => {});
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: plan.title, text, url }).catch(() => {});
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard
        .writeText(`${text}
${url}`)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => {});
    }
  };

  const go = (delta: number) => {
    setIndex(Math.min(Math.max(i + delta, 0), sections.length - 1));
  };

  const goToStep = (label: string, idx: number) => {
    const el = articleRef.current?.querySelector<HTMLElement>(`[data-step="${label}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveStep(idx);
  };

  return (
    <div className="space-y-5">
      {/* Header — same eyebrow/title as the mobile day reader */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-normal text-slate-gray">
            {plan.title} · Day {s.sort + 1} of {plan.days}
          </p>
          <h3 className="mt-1 text-[20px] font-bold leading-[26px] text-navy">
            {s.title || (isCompact ? `Day ${s.sort + 1}` : "Untitled section")}
          </h3>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {started ? (
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-700">
              {doneDays.size} of {sections.length} complete
            </span>
          ) : (
            <button
              onClick={startPlan}
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-bold text-white"
              style={{ backgroundColor: plan.gradient[0] }}
            >
              Start plan
            </button>
          )}
          {isDone ? (
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-700">
              Completed
            </span>
          ) : null}
        </div>
      </div>

      {/* Section stepper with scroll spy (Season-guide tabs) */}
      {steps.length > 1 ? (
        <div className="flex rounded-xl bg-white px-1 py-1">
          {steps.map((label, idx) => (
            <button
              key={label}
              type="button"
              onClick={() => goToStep(label, idx)}
              className="flex-1 rounded-lg py-[7px] text-xs transition-colors"
              style={
                idx <= shownStep
                  ? { color: SURGE_ACCENT, fontWeight: 700 }
                  : { color: MUTED, fontWeight: 400 }
              }
            >
              {label}
            </button>
          ))}
        </div>
      ) : null}

      {/* Article */}
      <article ref={articleRef} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        {s.verseText ? (
          <section data-step="VERSE" className="mb-6 scroll-mt-32">
            <SectionHead eyebrow="VERSE" title="Today's verse" />
            <div
              className="rounded-xl border-l-4 bg-white p-3.5 ring-1 ring-gray-100"
              style={{ borderLeftColor: SURGE_ACCENT }}
            >
              <p className="text-sm leading-6 text-navy">&ldquo;{s.verseText}&rdquo;</p>
              {s.verseBy ? (
                <p className="mt-1.5 text-[11px] font-semibold text-slate-gray">— {s.verseBy}</p>
              ) : null}
            </div>
          </section>
        ) : null}

        <section data-step="READ" className="mb-6 scroll-mt-32">
          <SectionHead eyebrow="READ" title="The reading" />

          {chapters.length ? (
            <div className="mb-2.5 flex flex-wrap gap-2">
              {chapters.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-1.5 rounded-full border border-ice-blue bg-white px-3 py-1.5 text-xs font-semibold text-navy-soft"
                >
                  <FaBookOpen className="text-[10px]" style={{ color: EYEBROW }} />
                  {s.book} {c}
                </span>
              ))}
            </div>
          ) : null}

          {readBlocks.length ? (
            readBlocks.map((b, idx) => <BlockView key={`${s.id}-${idx}`} b={b} />)
          ) : chapters.length ? (
            <p className="text-sm leading-[22px] text-navy">
              Read {range} at your own pace, then mark this day complete.
            </p>
          ) : (
            <p className="text-sm leading-[22px] text-navy">
              Reading content for this day is coming soon.
            </p>
          )}
        </section>

        {reflectBlocks.length ? (
          <section data-step="REFLECT" className="mb-6 scroll-mt-32">
            <SectionHead eyebrow="REFLECT" title="Think it over" />
            <div className="space-y-3">
              {reflectBlocks.map((b, idx) => (
                <InteractiveView key={`${s.id}-${idx}`} b={b} />
              ))}
            </div>
          </section>
        ) : null}

        {prayBlocks.length ? (
          <section data-step="RESPOND" className="mb-6 scroll-mt-32">
            <SectionHead eyebrow="RESPOND" title="Pray it through" />
            <div className="space-y-3">
              {prayBlocks.map((b, idx) => (
                <InteractiveView key={`${s.id}-${idx}`} b={b} />
              ))}
            </div>
          </section>
        ) : null}

        {/* Action row — scrolls with the page, like mobile */}
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={toggleComplete}
            aria-pressed={isDone}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-[14px] px-5 py-3 text-xs font-bold text-white transition hover:opacity-90"
            style={{ backgroundColor: isDone ? SUCCESS : SURGE_COLOR }}
          >
            {isDone ? <FaCircleCheck /> : <FaBookmark />}
            {isDone ? "Completed" : "Mark complete"}
          </button>
          <button
            type="button"
            onClick={shareSection}
            className="inline-flex items-center justify-center gap-2 rounded-[14px] border bg-white px-5 py-3 text-xs font-bold transition hover:bg-alice-blue"
            style={{ borderColor: "rgba(194, 65, 12, 0.35)", color: SURGE_ACCENT }}
          >
            <FaShareNodes className="text-[11px]" /> {copied ? "Link copied" : "Share"}
          </button>
        </div>
      </article>

      {/* Prev / Next */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => go(-1)}
          disabled={i === 0}
          className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-xs font-bold text-navy transition hover:bg-alice-blue disabled:opacity-40 disabled:hover:bg-white"
        >
          &larr; Previous
        </button>
        <span className="text-xs font-semibold text-slate-gray">
          {i + 1} of {sections.length}
        </span>
        <button
          onClick={() => go(1)}
          disabled={i === sections.length - 1}
          className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-xs font-bold text-navy transition hover:bg-alice-blue disabled:opacity-40 disabled:hover:bg-white"
        >
          Next &rarr;
        </button>
      </div>
    </div>
  );
}

function ReadingMediaView({ media }: { media: ReadingMedia }) {
  if (media.type === "image") {
    return (
      <figure className="mb-2 overflow-hidden rounded-xl ring-1 ring-gray-100">
        <Image src={media.uri} alt={media.caption || ""} width={1600} height={1067} className="w-full" />
        {media.caption ? (
          <figcaption className="border-t border-gray-100 bg-alice-blue px-3 py-1.5 text-[11px] text-slate-gray">
            {media.caption}
          </figcaption>
        ) : null}
      </figure>
    );
  }
  return <QuoteCard text={media.text} by={media.by} source={media.source} />;
}

function ReadingView({ structure }: { structure: ReadingStructure }) {
  const s = structure ?? emptyReading();
  const intro = s.intro ?? emptyReading().intro;
  const body = Array.isArray(s.body) ? s.body : [];
  const conclusion = s.conclusion ?? emptyReading().conclusion;
  const media = (m?: ReadingMedia[]) => (m || []).map((x, j) => <ReadingMediaView key={j} media={x} />);
  return (
    <div>
      {media(intro.beforeHook)}
      {intro.hook ? <p className="mb-1.5 text-sm leading-[22px] text-navy">{intro.hook}</p> : null}
      {media(intro.afterHook)}
      {intro.thesis ? <p className="mb-1.5 text-sm leading-[22px] text-navy">{intro.thesis}</p> : null}
      {media(intro.afterThesis)}
      {body.map((item, j) => (
        <div key={j}>
          {media(item.beforeTopic)}
          {item.topic ? <p className="mb-1.5 text-sm leading-[22px] text-navy">{item.topic}</p> : null}
          {media(item.afterTopic)}
          {item.support.length ? (
            <p className="mb-1.5 text-sm italic leading-[22px] text-slate-gray">{item.support.join(" ")}</p>
          ) : null}
          {media(item.afterSupport)}
          {item.closing ? <p className="mb-1.5 text-sm leading-[22px] text-navy">{item.closing}</p> : null}
          {media(item.afterClosing)}
        </div>
      ))}
      {media(conclusion.beforeRestate)}
      {conclusion.restate ? <p className="mb-1.5 text-sm leading-[22px] text-navy">{conclusion.restate}</p> : null}
      {media(conclusion.afterRestate)}
      {conclusion.whyItMatters ? (
        <p className="mb-1.5 text-sm leading-[22px] text-navy">{conclusion.whyItMatters}</p>
      ) : null}
      {media(conclusion.afterWhyItMatters)}
      {conclusion.closing ? (
        <p className="mb-1.5 text-sm italic leading-[22px] text-navy">{conclusion.closing}</p>
      ) : null}
      {media(conclusion.afterClosing)}
    </div>
  );
}

/** Flat gray card — mirrors the mobile InteractiveBlocks card. */
function InteractiveCard({ children }: { children: ReactNode }) {
  return <div className="rounded-xl bg-ghost-white p-3">{children}</div>;
}

function ChecklistView({ b }: { b: PubBlock }) {
  const [checked, setChecked] = useState<boolean[]>(() => (b.items || []).map(() => false));
  return (
    <InteractiveCard>
      <p className="mb-1.5 text-sm font-bold text-gray-700">{b.title || "Try it today"}</p>
      <ul>
        {(b.items || []).map((item, i) => (
          <li key={i}>
            <button
              type="button"
              aria-pressed={checked[i] ?? false}
              onClick={() => setChecked((prev) => prev.map((v, j) => (j === i ? !v : v)))}
              className="flex w-full items-center gap-2 rounded-lg px-0.5 py-[5px] text-left"
            >
              <span
                className="flex size-3.5 shrink-0 items-center justify-center rounded border"
                style={
                  checked[i]
                    ? { backgroundColor: CHECKED_BG, borderColor: CHECKED_BG }
                    : { borderColor: "#d1d5db", backgroundColor: "#fff" }
                }
              >
                {checked[i] ? <FaCheck className="text-[8px] text-white" /> : null}
              </span>
              <span
                className="text-xs leading-[18px]"
                style={{ color: checked[i] ? MUTED : "#4b5563" }}
              >
                {item}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </InteractiveCard>
  );
}

function QuizView({ b }: { b: PubBlock }) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;
  const correct = answered && selected === b.correctIndex;
  return (
    <InteractiveCard>
      <p className="mb-1.5 text-sm font-bold text-gray-700">{b.question}</p>
      <ul>
        {(b.options || []).map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = answered && i === b.correctIndex;
          const isWrongPick = answered && isSelected && i !== b.correctIndex;
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => setSelected(i)}
                className="flex w-full items-center gap-2 rounded-lg px-0.5 py-[5px] text-left"
                style={
                  isCorrect
                    ? { backgroundColor: "rgba(16, 185, 129, 0.10)" }
                    : isWrongPick
                      ? { backgroundColor: "rgba(239, 68, 68, 0.08)" }
                      : undefined
                }
              >
                <span
                  className="size-2.5 shrink-0 rounded-full border"
                  style={
                    isSelected
                      ? { backgroundColor: CHECKED_BG, borderColor: CHECKED_BG }
                      : { borderColor: "#d1d5db", backgroundColor: "#fff" }
                  }
                />
                <span className="flex-1 text-xs leading-[18px] text-[#4b5563]">{opt}</span>
                {isCorrect ? <FaCircleCheck className="text-[14px]" style={{ color: SUCCESS }} /> : null}
                {isWrongPick ? <FaCircleXmark className="text-[14px]" style={{ color: ERROR }} /> : null}
              </button>
            </li>
          );
        })}
      </ul>
      {answered && b.explain ? (
        <p className="mt-0.5 px-0.5 text-xs" style={{ color: correct ? "#065f46" : MUTED }}>
          {correct ? "Correct — " : ""}
          {b.explain}
        </p>
      ) : null}
    </InteractiveCard>
  );
}

function ReflectionView({ b }: { b: PubBlock }) {
  const [text, setText] = useState("");
  return (
    <InteractiveCard>
      <p className="mb-1 text-xs italic text-gray-600">&ldquo;{b.prompt}&rdquo;</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={2000}
        placeholder={b.placeholder || "Write your thoughts here…"}
        className="min-h-16 w-full resize-none rounded-lg border border-dashed border-gray-300 bg-white p-2 text-[13px] text-gray-700 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
      />
    </InteractiveCard>
  );
}

function PrayView({ b }: { b: PubBlock }) {
  const [prayed, setPrayed] = useState<boolean[]>(() => (b.items || []).map(() => false));
  return (
    <InteractiveCard>
      <div className="mb-1.5 flex items-center gap-1.5">
        <FaHeart className="text-[13px]" style={{ color: MUTED }} />
        <p className="text-sm font-bold text-gray-700">{b.title || "Pray it today"}</p>
      </div>
      <ul>
        {(b.items || []).map((item, i) => (
          <li key={i}>
            <button
              type="button"
              aria-pressed={prayed[i] ?? false}
              onClick={() => setPrayed((prev) => prev.map((v, j) => (j === i ? !v : v)))}
              className="flex w-full items-center gap-2 rounded-lg px-0.5 py-[5px] text-left"
            >
              <span
                className="size-[7px] shrink-0 rounded-full"
                style={{ backgroundColor: prayed[i] ? SUCCESS : EYEBROW }}
              />
              <span
                className="text-xs leading-[18px]"
                style={{ color: prayed[i] ? MUTED : "#4b5563" }}
              >
                {item}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </InteractiveCard>
  );
}

function InteractiveView({ b }: { b: PubBlock }) {
  switch (b.type) {
    case "checklist":
      return <ChecklistView b={b} />;
    case "quiz":
      return <QuizView b={b} />;
    case "reflection":
      return <ReflectionView b={b} />;
    case "pray":
      return <PrayView b={b} />;
    default:
      return null;
  }
}

function BlockView({ b }: { b: PubBlock }) {
  switch (b.type) {
    case "reading":
      return <ReadingView structure={b.structure ?? emptyReading()} />;
    case "paragraph":
      return <p className="mb-1.5 text-sm leading-[22px] text-navy">{b.text}</p>;
    case "heading":
      return <h4 className="mb-1.5 mt-2.5 text-base font-bold leading-5 text-navy">{b.text}</h4>;
    case "quote":
      return <QuoteCard text={b.text || ""} by={b.by} source={b.source} />;
    case "image":
      if (!b.uri) return null;
      return (
        <figure className="mb-2 overflow-hidden rounded-xl ring-1 ring-gray-100">
          <Image src={b.uri} alt={b.caption || ""} width={1600} height={1067} className="w-full" />
          {b.caption ? (
            <figcaption className="border-t border-gray-100 bg-alice-blue px-3 py-1.5 text-[11px] text-slate-gray">
              {b.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    case "list":
      return (
        <ul className="mb-1.5 space-y-1">
          {(b.items || []).map((item, i) => (
            <li key={i} className="flex gap-2.5 text-sm leading-[22px] text-navy">
              <span className="mt-[7px] size-1.5 shrink-0 rounded-full" style={{ backgroundColor: EYEBROW }} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "checklist":
    case "quiz":
    case "reflection":
    case "pray":
      return <InteractiveView b={b} />;
    default:
      return null;
  }
}
