"use client";

import { useEffect, useState } from "react";
import { Badge, AdminHeader, Select } from "@/components/admin/ui";
import { LuUserPlus } from "react-icons/lu";

type Status = "active" | "pending_interview" | "accepted" | "rejected";
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
  active: "Member",
  pending_interview: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
};

const EMPTY_TEXT: Record<Filter, string> = {
  all: "No registrations yet.",
  active: "No members yet.",
  pending_interview: "No records waiting for review.",
  accepted: "No accepted records.",
  rejected: "No rejected records.",
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
  const [filter, setFilter] = useState<Filter>("all");
  const [error, setError] = useState("");

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

  return (
    <div className="bg-white rounded-2xl shadow-xl p-5 md:p-7">
      <AdminHeader
        eyebrow="Clubs & Squads"
        title="Members"
        sub="Everyone who joined a club or squad — active the moment the form is submitted. No approval step."
        actions={
          <Select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)}>
            <option value="all">All</option>
            <option value="active">Members</option>
            <option value="pending_interview">Pending (legacy)</option>
            <option value="accepted">Accepted (legacy)</option>
            <option value="rejected">Rejected</option>
          </Select>
        }
      />

      {error && <p className="mb-4 rounded-lg bg-red-50 text-red-600 text-sm px-4 py-2.5">{error}</p>}

      {applications !== null && applications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-alice-blue/40 py-12 text-center">
          <LuUserPlus className="mx-auto text-2xl text-slate-gray mb-2" />
          <p className="text-sm text-slate-gray">
            {EMPTY_TEXT[filter]}
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
                      item.status === "active" || item.status === "accepted"
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

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}