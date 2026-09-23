/**
 * The hub quiz clubs — single source of truth for the season quiz. Used by the
 * season hub, club boards and the playable quiz's club picker.
 */
export type QuizClub = {
    slug: string;
    name: string;
    tagline: string;
    accent: string;
    /** Content slugs that seed the board for this club (Sprout merges its classes). */
    group: string[];
};

export const QUIZ_CLUBS: QuizClub[] = [
    {
        slug: "sprout",
        name: "Sprout",
        tagline: "Children · 6–15",
        accent: "#f97316",
        group: ["sprout-kids", "sprout-tweens", "sprout-teens"],
    },
    { slug: "surge", name: "Surge", tagline: "Young Youth · 16–21", accent: "#06b6d4", group: ["surge"] },
    { slug: "pulse", name: "Pulse", tagline: "Youth · 21–33", accent: "#8b5cf6", group: ["pulse"] },
    { slug: "prime", name: "Prime", tagline: "Singles · 33+", accent: "#1e3a8a", group: ["prime"] },
    { slug: "anchor", name: "Anchor", tagline: "Single Parents", accent: "#1e3a8a", group: ["anchor"] },
];

export function quizClubBySlug(slug: string | null | undefined): QuizClub | undefined {
    if (!slug) return undefined;
    return QUIZ_CLUBS.find((c) => c.slug === slug);
}