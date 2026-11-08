/**
 * Seasonal appraisals — the wire contract shared with the backend's
 * /api/appraisals routes and the mobile app's appraisal service.
 */

export type AppraisalType = "individual" | "department";
export type AppraisalStatus = "assigned" | "submitted" | "approved" | "rejected";
export type AppraisalFieldKind = "number" | "currency" | "percent" | "choice" | "text";

export type AppraisalField = {
    id: string;
    label: string;
    kind: AppraisalFieldKind;
    hint?: string;
    options?: string[];
    maxLength?: number;
};

export type AppraisalSection = {
    id: string;
    title: string;
    weight: number;
    fields: AppraisalField[];
};

export type AppraisalForm = {
    type: AppraisalType;
    title: string;
    sections: AppraisalSection[];
};

export type AppraisalSummary = {
    _id: string;
    type: AppraisalType;
    subjectUserId: string;
    subjectName: string;
    department: string | null;
    season: string;
    seasonYear: number;
    status: AppraisalStatus;
    statusLabel: string;
    score: number | null;
    band: string | null;
    assignedByName: string | null;
    createdAt: string | null;
    submittedAt: string | null;
    reviewedAt: string | null;
};

export type AppraisalAnswers = Record<string, string | number>;

export type AppraisalSectionScore = {
    id: string;
    title: string;
    weight: number;
    score: number;
};

export type AppraisalDetail = AppraisalSummary & {
    title: string;
    answers: AppraisalAnswers;
    sections: AppraisalSectionScore[];
    form: AppraisalForm;
    reviewNotes: string;
    reviewedByName: string | null;
    canSubmit: boolean;
    canReview: boolean;
};

export type AppraisalUser = {
    id: string;
    name: string;
    email: string;
    role: string;
};

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

export const appraisalApi = {
    /** Admin: every appraisal. Member: the ones allocated to me. */
    list: () =>
        apiFetch<{ data: AppraisalSummary[]; isAdmin: boolean }>("/api/appraisals"),

    get: (id: string) =>
        apiFetch<{ data: AppraisalDetail }>(`/api/appraisals/${id}`),

    /** Admin only: allocate an appraisal to a member (or department lead). */
    create: (input: {
        type: AppraisalType;
        userId: string;
        department?: string;
        season?: string;
        seasonYear?: number;
    }) =>
        apiFetch<{ data: AppraisalSummary }>("/api/appraisals", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input),
        }),

    /** Member: submit the filled form (also used to resubmit after a rejection). */
    submit: (id: string, answers: AppraisalAnswers) =>
        apiFetch<{ data: { status: AppraisalStatus; score: number; band: string } }>(
            `/api/appraisals/${id}`,
            {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ answers }),
            },
        ),

    /** Admin: approve, or send back with notes. */
    review: (id: string, action: "approve" | "reject", notes = "") =>
        apiFetch<{ data: { status: AppraisalStatus; score: number | null } }>(
            `/api/appraisals/${id}`,
            {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action, notes }),
            },
        ),

    /** Admin only: member lookup for allocation. */
    searchUsers: (query: string) =>
        apiFetch<{ data: AppraisalUser[] }>(
            `/api/admin/users?search=${encodeURIComponent(query)}`,
        ),
};
