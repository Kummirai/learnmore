"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  LuArrowRight,
  LuChevronRight,
  LuIdCard,
  LuLoaderCircle,
  LuRefreshCw,
  LuShieldCheck,
  LuUsers,
} from "react-icons/lu";
import { useClubs } from "@/lib/useClubs";
import { useSports } from "@/lib/useSports";

type Membership = {
  name?: string;
  clubSlug?: string;
  clubName?: string;
  reference?: string;
  age?: number | string;
  status?: string;
};

type MyRegistration = {
  id: string;
  teamId: string;
  teamName: string;
  clubSlug: string;
  clubName: string;
  sport?: string;
  position: string;
  positionCode: string;
  status: "active" | "waitlist";
  order?: number;
  createdAt?: string;
};

type Phase = "loading" | "error" | "no-membership" | "on-team" | "picker";

/** Sprout stores one membership but plays in age-class teams. */
function effectiveClubSlug(membership: Membership): string {
  const slug = membership.clubSlug ?? "";
  if (slug !== "sprout") return slug;
  const age = Number(membership.age);
  if (!Number.isFinite(age)) return "sprout";
  if (age <= 8) return "sprout-kids";
  if (age <= 12) return "sprout-tweens";
  if (age <= 16) return "sprout-teens";
  return "sprout";
}

function formatDate(value?: string): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * The team half of "Join a club → join a team": a signed-in visitor must hold
 * an active Membership ID before picking a squad, and one member holds one
 * team seat at a time.
 */
