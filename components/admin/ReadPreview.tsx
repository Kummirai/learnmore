"use client";

import { useEffect } from "react";
import { emptyReading } from "@/lib/editor/season";
import type { PubBlock, ReadingMedia, ReadingStructure } from "@/lib/editor/season";

/**
 * App-styled previews of a study day's READ content.
 *
 * `ReadPreview` is a live phone-frame rendering of the structured READ
 * (intro → body → conclusion) that updates as the writer types. `DayPreviewModal`
 * shows the whole day read-only — VERSE, READ, REFLECT and RESPOND.
 */

const EYEBROW = "#13c5dd";

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", { day: "numeric", month: "short", timeZone: "UTC" });
}

function SectionHead({ eyebrow, title, accent }: { eyebrow: string; title: string; accent: string }) {
  return (
    <div className="mb-3.5">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: EYEBROW }}>
        {eyebrow}
      </p>
      <h4 className="mt-1 text-lg font-bold leading-tight" style={{ color: accent }}>
        {title}
      </h4>
    </div>
  );
}

function MediaView({ media }: { media: ReadingMedia }) {
  if (media.type === "image") {
    return (
      <figure className="mb-1.5 overflow-hidden ring-1 ring-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={media.uri} alt={media.caption || ""} className="w-full" />
        {media.caption ? (
          <figcaption className="border-t border-gray-100 bg-alice-blue px-3 py-1.5 text-[11px] text-slate-gray">
            {media.caption}
          </figcaption>
        ) : null}
      </figure>
    );
  }
  return (
    <blockquote className="mb-1.5 rounded-r-xl border-l-4 bg-alice-blue/70 px-3 py-2 text-[13px] italic leading-5 text-slate-gray" style={{ borderLeftColor: EYEBROW }}>
      &ldquo;{media.text}&rdquo;
      {media.by || media.source ? (
        <footer className="mt-1 text-[11px] not-italic text-slate-gray">
          {media.by ? `— ${media.by}` : ""}
          {media.source ? ` · ${media.source}` : ""}
        </footer>
      ) : null}
    </blockquote>
  );
}

function ReadingText({ structure }: { structure: ReadingStructure }) {
  const s = structure ?? emptyReading();
  const intro = s.intro ?? emptyReading().intro;
  const body = s.body ?? [];
  const conclusion = s.conclusion ?? emptyReading().conclusion;
  const media = (m?: ReadingMedia[]) =>
    (m || []).map((x, j) => <MediaView key={j} media={x} />);
  return (
    <div>
      {media(intro.beforeHook)}
      {intro.hook ? <p className="mb-1.5 text-[14px] leading-6 text-gray-700">{intro.hook}</p> : null}
      {media(intro.afterHook)}
      {intro.thesis ? <p className="mb-1.5 text-[14px] leading-6 text-gray-700">{intro.thesis}</p> : null}
      {media(intro.afterThesis)}
      {body.map((item, j) => (
        <div key={j} className="mb-1.5">
          {media(item.beforeTopic)}
          {item.topic ? <p className="text-[14px] leading-6 text-gray-700">{item.topic}</p> : null}
          {media(item.afterTopic)}
          {item.support.length ? (
            <p className="mt-1 text-[14px] leading-6 italic text-slate-gray">{item.support.join(" ")}</p>
          ) : null}
          {media(item.afterSupport)}
          {item.closing ? (
            <p className="mt-1 text-[14px] leading-6 text-gray-700">{item.closing}</p>
          ) : null}
          {media(item.afterClosing)}
        </div>
      ))}
      {media(conclusion.beforeRestate)}
      {conclusion.restate ? <p className="mb-1.5 text-[14px] leading-6 text-gray-700">{conclusion.restate}</p> : null}
      {media(conclusion.afterRestate)}
      {conclusion.whyItMatters ? (
        <p className="mb-1.5 text-[14px] leading-6 text-gray-700">{conclusion.whyItMatters}</p>
      ) : null}
      {media(conclusion.afterWhyItMatters)}
      {conclusion.closing ? (
        <p className="mb-1.5 text-[13px] italic leading-5 text-gray-700">{conclusion.closing}</p>
      ) : null}
      {media(conclusion.afterClosing)}
    </div>
  );
}

