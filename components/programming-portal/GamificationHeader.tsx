"use client";

import { useEffect, useState } from "react";
import { LuFlame, LuSparkles, LuZap } from "react-icons/lu";
import { LEVEL_XP, levelFromXp } from "@/lib/programming-portal";
import type { XpCelebration } from "@/lib/use-programming-portal";

/**
 * Sticky gamification bar for the programming portal: student level, total
 * XP with progress to the next level, and the daily streak. Emits a floating
 * "+XP" toast whenever the hook reports a celebration.
 */
export default function GamificationHeader({
  xp,
  streak,
  celebration,
  onCelebrationDone,
  studentName,
}: {
  xp: number;
  streak: { current: number; longest: number };
  celebration: XpCelebration | null;
  onCelebrationDone: () => void;
  studentName?: string | null;
}) {
  const { level, into, needed, pct } = levelFromXp(xp);
  const [dismissedNonce, setDismissedNonce] = useState(0);
  const toast =
    celebration && celebration.nonce > dismissedNonce ? celebration : null;

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => {
      setDismissedNonce(toast.nonce);
      onCelebrationDone();
    }, 1500);
    return () => window.clearTimeout(timer);
  }, [toast, onCelebrationDone]);

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
            <LuZap className={"size-5"} />
          </span>
          <div className={"min-w-0"}>
            <p
              className={
                "text-[10px] font-bold uppercase tracking-widest text-white/50"
              }
            >
              {studentName ? `${studentName} · Level` : "Level"}
            </p>
            <p className={"text-lg font-black leading-tight text-white"}>
              {level}
            </p>
          </div>
        </div>

        <div className={"min-w-[180px] flex-1"}>
          <div
            className={"flex items-baseline justify-between gap-3 text-xs"}
          >
            <span
              className={
                "inline-flex items-center gap-1.5 font-bold uppercase tracking-widest text-teal"
              }
            >
              <LuSparkles className={"size-3.5"} />
              {xp} XP
            </span>
            <span className={"text-white/50"}>
              {into}/{LEVEL_XP} to level {level + 1}
            </span>
          </div>
          <div
            className={
              "mt-1.5 h-2 w-full border border-portal-line bg-portal-ink"
            }
            role={"progressbar"}
            aria-valuemin={0}
            aria-valuemax={LEVEL_XP}
            aria-valuenow={into}
            aria-label={`Level ${level} progress`}
          >
            <div
              className={"h-full bg-teal transition-[width] duration-500"}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className={"mt-1 text-[11px] text-white/40"}>
            {needed} XP until your next level
          </p>
        </div>

        <div
          className={
            "flex items-center gap-3 border-l border-white/10 pl-6"
          }
        >
          <LuFlame
            className={
              streak.current > 0 ? "size-5 text-teal-glow" : "size-5 text-white/30"
            }
          />
          <div>
            <p
              className={
                "text-[10px] font-bold uppercase tracking-widest text-white/50"
              }
            >
              Daily streak
            </p>
            <p className={"text-lg font-black leading-tight text-white"}>
              {streak.current}
              <span className={"ml-1 text-xs font-semibold text-white/50"}>
                day{streak.current === 1 ? "" : "s"}
              </span>
            </p>
          </div>
        </div>

        {toast ? (
          <span
            key={toast.nonce}
            className={
              "portal-xp-toast pointer-events-none absolute right-6 top-2 z-50 border border-teal bg-portal-ink px-3 py-1.5 text-sm font-black text-teal-glow"
            }
            role={"status"}
          >
            +{toast.xp} XP{toast.label ? ` · ${toast.label}` : ""}
          </span>
        ) : null}
      </div>
    </div>
  );
}
