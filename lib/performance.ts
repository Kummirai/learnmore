/**
 * Organisation performance, built from published financial reports and the
 * latest approved seasonal appraisals. Mirrors the mobile app's performance
 * service so both clients read the same /api/performance payload.
 */

export type PerformanceMonth = {
    month: number;
    label: string;
    period: string;
    income: number;
    expenses: number;
    net: number;
    /** Report income without the balance brought in. */
    raised: number;
};

export type IncomeMixRow = {
    key: string;
    label: string;
    value: number;
};

export type PerformanceImpact = {
    families: number;
    mealsServed: number;
    children: number;
    placements: number;
    events: number;
};

export type IndividualAppraisalRow = {
    id: string;
    name: string;
    department: string | null;
    score: number;
    band: string | null;
};

export type DepartmentAppraisalRow = {
    id: string;
    department: string;
    lead: string | null;
    score: number;
    band: string | null;
    collected: number;
    revenueTarget: number;
};

export type AppraisalPerformance = {
    season: { name: string; year: number };
    individuals: IndividualAppraisalRow[];
    departments: DepartmentAppraisalRow[];
};

export type PerformanceSummary = {
    year: number;
    target: number;
    coffer: {
        raised: number;
        target: number;
        remaining: number;
        progressPct: number;
    };
    totals: { income: number; expenses: number };
    /** Carried balance plus what the window raised, less what it spent. */
    balance: number;
    months: PerformanceMonth[];
    incomeMix: IncomeMixRow[];
    /** Approved appraisal scores — null until the first is signed off. */
    appraisals: AppraisalPerformance | null;
    latestImpact: PerformanceImpact | null;
    latestReport: {
        period: string;
        preparedBy: string | null;
        createdAt: string | null;
    } | null;
    reportCount: number;
    season: { name: string; ends: string; year: number };
};

/** Organisation performance for a year (defaults to the current one). */
export async function fetchPerformance(year?: number): Promise<PerformanceSummary> {
    const res = await fetch(`/api/performance${year ? `?year=${year}` : ""}`, {
        cache: "no-store",
        credentials: "same-origin",
    });
    const json = await res.json().catch(() => null);
    if (!res.ok) {
        throw new Error(json?.error || "Couldn't load organisation performance.");
    }
    return json.data as PerformanceSummary;
}