export default function JoinTeamGate() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [membership, setMembership] = useState<Membership | null>(null);
  const [mine, setMine] = useState<MyRegistration | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const load = async (url: string) => {
      const res = await fetch(url, { cache: "no-store" });
      if (res.status === 401 || res.status === 404) return null;
      if (!res.ok) throw new Error(`request failed (${res.status})`);
      const json = await res.json().catch(() => null);
      return json?.data ?? null;
    };

    Promise.all([load("/api/club-join/me"), load("/api/sports/registrations/mine")])
      .then(([membershipData, registrationData]) => {
        if (cancelled) return;
        const m = membershipData as Membership | null;
        const active = m && m.reference && m.status !== "graduated" ? m : null;
        if (!active) {
          setPhase("no-membership");
          return;
        }
        setMembership(active);
        const reg = registrationData as MyRegistration | null;
        if (reg) {
          setMine(reg);
          setPhase("on-team");
        } else {
          setPhase("picker");
        }
      })
      .catch(() => {
        if (!cancelled) setPhase("error");
      });

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  if (phase === "loading") {
    return (
      <section className="flex-1 bg-white px-4 py-24">
        <div className="mx-auto flex max-w-xl items-center justify-center gap-3 text-sm text-slate-gray">
          <LuLoaderCircle className="animate-spin text-2xl" />
          Checking your membership…
        </div>
      </section>
    );
  }

  if (phase === "error") {
    return (
      <section className="flex-1 bg-white px-4 py-16">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto mb-5 grid size-16 place-items-center rounded-full bg-red-50">
            <LuRefreshCw className="text-3xl text-red-600" />
          </div>
          <h1 className="mb-3 text-3xl font-black tracking-tight text-navy">
            Something went wrong
          </h1>
          <p className="mb-6 text-sm text-slate-gray">
            We couldn&rsquo;t check your membership and team status just now.
            Check your connection and try again.
          </p>
          <button
            type="button"
            onClick={() => {
              setPhase("loading");
              setAttempt((n) => n + 1);
            }}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg btn-signin px-6 text-sm font-bold text-white transition-colors hover:brightness-95"
          >
            <LuRefreshCw /> Try again
          </button>
        </div>
      </section>
    );
  }

  if (phase === "no-membership") {
    return (
      <section className="flex-1 bg-white px-4 py-16">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto mb-5 grid size-16 place-items-center rounded-full bg-gold-100">
            <LuIdCard className="text-3xl text-gold-700" />
          </div>
          <h1 className="mb-3 text-3xl font-black tracking-tight text-navy">
            Join a club first
          </h1>
          <p className="mb-6 text-sm text-slate-gray">
            Every Relate team player holds a Membership ID. Join a club to get
            yours — it takes a minute — then come back and pick your team.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/join"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg btn-signin px-6 text-sm font-bold text-white transition-colors hover:brightness-95"
            >
              Join a club <LuArrowRight />
            </Link>
            <Link
              href="/sports"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-alice-blue px-6 text-sm font-bold text-navy transition-colors hover:bg-blue-soft"
            >
              All teams
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (phase === "on-team" && mine) {
    const onSheet = mine.status === "active";
    return (
      <section className="flex-1 bg-white px-4 py-12 md:py-16">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto mb-5 grid size-16 place-items-center rounded-full bg-blue-soft">
            <LuShieldCheck className="text-3xl text-blue" />
          </div>
          <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.2em] text-blue">
            Relate · Join a team
          </p>
          <h1 className="mb-3 text-3xl font-black tracking-tight text-navy">
            You&rsquo;re already on {mine.teamName || "a team"}
          </h1>
          <p className="mb-6 text-sm text-slate-gray">
            One member, one team — your squad spot is set, so there&rsquo;s no
            second team to join. Open the team page for the full squad sheet.
          </p>

          <div className="mx-auto mb-6 max-w-md rounded-2xl bg-alice-blue p-5 text-left shadow-[0_6px_22px_rgba(11,25,44,0.08)]">
            <dl className="divide-y divide-line/70 text-sm">
              {membership?.reference ? (
                <div className="flex items-center justify-between gap-3 pb-3">
                  <dt className="text-slate-gray">Membership ID</dt>
                  <dd className="font-bold tracking-wide text-navy">
                    {membership.reference}
                  </dd>
                </div>
              ) : null}
              <div className="flex items-center justify-between gap-3 py-3">
                <dt className="text-slate-gray">Team</dt>
                <dd className="text-right font-semibold text-navy">
                  {mine.clubName
                    ? `${mine.teamName} · ${mine.clubName}`
                    : mine.teamName}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3 py-3">
                <dt className="text-slate-gray">Position</dt>
                <dd className="text-right font-semibold text-navy">
                  {mine.position} ({mine.positionCode})
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3 py-3">
                <dt className="text-slate-gray">Status</dt>
                <dd
                  className={`font-semibold ${
                    onSheet ? "text-emerald-700" : "text-gold-700"
                  }`}
                >
                  {onSheet ? "Active in the squad" : `Waitlist #${mine.order ?? "—"}`}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3 pt-3">
                <dt className="text-slate-gray">Joined</dt>
                <dd className="font-semibold text-navy">
                  {formatDate(mine.createdAt)}
                </dd>
              </div>
            </dl>
          </div>

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={`/sports/${mine.teamId}`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg btn-signin px-6 text-sm font-bold text-white transition-colors hover:brightness-95"
            >
              Open my team <LuArrowRight />
            </Link>
            <Link
              href="/sports"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-alice-blue px-6 text-sm font-bold text-navy transition-colors hover:bg-blue-soft"
            >
              All teams
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return <TeamPicker membership={membership} />;
}

function TeamPicker({ membership }: { membership: Membership | null }) {
  const { sports, loading, error } = useSports();
  const { find } = useClubs();
  const clubSlug = membership ? effectiveClubSlug(membership) : "";
  const club = find(clubSlug);
  const clubName = club?.name ?? membership?.clubName ?? "your club";
  const teams = sports ? sports.teamsForClub(clubSlug) : [];

  return (
    <section className="flex-1 bg-white px-4 py-12 md:py-16">
      <div className="mx-auto max-w-2xl">
        <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.2em] text-blue">
          Relate · Join a team
        </p>
        <h1 className="text-3xl font-black tracking-tight text-navy md:text-4xl">
          Pick your team
        </h1>
        <p className="mt-2 text-sm text-slate-gray">
          You&rsquo;re a {clubName} member — choose a squad and register as a
          player.
        </p>

        {loading && !sports ? (
          <div className="mt-10 flex items-center gap-2 text-sm text-slate-gray">
            <LuLoaderCircle className="animate-spin" /> Loading teams…
          </div>
        ) : error || !sports ? (
          <div className="mt-8 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
            The squad catalogue could not be loaded. Reload the page to try
            again.
          </div>
        ) : teams.length === 0 ? (
          <div className="mt-8 rounded-2xl bg-alice-blue px-6 py-10 text-center shadow-[0_6px_22px_rgba(11,25,44,0.08)]">
            <LuUsers className="mx-auto mb-2 text-2xl text-slate-gray" />
            <p className="text-sm font-semibold text-navy">No teams yet</p>
            <p className="mt-1 text-sm text-slate-gray">
              {clubName} doesn&rsquo;t have a team right now — check back soon,
              or browse every Relate squad.
            </p>
            <Link
              href="/sports"
              className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg btn-signin px-5 text-sm font-bold text-white transition-colors hover:brightness-95"
            >
              Browse all teams <LuArrowRight />
            </Link>
          </div>
        ) : (
          <ul className="mt-8 space-y-3">
            {teams.map((team) => {
              const teamClub = find(team.clubSlug);
              return (
                <li key={team.id}>
                  <Link
                    href={`/sports/${team.id}/register`}
                    className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_26px_rgba(11,25,44,0.10)]"
                  >
                    <span
                      className="grid size-11 shrink-0 place-items-center rounded-xl text-xs font-black text-white"
                      style={{
                        background: `linear-gradient(135deg, ${teamClub?.color ?? "#13c5dd"}, ${teamClub?.colorDark ?? "#0B192C"})`,
                      }}
                    >
                      {team.initials}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-navy">
                          {team.name}
                        </span>
                        <span className="rounded-full bg-alice-blue px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-gray">
                          {team.sport}
                        </span>
                      </span>
                      <span className="mt-0.5 block truncate text-sm text-slate-gray">
                        {team.tagline}
                      </span>
                    </span>
                    <LuChevronRight className="shrink-0 text-slate-gray transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
