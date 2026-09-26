"use client";

import { useEffect, useState } from "react";
import { Badge, AdminHeader, Select } from "@/components/admin/ui";
import { LuUserPlus } from "react-icons/lu";

type JoinFilter = "all" | "pending" | "approved" | "rejected";

type JoinRequest = {
    _id: string;
    name: string;
    relationship: string;
    skill: string;
    source: string;
    ageRange: string;
    phone: string | null;
    countryCode: string;
    gender: string | null;
    status: "pending" | "approved" | "rejected";
    createdAt: string;
};

const RELATIONSHIP_LABELS: Record<string, string> = {
    single: "Single",
    married: "Married",
    in_a_relationship: "In a relationship",
};

function label(item: JoinRequest): string {
    return RELATIONSHIP_LABELS[item.relationship] ?? item.relationship;
}

function dateText(value: string): string {
    const d = new Date(value);
    return Number.isNaN(d.getTime())
        ? ""
        : d.toLocaleDateString(undefined, {month: "short", day: "numeric", year: "numeric"});
}

export default function AdminSocialJoinsPage() {
    return (
  <section
      className="flex-1 px-4 py-10 md:py-14"
      style={{ background: "linear-gradient(115deg, #f5f8fb 0%, #eff5f9 60%, #f5f8fb 100%)" }}
  >
      <div className="max-w-5xl mx-auto">
          <SocialJoinsBody />
      </div>
  </section>
    );
}

async function fetchJoins(status: JoinFilter): Promise<JoinRequest[]> {
    const query = status === "all" ? "" : `?status=${status}`;
    const res = await fetch(`/api/community/social-join${query}`);
    const json = await res.json();
    if (!res.ok) {
        throw new Error(typeof json?.error === "string" ? json.error : "Couldn't load requests.");
    }
    return Array.isArray(json?.data) ? json.data : [];
}

function SocialJoinsBody() {
    const [requests, setRequests] = useState<JoinRequest[] | null>(null);
    const [filter, setFilter] = useState<JoinFilter>("pending");
    const [processing, setProcessing] = useState<string | null>(null);
    const [error, setError] = useState("");

    const load = async (status: JoinFilter) => {
        try {
            setRequests(await fetchJoins(status));
        } catch (e) {
            setError(e instanceof Error ? e.message : "Couldn't reach the API. Is the backend up?");
            setRequests([]);
        }
    };

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const data = await fetchJoins(filter);
                if (cancelled) return;
                setRequests(data);
            } catch (e) {
                if (cancelled) return;
                setError(e instanceof Error ? e.message : "Couldn't reach the API. Is the backend up?");
                setRequests([]);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [filter]);

    const setStatus = async (item: JoinRequest, action: "approve" | "reject") => {
        setProcessing(item._id);
        setError("");
        try {
            const res = await fetch(`/api/community/social-join/${item._id}`, {
                method: "PATCH",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({action}),
            });
            const json = await res.json().catch(() => null);
            if (!res.ok) {
                setError(
                    typeof json?.error === "string"
                        ? json.error
                        : action === "approve"
                            ? "Couldn't approve this request."
                            : "Couldn't reject this request.",
                );
                return;
            }
            // On success the card drops out of a "pending" view; refetch to stay exact.
            void load(filter);
        } catch {
            setError("Update failed. Try again.");
        } finally {
            setProcessing(null);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl p-5 md:p-7">
            <AdminHeader
                eyebrow="Community"
                title="Social Joins"
                sub="Review WhatsApp community join requests before approving them into club groups."
                actions={
                    <Select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)}>
                        <option value="all">All</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </Select>
                }
            />

            {error && <p className="mb-4 rounded-lg bg-red-50 text-red-600 text-sm px-4 py-2.5">{error}</p>}

            {requests !== null && requests.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-alice-blue/40 py-12 text-center">
                    <LuUserPlus className="mx-auto text-2xl text-slate-gray mb-2" />
                    <p className="text-sm text-slate-gray">
                        {requests === null ? "Loading…" : `No ${filter === "all" ? "" : filter + " "}join requests.`}
                    </p>
                </div>
            ) : (
                <div className="grid gap-3">
                    {(requests ?? []).map((r) => (
                        <div key={r._id} className="rounded-2xl border border-gray-100 p-4 md:p-5 hover:shadow-sm transition-shadow">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div className="flex items-start gap-3">
                                    <div className="flex size-10 items-center justify-center rounded-full bg-alice-blue text-navy font-bold text-sm">
                                        {r.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-navy">{r.name}</p>
                                        <p className="text-xs text-slate-gray mt-0.5">
                                            {r.ageRange} · {label(r)} · {r.gender ? `${r.gender} · ` : ""}via {r.source} · {dateText(r.createdAt) || "unknown date"}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            <span className="text-[11px] uppercase tracking-widest text-slate-gray mr-2">Skill</span>
                                            {r.skill}
                                            {r.phone ? ` · ${r.countryCode}${r.phone.replace(/^\+?(\d+)$/, "$1")}` : ""}
                                        </p>
                                    </div>
                                </div>
                                <Badge tone={r.status === "approved" ? "gold" : r.status === "pending" ? "amber" : "slate"}>
                                    {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                                </Badge>
                            </div>
                            {r.status === "pending" && (
                                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
                                    <button
                                        onClick={() => setStatus(r, "approve")}
                                        disabled={processing === r._id}
                                        className="rounded-lg bg-gold-100 px-4 py-1.5 text-xs font-semibold text-gold-800 hover:bg-gold-200 transition disabled:opacity-50"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => setStatus(r, "reject")}
                                        disabled={processing === r._id}
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
        </div>
    );
}