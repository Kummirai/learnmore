"use client";

import { useEffect, useState } from "react";
import { Badge, AdminHeader, Select } from "@/components/admin/ui";
import { LuUserPlus } from "react-icons/lu";

type Status = "pending_interview" | "accepted" | "rejected";
type Filter = "all" | Status;

type Application = {
  _id: string;
  clubSlug: string;
  clubName: string;
  teamId?: string;
  teamName?: string;
  sport?: string;
  name: string;
  age: number;
  gender?: string;
  phone?: string;
  area?: string;
  guardian?: { name: string; phone: string };
  parentConsent?: boolean;
  conduct?: {
    alcohol?: string;
    smoking?: string;
    drugs?: string;
    sexualActivity?: string;
  };
  commitmentAccepted?: boolean;
  clubGatheringAccepted?: boolean;
  status: Status;
  note?: string;
  reviewedAt?: string;
  createdAt?: string;
};

const STATUS_LABELS: Record<Status, string> = {
  pending_interview: "Pending interview",
  accepted: "Accepted",
  rejected: "Rejected",
};

const YES_NO: Record<string, string> = { yes: "Yes", no: "No" };

function yesNo(value: string | undefined): string {
  return YES_NO[value ?? ""] ?? "—";
}

function dateText(value?: string): string {
  if (!value) return "unknown date";
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? "unknown date"
    : d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function AdminClubJoinsPage() {
  return (
<section
  className="flex-1 px-4 py-10 md:py-14"
  style={{ background: "linear-gradient(115deg, #f5f8fb 0%, #eff5f9 60%, #f5f8fb 100%)" }}
>
  <div className="max-w-5xl mx-auto">
    <ClubJoinsBody />
  </div>
</section>
  );
}

async function fetchApplications(status: Filter): Promise<Application[]> {
  const query = status === "all" ? "" : `?status=${status}`;
  const res = await fetch(`/api/admin/club-join${query}`);
  const json = await res.json();
  if (!res.ok) {
    throw new Error(typeof json?.error === "string" ? json.error : "Couldn't load applications.");
  }
  return Array.isArray(json?.data) ? json.data : [];
}

function ClubJoinsBody() {
  const [applications, setApplications] = useState<Application[] | null>(null);
  const [filter, setFilter] = useState<Filter>("pending_interview");
  const [processing, setProcessing] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = async (status: Filter) => {
    try {
      setApplications(await fetchApplications(status));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't reach the API. Is the backend up?");
      setApplications([]);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchApplications(filter);
        if (cancelled) return;
        setApplications(data);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Couldn't reach the API. Is the backend up?");
        setApplications([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [filter]);

  const decide = async (item: Application, action: "accept" | "reject") => {
    setProcessing(item._id);
    setError("");
    try {
      const res = await fetch(`/api/admin/club-join/${item._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        setError(typeof json?.error === "string" ? json.error : "Couldn't update this application.");
        return;
      }
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
        eyebrow="Sports & Chaplaincy"
        title="Club Joins"
        sub="Review sports registration applications and decide after the chaplain interview."
        actions={
          <Select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)}>
            <option value="pending_interview">Pending interview</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="all">All</option>
          </Select>
        }
      />

      {error && <p className="mb-4 rounded-lg bg-red-50 text-red-600 text-sm px-4 py-2.5">{error}</p>}

      {applications !== null && applications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-alice-blue/40 py-12 text-center">
          <LuUserPlus className="mx-auto text-2xl text-slate-gray mb-2" />
          <p className="text-sm text-slate-gray">
            {applications === null ? "Loading…" : `No ${filter === "all" ? "" : STATUS_LABELS[filter as Status].toLowerCase() + " "}applications.`}
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {(applications ?? []).map((item) => {
            const isMinor = item.age < 18;
            const conduct = item.conduct ?? {};
            return (
              <div key={item._id} className="rounded-2xl border border-gray-100 p-4 md:p-5 hover:shadow-sm transition-shadow">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-alice-blue text-navy font-bold text-sm">
                      {item.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-navy">{item.name}</p>
                      <p className="text-xs text-slate-gray mt-0.5">
                        {item.clubName} · {item.teamName ?? "no team"} · {item.sport ?? ""}
                        {item.area ? ` · ${item.area}` : ""} · {dateText(item.createdAt)}
                      </p>
                      <p className="text-sm text-gray-600 mt-1.5">
                        <span className="text-[11px] uppercase tracking-widest text-slate-gray mr-2">Contact</span>
                        WhatsApp {item.phone ?? "—"} · Age {item.age} · {item.gender === "male" ? "Male" : item.gender === "female" ? "Female" : "—"}
                      </p>
                    </div>
                  </div>
                  <Badge
                    tone={
                      item.status === "accepted"
                        ? "gold"
                        : item.status === "pending_interview"
                          ? "amber"
                          : "slate"
                    }
                  >
                    {STATUS_LABELS[item.status] ?? item.status}
                  </Badge>
                </div>

                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                  {isMinor && item.guardian && (
                    <div className="rounded-xl bg-alice-blue p-3">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-gray mb-1">
                        Parent / guardian
                      </p>
                      <p className="text-navy font-medium">{item.guardian.name}</p>
                      <p className="text-xs text-slate-gray">WhatsApp {item.guardian.phone}</p>
                      <p className="text-xs text-slate-gray mt-1">
                        Consent: {item.parentConsent ? "Given" : "Missing"}
                      </p>
                    </div>
                  )}
                  <div className={`rounded-xl p-3 ${isMinor ? "" : "sm:col-span-2"}`} style={{ backgroundColor: "var(--color-bg, #f8fafc)" }}>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-gray mb-1">
                      Lifestyle declaration
                    </p>
                    <ul className="space-y-0.5 text-xs text-gray-600">
                      <li>Drinks alcohol: {yesNo(conduct.alcohol)}</li>
                      <li>Smokes / vapes: {yesNo(conduct.smoking)}</li>
                      <li>Uses drugs: {yesNo(conduct.drugs)}</li>
                      {conduct.sexualActivity !== undefined && (item.clubSlug === "surge" || item.clubSlug === "pulse") ? (
                        <li>Sexually active: {yesNo(conduct.sexualActivity)}</li>
                      ) : null}
                    </ul>
                  </div>
                  <div className="rounded-xl p-3" style={{ backgroundColor: "var(--color-bg, #f8fafc)" }}>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-gray mb-1">
                      Commitment
                    </p>
                    <p className="text-xs text-gray-600">
                      Accepted community standards:{" "}
                      <span className={item.commitmentAccepted ? "text-gold-700 font-semibold" : "text-red-600 font-semibold"}>
                        {item.commitmentAccepted ? "Yes" : "No"}
                      </span>
                    </p>
                    <p className="text-xs text-gray-600">
                      Club Gathering (2nd Friday):{" "}
                      <span className={item.clubGatheringAccepted ? "text-gold-700 font-semibold" : "text-red-600 font-semibold"}>
                        {item.clubGatheringAccepted ? "Accepted" : "Not stated"}
                      </span>
                    </p>
                    {item.note && (
                      <p className="mt-2 text-xs text-slate-gray italic">Note: {item.note}</p>
                    )}
                  </div>
                </div>

                {item.status === "pending_interview" && (
                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
                    <button
                      onClick={() => decide(item, "accept")}
                      disabled={processing === item._id}
                      className="rounded-lg bg-gold-100 px-4 py-1.5 text-xs font-semibold text-gold-800 hover:bg-gold-200 transition disabled:opacity-50"
                    >
                      Accept after interview
                    </button>
                    <button
                      onClick={() => decide(item, "reject")}
                      disabled={processing === item._id}
                      className="rounded-lg bg-red-50 px-4 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}