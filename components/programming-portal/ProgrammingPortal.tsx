"use client";

import { useCallback, useMemo, useState } from "react";
import { LuX } from "react-icons/lu";
import GamificationHeader from "@/components/programming-portal/GamificationHeader";
import MasterBadgeCard from "@/components/programming-portal/MasterBadgeCard";
import MilestoneChecklist from "@/components/programming-portal/MilestoneChecklist";
import CodeSandbox from "@/components/programming-portal/CodeSandbox";
import QuizPanel from "@/components/programming-portal/QuizPanel";
import {
  PORTAL_YEARS,
  type PortalMilestone,
  milestoneKey,
  nextTestableMilestone,
} from "@/lib/programming-portal";
import { useProgrammingPortal } from "@/lib/use-programming-portal";

/**
 * The Sprout Tweens 4-Year Evolving Profile learning portal.
 *
 * Year tabs switch the active curriculum slice; milestones, sandbox and the
 * concept quiz all read/write progress through useProgrammingPortal so the
 * mobile companion sees the same XP, streak and completion state.
 */
export default function ProgrammingPortal() {
  const {
    user,
    progress,
    loading,
    error,
    busy,
    celebration,
    clearCelebration,
    isMilestoneDone,
    setMilestone,
    submitQuiz,
    claimMasterBadge,
  } = useProgrammingPortal();

  const [activeYear, setActiveYear] = useState(1);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<
    string | null
  >(() => {
    const first = PORTAL_YEARS[0];
    return nextTestableMilestone(first, new Set())?.id ?? first.milestones[0]?.id ?? null;
  });
  const [authNudge, setAuthNudge] = useState<string | null>(null);

  const year = PORTAL_YEARS.find((y) => y.year === activeYear) ?? PORTAL_YEARS[0];

  const doneKeys = useMemo(() => {
    const set = new Set<string>();
    for (const key of progress?.milestones ?? []) set.add(key);
    return set;
  }, [progress]);

  const signedIn = !!user;

  const selectYear = useCallback(
    (yearNum: number) => {
      const next = PORTAL_YEARS.find((y) => y.year === yearNum);
      setActiveYear(yearNum);
      setAuthNudge(null);
      if (next) {
        setSelectedMilestoneId(
          nextTestableMilestone(next, doneKeys)?.id ??
            next.milestones[0]?.id ??
            null,
        );
      }
    },
    [doneKeys],
  );

  const handleToggleManual = useCallback(
    async (milestone: PortalMilestone, completed: boolean) => {
      if (!signedIn) {
        setAuthNudge("milestone");
        return;
      }
      try {
        await setMilestone(year.year, milestone.id, completed, milestone.title);
      } catch {
        /* error surfaced through hook */
      }
    },
    [signedIn, setMilestone, year],
  );

  const handleTestPass = useCallback(
    async (milestone: PortalMilestone) => {
      if (isMilestoneDone(year.year, milestone.id)) return;
      if (!signedIn) {
        setAuthNudge("pass");
        return;
      }
      try {
        await setMilestone(year.year, milestone.id, true, milestone.title);
      } catch {
        /* error surfaced through hook */
      }
    },
    [signedIn, isMilestoneDone, setMilestone, year],
  );

  const handleQuizSubmit = useCallback(
    async (score: number) => {
      await submitQuiz(year.year, year.quiz.id, score);
    },
    [submitQuiz, year],
  );

  const yearDone = year.milestones.filter((m) =>
    doneKeys.has(milestoneKey(year.year, m.id)),
  ).length;

  return (
    <div className={"min-h-screen bg-portal-ink text-white"}>
      <GamificationHeader
        xp={progress?.xp ?? 0}
        streak={{
          current: progress?.streak?.current ?? 0,
          longest: progress?.streak?.longest ?? 0,
        }}
        celebration={celebration}
        onCelebrationDone={clearCelebration}
        studentName={user?.name ?? null}
      />

      <div className={"mx-auto max-w-6xl px-4 py-8"}>
        {loading ? (
          <p
            className={
              "portal-card flex items-center gap-3 px-5 py-6 text-sm text-white/70"
            }
          >
            <span
              className={
                "size-4 animate-spin border-2 border-teal border-t-transparent"
              }
              aria-hidden={"true"}
            />
            Loading your portal progress…
          </p>
        ) : null}

        {error ? (
          <p
            role={"alert"}
            className={
              "mb-4 border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300"
            }
          >
            {error}
          </p>
        ) : null}

        {authNudge ? (
          <div
            className={
              "mb-4 flex flex-wrap items-center gap-3 border border-gold-400/50 bg-gold-400/10 px-4 py-3 text-sm text-white/85"
            }
            role={"status"}
          >
            <span>
              {authNudge === "pass"
                ? "Your code passed every rule — sign in and we'll save the milestone + XP."
                : "Sign in to tick milestones, earn XP and track your streak."}
            </span>
            <a
              href={
                "/signin?next=/sprout-tweens/skills/sprout_03_programming/learn"
              }
              className={
                "portal-btn portal-btn-primary !px-4 !py-1.5 text-xs"
              }
            >
              Sign in now
            </a>
            <button
              type={"button"}
              onClick={() => setAuthNudge(null)}
              className={"ml-auto text-white/50 hover:text-white"}
              aria-label={"Dismiss"}
            >
              <LuX className={"size-4"} />
            </button>
          </div>
        ) : null}

        {/* Year selector */}
        <div
          className={
            "flex flex-wrap gap-1 border border-portal-line bg-portal-slate p-1.5"
          }
          role={"tablist"}
          aria-label={"Curriculum year"}
        >
          {PORTAL_YEARS.map((item) => {
            const active = item.year === activeYear;
            return (
              <button
                key={item.year}
                type={"button"}
                role={"tab"}
                aria-selected={active}
                onClick={() => selectYear(item.year)}
                className={
                  "portal-tab flex-1 !border-b-2 text-left"
                }
                style={
                  active
                    ? {
                        backgroundColor: "rgba(0,128,128,0.16)",
                        borderBottomColor: "#008080",
                        color: "#ffffff",
                      }
                    : undefined
                }
              >
                <span className={"block text-[10px] uppercase tracking-widest"}>
                  Year {item.year} · Age {item.age}
                </span>
                <span className={"mt-0.5 block text-sm font-black"}>
                  {item.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Year intro */}
        <section className={"portal-card mt-4 p-5 md:p-6"}>
          <div className={"flex flex-wrap items-start justify-between gap-4"}>
            <div className={"min-w-0 flex-1"}>
              <span
                className={
                  "text-[11px] font-bold uppercase tracking-widest text-teal"
                }
              >
                Year {year.year} · {year.subtitle}
              </span>
              <h1 className={"mt-1 text-2xl font-black text-white"}>
                {year.title}
              </h1>
              <p className={"mt-2 max-w-2xl text-sm leading-relaxed text-white/65"}>
                {year.focus}
              </p>
              <p className={"mt-3 text-sm leading-relaxed text-white/80"}>
                <span
                  className={
                    "font-bold uppercase tracking-wider text-teal-glow"
                  }
                >
                  Adds to your profile:{" "}
                </span>
                {year.profileAddition}
              </p>
            </div>
            <p
              className={
                "border border-teal/40 bg-teal/10 px-4 py-2 text-sm font-black text-teal-glow"
              }
            >
              {yearDone}/{year.milestones.length} milestones
            </p>
          </div>

          <div className={"mt-4 border-t border-portal-line pt-4"}>
            <p
              className={
                "text-[11px] font-bold uppercase tracking-widest text-white/40"
              }
            >
              Concepts you&apos;ll learn
            </p>
            <div className={"mt-2 flex flex-wrap gap-2"}>
              {year.concepts.map((concept) => (
                <span
                  key={concept}
                  className={
                    "font-code border border-portal-line bg-portal-ink px-2.5 py-1 text-[11px] font-semibold text-white/75"
                  }
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>
        </section>

        <div className={"mt-4 space-y-4"}>
          <MilestoneChecklist
            year={year}
            doneKeys={doneKeys}
            busy={busy}
            signedIn={signedIn}
            selectedMilestoneId={selectedMilestoneId}
            onSelectMilestone={(id) => {
              setSelectedMilestoneId(id);
              document
                .getElementById("portal-sandbox")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            onToggleManual={(milestone, completed) =>
              void handleToggleManual(milestone, completed)
            }
          />

          <div id={"portal-sandbox"} className={"scroll-mt-24"}>
            <CodeSandbox
              key={year.year}
              year={year}
              selectedMilestoneId={selectedMilestoneId}
              doneKeys={doneKeys}
              onTestPass={(milestone) => void handleTestPass(milestone)}
            />
          </div>

          <QuizPanel
            year={year}
            best={progress?.quizzes?.[year.quiz.id]}
            busy={busy}
            signedIn={signedIn}
            onSubmit={handleQuizSubmit}
          />

          {year.year === 4 ? (
            <MasterBadgeCard
              progress={progress}
              busy={busy}
              signedIn={signedIn}
              onClaim={async () => {
                try {
                  await claimMasterBadge();
                } catch {
                  /* error surfaced through hook */
                }
              }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
