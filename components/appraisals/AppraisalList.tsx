"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    LuCheck,
    LuChevronRight,
    LuCircleAlert,
    LuClipboardCheck,
    LuClipboardList,
    LuLoaderCircle,
    LuPlus,
    LuSearch,
} from "react-icons/lu";
import { inputCls } from "@/components/admin/ui";
import {
    appraisalApi,
    type AppraisalStatus,
    type AppraisalSummary,
    type AppraisalType,
    type AppraisalUser,
} from "@/lib/appraisals";

const STATUS_TONE: Record<AppraisalStatus, string> = {
    assigned: "bg-amber-50 text-amber-700",
    submitted: "bg-sky-50 text-sky-800",
    approved: "bg-emerald-50 text-emerald-700",
    rejected: "bg-rose-50 text-rose-700",
};

const FILTERS: { key: AppraisalStatus | "all"; label: string }[] = [
    { key: "all", label: "All" },
    { key: "assigned", label: "Awaiting form" },
    { key: "submitted", label: "To review" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Sent back" },
];

function StatusPill({ status, label }: { status: AppraisalStatus; label: string }) {
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                STATUS_TONE[status] ?? STATUS_TONE.assigned
            }`}
        >
            {label}
        </span>
    );
}

export default function AppraisalList({
    adminBase = "",
    allocation = false,
}: {
    /** Prefix for detail links, e.g. "/admin". */
    adminBase?: string;
    /** Show the "allocate an appraisal" card (admin pages only). */
    allocation?: boolean;
}) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [items, setItems] = useState<AppraisalSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState<AppraisalStatus | "all">("all");

    const [type, setType] = useState<AppraisalType>("individual");
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState<AppraisalUser[]>([]);
    const [searching, setSearching] = useState(false);
    const [selected, setSelected] = useState<AppraisalUser | null>(null);
    const [department, setDepartment] = useState("");
    const [assigning, setAssigning] = useState(false);
    const [notice, setNotice] = useState("");
    const [assignError, setAssignError] = useState("");

    const load = useCallback(async () => {
        setError("");
        try {
            const res = await appraisalApi.list();
            setItems(res.data || []);
            setIsAdmin(!!res.isAdmin);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to load appraisals.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void Promise.resolve().then(() => load());
    }, [load]);

    useEffect(() => {
        const query = search.trim();
        if (query.length < 2) return;
        let alive = true;
        const timer = setTimeout(() => {
            setSearching(true);
            appraisalApi
                .searchUsers(query)
                .then((res) => {
                    if (alive) setUsers(res.data || []);
                })
                .catch(() => {
                    if (alive) setUsers([]);
                })
                .finally(() => {
                    if (alive) setSearching(false);
                });
        }, 350);
        return () => {
            alive = false;
            clearTimeout(timer);
        };
    }, [search]);

    const allocate = async () => {
        setAssignError("");
        setNotice("");
        if (!selected) {
            setAssignError("Search for the member who will complete this appraisal.");
            return;
        }
        if (type === "department" && !department.trim()) {
            setAssignError("Enter the department or club this appraisal covers.");
            return;
        }
        setAssigning(true);
        const allocatedName = type === "department" ? department.trim() : selected.name;
        try {
            await appraisalApi.create({
                type,
                userId: selected.id,
                department: type === "department" ? department.trim() : undefined,
            });
            setSelected(null);
            setDepartment("");
            setSearch("");
            setUsers([]);
            setNotice(`${allocatedName} will be notified to complete it.`);
            await load();
        } catch (e) {
            setAssignError(e instanceof Error ? e.message : "Could not allocate. Please try again.");
        } finally {
            setAssigning(false);
        }
    };

    const visible = useMemo(
        () => (filter === "all" ? items : items.filter((item) => item.status === filter)),
        [items, filter],
    );
    const awaiting = items.filter((item) => item.status === "assigned").length;
    const toReview = items.filter((item) => item.status === "submitted").length;
    const approved = items.filter((item) => item.status === "approved").length;

    if (loading) {
        return (
            <div className="flex items-center justify-center gap-3 py-20 text-slate-gray">
                <LuLoaderCircle className="animate-spin text-2xl" />
                <span className="text-sm">Loading appraisals…</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
                <LuCircleAlert className="mx-auto mb-2 text-2xl text-red-500" />
                <p className="font-bold text-navy">Couldn&apos;t load appraisals</p>
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
        );
    }

    return (
        <div className="space-y-4">
            {allocation && isAdmin && (
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-2">
                        <LuClipboardList className="size-4 text-gold-500" />
                        <h2 className="text-sm font-bold text-navy">Allocate an appraisal</h2>
                    </div>
                    <p className="mt-1 text-xs text-slate-gray">
                        Choose a member and the kind of appraisal they must complete.
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-1 rounded-xl bg-alice-blue p-1">
                        {(["individual", "department"] as AppraisalType[]).map((option) => (
                            <button
                                key={option}
                                onClick={() => setType(option)}
                                className={`rounded-lg py-2 text-xs font-semibold capitalize transition ${
                                    type === option
                                        ? "bg-white text-navy shadow-sm"
                                        : "text-slate-gray hover:text-navy"
                                }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>

                    <div className="mt-3 space-y-3">
                        {type === "department" && (
                            <input
                                className={inputCls}
                                placeholder="Department or club name"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                            />
                        )}

                        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 shadow-sm focus-within:border-cyan focus-within:ring-2 focus-within:ring-cyan/20">
                            <LuSearch className="size-4 shrink-0 text-gray-400" />
                            <input
                                className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                                placeholder={
                                    type === "department" ? "Search the department lead" : "Search a member"
                                }
                                value={search}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setSearch(value);
                                    setSelected(null);
                                    if (value.trim().length < 2) {
                                        setUsers([]);
                                        setSearching(false);
                                    }
                                }}
                            />
                            {searching && <LuLoaderCircle className="size-4 shrink-0 animate-spin text-gold-500" />}
                        </div>

                        {search.trim().length >= 2 && (
                            <div className="space-y-1.5">
                                {users.length === 0 && !searching ? (
                                    <p className="px-1 py-1.5 text-xs text-slate-gray">
                                        No members match that search.
                                    </p>
                                ) : (
                                    users.slice(0, 6).map((user) => (
                                        <button
                                            key={user.id}
                                            onClick={() => setSelected(user)}
                                            className={`flex w-full items-center gap-3 rounded-xl p-2 text-left transition ${
                                                selected?.id === user.id
                                                    ? "bg-gold-50"
                                                    : "bg-alice-blue/60 hover:bg-alice-blue"
                                            }`}
                                        >
                                            <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-gray-100 bg-white text-xs font-bold text-navy">
                                                {user.name.charAt(0).toUpperCase()}
                                            </span>
                                            <span className="min-w-0 flex-1">
                                                <span className="block truncate text-xs font-semibold text-navy">
                                                    {user.name}
                                                </span>
                                                <span className="block truncate text-[11px] text-slate-gray">
                                                    {user.email || user.role}
                                                </span>
                                            </span>
                                            {selected?.id === user.id && (
                                                <LuCheck className="size-4 shrink-0 text-gold-500" />
                                            )}
                                        </button>
                                    ))
                                )}
                            </div>
                        )}

                        {selected && (
                            <p className="text-xs font-semibold text-gold-800">
                                {type === "department"
                                    ? `${department.trim() || "Department"} · ${selected.name}`
                                    : selected.name}
                            </p>
                        )}

                        {assignError && (
                            <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
                                {assignError}
                            </p>
                        )}
                        {notice && (
                            <p className="rounded-xl bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
                                {notice}
                            </p>
                        )}

                        <button
                            onClick={allocate}
                            disabled={assigning}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl btn-signin px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-95 disabled:opacity-60"
                        >
                            {assigning ? (
                                <LuLoaderCircle className="animate-spin" />
                            ) : (
                                <>
                                    <LuPlus className="size-4" /> Allocate appraisal
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {!isAdmin && (
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-2">
                        <LuClipboardCheck className="size-4 text-gold-500" />
                        <h2 className="text-sm font-bold text-navy">Your seasonal appraisals</h2>
                    </div>
                    <p className="mt-1 text-xs leading-5 text-slate-gray">
                        Complete the form when your admin allocates one. Once approved, your score
                        appears on the organisation performance screen.
                    </p>
                </div>
            )}

            {isAdmin && (
                <div className="grid grid-cols-3 divide-x divide-gray-100 rounded-2xl border border-gray-100 bg-white py-3 text-center shadow-sm">
                    {[
                        [awaiting, "Awaiting form"],
                        [toReview, "To review"],
                        [approved, "Approved"],
                    ].map(([value, label]) => (
                        <div key={label as string}>
                            <p className="text-lg font-bold text-navy">{value as number}</p>
                            <p className="text-[10px] text-slate-gray">{label as string}</p>
                        </div>
                    ))}
                </div>
            )}

            {isAdmin && (
                <div className="flex flex-wrap gap-2">
                    {FILTERS.map((option) => (
                        <button
                            key={option.key}
                            onClick={() => setFilter(option.key)}
                            className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold transition ${
                                filter === option.key
                                    ? "border-gold-300 bg-gold-50 text-gold-800"
                                    : "border-gray-200 bg-white text-slate-gray hover:bg-alice-blue"
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}

            {visible.length === 0 ? (
                <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">
                    <LuClipboardList className="mx-auto mb-2 text-2xl text-slate-300" />
                    <p className="text-sm font-bold text-navy">
                        {isAdmin ? "No appraisals here yet" : "No appraisal allocated to you"}
                    </p>
                    <p className="mt-1 text-xs text-slate-gray">
                        {isAdmin
                            ? "Allocate one above and its progress will appear here."
                            : "Your admin will allocate the next seasonal appraisal."}
                    </p>
                </div>
            ) : (
                <ul className="space-y-2.5">
                    {visible.map((item) => (
                        <li key={item._id}>
                            <Link
                                href={`${adminBase}/appraisals/${item._id}`}
                                className="block rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:border-cyan/40 hover:shadow-md"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-navy">
                                            {item.type === "department" ? item.department : item.subjectName}
                                        </p>
                                        <p className="mt-0.5 truncate text-[11px] text-slate-gray">
                                            {item.type === "department"
                                                ? `Department · lead ${item.subjectName}`
                                                : "Individual"}
                                            {" · "}
                                            {item.season} {item.seasonYear}
                                        </p>
                                    </div>
                                    {item.score != null && (
                                        <span className="shrink-0 text-sm font-bold text-gold-800">
                                            {Math.round(item.score)}%
                                        </span>
                                    )}
                                </div>
                                <div className="mt-3 flex items-center gap-2">
                                    <StatusPill status={item.status} label={item.statusLabel} />
                                    <span className="ml-auto text-[11px] font-medium text-slate-gray">
                                        {item.status === "assigned" || item.status === "rejected"
                                            ? "Complete"
                                            : item.status === "submitted"
                                              ? "Review"
                                              : "View"}
                                    </span>
                                    <LuChevronRight className="size-4 text-slate-gray" />
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
