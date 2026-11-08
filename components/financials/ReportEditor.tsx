"use client";

import { useCallback, useMemo, useState } from "react";
import {
    LuArrowLeft,
    LuCalendarDays,
    LuCheck,
    LuCircleAlert,
    LuDownload,
    LuFileText,
    LuHeart,
    LuLoaderCircle,
    LuPlus,
    LuRefreshCw,
    LuSave,
    LuSparkles,
    LuTrendingDown,
    LuTrendingUp,
    LuX,
} from "react-icons/lu";
import { inputCls } from "@/components/admin/ui";
import {
    financialAdminApi,
    financialApi,
    foundersFundOf,
    type FinancialReport,
    type FinancialReportInput,
} from "@/lib/financials";

type Draft = Record<string, string>;

const EMPTY: Draft = {
    period: "",
    preparedBy: "",
    notes: "",
    otherActivities: "",
    incBalanceBD: "",
    incFoundersFund: "",
    incEvents: "",
    incDonations: "",
    incBooks: "",
    incOther: "",
    incOtherDesc: "",
    expMeals: "",
    expGroceries: "",
    expTuition: "",
    expTransport: "",
    expEmployment: "",
    expMaterials: "",
    expOther: "",
    expOtherDesc: "",
    expAmountsFromRecords: "",
    impFamilies: "",
    impMeals: "",
    impChildren: "",
    impPlacements: "",
    impEvents: "",
};

function toNum(value: string): number {
    const n = Number(value.replace(/[^\d.-]/g, ""));
    return Number.isFinite(n) ? Math.round(n * 100) / 100 : 0;
}

function draftFromReport(r: FinancialReport): Draft {
    return {
        period: r.period,
        preparedBy: r.preparedBy || "",
        notes: r.notes || "",
        otherActivities: r.otherActivities || "",
        incBalanceBD: String(r.income.balanceBroughtDown ?? 0),
        incFoundersFund: String(foundersFundOf(r.income)),
        incEvents: String(r.income.events ?? 0),
        incDonations: String(r.income.donations ?? 0),
        incBooks: String(r.income.books ?? 0),
        incOther: String(r.income.other ?? 0),
        incOtherDesc: r.income.otherDescription || "",
        expMeals: String(r.expenses.meals ?? 0),
        expGroceries: String(r.expenses.groceries ?? 0),
        expTuition: String(r.expenses.tuition ?? 0),
        expTransport: String(r.expenses.transport ?? 0),
        expEmployment: String(r.expenses.employment ?? 0),
        expMaterials: String(r.expenses.materials ?? 0),
        expOther: String(r.expenses.other ?? 0),
        expOtherDesc: r.expenses.otherDescription || "",
        expAmountsFromRecords: String(r.expenses.amountsFromRecords ?? 0),
        impFamilies: String(r.impact.families ?? 0),
        impMeals: String(r.impact.mealsServed ?? 0),
        impChildren: String(r.impact.children ?? 0),
        impPlacements: String(r.impact.placements ?? 0),
        impEvents: String(r.impact.events ?? 0),
    };
}

const INCOME_FIELDS: { key: string; label: string; descKey?: string; descPlaceholder?: string }[] = [
    { key: "incBalanceBD", label: "Balance brought down" },
    { key: "incFoundersFund", label: "Founders' Fund" },
    { key: "incEvents", label: "Event registrations and fees" },
    { key: "incDonations", label: "Donations" },
    { key: "incBooks", label: "Book and resource sales" },
    { key: "incOther", label: "Other income", descKey: "incOtherDesc", descPlaceholder: "Describe this income" },
];

const EXPENSE_FIELDS: { key: string; label: string; descKey?: string; descPlaceholder?: string }[] = [
    { key: "expAmountsFromRecords", label: "Amounts used from records" },
    { key: "expMeals", label: "Meals" },
    { key: "expGroceries", label: "Groceries" },
    { key: "expTuition", label: "Tuition support" },
    { key: "expTransport", label: "Transport and travel" },
    { key: "expEmployment", label: "Skills and employment" },
    { key: "expMaterials", label: "Materials and printing" },
    { key: "expOther", label: "Other expenses", descKey: "expOtherDesc", descPlaceholder: "Describe these expenses" },
];

const IMPACT_FIELDS = [
    { key: "impFamilies", label: "Families supported" },
    { key: "impMeals", label: "Meals served" },
    { key: "impChildren", label: "Children supported" },
    { key: "impPlacements", label: "Skills and employment placements" },
    { key: "impEvents", label: "Events hosted" },
];

