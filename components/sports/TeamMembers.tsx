"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LuArrowRight, LuLoaderCircle } from "react-icons/lu";

type Member = { firstName: string; joinedAt: string | null };

type State =
  | { phase: "loading" }
  | { phase: "error" }
  | { phase: "ready"; count: number; members: Member[] };

const initialsOf = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

/**
 * Members who registered for this squad — loaded client-side so the static
 * team page always shows registrations as they land (joins activate the
 * moment the form is submitted).
 */
export default function TeamMembers({
  teamId,
  clubSlug,
  teamName,
  clubName,
}: {
  teamId: string;
  clubSlug: string;
  teamName: string;
  clubName?: string;
}) {
  const [state, setState] = useState<State>({ phase: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/teams/${encodeURIComponent(teamId)}/members`, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then((res) =>
        res.ok ? res.json() : Promise.reject(new Error(String(res.status))),
      )
      .then((json) =>
        setState({
          phase: "ready",
          count: typeof json?.count === "number" ? json.count : 0,
          members: Array.isArray(json?.members) ? json.members : [],
        }),
      )
      .catch(() => {
        if (!controller.signal.aborted) setState({ phase: "error" });
      });
    return () => controller.abort();
  }, [teamId]);

  if (state.phase === "error") return null;

  return (
    <div className="mt-12">
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan mb-1">
        {clubName ?? "Relate"} · Members
      </p>
      <h2 className="text-2xl md:text-3xl font-black tracking-tight text-navy mb-2">
        Who&rsquo;s on the team
      </h2>
      <p className="text-gray-500 mt-1 text-sm max-w-2xl mb-6">
        {state.phase === "ready" && state.count > 0
          ? `${state.count} member${state.count === 1 ? "" : "s"} registered for ${teamName} — joining adds you right here.`
          : `Everyone who registers for ${teamName} lands on this list.`}
      </p>

      {state.phase === "loading" ? (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <LuLoaderCircle className="animate-spin" /> Loading members…
        </div>
      ) : state.count === 0 ? (
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-5">
          <p className="text-sm text-slate-gray flex-1">
            No members registered yet — be the first on the squad list.
          </p>
          <Link
            href={`/join?club=${encodeURIComponent(clubSlug)}&team=${encodeURIComponent(teamId)}`}
            className="shrink-0 inline-flex items-center justify-center gap-2 bg-navy text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-navy/90 transition-colors"
          >
            Join this team <LuArrowRight className="text-xs" />
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2.5">
            {state.members.map((member, i) => (
              <span
                key={`${member.firstName}-${i}`}
                className="inline-flex items-center gap-2 rounded-full border border-gray-100 bg-white px-3 py-1.5 shadow-sm"
              >
                <span className="size-6 rounded-full bg-gold-50 text-gold-700 text-[10px] font-black flex items-center justify-center">
                  {initialsOf(member.firstName)}
                </span>
                <span className="text-sm font-semibold text-navy">
                  {member.firstName}
                </span>
              </span>
            ))}
            {state.count > state.members.length && (
              <span className="inline-flex items-center rounded-full border border-gray-100 bg-gray-50 px-3 py-1.5 text-sm font-bold text-slate-gray">
                +{state.count - state.members.length} more
              </span>
            )}
          </div>
          <Link
            href={`/join?club=${encodeURIComponent(clubSlug)}&team=${encodeURIComponent(teamId)}`}
            className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-cyan hover:text-cyan-dark transition-colors"
          >
            Join this team <LuArrowRight />
          </Link>
        </>
      )}
    </div>
  );
}
