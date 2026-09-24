import type { Metadata } from "next";
import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";
import PageHero from "@/components/PageHero";
import { CLUBS, teamsForClub } from "@/constants/relate";

export const metadata: Metadata = {
  title: "Club Sports · Relate",
  description:
    "See every Relate sports team by club — Sprout Kids, Surge and Pulse — with football, netball and volleyball squads and how to join.",
};

const SPORT_ICONS: Record<string, string> = {
  Football: "⚽",
  Netball: "🥅",
  Volleyball: "🏐",
};

export default function ClubSportsPage() {
  const clubs = CLUBS.filter((c) => ["sprout", "surge", "pulse"].includes(c.slug));

  return (
    <>
      <PageHero
        title="Club Sports"
        tagline="Who plays where"
        description="Every Relate sports team by club — pick your club and find your squad across football, netball and volleyball."
        watermark="Teams"
        chips={clubs.map((c) => ({ dot: true, label: c.name }))}
        meta={[
          { label: "Clubs", value: String(clubs.length) },
          { label: "Sports", value: "3 per club" },
          { label: "Joining", value: "Free" },
        ]}
        actions={
          <Link
            href="/sports"
            className="inline-flex items-center gap-2 bg-white text-navy px-6 py-3 rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors"
          >
            All sports <LuArrowRight />
          </Link>
        }
      />

      <section className="flex-1 px-4 py-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {clubs.map((club) => {
              const teams = teamsForClub(club.slug);
              return (
                <article
                  key={club.slug}
                  className="flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div
                    className="px-6 py-6 text-white"
                    style={{
                      background: `linear-gradient(135deg, ${club.color}, ${club.colorDark})`,
                    }}
                  >
                    <h2 className="text-2xl font-black tracking-tight">
                      {club.name}
                    </h2>
                    <p className="text-sm text-white/85 mt-0.5">
                      {club.group} · {club.ageRange}
                    </p>
                  </div>
                  <div className="flex flex-col flex-1 p-5 gap-2">
                    {teams.map((team) => (
                      <Link
                        key={team.id}
                        href={`/sports#${team.sport.toLowerCase()}`}
                        className="flex items-center gap-3 rounded-lg border border-gray-200 hover:border-cyan/50 hover:bg-alice-blue px-3 py-2.5 transition-colors"
                      >
                        <span className="text-xl" aria-hidden>
                          {SPORT_ICONS[team.sport]}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {team.name}
                          </p>
                          <p className="text-[11px] uppercase tracking-wide text-gray-400">
                            {team.sport}
                          </p>
                        </div>
                        <LuArrowRight className="text-cyan shrink-0" />
                      </Link>
                    ))}
                  </div>
                  <div className="px-5 pb-5">
                    <Link
                      href={`/${club.slug}`}
                      className="block text-center text-sm font-semibold text-navy bg-alice-blue hover:bg-cyan/20 py-2.5 rounded-lg transition-colors"
                    >
                      {club.name} club page →
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          <p className="text-center text-sm text-slate-gray mt-10">
            League fixtures, match days and tournaments land under{" "}
            <Link href="/events" className="text-cyan hover:underline">
              Events
            </Link>{" "}
            as they&rsquo;re confirmed.
          </p>
        </div>
      </section>
    </>
  );
}