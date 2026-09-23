import type { BibleQuizSectionBoard } from "@/lib/bible-quiz";
import type { QuizLogRow } from "@/lib/reading-plans";

/**
 * Shared Bible Quiz table pieces — a "podium board" language instead of plain
 * spreadsheet rows: medal-coloured rank medallions for the top three, a dark
 * scoreboard chip for scores, subtle gold/silver/bronze row tints, and an
 * activity-ledger style attempt log.
 */

const MEDAL_COLORS: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: "#f0b429",
  2: "#c3c9d4",
  3: "#ca8a4b",
  4: "#8b93a5",
  5: "#8b93a5",
};

export function fmtDate(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

export function fmtTime(ms: number): string {
  const s = Math.round(ms / 1000);
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

function initials(name: string): string {
  return name.replace(/[^a-z0-9 ]/gi, "").trim().split(/\s+/).slice(0, 2).map((w) => w.charAt(0)).join("").toUpperCase() || name.charAt(0).toUpperCase();
}

/** Circular rank medallion — gold/silver/bronze filled for the podium, accent-tinted otherwise. */
export function RankMedal({ rank, accent }: { rank: 1 | 2 | 3 | 4 | 5; accent: string }) {
  const medal = MEDAL_COLORS[rank];
  return (
    <span
      className={"grid size-9 shrink-0 place-items-center rounded-full text-sm font-black tabular-nums shadow-sm"}
      style={
        rank <= 3
          ? { backgroundColor: medal, color: "#fff", boxShadow: `0 3px 10px ${medal}66` }
          : { backgroundColor: `${accent}1a`, color: accent }
      }
    >
      {rank}
    </span>
  );
}

/** Dark scoreboard chip — the score reads like a match result, not a table cell. */
export function ScoreChip({ score, accent }: { score: number; accent: string }) {
  return (
    <span
      className={"min-w-12 shrink-0 rounded-lg bg-navy-dark px-2.5 py-1 text-center text-sm font-black tabular-nums text-white"}
      style={{ boxShadow: `inset 0 0 0 2px ${accent}40` }}
    >
      {score}
    </span>
  );
}

export function LaurelBadge() {
  return (
    <span className={"rounded-full bg-[#f0b429]/15 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-[#a57d10]"}>
      Laurel
    </span>
  );
}

export function BoardTable({ board, accent }: { board: BibleQuizSectionBoard; accent: string }) {
  return (
    <ul className={"divide-y divide-gray-100/80"}>
      {board.rows.map((row) => {
        const log = board.logs.find((l) => l.playerId === row.playerId);
        return (
          <li
            key={row.playerId}
            className={"flex items-center gap-3 px-4 py-3.5 md:px-5"}
            style={
              row.rank <= 3
                ? { background: `linear-gradient(90deg, ${MEDAL_COLORS[row.rank]}12, transparent 55%)` }
                : undefined
            }
          >
            <RankMedal rank={row.rank} accent={row.accent ?? accent} />
            <span className={"min-w-0 flex-1 truncate text-sm font-medium text-gray-800"}>{row.name}</span>
            {row.laurel && <LaurelBadge />}
            <span className={"hidden text-xs tabular-nums text-gray-400 sm:block"}>
              {log ? `${log.correct}/${log.total} correct` : "—"}
            </span>
            <ScoreChip score={log?.score ?? 0} accent={row.accent ?? accent} />
          </li>
        );
      })}
    </ul>
  );
}

/** Activity-ledger attempt list — avatar, when it happened, and the score on the right. */
export function LogsList({ logs, accent, empty = "No attempts yet — be the first to claim the laurel." }: { logs: QuizLogRow[]; accent: string; empty?: string }) {
  if (logs.length === 0) {
    return <p className={"px-5 py-8 text-center text-sm text-gray-500"}>{empty}</p>;
  }
  return (
    <ul className={"divide-y divide-gray-100/80"}>
      {logs.map((log) => (
        <li key={log.id} className={"flex items-center gap-3 px-4 py-3 md:px-5"}>
          <span
            className={"grid size-9 shrink-0 place-items-center rounded-full text-xs font-bold"}
            style={{ backgroundColor: `${accent}1a`, color: accent }}
          >
            {initials(log.name)}
          </span>
          <span className={"min-w-0 flex-1"}>
            <span className={"block truncate text-sm font-medium text-gray-800"}>{log.name}</span>
            <span className={"block text-[11px] tabular-nums text-gray-400"}>
              {fmtDate(log.at)} · {fmtTime(log.milliseconds)}
            </span>
          </span>
          <span className={"shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-gray-500"}>
            {log.correct}/{log.total}
          </span>
          <ScoreChip score={log.score} accent={accent} />
        </li>
      ))}
    </ul>
  );
}