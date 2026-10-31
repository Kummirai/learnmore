"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminHeader, Badge, Button, Card } from "@/components/admin/ui";
import { PORTAL_YEARS, milestoneKey } from "@/lib/programming-portal";
import { LuCheck, LuChevronDown, LuLoaderCircle, LuSearch } from "react-icons/lu";

type Row = {
    userId: string;
    name: string;
    email: string;
    milestones: string[];
    approvedCount: number;
    updatedAt: string | null;
};

export default function AdminProgrammingPage() {
    return (
        <section
            className="flex-1 px-4 py-10 md:py-14"
            style={{ background: "linear-gradient(115deg, #f5f8fb 0%, #eff5f9 60%, #f5f8fb 100%)" }}
        >
            <div className="max-w-6xl mx-auto">
                <ProgrammingBody />
            </div>
        </section>
    );
}

function ProgrammingBody() {
    const [rows, setRows] = useState<Row[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [query, setQuery] = useState("");
    const [openId, setOpenId] = useState<string | null>(null);
    const [busyKey, setBusyKey] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch("/api/admin/programming-portal");
                const json = await res.json();
                if (!res.ok) throw new Error(json?.error || "Failed to load");
                if (!cancelled) setRows(Array.isArray(json.data) ? json.data : []);
            } catch (e) {
                if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return rows;
        return rows.filter(
            (r) => r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q),
        );
    }, [rows, query]);

    async function toggle(row: Row, year: number, id: string, approved: boolean) {
        const key = `${row.userId}:${milestoneKey(year, id)}`;
        if (busyKey) return;
        setBusyKey(key);
        setError("");
        const previous = row.milestones;
        const next = approved
            ? [...previous, milestoneKey(year, id)]
            : previous.filter((m) => m !== milestoneKey(year, id));
        setRows((all) =>
            all.map((r) =>
                r.userId === row.userId
                    ? { ...r, milestones: next, approvedCount: next.length }
                    : r,
            ),
        );
        try {
            const res = await fetch("/api/admin/programming-portal", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: row.userId, milestone: { year, id, approved } }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json?.error || "Failed to save");
            const saved: string[] = json?.data?.milestones ?? next;
            setRows((all) =>
                all.map((r) =>
                    r.userId === row.userId
                        ? { ...r, milestones: saved, approvedCount: saved.length }
                        : r,
                ),
            );
        } catch (e) {
            setRows((all) =>
                all.map((r) =>
                    r.userId === row.userId
                        ? { ...r, milestones: previous, approvedCount: previous.length }
                        : r,
                ),
            );
            setError(e instanceof Error ? e.message : "Failed to save");
        } finally {
            setBusyKey(null);
        }
    }

    return (
        <>
            <AdminHeader
                eyebrow="Skills"
                title="Programming Portal"
                sub="Approve capstone milestones for the Sprout Tweens 4-year website curriculum."
                actions={
                    <Badge tone="sky">
                        {rows.reduce((sum, r) => sum + r.approvedCount, 0)} approved
                    </Badge>
                }
            />

            {error ? (
                <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                    {error}
                </p>
            ) : null}

            <Card className="mb-4">
                <label className="relative block">
                    <LuSearch className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-gray" />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by name or email"
                        className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-cyan"
                    />
                </label>
            </Card>

            {loading ? (
                <p className="flex items-center gap-2 text-sm text-slate-gray">
                    <LuLoaderCircle className="size-4 animate-spin" /> Loading portal progress…
                </p>
            ) : filtered.length === 0 ? (
                <Card>
                    <p className="text-sm text-slate-gray">
                        No portal activity yet. Students appear here once they open the curriculum.
                    </p>
                </Card>
            ) : (
                <div className="space-y-3">
                    {filtered.map((row) => {
                        const open = openId === row.userId;
                        return (
                            <Card key={row.userId} className="!p-0 overflow-hidden">
                                <button
                                    type="button"
                                    onClick={() => setOpenId(open ? null : row.userId)}
                                    aria-expanded={open}
                                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate font-bold text-navy">{row.name}</p>
                                        <p className="truncate text-xs text-slate-gray">{row.email}</p>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-3">
                                        <Badge tone={row.approvedCount >= 16 ? "gold" : "slate"}>
                                            {row.approvedCount}/16 milestones
                                        </Badge>
                                        <LuChevronDown
                                            className={`size-4 text-slate-gray transition-transform ${open ? "rotate-180" : ""}`}
                                        />
                                    </div>
                                </button>

                                {open ? (
                                    <div className="grid gap-4 border-t border-gray-100 bg-alice-blue/40 p-5 md:grid-cols-2">
                                        {PORTAL_YEARS.map((year) => (
                                            <div key={year.year}>
                                                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.15em] text-cyan">
                                                    Year {year.year} · {year.title}
                                                </p>
                                                <ul className="space-y-1.5">
                                                    {year.milestones.map((m) => {
                                                        const key = milestoneKey(year.year, m.id);
                                                        const approved = row.milestones.includes(key);
                                                        const busy = busyKey === `${row.userId}:${key}`;
                                                        return (
                                                            <li
                                                                key={key}
                                                                className="flex items-start justify-between gap-3 rounded-lg bg-white px-3 py-2"
                                                            >
                                                                <div className="min-w-0">
                                                                    <p className="text-sm font-semibold text-navy">
                                                                        {m.title}
                                                                    </p>
                                                                    <p className="text-xs text-slate-gray">{m.brief}</p>
                                                                </div>
                                                                <Button
                                                                    variant={approved ? "accent" : "ghost"}
                                                                    onClick={() => toggle(row, year.year, m.id, !approved)}
                                                                    disabled={busy}
                                                                    className="shrink-0 !min-h-9 !px-3 !py-1.5 text-xs"
                                                                >
                                                                    {busy ? (
                                                                        <LuLoaderCircle className="size-3.5 animate-spin" />
                                                                    ) : approved ? (
                                                                        <>
                                                                            <LuCheck className="size-3.5" /> Approved
                                                                        </>
                                                                    ) : (
                                                                        "Approve"
                                                                    )}
                                                                </Button>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                ) : null}
                            </Card>
                        );
                    })}
                </div>
            )}
        </>
    );
}
