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
import type { HonorRequirement } from "@/constants/sproutHonors";

type Progress = {
  checks: boolean[];
  criteria?: boolean[][];
  status: "not_started" | "in_progress" | "complete";
  /** When the record was opened — set on enroll or first write. */
  enrolledAt?: string | null;
  updatedAt?: string;
  completedAt?: string | null;
  savings?: { total?: number; deposits?: unknown[] };
};

type Savings = { total: number; deposits: { amount: number; at?: string }[] };

const input =
  "mt-0.5 size-4 shrink-0 accent-cyan focus:ring-cyan/40 cursor-pointer";

const EMPTY_SAVINGS: Savings = { total: 0, deposits: [] };

function normalizeSavings(raw: unknown): Savings {
  const s = raw as { total?: unknown; deposits?: unknown };
  if (!s || typeof s !== "object") return EMPTY_SAVINGS;
  const total =
    typeof s.total === "number" && Number.isFinite(s.total) ? s.total : 0;
  const deposits = Array.isArray(s.deposits)
    ? s.deposits
        .map((d) => {
          const row = d as { amount?: unknown; at?: unknown };
          return {
            amount: Number(row?.amount) || 0,
            at: typeof row?.at === "string" ? row.at : undefined,
          };
        })
        .filter((d) => d.amount > 0)
    : [];
  return { total, deposits };
}

/** Blank criteria grid shaped to this badge's requirement definitions. */
function blankCriteria(requirements: HonorRequirement[]): boolean[][] {
  return requirements.map((req) => req.criteria.map(() => false));
}

/**
 * Shape whatever the API returns to the criteria grid this badge defines now.
 * Old records only stored a requirement-level tick — treat that as every
 * criterion under it proven.
 */
