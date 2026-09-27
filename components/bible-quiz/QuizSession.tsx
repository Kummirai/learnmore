"use client"

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { MEMBER_STORAGE_KEY, parseMembershipJson } from "@/lib/membership";
import { FaArrowRight, FaCircleCheck, FaCrown, FaTrophy } from "react-icons/fa6";
import { LuChevronDown, LuLoaderCircle } from "react-icons/lu";
import { SEASON_QUIZ } from "@/lib/season";
import { startHubAttempt, submitHubAttempt, type AttemptResult, type StartedAttempt } from "@/lib/quiz-api";
import { QUIZ_CLUBS, quizClubBySlug, type QuizClub } from "./quiz-clubs";

const { book, chapters, bookLabel } = SEASON_QUIZ;
const LETTERS = ["A", "B", "C", "D"] as const;
const NAME_KEY = "relateHubName";
const QUESTION_COUNT = 10;

function formatTime(ms: number): string {
    const s = Math.round(ms / 1000);
    return `${Math.floor(s / 60)}m ${s % 60}s`;
}

function answeredCount(answers: number[]): number {
    return answers.filter((a) => a >= 0).length;
}

export default function QuizSession({ initialClub }: { initialClub?: string }) {
    const [club, setClub] = useState<QuizClub | null>(() => quizClubBySlug(initialClub) ?? null);
    const [name, setName] = useState<string>(() => {
        try {
            const saved = localStorage.getItem(NAME_KEY);
            if (saved) return saved;
            // Club members are already known — start with their name.
            return parseMembershipJson(localStorage.getItem(MEMBER_STORAGE_KEY) ?? undefined)?.name ?? "";
        } catch {
            return "";
        }
    });
    const [stage, setStage] = useState<"setup" | "playing" | "result">("setup");
    const [attempt, setAttempt] = useState<StartedAttempt | null>(null);
    const [idx, setIdx] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [busy, setBusy] = useState(false);
    const [hostedError, setHostedError] = useState(false);
    const [result, setResult] = useState<AttemptResult | null>(null);
    const startedAtRef = useRef(0);

    const begin = useCallback(
        async (chosen: QuizClub, entered: string) => {
            setBusy(true);
            try {
                const started = await startHubAttempt(chosen.slug, entered, QUESTION_COUNT);
                setAttempt(started);
                setAnswers(new Array(started.questions.length).fill(-1));
                setIdx(0);
                setTimeLeft(started.secondsPerQuestion);
                startedAtRef.current = Date.now();
                setStage("playing");
            } catch {
                setHostedError(true);
            } finally {
                setBusy(false);
            }
        },
        [],
    );

    const finish = useCallback(
        async (finalAnswers: number[]) => {
            if (!attempt) return;
            setBusy(true);
            const duration = Date.now() - startedAtRef.current;
            const res = await submitHubAttempt(attempt, finalAnswers, duration);
            setResult(res);
            if (!res.hosted) setHostedError(true);
            setStage("result");
            setBusy(false);
            try {
                localStorage.setItem(NAME_KEY, name || attempt.name);
            } catch {
                /* ignore */
            }
        },
        [attempt, name],
    );

    const advance = useCallback(
        (answer: number) => {
            const next = [...answers];
            next[idx] = answer;
            if (idx + 1 >= next.length) {
                void finish(next);
                return;
            }
            setAnswers(next);
            setIdx(idx + 1);
            setTimeLeft(attempt?.secondsPerQuestion ?? 30);
        },
        [answers, attempt?.secondsPerQuestion, finish, idx],
    );

    // Per-question countdown — automatically times out unanswered questions.
    useEffect(() => {
        if (stage !== "playing" || !attempt) return;
        if (answers[idx] !== -1) return;
        if (timeLeft <= 0) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            advance(-1);
            return;
        }
        const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stage, attempt, idx, answers, timeLeft]);

    const reset = () => {
        setAttempt(null);
        setAnswers([]);
        setIdx(0);
        setResult(null);
        setHostedError(false);
        setStage("setup");
    };

    const current = attempt?.questions[idx];
    const answerLocked = current !== undefined && answers[idx] >= 0;

    return (
        <div className="mx-auto w-full max-w-2xl px-4 sm:px-6 py-12">
            {/* Header */}
            <div className="mb-8 text-center">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f5b82e]/15 text-[#b8860b] px-3 py-1 text-[11px] font-bold uppercase tracking-widest">
                    <FaCrown className="text-[11px]" /> {bookLabel} · Summer Bible Quiz
                </span>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-navy mt-4">
                    {stage === "setup" && "Play the quiz"}
                    {stage === "playing" && "Answer the round"}
                    {stage === "result" && "Round complete"}
                </h1>
                <p className="text-sm text-slate-gray mt-2">
                    {stage === "setup" && `${QUESTION_COUNT} questions on ${book} ${chapters} · 30s each · one score counts for the week`}
                    {stage === "playing" && `${book} ${chapters} · answers are scored on the club & season boards`}
                    {stage === "result" && result?.hosted ? "Your score is on the live club & season boards." : "Demo round — connect to the live board to save your score."}
                </p>
            </div>

            {stage === "setup" && (
                <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 md:p-8">
                    {/* Club picker */}
                    <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">Play for your club</p>
                    <div className="grid grid-cols-1 min-[380px]:grid-cols-2 sm:grid-cols-3 gap-2" role="group" aria-label="Choose your club">
                        {QUIZ_CLUBS.map((c) => {
                            const selected = club?.slug === c.slug;
                            return (
                                <button
                                    key={c.slug}
                                    type="button"
                                    onClick={() => setClub(c)}
                                    aria-pressed={selected}
                                    className="flex flex-col items-start gap-1 rounded-xl border px-4 py-3 text-left transition-colors"
                                    style={{
                                        borderColor: selected ? c.accent : "#eceff1",
                                        backgroundColor: selected ? `${c.accent}0f` : "#ffffff",
                                        boxShadow: selected ? `inset 0 0 0 1.5px ${c.accent}` : undefined,
                                    }}
                                >
                                    <span className="text-sm font-bold" style={{ color: selected ? c.accent : "#101c33" }}>
                                        {c.name}
                                    </span>
                                    <span className="text-[11px] text-gray-400">{c.tagline}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Name */}
                    <label className="block mt-6">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Your name</span>
                        <input
                            type="text"
                            autoComplete="name"
                            value={name}
                            onChange={(e) => setName(e.target.value.slice(0, 40))}
                            placeholder="How your club board should show you"
                            className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 text-base md:text-sm outline-none focus:border-[#f5b82e] focus:ring-2 focus:ring-[#f5b82e]/30 bg-white"
                        />
                    </label>

                    {hostedError && (
                        <p role="alert" className="mt-4 text-xs text-red-600">We could not reach the quiz server — the round will run locally and won&apos;t reach the live board.</p>
                    )}

                    <button
                        type="button"
                        disabled={busy || !club || !name.trim()}
                        onClick={() => club && begin(club, name.trim())}
                        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-navy px-6 py-3.5 font-semibold text-sm text-white transition-colors hover:bg-navy-dark disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        {busy ? <LuLoaderCircle className="animate-spin" /> : "Start the round"}
                        {!busy && <FaArrowRight className="text-xs" />}
                    </button>
                </div>
            )}

            {stage === "playing" && attempt && current && (
                <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                    {/* Progress bar */}
                    <div className="h-1.5 bg-gray-100">
                        <div
                            className="h-full transition-all duration-500"
                            style={{
                                width: `${(answeredCount(answers) / attempt.questions.length) * 100}%`,
                                background: `linear-gradient(90deg, ${club?.accent ?? "#f5b82e"}, ${club?.accent ?? "#f5b82e"}cc)`,
                            }}
                        />
                    </div>

                    <div className="p-6 md:p-8">
                        {/* Question meta */}
                        <div className="flex items-center justify-between gap-3">
                            <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold" style={{ backgroundColor: `${club?.accent ?? "#f5b82e"}14`, color: club?.accent ?? "#b8860b" }}>
                                {club?.name} · {attempt.name}
                            </span>
                            <span className="text-xs tabular-nums text-gray-400">
                                {idx + 1} / {attempt.questions.length} · {answeredCount(answers)} answered
                            </span>
                        </div>

                        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-navy mt-5 leading-snug">{current.text}</h2>
                        <p className="text-xs text-gray-400 mt-1.5">{current.bookLabel}</p>

                        {/* Options */}
                        <div className="mt-6 space-y-2.5" role="group" aria-label="Answers">
                            {current.options.map((option, i) => {
                                const isChosen = answers[idx] === i;
                                return (
                                    <button
                                        key={i}
                                        type="button"
                                        disabled={answerLocked}
                                        onClick={() => advance(i)}
                                        aria-pressed={isChosen}
                                        className="flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition-all disabled:cursor-default"
                                        style={{
                                            borderColor: isChosen ? club?.accent ?? "#f5b82e" : "#e9edf0",
                                            backgroundColor: isChosen ? `${club?.accent ?? "#f5b82e"}0f` : "#ffffff",
                                            boxShadow: isChosen ? `inset 0 0 0 1.5px ${club?.accent ?? "#f5b82e"}` : undefined,
                                        }}
                                    >
                                        <span
                                            className="grid size-7 shrink-0 place-items-center rounded-full text-xs font-black"
                                            style={{
                                                backgroundColor: isChosen ? club?.accent ?? "#f5b82e" : "#eef1f4",
                                                color: isChosen ? "#fff" : "#5b6b7f",
                                            }}
                                        >
                                            {LETTERS[i]}
                                        </span>
                                        <span className="text-gray-800">{option}</span>
                                        {isChosen && <FaCircleCheck className="ml-auto shrink-0" style={{ color: club?.accent ?? "#f5b82e" }} />}
                                    </button>
                                );
                            })}
                        </div>

                        {answerLocked && (
                            <div className="mt-5 flex items-center justify-between">
                                <p className="text-xs text-gray-400">
                                    {idx + 1 >= attempt.questions.length ? "Last question — locking in your score." : "Locked in — moving on."}
                                </p>
                                <p className="text-xs tabular-nums text-gray-400">{Math.max(0, timeLeft)}s</p>
                            </div>
                        )}

                        {!answerLocked && (
                            <div className="mt-5" aria-live="polite">
                                <div className="flex items-center justify-between text-xs text-gray-400">
                                    <span>Timer</span>
                                    <span className="tabular-nums font-bold" style={{ color: timeLeft <= 5 ? "#dc2626" : undefined }}>
                                        {Math.max(0, timeLeft)}s
                                    </span>
                                </div>
                                <div className="mt-1.5 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-1000 linear"
                                        style={{
                                            width: `${(Math.max(0, timeLeft) / attempt.secondsPerQuestion) * 100}%`,
                                            backgroundColor: timeLeft <= 5 ? "#dc2626" : club?.accent ?? "#f5b82e",
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {stage === "result" && result && (
                <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                    <div className="p-8 md:p-10 text-center">
                        <div
                            className="mx-auto grid size-24 place-items-center rounded-full"
                            style={{
                                background: result.score >= 80 ? "linear-gradient(135deg, #f5b82e, #e09f1c)" : result.score >= 50 ? "linear-gradient(135deg, #0ea5e9, #0369a1)" : "linear-gradient(135deg, #cbd5e1, #94a3b8)",
                            }}
                        >
                            <div className="text-center text-white">
                                <p className="text-2xl font-black leading-none">{result.score}</p>
                                <p className="text-[10px] font-bold uppercase tracking-widest">top of {result.total}</p>
                            </div>
                        </div>

                        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-navy mt-5">
                            {result.score === 100 ? "Perfect round!" : result.score >= 80 ? "Board-topping score!" : result.score >= 50 ? "Solid round" : "Worth another read"}
                        </h2>
                        <p className="text-sm text-slate-gray mt-2 max-w-md mx-auto">
                            {result.correct} of {result.total} correct in {formatTime(result.durationMs)}
                            {result.correct === result.total ? " — flawless." : result.score >= 80 ? " — top-five territory." : " — read a chapter a day and come back."}
                        </p>

                        <div className="mx-auto mt-6 flex max-w-xs items-center justify-center gap-4 rounded-xl bg-alice-blue px-5 py-4">
                            <div className="text-center">
                                <p className="text-xl font-black text-navy tabular-nums">{result.correct}<span className="text-sm text-gray-400">/{result.total}</span></p>
                                <p className="text-[10px] uppercase tracking-widest text-gray-400">correct</p>
                            </div>
                            <div className="h-8 w-px bg-gray-200" />
                            <div className="text-center">
                                <p className="text-xl font-black text-navy tabular-nums">{result.round > 0 ? `R${result.round}` : "—"}</p>
                                <p className="text-[10px] uppercase tracking-widest text-gray-400">round</p>
                            </div>
                            <div className="h-8 w-px bg-gray-200" />
                            <div className="text-center">
                                <p className="text-xl font-black text-navy tabular-nums">{result.hosted ? "Live" : "Demo"}</p>
                                <p className="text-[10px] uppercase tracking-widest text-gray-400">board</p>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                            <button
                                type="button"
                                onClick={reset}
                                className="inline-flex items-center gap-2 rounded-lg bg-navy px-6 py-3 font-semibold text-sm text-white transition-colors hover:bg-navy-dark"
                            >
                                <FaTrophy className="text-xs" /> Play again
                            </button>
                            <Link
                                href="/bible-quiz#overview"
                                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-6 py-3 font-semibold text-sm text-navy transition-colors hover:border-gray-300"
                            >
                                View the boards <FaArrowRight className="text-xs" />
                            </Link>
                        </div>

                        <p className="mt-6 text-[11px] text-gray-400">
                            {result.hosted ? `Saved to the ${result.club} live board. Best score counts for the week.` : "You played offline — reconnect to save this round to the live board."}
                        </p>
                    </div>
                </div>
            )}

            {stage !== "setup" && (
                <p className="mt-6 text-center text-xs text-gray-400">
                    <Link href="/bible-quiz" className="inline-flex items-center gap-1 font-semibold text-navy hover:underline">
                        <LuChevronDown className="rotate-90 text-[11px]" /> Back to the season hub
                    </Link>
                </p>
            )}
        </div>
    );
}