"use client";

import {useCallback, useEffect, useState} from "react";
import Link from "next/link";
import {
    LuArrowRight,
    LuHandHeart,
    LuLifeBuoy,
    LuMessageSquare,
} from "react-icons/lu";
import {ADMIN_NAV} from "@/components/admin/nav";

type Count = number | null;

const QUEUES = [
    {href: "/admin/volunteers", label: "Volunteer requests", icon: LuHandHeart},
    {href: "/admin/help-requests", label: "Help requests", icon: LuLifeBuoy},
    {href: "/admin/social-joins", label: "Social joins", icon: LuMessageSquare},
] as const;

const QUEUE_HREFS = new Set<string>(QUEUES.map((q) => q.href));

/** Admin-only endpoints with no dashboard screen yet — found during the audit. */
const PENDING_ADMIN_AREAS = [
    "School grant applications",
    "Sponsorships & banking details",
    "Facilitator applications",
    "Broadcast notifications",
];

export default function AdminDashboardPage() {
    const [counts, setCounts] = useState<Record<string, Count>>({});
    const [totals, setTotals] = useState<{
        publications: Count;
        drafts: Count;
        members: Count;
    }>({
        publications: null,
        drafts: null,
        members: null,
    });

    const load = useCallback(async (signal?: AbortSignal) => {
        /** Fetches a count, tolerating both {count} and bare-array endpoints. */
        const safe = async (url: string): Promise<Count> => {
            try {
                const res = await fetch(url, {signal, cache: "no-store"});
                if (!res.ok) return null;
                const json = await res.json().catch(() => null);
                if (typeof json?.count === "number") return json.count;
                if (Array.isArray(json)) return json.length;
                if (Array.isArray(json?.data)) return json.data.length;
                return null;
            } catch {
                return null;
            }
        };

        /** Drafts need the status, so this one keeps the rows instead of the count. */
        const listPubs = async (): Promise<{status?: string}[] | null> => {
            try {
                const res = await fetch("/api/admin/publications", {signal, cache: "no-store"});
                if (!res.ok) return null;
                const json = await res.json().catch(() => null);
                if (Array.isArray(json)) return json;
                if (Array.isArray(json?.data)) return json.data;
                return null;
            } catch {
                return null;
            }
        };

        const [volunteers, help, social, members, pubs] = await Promise.all([
            safe("/api/admin/volunteers?status=new&countOnly=1"),
            safe("/api/help-requests?status=open&countOnly=1"),
            safe("/api/community/social-join?status=pending&countOnly=1"),
            safe("/api/admin/club-join?status=active&countOnly=1"),
            listPubs(),
        ]);

        setCounts({volunteers, help, social});
        setTotals({
            publications: pubs ? pubs.length : null,
            drafts: pubs ? pubs.filter((p) => p.status === "draft").length : null,
            members,
        });
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            await load(controller.signal);
        })();
        return () => controller.abort();
    }, [load]);

    const queueFor = (href: string): Count => {
        if (href === "/admin/volunteers") return counts.volunteers ?? null;
        if (href === "/admin/help-requests") return counts.help ?? null;
        if (href === "/admin/social-joins") return counts.social ?? null;
        return null;
    };

    const pendingTotal = QUEUES.reduce<number>(
        (sum, q) => sum + (queueFor(q.href) ?? 0),
        0,
    );

    return (
        <div>
            <div className="mb-7">
                <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.2em] text-cyan">
                    Relate World
                </p>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-navy">Dashboard</h1>
                <p className="mt-1 text-sm text-slate-gray">
                    {pendingTotal > 0
                        ? `${pendingTotal} item${pendingTotal === 1 ? "" : "s"} waiting on you.`
                        : "Nothing is waiting on you right now."}
                </p>
            </div>

            {/* Queue summary — the thing an admin checks first */}
            <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-3">
                {QUEUES.map((q) => {
                    const count = queueFor(q.href);
                    const Icon = q.icon;
                    return (
                        <Link
                            key={q.href}
                            href={q.href}
                            className="group rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                        >
                            <div className="mb-2 flex items-center justify-between">
                                <Icon className="text-xl text-cyan"/>
                                {typeof count === "number" && count > 0 ? (
                                    <span className="rounded-full bg-cyan px-2 py-0.5 text-[10px] font-black text-navy">
                                        {count}
                                    </span>
                                ) : null}
                            </div>
                            <p className="text-xl font-black text-navy">
                                {count === null ? "—" : count}
                            </p>
                            <p className="text-xs text-slate-gray">{q.label}</p>
                        </Link>
                    );
                })}
            </div>

            {/* Content snapshot */}
            <div className="mb-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                    <p className="text-[11px] uppercase tracking-widest text-slate-gray">
                        Members
                    </p>
                    <p className="mt-1 text-2xl font-black text-navy">
                        {totals.members === null ? "—" : totals.members}
                    </p>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                    <p className="text-[11px] uppercase tracking-widest text-slate-gray">
                        Publications
                    </p>
                    <p className="mt-1 text-2xl font-black text-navy">
                        {totals.publications === null ? "—" : totals.publications}
                    </p>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                    <p className="text-[11px] uppercase tracking-widest text-slate-gray">Drafts</p>
                    <p className="mt-1 text-2xl font-black text-navy">
                        {totals.drafts === null ? "—" : totals.drafts}
                    </p>
                </div>
            </div>

            {/* Full tool list, straight from the nav config */}
            <div className="space-y-6">
                {ADMIN_NAV.filter((g) => g.heading !== "Overview").map((group) => (
                    <section key={group.heading}>
                        <h2 className="mb-2 text-[11px] font-medium uppercase tracking-[0.2em] text-gray-400">
                            {group.heading}
                        </h2>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {group.items.map((item) => {
                                const Icon = item.icon;
                                const count = QUEUE_HREFS.has(item.href) ? queueFor(item.href) : null;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="group flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                                    >
                                        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-alice-blue text-navy ring-1 ring-navy/10">
                                            <Icon className="text-lg"/>
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="flex items-center gap-2">
                                                <span className="font-bold text-navy">{item.label}</span>
                                                {typeof count === "number" && count > 0 ? (
                                                    <span className="rounded-full bg-cyan px-1.5 py-0.5 text-[10px] font-black text-navy">
                                                        {count}
                                                    </span>
                                                ) : null}
                                            </span>
                                            <span className="mt-0.5 block text-xs leading-relaxed text-slate-gray">
                                                {item.description}
                                            </span>
                                        </span>
                                        <LuArrowRight className="mt-1 shrink-0 text-slate-gray opacity-0 transition group-hover:opacity-100"/>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>
                ))}
            </div>

            {/* Admin APIs that exist but have no dashboard page yet. Kept visible
                so the gap is tracked rather than silently forgotten. */}
            <section className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-alice-blue/40 p-5">
                <h2 className="text-[11px] font-medium uppercase tracking-[0.2em] text-gray-400">
                    Not in the dashboard yet
                </h2>
                <p className="mt-1 text-xs text-slate-gray">
                    These backends are live and admin-only, but still have no screen here.
                </p>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {PENDING_ADMIN_AREAS.map((a) => (
                        <li
                            key={a}
                            className="rounded-xl border border-gray-100 bg-white px-3.5 py-2.5 text-sm text-slate-gray"
                        >
                            {a}
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}
