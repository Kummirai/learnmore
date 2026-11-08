"use client";

import type { ReactNode } from "react";
import {
    LuChartLine,
    LuFileText,
    LuHeart,
    LuInfo,
    LuPrinter,
    LuSparkles,
    LuTrendingDown,
    LuTrendingUp,
} from "react-icons/lu";
import {
    foundersFundOf,
    reportTotals,
    type FinancialReport,
} from "@/lib/financials";

function money(n: number) {
    return `R ${(n || 0).toLocaleString("en-US")}`;
}

function fmtDate(value?: string) {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });
}

function Line({
    label,
    value,
    note,
    positive,
    isMoney = true,
}: {
    label: string;
    value: number;
    note?: string;
    positive?: boolean;
    isMoney?: boolean;
}) {
    return (
        <div className="flex items-center justify-between gap-3 py-2">
            <div className="min-w-0">
                <p className="text-[13px] text-gray-800">{label}</p>
                {note ? <p className="mt-0.5 text-[11px] text-slate-gray">{note}</p> : null}
            </div>
            <p
                className={`shrink-0 text-sm font-bold ${
                    positive === undefined
                        ? "text-navy"
                        : positive
                          ? "text-emerald-700"
                          : "text-rose-600"
                }`}
            >
                {isMoney ? money(value) : Math.round(value).toLocaleString("en-US")}
            </p>
        </div>
    );
}

function SectionCard({ icon: Icon, title, children }: { icon: typeof LuFileText; title: string; children: ReactNode }) {
    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
                <Icon className="size-4 text-gold-500" />
                <h2 className="text-sm font-bold text-navy">{title}</h2>
            </div>
            <div className="divide-y divide-gray-100">{children}</div>
        </div>
    );
}

export default function ReportView({ report }: { report: FinancialReport }) {
    const totals = reportTotals(report);
    const share = () => {
        if (typeof window !== "undefined") window.print();
    };

    return (
        <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy to-navy-soft p-6 text-white">
                <div className="absolute -right-10 -top-10 size-40 rounded-full bg-cyan/10" />
                <div className="absolute -bottom-16 right-10 size-40 rounded-full bg-gold-400/10" />
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-400">
                    Financial report
                </p>
                <h1 className="mt-2 font-display text-2xl font-black tracking-tight sm:text-3xl">
                    {report.period}
                </h1>
                <p className="mt-1 text-xs text-white/75">
                    Prepared by {report.preparedBy || "Relate Admin"}
                    {report.createdAt ? ` · Published ${fmtDate(report.createdAt)}` : ""}
                </p>
                <button
                    onClick={share}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/20 print:hidden"
                >
                    <LuPrinter className="size-3.5" /> Print / save PDF
                </button>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white px-5 py-2 shadow-sm">
                <Line label="Total income" value={totals.income} />
                <Line label="Total expenses" value={totals.expenses} />
                <Line label="Net funds" value={totals.net} positive={totals.net >= 0} />
            </div>

            <SectionCard icon={LuTrendingUp} title="Income">
                {report.income.balanceBroughtDown > 0 && (
                    <Line label="Balance brought down" value={report.income.balanceBroughtDown} />
                )}
                <Line label="Founders' Fund" value={foundersFundOf(report.income)} />
                <Line label="Event registrations and fees" value={report.income.events} />
                <Line label="Donations" value={report.income.donations} />
                <Line label="Book and resource sales" value={report.income.books} />
                {(report.income.other > 0 || report.income.otherDescription) && (
                    <Line
                        label="Other income"
                        value={report.income.other}
                        note={report.income.otherDescription || undefined}
                    />
                )}
            </SectionCard>

            <SectionCard icon={LuTrendingDown} title="Expenses">
                <Line label="Meals" value={report.expenses.meals} />
                <Line label="Groceries" value={report.expenses.groceries} />
                <Line label="Tuition support" value={report.expenses.tuition} />
                <Line label="Transport and travel" value={report.expenses.transport} />
                <Line label="Skills and employment" value={report.expenses.employment} />
                <Line label="Materials and printing" value={report.expenses.materials} />
                {report.expenses.amountsFromRecords > 0 && (
                    <Line label="Amounts used from records" value={report.expenses.amountsFromRecords} />
                )}
                {(report.expenses.other > 0 || report.expenses.otherDescription) && (
                    <Line
                        label="Other expenses"
                        value={report.expenses.other}
                        note={report.expenses.otherDescription || undefined}
                    />
                )}
            </SectionCard>

            <SectionCard icon={LuHeart} title="Impact">
                <Line label="Families supported" value={report.impact.families} isMoney={false} />
                <Line label="Meals served" value={report.impact.mealsServed} isMoney={false} />
                <Line label="Children supported" value={report.impact.children} isMoney={false} />
                <Line
                    label="Skills and employment placements"
                    value={report.impact.placements}
                    isMoney={false}
                />
                <Line label="Events hosted" value={report.impact.events} isMoney={false} />
            </SectionCard>

            {report.otherActivities && (
                <SectionCard icon={LuSparkles} title="Other activities">
                    <p className="py-2 text-[13px] leading-6 text-gray-800">{report.otherActivities}</p>
                </SectionCard>
            )}

            {report.customFields?.length > 0 && (
                <SectionCard icon={LuFileText} title="Additional items">
                    {report.customFields.map((field, index) => (
                        <div key={`${field.title}-${index}`} className="py-2">
                            <p className="text-sm font-bold text-navy">{field.title}</p>
                            <p className="mt-0.5 text-[13px] leading-6 text-gray-800">{field.content}</p>
                        </div>
                    ))}
                </SectionCard>
            )}

            {report.notes && (
                <SectionCard icon={LuInfo} title="Notes">
                    <p className="py-2 text-[13px] leading-6 text-gray-800">{report.notes}</p>
                </SectionCard>
            )}

            <p className="flex items-center justify-center gap-2 py-2 text-[11px] text-gray-400">
                <LuChartLine className="size-3.5" /> Filed with Relate · amounts in South African Rand
            </p>
        </div>
    );
}
