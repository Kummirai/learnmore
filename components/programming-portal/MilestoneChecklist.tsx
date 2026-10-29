"use client";

import Link from "next/link";
import {
  LuCircleCheck,
  LuLoaderCircle,
  LuLogIn,
  LuTestTubeDiagonal,
} from "react-icons/lu";
import {
  MILESTONE_XP,
  type PortalMilestone,
  type PortalYear,
  milestoneKey,
} from "@/lib/programming-portal";

/**
 * Monthly milestone checklist for the active year. Milestones with sandbox
 * rules open the code tester; reflective milestones are plain checkboxes.
 * Every completion is worth +50 XP and persists to the portal API.
 */
export default function MilestoneChecklist({
  year,
  doneKeys,
  busy,
  signedIn,
  selectedMilestoneId,
  onSelectMilestone,
  onToggleManual,
}: {
  year: PortalYear;
  doneKeys: Set<string>;
  busy: boolean;
  signedIn: boolean;
  selectedMilestoneId: string | null;
  onSelectMilestone: (id: string) => void;
  onToggleManual: (milestone: PortalMilestone, completed: boolean) => void;
}) {
  const doneCount = year.milestones.filter((m) =>
    doneKeys.has(milestoneKey(year.year, m.id)),
  ).length;

  return (
    <section className={"portal-card p-5 md:p-6"} aria-label={"Milestones"}>
      <div
        className={"flex flex-wrap items-end justify-between gap-3 pb-4"}
      >
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
          {doneCount}/{year.milestones.length} done · +{MILESTONE_XP} XP each
        </p>
      </div>

      {!signedIn ? (
        <div
          className={
            "mb-4 flex flex-wrap items-center gap-3 border border-gold-400/40 bg-gold-400/10 px-4 py-3 text-sm text-white/85"
          }
        >
          <span>
            Browse freely — sign in to tick milestones, earn XP and keep your
            website safe.
          </span>
          <Link
            href={"/signin?next=/sprout-tweens/skills/sprout_03_programming/learn"}
            className={
              "portal-btn portal-btn-primary !px-4 !py-2 text-xs"
            }
          >
            <LuLogIn className={"size-4"} />
            Sign in to save
          </Link>
        </div>
      ) : null}

      <ol className={"divide-y divide-portal-line border-t border-portal-line"}>
        {year.milestones.map((milestone, index) => {
          const key = milestoneKey(year.year, milestone.id);
          const done = doneKeys.has(key);
          const testable = !!milestone.rules?.length;
          const selected = selectedMilestoneId === milestone.id;

          return (
            <li
              key={milestone.id}
              className={
                `flex flex-wrap items-start gap-3 py-4 transition-colors` +
                (selected ? " bg-teal/5" : "")
              }
            >
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
                  <span
                    className={
                      "border border-teal/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-teal"
                    }
                  >
                    +{MILESTONE_XP} XP
                  </span>
                  {done ? (
                    <span
                      className={
                        "text-[10px] font-bold uppercase tracking-wider text-teal-glow"
                      }
                    >
                      Completed
                    </span>
                  ) : null}
                </div>
                <p className={"mt-1 text-sm leading-relaxed text-white/60"}>
                  {milestone.brief}
                </p>
              </div>

              <div className={"shrink-0 pt-0.5"}>
                {testable ? (
                  <button
                    type={"button"}
                    onClick={() => onSelectMilestone(milestone.id)}
                    className={
                      done
                        ? "portal-btn portal-btn-ghost !px-3 !py-1.5 text-xs text-teal-glow"
                        : selected
                          ? "portal-btn portal-btn-primary !px-3 !py-1.5 text-xs portal-glow"
                          : "portal-btn portal-btn-ghost !px-3 !py-1.5 text-xs"
                    }
                    aria-pressed={selected}
                  >
                    <LuTestTubeDiagonal className={"size-3.5"} />
                    {done ? "View rules" : selected ? "Selected" : "Test in sandbox"}
                  </button>
                ) : (
                  <button
                    type={"button"}
                    disabled={busy}
                    onClick={() => onToggleManual(milestone, !done)}
                    className={
                      "portal-btn !px-3 !py-1.5 text-xs " +
                      (done
                        ? "portal-btn-primary"
                        : "portal-btn-ghost")
                    }
                    aria-pressed={done}
                  >
                    {busy ? (
                      <LuLoaderCircle className={"size-3.5 animate-spin"} />
                    ) : null}
                    {done ? "Done ✓" : "Mark complete"}
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
