"use client";

import {useCallback, useEffect, useState} from "react";
import Link from "next/link";
import {
    LuArrowRight,
    LuBriefcase,
    LuBuilding2,
    LuHandHeart,
    LuLifeBuoy,
    LuMessageSquare,
    LuShoppingBag,
} from "react-icons/lu";
import {ADMIN_NAV} from "@/components/admin/nav";

type Count = number | null;

const QUEUES = [
    {href: "/admin/volunteers", label: "Volunteer requests", icon: LuHandHeart},
    {href: "/admin/help-requests", label: "Help requests", icon: LuLifeBuoy},
    {href: "/admin/social-joins", label: "Social joins", icon: LuMessageSquare},
    {href: "/admin/services", label: "Service reviews", icon: LuBriefcase},
    {href: "/admin/offices", label: "Office applications", icon: LuBuilding2},
] as const;

const QUEUE_HREFS = new Set<string>(QUEUES.map((q) => q.href));

/** Admin-only endpoints with no dashboard screen yet — found during the audit. */
const PENDING_ADMIN_AREAS = [
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

        const [volunteers, help, social, services, offices, members, pubs] = await Promise.all([
            safe("/api/admin/volunteers?status=new&countOnly=1"),
            safe("/api/help-requests?status=open&countOnly=1"),
            safe("/api/community/social-join?status=pending&countOnly=1"),
            safe("/api/admin/club-join?status=active&countOnly=1"),
            safe("/api/community/services?status=submitted"),
            safe("/api/community/offices/applications?status=pending"),
            listPubs(),
        ]);

        setCounts({volunteers, help, social, services, offices});
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
        if (href === "/admin/services") return counts.services ?? null;
        if (href === "/admin/offices") return counts.offices ?? null;
        return null;
    };

    const hasCounts = QUEUES.some((q) => queueFor(q.href) !== null);
    const pendingTotal = QUEUES.reduce<number>(
        (sum, q) => sum + (queueFor(q.href) ?? 0),
        0,
    );

    const metrics = [
        {
            label: "Waiting on you",
            value: hasCounts ? pendingTotal : null,
            hint: "Across open queues",
            accent: pendingTotal > 0,
        },
        {label: "Members", value: totals.members, hint: "Registered accounts", accent: false},
        {label: "Publications", value: totals.publications, hint: "All magazines", accent: false},
        {label: "Drafts", value: totals.drafts, hint: "Unpublished", accent: false},
    ];

    return (
        <div>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-blue">Relate World</p>
                    <h1 className="mt-1 text-2xl font-semibold tracking-tight text-navy">Dashboard</h1>
                    <p className="mt-1 text-sm text-slate-gray">
                        {pendingTotal > 0
                            ? `${pendingTotal} item${pendingTotal === 1 ? "" : "s"} waiting on you.`
                            : hasCounts
                                ? "Nothing is waiting on you right now."
                                : "Checking the queues…"}
                    </p>
                </div>
                <Link
                    href="/admin/orders"
                    className="inline-flex h-10 items-center gap-2 rounded-lg border border-line bg-white px-4 text-sm font-medium text-navy transition hover:border-blue/40 hover:text-blue"
                >
                    <LuShoppingBag className="text-base"/> Store orders
                </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {metrics.map((metric) => (
                    <div
                        key={metric.label}
                        className={`rounded-xl border bg-white p-4 ${
                            metric.accent ? "border-blue/40" : "border-line"
                        }`}
                    >
                        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-gray">
                            {metric.label}
                        </p>
                        <p
                            className={`mt-2 text-2xl font-semibold leading-none ${
                                metric.accent ? "text-blue" : "text-navy"
                            }`}
                        >
                            {metric.value === null ? "—" : metric.value}
                        </p>
                        <p className="mt-1.5 text-[11px] text-slate-gray">{metric.hint}</p>
                    </div>
                ))}
            </div>

            {/* Queue summary — the thing an admin checks first */}
            <section className="mt-8">
                <div className="mb-2.5 flex items-end justify-between">
                    <h2 className="text-sm font-semibold text-navy">Needs your attention</h2>
                    <span className="text-xs text-slate-gray">
                        {pendingTotal > 0 ? `${pendingTotal} pending` : hasCounts ? "All clear" : ""}
                    </span>
                </div>
                <div className="overflow-hidden rounded-xl border border-line bg-white">
                    {QUEUES.map((q, index) => {
                        const count = queueFor(q.href);
                        const Icon = q.icon;
                        return (
                            <Link
                                key={q.href}
                                href={q.href}
                                className={`group flex items-center gap-3 px-4 py-3.5 transition hover:bg-alice-blue/70 ${
                                    index > 0 ? "border-t border-line" : ""
                                }`}
                            >
                                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-alice-blue text-navy">
                                    <Icon className="text-base"/>
                                </span>
                                <span className="flex-1 text-sm font-medium text-navy">{q.label}</span>
                                {count === null ? (
                                    <span className="text-xs text-slate-gray">—</span>
                                ) : count > 0 ? (
                                    <span className="rounded-full bg-blue px-2 py-0.5 text-[11px] font-semibold text-white">
                                        {count}
                                    </span>
                                ) : (
                                    <span className="text-xs text-slate-gray">Clear</span>
                                )}
                                <LuArrowRight className="text-slate-gray transition group-hover:translate-x-0.5 group-hover:text-navy"/>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* Full tool list, straight from the nav config */}
            <div className="mt-8 space-y-6">
                {ADMIN_NAV.filter((g) => g.heading !== "Overview").map((group) => (
                    <section key={group.heading}>
                        <div className="mb-2.5 flex items-end justify-between">
                            <h2 className="text-sm font-semibold text-navy">{group.heading}</h2>
                            <span className="text-xs text-slate-gray">{group.items.length} tools</span>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {group.items.map((item) => {
                                const Icon = item.icon;
                                const count = QUEUE_HREFS.has(item.href) ? queueFor(item.href) : null;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="group flex items-start gap-3 rounded-xl border border-line bg-white p-4 transition hover:border-blue/40 hover:shadow-sm"
                                    >
                                        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-alice-blue text-navy">
                                            <Icon className="text-base"/>
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-navy">{item.label}</span>
                                                {typeof count === "number" && count > 0 ? (
                                                    <span className="rounded-full bg-blue px-1.5 py-0.5 text-[10px] font-semibold text-white">
                                                        {count}
                                                    </span>
                                                ) : null}
                                            </span>
                                            <span className="mt-0.5 block text-xs leading-relaxed text-slate-gray">
                                                {item.description}
                                            </span>
                                        </span>
                                        <LuArrowRight className="mt-1 shrink-0 text-sm text-slate-gray opacity-0 transition group-hover:opacity-100"/>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>
                ))}
            </div>

            {/* Admin APIs that exist but have no dashboard page yet. Kept visible
                so the gap is tracked rather than silently forgotten. */}
            <section className="mt-8 rounded-xl border border-dashed border-line bg-alice-blue/40 p-5">
                <h2 className="text-sm font-semibold text-navy">Not in the dashboard yet</h2>
                <p className="mt-1 text-xs text-slate-gray">
                    These backends are live and admin-only, but still have no screen here.
                </p>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {PENDING_ADMIN_AREAS.map((a) => (
                        <li
                            key={a}
                            className="rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-slate-gray"
                        >
                            {a}
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}
