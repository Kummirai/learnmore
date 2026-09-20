"use client";

import Link from "next/link";
import { LuBookOpen, LuFlame, LuMessageSquare, LuUsers, LuShoppingBag, LuNewspaper } from "react-icons/lu";
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

const stats = [
    { label: "Members", value: "1 240", icon: LuUsers, trend: "+18 this week" },
    { label: "Clubs", value: "7", icon: LuBookOpen, trend: "Sprout → Nexus" },
    { label: "Store orders", value: "36", icon: LuShoppingBag, trend: "8 awaiting WhatsApp confirmation" },
    { label: "Join requests", value: "12", icon: LuMessageSquare, trend: "pending review" },
];

export default function AdminPage() {
    return (
        <RequireAuth title="Admin">
            <section
                className="flex-1 px-4 py-10 md:py-14"
                style={{ background: "linear-gradient(115deg, #151f3a 0%, #1d2a4d 60%, #2a4070 100%)" }}
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

    return (
        <>
            <div className="mb-8">
                <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-cyan">Admin Console</p>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">Relate tools</h1>
                <p className="mt-1 text-sm text-white/70">Manage magazines, streaks and community requests.</p>
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
                {stats.map((s) => (
                    <div key={s.label} className="rounded-2xl bg-white/10 border border-white/15 p-4 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-[11px] uppercase tracking-widest text-white/60">{s.label}</p>
                            <s.icon className="text-white/50" />
                        </div>
                        <p className="text-2xl font-black text-white mt-1">{s.value}</p>
                        <p className="text-xs text-white/50 mt-0.5">{s.trend}</p>
                    </div>
                ))}
            </div>
        </>
    );
}
