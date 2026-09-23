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

export type QuizSeason = {
    /** Season branding — derived from the season's start date. */
    season: SeasonName;
    year: string;
    book: string;
    chapters: string;
    /** e.g. "Genesis 1–25" */
    bookLabel: string;
    /** e.g. "1 Jan – end of season · 2027" */
    windowLabel: string;
    blurb: string;
    image: string;
    /** Club slugs that run the quiz this season (match the season hub sections). */
    clubs: string[];
};

export const SEASON_QUIZ: QuizSeason = {
    season: seasonForDate(new Date("2027-01-01T12:00:00")),
    year: "2027",
    book: "Genesis",
    chapters: "1–25",
    bookLabel: "Genesis 1–25",
    windowLabel: "1 Jan – end of season · 2027",
    blurb:
        "This season is Genesis, chapters 1 to 25 — read it week by week with your club, take the quiz each round, and the best scores across the season claim the boards.",
    image: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1600&q=80",
    clubs: ["sprout", "surge", "pulse", "prime", "anchor"],
};