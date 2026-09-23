import Link from "next/link";
import type { CSSProperties } from "react";
import PageHero from "@/components/PageHero";
import SeasonQuizHub from "@/components/bible-quiz/SeasonQuizHub";
import { SEASON_QUIZ } from "@/lib/season";

export default function BibleQuizPage() {
    const { season, year, bookLabel, windowLabel, blurb, clubs, image } = SEASON_QUIZ;

    return (
        <div style={{ "--club-accent": "#f5b82e", "--club-accent-dark": "#c9961c" } as CSSProperties}>
            <PageHero
                title={`${season} Bible Quiz`}
                tagline={`Book of the season · ${bookLabel}`}
                description={blurb}
                watermark={season}
                bgImage={image}
                chips={[
                    { dot: true, label: `${season} ${year}` },
                    { label: bookLabel },
                    { label: windowLabel },
                ]}
                actions={
                    <>
                        <Link
                            href="#overview"
                            className="inline-flex items-center gap-2 bg-white text-navy px-6 py-3 rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors"
                        >
                            Season&apos;s top 5 →
                        </Link>
                        <Link
                            href="#sprout"
                            className="inline-flex items-center gap-2 border border-white/25 text-white px-6 py-3 rounded-lg font-semibold text-sm hover:border-white/60 transition-colors"
                        >
                            Explore the club boards
                        </Link>
                    </>
                }
                meta={[
                    { label: "Book of the season", value: bookLabel },
                    { label: "Clubs with quiz", value: String(clubs.length) },
                    { label: "Runs", value: windowLabel },
                    { label: "Cost", value: "Free" },
                ]}
            />
            <SeasonQuizHub/>
        </div>
    );
}