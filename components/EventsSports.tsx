"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { LuChevronRight, LuLoaderCircle } from "react-icons/lu";
import { useClubs } from "@/lib/useClubs";
import { useSports } from "@/lib/useSports";

type RelateEvent = {
  _id: string;
  title: string;
  date?: string;
  time?: string;
  location?: string;
  description?: string;
  clubSlug?: string;
};

const dayOf = (iso?: string) => {
  if (!iso) return { day: "", month: "" };
  const d = new Date(`${iso}T00:00:00`);
  return {
    day: d.toLocaleDateString("en-GB", { day: "numeric" }),
    month: d.toLocaleDateString("en-GB", { month: "short" }),
  };
};

export default function EventsSports() {
  const { find } = useClubs();
  const { sports: catalog, loading: sportsLoading, error: sportsError } = useSports();
  const [events, setEvents] = useState<RelateEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/community/events");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const list = Array.isArray(json) ? json : json?.data;
        if (!Array.isArray(list) || list.length === 0) throw new Error("empty");
        if (alive) {
          setEvents(
            list
              .map((e: Record<string, unknown>) => ({
                _id: String(e._id ?? e.id ?? Math.random()),
                title: String(e.title ?? "Relate Event"),
                date: String(e.date ?? e.starts_at ?? "").slice(0, 10),
                time: e.time ? String(e.time) : undefined,
                location: e.location ? String(e.location) : undefined,
                description: e.description ? String(e.description) : undefined,
                clubSlug: e.clubSlug ? String(e.clubSlug) : undefined,
              }))
              .filter((e: RelateEvent) => e.date)
              .slice(0, 8),
          );
          setLive(true);
        }
      } catch {
        if (alive)
          setError(
            "The events feed couldn't be loaded — check your connection and try again.",
          );
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const upcoming = useMemo(
    () =>
      [...events]
        .sort(
          (a, b) =>
            new Date(`${a.date}T00:00:00`).getTime() -
            new Date(`${b.date}T00:00:00`).getTime(),
        )
        .slice(0, 4),
    [events],
  );

  const clubOf = (slug?: string) => find(slug);

  return (
    <section className="reveal bg-white px-6 py-24 md:px-4 md:py-32">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan mb-2">
              Events &amp; Sports
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-navy">
              Don&rsquo;t miss what&rsquo;s next
            </h2>
            <p className="text-[15px] text-navy/70 mt-2">
              {live ? (
                <span className="inline-flex items-center gap-2">
                  <span className="relative flex size-2 shrink-0">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-cyan" />
                  </span>
                  Live from the Relate community.
                </span>
              ) : (
                "Games, meetups and community days — everyone's welcome."
              )}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Free to attend", "Everyone welcome", "New events every week"].map(
                (chip) => (
                  <span
                    key={chip}
                    className="inline-flex items-center gap-1.5 rounded-full border border-cyan/40 bg-cyan/10 px-3 py-1.5 text-xs font-semibold text-navy"
                  >
                    <span
                      className="size-1.5 rounded-full bg-cyan"
                      aria-hidden={true}
                    />
                    {chip}
                  </span>
                ),
              )}
            </div>
          </div>
          <div className="flex items-center gap-5">
            {loading && (
              <span className="flex items-center gap-1.5 text-sm text-navy/60">
                <LuLoaderCircle className="animate-spin" /> Loading…
              </span>
            )}
            <Link
              href="/events"
              className="link-chevron"
            >
              View all events
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-3 bg-alice-blue rounded-2xl p-5">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-cyan mb-4">
              Upcoming Events
            </p>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-16 bg-gray-200 animate-pulse rounded-lg"
                  />
                ))}
              </div>
            ) : error ? (
              <p role="alert" className="text-sm text-red-700 p-3">
                {error}
              </p>
            ) : upcoming.length === 0 ? (
              <p className="text-sm text-slate-gray p-3">
                New events land every week — check back soon or open the full
                calendar.
              </p>
            ) : (
              <div className="space-y-3">
                {upcoming.map((e) => {
                  const { day, month } = dayOf(e.date);
                  const club = clubOf(e.clubSlug);
                  return (
                    <Link
                      key={e._id}
                      href="/events"
                      className="flex items-start gap-4 p-3 rounded-xl bg-white border border-gray-200 hover:border-cyan/50 hover:shadow-md transition-all"
                    >
                      <div className="shrink-0 w-14 text-center bg-cyan text-navy rounded-lg py-2">
                        <p className="text-[10px] leading-tight uppercase">
                          {month}
                        </p>
                        <p className="text-lg font-bold leading-none">{day}</p>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-gray-800">
                          {e.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                          {e.description}
                        </p>
                        <p className="text-[11px] mt-1">
                          <span
                            className="inline-block size-1.5 rounded-full mr-1"
                            style={{ backgroundColor: club?.color ?? "#13c5dd" }}
                          />
                          <span className="text-slate-gray">
                            {club?.name ?? "Relate"}
                            {e.location ? ` · ${e.location}` : ""}
                            {e.time ? ` · ${e.time}` : ""}
                          </span>
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <div className="lg:col-span-2 rounded-2xl border border-gray-200 p-5 flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-cyan">
                Sports Teams
              </p>
              <Link
                href="/sports"
                className="text-[13px] font-semibold text-cyan inline-flex min-h-11 items-center hover:underline"
              >
                Explore sports
              </Link>
            </div>
            <p className="mb-4 text-[13px] leading-relaxed text-navy/70">
              Play for a Relate team — all skill levels welcome, only 4 spots
              per position.
            </p>
            <div className="space-y-3 flex-1">
              {sportsError && (
                <p role="alert" className="text-xs text-red-700">
                  {sportsError}
                </p>
              )}
              {sportsLoading && !sportsError && (
                <p className="text-xs text-gray-400">Loading teams…</p>
              )}
              {!sportsLoading &&
                !sportsError &&
                (catalog?.sports ?? []).map((sport) => (
                <Link
                  key={sport}
                  href={`/sports#${sport.toLowerCase()}`}
                  className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 hover:border-cyan/50 hover:bg-alice-blue px-3.5 py-3 transition-colors"
                >
                  <div>
                    <p className="text-sm font-semibold text-navy">{sport}</p>
                    <p className="text-[11px] text-slate-gray">
                      {(catalog?.teamsForSport(sport) ?? [])
                        .map((t) => t.initials)
                        .join(" · ")}
                    </p>
                  </div>
                  <LuChevronRight className="text-cyan shrink-0" />
                </Link>
              ))}
            </div>
            <Link
              href="/events/clubs"
              className="mt-4 block text-center text-sm font-semibold text-navy bg-alice-blue hover:bg-cyan/20 py-2.5 rounded-lg transition-colors"
            >
              Club events →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}