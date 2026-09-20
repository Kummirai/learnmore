import Link from "next/link";
import { FaCrown, FaMedal, FaArrowRight } from "react-icons/fa6";
import { seedForClub } from "@/lib/bible-quiz";

type Props = {
  clubSlug: string;
  accent: string;
  planSlug?: string;
};

/**
 * Per-club Bible Quiz board — the top-5 + attempt logs for ONE club, rendered
 * in that club's accent. Every club page shows its own board (Prime keeps
 * Prime's, Anchor keeps Anchor's — grouped adults all share the adult board).
 *
 * The quiz itself is only ever reachable from inside a reading plan, so the
 * board links INTO a plan ("start reading") rather than opening a quiz hub.
 */
export default function ClubQuizBoard({ clubSlug, accent, planSlug = "pentateuch-in-60-days" }: Props) {
  const { rows, logs } = seedForClub(clubSlug) ?? { rows: [], logs: [] };

  return (
    <div id={"bible-quiz"} className={"mt-12 mb-12 scroll-mt-8"}>
      <span className={"text-xs uppercase tracking-widest font-medium"} style={{ color: accent }}>
        Weekly challenge
      </span>
      <h2 className={"text-2xl md:text-3xl font-semibold text-gray-800 mt-1 mb-2"}>The Bible Quiz board</h2>
      <p className={"text-gray-500 text-sm max-w-xl mb-6"}>
        Read five chapters of a section inside a reading plan and the inline quiz unlocks — right there, in the
        plan. Top five land here on {rows.length ? "your club" : "this club"}&apos;s board.
      </p>

      <div className={"rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden"}>
        <div className={"flex items-center justify-between px-5 py-4"} style={{ backgroundColor: `${accent}14` }}>
          <div className={"flex items-center gap-2"}>
            <FaCrown className={"text-sm"} style={{ color: accent }} />
            <p className={"text-[11px] font-bold uppercase tracking-widest"} style={{ color: accent }}>
              Top 5 · this week
            </p>
          </div>
          <Link
            href={`/plans/${planSlug}`}
            className={"inline-flex items-center gap-1.5 text-xs font-semibold transition-colors"}
            style={{ color: accent }}
          >
            <FaMedal className={"text-[11px]"} /> Open the plan <FaArrowRight className={"text-[10px]"} />
          </Link>
        </div>

        {rows.length === 0 ? (
          <p className={"px-5 py-8 text-center text-sm text-gray-500"}>
            No attempts yet — be the first to claim the laurel.
          </p>
        ) : (
          <>
            <ul className={"divide-y divide-gray-50"}>
              {rows.map((row) => {
                const log = logs.find((l) => l.playerId === row.playerId);
                return (
                  <li key={row.playerId} className={"flex items-center gap-4 px-5 py-3"}>
                    <span className={"w-5 text-center text-sm font-black"} style={{ color: accent }}>
                      {row.rank}
                    </span>
                    <span className={"text-sm"}>{["🥇", "🥈", "🥉", "4", "5"][row.rank - 1]}</span>
                    <span className={"flex-1 text-sm font-medium text-gray-800"}>{row.name}</span>
                    {row.laurel && (
                      <span className={"text-[10px] uppercase tracking-widest font-bold"} style={{ color: accent }}>
                        laurel
                      </span>
                    )}
                    <span className={"text-xs text-gray-400"}>
                      {log ? `${log.correct}/${log.total} correct` : "—"}
                    </span>
                    <span className={"w-14 text-right text-sm font-black"} style={{ color: accent }}>
                      {log ? log.score : "—"}
                    </span>
                  </li>
                );
              })}
            </ul>
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