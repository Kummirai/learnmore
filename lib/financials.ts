/**
 * Financial reports — the compiled monthly statements admins publish and
 * members read. Shared types and helpers used by the web app's report
 * viewer and admin editor.
 */

export type FinancialReportInput = {
    period: string;
    preparedBy: string;
    income: {
        balanceBroughtDown: number;
        foundersFund: number;
        events: number;
        donations: number;
        books: number;
        other: number;
        otherDescription: string;
    };
    expenses: {
        meals: number;
        groceries: number;
        tuition: number;
        transport: number;
        employment: number;
        materials: number;
        other: number;
        otherDescription: string;
        amountsFromRecords: number;
    };
    impact: {
        families: number;
        mealsServed: number;
        children: number;
        placements: number;
        events: number;
    };
    otherActivities: string;
    notes: string;
    customFields: { title: string; content: string }[];
};

/** One published financial report as shown in the "Financials" list. */
export type FinancialReportSummary = {
    _id: string;
    period: string;
    preparedBy: string;
    createdAt: string;
    income: number;
    expenses: number;
    net: number;
};

/** Full detail of a published financial report (the report viewer). */
export type FinancialReport = {
    _id: string;
    period: string;
    preparedBy: string;
    createdAt: string;
    /** `sponsorships` is the retired key; reports filed before the rename still carry it. */
    income: FinancialReportInput["income"] & { sponsorships?: number };
    expenses: FinancialReportInput["expenses"];
    impact: FinancialReportInput["impact"];
    otherActivities: string;
    notes: string;
    customFields: { title: string; content: string }[];
};

/** Founders’ Fund amount, falling back to the retired `sponsorships` key. */
export function foundersFundOf(income: {
    foundersFund?: number;
    sponsorships?: number;
}): number {
    return income.foundersFund ?? income.sponsorships ?? 0;
}

/** Totals (income / expenses / net) for a compiled report. */
export function reportTotals(r: Pick<FinancialReport, "income" | "expenses">) {
    const income =
        r.income.balanceBroughtDown +
        foundersFundOf(r.income) +
        r.income.events +
        r.income.donations +
        r.income.books +
        r.income.other;
    const expenses =
        r.expenses.meals +
        r.expenses.groceries +
        r.expenses.tuition +
        r.expenses.transport +
        r.expenses.employment +
        r.expenses.materials +
        r.expenses.other +
        r.expenses.amountsFromRecords;
    return { income, expenses, net: income - expenses };
}

/** R 12 500 */
export function formatMoney(value: number): string {
    return `R ${Math.round(value || 0).toLocaleString("en-US")}`;
}

/** R12.5k / -R800 — short money for table cells. */
export function formatCompact(value: number): string {
    const sign = value < 0 ? "-" : "";
    const abs = Math.abs(value);
    const body = abs >= 1000 ? `${(abs / 1000).toFixed(1).replace(/\.0$/, "")}k` : `${Math.round(abs)}`;
    return `${sign}R${body}`;
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(path, {
        cache: "no-store",
        credentials: "same-origin",
        ...init,
    });
    const json = await res.json().catch(() => null);
    if (!res.ok) {
        throw new Error(json?.error || "Something went wrong. Please try again.");
    }
    return json as T;
}

/** User-facing reads of published financial reports. */
export const financialApi = {
    /** Every published report, newest first, with headline totals. */
    list: () => apiFetch<{ data: FinancialReportSummary[] }>("/api/financial-reports"),

    /** Full detail of one report for the viewer. */
    get: (id: string) => apiFetch<{ data: FinancialReport }>(`/api/financial-reports/${id}`),

    /** Admin-only: edit a published report in place. */
    update: (id: string, input: FinancialReportInput) =>
        apiFetch<{ data: { _id: string; period: string } }>(`/api/financial-reports/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input),
        }),

    /** Admin-only: remove a report filed by mistake. */
    remove: (id: string) =>
        apiFetch<{ data: { _id: string } }>(`/api/financial-reports/${id}`, {
            method: "DELETE",
        }),
};

/** Admin-only writes. */
export const financialAdminApi = {
    /** Save a manually compiled report. */
    create: (input: FinancialReportInput) =>
        apiFetch<{ data: { _id: string; period: string } }>("/api/financial-report", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input),
        }),

    /** Aggregated figures for pre-filling the report form. */
    prefill: (period: string) =>
        apiFetch<{
            data: {
                foundersFund: number;
                amountsUsed: number;
                balanceBroughtDown: number;
                period: string;
            };
        }>(`/api/financial-report-data?period=${encodeURIComponent(period)}`),
};
