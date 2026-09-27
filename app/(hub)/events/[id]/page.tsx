"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LuArrowLeft, LuCalendar, LuChevronRight, LuLoaderCircle, LuTicket } from "react-icons/lu";
import Navbar from "@/components/Navbar";
import RsvpForm from "@/components/events/RsvpForm";
import {
  clubOf,
  EventCard,
  fetchEvents,
  formatLongDate,
  formatShortDate,
  type RelateEvent,
} from "../page";

const WHATSAPP_NUMBER = "27782677436";

export default function EventDetailPage() {
  const params = useParams<{ id: string }>();
  const id = decodeURIComponent(params.id);
  const [events, setEvents] = useState<RelateEvent[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [rsvpOpen, setRsvpOpen] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const list = await fetchEvents();
      if (alive) {
        setEvents(list);
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <section className="flex-1 px-4 py-16">
          <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-gray-400">
            <LuLoaderCircle className="animate-spin" />
            Loading event…
          </div>
        </section>
      </>
    );
  }

  const event = events?.find((e) => e._id === id) ?? null;
  const club = clubOf(event?.clubSlug);
  const others = events?.filter((e) => e._id !== id).slice(0, 4) ?? [];

  if (!event) {
    return (
      <>
        <Navbar />
        <section className="flex-1 px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-3">
              Event not found
            </h1>
            <p className="text-gray-500 mb-8">
              This event may have been removed or is no longer listed.
            </p>
            <Link
              href="/events"
              className="inline-flex min-h-11 items-center gap-2 text-cyan font-semibold text-sm hover:text-cyan-dark transition-colors"
            >
              <LuArrowLeft /> Back to all events
            </Link>
          </div>
        </section>
      </>
    );
  }

  const gradient = club?.color
    ? `linear-gradient(135deg, ${club.color}, ${club.colorDark})`
    : "linear-gradient(135deg, #16213E, #0891B2)";

  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi RelateWorld! A question about "${event.title ?? "this event"}" on ${formatShortDate(event.date)}.`,
  )}`;

  const patchEvent = (updated: RelateEvent) =>
    setEvents(
      (prev) => prev?.map((e) => (e._id === id ? { ...e, ...updated } : e)) ?? null,
    );

  const bullets = [
    event.location ? `Location: ${event.location}` : null,
    event.host ? `Hosted by ${event.host}` : null,
    club?.name ? `Organised by ${club.name}` : null,
    typeof event.capacity === "number" && typeof event.attending === "number"
      ? `${event.attending} of ${event.capacity} attending`
      : typeof event.attending === "number"
        ? `${event.attending} attending`
        : null,
  ].filter((b): b is string => Boolean(b));

  const dateMeta =
    event.date && event.dateTo
      ? `${formatShortDate(event.date)} – ${formatShortDate(event.dateTo)}`
      : event.date
        ? formatLongDate(event.date)
        : "";

  const timeMeta = (() => {
    const parts: string[] = [];
    if (event.time && event.timeTo) parts.push(`${event.time} – ${event.timeTo}`);
    else if (event.time) parts.push(event.time);
    if (event.fee) parts.push(`Entry ${event.fee}`);
    return parts.join(" · ");
  })();

  return (
    <>
      <Navbar />
      <section className="flex-1 px-4 py-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <nav
            className="flex items-center gap-1.5 text-xs text-slate-gray mb-8 flex-wrap"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-navy transition-colors">
              Home
            </Link>
            <LuChevronRight className="text-[10px]" />
            <Link href="/events" className="hover:text-navy transition-colors">
              Events
            </Link>
            <LuChevronRight className="text-[10px]" />
            <Link
              href={`/events${club?.slug ? `#club-${club.slug}` : ""}`}
              className="hover:text-navy transition-colors"
            >
              {club?.name ?? event.category ?? "Relate"}
            </Link>
            <LuChevronRight className="text-[10px]" />
            <span className="text-navy font-semibold">
              {event.title}
            </span>
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-16">
            <div className="h-[240px] sm:h-[400px] overflow-hidden">
              {event.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={event.imageUrl}
                  alt={event.title ?? "Relate event"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: gradient }}
                >
                  <LuCalendar className="text-white/40 text-7xl" />
                </div>
              )}
            </div>

            <div className="flex flex-col text-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan mb-2">
                {event.eyebrow ?? event.category ?? "Relate Event"}
                {club?.name ? ` · ${club.name}` : ""}
              </p>
              <h2 className="text-3xl font-black tracking-tight text-navy mb-1">
                {event.title}
              </h2>

              {dateMeta && (
                <>
                  <div className="mt-5 flex items-baseline gap-2.5">
                    <p className="text-2xl font-black text-navy tracking-tight">
                      {dateMeta}
                    </p>
                  </div>
                  {timeMeta && (
                    <p className="text-[11px] text-slate-gray mt-0.5">
                      {timeMeta}
                    </p>
                  )}
                </>
              )}

              {event.description && (
                <p className="text-gray-600 leading-relaxed mt-5">
                  {event.description}
                </p>
              )}

              {bullets.length > 0 && (
                <>
                  <p className="text-base font-bold text-navy mt-6 mb-2">
                    Event details
                  </p>
                  <ul className="space-y-2 list-none">
                    {bullets.map((b) => (
                      <li key={b} className="flex gap-2 items-start text-gray-600">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {event.tags && event.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-5">
                  {event.tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs font-medium text-cyan bg-white border border-cyan/30 px-3 py-1 rounded-full"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {event.details && event.details.length > 0 && (
                <div className="mt-6 border-t border-gray-100 pt-5">
                  <p className="text-base font-bold text-navy mb-3">More info</p>
                  <dl className="space-y-3">
                    {event.details.map((d) => (
                      <div
                        key={d.label}
                        className="flex flex-col sm:flex-row sm:items-baseline"
                      >
                        <dt className="w-28 sm:w-44 shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-gray">
                          {d.label}
                        </dt>
                        <dd className="min-w-0 text-gray-700">{d.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setRsvpOpen((o) => !o)}
                  className={`flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg font-bold transition-colors ${
                    event.hasRsvpd
                      ? "bg-gold-700 text-white hover:bg-gold-800"
                      : "bg-cyan text-white hover:bg-cyan-dark"
                  }`}
                >
                  <LuTicket className="text-lg" />
                  {event.hasRsvpd
                    ? "You're going ✓"
                    : rsvpOpen
                      ? "Hide the RSVP form"
                      : "RSVP for this event"}
                </button>
                <Link
                  href="/events"
                  className="flex-1 inline-flex items-center justify-center px-6 py-3.5 rounded-lg font-bold border-2 border-navy text-navy hover:bg-navy hover:text-white transition-colors"
                >
                  Browse all events
                </Link>
              </div>
              <p className="text-xs text-slate-gray mt-3">
                RSVPs are confirmed in your app. Questions?{" "}
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-navy transition-colors"
                >
                  WhatsApp the team
                </a>
                .
              </p>

              {rsvpOpen && (
                <div className="mt-5">
                  <RsvpForm
                    event={event}
                    eventId={id}
                    onUpdated={patchEvent}
                    onClose={() => setRsvpOpen(false)}
                  />
                </div>
              )}
            </div>
          </div>

          {event.agenda && event.agenda.length > 0 && (
            <div className="max-w-4xl mb-16">
              <p className="text-xl font-bold text-navy mb-5">Schedule</p>
              <ol className="space-y-5">
                {event.agenda.map((a, idx) => (
                  <li key={idx} className="flex gap-4">
                    <span className="w-24 shrink-0 text-right text-sm font-bold text-cyan pt-0.5">
                      {a.time ?? a.timeFrom ?? `#${idx + 1}`}
                    </span>
                    <div className="flex-1 min-w-0 border-l border-gray-200 pl-4 pb-1">
                      <p className="text-sm font-semibold text-gray-800">
                        {a.title}
                      </p>
                      {(a.description || a.location || a.host) && (
                        <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                          {a.description}
                          {(a.location || a.host) && (
                            <span className="block mt-0.5 text-xs text-slate-gray">
                              {[a.location, a.host ? `Led by ${a.host}` : null]
                                .filter(Boolean)
                                .join(" · ")}
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {event.notes && (
            <div className="max-w-4xl mb-16">
              <p className="text-xl font-bold text-navy mb-3">Notes</p>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {event.notes}
              </p>
            </div>
          )}

          {others.length > 0 && (
            <div className="mb-10">
              <h3 className="text-xl font-bold text-navy mb-5">More events</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {others.map((e) => (
                  <EventCard key={e._id} event={e} />
                ))}
              </div>
            </div>
          )}

          <Link
            href="/events"
            className="inline-flex min-h-11 items-center gap-1.5 text-sm text-slate-gray hover:text-navy transition-colors"
          >
            <LuArrowLeft /> Back to all events
          </Link>
        </div>
      </section>
    </>
  );
}