import type { Metadata } from "next";
import Link from "next/link";
import { LuArrowRight, LuCalendar } from "react-icons/lu";
import PageHero from "@/components/PageHero";
import { getClubsCatalog } from "@/lib/clubs";
import DataError from "@/components/DataError";

export const metadata: Metadata = {
  title: "Club Events · Relate",
  description:
    "Find events organised by every Relate club — Sprout, Surge, Pulse, Prime, Anchor, Spark and Synergy — meetups, match days and more.",
};

export default async function ClubEventsPage() {
  let clubs;
  try {
    clubs = (await getClubsCatalog()).clubs;
  } catch {
    return (
      <section className="flex-1 px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <DataError label={"The club list"} />
        </div>
      </section>
    );
  }

  return (
    <>
      <PageHero
        title="Club Events"
        mobileTitle="Events"
        tagline="Every club, every meetup"
        description="Events grouped by club — pick your club to see its meetups, match days, worship nights and family gatherings."
        watermark="Events"
        chips={clubs.map((c) => ({ dot: true, label: c.name }))}
        meta={[
          { label: "Clubs", value: String(clubs.length) },
          { label: "Cadence", value: "Weekly" },
          { label: "Cost", value: "Free" },
        ]}
        actions={
          <Link
            href="/events"
            className="inline-flex items-center gap-2 bg-white text-navy px-6 py-3 rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors"
          >
            All events <LuArrowRight />
          </Link>
        }
      />

      <section className="flex-1 px-4 py-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan mb-1">
            Relate clubs
          </p>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-navy mb-8">
            Pick a club
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {clubs.map((club) => (
              <Link
                key={club.slug}
                href={`/events#club-${club.slug}`}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden"
              >
                <div
                  className="relative h-24 flex items-center justify-between px-5 text-white overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${club.color}, ${club.colorDark})`,
                  }}
                >
                  <div>
                    <h3 className="text-xl font-black tracking-tight">
                      {club.name}
                    </h3>
                    <p className="text-xs text-white/85">
                      {club.group} · {club.ageRange}
                    </p>
                  </div>
                  <LuCalendar className="text-white/30 text-5xl" />
                </div>
                <div className="flex items-center justify-between p-5">
                  <p className="text-sm text-gray-500 pr-4 line-clamp-2">
                    {club.tagline}
                  </p>
                  <span className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-cyan group-hover:gap-2 transition-all">
                    View events <LuArrowRight />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}