"use client";

import { useEffect, useMemo, useState } from "react";
import {
  LuCalendar,
  LuClock,
  LuLoaderCircle,
  LuMapPin,
  LuUsers,
} from "react-icons/lu";
import PageHero from "@/components/PageHero";
import { CLUBS, SUB_CLUBS } from "@/constants/relate";

type RelateEvent = {
  _id: string;
  title?: string;
  date?: string;
  time?: string;
  timeTo?: string;
  location?: string;
  description?: string;
  fee?: string;
  imageUrl?: string;
  clubSlug?: string;
  category?: string;
  eyebrow?: string;
  attending?: number;
};

const EVENTS_ENDPOINT = "/api/community/events";

const seedEvents: RelateEvent[] = [
  {
    _id: "seed-netball-teens",
    title: "Relate Netball Teens Tournament",
    date: "2027-03-07",
    time: "9:00 AM",
    timeTo: "4:00 PM",
    location: "Relate Sports Grounds",
    description:
      "Join the Relate Netball Tournament — teams, friends and community all cheering together on the Relate Sports Grounds.",
    fee: "R30",
    clubSlug: "sprout-teens",
    category: "Netball",
    eyebrow: "NETBALL TOURNAMENT",
  },
];

const clubOf = (slug?: string) =>
  SUB_CLUBS.find((c) => c.slug === slug) ?? CLUBS.find((c) => c.slug === slug);

const parentOf = (slug?: string) => {
  const sub = SUB_CLUBS.find((c) => c.slug === slug);
  const parentSlug = sub?.parentSlug ?? slug;
  return CLUBS.find((c) => c.slug === parentSlug) ?? CLUBS.find((c) => c.slug === slug);
};

const formatLongDate = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-ZA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatShortDate = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const dateKey = (iso?: string) => (iso ? new Date(`${iso}T23:59:59`).getTime() : 0);
const isUpcoming = (iso?: string) => dateKey(iso) >= Date.now();

function EventCard({ event }: { event: RelateEvent }) {
  const club = clubOf(event.clubSlug);
  const parent = parentOf(event.clubSlug);
  const gradient = club?.color
    ? `linear-gradient(135deg, ${club.color}, ${club.colorDark})`
    : "linear-gradient(135deg, #16213E, #0891B2)";

  return (
    <article className="group flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-40 overflow-hidden">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title ?? "Relate event"}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: gradient }}
          >
            <LuCalendar className="text-white/40 text-6xl" />
          </div>
        )}
        <span
          className="absolute top-3 left-3 flex items-center gap-1.5 text-white text-[11px] px-2.5 py-1 rounded-full font-medium backdrop-blur"
          style={{ backgroundColor: `${club?.colorDark ?? "#0E7490"}cc` }}
        >
          <LuUsers className="text-xs" />
          {club?.name ?? (parent?.name ?? "Relate")}
        </span>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <p className="flex items-center gap-1.5 text-xs text-cyan font-semibold uppercase tracking-wide">
          <LuCalendar className="text-sm" />
          {formatShortDate(event.date)}
        </p>
        <h3 className="mt-2 text-lg font-semibold text-gray-800 leading-snug">
          {event.title}
        </h3>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
          {(event.time || event.timeTo) && (
            <span className="flex items-center gap-1.5">
              <LuClock className="text-cyan" />
              {event.time}
              {event.time && event.timeTo ? " – " : ""}
              {event.timeTo}
            </span>
          )}
          {event.location && (
            <span className="flex items-center gap-1.5">
              <LuMapPin className="text-cyan" />
              {event.location}
            </span>
          )}
        </div>

        {event.description && (
          <p className="mt-3 text-sm text-gray-500 leading-relaxed line-clamp-3 flex-1">
            {event.description}
          </p>
        )}

        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wide text-gray-400">
            {event.category ?? event.eyebrow ?? "Relate Event"}
          </span>
          {event.fee && (
            <span className="text-sm font-semibold text-navy">{event.fee}</span>
          )}
        </div>
      </div>
    </article>
  );
}

