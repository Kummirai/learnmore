"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    LuArrowUpRight,
    LuChartLine,
    LuCircleAlert,
    LuLoaderCircle,
    LuRefreshCw,
    LuWallet,
} from "react-icons/lu";
import {
    fetchPerformance,
    type PerformanceSummary,
} from "@/lib/performance";
import { formatMoney } from "@/lib/financials";

const CHART_INCOME = "#13c5dd";
const CHART_EXPENSE = "#f0b429";
const MIX_COLORS = ["#13c5dd", "#0fa3c4", "#f0b429", "#0b192c", "#0f766e", "#7c3aed", "#e11d48"];

function SectionHead({ icon: Icon, title }: { icon: typeof LuChartLine; title: string }) {
    return (
        <div className="flex items-center gap-2">
            <Icon className="size-4 text-cyan" />
            <h2 className="text-sm font-bold text-navy">{title}</h2>
        </div>
    );
}

function Stat({
    label,
    value,
    tone,
}: {
    label: string;
    value: string;
    tone?: "positive" | "negative";
}) {
    return (
        <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-gray">
                {label}
            </p>
            <p
                className={`mt-1 truncate text-sm font-bold ${
                    tone === "positive" ? "text-emerald-700" : tone === "negative" ? "text-rose-600" : "text-navy"
                }`}
            >
                {value}
            </p>
        </div>
    );
}

