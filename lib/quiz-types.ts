/** Shared Bible Quiz board/log row shapes (Supabase-shaped). */

export type QuizBoardRow = {
  rank: 1 | 2 | 3 | 4 | 5;
  playerId: string;
  name: string;
  clubSlug: string;
  accent: string;
  laurel: boolean;
};

export type QuizLogRow = {
  id: string;
  clubSlug: string;
  sectionId: string;
  playerId: string;
  name: string;
  score: number;
  correct: number;
  total: number;
  milliseconds: number;
  at: string;
};
