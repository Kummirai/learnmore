"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
    LuArrowLeft,
    LuCheck,
    LuCircleAlert,
    LuClipboardCheck,
    LuInfo,
    LuLoaderCircle,
    LuRotateCcw,
    LuShieldCheck,
    LuUpload,
} from "react-icons/lu";
import { inputCls } from "@/components/admin/ui";
import {
    appraisalApi,
    type AppraisalAnswers,
    type AppraisalDetail,
    type AppraisalField,
    type AppraisalStatus,
} from "@/lib/appraisals";

const STATUS_TONE: Record<AppraisalStatus, string> = {
    assigned: "bg-amber-50 text-amber-700",
    submitted: "bg-sky-50 text-sky-800",
    approved: "bg-emerald-50 text-emerald-700",
    rejected: "bg-rose-50 text-rose-700",
};

const BAND_TONE: Record<string, string> = {
    Excellent: "text-emerald-700 bg-emerald-50",
    Strong: "text-cyan-ink bg-ice-blue",
    Meets: "text-navy bg-alice-blue",
    Developing: "text-amber-700 bg-amber-50",
    Intervention: "text-rose-700 bg-rose-50",
};

function formatAnswer(field: AppraisalField, value: string | number | undefined): string {
    if (value === undefined || value === null || value === "") return "—";
    if (field.kind === "currency") {
        const num = Number(value);
        return Number.isFinite(num) ? `R ${num.toLocaleString("en-US")}` : String(value);
    }
    if (field.kind === "percent") return `${value}%`;
    return String(value);
}

