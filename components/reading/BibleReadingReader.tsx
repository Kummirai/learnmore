/**
 * Reading plan reader (client view).
 *
 * Renders a plan's sections. Bible plans split into 5-chapter sections: mark
 * the chapters of a section done to complete it. Topic/marriage/wellness plans
 * are authored day-by-day with a verse + content blocks and a simple "read"
 * toggle.
 *
 * Authored content (verse + blocks + commentary) comes from the backend when
 * the admin editor has saved it; otherwise sections fall back to the seeded
 * catalog via lib/reading-plans.
 */
"use client";

import { useEffect, useState } from "react";
import {
  FaBookOpen,
  FaCheck,
  FaQuoteLeft,
  FaShareNodes,
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
function postProgress(slug: string, title: string, completed: string[], total: number): Promise<void> {
  return fetch("/api/study-progress", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slug, title, completedLessons: completed, totalLessons: total }),
  }).then(() => undefined);
}

export default function BibleReadingReader({ plan, sections, autoStart = false }: Props) {
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState<Set<string>>(new Set());
  const [started, setStarted] = useState(false);
  const [onServer, setOnServer] = useState(false);
  const [copied, setCopied] = useState(false);

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
        if (signedIn) void postProgress(plan.slug, plan.title, [], sections.length);
        else saveLocal(plan.slug, []);
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
  const i = Math.min(Math.max(index, 0), sections.length - 1);
  const s = sections[i];
  const isCompact = !s.book && s.startCh == null;
  const isDone = done.has(s.id);
  const range =
    [s.book, s.startCh != null && s.endCh != null ? `${s.startCh}–${s.endCh}` : ""]
      .filter(Boolean)
      .join(" ") || null;

  const persist = (ids: string[], withStart: boolean) => {
    if (!plan) return;
    if (withStart) setStarted(true);
    if (onServer) void postProgress(plan.slug, plan.title, ids, sections.length);
    else saveLocal(plan.slug, ids);
  };

  const toggleComplete = () => {
    const next = new Set(done);
    if (next.has(s.id)) next.delete(s.id);
    else next.add(s.id);
    setDone(next);
    // Marking a section = going through the plan, so it starts tracking.
    persist([...next], !started);
  };

  const startPlan = () => {
    persist([...done], true);
  };

  const shareSection = () => {
    const url = typeof window !== "undefined" ? `${window.location.origin}/plans/${plan.slug}` : "";
    const parts = [`${plan.title} — Section ${i + 1} of ${sections.length}: ${s.title}`];
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

  return (
    <div className="space-y-5">
      {/* Position */}
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-gray">
          {isCompact
            ? `Day ${s.sort + 1} · ${plan.section || "Read"}`
            : `Section ${s.sort + 1} of ${sections.length}`}
        </p>
        <div className="flex items-center gap-2">
          {started ? (
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-700">
              {done.size} of {sections.length} complete
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

      {/* Article */}
      <article className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-black text-navy">
          {s.title || (isCompact ? `Day ${s.sort + 1}` : "Untitled section")}
        </h3>
        {range ? <p className="mt-1 text-sm text-slate-gray">{range}</p> : null}

        {s.verseText ? (
          <div
            className="mt-4 rounded-xl border-l-4 bg-alice-blue/50 p-3.5 ring-1 ring-gray-100"
            style={{ borderLeftColor: "#13c5dd" }}
          >
            <p className="text-[11px] font-bold uppercase tracking-widest text-cyan mb-1">
              Today&apos;s verse
            </p>
            <p className="text-sm leading-6 text-navy">
              <FaQuoteLeft className="mr-1 inline text-slate-gray" />
              {s.verseText}
            </p>
            {s.verseBy ? (
              <p className="mt-1 text-xs font-semibold text-slate-gray">— {s.verseBy}</p>
            ) : null}
          </div>
        ) : null}

        {s.blocks && s.blocks.length ? (
          <div className="mt-4 space-y-3">
            {s.blocks.map((b, idx) => (
              <BlockView key={`${s.id}-${idx}`} b={b} />
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-2xl border border-dashed border-gray-200 p-6 text-center text-sm leading-6 text-slate-gray">
            {range
              ? `Open ${range} in the Bible, read at your own pace, then mark this section complete.`
              : "Reading content for this section is coming soon."}
          </p>
        )}

        <div className="mt-6 flex items-center gap-3 border-t border-gray-100 pt-4">
          <button
            onClick={toggleComplete}
            aria-pressed={isDone}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition-colors"
            style={
              isDone
                ? { backgroundColor: "#065f46", color: "#fff" }
                : { backgroundColor: "#13c5dd", color: "#1d2a4d" }
            }
          >
            {isDone ? <FaCheck /> : <FaBookOpen className="text-slate-gray" />}
            {isDone ? "Completed" : "Mark complete"}
          </button>
          <button
            type="button"
            onClick={shareSection}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2.5 text-xs font-bold text-navy transition hover:bg-alice-blue"
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

const EYEBROW = "#13c5dd";

function ReadingMediaView({ media }: { media: ReadingMedia }) {
  if (media.type === "image") {
    return (
      <figure className="overflow-hidden rounded-xl ring-1 ring-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={media.uri} alt={media.caption || ""} className="w-full" />
        {media.caption ? (
          <figcaption className="border-t border-gray-100 bg-alice-blue px-3 py-1.5 text-xs text-slate-gray">
            {media.caption}
          </figcaption>
        ) : null}
      </figure>
    );
  }
  return (
    <blockquote className="rounded-r-xl border-l-4 bg-alice-blue/60 px-3 py-2 text-sm italic leading-6 text-gray-700" style={{ borderLeftColor: EYEBROW }}>
      &ldquo;{media.text}&rdquo;
      {media.by || media.source ? (
        <footer className="mt-1 text-xs not-italic text-slate-gray">
          {media.by ? `— ${media.by}` : ""}
          {media.source ? ` · ${media.source}` : ""}
        </footer>
      ) : null}
    </blockquote>
  );
}

function ReadingView({ structure }: { structure: ReadingStructure }) {
  const s = structure ?? emptyReading();
  const intro = s.intro ?? emptyReading().intro;
  const body = Array.isArray(s.body) ? s.body : [];
  const conclusion = s.conclusion ?? emptyReading().conclusion;
  const media = (m?: ReadingMedia[]) => (m || []).map((x, j) => <ReadingMediaView key={j} media={x} />);
  return (
    <div className="space-y-1.5">
      {media(intro.beforeHook)}
      {intro.hook ? <p className="text-sm leading-6 text-gray-700">{intro.hook}</p> : null}
      {media(intro.afterHook)}
      {intro.thesis ? <p className="text-sm leading-6 text-gray-700">{intro.thesis}</p> : null}
      {media(intro.afterThesis)}
      {body.map((item, j) => (
        <div key={j}>
          {media(item.beforeTopic)}
          {item.topic ? <p className="text-sm leading-6 text-gray-700">{item.topic}</p> : null}
          {media(item.afterTopic)}
          {item.support.length ? (
            <p className="mt-1 text-sm leading-6 italic text-slate-gray">{item.support.join(" ")}</p>
          ) : null}
          {media(item.afterSupport)}
          {item.closing ? <p className="mt-1 text-sm leading-6 text-gray-700">{item.closing}</p> : null}
          {media(item.afterClosing)}
        </div>
      ))}
      {media(conclusion.beforeRestate)}
      {conclusion.restate ? <p className="text-sm leading-6 text-gray-700">{conclusion.restate}</p> : null}
      {media(conclusion.afterRestate)}
      {conclusion.whyItMatters ? (
        <p className="text-sm leading-6 text-gray-700">{conclusion.whyItMatters}</p>
      ) : null}
      {media(conclusion.afterWhyItMatters)}
      {conclusion.closing ? (
        <p className="text-[13px] italic leading-5 text-gray-700">{conclusion.closing}</p>
      ) : null}
      {media(conclusion.afterClosing)}
    </div>
  );
}

function TodoBlock({ b }: { b: PubBlock }) {
  const [checked, setChecked] = useState<boolean[]>(() => (b.items || []).map(() => false));
  return (
    <div className="rounded-xl bg-alice-blue p-3">
      <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-cyan">{b.title || "To-do"}</p>
      <ul className="space-y-1">
        {(b.items || []).map((item, i) => (
          <li key={i}>
            <button
              type="button"
              aria-pressed={checked[i] ?? false}
              onClick={() => setChecked((prev) => prev.map((v, j) => (j === i ? !v : v)))}
              className="flex w-full items-start gap-2 py-1 text-left text-sm text-gray-700"
            >
              <span
                className="mt-0.5 flex size-3.5 shrink-0 items-center justify-center rounded border"
                style={
                  checked[i]
                    ? { backgroundColor: "#065f46", borderColor: "#065f46" }
                    : { borderColor: "#cbd5e1", backgroundColor: "#fff" }
                }
              >
                {checked[i] ? <FaCheck className="text-[8px] text-white" /> : null}
              </span>
              <span className={checked[i] ? "text-slate-gray line-through" : ""}>{item}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BlockView({ b }: { b: PubBlock }) {
  switch (b.type) {
    case "reading":
      return <ReadingView structure={b.structure ?? emptyReading()} />;
    case "paragraph":
      return <p className="text-sm leading-6 text-gray-700">{b.text}</p>;
    case "heading":
      return (
        <div className="mt-5 mb-1 flex items-center gap-2">
          <span className="h-4 w-1 rounded-full" style={{ backgroundColor: EYEBROW }} />
          <h4 className="text-[11px] font-bold uppercase tracking-widest text-navy">{b.text}</h4>
        </div>
      );
    case "quote":
      return (
        <blockquote className="rounded-r-xl border-l-4 bg-alice-blue/60 px-3 py-2 text-sm italic leading-6 text-gray-700" style={{ borderLeftColor: EYEBROW }}>
          &ldquo;{b.text}&rdquo;
          {b.by || b.source ? (
            <footer className="mt-1 text-xs not-italic text-slate-gray">
              {b.by ? `— ${b.by}` : ""}
              {b.source ? ` · ${b.source}` : ""}
            </footer>
          ) : null}
        </blockquote>
      );
    case "image":
      return (
        <figure className="overflow-hidden rounded-xl ring-1 ring-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={b.uri} alt={b.caption || ""} className="w-full" />
          {b.caption ? (
            <figcaption className="border-t border-gray-100 bg-alice-blue px-3 py-1.5 text-xs text-slate-gray">
              {b.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    case "list":
      return (
        <ul className="space-y-1.5">
          {(b.items || []).map((item, i) => (
            <li key={i} className="flex gap-2 text-sm leading-6 text-gray-700">
              <span className="mt-[7px] size-1.5 shrink-0 rounded-full" style={{ backgroundColor: EYEBROW }} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "checklist":
      return <TodoBlock b={b} />;
    case "reflection":
      return (
        <div className="rounded-xl bg-alice-blue p-3">
          <p className="text-sm italic text-gray-600">&ldquo;{b.prompt}&rdquo;</p>
          <div className="mt-2 flex h-10 items-center rounded-lg border border-dashed border-gray-300 bg-white px-2 text-xs text-gray-400">
            {b.placeholder || "Write your answer…"}
          </div>
        </div>
      );
    case "pray":
      return (
        <div className="rounded-xl bg-navy p-3">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-cyan">{b.title || "Prayer"}</p>
          <ul className="space-y-1.5">
            {(b.items || []).map((item, i) => (
              <li key={i} className="flex gap-2 text-sm text-white/85">
                <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-cyan" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      );
    default:
      return null;
  }
}