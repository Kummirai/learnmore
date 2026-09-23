/**
 * Bible Quiz season — the single source of truth for which season we're in
 * (Southern Hemisphere, matching Johannesburg) and what the season's quiz is
 * built around. Shared by the homepage carousel slide and the season quiz hub
 * so both always agree on the book and plan.
 */

export type SeasonName = "Summer" | "Autumn" | "Winter" | "Spring";

export function currentSeason(): SeasonName {
    const m = new Date().getMonth() + 1; // 1–12
    if (m === 12 || m <= 2) return "Summer";
    if (m <= 5) return "Autumn";
    if (m <= 8) return "Winter";
    return "Spring";
}

export type SeasonQuizMeta = {
    /** The book clubs read this season; quizzes come from its chapters. */
    book: string;
    /** Reading plan whose sections the inline quizzes unlock from. */
    planSlug: string;
    blurb: string;
    image: string;
};

export const SEASON_QUIZ: Record<SeasonName, SeasonQuizMeta> = {
    Summer: {
        book: "Genesis",
        planSlug: "pentateuch-in-60-days",
        blurb: "Soak up Genesis in the sun — every class reads five chapters a week and the quiz unlocks as soon as the reading's done. Best score owns the summer board.",
        image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=1600&q=80",
    },
    Autumn: {
        book: "Genesis",
        planSlug: "pentateuch-in-60-days",
        blurb: "Fresh chapters, fresh chances — read Genesis as the leaves turn, unlock each weekly quiz, and let a new high score keep climbing the class board.",
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=80",
    },
    Winter: {
        book: "Genesis",
        planSlug: "pentateuch-in-60-days",
        blurb: "Warm minds this winter — read Genesis by the fire, unlock the quiz after every five chapters, and beat the cold with the best score on the board.",
        image: "https://images.unsplash.com/photo-1516192518150-0d8fee5425e3?w=1600&q=80",
    },
    Spring: {
        book: "Genesis",
        planSlug: "pentateuch-in-60-days",
        blurb: "New season, new growth — Genesis is in full bloom, the quizzes unlock as you read, and the season's best scorers claim the board before summer.",
        image: "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?w=1600&q=80",
    },
};