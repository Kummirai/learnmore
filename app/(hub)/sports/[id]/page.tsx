import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import JoinCta from "@/components/join/JoinCta";
import { notFound } from "next/navigation";
import {
  LuArrowLeft,
  LuArrowRight,
  LuCalendar,
  LuShield,
  LuUsers,
  LuUser,
} from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa";
import Navbar from "@/components/Navbar";
import TeamMembers from "@/components/sports/TeamMembers";
import {
  SPORTS_TEAMS,
  getRelateClub,
} from "@/constants/relate";
import {
  MAX_PER_POSITION,
  getSquad,
  playerSlug,
  SPORTS_DIRECTOR,
} from "@/constants/squads";
import { buildRoster, fetchRoster, type Slot } from "@/lib/squad-roster";

export function generateStaticParams() {
  return SPORTS_TEAMS.map((team) => ({ id: team.id }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  return params.then(({ id }) => {
    const team = SPORTS_TEAMS.find((t) => t.id === id);
    const club = getRelateClub(team?.clubSlug);
    if (!team) return { title: "Team Not Found · Relate Sports" };
    return {
      title: `${team.name} · Relate Sports`,
      description: `${team.name} — squad, coach and upcoming fixtures for ${club?.name ?? "Relate"}. Train through the week, play at the weekend. Free to join.`,
    };
  });
}

/** #RRGGBB + alpha → rgba() so gradients sit over the navy chrome. */
function hexA(hex: string, a: number): string {
  const n = hex.replace("#", "");
  if (n.length !== 6) return hex;
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

const dayOf = (iso: string) => {
  const d = new Date(`${iso}T00:00:00`);
  return {
    day: d.toLocaleDateString("en-GB", { day: "numeric" }),
    month: d.toLocaleDateString("en-GB", { month: "short" }),
    weekday: d.toLocaleDateString("en-GB", { weekday: "short" }),
  };
};

const initialsOf = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

const WHATSAPP = "27782677436";

/**
 * One slot on the team sheet. Filled slots show the registrant; open ones keep
 * the generated placeholder (position name + badge) and link straight to the
 * registration form with that position preselected.
 */
function SlotCard({
  slot,
  teamId,
  gradient,
}: {
  slot: Slot;
  teamId: string;
  gradient: string;
}) {
  const registrant = slot.registrant;
  const name = registrant?.name ?? slot.placeholder.name;
  const href = registrant
    ? `/sports/${teamId}/${playerSlug(registrant.name)}`
    : `/sports/${teamId}/register?position=${encodeURIComponent(slot.position)}`;

  return (
    <Link
      href={href}
      className="group flex flex-col items-center text-center bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-5 hover:shadow-md hover:border-cyan/40 transition-all"
    >
      <div className="relative">
        <div className="size-16 md:size-20 rounded-full overflow-hidden ring-4 ring-white shadow-lg group-hover:scale-105 transition-transform duration-300">
          {registrant?.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={registrant.photoUrl}
              alt={name}
              className="size-full object-cover"
            />
          ) : (
            <span
              className="size-full flex items-center justify-center text-base md:text-xl font-black text-white uppercase"
              style={{ background: gradient }}
            >
              {slot.badge}
            </span>
          )}
        </div>
        <span className="absolute -bottom-1 -right-1 size-7 md:size-8 rounded-full bg-navy text-white text-[11px] md:text-xs font-bold flex items-center justify-center ring-2 ring-white">
          {slot.number}
        </span>
      </div>
      <h4 className="mt-3 text-sm font-bold text-navy leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-cyan-dark transition-colors">
        {name}
      </h4>
      <p className="text-[11px] text-cyan font-semibold mt-1 uppercase tracking-wider line-clamp-2">
        {slot.position}
      </p>
      <p
        className={`mt-1 text-[11px] font-bold uppercase tracking-wider ${
          registrant ? "text-slate-gray" : "text-gold-700"
        }`}
      >
        {registrant ? "Registered" : "Claim this spot"}
      </p>
    </Link>
  );
}

export default async function TeamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const team = SPORTS_TEAMS.find((t) => t.id === id);
  const squad = team ? getSquad(team.id) : undefined;
  if (!team || !squad) notFound();
  const club = getRelateClub(team.clubSlug);
  const gradient = club
    ? `linear-gradient(135deg, ${club.color}, ${club.colorDark})`
    : "linear-gradient(135deg, #13c5dd, #0284c7)";

  // Real registrations overlaid on the generated team sheet (empty on failure
  // or before anyone signs up — the sheet then shows open positions).
  const { registrations } = await fetchRoster(team.id);
  const roster = buildRoster(squad, registrations, team.sport);

  return (
      <>
        <header
          className="relative overflow-hidden"
          style={{
            background: `linear-gradient(115deg, #151f3a 0%, ${hexA(club?.colorDark ?? "#1d2a4d", 0.95)} 48%, ${hexA(club?.color ?? "#13c5dd", 0.8)} 100%)`,
          }}
        >
          <Navbar overlay />

          <div className="absolute -top-32 -right-24 size-96 rounded-full blur-3xl opacity-30"
               style={{ backgroundColor: club?.color ?? "#13c5dd" }} />
          {!team.logo && (
            <div
              className="absolute top-1/2 -translate-y-1/2 right-0 hidden select-none md:block"
              aria-hidden="true"
            >
              <span
                className="block font-black leading-none tracking-tighter text-white"
                style={{ fontSize: "clamp(7rem, 22vw, 14rem)", opacity: 0.12 }}
              >
                {team.initials.replace(" ", "")}
              </span>
            </div>
          )}

          <div className="relative z-10 max-w-6xl mx-auto w-full px-4 sm:px-6 pt-28 pb-12 md:pt-32 md:pb-16">
            <Link
              href="/sports"
              className="inline-flex min-h-11 items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors"
            >
              <LuArrowLeft /> All teams
            </Link>

            <div className="mt-6 flex flex-col-reverse gap-6 md:mt-8 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/70 mb-2">
                  Relate · {club?.name ?? "Relate"} · {team.sport}
                </p>
                <h1 className="font-black tracking-tight leading-tight text-white text-4xl sm:text-5xl sm:leading-none md:text-6xl">
                  {team.name}
                </h1>
                <p className="mt-3 text-white/80 text-sm md:text-base max-w-xl leading-relaxed">
                  {team.tagline}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3.5 py-1.5 rounded-full text-xs font-semibold text-white">
                    <LuUsers /> {roster.registered} of {squad.players.length} registered
                  </span>
                  <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3.5 py-1.5 rounded-full text-xs font-semibold text-white">
                    <LuUser /> Coach {squad?.coach.name}
                  </span>
                  {squad?.fixtures[0] && (
                    <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3.5 py-1.5 rounded-full text-xs font-semibold text-white">
                      <LuCalendar /> Next: {dayOf(squad.fixtures[0].date).weekday} {dayOf(squad.fixtures[0].date).day} {dayOf(squad.fixtures[0].date).month}
                    </span>
                  )}
                </div>

                <div className="mt-7 flex flex-col sm:flex-row gap-3">
                  <Link
                    href={`/sports/${team.id}/register`}
                    className="inline-flex items-center justify-center gap-2 bg-white text-navy px-6 py-3 rounded-lg font-bold text-sm hover:bg-white/90 transition-colors"
                  >
                    Register as a player <LuArrowRight />
                  </Link>
                  <a
                    href={`https://wa.me/${WHATSAPP}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-white/10 transition-colors"
                  >
                    <FaWhatsapp className="text-base" /> Ask a question
                  </a>
                </div>
              </div>

              {team.logo && (
                <div className="self-center shrink-0 rounded-2xl bg-white p-2 shadow-[0_16px_30px_-18px_rgba(0,0,0,0.8)] sm:p-3">
                  <Image
                    src={team.logo}
                    alt={`${team.name} crest`}
                    width={320}
                    height={320}
                    className="size-24 object-contain sm:size-28 md:size-36"
                  />
                </div>
              )}
            </div>
          </div>
        </header>

        <section className="flex-1 px-4 py-12 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan mb-1">
                {club?.name ?? "Relate"} · Squad
              </p>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-navy">
                The {team.initials} squad
              </h2>
              <p className="text-gray-500 mt-1 text-sm max-w-2xl">
                {roster.registered === 0
                  ? `Open to registration — the first ${squad.players.length} players to register make up the team sheet.`
                  : `${roster.registered} of ${squad.players.length} spots filled, coached by ${squad.coach.name}.`}
              </p>
            </div>

            <div className="grid grid-cols-1 min-[360px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
              {roster.slots.map((slot, i) => (
                <SlotCard
                  key={`${slot.position}-${i}`}
                  slot={slot}
                  teamId={team.id}
                  gradient={gradient}
                />
              ))}
            </div>

            {roster.reserves.length > 0 && (
              <div className="mt-8 rounded-2xl border border-gray-100 bg-alice-blue p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan mb-1">
                  Cover
                </p>
                <h3 className="text-lg font-black text-navy mb-1">Reserves</h3>
                <p className="text-xs text-slate-gray mb-4">
                  Registered inside the {team.sport} position limit but outside the
                  starting sheet — first up when a spot opens.
                </p>
                <div className="flex flex-wrap gap-3">
                  {roster.reserves.map((r) => (
                    <Link
                      key={r.id}
                      href={`/sports/${team.id}/${playerSlug(r.name)}`}
                      className="group flex items-center gap-2 rounded-full bg-white border border-gray-100 py-1.5 pl-1.5 pr-4 hover:border-cyan/40 transition-colors"
                    >
                      <span className="size-8 rounded-full overflow-hidden bg-navy shrink-0">
                        {r.photoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={r.photoUrl}
                            alt={r.name}
                            className="size-full object-cover"
                          />
                        ) : (
                          <span className="size-full flex items-center justify-center text-[11px] font-black text-white">
                            {r.positionCode}
                          </span>
                        )}
                      </span>
                      <span className="text-xs font-bold text-navy group-hover:text-cyan-dark">
                        {r.name}
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-gray">
                        {r.positionCode}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {roster.waitlist.length > 0 && (
              <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan mb-1">
                  Queue
                </p>
                <h3 className="text-lg font-black text-navy mb-1">Waiting list</h3>
                <p className="text-xs text-slate-gray mb-4">
                  Registered after their positions filled — next in line if anyone
                  drops out.
                </p>
                <div className="flex flex-wrap gap-3">
                  {roster.waitlist.map((r) => (
                    <Link
                      key={r.id}
                      href={`/sports/${team.id}/${playerSlug(r.name)}`}
                      className="group flex items-center gap-2 rounded-full bg-alice-blue border border-gray-100 py-1.5 pl-1.5 pr-4 hover:border-cyan/40 transition-colors"
                    >
                      <span className="size-8 rounded-full overflow-hidden bg-navy shrink-0">
                        {r.photoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={r.photoUrl}
                            alt={r.name}
                            className="size-full object-cover"
                          />
                        ) : (
                          <span className="size-full flex items-center justify-center text-[11px] font-black text-white">
                            {r.positionCode}
                          </span>
                        )}
                      </span>
                      <span className="text-xs font-bold text-navy group-hover:text-cyan-dark">
                        {r.name}
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-gray">
                        {r.positionCode}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-2xl border border-gold-200 bg-gold-50 px-5 py-4">
              <div className="flex-1">
                <p className="text-sm font-bold text-navy">
                  Registration is open — claim your position.
                </p>
                <p className="text-xs text-slate-gray mt-0.5">
                  Photo, height, dominant foot and hand, position. First come,
                  first picked; every position takes up to {MAX_PER_POSITION}.
                </p>
              </div>
              <Link
                href={`/sports/${team.id}/register`}
                className="shrink-0 inline-flex items-center justify-center gap-2 bg-navy text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-navy-dark transition-colors"
              >
                Register as a player <LuArrowRight />
              </Link>
            </div>

            {squad?.coach && (
              <div className="mt-12">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan mb-1">
                  Coaching staff
                </p>
                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-navy mb-6">
                  Who leads the team
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
                  <article className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div
                      className="size-16 rounded-full flex items-center justify-center text-xl font-black text-white ring-4 ring-white shadow-lg shrink-0"
                      style={{ background: gradient }}
                    >
                      {initialsOf(squad.coach.name)}
                    </div>
                    <div>
                      <h3 className="font-bold text-navy">{squad.coach.name}</h3>
                      <p className="text-cyan text-xs font-semibold uppercase tracking-wider">{squad.coach.role} · {team.name}</p>
                    </div>
                  </article>
                  <article className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div
                      className="size-16 rounded-full flex items-center justify-center text-xl font-black text-white ring-4 ring-white shadow-lg shrink-0"
                      style={{ background: gradient }}
                    >
                      {initialsOf(SPORTS_DIRECTOR.name)}
                    </div>
                    <div>
                      <h3 className="font-bold text-navy">{SPORTS_DIRECTOR.name}</h3>
                      <p className="text-cyan text-xs font-semibold uppercase tracking-wider">{SPORTS_DIRECTOR.role} · All Relate teams</p>
                    </div>
                  </article>
                </div>
              </div>
            )}

            <TeamMembers
              teamId={team.id}
              clubSlug={team.clubSlug}
              teamName={team.name}
              clubName={club?.name}
            />

            <div className="mt-12">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan mb-1">
                Match day
              </p>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-navy mb-2">
                Upcoming fixtures
              </h2>
              <p className="text-gray-500 mt-1 text-sm max-w-2xl mb-6">
                The next five fixtures for {team.name} — home games at the Relate Grounds.
              </p>

              <div className="space-y-3 max-w-3xl">
                {squad?.fixtures.map((f) => {
                  const { day, month, weekday } = dayOf(f.date);
                  return (
                    <div
                      key={`${f.date}-${f.opponent}`}
                      className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 p-4 rounded-2xl border border-gray-100 bg-white hover:shadow-md transition-shadow"
                    >
                      <div className="shrink-0 w-fit sm:w-16 text-center bg-navy text-white rounded-lg py-2 px-4 sm:px-0">
                        <p className="text-[11px] leading-tight uppercase">{month} · {weekday}</p>
                        <p className="text-xl font-bold leading-none mt-0.5">{day}</p>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-gray">
                          {f.competition}
                        </p>
                        <p className="text-base font-bold text-gray-800 mt-0.5">
                          {f.home ? "vs" : "@"} {f.opponent}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          <span className="inline-flex items-center gap-1">
                            <LuCalendar className="text-cyan" /> {f.venue} · {f.time}
                          </span>
                        </p>
                      </div>
                      <span
                        className={`shrink-0 text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                          f.home ? "bg-alice-blue text-cyan" : "bg-gray-100 text-slate-gray"
                        }`}
                      >
                        {f.home ? "Home" : "Away"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-12 rounded-2xl border border-gray-100 bg-white p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5 max-w-3xl">
              <div className="flex items-center gap-4">
                <div className="shrink-0 size-12 rounded-xl flex items-center justify-center" style={{ background: gradient }}>
                  <LuShield className="text-white text-2xl" />
                </div>
                <div>
                  <h3 className="font-bold text-navy">Training nights</h3>
                  <p className="text-sm text-gray-500">
                    {club?.name ?? "Relate"} trains midweek and plays on the weekend — all skill levels welcome.
                  </p>
                </div>
              </div>
              <JoinCta
                href={`/join?club=${team.clubSlug}&team=${team.id}`}
                className="shrink-0 inline-flex items-center justify-center gap-2 bg-navy text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-navy/90 transition-colors"
              >
                Register to join <LuArrowRight />
              </JoinCta>
            </div>
          </div>
        </section>
      </>
    );
}