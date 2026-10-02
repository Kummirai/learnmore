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
import { API_BASE } from "@/lib/config";

export { READING_PLANS, READING_PLAN_CATEGORIES };
export type { RelateReadingPlan };

/** 5 chapters per reader section — the unlock threshold for the section quiz. */
export const CHAPTERS_PER_SECTION = 5;

export type ReadingSection = {
  id: string;
  planSlug: string;
  title: string;
  book: string | null;
  startCh: number | null;
  endCh: number | null;
  verseText?: string;
  verseBy?: string;
  blocks?: PubBlock[];
  sort: number;
};

/**
 * PubBlock (from lib/publications / lib/editor/season) — authored content for a
 * section: paragraphs, verse quotes, images, lists, prayers, quizzes…
 */
import type { PubBlock } from "@/lib/editor/season";

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

// ─── Backend (MongoDB) accessors ─────────────────────────────────────────

/**
 * Public list of plans from the backend (static catalog overlaid with admin-
 * authored plans). Falls back to the local catalog when the API is down.
 */
export async function listPublicReadingPlans(): Promise<RelateReadingPlan[]> {
  try {
    const res = await fetch(`${API_BASE}/api/reading-plans`, { cache: "no-store" });
    if (!res.ok) return READING_PLANS;
    const data = await res.json();
    return Array.isArray(data) && data.length ? (data as RelateReadingPlan[]) : READING_PLANS;
  } catch {
    return READING_PLANS;
  }
}

type ApiSection = {
  id?: string;
  planSlug?: string;
  plan_slug?: string;
  title?: string;
  book?: string | null;
  startCh?: number | null;
  endCh?: number | null;
  verseText?: string;
  verseBy?: string;
  blocks?: unknown[];
  sort?: number;
};

function sectionFromApi(s: ApiSection): ReadingSection {
  return {
    id: s.id ?? `${s.planSlug ?? s.plan_slug ?? "plan"}-${typeof s.sort === "number" ? s.sort : 0}`,
    planSlug: s.planSlug ?? s.plan_slug ?? "",
    title: s.title ?? "",
    book: s.book ?? null,
    startCh: s.startCh ?? null,
    endCh: s.endCh ?? null,
    verseText: s.verseText ?? undefined,
    verseBy: s.verseBy ?? undefined,
    blocks: Array.isArray(s.blocks) ? (s.blocks as PubBlock[]) : undefined,
    sort: typeof s.sort === "number" ? s.sort : 0,
  };
}

/**
 * Load an authored plan from the backend (MongoDB) when it exists there
 * (admin editor). Returns null when the plan is only in the static catalog —
 * callers then fall back to the local catalog + getPlanSections().
 */
export async function getAuthoredPlan(
  slug: string,
): Promise<{ plan: RelateReadingPlan; sections: ReadingSection[] } | null> {
  try {
    const res = await fetch(
      `${API_BASE}/api/reading-plans/${encodeURIComponent(slug)}`,
      { cache: "no-store" },
    );
    if (!res.ok) return null;
    const json = await res.json();
    const plan = json?.plan as RelateReadingPlan | undefined;
    const sections = json?.sections as ApiSection[] | undefined;
    if (!plan || !plan.authored) return null;
    return {
      plan,
      sections: Array.isArray(sections) && sections.length
        ? sections.map(sectionFromApi)
        : getPlanSections(plan),
    };
  } catch {
    return null;
  }
}

// ─── Admin accessors (same-origin /api/* → BFF proxy keeps cookies first-party)

export type AdminReadingPlan = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  section: string;
  days: number;
  gradient: [string, string];
  image: string;
  status: "published" | "draft";
  source: "catalog" | "db";
  sort?: number;
  updatedAt?: string | null;
  sectionsCount: number;
  sections?: Array<Record<string, unknown>>;
};

/** All plans (catalog + authored, drafts included) for the admin list. */
export async function fetchAdminReadingPlans(): Promise<AdminReadingPlan[]> {
  const res = await fetch("/api/admin/reading-plans", { cache: "no-store" });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(typeof json?.error === "string" ? json.error : "Couldn't load reading plans.");
  }
  const json = await res.json();
  return Array.isArray(json?.data) ? (json.data as AdminReadingPlan[]) : [];
}

/** One authored plan document (any status), or null when only catalog exists. */
export async function fetchAdminReadingPlan(
  slug: string,
): Promise<AdminReadingPlan | null> {
  const res = await fetch(
    `/api/admin/reading-plans/${encodeURIComponent(slug)}`,
    { cache: "no-store" },
  );
  if (res.status === 404) return null;
  if (!res.ok) return null;
  const json = await res.json().catch(() => ({}));
  return (json?.data as AdminReadingPlan | undefined) ?? null;
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
