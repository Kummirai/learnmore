import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import {
  LuArrowLeft,
  LuArrowRight,
  LuCalendar,
  LuCrosshair,
  LuFootprints,
  LuHand,
  LuRuler,
  LuShirt,
  LuUser,
  LuUsers,
} from "react-icons/lu";
import Navbar from "@/components/Navbar";
import { getClub } from "@/lib/clubs";
import { getSports, playerSlug, type SportsData } from "@/lib/sports";
import {
  buildRoster,
  fetchRoster,
  type RegisteredPlayer,
} from "@/lib/squad-roster";

/** Teams and their players are only known at request time. */
export const dynamic = "force-dynamic";

async function loadCatalog(): Promise<SportsData | null> {
  try {
    return await getSports();
  } catch {
    return null; // unreachable backend — the page says so below
  }
}

function CatalogError() {
  return (
    <>
      <Navbar />
      <section className="flex-1 px-4 py-24 bg-white">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan mb-2">
            Relate · Sports
          </p>
          <h1 className="text-3xl font-black tracking-tight text-navy mb-3">
            Teams unavailable
          </h1>
          <p className="text-sm text-slate-gray">
            We couldn&rsquo;t load the squads right now. Reload the page to try
            again.
          </p>
        </div>
      </section>
    </>
  );
}

/** One-line role summary for an open position (falls back to a generic line). */
const ROLE_NOTES: Record<string, string> = {
  Goalkeeper: "Last line of defence — shot stopping, command of the box and quick distribution.",
  "Right Back": "Covers the right flank, joins the attack and tracks the opposition winger.",
  "Centre Back": "Wins the aerial duels, organises the line and clears the danger.",
  "Left Back": "Covers the left flank, overlaps down the line and gets back to defend.",
  "Defensive Midfielder": "Sits in front of the back four, breaks up play and recycles possession.",
  "Central Midfielder": "Links defence to attack — box to box, both ways, all game.",
  "Attacking Midfielder": "Plays between the lines, creates chances and arrives late in the box.",
  "Right Winger": "Stretches the defence wide, takes on the full-back and delivers crosses.",
  Striker: "Leads the line, holds the ball up and finishes the chances.",
  "Left Winger": "Cuts inside from the left, beats the defender and goes for goal.",
  "Goal Shooter": "Converts from under the post — the finisher of the circle.",
  "Goal Attack": "Shoots and feeds the circle, working the space with the shooter.",
  "Wing Attack": "Feeds the circle edge and moves the ball down the court.",
  Centre: "The engine — restarts play, links the ends and covers both circles.",
  "Wing Defence": "Denies the feed, disrupts the attack down the court.",
  "Goal Defence": "Marks the shooter and drives the transition out of defence.",
  "Goal Keeper": "Deep defender — reads the pass and cleans up inside the circle.",
  Setter: "Runs the offence — decides who attacks and where.",
  "Outside Hitter": "Primary attacker from the outside, serving and attacking the pin.",
  "Middle Blocker": "Blocks across the net and attacks the quick middle.",
  "Opposite Hitter": "Attacks from the right and backs up the block.",
  Libero: "Defensive specialist — digs and passes, never leaves the back court.",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; player: string }>;
}): Promise<Metadata> {
  const { id, player } = await params;
  const catalog = await loadCatalog();
  if (!catalog) return { title: "Teams Unavailable · Relate Sports" };
  const team = catalog.getTeam(id);
  if (!team) return { title: "Player Not Found · Relate Sports" };

  const { registrations } = await fetchRoster(team.id);
  const registrant = findRegistrant(registrations, player);
  const open = registrant ? undefined : catalog.findPlayer(id, player);
  const claimed = open ? starterFor(registrations, open.position) : undefined;
  const person = registrant ?? claimed;

  if (person) {
    return {
      title: `${person.name} · ${team.name}`,
      description: `${person.name} — ${person.position} for ${team.name} (${team.sport}).`,
    };
  }
  if (open) {
    return {
      title: `${open.position} · ${team.name}`,
      description: `The ${open.position} slot for ${team.name} — register to claim it.`,
    };
  }
  return { title: "Player Not Found · Relate Sports" };
}

/** First (oldest) registrant for a position — the player holding that slot. */
function starterFor(rows: RegisteredPlayer[], position: string) {
  return rows
    .filter((r) => r.status === "active" && r.position === position)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))[0];
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

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
      <span className="shrink-0 size-9 rounded-lg bg-alice-blue text-cyan flex items-center justify-center">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-gray">
          {label}
        </p>
        <p className="text-sm font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

const footLabel = (foot: "left" | "right") =>
  foot === "left" ? "Left-footed" : "Right-footed";