export default function AppraisalDetailView({
    id,
    backHref,
    backLabel = "Back to appraisals",
}: {
    id: string;
    backHref: string;
    backLabel?: string;
}) {
    const [data, setData] = useState<AppraisalDetail | null>(null);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [notes, setNotes] = useState("");
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);
    const [notice, setNotice] = useState("");
    const [actionError, setActionError] = useState("");

    const load = useCallback(async () => {
        if (!id) {
            setError("No appraisal selected.");
            return;
        }
        try {
            const res = await appraisalApi.get(id);
            setData(res.data);
            setNotes(res.data.reviewNotes || "");
            setError("");
            const next: Record<string, string> = {};
            for (const section of res.data.form.sections) {
                for (const field of section.fields) {
                    const value = res.data.answers[field.id];
                    next[field.id] = value === undefined || value === null ? "" : String(value);
                }
            }
            setAnswers(next);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to load the appraisal.");
        }
    }, [id]);

    useEffect(() => {
        void Promise.resolve().then(() => load());
    }, [load]);

    const setAnswer = (fieldId: string, value: string) => {
        setAnswers((prev) => ({ ...prev, [fieldId]: value }));
    };

    const submit = async () => {
        if (!data) return;
        setBusy(true);
        setNotice("");
        setActionError("");
        try {
            const payload: AppraisalAnswers = { ...answers };
            await appraisalApi.submit(data._id, payload);
            await load();
            setNotice("Your admin has been notified to review it.");
        } catch (e) {
            setActionError(e instanceof Error ? e.message : "Could not submit. Please try again.");
        } finally {
            setBusy(false);
        }
    };

    const review = async (action: "approve" | "reject") => {
        if (!data) return;
        if (action === "reject" && !notes.trim()) {
            setActionError("Explain what needs to change before sending it back.");
            return;
        }
        if (
            action === "approve" &&
            !window.confirm(
                `Approve this appraisal? This publishes ${Math.round(data.score || 0)}% to organisation performance.`,
            )
        ) {
            return;
        }
        setBusy(true);
        setNotice("");
        setActionError("");
        try {
            await appraisalApi.review(data._id, action, notes.trim());
            await load();
            setNotice(
                action === "approve"
                    ? "Approved — the score is now part of organisation performance."
                    : "Sent back — the member has been notified with your notes.",
            );
        } catch (e) {
            setActionError(e instanceof Error ? e.message : "Could not update. Please try again.");
        } finally {
            setBusy(false);
        }
    };

    if (!data && !error) {
        return (
            <div className="flex items-center justify-center gap-3 py-20 text-slate-gray">
                <LuLoaderCircle className="animate-spin text-2xl" />
                <span className="text-sm">Loading appraisal…</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
                <LuCircleAlert className="mx-auto mb-2 text-2xl text-red-500" />
                <p className="font-bold text-navy">Couldn&apos;t load this appraisal</p>
                <p className="mt-1 text-sm text-slate-gray">{error}</p>
                <div className="mt-4 flex items-center justify-center gap-3">
                    <Link
                        href={backHref}
                        className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-alice-blue"
                    >
                        Back
                    </Link>
                    <button
                        onClick={() => void load()}
                        className="rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-soft"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const tone = STATUS_TONE[data.status] ?? STATUS_TONE.assigned;
    const bandTone = BAND_TONE[data.band || ""] || BAND_TONE.Meets;

    return (
        <div className="space-y-4">
            <Link
                href={backHref}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-gray transition hover:text-navy"
            >
                <LuArrowLeft className="size-3.5" /> {backLabel}
            </Link>

            {notice && (
                <p className="rounded-xl bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-700">
                    {notice}
                </p>
            )}
            {actionError && (
                <p className="rounded-xl bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700">
                    {actionError}
                </p>
            )}

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-gold-50 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-gold-800">
                        {data.type === "department" ? "Department" : "Individual"}
                    </span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${tone}`}>
                        {data.statusLabel}
                    </span>
                </div>
                <h1 className="mt-2 font-display text-2xl font-black tracking-tight text-navy">
                    {data.type === "department" ? data.department : data.subjectName}
                </h1>
                <p className="mt-0.5 text-xs text-slate-gray">
                    {data.season} {data.seasonYear}
                    {data.type === "department" ? ` · lead ${data.subjectName}` : ""}
                </p>
                {data.assignedByName && (
                    <p className="mt-1 text-[11px] text-gray-400">Allocated by {data.assignedByName}</p>
                )}

                {data.score != null && data.status !== "assigned" && (
                    <div className="mt-4 flex items-end justify-between border-t border-gray-100 pt-4">
                        <div>
                            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-gray">
                                Season score
                            </p>
                            <p className={`mt-1 font-display text-3xl font-black ${bandTone.split(" ")[0]}`}>
                                {Math.round(data.score)}%
                            </p>
                        </div>
                        <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${bandTone}`}>
                            {data.band || "Scored"}
                        </span>
                    </div>
                )}
            </div>

            {data.status === "rejected" && data.reviewNotes && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
                    <div className="flex items-center gap-2">
                        <LuRotateCcw className="size-4 text-rose-600" />
                        <p className="text-xs font-semibold text-rose-700">Sent back with notes</p>
                    </div>
                    <p className="mt-1.5 text-sm leading-6 text-rose-900">{data.reviewNotes}</p>
                </div>
            )}

            {data.canSubmit ? (
                <>
                    <p className="px-1 text-xs leading-5 text-slate-gray">
                        Fill in every figure for {data.season} {data.seasonYear}. Your score is calculated
                        from these figures when you submit.
                    </p>
                    {data.form.sections.map((section) => (
                        <div key={section.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-2">
                                <h2 className="flex-1 text-sm font-bold text-navy">{section.title}</h2>
                                <span className="text-[11px] font-semibold text-gold-800">
                                    {section.weight > 0 ? `${section.weight}%` : "Optional"}
                                </span>
                            </div>
                            <div className="mt-4 space-y-4">
                                {section.fields.map((field) => (
                                    <div key={field.id}>
                                        <p className="mb-1.5 text-xs font-semibold text-gray-700">{field.label}</p>
                                        {field.kind === "choice" ? (
                                            <div className="flex flex-wrap gap-2">
                                                {(field.options || []).map((option) => {
                                                    const on = answers[field.id] === option;
                                                    return (
                                                        <button
                                                            key={option}
                                                            onClick={() => setAnswer(field.id, option)}
                                                            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                                                                on
                                                                    ? "border-gold-300 bg-gold-50 text-gold-800"
                                                                    : "border-gray-200 bg-white text-slate-gray hover:bg-alice-blue"
                                                            }`}
                                                        >
                                                            {option}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        ) : field.kind === "text" ? (
                                            <textarea
                                                className={`${inputCls} min-h-[84px]`}
                                                maxLength={field.maxLength ?? 2000}
                                                placeholder={field.hint || "Write your answer"}
                                                value={answers[field.id] ?? ""}
                                                onChange={(e) => setAnswer(field.id, e.target.value)}
                                            />
                                        ) : (
                                            <input
                                                className={inputCls}
                                                inputMode="decimal"
                                                placeholder={field.hint || "0"}
                                                value={answers[field.id] ?? ""}
                                                onChange={(e) => setAnswer(field.id, e.target.value)}
                                            />
                                        )}
                                        {field.hint && field.kind !== "text" && (
                                            <p className="mt-1 text-[11px] text-gray-400">{field.hint}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={submit}
                        disabled={busy}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-navy px-4 py-3 text-sm font-semibold text-white transition hover:bg-navy-soft disabled:opacity-60"
                    >
                        {busy ? (
                            <LuLoaderCircle className="animate-spin" />
                        ) : (
                            <>
                                <LuUpload className="size-4" /> Submit appraisal
                            </>
                        )}
                    </button>
                </>
            ) : (
                <>
                    {data.sections.map((section) => {
                        const form = data.form.sections.find((s) => s.id === section.id);
                        if (!form) return null;
                        const fields = form.fields.filter((field) => {
                            if (field.kind === "text") return !!data.answers[field.id];
                            return true;
                        });
                        return (
                            <div key={section.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                                <div className="flex items-center gap-2">
                                    <h2 className="flex-1 text-sm font-bold text-navy">{section.title}</h2>
                                    {section.weight > 0 && (
                                        <span className="text-[11px] font-bold text-gold-800">
                                            {section.score}/{section.weight}
                                        </span>
                                    )}
                                </div>
                                <div className="mt-2">
                                    {fields.length === 0 ? (
                                        <p className="text-xs text-gray-400">No commentary provided.</p>
                                    ) : (
                                        fields.map((field) => (
                                            <div
                                                key={field.id}
                                                className="flex items-start gap-4 border-b border-gray-100 py-2 last:border-0"
                                            >
                                                <p className="flex-1 text-xs leading-5 text-slate-gray">
                                                    {field.label}
                                                </p>
                                                <p className="max-w-[45%] text-right text-xs font-medium leading-5 text-gray-800">
                                                    {formatAnswer(field, data.answers[field.id])}
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {data.status === "approved" && data.reviewNotes && (
                        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-2">
                                <LuInfo className="size-4 text-gold-500" />
                                <h2 className="text-sm font-bold text-navy">Reviewer notes</h2>
                            </div>
                            <p className="mt-2 text-sm leading-6 text-gray-800">{data.reviewNotes}</p>
                        </div>
                    )}
                </>
            )}

            {data.canReview && (
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-2">
                        <LuShieldCheck className="size-4 text-gold-500" />
                        <h2 className="text-sm font-bold text-navy">Review</h2>
                    </div>
                    <p className="mt-1 text-xs leading-5 text-slate-gray">
                        Approving publishes this score to organisation performance. Sending it back lets
                        the member correct their figures.
                    </p>
                    <p className="mb-1.5 mt-3 text-xs font-semibold text-gray-700">Notes to the member</p>
                    <textarea
                        className={`${inputCls} min-h-[84px]`}
                        maxLength={2000}
                        placeholder="What should change, or context for the score"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                    <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                        <button
                            onClick={() => review("reject")}
                            disabled={busy}
                            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-60"
                        >
                            <LuRotateCcw className="size-4" /> Send back
                        </button>
                        <button
                            onClick={() => review("approve")}
                            disabled={busy}
                            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-soft disabled:opacity-60"
                        >
                            {busy ? <LuLoaderCircle className="animate-spin" /> : <LuCheck className="size-4" />}
                            Approve
                        </button>
                    </div>
                </div>
            )}

            {!data.canSubmit && !data.canReview && data.status === "assigned" && (
                <p className="flex items-center justify-center gap-2 py-2 text-xs text-slate-gray">
                    <LuClipboardCheck className="size-4" /> Waiting for the member to complete this form.
                </p>
            )}
        </div>
    );
}
