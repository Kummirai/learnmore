/**
 * Bible Reading reader (server layout view).
 *
 * UI-first reader for a single reading plan. Plans are split into 5-chapter
 * sections. You read each chapter (chip toggles done/undone), and once all 5
 * chapters of a section are marked done the inline Bible Quiz for that section
 * unlocks — it is only ever reachable from inside this plan.
 *
 * Demo data is deterministic and seeded per club accent so boards/logs render
 * today. Swap `seedForClub` (lib/bible-quiz) for the Supabase query specified
 * in lib/supabase.ts to go live — nothing else in this file changes.
 */
"use client";

import { useMemo, useState } from "react";
import {
  FaBookOpen,
  FaCheck,
  FaLock,
  FaMedal,
  FaQuestion,
  FaWhatsapp,
} from "react-icons/fa6";
import { getReadingPlan, getPlanSections } from "@/lib/reading-plans";
import { seedForClub } from "@/lib/bible-quiz";

const LAUREL_ICON = "laurel";

const BASE_QUESTIONS: Array<{
  book: string;
  chapter: number;
  question: string;
  options: string[];
  correct: number;
}> = [
  { book: "Genesis", chapter: 1, question: "What did God create on day one?", options: ["Light", "The sun", "Fish", "Adam"], correct: 0 },
  { book: "Genesis", chapter: 2, question: "Where did God plant the garden?", options: ["Eden", "Egypt", "Canaan", "Babel"], correct: 0 },
];

type ReadingSection = {
  id: string;
  planSlug: string;
  title: string;
  book: string;
  startCh: number;
  endCh: number;
  sort: number;
};

type ReadingSectionProgress = {
  sectionId: string;
  completedChapters: number[];
  doneAt: string;
};

type Props = {
  slug: string;
};

export default function BibleReadingReader({ slug }: Props) {
  const plan = getReadingPlan(slug);
  const sections = plan ? getPlanSections(plan) : [];

  const [progress, setProgress] = useState<Record<string, number[]>>({});
  const [unlocked, setUnlocked] = useState<Set<string>>(new Set());
  const [openUnlock, setOpenUnlock] = useState<ReadingSection | null>(null);
  const [openQuiz, setOpenQuiz] = useState<ReadingSection | null>(null);

  if (!plan) {
    return (
      <section className="flex items-center justify-center py-24">
        <p className="text-sm text-slate-gray">That reading plan was not found.</p>
      </section>
    );
  }

  const doneFor = (s: ReadingSection) =>
    (progress[s.id] ?? []).filter((ch) => ch >= s.startCh && ch <= s.endCh).length;

  const unlockedFor = (s: ReadingSection) => unlocked.has(s.id);

  function markRead(s: ReadingSection, ch: number) {
    setProgress((prev) => {
      const mine = prev[s.id] ?? [];
      const next = mine.includes(ch) ? mine.filter((x) => x !== ch) : [...mine, ch];
      const done = next.filter((c) => c >= s.startCh && c <= s.endCh);
      return { ...prev, [s.id]: next };
    });
  }

  return (
    <div className="space-y-5">
      {sections.map((s) => {
        const done = doneFor(s);
        const isUnlocked = unlockedFor(s);
        return (
          <article key={s.id} className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-gray">
                  Section {s.sort} place
                </p>
                <h3 className="text-lg font-black text-navy mt-0.5">{s.title}</h3>
                <p className="text-xs text-slate-gray mt-0.5">
                  {s.book} {s.startCh}–{s.endCh} place
                </p>
              </div>
              <button
                onClick={() => setOpenUnlock(s)}
                disabled={!isUnlocked}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold text-white transition-colors disabled:bg-gray-100 disabled:text-slate-gray"
              >
                {isUnlocked ? (
                  <>
                    <FaQuestion className="text-[11px]" /> Take Bible Quiz
                  </>
                ) : (
                  <>
                    <FaLock className="text-[11px]" /> {done}/5 chapters
                  </>
                )}
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {Array.from({ length: 5 }, (_, i) => {
                const ch = s.startCh + i;
                const isDone = (progress[s.id] ?? []).includes(ch);
                return (
                  <button
                    key={ch}
                    onClick={() => {
                      markRead(s, ch);
                      if (doneFor(s) + 1 >= 5) setUnlocked(new Set(unlocked).add(s.id));
                    }}
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
          </article>
        );
      })}
    </div>
  );
}
