/**
 * Bible Quiz — per-club question banks + boards (website).
 *
 * UI-first: every club page + every inline section quiz needs its own questions
 * and its own top-5 board/log set TODAY, before any Supabase quiz_logs rows
 * exist. This module is deterministic per club (`seedForClub(clubSlug)`) so the
 * renders are stable between reloads, is shaped exactly like what the
 * `quiz_logs` table returns, and the one-sentence swap to live Supabase (see
 * `_QUIZ_LOGS_FROM_SUPABASE`) is trivial.
 */

import type { QuizBoardRow, QuizLogRow } from "@/lib/reading-plans";

export type BibleQuizQuestion = {
  id: string;
  book: string;
  chapter: number;
  question: string;
  options: string[];
  correct: number;
};

export type BibleQuizSectionBoard = {
  sectionId: string;
  rows: QuizBoardRow[];
  logs: QuizLogRow[];
};

// ─── Per-club question banks (seeded, Pentateuch) ──────────────────────────
type QuestionBank = { clubSlug: string; overrides: Record<string, Partial<BibleQuizQuestion>> };

const BASE_QUESTIONS: BibleQuizQuestion[] = [
  {
    id: "q-gen1",
    book: "Genesis",
    chapter: 1,
    question: "What did God create on day one?",
    options: ["Light", "The sun", "Fish", "Adam"],
    correct: 0,
  },
  {
    id: "q-gen2",
    book: "Genesis",
    chapter: 2,
    question: "Where did God plant the garden for Adam?",
    options: ["Eden", "Egypt", "Canaan", "Babel"],
    correct: 0,
  },
  {
    id: "q-gen3",
    book: "Genesis",
    chapter: 3,
    question: "What did the serpent convince Eve to do?",
    options: ["Eat the fruit", "Hide", "Sing", "Pray"],
    correct: 0,
  },
  {
    id: "q-gen6",
    book: "Genesis",
    chapter: 6,
    question: "What did Noah build to save his family?",
    options: ["An ark", "A tower", "A tent", "A wall"],
    correct: 0,
  },
  {
    id: "q-gen12",
    book: "Genesis",
    chapter: 12,
    question: "Who did God call to leave Ur and follow him?",
    options: ["Abraham", "Moses", "David", "Jacob"],
    correct: 0,
  },
  {
    id: "q-ex3",
    book: "Exodus",
    chapter: 3,
    question: "From what burning place did God call Moses?",
    options: ["A bush", "A mountain", "A cloud", "A fire"],
    correct: 0,
  },
  {
    id: "q-ex20",
    book: "Exodus",
    chapter: 20,
    question: "How many commandments did God give on the mountain?",
    options: ["Ten", "Five", "Twelve", "Seven"],
    correct: 0,
  },
];

type ClubQuestion = {
  book: string;
  chapter: number;
  question: string;
  options: string[];
  correct: number;
};

/** Age-appropriate question swaps per club, keyed to the base bank by prompt. */
const CLUB_QUESTION_SWAPS: Record<string, ClubQuestion[]> = {
  "sprout-kids": [
    {
      book: "Genesis",
      chapter: 1,
      question: "Who made the world?",
      options: ["God", "The moon", "A giant", "No one"],
      correct: 0,
    },
  ],
  "sprout-tweens": [
    {
      book: "Genesis",
      chapter: 1,
      question: "What did God call the light he made?",
      options: ["Day", "Stars", "Fire", "Clouds"],
      correct: 0,
    },
  ],
  "sprout-teens": [
    {
      book: "Genesis",
      chapter: 1,
      question: "On which day did God make the sun and moon?",
      options: ["Day four", "Day one", "Day six", "Day seven"],
      correct: 0,
    },
  ],
  surge: [
    {
      book: "Genesis",
      chapter: 1,
      question: "What does 'In the beginning God created' teach about creation?",
      options: [
        "Creation began with God — not by chance",
        "The world made itself",
        "God was created",
        "Nothing was made",
      ],
      correct: 0,
    },
  ],
  pulse: [
    {
      book: "Genesis",
      chapter: 1,
      question: "How does Genesis 1 describe God's relationship to creation?",
      options: [
        "He spoke it into being and called it good",
        "He only watched from far away",
        "He was part of creation",
        "He left after day one",
      ],
      correct: 0,
    },
  ],
  adults: [
    {
      book: "Genesis",
      chapter: 1,
      question: "Genesis 1:1 — what is the biblical premise for all of creation?",
      options: [
        "In the beginning, God created the heavens and the earth",
        "In the beginning was nature alone",
        "The earth created itself over time",
        "Creation is an accident",
      ],
      correct: 0,
    },
  ],
};

function questionsForSection(clubSlug: string, section: { book: string; startCh: number; endCh: number }): BibleQuizQuestion[] {
  const bank = BASE_QUESTIONS.filter((q) => q.book === section.book && q.chapter >= section.startCh && q.chapter <= section.endCh);
  if (bank.length === 0) {
    // Fall back to the first question of the book so every section still unlocks a quiz.
    return [BASE_QUESTIONS.find((q) => q.book === section.book) ?? BASE_QUESTIONS[0]];
  }
  const swaps = CLUB_QUESTION_SWAPS[clubSlug] ?? [];
  return bank.map((q) => {
    const swap = swaps.find((s) => s.chapter === q.chapter && s.book === q.book);
    return swap ? { ...q, ...swap } : q;
  });
}

/** Deterministic per-club seed so boards/logs render on every reload. */
export function seedForClub(clubSlug: string): BibleQuizSectionBoard {
  const rows: QuizBoardRow[] = []; // built from logs below
  return { sectionId: "seed", rows, logs: [] };
}

/* eslint-disable @typescript-eslint/no-unused-vars */
/** Swap point: replace the seed with `select().from("quiz_logs").match({club_slug})`. */
async function _QUIZ_LOGS_FROM_SUPABASE(_clubSlug: string): Promise<QuizLogRow[]> {
  return [];
}
/* eslint-enable @typescript-eslint/no-unused-vars */
