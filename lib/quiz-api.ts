/**
 * Public hub quiz API client (website).
 *
 * Requests go through the app's own `/api/*` rewrite to the backend. Every call
 * falls back to a local, off-line stand-in so the quiz stays playable when the
 * API is unreachable: questions come from the seeded Genesis 1–25 bank and an
 * attempt is scored locally (marked `{ hosted: false }` so boards know it never
 * reached the live board).
 */

import {
  CLUB_ACCENTS,
  hubQuestionsForClub,
  type BibleQuizQuestion,
  type BibleQuizSectionBoard,
} from "@/lib/bible-quiz";
import type { QuizBoardRow, QuizLogRow } from "@/lib/reading-plans";
import { SEASON_QUIZ } from "@/lib/season";

export type HubQuestion = {
  id: string;
  book: string;
  bookLabel: string;
  text: string;
  options: string[];
};

export type StartedAttempt = {
  attemptId: string;
  club: string;
  name: string;
  season: typeof SEASON_QUIZ;
  secondsPerQuestion: number;
  questionCount: number;
  questions: HubQuestion[];
};

export type AttemptResult = {
  attemptId: string;
  club: string;
  name: string;
  correct: number;
  total: number;
  score: number;
  durationMs: number;
  round: number;
  completedAt: string;
  hosted?: boolean;
};

export type LiveBoardRow = {
  rank: 1 | 2 | 3 | 4 | 5;
  playerId: string;
  name: string;
  club: string;
  score: number;
  correct: number;
  total: number;
  at: string;
  laurel?: boolean;
};

export type LiveBoardLog = {
  id: string;
  playerId: string;
  name: string;
  score: number;
  correct: number;
  total: number;
  milliseconds: number;
  at: string;
};

export type LiveBoard = {
  round: number;
  roundLabel: string;
  open: boolean;
  rows: LiveBoardRow[];
  logs: LiveBoardLog[];
  totalAttempts: number;
};

export type LiveOverview = {
  season: typeof SEASON_QUIZ;
  round: number;
  roundLabel: string;
  rows: LiveBoardRow[];
  totalPlayers: number;
};

const OFFLINE_KEY = "relateHubAttempt";

// ─── Questions ──────────────────────────────────────────────────────────────

export async function fetchHubQuestions(club: string, count = 10): Promise<HubQuestion[]> {
  try {
    const res = await fetch(`/api/public-quiz/questions?club=${encodeURIComponent(club)}&count=${count}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`questions ${res.status}`);
    const data = (await res.json()) as { questions: HubQuestion[] };
    if (Array.isArray(data.questions) && data.questions.length > 0) return data.questions;
    throw new Error("empty question set");
  } catch {
    // Off-line stand-in: the same Genesis 1–25 bank, answers stripped.
    return hubQuestionsForClub(club, count).map((q) => ({
      id: q.id,
      book: "Genesis",
      bookLabel: "Genesis 1–25",
      text: q.question,
      options: q.options,
    }));
  }
}

// ─── Attempts ───────────────────────────────────────────────────────────────

type OfflineDraw = { questions: (BibleQuizQuestion & { bookLabel: string })[] };

export async function startHubAttempt(club: string, name: string, count = 10): Promise<StartedAttempt> {
  try {
    const res = await fetch("/api/public-quiz/attempts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "start", club, name, count }),
      cache: "no-store",
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(data?.error || `start ${res.status}`);
    return data.attempt as StartedAttempt;
  } catch {
    // Off-line stand-in: score locally on submit; results never reach the live board.
    const questions = hubQuestionsForClub(club, count);
    const draw: OfflineDraw = {
      questions: questions.map((q) => ({ ...q, bookLabel: "Genesis 1–25" })),
    };
    try {
      localStorage.setItem(OFFLINE_KEY, JSON.stringify(draw));
    } catch {
      /* ignore */
    }
    return {
      attemptId: `local-${Date.now()}`,
      club,
      name,
      season: { ...SEASON_QUIZ },
      secondsPerQuestion: 30,
      questionCount: questions.length,
      questions: questions.map((q) => ({
        id: q.id,
        book: q.book,
        bookLabel: "Genesis 1–25",
        text: q.question,
        options: q.options,
      })),
    };
  }
}

export async function submitHubAttempt(
  attempt: StartedAttempt,
  answers: number[],
  durationMs: number,
): Promise<AttemptResult> {
  try {
    const res = await fetch("/api/public-quiz/attempts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "submit",
        attemptId: attempt.attemptId,
        answers: attempt.questions.map((q, i) => ({ questionId: q.id, selected: answers[i] ?? -1 })),
        durationMs,
      }),
      cache: "no-store",
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(data?.error || `submit ${res.status}`);
    return { ...(data.result as AttemptResult), hosted: true };
  } catch {
    // Off-line fallback: read back the locally stored draw and score it.
    let correct = 0;
    try {
      const raw = localStorage.getItem(OFFLINE_KEY);
      if (raw) {
        const draw = JSON.parse(raw) as OfflineDraw;
        attempt.questions.forEach((q, i) => {
          const base = draw.questions.find((b) => b.id === q.id);
          if (base && answers[i] === base.correct) correct += 1;
        });
      }
    } catch {
      /* ignore */
    }
    const total = attempt.questions.length;
    return {
      attemptId: attempt.attemptId,
      club: attempt.club,
      name: attempt.name,
      correct,
      total,
      score: Math.round((correct / total) * 100),
      durationMs,
      round: 0,
      completedAt: new Date().toISOString(),
      hosted: false,
    };
  }
}

// ─── Boards ─────────────────────────────────────────────────────────────────

/** Convert a live board document into the shape the hub/club boards render. */
export function sectionBoardFromLive(board: LiveBoard, clubSlug: string) {
  const accent = CLUB_ACCENTS[clubSlug] ?? "#06b6d4";
  const rows: QuizBoardRow[] = board.rows.map((r) => ({
    rank: r.rank,
    playerId: r.playerId,
    name: r.name,
    clubSlug,
    accent,
    laurel: r.rank === 1,
  }));
  const logs: QuizLogRow[] = board.logs.map((l) => ({
    id: l.id,
    clubSlug,
    sectionId: `w${board.round}`,
    playerId: l.playerId,
    name: l.name,
    score: l.score,
    correct: l.correct,
    total: l.total,
    milliseconds: l.milliseconds,
    at: l.at,
  }));
  return { sectionId: `w${board.round}`, rows, logs };
}

export async function fetchHubBoard(club: string): Promise<LiveBoard | null> {
  try {
    const res = await fetch(`/api/public-quiz/logs?club=${encodeURIComponent(club)}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`logs ${res.status}`);
    const data = (await res.json()) as { board: LiveBoard };
    return data.board ?? null;
  } catch {
    return null;
  }
}

export async function fetchHubOverview(): Promise<LiveOverview | null> {
  try {
    const res = await fetch("/api/public-quiz/overview", { cache: "no-store" });
    if (!res.ok) throw new Error(`overview ${res.status}`);
    const data = (await res.json()) as { overview: LiveOverview };
    return data.overview ?? null;
  } catch {
    return null;
  }
}

/** Merge a live board over the seeded board the page already shows. */
export function mergeLiveBoard(
  seed: BibleQuizSectionBoard,
  live: LiveBoard,
  clubSlug: string,
): BibleQuizSectionBoard {
  const section = sectionBoardFromLive(live, clubSlug);
  if (section.rows.length === 0 && section.logs.length === 0) return seed;
  return section;
}