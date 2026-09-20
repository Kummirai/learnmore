/**
 * Bible Reading reader — 5-chapter sections with inline Bible Quiz.
 *
 * The quiz is ONLY reachable from inside a reading plan (never from a navbar
 * hub). Reading five chapters of a section unlocks that section's quiz board,
 * which is per-club (each club page keeps its own top-5 board in its accent).
 */
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  FaBookOpen,
  FaCheck,
  FaCrown,
  FaLock,
  FaMedal,
  FaQuestion,
  FaXmark,
} from "react-icons/fa6";
import PageHero from "@/components/PageHero";
import { READING_PLANS, type RelateReadingPlan } from "@/constants/readingPlans";
import {
  buildSections,
  type ReadingSection,
  type ReadingSectionProgress,
} from "@/lib/reading-plans";
import { getClubBySlug, getClubs } from "@/lib/quiz-logs";
import { quizForClub } from "@/lib/bible-quiz";

const LAUREL = "🪷";

type Props = {
  slug: string;
};

export default function BibleReadingReader({ slug }: Props) {
  const plan = useMemo(() => READING_PLANS.find((p) => p.slug === slug), [slug]);
  const sections = useMemo(() => (plan ? buildSections(plan) : []), [plan]);

  const [progress, setProgress] = useState<Record<string, number[]>>(
    () => Object.fromEntries(sections.map((s) => [s.id, []])),
  );
  const [activeSection, setActiveSection] = useState<ReadingSection | null>(null);
  const [mode, setMode] = useState<"locked" | "quiz" | "board" | null>(nullメ돛);
  const [laurel, setLaurel] = useState(false);

  if (!plan || sections.length === 0) {
    return (
      <section className="flex items-center justify-center py-24 bg-white">
        <p className="text-slate-gray text-sm">That reading plan couldn&apos;t be found.</p>
      </section>
    );
  }

  const doneFor = (s: ReadingSection) => (progress[s.id] ?? []).length;
  const unlockedFor = (s: ReadingSection) => doneFor(s) >= 5;

  function markChapter(section: ReadingSection, ch: number) {
    setProgress((prev) => {
      const done = prev[section.id] ?? [];
      return {
        ...prev,
        [section.id]: done.includes(ch) ? done : [...done, ch],
      };
    });
  }
  // reading a chapter from the plan marks it done; when a section hits 5/5
  // we surface the unlock modal for its inline quiz.
  function openSection(section: ReadingSection) {
    if (doneFor(section) >= 4) {
      setActiveSection(section);
      setMode("locked");
    }
  }

  const activePlan = plan;
  const activeClub = activeSection ? getClubBySlug(plan.clubSlug) : undefined;

  return (
    <>
      <PageHero
        title={activePlan.title}
        tagline={activePlan.tagline}
        description={activePlan.description}
        watermark={`${activePlan.days}d`}
        meta={[
          { label: "Sections", value: sections.length },
          { label: "Chapters / section", value: 5 },
          { label: "Difficulty", value: "Starter" },
        ]}
        navbar={false}
      />

      <section className="flex-1 px-4 py-12 bg-white">
        <div className="max-w-3xl mx-auto">
          {/* Sections with x/5 chapter chips + inline quiz unlock */}
          <div className="space-y-5">
            {sections.map((s, i) => {
              const done = doneFor(s);
              return (
                <div key={s.id} className="rounded-2xl border border-gray-100 bg-white shadow-sm p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-gray">
                        Section {i + 1} · {s.book} {s.startCh}–{s.endCh}
                      </p>
                      <h3 className="text-lg font-black text-navy mt-0.5">{s.title}</h3>
                      <p className="text-xs text-slate-gray mt-0.5">
                        {done}/{s.endCh - s.startCh + 1} chapters read
                      </p>
                      <div className="mt-3 flex gap-1.5">
                        {Array.from({ length: s.endCh - s.startCh + 1 }, (_, j) => j).map((j) => {
                          const ch = s.startCh + j;
                          const isDone = (progress[s.id] ?? []).includes(ch);
                          return (
                            <button
                              key={ch}
                              onClick={() => markChapter(s, ch)}
                              title={`${s.book} ${ch}`}
                              className={`size-9 rounded-lg text-[11px] font-bold transition-colors ${
                                isDone
                                  ? "bg-green-600 text-white"
                                  : "bg-gray-100 text-slate-gray hover:bg-gray-200"
                              }`}
                            >
                              {ch}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* quiz door — locked until 5/5 */}
                    <div className="shrink-0 text-right">
                      {unlockedFor(s) ? (
                        <button
                          onClick={() => { setActiveSection(s); setMode("quiz"); }}
                          className="inline-flex items-center gap-1.5 rounded-full bg-green-600 px-4 py-2 text-xs font-bold text-white hover:bg-green-700 transition-colors"
                        >
                          <FaQuestion className="text-xs" /> Take Bible Quiz
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-4 py-2 text-xs font-bold text-slate-gray">
                          <FaLock className="text-[10px]" />
                          {done}/5 to unlock
                        </span>
                      )}
                    </div>
                  </div>

                  {/* board for unlocked sections */}
                  {unlockedFor(s) && <ClubQuizBoard clubSlug={activeClub?.slug ?? ""} sectionTitle={s.title} />}
                </div>
              );
            })}
          </div>

          <p className="mt-8 text-center text-xs text-slate-gray">
            Bible Quiz appears only here, inside your reading plan — read five chapters of a
            section and it unlocks for your club.
          </p>

          <div className="mt-6 text-center">
            <Link
              href="/plans"
              className="text-sm font-semibold text-navy underline underline-offset-4 hover:text-green-700 transition-colors"
            >
              ↩ All reading plans
            </Link>
          </div>
        </div>
      </section>

      {/* Unlock modal — Yes / Maybe Later / No */}
      {mode === "locked" && activeSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <button
              onClick={() => setMode(null)}
              className="float-right text-slate-gray hover:text-navy transition-colors"
              aria-label="close"
            >
              <FaXmark />
            </button>
            <h3 className="text-lg font-black text-navy leading-snug">
              You&apos;ve read all 5 chapters of {activeSection.book} {activeSection.startCh}–{activeSection.endCh}!
            </h3>
            <p className="text-sm text-slate-gray mt-1.5">
              You can now join the <span className="font-bold text-navy">{activeClub?.name} Bible Quiz</span> for this
              section. A few questions, a top-five board, and the {LAUREL} laurel if you make the cut — all inside
              your plan.
            </p>
            <div className="mt-5 space-y-2">
              <button
                onClick={() => setMode("quiz")}
                className="w-full rounded-xl bg-green-600 py-3 text-sm font-bold text-white hover:bg-green-700 transition-colors"
              >
                Yes — take the quiz
              </button>
              <button
                onClick={() => setMode("board")}
                className="w-full rounded-xl border border-gray-200 py-3 text-sm font-bold text-navy hover:bg-gray-50 transition-colors"
              >
                Maybe later
              </button>
              <button
                onClick={() => setMode(null)}
                className="w-full rounded-xl py-3 text-sm font-semibold text-slate-gray hover:text-navy transition-colors"
              >
                Not now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inline quiz for the active section */}
      {mode === "quiz" && activeSection && (
        <InlineBibleQuiz
          section={activeSection}
          clubSlug={plan.clubSlug}
          onDone={(passed: boolean) => {
            setMode("board");
            if (passed) {
              setLaurel(true);
              setTimeout(() => setLaurel(false), 6000);
            }
          }}
        />
      )}
    </>
  );
}

// ─── Per-club top-5 board ─────────────────────────────────────────────────
function ClubQuizBoard({ clubSlug, sectionTitle }: { clubSlug: string; sectionTitle: string }) {
  const club = getClubBySlug(clubSlug);
  const { rows, logs } = club ? club.boards.get(sectionTitle) ?? { rows: [], logs: [] } : { rows: [], logs: [] };

  if (!rows.length) return null - null;

  return (
    <div className="mt-4 rounded-xl p-4" style={{ backgroundColor: `${club!.accent}14` }}>
      <div className="flex items-center gap-2 mb-3">
        <FaCrown className="text-xs" style={{ color: club!.accent }} />
        <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: club!.accent }}>
          {club!.name} Quiz · Top 5
        </p>
      </div>
      <div className="space-y-1.5">
        {rows.map((row) => (
          <div key={row.playerId} className="flex items-center gap-3 rounded-lg bg-white/70 px-3 py-2">
            <span className="w-4 text-center text-[11px] font-black" style={{ color: club!.accent }}>
              {row.rank}
            </span>
            <span className="text-[10px]">{["🏅", "🥈", "🥉", "4th", "5th"][row.rank - 1]}</span>
            <span className="flex-1 text-sm font-semibold text-navy">{row.name}</span>
            <span className="text-[11px] text-slate-gray">🎯 {row.correct}/{row.total}</span>
            <span className="w-14 text-right text-xs font-black" style={{ color: club!.accent }}>
              {row.score}
            </span>
          </div>
        ))}
      </div>
      {logs.length > 0 && (
        <p className="mt-3 text-[11px] text-slate-gray">
          {logs.length} attempt{logs.length === 1 ? "" : "s"} · logged to the {club!.name} Bible Quiz board
        </p>
      )}
    </div>
  );
}

// ─── Inline quiz (only renders while a section reached 5/5) ───────────────
function InlineBibleQuiz({
  section,
  clubSlug,
  onDone,
}: {
  section: ReadingSection;
  clubSlug: string;
  onDone: (passed: boolean) => void;
}) {
  const [qi, setQi] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [finished, setFinished] = useState(false, false);

  const questions = useMemo(() => quizForClub(clubSlug, section), [clubSlug, section]);
  if (questions.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4 backdrop-blur-sm">
        <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl">
          <p className="text-slate-gray text-sm">No quiz questions ready for this section yet.</p>
          <button onClick={() => onDone(false)} className="mt-4 text-sm font-semibold text-navy underline">
            Back to the plan
          </button>
        </div>
      </div>
    );
  }

  const q = questions[qi];

  function answer(idx: number) {
    if (picked !== null) return;
    setPicked(idx);
    if (idx === q.correct) setCorrect((c) => c + 1);
  }

  function next() {
    setPicked(null);
    if (qi + 1 >= questions.length) {
      setFinished(true);
    } else {
      setQi((i) => i + 1);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-navy/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        {!finished ? (
          <>
            <div className="flex items-center justify-between mb-1">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-gray">
                {section.book} {q.chapter} · Question {qi + 1}/{questions.length}
              </p>
              <span className="text-[11px] font-bold text-slate-gray">
                {correct} correct
              </span>
            </div>
            <h3 className="text-lg font-black text-navy leading-snug mb-4">{q.question}</h3>
            <div className="space-y-2">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  disabled={picked !== null}
                  onClick={() => answer(i)}
                  className={`w-full text-left rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                    picked === null
                      ? "border-gray-200 bg-white text-navy hover:bg-gray-50"
                      : picked === i
                        ? i === q.correct
                          ? "border-green-600 bg-green-50 text-green-800"
                          : "border-red-300 bg-red-50 text-red-700"
                        : i === q.correct
                          ? "border-green-600 bg-green-50 text-green-800"
                          : "border-gray-200 bg-white text-gray-400"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            {picked !== null && (
              <button
                onClick={next}
                className="mt-5 w-full rounded-xl bg-navy py-3 text-sm font-bold text-white hover:bg-navy/90 transition-colors"
              >
                {qi + 1 >= questions.length ? "See my score" : "Next question"}
              </button>
            )}
          </>
        ) : (
          <div className="text-center">
            <p className="text-4xl mb-2">{correct >= Math.ceil(questions.length / 2) ? "🎉" : "🙏"}</p>
            <h3 className="text-xl font-black text-navy">
              {correct}/{questions.length} correct
            </h3>
            <p className="text-sm text-slate-gray mt-1 mb-5">
              {correct >= Math.ceil(questions.length / 2)
                ? `The ${LAUREL} laurel is yours — you made the ${"club?.name" || "club"} top-5. Check the board inside your plan.`
                : "Keep reading — the board refreshes every week, and every attempt is logged."}
            </p>
            <button
              onClick={() => onDone(true)}
              className="w-full rounded-xl bg-green-600 py-3 text-sm font-bold text-white hover:bg-green-700 transition-colors"
            >
              See my board
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