function hydrateCriteria(
  raw: Progress | null,
  requirements: HonorRequirement[],
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

/**
 * A participant's live measurable status for one honor: enrollment opens the
 * record, then every requirement is broken into concrete pass criteria, each
 * ticked as it is proven in front of a leader. Saved against the signed-in
 * account the moment a box is ticked.
 */
export default function HonorProgress({
  badgeId,
  badgeName,
  requirements,
  piggyBank,
  whatsappGroupLink,
}: {
  badgeId: string;
  badgeName: string;
  requirements: HonorRequirement[];
  /** Money honors only — weekly saving × course weeks = the piggy target. */
  piggyBank?: { weekly: number; weeks: number };
  whatsappGroupLink?: string;
}) {
  const { user, loading } = useAuth();
  const [criteria, setCriteria] = useState<boolean[][]>(() =>
    blankCriteria(requirements),
  );
  const [progress, setProgress] = useState<Progress | null>(null);
  const [savings, setSavings] = useState<Savings>(EMPTY_SAVINGS);
  const [amount, setAmount] = useState("");
  const [adding, setAdding] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState("");
  const inFlight = useRef(0);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    fetch(`/api/sprout/honors/${encodeURIComponent(badgeId)}`)
      .then((r) => (r.ok ? r.json() : { data: null }))
      .then((json) => {
        if (cancelled) return;
        const mine: Progress | null = json?.data ?? null;
        if (mine) {
          setProgress(mine);
          setCriteria(hydrateCriteria(mine, requirements));
          if (mine.savings) setSavings(normalizeSavings(mine.savings));
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [user, badgeId, requirements]);

  async function save(next: boolean[][]) {
    const snapshot = criteria;
    const ticket = ++inFlight.current;
    setCriteria(next);
    setSaving(true);
    setError("");
    try {
      const res = await fetch(
        `/api/sprout/honors/${encodeURIComponent(badgeId)}`,
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
        if (json.data.savings) setSavings(normalizeSavings(json.data.savings));
      }
    } catch (err) {
      setCriteria(snapshot);
      setError((err as Error).message);
    } finally {
      if (ticket === inFlight.current) setSaving(false);
    }
  }

  /** Open the record — after this, progress can be filled in. */
  async function enroll() {
    setEnrolling(true);
    setError("");
    try {
      const res = await fetch(
        `/api/sprout/honors/${encodeURIComponent(badgeId)}`,
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
        if (json.data.savings) setSavings(normalizeSavings(json.data.savings));
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setEnrolling(false);
    }
  }

  async function addDeposit(event: React.FormEvent) {
    event.preventDefault();
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      setError("Enter the amount you saved — above R0.");
      return;
    }
    setAdding(true);
    setError("");
    try {
      const res = await fetch(
        `/api/sprout/honors/${encodeURIComponent(badgeId)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deposit: Math.round(value * 100) / 100 }),
        },
      );
      const json = await res.json().catch(() => ({}));
      if (res.status === 401)
        throw new Error("Your sign-in has expired — please sign in again.");
      if (!res.ok) throw new Error(json?.error || "Could not save your savings.");
      if (json?.data?.savings) setSavings(normalizeSavings(json.data.savings));
      setAmount("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setAdding(false);
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

  const piggyTarget = piggyBank ? piggyBank.weekly * piggyBank.weeks : 0;
  const piggyPct = piggyTarget
    ? Math.min(100, Math.round((savings.total / piggyTarget) * 100))
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
          {badgeName}
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

        {piggyBank && (
          <div
            className={
              "mb-4 rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3"
            }
          >
            <p
              className={
                "text-[11px] font-bold uppercase tracking-widest text-amber-700"
              }
            >
              Piggy bank
            </p>
            <p className={"mt-1 text-sm text-gray-700 leading-snug"}>
              Bank <strong className="text-navy">R{piggyBank.weekly}</strong>{" "}
              every week for {piggyBank.weeks}{" "}
              {piggyBank.weeks === 1 ? "week" : "weeks"} — everyone shows their
              jar at{" "}
              <strong className="text-navy">R{piggyTarget}</strong> by the end
              of the course.
            </p>
          </div>
        )}

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
            href={`/signin?next=${encodeURIComponent(`/sprout/honors/${badgeId}`)}`}
            className="inline-flex items-center gap-2 rounded-lg bg-cyan text-white px-6 py-3 text-sm font-bold hover:bg-cyan-dark transition-colors"
          >
            <LuLogIn /> Sign in to start
          </Link>
        </div>
      </div>
    );
  }

  // Signed in but not enrolled yet — enroll first, then progress fills in.
  if (!progress?.enrolledAt) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
          Get started
        </p>
        <h3 className="font-bold text-navy text-lg leading-snug">
          {badgeName}
        </h3>

        <div className="mt-4 flex gap-3 rounded-xl border border-cyan/20 bg-alice-blue/60 p-4">
          <div className="size-10 shrink-0 rounded-full bg-white flex items-center justify-center">
            <LuAward className="text-base text-cyan" />
          </div>
          <div>
            <h4 className="font-bold text-navy mb-1">Enroll to start</h4>
            <p className="text-sm text-slate-gray leading-snug">
              Enroll for this honor, then tick each criterion as you prove it —
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
          {enrolling ? "Enrolling…" : `Enroll in ${badgeName}`}
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

        {piggyBank && (
          <div
            className={
              "rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3"
            }
          >
            <p
              className={
                "text-[11px] font-bold uppercase tracking-widest text-amber-700"
              }
            >
              Piggy bank
            </p>
            <p className={"mt-1 text-sm text-gray-700 leading-snug"}>
              Bank <strong className="text-navy">R{piggyBank.weekly}</strong>{" "}
              every week for {piggyBank.weeks}{" "}
              {piggyBank.weeks === 1 ? "week" : "weeks"} — everyone shows their
              jar at <strong className="text-navy">R{piggyTarget}</strong> by
              the end of the course.
            </p>
          </div>
        )}
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
            {badgeName}
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

      {piggyBank && (
        <div
          className={
            "mb-5 rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-3.5"
          }
        >
          <div className={"flex items-start justify-between gap-3"}>
            <div className={"min-w-0"}>
              <p
                className={
                  "text-[11px] font-bold uppercase tracking-widest text-amber-700"
                }
              >
                Piggy bank
              </p>
              <p className={"mt-1 text-sm text-gray-700 leading-snug"}>
                Save{" "}
                <strong className="text-navy">R{piggyBank.weekly}</strong> a
                week for {piggyBank.weeks}{" "}
                {piggyBank.weeks === 1 ? "week" : "weeks"} — target{" "}
                <strong className="text-navy">R{piggyTarget}</strong>
              </p>
            </div>
            <p className={"shrink-0 text-right"}>
              <span className={"block text-lg font-black leading-tight text-navy"}>
                R{savings.total.toFixed(2)}
              </span>
              <span className={"block text-[11px] text-slate-gray"}>banked</span>
            </p>
          </div>

          <div
            className={
              "mt-2.5 h-2 w-full overflow-hidden rounded-full bg-amber-100"
            }
          >
            <div
              className={"h-full rounded-full bg-amber-500 transition-all duration-500"}
              style={{ width: `${piggyPct}%` }}
            />
          </div>

          <form
            onSubmit={addDeposit}
            className={"mt-3 flex items-center gap-2"}
          >
            <label className={"relative flex-1"}>
              <span
                aria-hidden={"true"}
                className={
                  "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400"
                }
              >
                R
              </span>
              <input
                type={"number"}
                min={"1"}
                step={"0.5"}
                inputMode={"decimal"}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={String(piggyBank.weekly)}
                aria-label={"Amount you saved"}
                className={
                  "w-full rounded-lg border border-amber-200 bg-white py-2 pl-7 pr-3 text-sm text-gray-800 focus:border-amber-400 focus:outline-none"
                }
              />
            </label>
            <button
              type={"submit"}
              disabled={adding}
              className={
                "shrink-0 rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-amber-600 disabled:opacity-50"
              }
            >
              {adding ? "Saving…" : "Add savings"}
            </button>
          </form>

          {savings.deposits.length > 0 && (
            <p className={"mt-2 text-[11px] text-slate-gray"}>
              {savings.deposits.length} deposit
              {savings.deposits.length === 1 ? "" : "s"} logged
              {savings.deposits[savings.deposits.length - 1].at
                ? ` · last ${new Date(
                    savings.deposits[savings.deposits.length - 1].at!,
                  ).toLocaleDateString("en-ZA", {
                    day: "numeric",
                    month: "short",
                  })}`
                : ""}
            </p>
          )}
        </div>
      )}

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
            confirm and award <strong className="text-navy">{badgeName}</strong>.
          </p>
        ) : (
          <p className="text-sm text-gray-700 leading-relaxed">
            Tick each criterion as you prove it — a requirement is proven when
            all of its criteria are ticked. A leader checks the same record
            before the honor is awarded.
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
