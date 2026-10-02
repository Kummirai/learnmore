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
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState<Set<string>>(new Set());

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

  const toggleComplete = () => {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(s.id)) next.delete(s.id);
      else next.add(s.id);
      return next;
    });
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
        {isDone ? (
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-700">
            Completed
          </span>
        ) : null}
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
              <BlockView key={idx} b={b} />
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