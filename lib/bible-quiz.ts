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

/** Genesis 1–25 fallback bank (offline/dev play) — mirrors the hub's live bank. */
const GENESIS_EXTRA: BibleQuizQuestion[] = [
  {
    id: "q-gen13",
    book: "Genesis",
    chapter: 13,
    question: "Abraham let Lot choose first — Lot chose the well-watered plains of…",
    options: ["Jordan", "Canaan", "Ur", "Sinai"],
    correct: 0,
  },
  {
    id: "q-gen15",
    book: "Genesis",
    chapter: 15,
    question: "God promised Abraham descendants as many as the…",
    options: ["stars in the sky", "grains of salt", "leaves of the vine", "waves of the sea"],
    correct: 0,
  },
  {
    id: "q-gen17",
    book: "Genesis",
    chapter: 17,
    question: "God changed Abram's name to…",
    options: ["Abraham", "Israel", "Isaac", "Nathan"],
    correct: 0,
  },
  {
    id: "q-gen18",
    book: "Genesis",
    chapter: 18,
    question: "How many visitors told Abraham that Sarah would have a son?",
    options: ["Three", "Two", "Seven", "Twelve"],
    correct: 0,
  },
  {
    id: "q-gen22",
    book: "Genesis",
    chapter: 22,
    question: "On the mountain, God provided a… to take Isaac's place.",
    options: ["ram", "lamb", "calf", "goat"],
    correct: 0,
  },
  {
    id: "q-gen24",
    book: "Genesis",
    chapter: 24,
    question: "Abraham's servant found Rebekah as a wife for Isaac near…",
    options: ["a well", "a market", "a gate", "a feast"],
    correct: 0,
  },
  {
    id: "q-gen25",
    book: "Genesis",
    chapter: 25,
    question: "Esau sold his birthright to Jacob for a bowl of…",
    options: ["stew", "gold", "wheat", "wine"],
    correct: 0,
  },
];

/** Hub quiz bank — the Genesis 1–25 window, with club-specific swaps applied. */
export function hubQuestionsForClub(clubSlug: string, count = 10): BibleQuizQuestion[] {
  const bank = [
    ...BASE_QUESTIONS.filter((q) => q.book === "Genesis"),
    ...GENESIS_EXTRA,
  ];
  const swaps = CLUB_QUESTION_SWAPS[clubSlug] ?? [];
  return bank
    .map((q) => {
      const swap = swaps.find((s) => s.book === q.book && s.chapter === q.chapter);
      return swap ? { ...q, ...swap } : q;
    })
    .filter((q) => q.chapter >= 1 && q.chapter <= 25)
    .slice(0, count);
}

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

/** Club-colored demo rosters so club pages render a board TODAY. */
const CLUB_ROSTERS: Record<string, { name: string; score: number; correct: number; total: number }[]> = {
  "sprout-kids": [
    { name: "Amara", score: 420, correct: 6, total: 7 },
    { name: "Liam", score: 380, correct: 5, total: 7 },
    { name: "Noa", score: 355, correct: 5, total: 7 },
    { name: "Zuri", score: 300, correct: 4, total: 7 },
    { name: "Kai", score: 275, correct: 4, total: 7 },
  ],
  "sprout-tweens": [
    { name: "Grace", score: 500, correct: 7, total: 7 },
    { name: "Ethan", score: 455, correct: 6, total: 7 },
    { name: "Maya", score: 410, correct: 6, total: 7 },
    { name: "Noah", score: 370, correct: 5, total: 7 },
    { name: "Chloe", score: 330, correct: 5, total: 7 },
  ],
  "sprout-teens": [
    { name: "Sage", score: 540, correct: 7, total: 7 },
    { name: "Ryan", score: 495, correct: 6, total: 7 },
    { name: "Nala", score: 460, correct: 6, total: 7 },
    { name: "Jordan", score: 420, correct: 6, total: 7 },
    { name: "Skye", score: 385, correct: 5, total: 7 },
  ],
  surge: [
    { name: "Tumi", score: 610, correct: 7, total: 7 },
    { name: "Jason", score: 570, correct: 6, total: 7 },
    { name: "Yola", score: 535, correct: 6, total: 7 },
    { name: "Keanu", score: 500, correct: 6, total: 7 },
    { name: "Busi", score: 465, correct: 5, total: 7 },
  ],
  pulse: [
    { name: "Naledi", score: 680, correct: 7, total: 7 },
    { name: "Sipho", score: 640, correct: 6, total: 7 },
    { name: "Amara", score: 605, correct: 6, total: 7 },
    { name: "Leon", score: 570, correct: 6, total: 7 },
    { name: "Fikile", score: 530, correct: 5, total: 7 },
  ],
  adults: [
    { name: "Pastor D", score: 720, correct: 7, total: 7 },
    { name: "Mrs Khumalo", score: 685, correct: 6, total: 7 },
    { name: "Oupa", score: 650, correct: 6, total: 7 },
    { name: "Auntie Pearl", score: 615, correct: 6, total: 7 },
    { name: "Bro Samuel", score: 580, correct: 5, total: 7 },
  ],
  prime: [
    { name: "Dr Molefe", score: 610, correct: 7, total: 7 },
    { name: "Thandi", score: 575, correct: 6, total: 7 },
    { name: "Pieter", score: 540, correct: 6, total: 7 },
    { name: "Lerato", score: 505, correct: 6, total: 7 },
    { name: "Sibusiso", score: 470, correct: 5, total: 7 },
  ],
  anchor: [
    { name: "Mama Rose", score: 605, correct: 7, total: 7 },
    { name: "Auntie V", score: 570, correct: 6, total: 7 },
    { name: "Dumisani", score: 535, correct: 6, total: 7 },
    { name: "Refilwe", score: 500, correct: 6, total: 7 },
    { name: "Cindy", score: 465, correct: 5, total: 7 },
  ],
};

