"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LuCircleCheck,
  LuLoaderCircle,
  LuLogIn,
  LuRotateCcw,
  LuTrophy,
} from "react-icons/lu";
import {
  type PortalQuizQuestion,
  type PortalYear,
  QUIZ_PASS_SCORE,
  QUIZ_TOTAL,
  QUIZ_XP_PER_POINT,
} from "@/lib/programming-portal";

type BestResult = { score: number; total: number; attempts: number; passed: boolean };

/**
 * End-of-year 3-question concept check. Instant Teal/Red feedback per answer,
 * then a results card that awards bonus XP through the portal API.
 */
export default function QuizPanel({
  year,
  best,
  busy,
  signedIn,
  onSubmit,
}: {
  year: PortalYear;
  best?: BestResult;
  busy: boolean;
  signedIn: boolean;
  onSubmit: (score: number) => Promise<void>;
}) {
  const quiz = year.quiz;
  const [stage, setStage] = useState<"idle" | "playing" | "result">("idle");
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [saved, setSaved] = useState(false);
  const [localBusy, setLocalBusy] = useState(false);

  const question: PortalQuizQuestion = quiz.questions[index];
  const isLast = index === quiz.questions.length - 1;
  const passed = score >= QUIZ_PASS_SCORE;
  const bestScore = best?.score ?? 0;
  const isNewBest = score > bestScore;
  const earnedXp = isNewBest ? score * QUIZ_XP_PER_POINT : 0;

  function start() {
    setStage("playing");
    setIndex(0);
    setPicked(null);
    setScore(0);
    setSaved(false);
  }

  function choose(optionIndex: number) {
    if (picked !== null) return;
    setPicked(optionIndex);
    if (optionIndex === question.correctIndex) {
      setScore((s) => s + 1);
    }
  }

  function next() {
    setPicked(null);
    if (isLast) {
      setStage("result");
      return;
    }
    setIndex((i) => i + 1);
  }

  async function save() {
    setLocalBusy(true);
    try {
      await onSubmit(score);
      setSaved(true);
    } catch {
      /* parent hook surfaces the error */
    } finally {
      setLocalBusy(false);
    }
  }

  if (stage === "idle") {
    return (
      <section className={"portal-card p-5 md:p-6"} aria-label={"Concept check"}>
        <span
          className={
            "text-[11px] font-bold uppercase tracking-widest text-teal"
          }
        >
          Concept check
        </span>
        <h2 className={"mt-1 text-xl font-black text-white"}>{quiz.title}</h2>
        <p className={"mt-2 text-sm leading-relaxed text-white/60"}>
          {QUIZ_TOTAL} quick questions on what you learned this year. Answer
          {QUIZ_PASS_SCORE}+ correctly to pass — every new best score earns
          bonus XP.
        </p>
        {best ? (
          <p
            className={
              "mt-3 inline-block border border-teal/40 bg-teal/10 px-3 py-1 text-xs font-bold text-teal-glow"
            }
          >
            Best score: {best.score}/{best.total}
            {best.passed ? " · Passed ✓" : " · Keep going!"}
          </p>
        ) : null}
        <button
          type={"button"}
          onClick={start}
          className={"portal-btn portal-btn-primary mt-4"}
        >
          {best ? "Retake quiz" : "Start the quiz"}
        </button>
      </section>
    );
  }

  if (stage === "playing") {
    return (
      <section
        className={"portal-card p-5 md:p-6"}
        aria-label={"Concept check in progress"}
      >
        <div className={"flex items-center justify-between gap-3"}>
          <span
            className={
              "text-[11px] font-bold uppercase tracking-widest text-teal"
            }
          >
            {quiz.title}
          </span>
          <span className={"font-code text-xs text-white/50"}>
            Question {index + 1} of {QUIZ_TOTAL}
          </span>
        </div>

        <div
          className={
            "mt-3 h-1.5 w-full border border-portal-line bg-portal-ink"
          }
          aria-hidden={"true"}
        >
          <div
            className={"h-full bg-teal transition-[width] duration-300"}
            style={{
              width: `${((index + (picked !== null ? 1 : 0)) / QUIZ_TOTAL) * 100}%`,
            }}
          />
        </div>

        <h3 className={"mt-4 text-base font-bold leading-snug text-white"}>
          {question.prompt}
        </h3>

        <ul className={"mt-4 space-y-2"}>
          {question.options.map((option, optionIndex) => {
            const isCorrect = optionIndex === question.correctIndex;
            const revealed = picked !== null;
            let cls =
              "border-portal-line bg-portal-ink text-white/85 hover:border-teal";
            if (revealed && isCorrect)
              cls = "border-teal bg-teal/20 text-teal-glow";
            else if (revealed && optionIndex === picked)
              cls = "border-red-500/70 bg-red-500/15 text-red-300";
            else if (revealed) cls = "border-portal-line bg-portal-ink text-white/40";
            return (
              <li key={optionIndex}>
                <button
                  type={"button"}
                  onClick={() => choose(optionIndex)}
                  disabled={revealed}
                  className={
                    "flex w-full items-center gap-3 border px-4 py-3 text-left text-sm font-semibold transition-colors " +
                    cls
                  }
                >
                  <span
                    className={
                      "font-code grid size-6 shrink-0 place-items-center border border-current text-[11px] font-black"
                    }
                  >
                    {String.fromCharCode(65 + optionIndex)}
                  </span>
                  {option}
                  {revealed && isCorrect ? (
                    <LuCircleCheck className={"ml-auto size-4 shrink-0"} />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>

        {picked !== null ? (
          <div className={"mt-4 flex flex-wrap items-center gap-3"}>
            <p
              className={
                "flex-1 text-sm leading-relaxed " +
                (picked === question.correctIndex
                  ? "text-teal-glow"
                  : "text-red-300")
              }
            >
              {picked === question.correctIndex ? "Correct! " : "Not quite. "}
              {question.explain}
            </p>
            <button
              type={"button"}
              onClick={next}
              className={"portal-btn portal-btn-primary"}
            >
              {isLast ? "See my result" : "Next question"}
            </button>
          </div>
        ) : null}
      </section>
    );
  }

  return (
    <section className={"portal-card p-5 md:p-6"} aria-label={"Quiz result"}>
      <span
        className={
          "text-[11px] font-bold uppercase tracking-widest text-teal"
        }
      >
        Result
      </span>
      <div className={"mt-2 flex flex-wrap items-center gap-4"}>
        <p
          className={
            "font-code text-4xl font-black " +
            (passed ? "text-teal-glow" : "text-red-400")
          }
        >
          {score}/{QUIZ_TOTAL}
        </p>
        <div>
          <p
            className={
              passed
                ? "text-lg font-black text-teal-glow"
                : "text-lg font-black text-red-400"
            }
          >
            {passed ? "Passed — well done!" : "Not yet — try again!"}
          </p>
          <p className={"text-sm text-white/60"}>
            {isNewBest
              ? `New best score! +${earnedXp} XP`
              : bestScore > 0
                ? `Your best stays ${bestScore}/${QUIZ_TOTAL} — beat it to earn more XP.`
                : `Pass score is ${QUIZ_PASS_SCORE}/${QUIZ_TOTAL}.`}
          </p>
        </div>
      </div>

      <div className={"mt-5 flex flex-wrap gap-3"}>
        <button
          type={"button"}
          onClick={start}
          className={"portal-btn portal-btn-ghost"}
        >
          <LuRotateCcw className={"size-4"} />
          Retake
        </button>
        {!signedIn ? (
          <Link
            href={
              "/signin?next=/sprout-tweens/skills/sprout_03_programming/learn"
            }
            className={"portal-btn portal-btn-primary"}
          >
            <LuLogIn className={"size-4"} />
            Sign in to save your score
          </Link>
        ) : !saved ? (
          <button
            type={"button"}
            onClick={save}
            disabled={busy || localBusy}
            className={"portal-btn portal-btn-primary"}
          >
            {busy || localBusy ? (
              <LuLoaderCircle className={"size-4 animate-spin"} />
            ) : (
              <LuTrophy className={"size-4"} />
            )}
            Save score{isNewBest && earnedXp > 0 ? ` (+${earnedXp} XP)` : ""}
          </button>
        ) : (
          <span
            className={
              "inline-flex items-center gap-2 border border-teal bg-teal/15 px-4 py-2.5 text-sm font-bold text-teal-glow"
            }
          >
            <LuCircleCheck className={"size-4"} />
            Score saved
          </span>
        )}
      </div>
    </section>
  );
}
