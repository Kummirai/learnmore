"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
    LuCircleAlert,
    LuEye,
    LuFileText,
    LuLoaderCircle,
    LuPencil,
    LuPlus,
    LuTrash2,
} from "react-icons/lu";
import { AdminHeader, Button } from "@/components/admin/ui";
import ReportEditor from "@/components/financials/ReportEditor";
import {
    financialApi,
    formatCompact,
    type FinancialReport,
    type FinancialReportSummary,
} from "@/lib/financials";

export default function AdminFinancialsPage() {
    const [reports, setReports] = useState<FinancialReportSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [mode, setMode] = useState<"list" | "editor">("list");
    const [editing, setEditing] = useState<FinancialReport | null>(null);
    const [openingId, setOpeningId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [notice, setNotice] = useState("");

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

    const startCreate = () => {
        setEditing(null);
        setNotice("");
        setMode("editor");
    };

    const startEdit = async (id: string) => {
        setOpeningId(id);
        setError("");
        try {
            const res = await financialApi.get(id);
            setEditing(res.data);
            setNotice("");
            setMode("editor");
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to load that report.");
        } finally {
            setOpeningId(null);
        }
    };

    const remove = async (report: FinancialReportSummary) => {
        if (!window.confirm(`${report.period} will be permanently removed. Continue?`)) return;
        setDeletingId(report._id);
        setError("");
        try {
            await financialApi.remove(report._id);
            setNotice(`${report.period} was deleted.`);
            await load();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to delete that report.");
        } finally {
            setDeletingId(null);
        }
    };

    const totals = reports.reduce(
        (acc, r) => ({
            income: acc.income + r.income,
            expenses: acc.expenses + r.expenses,
            net: acc.net + r.net,
        }),
        { income: 0, expenses: 0, net: 0 },
    );

    if (mode === "editor") {
        return (
            <div>
                <AdminHeader
                    eyebrow="Performance"
                    title={editing ? `Edit ${editing.period}` : "New financial report"}
                    sub="Compile the organisation's monthly income, spending and impact."
                />
                <ReportEditor
                    key={editing?._id ?? "new"}
                    initial={editing}
                    onCancel={() => {
                        setEditing(null);
                        setMode("list");
                    }}
                    onSaved={async () => {
                        setNotice(editing ? "Report updated." : "Report saved and published.");
                        setEditing(null);
                        setMode("list");
                        await load();
                    }}
                />
            </div>
        );
    }

    return (
        <div>
            <AdminHeader
                eyebrow="Performance"
                title="Financials"
                sub="Publish monthly statements that feed organisation performance."
                actions={
                    <Button onClick={startCreate}>
                        <LuPlus className="size-4" /> Create report
                    </Button>
                }
            />

            {notice && (
                <p className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-700">
                    {notice}
                </p>
            )}
            {error && (
                <p className="mb-4 flex items-start gap-2 rounded-xl bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700">
                    <LuCircleAlert className="mt-0.5 size-3.5 shrink-0" /> {error}
                </p>
            )}

            {loading ? (
                <div className="flex items-center justify-center gap-3 py-20 text-slate-gray">
                    <LuLoaderCircle className="animate-spin text-2xl" />
                    <span className="text-sm">Loading reports…</span>
                </div>
            ) : reports.length === 0 ? (
                <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">
                    <LuFileText className="mx-auto mb-2 text-2xl text-slate-300" />
                    <p className="text-sm font-bold text-navy">No reports yet</p>
                    <p className="mt-1 text-xs text-slate-gray">Create the first one to get started.</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px] text-left">
                            <thead>
                                <tr className="border-b border-gray-100 bg-alice-blue/50">
                                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-gray">
                                        Period
                                    </th>
                                    <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-gray">
                                        Income
                                    </th>
                                    <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-gray">
                                        Spend
                                    </th>
                                    <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-gray">
                                        Net
                                    </th>
                                    <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-gray">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {reports.map((report) => (
                                    <tr key={report._id} className="transition hover:bg-alice-blue/40">
                                        <td className="px-4 py-3">
                                            <Link
                                                href={`/financials/${report._id}`}
                                                className="block text-sm font-semibold text-navy hover:text-cyan-ink"
                                            >
                                                {report.period}
                                            </Link>
                                            <p className="text-[11px] text-slate-gray">
                                                {report.preparedBy || "Relate Admin"}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3 text-right text-sm font-medium text-gray-800">
                                            {formatCompact(report.income)}
                                        </td>
                                        <td className="px-4 py-3 text-right text-sm font-medium text-gray-800">
                                            {formatCompact(report.expenses)}
                                        </td>
                                        <td
                                            className={`px-4 py-3 text-right text-sm font-semibold ${
                                                report.net < 0 ? "text-rose-600" : "text-emerald-700"
                                            }`}
                                        >
                                            {formatCompact(report.net)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    href={`/financials/${report._id}`}
                                                    className="rounded-lg p-2 text-slate-gray transition hover:bg-alice-blue hover:text-navy"
                                                    aria-label={`View ${report.period} report`}
                                                >
                                                    <LuEye className="size-4" />
                                                </Link>
                                                <button
                                                    onClick={() => startEdit(report._id)}
                                                    disabled={openingId === report._id}
                                                    className="rounded-lg p-2 text-slate-gray transition hover:bg-alice-blue hover:text-navy disabled:opacity-50"
                                                    aria-label={`Edit ${report.period} report`}
                                                >
                                                    {openingId === report._id ? (
                                                        <LuLoaderCircle className="size-4 animate-spin" />
                                                    ) : (
                                                        <LuPencil className="size-4" />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => remove(report)}
                                                    disabled={deletingId === report._id}
                                                    className="rounded-lg p-2 text-rose-500 transition hover:bg-rose-50 hover:text-rose-700 disabled:opacity-50"
                                                    aria-label={`Delete ${report.period} report`}
                                                >
                                                    {deletingId === report._id ? (
                                                        <LuLoaderCircle className="size-4 animate-spin" />
                                                    ) : (
                                                        <LuTrash2 className="size-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="border-t border-gray-200 bg-alice-blue/40">
                                    <td className="px-4 py-3 text-xs font-semibold text-navy">
                                        {reports.length} report{reports.length === 1 ? "" : "s"}
                                    </td>
                                    <td className="px-4 py-3 text-right text-sm font-bold text-navy">
                                        {formatCompact(totals.income)}
                                    </td>
                                    <td className="px-4 py-3 text-right text-sm font-bold text-navy">
                                        {formatCompact(totals.expenses)}
                                    </td>
                                    <td
                                        className={`px-4 py-3 text-right text-sm font-bold ${
                                            totals.net < 0 ? "text-rose-600" : "text-emerald-700"
                                        }`}
                                    >
                                        {formatCompact(totals.net)}
                                    </td>
                                    <td />
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