export const CLUB_ACCENTS: Record<string, string> = {
  "sprout-kids": "#f97316",
  "sprout-tweens": "#f59e0b",
  "sprout-teens": "#f59e0b",
  surge: "#06b6d4",
  pulse: "#8b5cf6",
  adults: "#1e3a8a",
  prime: "#1e3a8a",
  anchor: "#1e3a8a",
  base: "#1e3a8a",
  nexus: "#1e3a8a",
};

/** Deterministic per-club seed so boards/logs render on every reload. */
export function seedForClub(clubSlug: string): BibleQuizSectionBoard {
  const roster = CLUB_ROSTERS[clubSlug] ?? CLUB_ROSTERS[CLUB_ACCENTS[clubSlug] ? "adults" : "surge"] ?? [];
  const accent = CLUB_ACCENTS[clubSlug] ?? "#06b6d4";
  const rows: QuizBoardRow[] = roster.map((r, i) => ({
    rank: (i + 1) as 1 | 2 | 3 | 4 | 5,
    playerId: `seed-${clubSlug}-${i + 1}`,
    name: r.name,
    clubSlug,
    accent,
    laurel: i === 0,
  }));
  const logs: QuizLogRow[] = roster.map((r, i) => ({
    id: `seed-log-${clubSlug}-${i + 1}`,
    clubSlug,
    sectionId: "seed",
    playerId: `seed-${clubSlug}-${i + 1}`,
    name: r.name,
    score: r.score,
    correct: r.correct,
    total: r.total,
    milliseconds: 42000 + i * 1300,
    at: new Date(Date.now() - i * 6.48e7).toISOString(),
  }));
  return { sectionId: "seed", rows, logs };
}

/**
 * Merge several club boards into one group board (e.g. Sprout Kids + Tweens +
 * Teens = "Sprout"). Logs are combined newest-first; the top-5 row set is
 * re-ranked by score across the group so a single board reads naturally.
 */
export function mergeGroupBoard(clubSlugs: string[]): BibleQuizSectionBoard {
  const logs = clubSlugs
    .flatMap((slug) => seedForClub(slug).logs)
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
  const top = [...logs].sort((a, b) => b.score - a.score).slice(0, 5);
  const rows: QuizBoardRow[] = top.map((log, i) => ({
    rank: (i + 1) as 1 | 2 | 3 | 4 | 5,
    playerId: log.playerId,
    name: log.name,
    clubSlug: log.clubSlug,
    accent: CLUB_ACCENTS[log.clubSlug] ?? "#06b6d4",
    laurel: i === 0,
  }));
  return { sectionId: clubSlugs.join("+"), rows, logs };
}

/* eslint-disable @typescript-eslint/no-unused-vars */
/** Swap point: replace the seed with `select().from("quiz_logs").match({club_slug})`. */
async function _QUIZ_LOGS_FROM_SUPABASE(_clubSlug: string): Promise<QuizLogRow[]> {
  return [];
}
/* eslint-enable @typescript-eslint/no-unused-vars */
