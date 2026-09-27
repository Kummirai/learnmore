import Link from "next/link";
import type { IconType } from "react-icons";
import {
  LuBookOpen,
  LuCalendarDays,
  LuDumbbell,
  LuHeartHandshake,
  LuLayers,
  LuLightbulb,
  LuArrowRight,
} from "react-icons/lu";
import { withAlpha } from "./shared";

type Perk = {
  icon: IconType;
  title: string;
  body: string;
  href: string;
  cta: string;
};

/** What a membership actually unlocks — same list for members and visitors. */
export default function MembershipBenefits({
  accent,
  accentDark,
  clubSlug,
}: {
  accent: string;
  accentDark: string;
  clubSlug?: string;
}) {
  const perks: Perk[] = [
    {
      icon: LuCalendarDays,
      title: "Weekly club gatherings",
      body: "Games, honest conversation and a shared meal — the week your club meets, led by volunteers who know your name.",
      href: "/events",
      cta: "See what's on",
    },
    {
      icon: LuDumbbell,
      title: "Squads & sport",
      body: "Football, netball and volleyball squads with coaching, training and fixtures — join one when you register.",
      href: "/sports",
      cta: "Browse squads",
    },
    {
      icon: LuBookOpen,
      title: "Reading plans",
      body: "A verse, a read and a prayer for every day — from a month in the Psalms to the whole Bible in a year.",
      href: "/plans",
      cta: "Pick a plan",
    },
    {
      icon: LuLightbulb,
      title: "Bible Quiz season",
      body: "Read the season's books together, then battle it out on the leaderboard and win the season.",
      href: "/bible-quiz",
      cta: "Play the quiz",
    },
    {
      icon: LuHeartHandshake,
      title: "Prayer & practical help",
      body: "Daily prayer times, a prayer streak, and a place to ask the community for real, practical support.",
      href: "/prayer",
      cta: "Open prayer",
    },
    clubSlug
      ? {
          icon: LuLayers,
          title: "Your club's season guide",
          body: "Week-by-week outlines, memory verses and activities for the season your club is running right now.",
          href: `/magazines/${clubSlug}`,
          cta: "Read the guide",
        }
      : {
          icon: LuLayers,
          title: "Season guides & store",
          body: "Every club publishes a season guide, and the store carries the apparel and accessories members wear.",
          href: "/store",
          cta: "Visit the store",
        },
  ];

  return (
    <section className="border-t border-gray-100 bg-white px-4 py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-2xl">
          <p className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-dark">
            What your membership unlocks
          </p>
          <h2 className="text-3xl font-black tracking-tight text-navy md:text-4xl">
            One record, the whole of Relate
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-gray">
            Membership isn&rsquo;t a card in a wallet — it&rsquo;s the key to
            everything the community runs. Nothing here costs anything.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {perks.map((perk) => {
            const Icon = perk.icon;
            return (
              <Link
                key={perk.title}
                href={perk.href}
                className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_1px_2px_rgba(21,31,58,0.06)] transition-all hover:-translate-y-0.5 hover:border-navy/10 hover:shadow-[0_16px_30px_-20px_rgba(21,31,58,0.55)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
              >
                <span
                  className="mb-4 grid size-11 place-items-center rounded-xl"
                  style={{ backgroundColor: withAlpha(accent, 0.16) }}
                >
                  <Icon className="text-lg" style={{ color: accentDark }} />
                </span>
                <h3 className="font-bold text-navy">{perk.title}</h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-gray">
                  {perk.body}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-navy transition-colors group-hover:text-cyan-dark">
                  {perk.cta} <LuArrowRight className="text-xs" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
