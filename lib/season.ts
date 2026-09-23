/**
 * Bible Quiz season — the single source of truth for the current competition
 * season. A season is ONE book with a chapter window, run across the clubs
 * that host the quiz. Deliberately decoupled from reading plans.
 */

export type SeasonName = "Summer" | "Autumn" | "Winter" | "Spring";

/** Southern-Hemisphere season for a given date (Johannesburg calendar). */
export function seasonForDate(d: Date): SeasonName {
    const m = d.getMonth() + 1; // 1–12
    if (m === 12 || m <= 2) return "Summer";
    if (m <= 5) return "Autumn";
    if (m <= 8) return "Winter";
    return "Spring";
}

export function currentSeason(): SeasonName {
    return seasonForDate(new Date());
}

/**
 * Season end — "end of season" is a real calendar date. Southern-Hemisphere
 * seasons close at month end: Summer ends last day of Feb, Autumn end of May,
 * Winter end of Aug, Spring end of Nov.
 */
const SEASON_END_NEXT_MONTH: Record<SeasonName, number> = { Summer: 2, Autumn: 5, Winter: 8, Spring: 11 };

export function seasonEndDate(start: Date): Date {
    return new Date(start.getFullYear(), SEASON_END_NEXT_MONTH[seasonForDate(start)], 0, 23, 59, 59);
}

export function fmtDateShort(d: Date): string {
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function fmtDateFull(d: Date): string {
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export type QuizSeason = {
    /** Season branding — derived from the season's start date. */
    season: SeasonName;
    year: string;
    /** Season window as real dates. */
    start: string;
    end: string;
    startLabel: string;
    endLabel: string;
    /** e.g. "1 Jan – 28 Feb 2027" */
    windowLabel: string;
    book: string;
    chapters: string;
    /** e.g. "Genesis 1–25" */
    bookLabel: string;
    blurb: string;
    image: string;
    /** Club slugs that run the quiz this season (match the season hub sections). */
    clubs: string[];
};

const QUIZ_START = "2027-01-01";
const quizStart = new Date(`${QUIZ_START}T12:00:00`);
const quizEnd = seasonEndDate(quizStart);

export const SEASON_QUIZ: QuizSeason = {
    season: seasonForDate(quizStart),
    year: String(quizStart.getFullYear()),
    start: QUIZ_START,
    end: quizEnd.toISOString().slice(0, 10),
    startLabel: fmtDateFull(quizStart),
    endLabel: fmtDateFull(quizEnd),
    windowLabel: `${fmtDateShort(quizStart)} – ${fmtDateFull(quizEnd)}`,
    book: "Genesis",
    chapters: "1–25",
    bookLabel: "Genesis 1–25",
    blurb:
        "This season is Genesis, chapters 1 to 25 — read it week by week with your club, take the quiz each round, and the best scores across the season claim the boards.",
    image: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1600&q=80",
    clubs: ["sprout", "surge", "pulse", "prime", "anchor"],
};