function NumField({
    label,
    value,
    onChange,
    onBlur,
    placeholder = "0.00",
    hint,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
    placeholder?: string;
    hint?: string;
}) {
    return (
        <label className="block">
            <span className="mb-1 block text-xs font-semibold text-gray-700">{label}</span>
            <input
                className={inputCls}
                inputMode="decimal"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
            />
            {hint ? <span className="mt-1 block text-[11px] text-gray-400">{hint}</span> : null}
        </label>
    );
}

function Section({
    icon: Icon,
    title,
    children,
}: {
    icon: typeof LuFileText;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
                <Icon className="size-4 text-gold-500" />
                <h2 className="text-sm font-bold text-navy">{title}</h2>
            </div>
            {children}
        </div>
    );
}

export default function ReportEditor({
    initial,
    onSaved,
    onCancel,
}: {
    initial: FinancialReport | null;
    onSaved: () => void;
    onCancel: () => void;
}) {
    const [draft, setDraft] = useState<Draft>(() => (initial ? draftFromReport(initial) : { ...EMPTY }));
    const [customFields, setCustomFields] = useState<{ title: string; content: string }[]>(
        initial?.customFields ?? [],
    );
    const [prefill, setPrefill] = useState<{
        foundersFund: number;
        amountsUsed: number;
        balanceBroughtDown: number;
    } | null>(null);
    const [fetching, setFetching] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const set = (key: string, value: string) => setDraft((prev) => ({ ...prev, [key]: value }));

    const totals = useMemo(() => {
        const income =
            toNum(draft.incBalanceBD) +
            toNum(draft.incFoundersFund) +
            toNum(draft.incEvents) +
            toNum(draft.incDonations) +
            toNum(draft.incBooks) +
            toNum(draft.incOther);
        const expenses =
            toNum(draft.expAmountsFromRecords) +
            toNum(draft.expMeals) +
            toNum(draft.expGroceries) +
            toNum(draft.expTuition) +
            toNum(draft.expTransport) +
            toNum(draft.expEmployment) +
            toNum(draft.expMaterials) +
            toNum(draft.expOther);
        return { income, expenses, net: income - expenses };
    }, [draft]);

    const fetchPrefill = useCallback(async (period: string) => {
        const trimmed = period.trim();
        if (!trimmed) return;
        setFetching(true);
        try {
            const res = await financialAdminApi.prefill(trimmed);
            setPrefill(res.data);
        } catch {
            setPrefill(null);
        } finally {
            setFetching(false);
        }
    }, []);

    const buildInput = (): FinancialReportInput => ({
        period: draft.period.trim(),
        preparedBy: draft.preparedBy.trim(),
        income: {
            balanceBroughtDown: toNum(draft.incBalanceBD),
            foundersFund: toNum(draft.incFoundersFund),
            events: toNum(draft.incEvents),
            donations: toNum(draft.incDonations),
            books: toNum(draft.incBooks),
            other: toNum(draft.incOther),
            otherDescription: draft.incOtherDesc.trim(),
        },
        expenses: {
            meals: toNum(draft.expMeals),
            groceries: toNum(draft.expGroceries),
            tuition: toNum(draft.expTuition),
            transport: toNum(draft.expTransport),
            employment: toNum(draft.expEmployment),
            materials: toNum(draft.expMaterials),
            other: toNum(draft.expOther),
            otherDescription: draft.expOtherDesc.trim(),
            amountsFromRecords: toNum(draft.expAmountsFromRecords),
        },
        impact: {
            families: toNum(draft.impFamilies),
            mealsServed: toNum(draft.impMeals),
            children: toNum(draft.impChildren),
            placements: toNum(draft.impPlacements),
            events: toNum(draft.impEvents),
        },
        otherActivities: draft.otherActivities.trim(),
        notes: draft.notes.trim(),
        customFields: customFields.filter((f) => f.title.trim() !== "" || f.content.trim() !== ""),
    });

    const save = async () => {
        setError("");
        if (!draft.period.trim()) {
            setError("Enter the report period, e.g. June 2026.");
            return;
        }
        setSaving(true);
        try {
            const input = buildInput();
            if (initial) {
                await financialApi.update(initial._id, input);
            } else {
                await financialAdminApi.create(input);
            }
            onSaved();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to save the report.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-4">
            <button
                onClick={onCancel}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-gray transition hover:text-navy"
            >
                <LuArrowLeft className="size-3.5" /> Back to reports
            </button>

            <div className="flex items-start gap-3 rounded-2xl border border-cyan/30 bg-ice-blue p-4">
                <LuFileText className="mt-0.5 size-4 shrink-0 text-cyan-ink" />
                <p className="text-xs leading-5 text-gray-700">
                    Enter the figures for each Relate activity this period, then save. Amounts are in
                    South African Rand (ZAR).{initial ? " You are editing an existing report." : ""}
                </p>
            </div>

            {error && (
                <p className="flex items-start gap-2 rounded-xl bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700">
                    <LuCircleAlert className="mt-0.5 size-3.5 shrink-0" /> {error}
                </p>
            )}

            <Section icon={LuCalendarDays} title="Report details">
                <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block">
                        <span className="mb-1 block text-xs font-semibold text-gray-700">
                            Report period <span className="text-rose-500">*</span>
                        </span>
                        <input
                            className={inputCls}
                            placeholder="e.g. June 2026"
                            value={draft.period}
                            onChange={(e) => set("period", e.target.value)}
                            onBlur={() => fetchPrefill(draft.period)}
                        />
                    </label>
                    <label className="block">
                        <span className="mb-1 block text-xs font-semibold text-gray-700">Prepared by</span>
                        <input
                            className={inputCls}
                            placeholder="Your name"
                            value={draft.preparedBy}
                            onChange={(e) => set("preparedBy", e.target.value)}
                        />
                    </label>
                </div>
            </Section>

            {fetching && (
                <p className="flex items-center gap-2 px-1 text-xs text-slate-gray">
                    <LuLoaderCircle className="size-3.5 animate-spin" /> Looking up figures for this period…
                </p>
            )}

            {prefill && (
                <div className="rounded-2xl border border-cyan/30 bg-ice-blue p-4">
                    <div className="flex items-center gap-2">
                        <LuDownload className="size-4 text-cyan-ink" />
                        <p className="flex-1 text-sm font-bold text-navy">Data for this period</p>
                        <button
                            onClick={() => fetchPrefill(draft.period)}
                            className="text-slate-gray transition hover:text-navy"
                            aria-label="Refresh period data"
                        >
                            <LuRefreshCw className="size-4" />
                        </button>
                    </div>
                    <div className="mt-2 divide-y divide-navy/10">
                        {[
                            {
                                label: "Founders' Fund",
                                value: prefill.foundersFund,
                                apply: () => set("incFoundersFund", String(prefill.foundersFund)),
                            },
                            {
                                label: "Amounts used from records",
                                value: prefill.amountsUsed,
                                apply: () => set("expAmountsFromRecords", String(prefill.amountsUsed)),
                            },
                            ...(prefill.balanceBroughtDown !== 0
                                ? [
                                      {
                                          label: "Balance from previous month",
                                          value: prefill.balanceBroughtDown,
                                          apply: () =>
                                              set("incBalanceBD", String(prefill.balanceBroughtDown)),
                                      },
                                  ]
                                : []),
                        ].map((row) => (
                            <div key={row.label} className="flex items-center justify-between gap-3 py-2">
                                <div>
                                    <p className="text-[11px] text-slate-gray">{row.label}</p>
                                    <p
                                        className={`text-sm font-bold ${
                                            row.value < 0 ? "text-rose-600" : "text-navy"
                                        }`}
                                    >
                                        R {row.value.toLocaleString("en-US")}
                                    </p>
                                </div>
                                <button
                                    onClick={row.apply}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-navy transition hover:bg-alice-blue"
                                >
                                    <LuDownload className="size-3" /> Import
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <Section icon={LuTrendingUp} title="Income">
                <div className="grid gap-3 sm:grid-cols-2">
                    {INCOME_FIELDS.map((field) => (
                        <div key={field.key} className={field.descKey ? "sm:col-span-2" : ""}>
                            <NumField
                                label={field.label}
                                value={draft[field.key] ?? ""}
                                onChange={(v) => set(field.key, v)}
                            />
                            {field.descKey && (
                                <input
                                    className={`${inputCls} mt-2`}
                                    placeholder={field.descPlaceholder}
                                    value={draft[field.descKey] ?? ""}
                                    onChange={(e) => set(field.descKey!, e.target.value)}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </Section>

            <Section icon={LuTrendingDown} title="Expenses">
                <div className="grid gap-3 sm:grid-cols-2">
                    {EXPENSE_FIELDS.map((field) => (
                        <div key={field.key} className={field.descKey ? "sm:col-span-2" : ""}>
                            <NumField
                                label={field.label}
                                value={draft[field.key] ?? ""}
                                onChange={(v) => set(field.key, v)}
                            />
                            {field.descKey && (
                                <input
                                    className={`${inputCls} mt-2`}
                                    placeholder={field.descPlaceholder}
                                    value={draft[field.descKey] ?? ""}
                                    onChange={(e) => set(field.descKey!, e.target.value)}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </Section>

            <Section icon={LuHeart} title="Impact">
                <div className="grid gap-3 sm:grid-cols-2">
                    {IMPACT_FIELDS.map((field) => (
                        <NumField
                            key={field.key}
                            label={field.label}
                            placeholder="0"
                            value={draft[field.key] ?? ""}
                            onChange={(v) => set(field.key, v)}
                        />
                    ))}
                </div>
            </Section>

            <Section icon={LuSparkles} title="Other activities">
                <textarea
                    className={`${inputCls} min-h-[84px]`}
                    placeholder="Services, outreach, community events, etc."
                    value={draft.otherActivities}
                    onChange={(e) => set("otherActivities", e.target.value)}
                />
            </Section>

            <Section icon={LuFileText} title="Additional items">
                <p className="mb-3 text-xs text-slate-gray">
                    Add any extra income, expense, or other line items.
                </p>
                <div className="space-y-2">
                    {customFields.map((item, index) => (
                        <div key={index} className="flex items-start gap-2">
                            <div className="grid flex-1 gap-2 sm:grid-cols-[1fr_2fr]">
                                <input
                                    className={inputCls}
                                    placeholder="Title"
                                    value={item.title}
                                    onChange={(e) =>
                                        setCustomFields((prev) =>
                                            prev.map((row, i) =>
                                                i === index ? { ...row, title: e.target.value } : row,
                                            ),
                                        )
                                    }
                                />
                                <input
                                    className={inputCls}
                                    placeholder="Content or description"
                                    value={item.content}
                                    onChange={(e) =>
                                        setCustomFields((prev) =>
                                            prev.map((row, i) =>
                                                i === index ? { ...row, content: e.target.value } : row,
                                            ),
                                        )
                                    }
                                />
                            </div>
                            <button
                                onClick={() =>
                                    setCustomFields((prev) => prev.filter((_, i) => i !== index))
                                }
                                className="mt-1.5 text-rose-500 transition hover:text-rose-700"
                                aria-label="Remove item"
                            >
                                <LuX className="size-5" />
                            </button>
                        </div>
                    ))}
                </div>
                <button
                    onClick={() => setCustomFields((prev) => [...prev, { title: "", content: "" }])}
                    className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-gray-300 bg-alice-blue/50 py-2.5 text-xs font-bold text-navy transition hover:bg-alice-blue"
                >
                    <LuPlus className="size-4" /> Add field
                </button>
            </Section>

            <Section icon={LuFileText} title="Notes">
                <textarea
                    className={`${inputCls} min-h-[84px]`}
                    placeholder="Anything to add to the report (optional)"
                    value={draft.notes}
                    onChange={(e) => set("notes", e.target.value)}
                />
            </Section>

            <div className="sticky bottom-3 z-10 rounded-2xl border border-gray-100 bg-white/95 p-4 shadow-lg backdrop-blur">
                <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-gray">
                            Income
                        </p>
                        <p className="text-sm font-bold text-navy">
                            R {totals.income.toLocaleString("en-US")}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-gray">
                            Spend
                        </p>
                        <p className="text-sm font-bold text-navy">
                            R {totals.expenses.toLocaleString("en-US")}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-gray">
                            Net
                        </p>
                        <p
                            className={`text-sm font-bold ${
                                totals.net >= 0 ? "text-emerald-700" : "text-rose-600"
                            }`}
                        >
                            R {totals.net.toLocaleString("en-US")}
                        </p>
                    </div>
                </div>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <button
                        onClick={onCancel}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-alice-blue"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={save}
                        disabled={saving}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-soft disabled:opacity-60"
                    >
                        {saving ? (
                            <LuLoaderCircle className="animate-spin" />
                        ) : initial ? (
                            <LuCheck className="size-4" />
                        ) : (
                            <LuSave className="size-4" />
                        )}
                        {initial ? "Update report" : "Save report"}
                    </button>
                </div>
            </div>
        </div>
    );
}
