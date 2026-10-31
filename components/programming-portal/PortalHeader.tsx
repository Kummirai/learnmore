"use client";

import { LuCircleCheck, LuGraduationCap } from "react-icons/lu";
import { TOTAL_MILESTONES } from "@/lib/programming-portal";

/**
 * Sticky progress bar for the programming portal. The blueprint has no XP or
 * streaks — progression is milestone approvals signed off by an instructor,
 * so the header simply shows how many of the 16 milestones are approved.
 */
export default function PortalHeader({
  approved,
  studentName,
}: {
  approved: number;
  studentName?: string | null;
}) {
  const pct = TOTAL_MILESTONES
    ? Math.round((approved / TOTAL_MILESTONES) * 100)
    : 0;

  return (
    <div
      className={
        "sticky top-0 z-40 border-b border-teal/40 bg-deep-navy/95 backdrop-blur"
      }
    >
      <div
        className={
          "mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3"
        }
      >
        <div className={"flex min-w-0 items-center gap-3"}>
          <span
            className={
              "grid size-11 shrink-0 place-items-center border border-teal bg-teal/15 text-teal"
            }
            aria-hidden={"true"}
          >
            <LuGraduationCap className={"size-5"} />
          </span>
          <div className={"min-w-0"}>
            <p
              className={
                "text-[10px] font-bold uppercase tracking-widest text-white/50"
              }
            >
              {studentName ? `${studentName} · Progress` : "Your progress"}
            </p>
            <p className={"text-lg font-black leading-tight text-white"}>
              {approved}/{TOTAL_MILESTONES} milestones
            </p>
          </div>
        </div>

        <div className={"min-w-[180px] flex-1"}>
          <div
            className={"h-2 w-full border border-portal-line bg-portal-ink"}
            role={"progressbar"}
            aria-valuemin={0}
            aria-valuemax={TOTAL_MILESTONES}
            aria-valuenow={approved}
            aria-label={"Approved milestones"}
          >
            <div
              className={"h-full bg-teal transition-[width] duration-500"}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p
            className={
              "mt-1.5 flex items-center gap-1.5 text-[11px] text-white/50"
            }
          >
            <LuCircleCheck className={"size-3.5 text-teal-glow"} />
            Approved by your instructor
          </p>
        </div>
      </div>
    </div>
  );
}
