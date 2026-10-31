"use client";

import { LuCircleCheck, LuClock } from "react-icons/lu";
import { type PortalYear, milestoneKey } from "@/lib/programming-portal";

/**
 * Read-only milestone checklist for the active year. Students review the
 * curated resources, build their capstone, then an instructor approves each
 * milestone from the admin panel — this list mirrors that record.
 */
export default function MilestoneChecklist({
  year,
  doneKeys,
}: {
  year: PortalYear;
  doneKeys: Set<string>;
}) {
  const doneCount = year.milestones.filter((m) =>
    doneKeys.has(milestoneKey(year.year, m.id)),
  ).length;

  return (
    <section className={"portal-card p-5 md:p-6"} aria-label={"Milestones"}>
      <div className={"flex flex-wrap items-end justify-between gap-3 pb-4"}>
        <div>
          <span
            className={
              "text-[11px] font-bold uppercase tracking-widest text-teal"
            }
          >
            Profile milestones
          </span>
          <h2 className={"mt-1 text-xl font-black text-white"}>
            Year {year.year} checklist
          </h2>
        </div>
        <p
          className={
            "border border-teal/40 bg-teal/10 px-3 py-1 text-xs font-bold text-teal-glow"
          }
        >
          {doneCount}/{year.milestones.length} approved
        </p>
      </div>

      <ol className={"divide-y divide-portal-line border-t border-portal-line"}>
        {year.milestones.map((milestone, index) => {
          const done = doneKeys.has(milestoneKey(year.year, milestone.id));
          return (
            <li key={milestone.id} className={"flex items-start gap-3 py-4"}>
              <span
                className={
                  `mt-0.5 grid size-7 shrink-0 place-items-center border text-xs font-black` +
                  (done
                    ? " border-teal bg-teal text-white"
                    : " border-portal-line bg-portal-ink text-white/40")
                }
                aria-hidden={"true"}
              >
                {done ? <LuCircleCheck className={"size-4"} /> : index + 1}
              </span>

              <div className={"min-w-0 flex-1"}>
                <div className={"flex flex-wrap items-center gap-2"}>
                  <h3
                    className={
                      done
                        ? "text-sm font-bold text-teal-glow"
                        : "text-sm font-bold text-white"
                    }
                  >
                    {milestone.title}
                  </h3>
                  {done ? (
                    <span
                      className={
                        "inline-flex items-center gap-1 border border-teal/40 bg-teal/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-teal-glow"
                      }
                    >
                      <LuCircleCheck className={"size-3"} /> Approved
                    </span>
                  ) : (
                    <span
                      className={
                        "inline-flex items-center gap-1 border border-white/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/45"
                      }
                    >
                      <LuClock className={"size-3"} /> Awaiting sign-off
                    </span>
                  )}
                </div>
                <p className={"mt-1 text-sm leading-relaxed text-white/60"}>
                  {milestone.brief}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      <p
        className={
          "mt-4 border border-teal/30 bg-teal/5 px-4 py-3 text-xs leading-relaxed text-white/60"
        }
      >
        Finish the work, then show it to your instructor. They approve each
        milestone from the admin panel and your progress updates here
        automatically.
      </p>
    </section>
  );
}
