"use client";

import { useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import { AdminHeader, Badge, Button } from "@/components/admin/ui";
import { LuFlame, LuSearch, LuX, LuHistory } from "react-icons/lu";

type Member = {
    id: string;
    name: string;
    email: string;
    prayerStreak: number;
    readingStreak: number;
};

type DetailData = {
    user: { id: string; name: string; email: string };
    prayerStreak: number;
    prayerDayCount: number;
    prayerRecentDays: string[];
    readingStreak: number;
    readingDayCount: number;
    readingRecentDays: string[];
};

type LogItem = {
    _id: string;
    section: string;
    itemTitle: string;
    actorName: string;
    userName: string;
    createdAt: string;
};

type RestoreTarget = {
    userId: string;
    name: string;
    section: "prayer" | "reading";
    current: number;
};

export default function AdminStreaksPage() {
    return (
        <RequireAuth title="Restore Streaks">
            <section
                className="flex-1 px-4 py-10 md:py-14"
                style={{ background: "linear-gradient(115deg, #f5f8fb 0%, #eff5f9 60%, #f5f8fb 100%)" }}
            >
                <div className="max-w-5xl mx-auto">
                    <StreaksBody />
                </div>
            </section>
        </RequireAuth>
    );
}

function StreaksBody() {
    const [query, setQuery] = useState("");
    const [members, setMembers] = useState<Member[] | null>(null);
    const [searchMsg, setSearchMsg] = useState("");
    const [detail, setDetail] = useState<DetailData | null>(null);
    const [target, setTarget] = useState<RestoreTarget | null>(null);
    const [targetValue, setTargetValue] = useState("");
    const [busy, setBusy] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [logs, setLogs] = useState<LogItem[] | null>(null);

    const search = async (e?: React.FormEvent) => {
        e?.preventDefault();
        setError("");
        setSuccess("");
        const q = query.trim();
        if (q.length < 2) return;
        setMembers(null);
        setSearchMsg("");
        try {
            const res = await fetch(`/api/admin/streaks?search=${encodeURIComponent(q)}`);
            const json = await res.json();
            if (!res.ok) {
                setSearchMsg(typeof json?.error === "string" ? json.error : "Search failed.");
                setMembers([]);
                return;
            }
            setMembers(Array.isArray(json?.data) ? json.data : []);
            if (Array.isArray(json?.data) && json.data.length === 0) {
                setSearchMsg(`No members match "${q}".`);
            }
        } catch {
            setSearchMsg("Search failed. Try again.");
            setMembers([]);
        }
    };

    const showDetail = async (id: string) => {
        setError("");
        try {
            const res = await fetch(`/api/admin/streaks?userId=${encodeURIComponent(id)}`);
            const json = await res.json();
            if (!res.ok) {
                setError(typeof json?.error === "string" ? json.error : "Couldn't load member.");
                return;
            }
            setDetail(json?.data ?? null);
        } catch {
            setError("Couldn't load member details.");
        }
    };

    const loadLogs = async () => {
        setError("");
        if (logs) {
            setLogs(null);
            return;
        }
        try {
            const res = await fetch("/api/admin/streaks?logs=1");
            const json = await res.json();
            if (!res.ok) {
                setError(typeof json?.error === "string" ? json.error : "Couldn't load logs.");
                return;
            }
            setLogs(Array.isArray(json?.data) ? json.data : []);
        } catch {
            setError("Couldn't load logs.");
        }
    };

    const openRestore = (m: Member, section: "prayer" | "reading") => {
        setTarget({
            userId: m.id,
            name: m.name,
            section,
            current: section === "prayer" ? m.prayerStreak : m.readingStreak,
        });
        setTargetValue(String(section === "prayer" ? m.prayerStreak : m.readingStreak));
        setError("");
        setSuccess("");
    };

    const doRestore = async () => {
        if (!target) return;
        const n = Number(targetValue);
        if (!Number.isInteger(n) || n < 0 || n > 3650) {
            setError("Target must be a whole number between 0 and 3650.");
            return;
        }
        setBusy(target.userId);
        setError("");
        setSuccess("");
        try {
            const res = await fetch("/api/admin/streaks", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    userId: target.userId,
                    [target.section === "prayer" ? "prayerStreak" : "readingStreak"]: n,
                }),
            });
            const json = await res.json();
            if (!res.ok) {
                setError(typeof json?.error === "string" ? json.error : "Restore failed.");
                return;
            }
            setSuccess(`${target.section === "prayer" ? "Prayer" : "Reading"} streak set to ${n} day${n === 1 ? "" : "s"} for ${target.name}.`);
            setTarget(null);
            // Refresh results (and detail panel, if open) to show the new value.
            if (detail && detail.user.id === target.userId) void showDetail(target.userId);
            if (members) {
                setMembers((prev) =>
                    (prev ?? []).map((m) =>
                        m.id === target.userId
                            ? {
                                ...m,
                                [target.section === "prayer" ? "prayerStreak" : "readingStreak"]: n,
                            }
                            : m,
                    ),
                );
            }
            setLogs(null);
        } catch {
            setError("Restore failed. Try again.");
        } finally {
            setBusy(null);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl p-5 md:p-7">
            <AdminHeader
                eyebrow="Members"
                title="Restore Streaks"
                sub="Repair reading or prayer streaks when a member loses theirs by mistake."
                actions={
                    <div className="flex flex-wrap items-center gap-3">
                        <form onSubmit={search} className="relative">
                            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search members…"
                                className="w-56 rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/20 transition"
                            />
                        </form>
                        <Button variant="ghost" onClick={loadLogs}>
                            <LuHistory className="text-sm" /> {logs ? "Hide logs" : "Recent restores"}
                        </Button>
                    </div>
                }
            />

            {success && <p className="mb-4 rounded-lg bg-emerald-50 text-emerald-700 text-sm px-4 py-2.5">{success}</p>}
            {error && <p className="mb-4 rounded-lg bg-red-50 text-red-600 text-sm px-4 py-2.5">{error}</p>}

            {logs && (
                <div className="mb-6 rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="border-b border-gray-100 bg-alice-blue/60 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-slate-gray">
                        Recent streak restores
                    </div>
                    <ul className="divide-y divide-gray-50 text-sm">
                        {logs.length === 0 && <li className="px-4 py-3 text-slate-gray">No restores yet.</li>}
                        {logs.map((l) => (
                            <li key={l._id} className="px-4 py-2.5 flex items-center justify-between gap-4">
                                <span className="text-gray-700">
                                    <span className="font-semibold text-navy capitalize">{l.section}</span> {l.itemTitle.toLowerCase().replace(/^prayer |^reading /, "")}
                                    <span className="text-gray-400"> · for {l.userName}</span>
                                </span>
                                <span className="text-xs text-gray-400 shrink-0">
                                    {l.actorName} · {new Date(l.createdAt).toLocaleDateString(undefined, {month: "short", day: "numeric"})}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="overflow-x-auto rounded-2xl border border-gray-100">
                <table className="w-full min-w-[640px] text-left text-sm">
                    <thead>
                        <tr className="border-b border-gray-100 text-[11px] uppercase tracking-widest text-slate-gray bg-alice-blue/60">
                            <th className="px-4 py-3 font-semibold">Member</th>
                            <th className="px-4 py-3 font-semibold">Prayer streak</th>
                            <th className="px-4 py-3 font-semibold">Reading streak</th>
                            <th className="px-4 py-3 text-right font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(members ?? []).map((m) => (
                            <tr key={m.id} className="border-b border-gray-50 last:border-0 hover:bg-alice-blue/40 transition-colors">
                                <td className="px-4 py-3.5">
                                    <span className="font-semibold text-navy">{m.name}</span>
                                    <div className="text-xs text-gray-400">{m.email}</div>
                                </td>
                                <td className="px-4 py-3.5">
                                    <span className="inline-flex items-center gap-1.5 font-semibold text-navy">
                                        <LuFlame className={m.prayerStreak > 0 ? "text-amber-500" : "text-gray-300"} />
                                        {m.prayerStreak} days
                                    </span>
                                </td>
                                <td className="px-4 py-3.5">
                                    <span className="inline-flex items-center gap-1.5 font-semibold text-navy">
                                        <LuFlame className={m.readingStreak > 0 ? "text-amber-500" : "text-gray-300"} />
                                        {m.readingStreak} days
                                    </span>
                                </td>
                                <td className="px-4 py-3.5 text-right whitespace-nowrap">
                                    <button
                                        onClick={() => openRestore(m, "prayer")}
                                        disabled={busy === m.id}
                                        className="rounded-lg bg-navy px-3 py-1.5 text-xs font-semibold text-white hover:bg-navy-soft transition disabled:opacity-40"
                                    >
                                        Restore prayer
                                    </button>
                                    <button
                                        onClick={() => openRestore(m, "reading")}
                                        disabled={busy === m.id}
                                        className="ml-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-alice-blue transition disabled:opacity-40"
                                    >
                                        Restore reading
                                    </button>
                                    <button
                                        onClick={() => showDetail(m.id)}
                                        className="ml-2 text-xs font-semibold text-cyan hover:text-cyan-dark transition"
                                    >
                                        Detail
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {members !== null && members.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-4 py-10 text-center text-sm text-slate-gray">
                                    {searchMsg}
                                </td>
                            </tr>
                        )}
                        {members === null && (
                            <tr>
                                <td colSpan={4} className="px-4 py-10 text-center text-sm text-slate-gray">
                                    {searchMsg || "Search for a member by name or email to get started."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {detail && (
                <div className="mt-6 rounded-2xl border border-gray-100 p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-navy">{detail.user.name}</h3>
                        <button onClick={() => setDetail(null)} aria-label="Close details" className="text-gray-400 hover:text-gray-600">
                            <LuX />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="rounded-xl bg-orange-50 border border-orange-100 px-4 py-3">
                            <p className="text-[11px] uppercase tracking-widest text-orange-500">Prayer</p>
                            <p className="text-lg font-bold text-gray-800">{detail.prayerStreak} day streak · {detail.prayerDayCount} total logged</p>
                            <p className="text-xs text-gray-500 mt-1">Recent: {detail.prayerRecentDays.join(", ") || "none"}</p>
                        </div>
                        <div className="rounded-xl bg-cyan-50 border border-cyan-100 px-4 py-3">
                            <p className="text-[11px] uppercase tracking-widest text-cyan">Reading</p>
                            <p className="text-lg font-bold text-gray-800">{detail.readingStreak} day streak · {detail.readingDayCount} total logged</p>
                            <p className="text-xs text-gray-500 mt-1">Recent: {detail.readingRecentDays.join(", ") || "none"}</p>
                        </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                        <Button variant="accent" onClick={() => setTarget({
                            userId: detail.user.id,
                            name: detail.user.name,
                            section: "prayer",
                            current: detail.prayerStreak,
                        })}>
                            Restore prayer
                        </Button>
                        <Button variant="ghost" onClick={() => setTarget({
                            userId: detail.user.id,
                            name: detail.user.name,
                            section: "reading",
                            current: detail.readingStreak,
                        })}>
                            Restore reading
                        </Button>
                    </div>
                </div>
            )}

            {target && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 p-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-navy">Restore {target.section} streak</h3>
                            <button onClick={() => setTarget(null)} aria-label="Close" className="text-gray-400 hover:text-gray-600">
                                <LuX />
                            </button>
                        </div>
                        <p className="text-sm text-slate-gray mb-1">Member</p>
                        <p className="font-semibold text-navy mb-4">{target.name}</p>
                        <label className="block text-[11px] font-semibold uppercase tracking-widest text-slate-gray mb-1.5">
                            Target days
                        </label>
                        <input
                            type="number"
                            min={0}
                            max={3650}
                            value={targetValue}
                            onChange={(e) => setTargetValue(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 shadow-sm outline-none transition focus:border-cyan focus:ring-2 focus:ring-cyan/20"
                        />
                        <p className="mt-2 text-xs text-gray-400">Backfills the last {targetValue || "0"} days of completed {target.section} activity for this member.</p>
                        <div className="mt-5 flex items-center justify-end gap-2">
                            <Button variant="ghost" onClick={() => setTarget(null)} disabled={busy === target.userId}>Cancel</Button>
                            <Button onClick={doRestore} disabled={busy === target.userId}>
                                {busy === target.userId ? "Restoring…" : "Restore"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <p className="mt-4 text-xs text-gray-400">
                Streak history is computed from the member&apos;s logs. Done in the admin — the change is permanent.
            </p>
        </div>
    );
}