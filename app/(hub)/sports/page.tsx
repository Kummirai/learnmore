import type { Metadata } from "next";
import Link from "next/link";
import { LuArrowRight, LuShield } from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa";
import PageHero from "@/components/PageHero";
import {
  getRelateClub,
  SPORTS,
  SPORTS_TEAMS,
  teamsForSport,
  type RelateSport,
  type RelateTeam,
} from "@/constants/relate";

export const metadata: Metadata = {
  title: "Sports · Relate",
  description:
    "Football, netball and volleyball teams for Sprout Kids, Surge and Pulse — train through the week and play at the weekend on the Relate grounds.",
};

const WHATSAPP = "27782677436";

const sportLine: Record<RelateSport, string> = {
  Football: "Eleven-a-side and small-sided football — training midweek, matches at the weekend.",
  Netball: "Saturday netball league games and summer tournaments.",
  Volleyball: "Friday court sessions and weekend tournaments — all levels welcome.",
};

function TeamCard({ team }: { team: RelateTeam }) {
  const club = getRelateClub(team.clubSlug);
  const waLink = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
    `Hi RelateWorld! I'd like to join the ${team.name}.`,
  )}`;
  const gradient = club
    ? `linear-gradient(135deg, ${club.color}, ${club.colorDark})`
    : "linear-gradient(135deg, #16213E, #0891B2)";

  return (
    <article className="group flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
      <div
        className="relative h-36 flex items-center justify-center overflow-hidden"
        style={{ background: gradient }}
      >
        <LuShield className="absolute -right-6 -bottom-6 text-white/10 text-8xl" />
        <div className="text-center">
          <p className="text-3xl font-black tracking-tight text-white">
            {team.initials}
          </p>
          <p className="mt-1 text-[11px] uppercase tracking-widest text-white/80">
            {club?.name ?? "Relate"} · {team.sport}
          </p>
        </div>
      </div>
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-lg font-semibold text-gray-800 leading-snug">
          {team.name}
        </h3>
        <p className="mt-1.5 text-sm text-gray-500 leading-relaxed flex-1">
          {team.tagline}
        </p>
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
          <Link
            href={`/${club?.slug ?? ""}`}
            className="text-xs font-semibold text-cyan hover:text-cyan-dark transition-colors"
          >
            {club?.name ?? "Relate"} club page →
          </Link>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-navy bg-alice-blue hover:bg-cyan/20 px-3 py-1.5 rounded-full transition-colors"
          >
            <FaWhatsapp /> Join
          </a>
        </div>
      </div>
    </article>
  );
}

export default function SportsPage() {
  return (
    <>
      <PageHero
        title="Relate Sports"
        tagline="Play for your club"
        description="Football, netball and volleyball teams for Sprout Kids, Sprout Tweens, Sprout Teens, Surge and Pulse — train through the week, play at the weekend and cheer each other on."
        watermark="Sports"
        chips={SPORTS.map((s) => ({ dot: true, label: s }))}
        meta={[
          { label: "Teams", value: String(SPORTS_TEAMS.length) },
          { label: "Sports", value: String(SPORTS.length) },
          { label: "Training", value: "Tue – Sat" },
        ]}
        actions={
          <Link
            href="/sports/clubs"
            className="inline-flex items-center gap-2 bg-white text-navy px-6 py-3 rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors"
          >
            Explore club teams <LuArrowRight />
          </Link>
        }
      />

      <section className="flex-1 px-4 py-12 bg-white">
        <div className="max-w-6xl mx-auto">
          {SPORTS.map((sport) => (
            <div key={sport} id={sport.toLowerCase()} className="scroll-mt-24 mb-14 last:mb-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan mb-1">
                Relate · {sport}
              </p>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-navy mb-1">
                {sport}
              </h2>
              <p className="text-gray-500 mb-6 max-w-2xl">{sportLine[sport]}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {teamsForSport(sport).map((team) => (
                  <TeamCard key={team.id} team={team} />
                ))}
              </div>
            </div>
          ))}

          <div className="rounded-2xl bg-navy text-white p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute -top-24 -left-24 size-72 rounded-full bg-cyan/20 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 size-72 rounded-full bg-cyan/20 blur-3xl" />
            <div className="relative">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                Want to play for a Relate team?
              </h2>
              <p className="mt-2 text-white/70 max-w-xl mx-auto">
                Message us on WhatsApp with your name, age and the sport you
                love — we&rsquo;ll get you on a team.
              </p>
              <a
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 bg-cyan text-navy px-6 py-3.5 rounded-lg font-bold text-sm hover:bg-cyan-light transition-colors"
              >
                <FaWhatsapp className="text-lg" /> Join a team on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}