export default function EventsPage() {
  const [events, setEvents] = useState<RelateEvent[]>(seedEvents);
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(EVENTS_ENDPOINT);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const list = Array.isArray(json) ? json : json?.data;
        if (!Array.isArray(list) || list.length === 0) throw new Error("empty");
        if (alive) {
          setEvents(
            list.map((e: Record<string, unknown>) => ({
              _id: String(e._id ?? e.id ?? Math.random()),
              title: String(e.title ?? "Relate Event"),
              date: String(e.date ?? e.starts_at ?? "").slice(0, 10),
              time: e.time ? String(e.time) : undefined,
              timeTo: e.timeTo ? String(e.timeTo) : undefined,
              location: e.location ? String(e.location) : undefined,
              description: e.description ? String(e.description) : undefined,
              fee: e.fee ? String(e.fee) : undefined,
              imageUrl:
                typeof e.imageUrl === "string"
                  ? e.imageUrl
                  : typeof e.image === "string"
                    ? e.image
                    : undefined,
              clubSlug: e.clubSlug ? String(e.clubSlug) : undefined,
              category: e.category ? String(e.category) : undefined,
              eyebrow: e.eyebrow ? String(e.eyebrow) : undefined,
              attending:
                typeof e.attending === "number"
                  ? e.attending
                  : typeof e.rsvpCount === "number"
                    ? e.rsvpCount
                    : undefined,
            })),
          );
          setLive(true);
        }
      } catch {
        if (alive) setEvents(seedEvents);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const { upcoming, past } = useMemo(() => {
    const u: RelateEvent[] = [];
    const p: RelateEvent[] = [];
    for (const e of [...events].sort(
      (a, b) => dateKey(a.date) - dateKey(b.date),
    )) {
      (isUpcoming(e.date) ? u : p).push(e);
    }
    return { upcoming: u, past: p };
  }, [events]);

  const upcomingClubs = useMemo(
    () => [
      ...new Set(
        upcoming
          .map((e) => parentOf(e.clubSlug)?.slug)
          .filter((s): s is string => Boolean(s)),
      ),
    ],
    [upcoming],
  );

  return (
    <>
      <PageHero
        title="Events"
        tagline="Community · Calendars · Match days"
        description="Everything happening across the Relate community — club meetups, worship nights, match days, family gatherings and more, sorted by date."
        watermark="Events"
        chips={[
          { dot: true, label: "Weekly" },
          { dot: true, label: "Free" },
          { dot: true, label: "All clubs" },
        ]}
        meta={[
          { label: "Live", value: live ? "Backend feed" : "Sample preview" },
          { label: "Clubs", value: "7 clubs" },
          { label: "Cost", value: "Free" },
        ]}
        actions={
          <a
            href="/events/clubs"
            className="inline-flex items-center gap-2 bg-white text-navy px-6 py-3 rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors"
          >
            Browse club events →
          </a>
        }
      />
      <section className="flex-1 px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {loading && (
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
              <LuLoaderCircle className="animate-spin" />
              Loading events…
            </div>
          )}

          {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 animate-pulse rounded-2xl h-72"
              />
            ))}
          </div>
        ) : upcoming.length === 0 ? (
          <p className="text-center text-gray-500 py-16">
            No upcoming events right now — check back soon.
          </p>
        ) : (
          <>
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {upcomingClubs.map((slug) => {
                const club = CLUBS.find((c) => c.slug === slug);
                return (
                  <a
                    key={slug}
                    href={`#club-${slug}`}
                    className="text-xs font-medium text-cyan bg-white border border-cyan/30 px-3 py-1.5 rounded-full hover:bg-cyan/10 transition-colors"
                  >
                    {club?.name ?? slug}
                  </a>
                );
              })}
              {!live && (
                <span className="text-xs text-gray-400">
                  sample preview — live feed offline
                </span>
              )}
            </div>

            {upcomingClubs.map((slug) => {
              const club = CLUBS.find((c) => c.slug === slug);
              const items = upcoming.filter(
                (e) => parentOf(e.clubSlug)?.slug === slug,
              );
              if (items.length === 0) return null;
              return (
                <div
                  key={slug}
                  id={`club-${slug}`}
                  className="scroll-mt-24 mb-10"
                >
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    {club?.name ?? slug}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {items.map((e) => (
                      <EventCard key={e._id} event={e} />
                    ))}
                  </div>
                </div>
              );
            })}

            {past.length > 0 && (
              <div className="mt-12">
                <div className="flex items-center gap-3">
                  <span className="h-px flex-1 bg-gray-200" />
                  <h2 className="text-lg font-semibold text-gray-600">
                    Past Events
                  </h2>
                  <span className="h-px flex-1 bg-gray-200" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6 opacity-70">
                  {past.slice(0, 6).map((e) => (
                    <EventCard key={e._id} event={e} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        </div>
      </section>
    </>
  );
}
