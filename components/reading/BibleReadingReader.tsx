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

import { useState } from "react";
import {
  FaBookOpen,
  FaCheck,
  FaLock,
  FaQuoteLeft,
} from "react-icons/fa6";
import type { RelateReadingPlan } from "@/lib/reading-plans";
import type { ReadingSection } from "@/lib/reading-plans";
import type { PubBlock, ReadingMedia, ReadingStructure } from "@/lib/editor/season";
import { emptyReading } from "@/lib/editor/season";

type Props = {
  plan: RelateReadingPlan;
  sections: ReadingSection[];
};

export default function BibleReadingReader({ plan, sections }: Props) {
  const [progress, setProgress] = useState<Record<string, number[]>>({});
  const [compactDone, setCompactDone] = useState<Set<string>>(new Set());
  const maxCh = (s: ReadingSection) => (s.endCh ?? s.startCh ?? 1) - (s.startCh ?? 1) + 1;

  if (!plan) {
    return (
      <section className="flex items-center justify-center py-24">
        <p className="text-sm text-slate-gray">That reading plan was not found.</p>
      </section>
    );
  }

  // Topic plans: no chapter book range — simple per-day "mark read".
  const isCompact = (s: ReadingSection) => !s.book && s.startCh == null;

  const doneChapters = (s: ReadingSection) =>
    (progress[s.id] ?? []).filter((ch) => ch >= (s.startCh ?? 0) && ch <= (s.endCh ?? 0)).length;

  const unlockedFor = (s: ReadingSection) =>
    isCompact(s) ? compactDone.has(s.id) : doneChapters(s) >= Math.max(1, maxCh(s));

  function markRead(s: ReadingSection, ch: number) {
    setProgress((prev) => {
      const mine = prev[s.id] ?? [];
      const next = mine.includes(ch) ? mine.filter((x) => x !== ch) : [...mine, ch];
      return { ...prev, [s.id]: next };
    });
  }

  function toggleCompact(s: ReadingSection) {
    setCompactDone((prev) => {
      const next = new Set(prev);
      if (next.has(s.id)) next.delete(s.id);
      else next.add(s.id);
      return next;
    });
  }

  return (
    <div className="space-y-6">
      {sections.map((s) => {
        const unlocked = unlockedFor(s);
        return (
          <article key={s.id} className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-gray">
                  {isCompact(s) ? `Day ${s.sort + 1} · ${plan.section || "Read"}` : `Section ${s.sort + 1} of ${sections.length}`}
                </p>
                <h3 className="text-lg font-black text-navy mt-0.5">{s.title || (isCompact(s) ? `Day ${s.sort + 1}` : "Untitled section")}</h3>
                {!isCompact(s) ? (
                  <p className="text-xs text-slate-gray mt-0.5">
                    {[s.book, s.startCh != null && s.endCh != null ? `${s.startCh}–${s.endCh}` : ""].filter(Boolean).join(" ") || "Reading"}
                  </p>
                ) : null}
              </div>

              {/* Complete / progress pill */}
              {unlocked ? (
                <button className="inline-flex items-center gap-2 rounded-full bg-cyan px-4 py-2 text-xs font-bold text-navy transition-colors hover:bg-cyan-dark">
                  <FaCheck className="text-[11px]" /> {isCompact(s) ? "Complete" : "All chapters read"}
                </button>
              ) : (
                <button className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-xs font-bold text-slate-gray">
                  <FaLock className="text-[11px]" />
                  {isCompact(s) ? "Mark as read" : `${doneChapters(s)}/${maxCh(s)} chapters`}
                </button>
              )}
            </div>

            {/* Verse of the day */}
            {s.verseText ? (
              <div className="mt-4 rounded-xl border-l-4 bg-alice-blue/50 p-3.5 ring-1 ring-gray-100" style={{ borderLeftColor: "#13c5dd" }}>
                <p className="text-[11px] font-bold uppercase tracking-widest text-cyan mb-1">Today&apos;s verse</p>
                <p className="text-sm leading-6 text-navy">
                  <FaQuoteLeft className="mr-1 inline text-slate-gray" />
                  {s.verseText}
                </p>
                {s.verseBy ? <p className="mt-1 text-xs font-semibold text-slate-gray">— {s.verseBy}</p> : null}
              </div>
            ) : null}

            {/* Authored commentary / reading content */}
            {s.blocks && s.blocks.length ? (
              <div className="mt-4 space-y-3">
                {s.blocks.map((b, i) => (
                  <BlockView key={i} b={b} />
                ))}
              </div>
            ) : null}

            {/* Bible chapter chips (only when the section has a book range) */}
            {!isCompact(s) && s.startCh != null && s.endCh != null ? (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {Array.from({ length: maxCh(s) }, (_, i) => {
                  const ch = (s.startCh ?? 1) + i;
                  const isDone = (progress[s.id] ?? []).includes(ch);
                  return (
                    <button
                      key={ch}
                      onClick={() => markRead(s, ch)}
                      aria-pressed={isDone}
                      className="size-9 rounded-lg text-[11px] font-bold border transition-colors"
                      style={
                        isDone
                          ? { backgroundColor: "#065f46", borderColor: "#065f46", color: "#fff" }
                          : { borderColor: "#e5e7eb", color: "#334155" }
                      }
                    >
                      {ch}
                    </button>
                  );
                })}
              </div>
            ) : null}

            {/* Topic-plan simple read toggle */}
            {isCompact(s) ? (
              <div className="mt-4">
                <button
                  onClick={() => toggleCompact(s)}
                  aria-pressed={compactDone.has(s.id)}
                  className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition-colors"
                  style={
                    compactDone.has(s.id)
                      ? { backgroundColor: "#065f46", borderColor: "#065f46", color: "#fff" }
                      : { borderColor: "#e5e7eb", color: "#334155" }
                  }
                >
                  {compactDone.has(s.id) ? <FaCheck /> : <FaBookOpen className="text-slate-gray" />}
                  {compactDone.has(s.id) ? "Day read" : "Mark day as read"}
                </button>
              </div>
            ) : null}
          </article>
        );
      })}

      {!sections.length ? (
        <p className="rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-slate-gray">
          No sections yet for this plan.
        </p>
      ) : null}
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

function BlockView({ b }: { b: PubBlock }) {
  switch (b.type) {
    case "reading":
      return <ReadingView structure={b.structure ?? emptyReading()} />;
    case "paragraph":
      return <p className="text-sm leading-6 text-gray-700">{b.text}</p>;
    case "heading":
      return <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-700 mt-3 -mb-1">~ {b.text}</h4>;
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
      return (
        <div className="rounded-xl bg-alice-blue p-3">
          {b.title ? <p className="mb-2 text-sm font-bold text-gray-800">{b.title}</p> : null}
          <ul className="space-y-1.5">
            {(b.items || []).map((item, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-600">
                <span className="mt-0.5 size-3.5 shrink-0 rounded border border-gray-300 bg-white" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      );
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
          {b.title ? <p className="mb-2 text-sm font-bold text-white">{b.title}</p> : null}
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