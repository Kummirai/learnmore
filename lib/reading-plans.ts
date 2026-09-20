/**
 * Reading plans — website access layer.
 *
 * Single source of truth = `@/constants/readingPlans` (the catalog the plans
 * hub already renders across all categories: Bible Reading, Marriage &
 * Relationships, Emotional Wellness, Finance & Stewardship, Academic). This
 * module layers Supabase-shaped section building + progress/quiz types on top
 * so the reader and the inline Bible Quiz can be rendered today from seed data
 * and later swapped to live Supabase rows without touching page code.
 */
import { READING_PLANS, READING_PLAN_CATEGORIES, type RelateReadingPlan } from "@/constants/readingPlans";

export { READING_PLANS, READING_PLAN_CATEGORIES };
export type { RelateReadingPlan };

/** 5 chapters per reader section — the unlock threshold for the section quiz. */
export const CHAPTERS_PER_SECTION = 5;

export type ReadingSection = {
  id: string;
  planSlug: string;
  title: string;
  book: string;
  startCh: number;
  endCh: number;
  sort: number;
};

/*
 * Pentateuch sections — the flagship Bible Reading plan. 5-chapter blocks
 * (Genesis 1–5, 6–10 …) so reading five chapters unlocks that section's quiz.
 */
const PENTATEUCH_SECTIONS: [string, string, number, number, string][] = [
  ["Genesis", "In the Beginning", 1, 5, "Creation to the flood"],
  ["Genesis", "Noah's Flood", 6, 10, "The ark and the new beginning"],
  ["Genesis", "Abraham Called", 11, 16, "The call, the covenant, the test"],
  ["Genesis", "Isaac & Jacob", 17, 24, "Sons of promise"],
  ["Genesis", "Jacob & Joseph", 25, 31, "Jacob's journey home"],
  ["Genesis", "Joseph in Egypt", 32, 41, "From prison to the palace"],
  ["Genesis", "Joseph's Reunion", 42, 50, "Forgiveness and a new nation"],
  ["Exodus", "Moses Called", 1, 5, "Israel in bondage; the burning bush"],
  ["Exodus", "Out of Egypt", 6, 11, "Plagues and the Passover"],
  ["Exodus", "The Red Sea", 12, 18, "Deliverance and the wilderness"],
  ["Exodus", "The Law at Sinai", 19, 24, "The Ten Commandments and the covenant"],
  ["Exodus", "The Tabernacle", 25, 34, "Worship, the golden calf, the second tablets"],
  ["Exodus", "God With Us", 35, 40, "The tabernacle is built and filled"],
  ["Leviticus", "Holy Ground", 1, 5, "The five offerings"],
  ["Leviticus", "A Priest's Work", 6, 10, "The priesthood and God's fire"],
  ["Leviticus", "Clean & Unclean", 11, 15, "Laws of purity"],
  ["Leviticus", "The Day of Atonement", 16, 20, "Yom Kippur and the call to be holy"],
  ["Leviticus", "Be Holy", 21, 26, "The priests, the feasts, blessing and curse"],
  ["Numbers", "The Census", 1, 5, "A people counted and ordered"],
  ["Numbers", "The Nazirite", 6, 10, "Dedication, the cloud and the trumpet"],
  ["Numbers", "Grumbling", 11, 16, "Complaints, Miriam, and spies"],
  ["Numbers", "The Bronze Serpent", 17, 21, "Aaron's rod and the snake lifted up"],
  ["Numbers", "Balaam & the New Generation", 22, 28, "Blessings and the next census"],
  ["Numbers", "Toward the Promised Land", 29, 36, "Feasts, cities of refuge, inheritance"],
  ["Deuteronomy", "Words of Moses", 1, 5, "Remember the journey"],
  ["Deuteronomy", "Love the Lord", 6, 10, "The greatest commandment"],
  ["Deuteronomy", "Blessing & Curse", 11, 16, "Choose life"],
  ["Deuteronomy", "The King List", 17, 21, "Justice for the people"],
  ["Deuteronomy", "Land & Inheritance", 22, 26, "Laws for entering the land"],
  ["Deuteronomy", "The New Covenant", 27, 34, "Israel renewed; Moses' final words"],
];

function buildSections(planSlug: string): ReadingSection[] {
  return PENTATEUCH_SECTIONS.map(([book, title, startCh, endCh, _blurb], i) => ({
    id: `${planSlug}-${book.toLowerCase()}-${startCh}`,
    planSlug,
    title,
    book,
    startCh,
    endCh,
    sort: i,
  }));
}

function buildGenericSections(plan: RelateReadingPlan): ReadingSection[] {
  const dayChunks = Array.from({ length: Math.max(1, Math.ceil(plan.days / CHAPTERS_PER_SECTION)) }, (_, i) => ({
    startCh: i * CHAPTERS_PER_SECTION + 1,
    endCh: (i + 1) * CHAPTERS_PER_SECTION,
  }));
  return dayChunks.map(({ startCh, endCh }, i) => ({
    id: `${plan.slug}-${plan.section?.toLowerCase().replace(/[^a-z]+/g, "-") || i}-${startCh}`,
    planSlug: plan.slug,
    title: `Section ${i + 1}`,
    book: plan.section || plan.category,
    startCh,
    endCh,
    sort: i,
  }));
}

/** Supabase-shaped accessor over the single reading-plans catalog. */
const PENTATEUCH_SLUGS = new Set([
  "pentateuch-in-60-days",
  "old-testament-in-180-days",
]);

export function getPlanSections(plan: RelateReadingPlan): ReadingSection[] {
  if (PENTATEUCH_SLUGS.has(plan.slug)) {
    return buildSections(plan.slug);
  }
  return buildGenericSections(plan);
}

export function getReadingPlan(slug: string): RelateReadingPlan | undefined {
  return READING_PLANS.find((p) => p.slug === slug);
}

export function getPlansByCategory(category: string): RelateReadingPlan[] {
  return READING_PLANS.filter((p) => p.category === category);
}

// ─── Progress + quiz types (Supabase-shaped) ──────────────────────────────
export type ReadingSectionProgress = {
  sectionId: string;
  completedChapters: number[]; // 1-based chapter numbers read within [startCh,endCh]
};

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
