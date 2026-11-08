"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
    LuChevronRight,
    LuCircleAlert,
    LuFileText,
    LuLoaderCircle,
    LuWallet,
} from "react-icons/lu";
import RequireAuth from "@/components/RequireAuth";
import MemberPage from "@/components/member/MemberPage";
import {
    financialApi,
    formatCompact,
    formatMoney,
    type FinancialReportSummary,
} from "@/lib/financials";

export default function FinancialsPage() {
    const [reports, setReports] = useState<FinancialReportSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const load = useCallback(async () => {
        setError("");
        try {
            const res = await financialApi.list();
            setReports(
                [...res.data].sort(
                    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
                ),
            );
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to load financial reports.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void Promise.resolve().then(() => load());
    }, [load]);

    const totals = reports.reduce(
        (acc, r) => ({
            income: acc.income + r.income,
            expenses: acc.expenses + r.expenses,
            net: acc.net + r.net,
        }),
        { income: 0, expenses: 0, net: 0 },
    );

    return (
        <RequireAuth
            title="Financial reports"
            next="/financials"
            blurb="Sign in to read Relate's published financial reports."
        >
            <MemberPage
                eyebrow="Financials"
                title="Financial reports"
                sub="Every published statement — income, spending and the impact it funded."
            >
                {loading ? (
                    <div className="flex items-center justify-center gap-3 py-20 text-slate-gray">
                        <LuLoaderCircle className="animate-spin text-2xl" />
                        <span className="text-sm">Loading reports…</span>
                    </div>
                ) : error ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
                        <LuCircleAlert className="mx-auto mb-2 text-2xl text-red-500" />
                        <p className="font-bold text-navy">Couldn&apos;t load reports</p>
                        <p className="mt-1 text-sm text-slate-gray">{error}</p>
                        <button
                            onClick={() => {
                                setLoading(true);
                                void load();
                            }}
                            className="mt-4 rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-soft"
                        >
                            Retry
                        </button>
                    </div>
                ) : reports.length === 0 ? (
                    <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">
                        <LuFileText className="mx-auto mb-3 text-3xl text-slate-300" />
                        <p className="font-bold text-navy">No reports published yet</p>
                        <p className="mt-1 text-sm text-slate-gray">
                            Monthly statements appear here once an admin files them.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="mb-4 grid grid-cols-3 divide-x divide-gray-100 rounded-2xl border border-gray-100 bg-white py-4 text-center shadow-sm">
                            {[
                                ["Income", totals.income],
                                ["Spend", totals.expenses],
                                ["Net", totals.net],
                            ].map(([label, value]) => (
                                <div key={label as string} className="px-2">
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-gray">
                                        {label as string}
                                    </p>
                                    <p
                                        className={`mt-0.5 truncate text-sm font-bold ${
                                            label === "Net"
                                                ? (value as number) < 0
                                                    ? "text-rose-600"
                                                    : "text-emerald-700"
                                                : "text-navy"
                                        }`}
                                    >
                                        {formatMoney(value as number)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <ul className="space-y-2.5">
                            {reports.map((report) => (
                                <li key={report._id}>
                                    <Link
                                        href={`/financials/${report._id}`}
                                        className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:border-cyan/40 hover:shadow-md"
                                    >
                                        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-ice-blue">
                                            <LuWallet className="size-5 text-cyan-ink" />
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="block truncate text-sm font-semibold text-navy">
                                                {report.period}
                                            </span>
                                            <span className="block truncate text-[11px] text-slate-gray">
                                                {report.preparedBy || "Relate Admin"}
                                            </span>
                                        </span>
                                        <span className="hidden shrink-0 text-right sm:block">
                                            <span className="block text-xs font-semibold text-emerald-700">
                                                {formatCompact(report.income)} in
                                            </span>
                                            <span
                                                className={`block text-[11px] ${
                                                    report.net < 0 ? "text-rose-600" : "text-slate-gray"
                                                }`}
                                            >
                                                {formatCompact(report.net)} net
                                            </span>
                                        </span>
                                        <LuChevronRight className="size-4 shrink-0 text-slate-gray" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </MemberPage>
        </RequireAuth>
    );
}