export default function PerformanceView({
    basePath = "",
    admin = false,
}: {
    /** Prefix for appraisal detail links, e.g. "/admin". */
    basePath?: string;
    /** Admins can open every appraisal; members only their own. */
    admin?: boolean;
}) {
    const [data, setData] = useState<PerformanceSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

    const load = useCallback(async () => {
        setError("");
        try {
            setData(await fetchPerformance());
        } catch (e) {
            setError(e instanceof Error ? e.message : "Couldn't load organisation performance.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        void Promise.resolve().then(() => load());
    }, [load]);

    const refresh = () => {
        setRefreshing(true);
        void load();
    };

    const mixTotal = useMemo(
        () => data?.incomeMix.reduce((sum, row) => sum + row.value, 0) ?? 0,
        [data],
    );
    const maxBar = useMemo(
        () => Math.max(1, ...(data?.months ?? []).flatMap((m) => [m.income, m.expenses])),
        [data],
    );
    const selected = data?.months.find((m) => m.month === selectedMonth) ?? null;
    const impact = data?.latestImpact;
    const hasImpact =
        !!impact &&
        (impact.families > 0 ||
            impact.mealsServed > 0 ||
            impact.children > 0 ||
            impact.placements > 0 ||
            impact.events > 0);

    if (loading) {
        return (
            <div className="flex items-center justify-center gap-3 py-20 text-slate-gray">
                <LuLoaderCircle className="animate-spin text-2xl" />
                <span className="text-sm">Loading performance…</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
                <LuCircleAlert className="mx-auto mb-2 text-2xl text-red-500" />
                <p className="font-bold text-navy">Couldn&apos;t load performance</p>
                <p className="mt-1 text-sm text-slate-gray">{error}</p>
                <button
                    onClick={refresh}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl btn-signin px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-95"
                >
                    <LuRefreshCw className={refreshing ? "animate-spin" : ""} /> Retry
                </button>
            </div>
        );
    }

    if (!data || (data.reportCount === 0 && !data.appraisals)) {
        return (
            <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">
                <LuChartLine className="mx-auto mb-3 text-3xl text-slate-300" />
                <p className="font-bold text-navy">Nothing published yet</p>
                <p className="mx-auto mt-1 max-w-md text-sm text-slate-gray">
                    Once a monthly financial report is published, the organisation&apos;s income,
                    spending and coffer progress appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-end">
                <button
                    onClick={refresh}
                    disabled={refreshing}
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-alice-blue disabled:opacity-60"
                >
                    <LuRefreshCw className={`size-3.5 ${refreshing ? "animate-spin" : ""}`} />
                    Refresh
                </button>
            </div>

            {data.reportCount > 0 && (
                <>
                    {/* Hero */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-gray">
                                Organisation health · {data.year}
                            </p>
                            <span className="rounded-full bg-gold-50 px-3 py-1 text-[11px] font-semibold text-gold-800">
                                {data.season.name}
                            </span>
                        </div>

                        <p className="mt-3 font-display text-4xl font-black leading-none tracking-tight text-navy sm:text-5xl">
                            {data.coffer.progressPct}%
                        </p>
                        <p className="mt-1 text-xs text-slate-gray">
                            of the {formatMoney(data.coffer.target)} annual coffer target
                        </p>

                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">
                            <div
                                className="h-full rounded-full bg-gold-400"
                                style={{ width: `${Math.min(100, data.coffer.progressPct)}%` }}
                            />
                        </div>
                        <div className="mt-2 flex justify-between text-[11px] text-slate-gray">
                            <span>{formatMoney(data.coffer.raised)} raised</span>
                            <span>{formatMoney(data.coffer.remaining)} to go</span>
                        </div>

                        <div className="mt-5 grid grid-cols-3 gap-3 border-t border-gray-100 pt-4">
                            <Stat label="Income" value={formatMoney(data.totals.income)} />
                            <Stat label="Spend" value={formatMoney(data.totals.expenses)} />
                            <Stat
                                label="Balance"
                                value={formatMoney(data.balance)}
                                tone={data.balance >= 0 ? "positive" : "negative"}
                            />
                        </div>
                    </div>

                    {/* Income vs expenditure */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                        <SectionHead icon={LuChartLine} title="Income vs expenditure" />
                        <p className="mt-1 text-xs text-slate-gray">
                            {data.months.length} reported month{data.months.length === 1 ? "" : "s"} in {data.year}
                        </p>
                        <div className="mt-3 flex gap-4 text-[11px] text-slate-gray">
                            <span className="inline-flex items-center gap-1.5">
                                <span className="size-2 rounded-full" style={{ background: CHART_INCOME }} />
                                Income
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <span className="size-2 rounded-full" style={{ background: CHART_EXPENSE }} />
                                Expenditure
                            </span>
                        </div>

                        <div className="mt-4 flex h-40 items-end gap-3 overflow-x-auto pb-1">
                            {data.months.map((m) => {
                                const active = selectedMonth === m.month;
                                return (
                                    <button
                                        key={m.month}
                                        onClick={() => setSelectedMonth((prev) => (prev === m.month ? null : m.month))}
                                        className={`group flex min-w-10 flex-1 flex-col items-center gap-1 rounded-lg px-1 pb-1 pt-2 transition ${
                                            active ? "bg-alice-blue" : "hover:bg-alice-blue/60"
                                        }`}
                                        aria-label={`${m.period}: income ${formatMoney(m.income)}, spend ${formatMoney(m.expenses)}`}
                                    >
                                        <div className="flex h-28 w-full items-end justify-center gap-1">
                                            <span
                                                className="w-1/3 rounded-t"
                                                style={{
                                                    height: `${Math.max(3, (m.income / maxBar) * 100)}%`,
                                                    background: CHART_INCOME,
                                                }}
                                            />
                                            <span
                                                className="w-1/3 rounded-t"
                                                style={{
                                                    height: `${Math.max(3, (m.expenses / maxBar) * 100)}%`,
                                                    background: CHART_EXPENSE,
                                                }}
                                            />
                                        </div>
                                        <span className={`text-[10px] ${active ? "font-bold text-navy" : "text-slate-gray"}`}>
                                            {m.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {selected ? (
                            <div className="mt-3 rounded-xl bg-alice-blue/70 p-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-semibold text-navy">{selected.period} · as filed</p>
                                    <button
                                        onClick={() => setSelectedMonth(null)}
                                        className="text-xs text-slate-gray hover:text-navy"
                                        aria-label="Clear selected month"
                                    >
                                        Clear
                                    </button>
                                </div>
                                <div className="mt-2 grid grid-cols-3 gap-3">
                                    <Stat label="Income" value={formatMoney(selected.income)} />
                                    <Stat label="Spend" value={formatMoney(selected.expenses)} />
                                    <Stat
                                        label="Net"
                                        value={formatMoney(selected.net)}
                                        tone={selected.net >= 0 ? "positive" : "negative"}
                                    />
                                </div>
                            </div>
                        ) : (
                            <p className="mt-2 text-center text-[11px] text-gray-400">
                                Select a month for its exact figures.
                            </p>
                        )}
                    </div>

                    {/* Income mix */}
                    {data.incomeMix.length > 0 && (
                        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                            <SectionHead icon={LuWallet} title="Income mix" />
                            <p className="mt-1 text-xs text-slate-gray">
                                Every income line as filed in the reports
                            </p>
                            <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-gray-100">
                                {data.incomeMix.map((row, index) => (
                                    <span
                                        key={row.key}
                                        title={`${row.label}: ${formatMoney(row.value)}`}
                                        style={{
                                            width: `${mixTotal > 0 ? (row.value / mixTotal) * 100 : 0}%`,
                                            background: MIX_COLORS[index % MIX_COLORS.length],
                                        }}
                                    />
                                ))}
                            </div>
                            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                                {data.incomeMix.map((row, index) => (
                                    <li key={row.key} className="flex items-start gap-2.5">
                                        <span
                                            className="mt-1 size-2.5 shrink-0 rounded-full"
                                            style={{ background: MIX_COLORS[index % MIX_COLORS.length] }}
                                        />
                                        <div className="min-w-0">
                                            <p className="truncate text-xs font-semibold text-navy">{row.label}</p>
                                            <p className="text-[11px] text-slate-gray">
                                                {formatMoney(row.value)} ·{" "}
                                                {mixTotal > 0 ? Math.round((row.value / mixTotal) * 100) : 0}%
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Impact */}
                    {hasImpact && impact && (
                        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                            <SectionHead icon={LuChartLine} title="Latest report impact" />
                            <div className="mt-4 grid grid-cols-3 gap-4 text-center sm:grid-cols-5">
                                {[
                                    ["Families", impact.families],
                                    ["Meals", impact.mealsServed],
                                    ["Children", impact.children],
                                    ["Placements", impact.placements],
                                    ["Events", impact.events],
                                ].map(([label, value]) => (
                                    <div key={label}>
                                        <p className="text-lg font-bold text-navy">
                                            {Math.round(value as number).toLocaleString("en-US")}
                                        </p>
                                        <p className="text-[10px] text-slate-gray">{label}</p>
                                    </div>
                                ))}
                            </div>
                            {data.latestReport && (
                                <p className="mt-3 text-[11px] text-gray-400">
                                    Latest report: {data.latestReport.period}
                                </p>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* Department performance */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <SectionHead icon={LuChartLine} title="Department performance" />
                {data.appraisals && data.appraisals.departments.length > 0 ? (
                    <>
                        <p className="mt-1 text-xs text-slate-gray">
                            Approved for {data.appraisals.season.name} {data.appraisals.season.year}
                        </p>
                        <ul className="mt-3 divide-y divide-gray-100">
                            {data.appraisals.departments.map((row) => {
                                const inner = (
                                    <>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold text-navy">{row.department}</p>
                                            <p className="truncate text-[11px] text-slate-gray">
                                                {row.lead ? `${row.lead} · ` : ""}
                                                {row.revenueTarget > 0
                                                    ? `${formatMoney(row.collected)} of ${formatMoney(row.revenueTarget)} coffer`
                                                    : "Season score"}
                                            </p>
                                        </div>
                                        <div className="shrink-0 text-right">
                                            <p className="text-sm font-bold text-navy">{Math.round(row.score)}%</p>
                                            {row.band ? <p className="text-[10px] text-slate-gray">{row.band}</p> : null}
                                        </div>
                                        {admin && <LuArrowUpRight className="size-4 shrink-0 text-slate-gray" />}
                                    </>
                                );
                                return (
                                    <li key={row.id}>
                                        {admin ? (
                                            <Link
                                                href={`${basePath}/appraisals/${row.id}`}
                                                className="flex items-center gap-3 py-2.5 transition hover:bg-alice-blue/50"
                                            >
                                                {inner}
                                            </Link>
                                        ) : (
                                            <div className="flex items-center gap-3 py-2.5">{inner}</div>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </>
                ) : (
                    <p className="mt-4 rounded-xl bg-alice-blue/60 p-4 text-center text-xs text-slate-gray">
                        Department scores arrive after the {data.season.name} appraisal at the end of {data.season.ends}.
                    </p>
                )}
            </div>

            {/* Individual performance */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <SectionHead icon={LuChartLine} title="Individual performance" />
                {data.appraisals && data.appraisals.individuals.length > 0 ? (
                    <>
                        <p className="mt-1 text-xs text-slate-gray">
                            Approved for {data.appraisals.season.name} {data.appraisals.season.year}
                        </p>
                        <ul className="mt-3 divide-y divide-gray-100">
                            {data.appraisals.individuals.map((row) => {
                                const inner = (
                                    <>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold text-navy">{row.name}</p>
                                            <p className="truncate text-[11px] text-slate-gray">
                                                {row.department || "Individual appraisal"}
                                            </p>
                                        </div>
                                        <div className="shrink-0 text-right">
                                            <p className="text-sm font-bold text-navy">{Math.round(row.score)}%</p>
                                            {row.band ? <p className="text-[10px] text-slate-gray">{row.band}</p> : null}
                                        </div>
                                        {admin && <LuArrowUpRight className="size-4 shrink-0 text-slate-gray" />}
                                    </>
                                );
                                return (
                                    <li key={row.id}>
                                        {admin ? (
                                            <Link
                                                href={`${basePath}/appraisals/${row.id}`}
                                                className="flex items-center gap-3 py-2.5 transition hover:bg-alice-blue/50"
                                            >
                                                {inner}
                                            </Link>
                                        ) : (
                                            <div className="flex items-center gap-3 py-2.5">{inner}</div>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </>
                ) : (
                    <p className="mt-4 rounded-xl bg-alice-blue/60 p-4 text-center text-xs text-slate-gray">
                        Members&apos; seasonal percentages appear here once the {data.season.name} {data.season.year}{" "}
                        appraisal forms are submitted and approved.
                    </p>
                )}
            </div>

            <p className="pt-1 text-center text-[11px] leading-5 text-gray-400">
                {data.reportCount > 0
                    ? `Built from ${data.reportCount} published financial report${data.reportCount === 1 ? "" : "s"}${
                          data.latestReport ? ` · latest: ${data.latestReport.period}` : ""
                      }`
                    : `Built from approved ${data.appraisals?.season.name ?? ""} appraisals`}
            </p>
        </div>
    );
}
