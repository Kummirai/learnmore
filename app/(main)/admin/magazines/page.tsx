"use client";

import { useState } from "react";
import Link from "next/link";
import { LuPlus } from "react-icons/lu";
import RequireAuth from "@/components/RequireAuth";
import { Badge, AdminHeader } from "@/components/admin/ui";

type Row = {
    id: string;
    title: string;
    series: string;
    club: string;
    season: string;
    status: "published" | "draft";
    updated: string;
};

/* Demo data — swap for GET /api/admin/publications when the backend is linked. */
const DEMO_ROWS: Row[] = [
    { id: "footsteps", title: "Footsteps — Spring 2026", series: "Footsteps", club: "Surge", season: "Spring 2026 · Sep 1 – Nov 30", status: "published", updated: "Sep 12, 2026" },
    { id: "rooted", title: "Rooted — Spring 2026", series: "Rooted", club: "Sprout", season: "Spring 2026 · Sep 1 – Nov 2026", status: "published", updated: "Sep 10, 2026" },
    { id: "footsteps-summer", title: "Footsteps — Summer 2026", series: "Footsteps", club: "Surge", season: "Summer 2026 · Dec 1 – Feb 28", status: "draft", updated: "Sep 15, 2026" },
    { id: "rooted-summer", title: "Rooted — Summer 2026", series: "Rooted", club: "Sprout", season: "Summer 2026 · Dec 1 – Feb 28", status: "draft", updated: "Sep 14, 2026" },
];

export default function AdminMagazinesPage() {
    return (
        <RequireAuth title="Magazines">
            <section
                className="flex-1 px-4 py-10 md:py-14"
                style={{ background: "linear-gradient(115deg, #f5f8fb 0%, #eff5f9 60%, #f5f8fb 100%)" }}
            >
                <div className="max-w-5xl mx-auto">
                    <MagazinesBody />
                </div>
            </section>
        </RequireAuth>
    );
}

function MagazinesBody() {
    const [rows, setRows] = useState<Row[]>(DEMO_ROWS);
    const [filter, setFilter] = useState<"" | "published" | "draft">("");
    const [busy, setBusy] = useState<string | null>(null);

    const visible = filter ? rows.filter((r) => r.status === filter) : rows;

    const toggle = (id: string) => {
        setBusy(id);
        setRows((prev) =>
            prev.map((r) => (r.id === id ? { ...r, status: r.status === "published" ? "draft" : "published" } : r)),
        );
        setTimeout(() => setBusy(null), 300);
    };

    const remove = (row: Row) => {
        if (!confirm(`Delete "${row.title}"? This cannot be undone.`)) return;
        setBusy(row.id);
        setRows((prev) => prev.filter((r) => r.id !== row.id));
        setTimeout(() => setBusy(null), 300);
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl p-5 md:p-7">
            <AdminHeader
                eyebrow="Library"
                title="Magazines"
                sub="Drafts and published issues, newest first."
                actions={
                    <>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value as typeof filter)}
                            className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700"
                        >
                            <option value="">All statuses</option>
                            <option value="published">Published</option>
                            <option value="draft">Drafts</option>
                        </select>
                        <Link
                            href="/admin/magazines/new"
                            className="inline-flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-soft transition"
                        >
                            <LuPlus /> New magazine
                            {/* Backend hook: POST /api/admin/publications */}
                        </Link>
                    </>
                }
            />

            <div className="overflow-x-auto rounded-2xl border border-gray-100">
                <table className="w-full min-w-[640px] text-left text-sm">
                    <thead>
                        <tr className="border-b border-gray-100 text-[11px] uppercase tracking-widest text-slate-gray bg-alice-blue/60">
                            <th className="px-4 py-3 font-semibold">Publication</th>
                            <th className="px-4 py-3 font-semibold">Club</th>
                            <th className="hidden px-4 py-3 font-semibold md:table-cell">Season</th>
                            <th className="px-4 py-3 font-semibold">Status</th>
                            <th className="px-4 py-3 text-right font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visible.map((row) => (
                            <tr key={row.id} className="border-b border-gray-50 last:border-0 hover:bg-alice-blue/40 transition-colors">
                                <td className="px-4 py-3.5">
                                    <span className="font-semibold text-navy">{row.title}</span>
                                    <div className="text-xs text-slate-gray">{row.series} · {row.id}</div>
                                </td>
                                <td className="px-4 py-3.5 text-gray-600">{row.club}</td>
                                <td className="hidden px-4 py-3.5 text-gray-500 md:table-cell">{row.season}</td>
                                <td className="px-4 py-3.5">
                                    <Badge tone={row.status === "published" ? "green" : "amber"}>
                                        {row.status === "published" ? "Published" : "Draft"}
                                    </Badge>
                                </td>
                                <td className="px-4 py-3.5">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => toggle(row.id)}
                                            disabled={busy === row.id}
                                            className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${
                                                row.status === "published"
                                                    ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                                                    : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                            }`}
                                        >
                                            {row.status === "published" ? "Unpublish" : "Publish"}
                                        </button>
                                        <button
                                            onClick={() => remove(row)}
                                            disabled={busy === row.id}
                                            className="rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {visible.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-gray">
                                    No magazines in this view. Adjust the filter or create one.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <p className="mt-4 text-xs text-gray-400">
                Demo data shown — hooks for <code className="text-navy">/api/admin/publications</code> are marked in the code.
            </p>
        </div>
    );
}
