"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LuChevronRight } from "react-icons/lu";
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
  imageUrl?: string | null;
  fee?: string;
  feeAmount?: number;
  feeSymbol?: string;
};

const dayOf = (iso?: string) => {
  if (!iso) return { day: "", month: "" };
  const d = new Date(`${iso}T00:00:00`);
  return {
    day: d.toLocaleDateString("en-GB", { day: "numeric" }),
    month: d.toLocaleDateString("en-GB", { month: "short" }),
  };
};

const feeLabel = (e: RelateEvent) =>
  (e.feeAmount ?? 0) > 0
    ? `${e.feeSymbol ?? "R"}${(e.feeAmount ?? 0).toLocaleString("en-ZA")}`
    : "Free";

const featuredLine = (e: RelateEvent) => {
  const parts: string[] = [];
  if (e.date) {
    const d = new Date(`${e.date}T00:00:00`);
    parts.push(
      d.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }),
    );
  }
  if (e.time) parts.push(e.time);
  parts.push(feeLabel(e));
  return parts.join("  ·  ");
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
                imageUrl:
                  typeof e.imageUrl === "string" && e.imageUrl
                    ? e.imageUrl
                    : null,
                fee: e.fee ? String(e.fee) : "Free",
                feeAmount:
                  typeof e.feeAmount === "number" ? e.feeAmount : 0,
                feeSymbol:
                  typeof e.feeSymbol === "string" ? e.feeSymbol : "R",
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

  const featured = upcoming[0];
  const more = upcoming.slice(1);
  const featuredClub = featured ? clubOf(featured.clubSlug) : undefined;
  const featuredImg = featured
    ? featured.imageUrl || featuredClub?.heroImage || null
    : null;

  return (
    <section className="reveal bg-white px-6 py-24 md:px-4 md:py-32">
      <div className="max-w-6xl mx-auto">
        {/* Apple-style centered display head */}
        <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan">
            Events &amp; Sports
          </p>
          <h2 className="text-4xl font-semibold text-navy md:text-6xl">
            Don&rsquo;t miss what&rsquo;s next
          </h2>
          <p className="mt-4 text-base text-navy/70 md:text-lg">
            {live ? (
              <span className="inline-flex items-center justify-center gap-2">
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
          <div className="mt-6 flex flex-wrap justify-center gap-2">
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
          <div className="mt-6">
            <Link href="/events" className="link-chevron">
              View all events
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="space-y-5">
            <div className="relative overflow-hidden rounded-3xl">
              <div className="absolute inset-0 animate-pulse bg-navy-soft" />
              <div className="relative flex min-h-[440px] flex-col items-center justify-center gap-4 px-6 py-14 text-center sm:min-h-[520px]">
                <div className="h-3 w-44 rounded bg-white/15" />
                <div className="h-9 w-2/3 max-w-xl rounded bg-white/20" />
                <div className="h-4 w-1/2 max-w-md rounded bg-white/10" />
                <div className="mt-2 h-10 w-40 rounded-full bg-white/20" />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="min-h-[260px] animate-pulse rounded-2xl bg-tile"
                />
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="rounded-3xl bg-tile px-6 py-14 text-center">
            <p role="alert" className="text-sm text-red-700">
              {error}
            </p>
          </div>
        ) : !featured ? (
          <div className="rounded-3xl bg-tile px-6 py-14 text-center">
            <p className="text-base text-navy/70">
              New events land every week — check back soon.
            </p>
            <div className="mt-4">
              <Link href="/events" className="link-chevron">
                Open the full calendar
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Featured — the next event, advertised like a product */}
            <article className="relative overflow-hidden rounded-3xl">
              {featuredImg ? (
                <Image
                  src={featuredImg}
                  alt={featured.title}
                  fill
                  sizes="100vw"
                  className="absolute inset-0 size-full object-cover"
                />
              ) : (
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${featuredClub?.color ?? "#13c5dd"}, ${featuredClub?.colorDark ?? "#1d2a4d"})`,
                  }}
                />
              )}
              <div
                className="relative flex min-h-[440px] flex-col items-center justify-center px-6 py-14 text-center sm:min-h-[520px] md:py-20"
                style={{
                  textShadow:
                    "0 1px 2px rgba(21,31,58,0.95), 0 2px 14px rgba(21,31,58,0.85), 0 4px 36px rgba(21,31,58,0.6)",
                }}
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90">
                  {featuredLine(featured)}
                </p>
                <h3 className="mt-4 max-w-3xl text-3xl font-semibold text-white md:text-5xl">
                  {featured.title}
                </h3>
                {featured.description && (
                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/90 md:text-lg">
                    {featured.description}
                  </p>
                )}
                <div className="mt-7">
                  <Link
                    href={`/events/${featured._id}`}
                    className="link-chevron text-white"
                  >
                    Save your spot
                  </Link>
                </div>
              </div>
            </article>

            {more.length > 0 && (
              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {more.map((e) => {
                  const { day, month } = dayOf(e.date);
                  const club = clubOf(e.clubSlug);
                  const img = e.imageUrl || club?.heroImage || null;
                  return (
                    <Link
                      key={e._id}
                      href={`/events/${e._id}`}
                      className="group relative flex min-h-[260px] flex-col justify-end overflow-hidden rounded-2xl transition-shadow hover:shadow-lg"
                    >
                      {img ? (
                        <Image
                          src={img}
                          alt={e.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
                          className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div
                          className="absolute inset-0"
                          style={{
                            background: `linear-gradient(135deg, ${club?.color ?? "#13c5dd"}, ${club?.colorDark ?? "#1d2a4d"})`,
                          }}
                        />
                      )}
                      <div className="absolute left-3 top-3 rounded-lg bg-cyan px-2.5 py-1.5 text-center text-navy shadow-sm">
                        <p className="text-[10px] font-semibold uppercase leading-tight">
                          {month}
                        </p>
                        <p className="text-lg font-bold leading-none">{day}</p>
                      </div>
                      <span className="absolute right-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-navy shadow-sm">
                        {feeLabel(e)}
                      </span>
                      <div
                        className="relative p-4"
                        style={{
                          textShadow:
                            "0 1px 2px rgba(21,31,58,0.95), 0 2px 14px rgba(21,31,58,0.85), 0 4px 36px rgba(21,31,58,0.6)",
                        }}
                      >
                        <h3 className="text-base font-semibold text-white line-clamp-1">
                          {e.title}
                        </h3>
                        {e.description && (
                          <p className="mt-1 text-xs leading-relaxed text-white/90 line-clamp-2">
                            {e.description}
                          </p>
                        )}
                        <p className="mt-1.5 flex flex-wrap items-center gap-x-1 text-[11px] text-white/85">
                          <span
                            className="inline-block size-1.5 shrink-0 rounded-full"
                            style={{
                              backgroundColor: club?.color ?? "#13c5dd",
                            }}
                          />
                          <span>{club?.name ?? "Relate"}</span>
                          {e.location && <span>· {e.location}</span>}
                          {e.time && <span>· {e.time}</span>}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Sports — a centered product band */}
        <div className="mt-5 rounded-3xl bg-tile px-6 py-10 text-center md:px-10 md:py-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan">
            Sports Teams
          </p>
          <h3 className="mt-3 text-3xl font-semibold text-navy md:text-4xl">
            Play for a Relate team.
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-navy/70">
            All skill levels welcome — only 4 spots per position.
          </p>
          {sportsError ? (
            <p role="alert" className="mt-5 text-xs text-red-700">
              {sportsError}
            </p>
          ) : sportsLoading ? (
            <p className="mt-5 text-sm text-slate-gray">Loading teams…</p>
          ) : (
            (catalog?.sports ?? []).length > 0 && (
              <div className="mt-6 flex flex-wrap justify-center gap-2.5">
                {(catalog?.sports ?? []).map((sport) => (
                  <Link
                    key={sport}
                    href={`/sports#${sport.toLowerCase()}`}
                    className="group inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:border-cyan hover:text-cyan"
                  >
                    {sport}
                    <span className="text-[11px] font-medium text-slate-gray transition-colors group-hover:text-cyan">
                      {(catalog?.teamsForSport(sport) ?? [])
                        .map((t) => t.initials)
                        .join(" · ")}
                    </span>
                    <LuChevronRight className="size-4 shrink-0 text-cyan" />
                  </Link>
                ))}
              </div>
            )
          )}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
            <Link href="/sports" className="link-chevron">
              Explore sports
            </Link>
            <Link href="/events/clubs" className="link-chevron">
              Club events
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}