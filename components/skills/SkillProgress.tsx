"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaCheck } from "react-icons/fa";
import {
  LuCircleCheck,
  LuLoaderCircle,
  LuLogIn,
  LuCircle,
  LuAward,
} from "react-icons/lu";
import { useAuth } from "@/components/AuthProvider";
import type { SkillRequirement } from "@/lib/skills";

type Progress = {
  checks: boolean[];
  criteria?: boolean[][];
  status: "not_started" | "in_progress" | "complete";
  enrolledAt?: string | null;
  updatedAt?: string;
  completedAt?: string | null;
};

const input =
  "mt-0.5 size-4 shrink-0 accent-cyan focus:ring-cyan/40 cursor-pointer";

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

export default function SkillProgress({
  skillId,
  skillName,
  requirements,
  clubSlug,
  whatsappGroupLink,
}: {
  skillId: string;
  skillName: string;
  requirements: SkillRequirement[];
  clubSlug: string;
  whatsappGroupLink?: string;
}) {
  const { user, loading } = useAuth();
  const [criteria, setCriteria] = useState<boolean[][]>(() =>
    blankCriteria(requirements),
  );
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState("");
  const inFlight = useRef(0);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    fetch(`/api/skills/${encodeURIComponent(clubSlug)}/${encodeURIComponent(skillId)}`)
      .then((r) => (r.ok ? r.json() : { data: null }))
      .then((json) => {
        if (cancelled) return;
        const mine: Progress | null = json?.data ?? null;
        if (mine) {
          setProgress(mine);
          setCriteria(hydrateCriteria(mine, requirements));
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [user, skillId, requirements, clubSlug]);

  async function save(next: boolean[][]) {
    const snapshot = criteria;
    const ticket = ++inFlight.current;
    setCriteria(next);
    setSaving(true);
    setError("");
    try {
      const res = await fetch(
        `/api/skills/${encodeURIComponent(clubSlug)}/${encodeURIComponent(skillId)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ criteria: next }),
        },
      );
      const json = await res.json().catch(() => ({}));
      if (res.status === 401)
        throw new Error("Your sign-in has expired — please sign in again.");
      if (!res.ok) throw new Error(json?.error || "Could not save your progress.");
      if (ticket === inFlight.current && json?.data) {
        setProgress(json.data);
      }
    } catch (err) {
      setCriteria(snapshot);
      setError((err as Error).message);
    } finally {
      if (ticket === inFlight.current) setSaving(false);
    }
  }

  async function enroll() {
    setEnrolling(true);
    setError("");
    try {
      const res = await fetch(
        `/api/skills/${encodeURIComponent(clubSlug)}/${encodeURIComponent(skillId)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ enroll: true }),
        },
      );
      const json = await res.json().catch(() => ({}));
      if (res.status === 401)
        throw new Error("Your sign-in has expired — please sign in again.");
      if (!res.ok) throw new Error(json?.error || "Could not enroll — please try again.");
      if (json?.data) {
        setProgress(json.data);
        setCriteria(hydrateCriteria(json.data, requirements));
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setEnrolling(false);
    }
  }

  function toggle(reqIndex: number, critIndex: number) {
    const next = criteria.map((row, i) =>
      i === reqIndex
        ? row.map((value, j) => (j === critIndex ? !value : value))
        : row,
    );
    void save(next);
  }

  const criterionTotal = requirements.reduce(
    (sum, req) => sum + req.criteria.length,
    0,
  );
  const criterionDone = criteria.reduce(
    (sum, row) => sum + row.filter(Boolean).length,
    0,
  );
  const total = requirements.length;
  const done = criteria.filter(
    (row) => row.length > 0 && row.every(Boolean),
  ).length;
  const allDone = total > 0 && done === total;
  const pct = criterionTotal
    ? Math.round((criterionDone / criterionTotal) * 100)
    : 0;

  if (loading || (user && !loaded)) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-slate-gray">
          <LuLoaderCircle className="animate-spin" /> Loading your progress…
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
          How it&apos;s proven
        </p>
        <h3 className="font-bold text-navy text-lg leading-snug mb-4">
          {skillName}
        </h3>

        <ol className="space-y-3 mb-5">
          {requirements.map((req, i) => (
            <li key={req.text} className="rounded-lg bg-gray-50 px-3.5 py-3">
              <div className="flex gap-3">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-white text-[11px] font-bold text-gray-400">
                  {i + 1}
                </span>
                <span className="text-sm text-gray-700 leading-snug">
                  {req.text}
                </span>
              </div>
              <ul className="mt-2 space-y-1.5 border-l-2 border-cyan/30 pl-6">
                {req.criteria.map((criterion) => (
                  <li
                    key={criterion}
                    className="text-[13px] leading-snug text-slate-gray"
                  >
                    {criterion}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <div className="rounded-xl border border-cyan/20 bg-alice-blue/60 p-4">
          <div className="mb-3 size-10 rounded-full bg-white flex items-center justify-center">
            <LuLogIn className="text-base text-cyan" />
          </div>
          <h4 className="font-bold text-navy mb-1">Track your progress</h4>
          <p className="text-sm text-slate-gray mb-4">
            Sign in to tick off each measurable criterion as you prove it —
            your record stays with your account and your leader sees the same
            one.
          </p>
          <Link
            href={`/signin?next=${encodeURIComponent(`/${clubSlug}/skills/${skillId}`)}`}
            className="inline-flex items-center gap-2 rounded-lg bg-cyan text-white px-6 py-3 text-sm font-bold hover:bg-cyan-dark transition-colors"
          >
            <LuLogIn /> Sign in to start
          </Link>
        </div>
      </div>
    );
  }

  // Signed in but not enrolled yet
  if (!progress?.enrolledAt) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
          Get started
        </p>
        <h3 className="font-bold text-navy text-lg leading-snug">
          {skillName}
        </h3>

        <div className="mt-4 flex gap-3 rounded-xl border border-cyan/20 bg-alice-blue/60 p-4">
          <div className="size-10 shrink-0 rounded-full bg-white flex items-center justify-center">
            <LuAward className="text-base text-cyan" />
          </div>
          <div>
            <h4 className="font-bold text-navy mb-1">Enroll to start</h4>
            <p className="text-sm text-slate-gray leading-snug">
              Enroll for this skill, then tick each criterion as you prove it —
              your record saves to your account and your leader sees the same
              one.
            </p>
          </div>
        </div>

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3"
          >
            {error}
          </p>
        )}

        <button
          type={"button"}
          onClick={enroll}
          disabled={enrolling}
          className={
            "mt-4 inline-flex items-center gap-2 rounded-lg bg-cyan text-white px-6 py-3 text-sm font-bold hover:bg-cyan-dark transition-colors disabled:opacity-60"
          }
        >
          {enrolling ? <LuLoaderCircle className="animate-spin" /> : <LuAward />}
          {enrolling ? "Enrolling…" : `Enroll in ${skillName}`}
        </button>

        <p className="mt-6 mb-3 text-[11px] font-bold uppercase tracking-widest text-gray-400">
          What you&apos;ll prove
        </p>
        <ol className="space-y-3 mb-5">
          {requirements.map((req, i) => (
            <li key={req.text} className="rounded-lg bg-gray-50 px-3.5 py-3">
              <div className="flex gap-3">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-white text-[11px] font-bold text-gray-400">
                  {i + 1}
                </span>
                <span className="text-sm text-gray-700 leading-snug">
                  {req.text}
                </span>
              </div>
              <ul className="mt-2 space-y-1.5 border-l-2 border-cyan/30 pl-6">
                {req.criteria.map((criterion) => (
                  <li
                    key={criterion}
                    className="text-[13px] leading-snug text-slate-gray"
                  >
                    {criterion}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
            Your progress
          </p>
          <h3 className="font-bold text-navy text-lg leading-snug">
            {skillName}
          </h3>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
            allDone
              ? "bg-green-100 text-green-700"
              : criterionDone > 0
                ? "bg-cyan/10 text-cyan-dark"
                : "bg-gray-100 text-gray-500"
          }`}
        >
          {allDone
            ? "Complete"
            : criterionDone > 0
              ? "In progress"
              : "Not started"}
        </span>
      </div>

      <div className="mb-5">
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              backgroundColor: allDone ? "#16a34a" : "#13c5dd",
            }}
          />
        </div>
        <p className="mt-1.5 text-xs text-slate-gray">
          <strong className="text-navy">
            {criterionDone} of {criterionTotal} criteria proven ({pct}%)
          </strong>{" "}
          · {done} of {total} requirements complete
          {progress?.completedAt && allDone
            ? ` · completed ${new Date(progress.completedAt).toLocaleDateString("en-ZA", { day: "numeric", month: "long" })}`
            : ""}
        </p>
      </div>

      <ol className="space-y-3">
        {requirements.map((req, i) => {
          const row = criteria[i] ?? req.criteria.map(() => false);
          const rowDone = row.filter(Boolean).length;
          const reqProven = rowDone === req.criteria.length;
          return (
            <li
              key={req.text}
              className={`rounded-xl border px-3.5 py-3 transition-colors ${
                reqProven
                  ? "border-green-200 bg-green-50/50"
                  : "border-gray-100 hover:border-cyan/40"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Requirement {i + 1}
                </span>
                <span
                  className={`shrink-0 text-[11px] font-bold ${
                    reqProven ? "text-green-700" : "text-cyan-dark"
                  }`}
                >
                  {reqProven
                    ? "Proven"
                    : `${rowDone} of ${req.criteria.length} criteria`}
                </span>
              </div>
              <p className="mt-1 text-sm leading-snug text-gray-700">
                {req.text}
              </p>

              <ul className="mt-2.5 space-y-1">
                {req.criteria.map((criterion, j) => (
                  <li key={criterion}>
                    <label className="flex cursor-pointer items-start gap-2.5 rounded-lg px-2 py-1.5 -mx-0.5 transition-colors hover:bg-alice-blue/50">
                      <input
                        type="checkbox"
                        checked={row[j] === true}
                        onChange={() => toggle(i, j)}
                        className={input}
                        aria-label={`Criterion for requirement ${i + 1}: ${criterion}`}
                      />
                      <span
                        className={`text-[13px] leading-snug ${
                          row[j] ? "text-gray-400 line-through" : "text-slate-gray"
                        }`}
                      >
                        {criterion}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>

              {reqProven && (
                <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-green-700">
                  <LuCircleCheck aria-hidden="true" /> Requirement proven
                </p>
              )}
            </li>
          );
        })}
      </ol>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3"
        >
          {error}
        </p>
      )}

      <div className="mt-5 rounded-lg bg-alice-blue/70 border border-cyan/20 px-4 py-3">
        {allDone ? (
          <p className="text-sm text-gray-700 leading-relaxed">
            <FaCheck className="mr-1.5 inline text-green-600" />
            Every criterion is ticked. Show this record to your leader — they
            confirm and award <strong className="text-navy">{skillName}</strong>.
          </p>
        ) : (
          <p className="text-sm text-gray-700 leading-relaxed">
            Tick each criterion as you prove it — a requirement is proven when
            all of its criteria are ticked. A leader checks the same record
            before the skill is awarded.
          </p>
        )}
        {whatsappGroupLink && (
          <a
            href={whatsappGroupLink}
            target={"_blank"}
            rel={"noreferrer"}
            className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-dark hover:underline"
          >
            Ask your leader on WhatsApp →
          </a>
        )}
      </div>

      <p className="mt-3 flex items-center gap-2 text-[11px] text-slate-gray">
        {saving ? (
          <>
            <LuLoaderCircle className="animate-spin" /> Saving…
          </>
        ) : (
          <>
            <LuCircle className="text-[6px]" /> Saved automatically to your
            account.
          </>
        )}
      </p>
    </div>
  );
}
