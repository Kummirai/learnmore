import Link from "next/link";
import { FaArrowRight, FaCrown, FaTrophy } from "react-icons/fa6";
import { seedForClub } from "@/lib/bible-quiz";
import { SEASON_QUIZ } from "@/lib/season";
import { BoardTable } from "./quiz-rows";

type Props = {
  clubSlug: string;
  accent: string;
};

/**
 * Per-club Bible Quiz board — the top-5 + attempt logs for ONE club, rendered
 * in that club's accent. Every club page shows its own board.
 *
 * The season is decoupled from reading plans: it's a single book (`lib/season`)
 * covered in quiz rounds at each club, so the board links to the season hub
 * rather than into a reading plan.
 */
export default function ClubQuizBoard({ clubSlug, accent }: Props) {
  const { rows, logs } = seedForClub(clubSlug) ?? { rows: [], logs: [] };
  const { season, bookLabel } = SEASON_QUIZ;

  return (
    <div id={"bible-quiz"} className={"mt-12 mb-12 scroll-mt-8"}>
      <span className={"text-xs uppercase tracking-widest font-medium"} style={{ color: accent }}>
        Weekly challenge
      </span>
      <h2 className={"text-2xl md:text-3xl font-semibold text-gray-800 mt-1 mb-2"}>The Bible Quiz board</h2>
      <p className={"text-gray-500 text-sm max-w-xl mb-6"}>
        This {season} season&apos;s book is {bookLabel} — quiz rounds run weekly at club, and the top five land here on
        your club&apos;s board.
      </p>

      <div className={"rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden"}>
        <div
          className={"flex items-center justify-between px-5 py-4"}
          style={{ background: `linear-gradient(90deg, ${accent}22, ${accent}05)` }}
        >
          <div className={"flex items-center gap-2"}>
            <FaCrown className={"text-sm"} style={{ color: accent }} />
            <p className={"text-[11px] font-bold uppercase tracking-widest"} style={{ color: accent }}>
              Top 5 · this week
            </p>
          </div>
          <Link
            href={"/bible-quiz"}
            className={"inline-flex items-center gap-1.5 text-xs font-semibold transition-colors"}
            style={{ color: accent }}
          >
            <FaTrophy className={"text-[11px]"} /> View the {season.toLowerCase()} season <FaArrowRight className={"text-[10px]"} />
          </Link>
        </div>

        {rows.length === 0 ? (
          <p className={"px-5 py-8 text-center text-sm text-gray-500"}>
            No attempts yet — be the first to claim the laurel.
          </p>
        ) : (
          <>
            <BoardTable board={{ sectionId: "seed", rows, logs }} accent={accent} />
            <div className={"px-5 py-3 border-t border-gray-50 bg-gray-50/60"}>
              <p className={"text-[11px] text-gray-400"}>
                {logs.length} attempt{logs.length === 1 ? "" : "s"} this week · board refreshes every Sunday
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}