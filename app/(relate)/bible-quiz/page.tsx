import Link from "next/link";
import type { CSSProperties } from "react";
import PageHero from "@/components/PageHero";
import SeasonQuizHub from "@/components/bible-quiz/SeasonQuizHub";
import { currentSeason, SEASON_QUIZ } from "@/lib/season";

export default function BibleQuizPage() {
    const season = currentSeason();
    const meta = SEASON_QUIZ[season];
    const year = new Date().getFullYear();

    return (
        <div style={{ "--club-accent": "#f5b82e", "--club-accent-dark": "#c9961c" } as CSSProperties}>
            <PageHero
                title={`${season} Bible Quiz`}
                tagline={`Book of the season · ${meta.book}`}
                description={`${meta.blurb} Read five chapters of a section inside a reading plan, the quiz unlocks right there, and the top five land on your club's board.`}
                watermark={season}
                chips={[
                    { dot: true, label: `${season} ${year}` },
                    { label: `${meta.book} · in 60 days` },
                ]}
                actions={
                    <>
                        <Link
                            href={`/plans/${meta.planSlug}`}
                            className="inline-flex items-center gap-2 bg-white text-navy px-6 py-3 rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors"
                        >
                            Start reading {meta.book} →
                        </Link>
                        <Link
                            href="#overview"
                            className="inline-flex items-center gap-2 border border-white/25 text-white px-6 py-3 rounded-lg font-semibold text-sm hover:border-white/60 transition-colors"
                        >
                            Season&apos;s top 5
                        </Link>
                    </>
                }
                meta={[
                    { label: "Book of the season", value: meta.book },
                    { label: "Clubs", value: "5" },
                    { label: "Runs", value: "Weekly" },
                    { label: "Cost", value: "Free" },
                ]}
            />
            <SeasonQuizHub/>
        </div>
    );
}