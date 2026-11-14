"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { LuCircleAlert, LuLoaderCircle } from "react-icons/lu";
import RequireAuth from "@/components/RequireAuth";
import MemberPage from "@/components/member/MemberPage";
import ReportView from "@/components/financials/ReportView";
import { financialApi, type FinancialReport } from "@/lib/financials";

export default function FinancialReportPage() {
    const params = useParams<{ id: string }>();
    const id = typeof params.id === "string" ? params.id : params.id?.[0] ?? "";
    const [report, setReport] = useState<FinancialReport | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const load = useCallback(async () => {
        if (!id) {
            setError("No report selected.");
            setLoading(false);
            return;
        }
        setError("");
        try {
            const res = await financialApi.get(id);
            setReport(res.data);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to load the financial report.");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        void Promise.resolve().then(() => load());
    }, [load]);

    return (
        <RequireAuth
            title="Financial report"
            next={`/financials/${id}`}
            blurb="Sign in to read this financial report."
        >
            <MemberPage
                eyebrow="Financials"
                title="Financial report"
                backHref="/financials"
                backLabel="Back to financials"
                wide
            >
                {loading ? (
                    <div className="flex items-center justify-center gap-3 py-20 text-slate-gray">
                        <LuLoaderCircle className="animate-spin text-2xl" />
                        <span className="text-sm">Loading report…</span>
                    </div>
                ) : error ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
                        <LuCircleAlert className="mx-auto mb-2 text-2xl text-red-500" />
                        <p className="font-bold text-navy">Couldn&apos;t load this report</p>
                        <p className="mt-1 text-sm text-slate-gray">{error}</p>
                        <button
                            onClick={() => {
                                setLoading(true);
                                void load();
                            }}
                            className="mt-4 rounded-xl btn-signin px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-95"
                        >
                            Retry
                        </button>
                    </div>
                ) : report ? (
                    <ReportView report={report} />
                ) : null}
            </MemberPage>
        </RequireAuth>
    );
}
