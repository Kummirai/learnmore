"use client";

import { useMemo, useState } from "react";
import type { ProgramCalendarEntry } from "@/lib/program-calendar";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * A club's year calendar, grouped by month. Rows are buttons: clicking one
 * opens that date's full details (description, term, time, place) inline.
 */
export default function ProgramCalendar({
  entries,
  year,
  clubColor,
}: {
  entries: ProgramCalendarEntry[];
  year: number;
  clubColor: string;
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  const months = useMemo(() => {
    const sorted = [...entries].sort(
      (a, b) =>
        a.date.localeCompare(b.date) || a.title.localeCompare(b.title),
    );
    const groups: { month: number; rows: ProgramCalendarEntry[] }[] = [];
    for (const entry of sorted) {
      const month = Number(entry.date.slice(5, 7)) - 1;
      const last = groups[groups.length - 1];
      if (last && last.month === month) last.rows.push(entry);
      else groups.push({ month, rows: [entry] });
    }
    return groups;
  }, [entries]);

  if (entries.length === 0) return null;

  return (
    <div className={"mb-8"}>
      {months.map((group) => (
        <div key={group.month} className={"mb-8"}>
          <h3
            className={
              "text-sm font-semibold text-gray-400 uppercase tracking-widest mb-2"
            }
          >
            {MONTHS[group.month]} {year}
          </h3>
          <div className={"grid grid-cols-1 md:grid-cols-2 gap-x-12"}>
            {group.rows.map((entry) => {
              const when = new Date(`${entry.date}T00:00:00`);
              const isOpen = openId === entry.id;
              const meta = [entry.time, entry.location, entry.setting]
                .filter(Boolean)
                .join(" · ");
              return (
                <div
                  key={entry.id}
                  className={"border-b border-gray-100 last:border-b-0"}
                >
                  <button
                    type={"button"}
                    aria-expanded={isOpen}
                    onClick={() => setOpenId(isOpen ? null : entry.id)}
                    className={
                      "group -mx-3 flex w-full items-start gap-3 rounded-lg px-3 py-4 text-left hover:bg-alice-blue/70 transition-colors"
                    }
                  >
                    <span
                      className={
                        "flex w-12 shrink-0 flex-col items-center rounded-lg py-1.5"
                      }
                      style={{ backgroundColor: `${clubColor}1a` }}
                    >
                      <span
                        className={
                          "text-[10px] font-semibold uppercase tracking-widest text-gray-500"
                        }
                      >
                        {when.toLocaleDateString("en-GB", { weekday: "short" })}
                      </span>
                      <span
                        className={
                          "text-lg font-black leading-tight text-gray-800"
                        }
                      >
                        {when.getDate()}
                      </span>
                    </span>
                    <span className={"min-w-0 flex-1"}>
                      <span
                        className={
                          "flex flex-wrap items-center gap-2 text-[15px] font-medium text-gray-800 group-hover:text-cyan-dark transition-colors"
                        }
                      >
                        {entry.title}
                        {entry.setting && (
                          <span
                            className={
                              "rounded-full bg-alice-blue px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-gray"
                            }
                          >
                            {entry.setting}
                          </span>
                        )}
                      </span>
                      {entry.description && !isOpen && (
                        <span
                          className={
                            "mt-1 block text-sm text-gray-500 leading-snug line-clamp-2"
                          }
                        >
                          {entry.description}
                        </span>
                      )}
                      {meta && (
                        <span
                          className={
                            "mt-1 block text-[13px] text-slate-gray leading-snug"
                          }
                        >
                          {meta}
                        </span>
                      )}
                    </span>
                    <span
                      aria-hidden={"true"}
                      className={
                        "mt-1 shrink-0 text-sm font-semibold text-cyan transition-transform " +
                        (isOpen ? "rotate-90" : "group-hover:translate-x-1")
                      }
                    >
                      →
                    </span>
                  </button>
                  {isOpen && entry.description && (
                    <div
                      className={
                        "mb-4 ml-15 rounded-xl border border-gray-100 bg-alice-blue/50 px-4 py-3 text-sm text-gray-600 leading-relaxed"
                      }
                    >
                      {entry.term && (
                        <p
                          className={
                            "mb-1 text-[11px] font-semibold uppercase tracking-widest text-cyan"
                          }
                        >
                          {entry.term}
                        </p>
                      )}
                      {entry.description}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
