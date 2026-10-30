"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FaCheck } from "react-icons/fa";
import {
  LuAward,
  LuBook,
  LuBriefcase,
  LuCircle,
  LuCircleCheck,
  LuLoaderCircle,
  LuLock,
  LuLogIn,
  LuWallet,
} from "react-icons/lu";
import { useAuth } from "@/components/AuthProvider";
import type { Skill, SkillLevelEntry, SkillRequirement } from "@/lib/skills";

type Progress = {
  checks: boolean[];
  criteria?: boolean[][];
  status: "not_started" | "in_progress" | "complete";
  enrolledAt?: string | null;
  updatedAt?: string;
  completedAt?: string | null;
};

type ModuleStatus = "completed" | "in_progress" | "not_started" | "locked";

function blankCriteria(requirements: SkillRequirement[]): boolean[][] {
  return requirements.map((req) => req.criteria.map(() => false));
}

function hydrateCriteria(
  raw: Progress | null,
  requirements: SkillRequirement[],
): boolean[][] {
  if (!raw) return blankCriteria(requirements);
  return requirements.map((req, i) => {
    const row = raw.criteria?.[i];
    if (Array.isArray(row) && row.length > 0) {
      return req.criteria.map((_, j) => row[j] === true);
    }
    if (raw.checks?.[i] === true) return req.criteria.map(() => true);
    return req.criteria.map(() => false);
  });
}

function rowComplete(row: boolean[] | undefined, length: number): boolean {
  return length > 0 && !!row && row.length === length && row.every(Boolean);
}

function gridPct(requirements: SkillRequirement[], grid: boolean[][]): number {
  const total = requirements.reduce((sum, r) => sum + r.criteria.length, 0);
  const done = grid.reduce((sum, row) => sum + row.filter(Boolean).length, 0);
  return total ? Math.round((done / total) * 100) : 0;
}

function moduleStatuses(
  requirements: SkillRequirement[],
  grid: boolean[][],
): ModuleStatus[] {
  let prevComplete = true;
  return requirements.map((req, i) => {
    const row = grid[i] ?? [];
    const done = row.filter(Boolean).length;
    const complete = rowComplete(row, req.criteria.length);
    let status: ModuleStatus;
    if (complete) status = "completed";
    else if (done > 0) status = "in_progress";
    else if (prevComplete) status = "not_started";
    else status = "locked";
    prevComplete = complete;
    return status;
  });
}

const MODULE_CHIP: Record<ModuleStatus, { label: string; cls: string }> = {
  completed: { label: "Completed", cls: "bg-green-100 text-green-700" },
  in_progress: { label: "In progress", cls: "bg-amber-100 text-amber-700" },
  not_started: { label: "Not started", cls: "bg-gray-100 text-gray-500" },
  locked: { label: "Locked", cls: "bg-gray-100 text-gray-400" },
};

function fmtMoney(amount: number): string {
  return `R${new Intl.NumberFormat("en-ZA").format(amount)}`;
}

function LevelChip({ level }: { level: SkillLevelEntry }) {
  return (
    <span
      className={"size-2.5 shrink-0 rounded-full"}
      style={{ backgroundColor: level.color || "#13c5dd" }}
      aria-hidden={"true"}
    />
  );
}

