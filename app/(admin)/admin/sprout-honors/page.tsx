"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AdminHeader, Badge, Select } from "@/components/admin/ui";
import { getHonor, HONOR_ENTRIES, HONOR_LEVELS } from "@/constants/sproutHonors";
import { LuExternalLink, LuSearch } from "react-icons/lu";

type Status = "not_started" | "in_progress" | "complete";

type Row = {
    userId: string;
    badgeId: string;
    name: string;
    email: string;
    status: Status;
    criteriaDone: number;
    criteriaTotal: number;
    requirementsDone: number;
    requirementsTotal: number;
    savingsTotal: number;
    savingsCount: number;
    completedAt: string | null;
    updatedAt: string | null;
};

/** Empty filter = every record, whatever honor it belongs to. */
const ALL_HONORS = "";

export default function AdminSproutHonorsPage() {
    return (
        <section
            className="flex-1 px-4 py-10 md:py-14"
            style={{ background: "linear-gradient(115deg, #f5f8fb 0%, #eff5f9 60%, #f5f8fb 100%)" }}
        >
            <div className="max-w-6xl mx-auto">
                <HonorsBody />
            </div>
        </section>
    );
}

function HonorsBody() {
    const [badgeId, setBadgeId] = useState<string>(ALL_HONORS);
    const [payload, setPayload] = useState<{ badge: string; rows: Row[] } | null>(null);
    const [error, setError] = useState("");
    const [query, setQuery] = useState("");

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const qs = badgeId ? `?badge=${encodeURIComponent(badgeId)}` : "";
                const res = await fetch(`/api/admin/sprout/honors${qs}`);
                const json = await res.json().catch(() => null);
                if (cancelled) return;
                if (!res.ok) {
                    setError(typeof json?.error === "string" ? json.error : "Couldn't load honor progress.");
                    setPayload({ badge: badgeId, rows: [] });
                    return;
                }
                setError("");
                setPayload({ badge: badgeId, rows: Array.isArray(json?.data) ? json.data : [] });
            } catch {
                if (cancelled) return;
                setError("Couldn't reach the API. Is the backend up?");
                setPayload({ badge: badgeId, rows: [] });
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [badgeId]);

    const loading = payload === null || payload.badge !== badgeId;
    const rows = useMemo(
        () => (payload && payload.badge === badgeId ? payload.rows : []),
        [payload, badgeId],
    );
    const entry = badgeId ? getHonor(badgeId) : undefined;

    const view = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return rows;
        return rows.filter((r) => r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q));
    }, [rows, query]);

    const stats = useMemo(() => {
        const people = new Set(rows.map((r) => r.userId)).size;
        const complete = rows.filter((r) => r.status === "complete").length;
        const proven = rows.reduce((sum, r) => sum + r.criteriaDone, 0);
        const criteria = rows.reduce((sum, r) => sum + r.criteriaTotal, 0);
        const saved = rows.reduce((sum, r) => sum + (r.savingsTotal || 0), 0);
        return {
            people,
            complete,
            inProgress: rows.filter((r) => r.status === "in_progress").length,
            pct: criteria ? Math.round((proven / criteria) * 100) : 0,
            saved,
        };
    }, [rows]);

    return (
        <div className="bg-white rounded-2xl shadow-xl p-5 md:p-7">
            <AdminHeader
                eyebrow="Sprout Club"
                title="Honors Progress"
                sub="Every participant's progress through the honors framework — criteria proven, requirements signed off and piggy-bank savings."
                actions={
                    <>
                        <label className="relative">
                            <span className="sr-only">Filter by honor</span>
                            <Select value={badgeId} onChange={(e) => setBadgeId(e.target.value)}>
                                <option value={ALL_HONORS}>All honors</option>
                                {HONOR_LEVELS.map((level) => (
                                    <optgroup key={level.id} label={level.name}>
                                        {level.badges.map((badge) => (
                                            <option key={badge.id} value={badge.id}>
                                                {badge.name}
                                            </option>
                                        ))}
                                    </optgroup>
                                ))}
                            </Select>
                        </label>
                        <label className="relative">
                            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search members…"
                                className="w-52 rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/20 transition"
                            />
                        </label>
                        <Link
                            href="/sprout/honors"
                            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-alice-blue transition"
                        >
                            <LuExternalLink className="text-sm" /> Public honors
                        </Link>
                    </>
                }
            />

            {error && <p className="mb-4 rounded-lg bg-red-50 text-red-600 text-sm px-4 py-2.5">{error}</p>}

            <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
                <Stat label="Participants" value={String(stats.people)} />
                <Stat label="Completed" value={String(stats.complete)} />
                <Stat label="In progress" value={String(stats.inProgress)} />
                <Stat label="Criteria proven" value={`${stats.pct}%`} />
                <Stat label="Banked" value={`R ${stats.saved}`} />
            </div>

            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-widest text-slate-gray">
                    {entry ? `${entry.level.name} · ${entry.badge.name}` : "All 13 honors"}
                    <span className="ml-2 normal-case tracking-normal text-gray-400">
                        {view.length} record{view.length === 1 ? "" : "s"}
                    </span>
                </p>
                {entry?.badge.piggyBank && (
                    <p className="text-xs text-gray-400">
                        Piggy-bank target: R {entry.badge.piggyBank.weekly} × {entry.badge.piggyBank.weeks} weeks ={" "}
                        <span className="font-semibold text-navy">
                            R {entry.badge.piggyBank.weekly * entry.badge.piggyBank.weeks}
                        </span>
                    </p>
                )}
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-100">
                <table className="w-full min-w-[820px] text-left text-sm">
                    <thead>
                        <tr className="border-b border-gray-100 bg-alice-blue/60 text-[11px] uppercase tracking-widest text-slate-gray">
                            <th className="px-4 py-3 font-semibold">Member</th>
                            {!badgeId && <th className="px-4 py-3 font-semibold">Honor</th>}
                            <th className="px-4 py-3 font-semibold">Criteria</th>
                            <th className="px-4 py-3 font-semibold">Requirements</th>
                            <th className="px-4 py-3 font-semibold">Status</th>
                            <th className="px-4 py-3 font-semibold">Saved</th>
                            <th className="px-4 py-3 text-right font-semibold">Updated</th>
                        </tr>
                    </thead>
                    <tbody>
                        {view.map((row) => {
                            const honor = getHonor(row.badgeId);
                            const pct = row.criteriaTotal ? Math.round((row.criteriaDone / row.criteriaTotal) * 100) : 0;
                            const target = honor?.badge.piggyBank
                                ? honor.badge.piggyBank.weekly * honor.badge.piggyBank.weeks
                                : null;
                            return (
                                <tr
                                    key={`${row.userId}-${row.badgeId}`}
                                    className="border-b border-gray-50 last:border-0 transition-colors hover:bg-alice-blue/40"
                                >
                                    <td className="px-4 py-3.5">
                                        <span className="font-semibold text-navy">{row.name}</span>
                                        <div className="text-xs text-gray-400">{row.email}</div>
                                    </td>
                                    {!badgeId && (
                                        <td className="px-4 py-3.5">
                                            <span className="flex items-center gap-2">
                                                <span
                                                    aria-hidden="true"
                                                    className="size-2.5 shrink-0 rounded-full"
                                                    style={{ backgroundColor: honor?.level.colorDark ?? "#cbd5e1" }}
                                                />
                                                <span className="text-gray-700">{honor?.badge.name ?? row.badgeId}</span>
                                            </span>
                                            <div className="text-xs text-gray-400">{honor?.level.name ?? "—"}</div>
                                        </td>
                                    )}
                                    <td className="px-4 py-3.5">
                                        <div className="flex items-center gap-2">
                                            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-100">
                                                <div
                                                    className={`h-full rounded-full ${pct === 100 ? "bg-emerald-500" : "bg-cyan"}`}
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-semibold text-navy">
                                                {row.criteriaDone}/{row.criteriaTotal} · {pct}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <span className="font-semibold text-navy">{row.requirementsDone}</span>
                                        <span className="text-gray-400"> of {row.requirementsTotal}</span>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <Badge tone={row.status === "complete" ? "gold" : row.status === "in_progress" ? "sky" : "slate"}>
                                            {row.status === "complete"
                                                ? "Complete"
                                                : row.status === "in_progress"
                                                  ? "In progress"
                                                  : "Not started"}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        {target ? (
                                            <>
                                                <span className="font-semibold text-navy">R {row.savingsTotal}</span>
                                                <span className="text-gray-400">
                                                    {" "}
                                                    of R {target} · {row.savingsCount} deposits
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-gray-300">—</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3.5 text-right text-xs text-gray-400">
                                        {row.updatedAt
                                            ? new Date(row.updatedAt).toLocaleDateString(undefined, {
                                                  month: "short",
                                                  day: "numeric",
                                              })
                                            : "—"}
                                    </td>
                                </tr>
                            );
                        })}
                        {loading && (
                            <tr>
                                <td colSpan={badgeId ? 7 : 8} className="px-4 py-10 text-center text-sm text-slate-gray">
                                    Loading honor progress…
                                </td>
                            </tr>
                        )}
                        {!loading && view.length === 0 && (
                            <tr>
                                <td colSpan={badgeId ? 7 : 8} className="px-4 py-10 text-center text-sm text-slate-gray">
                                    {query ? `No members match "${query}".` : "No one has started this honor yet."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-gray-400">
                    Read-only roll-up: 500 most recently updated records, newest first.
                </p>
                <div className="flex flex-wrap gap-1.5">
                    {HONOR_ENTRIES.map((e) => (
                        <button
                            key={e.badge.id}
                            type="button"
                            onClick={() => setBadgeId(e.badge.id)}
                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                                badgeId === e.badge.id
                                    ? "bg-navy text-white"
                                    : "bg-alice-blue text-slate-gray hover:bg-cyan/30"
                            }`}
                            title={`${e.level.name} · ${e.badge.name}`}
                        >
                            {e.badge.name.replace(" Badge", "")}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

function Stat({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl border border-gray-100 bg-alice-blue/40 px-4 py-3">
            <p className="text-[11px] uppercase tracking-widest text-slate-gray">{label}</p>
            <p className="mt-0.5 text-lg font-bold text-navy">{value}</p>
        </div>
    );
}
