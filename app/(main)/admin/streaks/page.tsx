"use client";

import { useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import { AdminHeader, Badge } from "@/components/admin/ui";
import { LuFlame, LuSearch } from "react-icons/lu";

type Member = {
    id: string;
    name: string;
    club: string;
    streak: number;
    lastRead: string;
    flag: "healthy" | "at-risk" | "broken";
};

/* Demo data — swap for GET /api/admin/streaks when the backend is linked. */
const DEMO_MEMBERS: Member[] = [
    { id: "m1", name: "Thandi Mokoena", club: "Pulse", streak: 21, lastRead: "Today · Psalm 23", flag: "healthy" },
    { id: "m2", name: "Tino B.", club: "Surge", streak: 5, lastRead: "Yesterday · Mark 4", flag: "healthy" },
    { id: "m3", name: "Rudo N.", club: "Anchor", streak: 0, lastRead: "12 days ago · Genesis 1", flag: "broken" },
    { id: "m4", name: "Kudzai M.", club: "Sprout", streak: 2, lastRead: "3 days ago · Ruth 1", flag: "at-risk" },
];

const FLAG_TONES: Record<Member["flag"], "green" | "amber" | "slate"> = {
    healthy: "green",
    "at-risk": "amber",
    broken: "slate",
};

export default function AdminStreaksPage() {
    return (
        <RequireAuth title="Restore Streaks">
            <section
                className="flex-1 px-4 py-10 md:py-14"
                style={{ background: "linear-gradient(115deg, #151f3a 0%, #1d2a4d 60%, #2a4070 100%)" }}
            >
                <div className="max-w-5xl mx-auto">
                    <StreaksBody />
                </div>
            </section>
        </RequireAuth>
    );
}

function StreaksBody() {
    const [members, setMembers] = useState(DEMO_MEMBERS);
    const [query, setQuery] = useState("");
    const [busy, setBusy] = useState<string | null>(null);

    const restore = (id: string) => {
        setBusy(id);
        setMembers((prev) =>
            prev.map((m) => (m.id === id ? { ...m, streak: Math.max(m.streak, 1), flag: "healthy", lastRead: "Restored today" } : m)),
        );
        setTimeout(() => setBusy(null), 300);
    };

    const visible = members.filter((m) => m.name.toLowerCase().includes(query.toLowerCase()));

    return (
        <div className="bg-white rounded-2xl shadow-xl p-5 md:p-7">
            <AdminHeader
                eyebrow="Members"
                title="Restore Streaks"
                sub="Repair reading streaks when a member loses theirs by mistake."
                actions={
                    <div className="relative">
                        <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search members…"
                            className="w-56 rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/20 transition"
                        />
                    </div>
                }
            />

            <div className="overflow-x-auto rounded-2xl border border-gray-100">
                <table className="w-full min-w-[560px] text-left text-sm">
                    <thead>
                        <tr className="border-b border-gray-100 text-[11px] uppercase tracking-widest text-slate-gray bg-alice-blue/60">
                            <th className="px-4 py-3 font-semibold">Member</th>
                            <th className="px-4 py-3 font-semibold">Club</th>
                            <th className="px-4 py-3 font-semibold">Streak</th>
                            <th className="hidden px-4 py-3 font-semibold md:table-cell">Last read</th>
                            <th className="px-4 py-3 text-right font-semibold">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visible.map((m) => (
                            <tr key={m.id} className="border-b border-gray-50 last:border-0 hover:bg-alice-blue/40 transition-colors">
                                <td className="px-4 py-3.5">
                                    <span className="font-semibold text-navy">{m.name}</span>
                                </td>
                                <td className="px-4 py-3.5 text-gray-600">{m.club}</td>
                                <td className="px-4 py-3.5">
                                    <span className="inline-flex items-center gap-1.5 font-semibold text-navy">
                                        <LuFlame className={m.streak > 0 ? "text-amber-500" : "text-gray-300"} />
                                        {m.streak} days
                                    </span>
                                    <div className="mt-1"><Badge tone={FLAG_TONES[m.flag]}>{m.flag === "at-risk" ? "At risk" : m.flag === "broken" ? "Broken" : "Healthy"}</Badge></div>
                                </td>
                                <td className="hidden px-4 py-3.5 text-gray-500 md:table-cell">{m.lastRead}</td>
                                <td className="px-4 py-3.5 text-right">
                                    <button
                                        onClick={() => restore(m.id)}
                                        disabled={busy === m.id || m.flag === "healthy"}
                                        className="rounded-lg bg-navy px-3 py-1.5 text-xs font-semibold text-white hover:bg-navy-soft transition disabled:opacity-40"
                                    >
                                        Restore
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {visible.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-gray">
                                    No members match "{query}".
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <p className="mt-4 text-xs text-gray-400">
                Demo data shown — hooks for <code className="text-navy">/api/admin/streaks</code> are marked in the code.
            </p>
        </div>
    );
}