function RequirementList({
  requirements,
  grid,
}: {
  requirements: SkillRequirement[];
  grid: boolean[][];
}) {
  return (
    <ol className={"space-y-3"}>
      {requirements.map((req, i) => {
        const row = grid[i] ?? req.criteria.map(() => false);
        const rowDone = row.filter(Boolean).length;
        const reqProven = rowComplete(row, req.criteria.length);
        return (
          <li
            key={req.text}
            className={`rounded-xl border px-3.5 py-3 ${
              reqProven
                ? "border-green-200 bg-green-50/50"
                : "border-gray-100"
            }`}
          >
            <div className={"flex items-start justify-between gap-3"}>
              <span
                className={
                  "text-[11px] font-bold uppercase tracking-wider text-gray-400"
                }
              >
                Requirement {i + 1}
              </span>
              <span
                className={`shrink-0 text-[11px] font-bold ${
                  reqProven ? "text-green-700" : "text-gray-400"
                }`}
              >
                {reqProven
                  ? "Proven"
                  : `${rowDone} of ${req.criteria.length} criteria`}
              </span>
            </div>
            <p className={"mt-1 text-sm leading-snug text-gray-700"}>
              {req.text}
            </p>

            <ul className={"mt-2.5 space-y-1"}>
              {req.criteria.map((criterion, j) => {
                const done = row[j] === true;
                return (
                  <li
                    key={criterion}
                    className={
                      "flex items-start gap-2.5 rounded-lg px-2 py-1.5 -mx-0.5"
                    }
                  >
                    {done ? (
                      <LuCircleCheck
                        aria-hidden="true"
                        className={"mt-0.5 shrink-0 text-sm text-green-600"}
                      />
                    ) : (
                      <LuCircle
                        aria-hidden="true"
                        className={"mt-0.5 shrink-0 text-sm text-gray-300"}
                      />
                    )}
                    <span
                      className={`text-[13px] leading-snug ${
                        done ? "text-gray-400 line-through" : "text-slate-gray"
                      }`}
                    >
                      {criterion}
                    </span>
                  </li>
                );
              })}
            </ul>

            {reqProven && (
              <p
                className={
                  "mt-1 flex items-center gap-1.5 text-xs font-semibold text-green-700"
                }
              >
                <LuCircleCheck aria-hidden="true" /> Requirement proven
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function LearningTracker({
  learning,
  provider,
  learningUrl,
  grid,
  live,
  accent,
}: {
  learning: SkillLevelEntry;
  provider?: string;
  learningUrl?: string;
  grid: boolean[][];
  live: boolean;
  accent: string;
}) {
  const requirements = learning.requirements ?? [];
  const statuses = moduleStatuses(requirements, grid);
  const pct = gridPct(requirements, grid);
  const complete = requirements.filter((_, i) =>
    statuses[i] === "completed",
  ).length;

  return (
    <div className={"rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"}>
      <div className={"flex flex-wrap items-start justify-between gap-3"}>
        <div>
          <span
            className={
              "flex items-center gap-1.5 text-xs uppercase tracking-widest font-medium"
            }
            style={{ color: accent }}
          >
            <LuBook aria-hidden="true" /> Learning Tracker
          </span>
          {provider && (
            <p className={"mt-1 text-sm text-slate-gray"}>
              {provider}
            </p>
          )}
          {learningUrl && (
            <a
              href={learningUrl}
              target={"_blank"}
              rel={"noreferrer"}
              className={
                "mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-dark hover:underline"
              }
            >
              Start the free course <span aria-hidden={"true"}>↗</span>
            </a>
          )}
          {learningUrl && (
            <p className={"mt-1 max-w-md text-xs text-slate-gray leading-relaxed"}>
              Learning comes from expert sites and videos — RelateWorld mentors
              you through it and logs every milestone here.
            </p>
          )}
        </div>
        {live && (
          <span
            className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
              pct === 100
                ? "bg-green-100 text-green-700"
                : pct > 0
                  ? "bg-cyan/10 text-cyan-dark"
                  : "bg-gray-100 text-gray-500"
            }`}
          >
            {pct}%
          </span>
        )}
      </div>

      {live && (
        <div className={"mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-100"}>
          <div
            className={"h-full rounded-full transition-all duration-500"}
            style={{ width: `${pct}%`, backgroundColor: pct === 100 ? "#16a34a" : accent }}
          />
        </div>
      )}

      <ol className={"mt-4 space-y-2"}>
        {requirements.map((req, i) => (
          <li
            key={req.text}
            className={
              "flex items-center justify-between gap-3 rounded-xl border border-gray-100 px-4 py-3"
            }
          >
            <span className={"flex min-w-0 items-center gap-3"}>
              <span
                className={
                  "flex size-6 shrink-0 items-center justify-center rounded-full bg-gray-50 text-[11px] font-bold text-gray-500"
                }
              >
                {i + 1}
              </span>
              <span className={"truncate text-sm font-medium text-gray-700"}>
                {req.text}
              </span>
            </span>
            {live ? (
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${MODULE_CHIP[statuses[i]].cls}`}
              >
                {MODULE_CHIP[statuses[i]].label}
              </span>
            ) : (
              <span className={"shrink-0 text-[11px] text-gray-400"}>
                {req.criteria.length} criteria
              </span>
            )}
          </li>
        ))}
      </ol>

      {live && (
        <p className={"mt-3 text-xs text-slate-gray"}>
          <strong className={"text-navy"}>
            {complete} of {requirements.length} modules complete
          </strong>{" "}
          · {pct}% of criteria proven
        </p>
      )}
      {!live && (
        <p className={"mt-3 text-xs text-slate-gray"}>
          Sign in and enroll to track each module as you complete it.
        </p>
      )}
    </div>
  );
}

function ProjectBoard({
  skill,
  level2,
  level2Grid,
  live,
  learningComplete,
  unlockDone,
  accent,
}: {
  skill: Skill;
  level2?: SkillLevelEntry;
  level2Grid: boolean[][];
  live: boolean;
  learningComplete: boolean;
  unlockDone: boolean;
  accent: string;
}) {
  const detail = skill.detail;
  const projects = detail?.projects ?? [];
  if (projects.length === 0) return null;

  const requirements = level2?.requirements ?? [];

  return (
    <div className={"rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"}>
      <span
        className={
          "flex items-center gap-1.5 text-xs uppercase tracking-widest font-medium"
        }
        style={{ color: accent }}
      >
        <LuBriefcase aria-hidden="true" /> Project Board
      </span>
      {detail?.unlockRule && (
        <p className={"mt-1 text-sm text-slate-gray"}>{detail.unlockRule}</p>
      )}

      <ul className={"mt-4 space-y-3"}>
        {projects.map((project, i) => {
          const req = requirements[i];
          const pairedDone =
            live && req ? rowComplete(level2Grid[i], req.criteria.length) : false;
          const tier1 = /tier\s*1/i.test(project.tier);
          const locked = !tier1 && !unlockDone;
          const status = pairedDone
            ? "completed"
            : locked
              ? "locked"
              : "unlocked";
          return (
            <li
              key={project.title}
              className={
                "flex items-start justify-between gap-3 rounded-xl border border-gray-100 px-4 py-3"
              }
            >
              <span className={"min-w-0"}>
                <span className={"block text-sm font-semibold text-gray-800 leading-snug"}>
                  {project.title}
                </span>
                <span className={"mt-1 block text-xs text-slate-gray"}>
                  {project.tier}
                  {project.fee ? ` · ${project.fee}` : ""}
                </span>
              </span>
              {live &&
                (status === "completed" ? (
                  <span
                    className={
                      "shrink-0 rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-green-700"
                    }
                  >
                    Completed
                  </span>
                ) : status === "locked" ? (
                  <span
                    className={
                      "flex shrink-0 items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-400"
                    }
                  >
                    <LuLock aria-hidden="true" /> Locked
                  </span>
                ) : (
                  <span
                    className={
                      "shrink-0 rounded-full bg-cyan/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-cyan-dark"
                    }
                  >
                    Unlocked
                  </span>
                ))}
            </li>
          );
        })}
      </ul>

      {live && (
        <p className={"mt-3 text-xs text-slate-gray"}>
          {learningComplete || unlockDone
            ? "Tier 2 projects are open — claim yours with your leader."
            : "Complete the required Learning module to unlock higher tiers."}
        </p>
      )}
    </div>
  );
}

function LaunchFundWidget({
  fund,
  accent,
}: {
  fund: NonNullable<Skill["detail"]>["launchFund"];
  accent: string;
}) {
  if (!fund?.goalName) return null;
  return (
    <div className={"rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"}>
      <span
        className={
          "flex items-center gap-1.5 text-xs uppercase tracking-widest font-medium"
        }
        style={{ color: accent }}
      >
        <LuWallet aria-hidden="true" /> Launch Fund
      </span>

      <div className={"mt-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3.5"}>
        <div className={"flex items-center justify-between gap-3"}>
          <span className={"text-sm font-semibold text-gray-800"}>
            {fund.goalName}
          </span>
          {typeof fund.targetAmount === "number" && (
            <span className={"text-sm font-bold text-navy"}>
              {fmtMoney(fund.targetAmount)}
            </span>
          )}
        </div>
        <div className={"mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200"}>
          <div
            className={"h-full rounded-full bg-gray-300"}
            style={{ width: "0%" }}
          />
        </div>
        <p className={"mt-2 text-[12px] text-slate-gray"}>
          Savings sync is coming — until then, log contributions in your
          Savings Log.
        </p>
      </div>

      {fund.autoRouting && (
        <p className={"mt-3 text-xs text-slate-gray"}>{fund.autoRouting}</p>
      )}
      {fund.disbursementRule && (
        <p className={"mt-1 text-xs text-slate-gray"}>
          <strong className={"text-navy"}>Disbursement:</strong>{" "}
          {fund.disbursementRule}
        </p>
      )}
    </div>
  );
}

function ProgressCheckStrip({
  levels,
  grids,
  live,
  accent,
}: {
  levels: SkillLevelEntry[];
  grids: Record<string, boolean[][]>;
  live: boolean;
  accent: string;
}) {
  const learning = levels[0];
  const earning = levels[1];
  const cells = [
    {
      label: "Learning",
      pct: learning ? gridPct(learning.requirements ?? [], grids[learning.id] ?? []) : 0,
      enabled: !!learning,
    },
    {
      label: "Earning",
      pct: earning ? gridPct(earning.requirements ?? [], grids[earning.id] ?? []) : 0,
      enabled: !!earning,
    },
  ];

  return (
    <div className={"rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"}>
      <span
        className={
          "flex items-center gap-1.5 text-xs uppercase tracking-widest font-medium"
        }
        style={{ color: accent }}
      >
        <LuCircleCheck aria-hidden="true" /> Progress Check
      </span>

      <div className={"mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3"}>
        {cells.map((cell) => {
          const status = !cell.enabled
            ? { text: "Not part of this skill", cls: "text-gray-400" }
            : !live
              ? { text: "Sign in to track", cls: "text-gray-400" }
              : cell.pct === 100
                ? { text: "Complete", cls: "text-green-600" }
                : cell.pct > 0
                  ? { text: "In progress", cls: "text-amber-600" }
                  : { text: "Not started", cls: "text-red-500" };
          return (
            <div
              key={cell.label}
              className={"rounded-xl border border-gray-100 px-4 py-3"}
            >
              <p className={"text-[11px] font-bold uppercase tracking-wider text-gray-400"}>
                {cell.label}
              </p>
              <p className={"mt-1 flex items-center gap-2 text-sm font-semibold text-gray-700"}>
                <span
                  className={
                    `size-2.5 rounded-full ${
                      status.cls.includes("green")
                        ? "bg-green-500"
                        : status.cls.includes("amber")
                          ? "bg-amber-500"
                          : status.cls.includes("red")
                            ? "bg-red-400"
                            : "bg-gray-300"
                    }`
                  }
                  aria-hidden={"true"}
                />
                {status.text}
              </p>
              {live && cell.enabled && (
                <p className={"mt-0.5 text-xs text-slate-gray"}>{cell.pct}% proven</p>
              )}
            </div>
          );
        })}
        <div className={"rounded-xl border border-gray-100 px-4 py-3"}>
          <p className={"text-[11px] font-bold uppercase tracking-wider text-gray-400"}>
            Saving
          </p>
          <p className={"mt-1 flex items-center gap-2 text-sm font-semibold text-gray-700"}>
            <span className={"size-2.5 rounded-full bg-gray-300"} aria-hidden={"true"} />
            Not connected
          </p>
          <p className={"mt-0.5 text-xs text-slate-gray"}>
            Launch Fund savings coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SkillDashboard({
  skill,
  clubSlug,
  whatsappGroupLink,
  accent,
}: {
  skill: Skill;
  clubSlug: string;
  whatsappGroupLink?: string;
  accent: string;
}) {
  const { user, loading } = useAuth();
  const levels = useMemo(
    () =>
      (skill.levels ?? []).length > 0
        ? skill.levels
        : [
            {
              id: skill.levelId,
              name: "Level",
              levelNumber: 1,
              color: skill.color ?? "#13c5dd",
              colorDark: skill.color ?? "#0fa3c4",
              requirements: skill.requirements ?? [],
            },
          ],
    [skill],
  );

  const [grids, setGrids] = useState<Record<string, boolean[][]>>({});
  const [prog, setProg] = useState<Record<string, Progress | null>>({});
  const [loaded, setLoaded] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    Promise.all(
      levels.map(async (level) => {
        try {
          const res = await fetch(
            `/api/skills/${encodeURIComponent(skill.id)}?levelId=${encodeURIComponent(level.id)}`,
          );
          if (!res.ok) return [level.id, null] as const;
          const json = await res.json().catch(() => ({}));
          return [level.id, (json?.data ?? null) as Progress | null] as const;
        } catch {
          return [level.id, null] as const;
        }
      }),
    ).then((entries) => {
      if (cancelled) return;
      const nextProg: Record<string, Progress | null> = {};
      const nextGrids: Record<string, boolean[][]> = {};
      for (const [levelId, doc] of entries) {
        nextProg[levelId] = doc;
        const level = levels.find((l) => l.id === levelId);
        if (level) nextGrids[levelId] = hydrateCriteria(doc, level.requirements ?? []);
      }
      setProg(nextProg);
      setGrids(nextGrids);
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, [user, skill.id, levels]);

  async function enroll() {
    setEnrolling(true);
    setError("");
    const first = levels[0];
    try {
      const res = await fetch(`/api/skills/${encodeURIComponent(skill.id)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enroll: true, levelId: first.id }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.status === 401)
        throw new Error("Your sign-in has expired — please sign in again.");
      if (!res.ok) throw new Error(json?.error || "Could not enroll — please try again.");
      if (json?.data) {
        setProg((p) => ({ ...p, [first.id]: json.data }));
        setGrids((g) => ({
          ...g,
          [first.id]: hydrateCriteria(json.data, first.requirements ?? []),
        }));
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setEnrolling(false);
    }
  }

  const detail = skill.detail;
  const hasDetail = !!(
    detail &&
    (detail.learningProvider || detail.projects?.length || detail.launchFund || detail.tools?.length)
  );
  const enrolled = levels.some((l) => prog[l.id]?.enrolledAt);
  const live = !!user && loaded && enrolled;

  const learning = levels[0];
  const learningGrid = grids[learning?.id ?? ""] ?? blankCriteria(learning?.requirements ?? []);
  const learningComplete = live
    ? (learning?.requirements ?? []).every((req, i) =>
        rowComplete(learningGrid[i], req.criteria.length),
      )
    : false;
  const unlockAfter = detail?.unlockAfter;
  const unlockAfterIndex = unlockAfter
    ? (learning?.requirements ?? []).findIndex((req) =>
        req.text.toLowerCase().includes(unlockAfter.toLowerCase()),
      )
    : -1;
  const unlockDone = !unlockAfter
    ? learningComplete
    : unlockAfterIndex >= 0
      ? live &&
        rowComplete(
          learningGrid[unlockAfterIndex],
          (learning?.requirements ?? [])[unlockAfterIndex]?.criteria.length ?? 0,
        )
      : learningComplete;

  const level2 = levels[1];
  const level2Grid =
    grids[level2?.id ?? ""] ?? blankCriteria(level2?.requirements ?? []);

  const accentColor = accent;

  if (loading || (user && !loaded)) {
    return (
      <div className={"rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"}>
        <div className={"flex items-center gap-2 text-sm text-slate-gray"}>
          <LuLoaderCircle className={"animate-spin"} /> Loading your progress…
        </div>
      </div>
    );
  }

  return (
    <>
      {hasDetail && (
        <div className={"space-y-4"}>
          <LearningTracker
            learning={learning}
            provider={detail?.learningProvider}
            learningUrl={detail?.learningUrl}
            grid={learningGrid}
            live={live}
            accent={accentColor}
          />
          <div className={"grid grid-cols-1 md:grid-cols-2 gap-4"}>
            <ProjectBoard
              skill={skill}
              level2={level2}
              level2Grid={level2Grid}
              live={live}
              learningComplete={learningComplete}
              unlockDone={unlockDone}
              accent={accentColor}
            />
            <LaunchFundWidget fund={detail?.launchFund} accent={accentColor} />
          </div>
          <ProgressCheckStrip levels={levels} grids={grids} live={live} accent={accentColor} />
        </div>
      )}

      {error && (
        <p
          role={"alert"}
          className={
            "rounded-2xl border border-red-200 bg-red-50 text-red-600 text-sm px-4 py-3"
          }
        >
          {error}
        </p>
      )}

      {!user && (
        <div className={"rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"}>
          <p className={"text-[11px] font-bold uppercase tracking-widest text-gray-400"}>
            How it&apos;s proven
          </p>
          <h3 className={"font-bold text-navy text-lg leading-snug mb-4"}>
            {skill.name}
          </h3>

          {levels.map((level) => (
            <div key={level.id} className={"mb-5 last:mb-0"}>
              <p className={"mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-400"}>
                <LevelChip level={level} /> {level.name}
              </p>
              <RequirementList
                requirements={level.requirements ?? []}
                grid={blankCriteria(level.requirements ?? [])}
              />
            </div>
          ))}

          <div className={"rounded-xl border border-cyan/20 bg-alice-blue/60 p-4"}>
            <div className={"mb-3 size-10 rounded-full bg-white flex items-center justify-center"}>
              <LuLogIn className={"text-base text-cyan"} />
            </div>
            <h4 className={"font-bold text-navy mb-1"}>Track your progress</h4>
            <p className={"text-sm text-slate-gray mb-4"}>
              Sign in to tick off each measurable criterion as you prove it —
              your record stays with your account and your leader sees the same
              one.
            </p>
            <Link
              href={`/signin?next=${encodeURIComponent(`/${clubSlug}/skills/${skill.id}`)}`}
              className={
                "inline-flex items-center gap-2 rounded-lg bg-cyan text-white px-6 py-3 text-sm font-bold hover:bg-cyan-dark transition-colors"
              }
            >
              <LuLogIn /> Sign in to start
            </Link>
          </div>
        </div>
      )}

      {user && !enrolled && (
        <div className={"rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"}>
          <p className={"text-[11px] font-bold uppercase tracking-widest text-gray-400"}>
            Get started
          </p>
          <h3 className={"font-bold text-navy text-lg leading-snug"}>
            {skill.name}
          </h3>

          <div className={"mt-4 flex gap-3 rounded-xl border border-cyan/20 bg-alice-blue/60 p-4"}>
            <div className={"size-10 shrink-0 rounded-full bg-white flex items-center justify-center"}>
              <LuAward className={"text-base text-cyan"} />
            </div>
            <div>
              <h4 className={"font-bold text-navy mb-1"}>Enroll to start</h4>
              <p className={"text-sm text-slate-gray leading-snug"}>
                Enroll for this skill, then tick each criterion as you prove it —
                your record saves to your account and your leader sees the same
                one.
              </p>
            </div>
          </div>

          <button
            type={"button"}
            onClick={enroll}
            disabled={enrolling}
            className={
              "mt-4 inline-flex items-center gap-2 rounded-lg bg-cyan text-white px-6 py-3 text-sm font-bold hover:bg-cyan-dark transition-colors disabled:opacity-60"
            }
          >
            {enrolling ? <LuLoaderCircle className={"animate-spin"} /> : <LuAward />}
            {enrolling ? "Enrolling…" : `Enroll in ${skill.name}`}
          </button>

          <p className={"mt-6 mb-3 text-[11px] font-bold uppercase tracking-widest text-gray-400"}>
            What you&apos;ll prove
          </p>
          {levels.map((level) => (
            <div key={level.id} className={"mb-5 last:mb-0"}>
              <p className={"mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-400"}>
                <LevelChip level={level} /> {level.name}
              </p>
              <RequirementList
                requirements={level.requirements ?? []}
                grid={blankCriteria(level.requirements ?? [])}
              />
            </div>
          ))}
        </div>
      )}

      {live && (
        <>
          {levels.map((level) => {
            const grid = grids[level.id] ?? blankCriteria(level.requirements ?? []);
            const requirements = level.requirements ?? [];
            const totalCriteria = requirements.reduce((s, r) => s + r.criteria.length, 0);
            const doneCriteria = grid.reduce((s, row) => s + row.filter(Boolean).length, 0);
            const completeReqs = requirements.filter((req, i) =>
              rowComplete(grid[i], req.criteria.length),
            ).length;
            const pct = gridPct(requirements, grid);
            const allDone = totalCriteria > 0 && doneCriteria === totalCriteria;
            const doc = prog[level.id];
            return (
              <section
                key={level.id}
                className={"rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"}
              >
                <div className={"flex items-start justify-between gap-3 mb-4"}>
                  <div>
                    <p
                      className={
                        "flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-400"
                      }
                    >
                      <LevelChip level={level} /> Level {level.levelNumber} · {level.name}
                    </p>
                    {level.description && (
                      <p className={"mt-1 text-sm text-slate-gray leading-snug"}>
                        {level.description}
                      </p>
                    )}
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
                      allDone
                        ? "bg-green-100 text-green-700"
                        : doneCriteria > 0
                          ? "bg-cyan/10 text-cyan-dark"
                          : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {allDone ? "Complete" : doneCriteria > 0 ? "In progress" : "Not started"}
                  </span>
                </div>

                <div className={"mb-5"}>
                  <div className={"h-2 w-full overflow-hidden rounded-full bg-gray-100"}>
                    <div
                      className={"h-full rounded-full transition-all duration-500"}
                      style={{
                        width: `${pct}%`,
                        backgroundColor: allDone ? "#16a34a" : level.colorDark || accentColor,
                      }}
                    />
                  </div>
                  <p className={"mt-1.5 text-xs text-slate-gray"}>
                    <strong className={"text-navy"}>
                      {doneCriteria} of {totalCriteria} criteria proven ({pct}%)
                    </strong>{" "}
                    · {completeReqs} of {requirements.length} requirements complete
                    {doc?.completedAt && allDone
                      ? ` · completed ${new Date(doc.completedAt).toLocaleDateString("en-ZA", { day: "numeric", month: "long" })}`
                      : ""}
                  </p>
                </div>

                <RequirementList
                  requirements={requirements}
                  grid={grid}
                />
              </section>
            );
          })}

          <div
            className={"rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"}
          >
            <div className={"mt-1 rounded-lg bg-alice-blue/70 border border-cyan/20 px-4 py-3"}>
              <p className={"text-sm text-gray-700 leading-relaxed"}>
                {levels.every((level) => {
                  const grid = grids[level.id] ?? [];
                  const total = (level.requirements ?? []).reduce(
                    (s, r) => s + r.criteria.length,
                    0,
                  );
                  const done = grid.reduce((s, row) => s + row.filter(Boolean).length, 0);
                  return total > 0 && done === total;
                }) ? (
                  <>
                    <FaCheck className={"mr-1.5 inline text-green-600"} />
                    Every criterion is proven. Your instructor confirms the
                    sign-off and awards{" "}
                    <strong className={"text-navy"}>{skill.name}</strong>.
                  </>
                ) : (
                  <>
                    Your instructor marks each criterion as you prove it — a
                    requirement counts once all of its criteria are signed off.
                    Progress updates here automatically.
                  </>
                )}
              </p>
              {whatsappGroupLink && (
                <a
                  href={whatsappGroupLink}
                  target={"_blank"}
                  rel={"noreferrer"}
                  className={
                    "mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-dark hover:underline"
                  }
                >
                  Ask your leader on WhatsApp →
                </a>
              )}
            </div>

            <p className={"mt-3 flex items-center gap-2 text-[11px] text-slate-gray"}>
              <LuCircle className={"text-[6px]"} /> Synced with your instructor&rsquo;s
              sign-off record.
            </p>
          </div>
        </>
      )}
    </>
  );
}
