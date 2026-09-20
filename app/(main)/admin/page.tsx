"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LuBookOpen, LuFlame, LuMessageSquare, LuUsers, LuNewspaper } from "react-icons/lu";
import RequireAuth from "@/components/RequireAuth";
import { useAuth } from "@/components/AuthProvider";

const tools = [
    {
        href: "/admin/magazines",
        icon: LuNewspaper,
        title: "Magazines",
        desc: "Create, edit and publish magazines and seasonal study guides.",
    },
    {
        href: "/admin/streaks",
        icon: LuFlame,
        title: "Restore Streaks",
        desc: "Repair reading streaks for members.",
    },
    {
        href: "/admin/social-joins",
        icon: LuMessageSquare,
        title: "Social Joins",
        desc: "Review WhatsApp community join requests.",
    },
];

type PublicationItem = {
    status?: string;
};

type DashboardStats = {
    members: number | null;
    publications: number;
    drafts: number;
    pendingJoins: number;
};

export default function AdminPage() {
    return (
        <RequireAuth title="Admin">
            <section
                className="flex-1 px-4 py-10 md:py-14"
                style={{ background: "linear-gradient(115deg, #f5f8fb 0%, #eff5f9 60%, #f5f8fb 100%)" }}
            >
                <div className="max-w-5xl mx-auto">
                    <AdminBody />
                </div>
            </section>
        </RequireAuth>
    );
}

function AdminBody() {
    const { user } = useAuth();
    const [stats, setStats] = useState<DashboardStats>({
        members: null,
        publications: 0,
        drafts: 0,
        pendingJoins: 0,
    });

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const [s, pubsRes, joinsRes] = await Promise.all([
                    fetch("/api/stats").then((r) => r.json()),
                    fetch("/api/admin/publications").then((r) => r.json()),
                    fetch("/api/community/social-join?status=pending").then((r) => r.json()),
                ]);
                if (cancelled) return;
                const pubs = Array.isArray(pubsRes?.data) ? (pubsRes.data as PublicationItem[]) : [];
                const joins = Array.isArray(joinsRes?.data) ? joinsRes.data : [];
                setStats({
                    members:
                        typeof s?.downloads === "number" ? s.downloads : null,
                    publications: pubs.length,
                    drafts: pubs.filter((p) => p.status === "draft").length,
                    pendingJoins: joins.length,
                });
            } catch {
                // Keep empty stats if the API is unreachable.
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    if (user?.role !== "admin") {
        return (
            <div className="rounded-2xl bg-white p-8 text-center shadow-xl">
                <h1 className="text-xl font-black text-navy">Admin area</h1>
                <p className="mt-2 text-sm text-slate-gray max-w-md mx-auto">
                    This area is for Relate admins. Your account doesn&apos;t have admin access — if you believe that&apos;s a mistake, contact the team.
                </p>
            </div>
        );
    }

    const cards = [
        {
            label: "Members",
            value: stats.members === null ? "—" : String(stats.members),
            icon: LuUsers,
            trend: "from Relate app",
        },
        {
            label: "Publications",
            value: String(stats.publications),
            icon: LuBookOpen,
            trend: "magazines & guides",
        },
        {
            label: "Drafts",
            value: String(stats.drafts),
            icon: LuNewspaper,
            trend: "unpublished",
        },
        {
            label: "Join requests",
            value: String(stats.pendingJoins),
            icon: LuMessageSquare,
            trend: "awaiting review",
        },
    ];

    return (
        <>
            <div className="mb-8">
                <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-cyan">Admin Console</p>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-navy">Relate tools</h1>
                <p className="mt-1 text-sm text-slate-gray">Manage magazines, streaks and community requests.</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
                {tools.map((t) => (
                    <Link
                        key={t.href}
                        href={t.href}
                        className="group rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                        <div className="mb-3 flex size-11 items-center justify-center rounded-full bg-alice-blue text-navy ring-1 ring-navy/10">
                            <t.icon className="text-xl" />
                        </div>
                        <h2 className="font-bold text-navy">{t.title}</h2>
                        <p className="mt-1 text-xs text-slate-gray leading-relaxed">{t.desc}</p>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {cards.map((s) => (
                    <div key={s.label} className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-[11px] uppercase tracking-widest text-slate-gray">{s.label}</p>
                            <s.icon className="text-cyan" />
                        </div>
                        <p className="text-2xl font-black text-navy mt-1">{s.value}</p>
                        <p className="text-xs text-slate-gray mt-0.5">{s.trend}</p>
                    </div>
                ))}
            </div>
        </>
    );
}