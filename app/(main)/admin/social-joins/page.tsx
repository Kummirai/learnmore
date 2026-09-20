"use client";

import { useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import { Badge, AdminHeader } from "@/components/admin/ui";
import { LuUserPlus } from "react-icons/lu";

type JoinRequest = {
    id: string;
    name: string;
    relationship: string;
    skill: string;
    source: string;
    ageRange: string;
    phone: string;
    gender: string;
    status: "pending" | "approved" | "rejected";
    date: string;
};

/* Demo data — swap for GET /api/admin/social-joins when the backend is linked. */
const DEMO_REQUESTS: JoinRequest[] = [
    { id: "r1", name: "Kudzai M.", relationship: "Single", skill: "Football coaching", source: "Instagram", ageRange: "16–21 yrs", phone: "+27 71 234 5678", gender: "Female", status: "pending", date: "Sep 18, 2026" },
    { id: "r2", name: "Tino B.", relationship: "Married", skill: "Sound & media", source: "WhatsApp", ageRange: "21–33 yrs", phone: "+27 82 345 6789", gender: "Male", status: "pending", date: "Sep 17, 2026" },
    { id: "r3", name: "Rudo N.", relationship: "In a relationship", skill: "Children's crafts", source: "Friend referral", ageRange: "21–33 yrs", phone: "+27 83 456 7890", gender: "Female", status: "approved", date: "Sep 15, 2026" },
    { id: "r4", name: "Farai C.", relationship: "Single", skill: "Mentoring", source: "Sunday event", ageRange: "33+ yrs", phone: "+27 84 567 8901", gender: "Male", status: "rejected", date: "Sep 14, 2026" },
];

const RELATIONSHIP_LABELS: Record<string, string> = {
    "Single": "Single",
    "Married": "Married",
    "In a relationship": "In a relationship",
};

export default function AdminSocialJoinsPage() {
    return (
        <RequireAuth title="Social Joins">
            <section
                className="flex-1 px-4 py-10 md:py-14"
                style={{ background: "linear-gradient(115deg, #f5f8fb 0%, #eff5f9 60%, #f5f8fb 100%)" }}
            >
                <div className="max-w-5xl mx-auto">
                    <SocialJoinsBody />
                </div>
            </section>
        </RequireAuth>
    );
}

function SocialJoinsBody() {
    const [requests, setRequests] = useState(DEMO_REQUESTS);
    const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
    const [processing, setProcessing] = useState<string | null>(null);

    const setStatus = (id: string, status: JoinRequest["status"]) => {
        setProcessing(id);
        setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
        setTimeout(() => setProcessing(null), 300);
    };

    const visible = requests.filter((r) => filter === "all" || r.status === filter);

    return (
        <div className="bg-white rounded-2xl shadow-xl p-5 md:p-7">
            <AdminHeader
                eyebrow="Community"
                title="Social Joins"
                sub="Review WhatsApp community join requests before approving them into club groups."
                actions={
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as typeof filter)}
                        className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700"
                    >
                        <option value="all">All</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                }
            />
            {visible.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-alice-blue/40 py-12 text-center">
                    <LuUserPlus className="mx-auto text-2xl text-slate-gray mb-2" />
                    <p className="text-sm text-slate-gray">No {filter === "all" ? "" : filter + " "}join requests.</p>
                </div>
            ) : (
                <div className="grid gap-3">
                    {visible.map((r) => (
                        <div key={r.id} className="rounded-2xl border border-gray-100 p-4 md:p-5 hover:shadow-sm transition-shadow">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div className="flex items-start gap-3">
                                    <div className="flex size-10 items-center justify-center rounded-full bg-alice-blue text-navy font-bold text-sm">
                                        {r.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-navy">{r.name}</p>
                                        <p className="text-xs text-slate-gray mt-0.5">
                                            {r.ageRange} · {r.relationship} · via {r.source} · {r.date}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            <span className="text-[11px] uppercase tracking-widest text-slate-gray mr-2">Skill</span>
                                            {r.skill} · {r.phone}
                                        </p>
                                    </div>
                                </div>
                                <Badge tone={r.status === "approved" ? "green" : r.status === "pending" ? "amber" : "slate"}>
                                    {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                                </Badge>
                            </div>
                            {r.status === "pending" && (
                                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
                                    <button
                                        onClick={() => setStatus(r.id, "approved")}
                                        disabled={processing === r.id}
                                        className="rounded-lg bg-emerald-100 px-4 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-200 transition disabled:opacity-50"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => setStatus(r.id, "rejected")}
                                        disabled={processing === r.id}
                                        className="rounded-lg bg-red-50 px-4 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition disabled:opacity-50"
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <p className="mt-4 text-xs text-gray-400">
                Demo data shown — hooks for <code className="text-navy">/api/admin/social-joins</code> are marked in the code.
            </p>
        </div>
    );
}
