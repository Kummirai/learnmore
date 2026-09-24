"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  LuArrowRight,
  LuCalendar,
  LuClock,
  LuLoaderCircle,
  LuMapPin,
} from "react-icons/lu";
import HeroCarousel, { type HeroSlide } from "@/components/HeroCarousel";
import { CLUBS, SUB_CLUBS } from "@/constants/relate";

const EVENT_SLIDES: HeroSlide[] = [
  {
    title: "Weekly clubs for every age",
    shortTitle: "Clubs",
    description:
      "Sprout classes, Surge nights and Pulse meetups — free and open to all.",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=80&auto=format",
    accent: "#13c5dd",
    cta: { href: "/events/clubs", label: "Club events" },
    secondary: { href: "/events", label: "All events" },
  },
  {
    title: "Worship & prayer nights",
    shortTitle: "Worship",
    description:
      "Surge fire nights, testimonies and evening prayer, together.",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1600&q=80&auto=format",
    accent: "#f59e0b",
    cta: { href: "/prayer", label: "Prayer times" },
    secondary: { href: "/events", label: "All events" },
  },
  {
    title: "Match days & league",
    shortTitle: "Matchdays",
    description:
      "Football, netball and volleyball fixtures on the Relate grounds.",
    image:
      "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1600&q=80&auto=format",
    accent: "#4caf50",
    cta: { href: "/sports", label: "Sports teams" },
    secondary: { href: "https://wa.me/27782677436", label: "Join a team" },
  },
  {
    title: "Family gatherings",
    shortTitle: "Family",
    description:
      "Family tables, socials, camps and seasonal celebrations.",
    image:
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1600&q=80&auto=format",
    accent: "#f97316",
    cta: { href: "/events/clubs", label: "Club events" },
    secondary: { href: "/events", label: "All events" },
  },
];

export type RelateEventAgendaItem = {
  time?: string;
  title: string;
  description?: string;
  location?: string;
  host?: string;
  category?: string;
  timeFrom?: string;
  timeTo?: string;
};

export type RelateEventDetail = {
  label: string;
  value: string;
};

export type RelateEvent = {
  _id: string;
  title?: string;
  date?: string;
  dateTo?: string;
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
  capacity?: number;
  host?: string;
  tags?: string[];
  agenda?: RelateEventAgendaItem[];
  notes?: string;
  details?: RelateEventDetail[];
  hasRsvpd?: boolean;
};

export const EVENTS_ENDPOINT = "/api/community/events";

export const seedEvents: RelateEvent[] = [
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

export const clubOf = (slug?: string) =>
  SUB_CLUBS.find((c) => c.slug === slug) ?? CLUBS.find((c) => c.slug === slug);

export const parentOf = (slug?: string) => {
  const sub = SUB_CLUBS.find((c) => c.slug === slug);
  const parentSlug = sub?.parentSlug ?? slug;
  return CLUBS.find((c) => c.slug === parentSlug) ?? CLUBS.find((c) => c.slug === slug);
};

export const formatLongDate = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-ZA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const formatShortDate = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export async function fetchEvents(): Promise<RelateEvent[]> {
  try {
    const res = await fetch(EVENTS_ENDPOINT);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const list = Array.isArray(json) ? json : json?.data;
    if (!Array.isArray(list) || list.length === 0) throw new Error("empty");
    return list.map((e: Record<string, unknown>) => ({
      _id: String(e._id ?? e.id ?? Math.random()),
      title: String(e.title ?? "Relate Event"),
      date: String(e.date ?? e.starts_at ?? "").slice(0, 10),
      dateTo: e.dateTo ? String(e.dateTo).slice(0, 10) : undefined,
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
      capacity:
        typeof e.capacity === "number" ? e.capacity : undefined,
      host: e.host ? String(e.host) : undefined,
      tags: Array.isArray(e.tags)
        ? e.tags.map((t) => String(t))
        : undefined,
      notes: e.notes ? String(e.notes) : undefined,
      agenda: Array.isArray(e.agenda)
        ? e.agenda.map((a: Record<string, unknown>) => ({
            time: a.time ? String(a.time) : undefined,
            title: String(a.title ?? ""),
            description: a.description ? String(a.description) : undefined,
            location: a.location ? String(a.location) : undefined,
            host: a.host ? String(a.host) : undefined,
            category: a.category ? String(a.category) : undefined,
            timeFrom: a.timeFrom ? String(a.timeFrom) : undefined,
            timeTo: a.timeTo ? String(a.timeTo) : undefined,
          }))
        : undefined,
      details: Array.isArray(e.details)
        ? e.details.map((d: Record<string, unknown>) => ({
            label: String(d.label ?? ""),
            value: String(d.value ?? ""),
          }))
        : undefined,
      hasRsvpd: Boolean(e.hasRsvpd),
    }));
  } catch {
    return seedEvents;
  }
}

const dateKey = (iso?: string) => (iso ? new Date(`${iso}T23:59:59`).getTime() : 0);
const isUpcoming = (iso?: string) => dateKey(iso) >= Date.now();

export function EventCard({ event }: { event: RelateEvent }) {
  const club = clubOf(event.clubSlug);
  const gradient = club?.color
    ? `linear-gradient(135deg, ${club.color}, ${club.colorDark})`
    : "linear-gradient(135deg, #16213E, #0891B2)";

  return (
    <article className="group flex flex-col">
      <div className="relative h-56 rounded-2xl overflow-hidden">
        {event.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
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
          <span className="flex items-center gap-3">
            {event.fee && (
              <span className="text-sm font-semibold text-navy">{event.fee}</span>
            )}
            <Link
              href={`/events/${event._id}`}
              aria-label={`View details for ${event.title ?? "this event"}`}
              title="View details"
              className="text-cyan hover:text-cyan-dark transition-colors"
            >
              <LuArrowRight className="text-lg" />
            </Link>
          </span>
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
      const list = await fetchEvents();
      if (alive) {
        setEvents(list);
        setLive(list !== seedEvents);
        setLoading(false);
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
      <HeroCarousel slides={EVENT_SLIDES} />
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