const handLabel = (hand: "left" | "right") =>
  hand === "left" ? "Left-handed" : "Right-handed";

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ id: string; player: string }>;
}) {
  const { id, player } = await params;
  const catalog = await loadCatalog();
  if (!catalog) return <CatalogError />;
  const team = catalog.getTeam(id);
  const squad = team ? catalog.getSquad(team.id) : undefined;
  if (!team || !squad) notFound();

  const { registrations } = await fetchRoster(team.id);
  const roster = buildRoster(squad, registrations, team.sport, catalog);
  const registrant = findRegistrant(registrations, player);
  const open = registrant ? undefined : catalog.findPlayer(id, player);
  if (!registrant && !open) notFound();

  // A position URL keeps working once somebody holds the slot: send it to
  // that player instead of showing an "open" page for a filled position.
  if (!registrant && open) {
    const claimed = starterFor(registrations, open.position);
    if (claimed) redirect(`/sports/${team.id}/${playerSlug(claimed.name)}`);
  }

  const club = await getClub(team.clubSlug).catch(() => undefined);
  const firstName = (registrant?.name ?? team.name).split(" ")[0];
  const registerHref = registrant
    ? `/sports/${team.id}/register`
    : `/sports/${team.id}/register?position=${encodeURIComponent(open!.position)}`;

  return (
    <>
      <header
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(115deg, #151f3a 0%, ${hexA(club?.colorDark ?? "#1d2a4d", 0.95)} 48%, ${hexA(club?.color ?? "#13c5dd", 0.8)} 100%)`,
        }}
      >
        <Navbar overlay />

        <div
          className="absolute -top-32 -right-24 size-96 rounded-full blur-3xl opacity-30"
          style={{ backgroundColor: club?.color ?? "#13c5dd" }}
        />

        <div className="relative z-10 max-w-6xl mx-auto w-full px-4 sm:px-6 pt-28 pb-12 md:pt-32 md:pb-16">
          <Link
            href={`/sports/${team.id}`}
            className="inline-flex min-h-11 items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors"
          >
            <LuArrowLeft /> {team.name}
          </Link>

          <div className="mt-6 md:mt-8 flex flex-col md:flex-row md:items-center gap-8 md:gap-10">
            <div className="relative shrink-0 self-center md:self-start">
              {registrant ? (
                <Image
                  src={registrant.photoUrl}
                  alt={registrant.name}
                  width={480}
                  height={480}
                  className="size-44 sm:size-52 md:size-60 rounded-2xl object-cover shadow-2xl ring-4 ring-white/20"
                />
              ) : (
                <div
                  className="size-44 sm:size-52 md:size-60 rounded-2xl shadow-2xl ring-4 ring-white/20 flex items-center justify-center text-6xl md:text-7xl font-black text-white uppercase"
                  style={{ background: "linear-gradient(135deg, #1d2a4d, #13c5dd)" }}
                >
                  {open!.badge}
                </div>
              )}
              <span className="absolute -bottom-2 -right-2 size-14 rounded-2xl bg-navy text-white text-lg font-black flex items-center justify-center ring-4 ring-white/30">
                {registrant
                  ? (roster.slots.find((s) => s.registrant?.id === registrant.id)
                      ?.number ?? "—")
                  : roster.slots.find((s) => s.position === open!.position)?.number ?? "—"}
              </span>
            </div>

            <div className="max-w-2xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/70 mb-2">
                {club?.name ?? "Relate"} · {team.sport} · {team.name}
              </p>
              <h1 className="font-black tracking-tight leading-tight text-white text-4xl sm:text-5xl sm:leading-none md:text-6xl">
                {registrant?.name ?? open!.position}
              </h1>
              <p className="mt-2 text-cyan text-lg sm:text-xl font-semibold">
                {registrant
                  ? `${registrant.position} · #${registrant.order} in the queue`
                  : "Open position"}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                {registrant ? (
                  <>
                    <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3.5 py-1.5 rounded-full text-xs font-semibold text-white">
                      <LuRuler /> {registrant.heightCm} cm
                    </span>
                    <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3.5 py-1.5 rounded-full text-xs font-semibold text-white">
                      <LuFootprints /> {footLabel(registrant.foot)}
                    </span>
                    <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3.5 py-1.5 rounded-full text-xs font-semibold text-white">
                      <LuHand /> {handLabel(registrant.hand)}
                    </span>
                    <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3.5 py-1.5 rounded-full text-xs font-semibold text-white">
                      <LuUsers />{" "}
                      {registrant.status === "active" ? "On the team sheet" : "Waiting list"}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3.5 py-1.5 rounded-full text-xs font-semibold text-white">
                      <LuShirt /> No.{" "}
                      {roster.slots.find((s) => s.position === open!.position)?.number ?? "—"}
                    </span>
                    <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3.5 py-1.5 rounded-full text-xs font-semibold text-white">
                      <LuUsers />{" "}
                      {roster.counts[open!.position]?.taken ?? 0} of{" "}
                      {roster.counts[open!.position]?.capacity ?? catalog.maxPerPosition} filled
                    </span>
                    <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3.5 py-1.5 rounded-full text-xs font-semibold text-white">
                      <LuCrosshair /> First come, first picked
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="flex-1 px-4 py-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan mb-1">
                {registrant ? "Player profile" : "Position"}
              </p>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-navy mb-4">
                {registrant ? "At a glance" : "The role"}
              </h2>
              <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5">
                {registrant ? (
                  <>
                    <DetailRow
                      icon={<LuShirt />}
                      label="Squad number"
                      value={
                        roster.slots.find((s) => s.registrant?.id === registrant.id)
                          ? `No. ${
                              roster.slots.find((s) => s.registrant?.id === registrant.id)!
                                .number
                            }`
                          : "Reserve"
                      }
                    />
                    <DetailRow
                      icon={<LuCrosshair />}
                      label="Position"
                      value={`${registrant.position} (${registrant.positionCode})`}
                    />
                    <DetailRow icon={<LuRuler />} label="Height" value={`${registrant.heightCm} cm`} />
                    <DetailRow
                      icon={<LuFootprints />}
                      label="Stronger foot"
                      value={footLabel(registrant.foot)}
                    />
                    <DetailRow
                      icon={<LuHand />}
                      label="Stronger hand"
                      value={handLabel(registrant.hand)}
                    />
                    <DetailRow
                      icon={<LuCalendar />}
                      label="Registered"
                      value={
                        registrant.createdAt
                          ? new Date(registrant.createdAt).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"
                      }
                    />
                  </>
                ) : (
                  <>
                    <DetailRow
                      icon={<LuShirt />}
                      label="Squad number"
                      value={`No. ${
                        roster.slots.find((s) => s.position === open!.position)?.number ?? "—"
                      }`}
                    />
                    <DetailRow
                      icon={<LuCrosshair />}
                      label="Position"
                      value={`${open!.position} (${open!.badge})`}
                    />
                    <DetailRow
                      icon={<LuUsers />}
                      label="Places filled"
                      value={`${roster.counts[open!.position]?.taken ?? 0} of ${
                        roster.counts[open!.position]?.capacity ?? catalog.maxPerPosition
                      }`}
                    />
                    <DetailRow icon={<LuUser />} label="Sport" value={team.sport} />
                    <DetailRow
                      icon={<LuCalendar />}
                      label="Team sheet"
                      value={`${roster.registered} of ${squad.players.length} spots`}
                    />
                  </>
                )}
              </div>
            </div>

            <div className="lg:col-span-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan mb-1">
                {registrant ? "The squad" : "How selection works"}
              </p>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-navy mb-4">
                {registrant ? `${team.initials} squad` : "Claim this spot"}
              </h2>

              <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 md:p-8 mb-6">
                {registrant ? (
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                    {registrant.name} plays {registrant.position.toLowerCase()} for{" "}
                    {team.name}, coached by {squad.coach.name}.{" "}
                    {roster.registered} of {squad.players.length} spots on the team
                    sheet are filled so far this season.
                  </p>
                ) : (
                  <ul className="space-y-3 text-sm md:text-base text-gray-600">
                    <li className="flex gap-3">
                      <span className="mt-1.5 size-1.5 rounded-full bg-cyan shrink-0" />
                      Every position holds up to {catalog.maxPerPosition} players — a
                      starter plus cover.
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-1.5 size-1.5 rounded-full bg-cyan shrink-0" />
                      The first {squad.players.length} registrants make up the team
                      sheet for {team.name}.
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-1.5 size-1.5 rounded-full bg-cyan shrink-0" />
                      <span>
                        {open && (ROLE_NOTES[open.position] ??
                          `Players register for the ${open.position} slot and compete for it.`)}
                      </span>
                    </li>
                  </ul>
                )}
              </div>

              <div className="rounded-2xl bg-navy text-white p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                <div>
                  <h3 className="font-bold text-lg">
                    {registrant
                      ? `Want to play alongside ${firstName}?`
                      : `Register as ${open!.position}`}
                  </h3>
                  <p className="text-sm text-white/70 mt-1">
                    Add your photo and details — takes a minute, and you keep your
                    place in the queue.
                  </p>
                </div>
                <Link
                  href={registerHref}
                  className="shrink-0 inline-flex items-center justify-center gap-2 bg-cyan text-navy px-6 py-3 rounded-lg font-bold text-sm hover:bg-cyan-light transition-colors"
                >
                  Register <LuArrowRight />
                </Link>
              </div>

              <Link
                href={`/sports/${team.id}`}
                className="mt-6 inline-flex min-h-11 items-center gap-1.5 text-sm text-slate-gray hover:text-navy transition-colors"
              >
                <LuArrowLeft /> Back to the {team.name} squad
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function findRegistrant(rows: RegisteredPlayer[], slug: string) {
  return rows.find((r) => playerSlug(r.name) === slug);
}
