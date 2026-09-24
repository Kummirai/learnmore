import Link from "next/link";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import PageHero from "@/components/PageHero";
import SeasonQuizHub from "@/components/bible-quiz/SeasonQuizHub";
import { SEASON_QUIZ } from "@/lib/season";

export const metadata: Metadata = {
  title: "Summer Bible Quiz",
  description:
    "Play the RelateWorld season Bible quiz — weekly rounds, live club boards and the season's top five across every club.",
  alternates: { canonical: "/bible-quiz" },
};

export default function BibleQuizPage() {
    const { season, windowLabel, blurb, clubs, image } = SEASON_QUIZ;

    return (
        <div style={{ "--club-accent": "#f5b82e", "--club-accent-dark": "#c9961c" } as CSSProperties}>
            <PageHero
                title={`${season} Bible Quiz`}
                mobileTitle={"Quiz"}
                description={blurb}
                watermark={season}
                bgImage={image}
                actions={
                    <>
                        <Link
                            href="/bible-quiz/play"
                            className="inline-flex items-center gap-2 bg-white text-navy px-6 py-3 rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors"
                        >
                            Play the quiz →
                        </Link>
                        <Link
                            href="#overview"
                            className="inline-flex items-center gap-2 border border-white/30 bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-white/20 hover:border-white/60 transition-colors"
                        >
                            See the season&apos;s top 5
                        </Link>
                    </>
                }
                meta={[
                    { label: "Clubs with quiz", value: String(clubs.length) },
                    { label: "Runs", value: windowLabel },
                    { label: "Cost", value: "Free" },
                ]}
            />
            <SeasonQuizHub/>
        </div>
    );
}