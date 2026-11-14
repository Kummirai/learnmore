"use client";

import {useCallback, useEffect, useState} from "react";
import {LuCheck, LuCircleCheck, LuClock3, LuFileText, LuSearch, LuTrash2} from "react-icons/lu";
import {inputCls} from "@/components/admin/ui";
import {
    boardApi,
    shortDateLabel,
    type BoardMinutes,
    type TaskStatus,
} from "@/lib/board";

const FILTERS: {key: string; label: string}[] = [
    {key: "all", label: "All minutes"},
    {key: "pending", label: "Open actions"},
    {key: "on-time", label: "Within 48h"},
    {key: "late", label: "Late logs"},
];

const TASK_TONE: Record<TaskStatus, {bg: string; text: string; label: string}> = {
    PENDING: {bg: "bg-amber-50", text: "text-amber-700", label: "Pending"},
    IN_PROGRESS: {bg: "bg-sky-50", text: "text-sky-700", label: "In progress"},
    DONE: {bg: "bg-emerald-50", text: "text-emerald-700", label: "Done"},
};

function nextStatus(status: TaskStatus): TaskStatus {
    if (status === "PENDING") return "IN_PROGRESS";
    if (status === "IN_PROGRESS") return "DONE";
    return "PENDING";
}

export default function MinutesArchiveAndTaskTracker({
    onDataChanged,
}: {
    onDataChanged?: () => void;
}) {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [items, setItems] = useState<BoardMinutes[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [busy, setBusy] = useState("");

    const load = useCallback(async (term: string, key: string) => {
        try {
            setError("");
            setLoading(true);
            const res = await boardApi.listMinutes(term.trim(), key);
            setItems(res.data || []);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to load minutes.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            void load(search, filter);
        }, search.trim() ? 350 : 0);
        return () => clearTimeout(timer);
    }, [load, search, filter]);

    const cycleTask = async (minutes: BoardMinutes, taskId: string, current: TaskStatus) => {
        if (busy) return;
        const status = nextStatus(current);
        setBusy(taskId);
        try {
            const res = await boardApi.updateTask(minutes._id, taskId, status);
            setItems((list) =>
                list.map((entry) =>
                    entry._id === minutes._id
                        ? {
                              ...entry,
                              actionItems: entry.actionItems.map((item) =>
                                  item.taskId === taskId ? {...item, status} : item,
                              ),
                              counts: res.data.counts,
                          }
                        : entry,
                ),
            );
            onDataChanged?.();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Could not update the task.");
        } finally {
            setBusy("");
        }
    };

    const removeMinutes = async (minutes: BoardMinutes) => {
        if (
            !window.confirm(
                `Delete the minutes for "${minutes.meetingTitle}"? Their action items go too and the board is told.`,
            )
        ) {
            return;
        }
        setBusy(minutes._id);
        try {
            await boardApi.deleteMinutes(minutes._id);
            setItems((list) => list.filter((entry) => entry._id !== minutes._id));
            onDataChanged?.();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Could not delete the minutes.");
        } finally {
            setBusy("");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
                <div className="relative min-w-[220px] flex-1">
                    <LuSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                    <input
                        className={`${inputCls} pl-9`}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search decisions, tasks or meetings"
                    />
                </div>
                <div className="flex flex-wrap gap-1.5">
                    {FILTERS.map((option) => {
                        const on = filter === option.key;
                        return (
                            <button
                                key={option.key}
                                type="button"
                                onClick={() => setFilter(option.key)}
                                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                                    on
                                        ? "border-navy btn-signin text-white"
                                        : "border-gray-200 bg-white text-slate-gray hover:bg-alice-blue"
                                }`}
                            >
                                {option.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {error ? (
                <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            ) : null}

            {loading ? (
                <div className="space-y-3">
                    {[0, 1, 2].map((index) => (
                        <div key={index} className="h-36 animate-pulse rounded-2xl border border-gray-100 bg-white"/>
                    ))}
                </div>
            ) : items.length === 0 ? (
                <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center">
                    <p className="text-sm font-semibold text-navy">
                        {search || filter !== "all" ? "No matching minutes" : "No minutes yet"}
                    </p>
                    <p className="mt-1 text-xs text-slate-gray">
                        {search || filter !== "all"
                            ? "Try a different search or filter."
                            : "Published minutes and their action items will appear here."}
                    </p>
                </div>
            ) : (
                items.map((minutes) => (
                    <article
                        key={minutes._id}
                        className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5"
                    >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0">
                                <h2 className="text-sm font-bold text-navy">{minutes.meetingTitle}</h2>
                                <p className="mt-0.5 text-xs text-slate-gray">
                                    Meeting {shortDateLabel(minutes.meetingDate)} · published{" "}
                                    {shortDateLabel(minutes.publishedAt)}
                                </p>
                            </div>
                            <span
                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                                    minutes.within48h
                                        ? "bg-emerald-50 text-emerald-700"
                                        : "bg-rose-50 text-rose-700"
                                }`}
                            >
                                <LuClock3 className="text-xs"/>
                                {minutes.within48h
                                    ? "Within 48h"
                                    : `Late · ${minutes.hoursAfterMeeting ?? "?"}h`}
                            </span>
                        </div>

                        {minutes.sections.length > 0 ? (
                            <div className="mt-3 space-y-3">
                                {minutes.sections.map((section, index) => (
                                    <div
                                        key={`${minutes._id}-section-${index}`}
                                        className="border-l-2 border-cyan/40 pl-3"
                                    >
                                        <p className="text-sm font-bold text-navy">
                                            {section.title || `Section ${index + 1}`}
                                        </p>
                                        <ul className="mt-1 space-y-1">
                                            {section.points.map((point, pointIndex) => (
                                                <li
                                                    key={`${minutes._id}-section-${index}-point-${pointIndex}`}
                                                    className="flex gap-2 text-sm leading-relaxed text-gray-700"
                                                >
                                                    <span className="mt-1.5 size-1 shrink-0 rounded-full bg-cyan"/>
                                                    <span>{point}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-gray-700">
                                {minutes.summary}
                            </p>
                        )}

                        <div className="mt-3 flex flex-wrap items-center gap-3">
                            {minutes.minutesDocumentUrl ? (
                                <a
                                    href={minutes.minutesDocumentUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan hover:text-cyan-dark"
                                >
                                    <LuFileText/> Open signed minutes
                                </a>
                            ) : null}
                            <button
                                type="button"
                                disabled={!!busy}
                                onClick={() => void removeMinutes(minutes)}
                                className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 disabled:opacity-60"
                            >
                                <LuTrash2 className="text-[12px]"/>
                                {busy === minutes._id ? "Deleting…" : "Delete"}
                            </button>
                        </div>

                        <div className="mt-4 border-t border-gray-100 pt-3">
                            <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-gray">
                                Action items · {minutes.counts.done}/{minutes.counts.total} done
                            </p>
                            {minutes.actionItems.length === 0 ? (
                                <p className="text-xs text-gray-400">No action items were raised.</p>
                            ) : (
                                <ul className="space-y-1.5">
                                    {minutes.actionItems.map((task) => {
                                        const tone = TASK_TONE[task.status];
                                        return (
                                            <li key={task.taskId}>
                                                <button
                                                    type="button"
                                                    onClick={() => void cycleTask(minutes, task.taskId, task.status)}
                                                    className="flex w-full items-start gap-2.5 rounded-xl bg-alice-blue/70 px-3 py-2 text-left transition hover:bg-alice-blue"
                                                    title={`Move to ${nextStatus(task.status).toLowerCase().replace("_", " ")}`}
                                                >
                                                    {task.status === "DONE" ? (
                                                        <LuCircleCheck className="mt-0.5 shrink-0 text-emerald-600"/>
                                                    ) : task.status === "IN_PROGRESS" ? (
                                                        <LuClock3 className="mt-0.5 shrink-0 text-sky-600"/>
                                                    ) : (
                                                        <LuCheck className="mt-0.5 shrink-0 text-gray-300"/>
                                                    )}
                                                    <span className="min-w-0 flex-1">
                                                        <span
                                                            className="block text-sm text-gray-700"
                                                        >
                                                            {task.taskDescription}
                                                        </span>
                                                        <span className="mt-0.5 block text-[11px] text-slate-gray">
                                                            {task.assigneeName}
                                                            {task.dueDate
                                                                ? ` · due ${shortDateLabel(task.dueDate)}`
                                                                : ""}
                                                        </span>
                                                    </span>
                                                    <span
                                                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${tone.bg} ${tone.text}`}
                                                    >
                                                        {busy === task.taskId ? "Saving…" : tone.label}
                                                    </span>
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>
                    </article>
                ))
            )}
        </div>
    );
}
