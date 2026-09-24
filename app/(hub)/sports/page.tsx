import type { Metadata } from "next";
import Link from "next/link";
import { LuArrowRight, LuShield } from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa";
import HeroCarousel, { type HeroSlide } from "@/components/HeroCarousel";
import {
  getRelateClub,
  SPORTS,
  teamsForSport,
  type RelateSport,
  type RelateTeam,
} from "@/constants/relate";

export const metadata: Metadata = {
  title: "Sports · Relate",
  description:
    "Football, netball and volleyball teams for Sprout Kids, Surge and Pulse — train through the week and play at the weekend on the Relate grounds.",
};

const SPORT_SLIDES: HeroSlide[] = [
  {
    title: "Football squads",
    description:
      "Five teams from Sprout Kids to Pulse — train midweek, play at the weekend.",
    image:
      "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1600&q=80&auto=format",
    accent: "#13c5dd",
    cta: { href: "/sports#football", label: "Football teams" },
    secondary: { href: "/join", label: "Join a team" },
  },
  {
    title: "Netball teams",
    description:
      "Saturday league games and summer tournaments across every club.",
    image:
      "https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=1600&q=80&auto=format",
    accent: "#4caf50",
    cta: { href: "/sports#netball", label: "Netball teams" },
    secondary: { href: "/join", label: "Join a team" },
  },
  {
    title: "Volleyball teams",
    description:
      "Friday court sessions and weekend tournaments — all levels welcome.",
    image:
      "https://images.unsplash.com/photo-1552879674-8b1bb7e2c6c4?w=1600&q=80&auto=format",
    accent: "#f97316",
    cta: { href: "/sports#volleyball", label: "Volleyball teams" },
    secondary: { href: "/join", label: "Join a team" },
  },
];

const WHATSAPP = "27782677436";

const sportLine: Record<RelateSport, string> = {
  Football: "Eleven-a-side and small-sided football — training midweek, matches at the weekend.",
  Netball: "Saturday netball league games and summer tournaments.",
  Volleyball: "Friday court sessions and weekend tournaments — all levels welcome.",
};

function TeamCard({ team }: { team: RelateTeam }) {
  const club = getRelateClub(team.clubSlug);
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
          <Link
            href={`/join?club=${team.clubSlug}&team=${team.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-navy bg-alice-blue hover:bg-cyan/20 px-3 py-1.5 rounded-full transition-colors"
          >
            Join
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function SportsPage() {
  return (
    <>
      <HeroCarousel slides={SPORT_SLIDES} />

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
                Register your details and we&rsquo;ll set up a short chat with a
                chaplain before you join.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/join"
                  className="inline-flex items-center gap-2 bg-cyan text-navy px-6 py-3.5 rounded-lg font-bold text-sm hover:bg-cyan-light transition-colors"
                >
                  Register to join <LuArrowRight />
                </Link>
                <a
                  href={`https://wa.me/${WHATSAPP}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-white/30 text-white px-6 py-3.5 rounded-lg font-bold text-sm hover:bg-white/10 transition-colors"
                >
                  <FaWhatsapp className="text-lg" /> Ask a question
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}