function Block({ b, accent }: { b: PubBlock; accent: string }) {
  switch (b.type) {
    case "paragraph":
      return <p className="mb-1.5 text-[14px] leading-6 text-gray-700">{b.text}</p>;
    case "heading":
      return <h4 className="mb-1 mt-2 text-[11px] font-bold uppercase tracking-widest text-gray-700">{b.text}</h4>;
    case "quote":
      return (
        <blockquote className="mb-1.5 border-l-4 pl-3 text-[13px] italic leading-5 text-gray-700" style={{ borderLeftColor: EYEBROW }}>
          {b.text}
          {b.by || b.source ? (
            <footer className="mt-1 text-[11px] not-italic text-slate-gray">
              {b.by ? `— ${b.by}` : ""}
              {b.source ? ` · ${b.source}` : ""}
            </footer>
          ) : null}
        </blockquote>
      );
    case "list":
      return (
        <ul className="mb-1.5 space-y-1">
          {(b.items || []).map((item, i) => (
            <li key={i} className="flex gap-2 text-[14px] leading-6 text-gray-700">
              <span className="mt-[7px] size-1.5 shrink-0 rounded-full" style={{ backgroundColor: accent }} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "reading":
      return <ReadingText structure={b.structure ?? emptyReading()} />;
    case "checklist":
      return (
        <div className="mb-1.5 rounded-xl bg-alice-blue p-3">
          {b.title ? <p className="mb-2 text-[12px] font-bold text-gray-800">{b.title}</p> : null}
          <ul className="space-y-1.5">
            {(b.items || []).map((item, i) => (
              <li key={i} className="flex gap-2 text-[12px] text-gray-600">
                <span className="mt-0.5 size-3.5 shrink-0 rounded border border-gray-300 bg-white" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      );
    case "quiz":
      return (
        <div className="mb-1.5 rounded-xl bg-alice-blue p-3">
          <p className="mb-2 text-[12px] font-bold text-gray-800">{b.question}</p>
          <ul className="space-y-1.5">
            {(b.options || []).map((opt, i) => (
              <li key={i} className="flex gap-2 text-[12px] text-gray-600">
                <span className="mt-1 size-2.5 shrink-0 rounded-full border border-gray-300 bg-white" />
                {opt}
              </li>
            ))}
          </ul>
        </div>
      );
    case "reflection":
      return (
        <div className="mb-1.5 rounded-xl bg-alice-blue p-3">
          <p className="text-[12px] italic text-gray-600">&ldquo;{b.prompt}&rdquo;</p>
          <div className="mt-2 flex h-10 items-center rounded-lg border border-dashed border-gray-300 px-2 text-[11px] text-gray-400">
            {b.placeholder || "Write your answer…"}
          </div>
        </div>
      );
    case "pray":
      return (
        <div className="mb-1.5 rounded-xl bg-navy p-3">
          <p className="mb-2 text-[12px] font-bold text-white">{b.title || "Pray"}</p>
          <ul className="space-y-1.5">
            {(b.items || []).map((item, i) => (
              <li key={i} className="flex gap-2 text-[12px] text-white/85">
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

/** Live phone-frame preview of the structured READ section for one day. */
export function ReadPreview({ structure, accent }: { structure: ReadingStructure; accent: string }) {
  return (
    <div className="mx-auto w-full max-w-[340px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-4 py-3">
        <SectionHead eyebrow="READ" title="The reading" accent={accent} />
      </div>
      <div className="px-4 pb-4">
        <ReadingText structure={structure} />
      </div>
    </div>
  );
}

/** Read-only collection of data needed to render a day in the preview. */
export type DayPreviewData = {
  title: string;
  weekday: string;
  date: string;
  verse?: { text: string; by?: string } | null;
  blocks: PubBlock[];
};

/** Full-day preview: VERSE → READ → REFLECT → RESPOND, read-only. */
export function DayPreview({ day, accent }: { day: DayPreviewData; accent: string }) {
  const readBlocks = day.blocks.filter((b) => !["checklist", "quiz", "reflection", "pray"].includes(b.type));
  const reflectBlocks = day.blocks.filter((b) => ["checklist", "quiz", "reflection"].includes(b.type));
  const prayBlocks = day.blocks.filter((b) => b.type === "pray");

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
        <p className="text-[10px] uppercase tracking-widest text-slate-gray">
          {day.weekday || "—"} · {day.date ? formatDate(day.date) : "no date"}
        </p>
        <h3 className="flex-1 truncate text-sm font-bold text-navy">{day.title || "Untitled day"}</h3>
      </div>

      <div className="px-4 py-4">
        <SectionHead eyebrow="VERSE" title="Today's verse" accent={accent} />
        <div className="mb-6 rounded-xl border-l-4 bg-white p-3.5 ring-1 ring-gray-100" style={{ borderLeftColor: accent }}>
          <p className="text-[14px] leading-6">&ldquo;{day.verse?.text || "No verse set"}&rdquo;</p>
          {day.verse?.by ? <p className="mt-1.5 text-[11px] text-slate-gray">— {day.verse.by}</p> : null}
        </div>

        <SectionHead eyebrow="READ" title="The reading" accent={accent} />
        {readBlocks.length === 0 ? (
          <p className="text-[13px] text-gray-400">No reading content yet.</p>
        ) : (
          readBlocks.map((b, i) => <Block key={i} b={b} accent={accent} />)
        )}

        {reflectBlocks.length ? (
          <div className="mt-6">
            <SectionHead eyebrow="REFLECT" title="Think it over" accent={accent} />
            {reflectBlocks.map((b, i) => <Block key={i} b={b} accent={accent} />)}
          </div>
        ) : null}

        {prayBlocks.length ? (
          <div className="mt-6">
            <SectionHead eyebrow="RESPOND" title="Respond & share" accent={accent} />
            {prayBlocks.map((b, i) => <Block key={i} b={b} accent={accent} />)}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** Full-day preview modal: VERSE → READ → REFLECT → RESPOND, read-only. */
export function DayPreviewModal({
  open,
  onClose,
  day,
  accent,
}: {
  open: boolean;
  onClose: () => void;
  day: DayPreviewData | null;
  accent: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !day) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-navy/60 p-4" onClick={onClose}>
      <div
        className="mx-auto my-8 w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <DayPreview day={day} accent={accent} />
        <button
          onClick={onClose}
          className="w-full border-t border-gray-100 py-3 text-sm font-semibold text-slate-gray hover:bg-alice-blue"
        >
          Close preview
        </button>
      </div>
    </div>
  );
}