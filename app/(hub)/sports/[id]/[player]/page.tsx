import type { Metadata } from "next";
import Link from "next/link";
import JoinCta from "@/components/join/JoinCta";
import { notFound } from "next/navigation";
import {
  LuArrowLeft,
  LuArrowRight,
  LuCalendar,
  LuCrosshair,
  LuMapPin,
  LuRuler,
  LuShirt,
  LuUser,
} from "react-icons/lu";
import Navbar from "@/components/Navbar";
import { SPORTS_TEAMS, getRelateClub } from "@/constants/relate";
import { findPlayer, getSquad, imgDetail, playerSlug } from "@/constants/squads";

export function generateStaticParams() {
  return SPORTS_TEAMS.flatMap((team) => {
    const squad = getSquad(team.id);
    return (squad?.players ?? []).map((p) => ({
      id: team.id,
      player: playerSlug(p.name),
    }));
  });
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; player: string }>;
}): Promise<Metadata> {
  return params.then(({ id, player }) => {
    const team = SPORTS_TEAMS.find((t) => t.id === id);
    const playerRecord = findPlayer(id, player);
    if (!team || !playerRecord) return { title: "Player Not Found · Relate Sports" };
    return {
      title: `${playerRecord.name} · ${team.name}`,
      description: `${playerRecord.name} — ${playerRecord.position} (No. ${playerRecord.number}) for ${team.name}. Age ${playerRecord.age}, ${playerRecord.height}, from ${playerRecord.hometown}.`,
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

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ id: string; player: string }>;
}) {
  const { id, player } = await params;
  const team = SPORTS_TEAMS.find((t) => t.id === id);
  const playerRecord = findPlayer(id, player);
  if (!team || !playerRecord) notFound();
  const club = getRelateClub(team.clubSlug);

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

        <div className="relative z-10 max-w-6xl mx-auto w-full px-4 sm:px-6 pt-28 pb-12 md:pt-32 md:pb-16">
          <Link
            href={`/sports/${team.id}`}
            className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors"
          >
            <LuArrowLeft /> {team.name}
          </Link>

          <div className="mt-6 md:mt-8 flex flex-col md:flex-row md:items-center gap-8 md:gap-10">
            <div className="relative shrink-0 self-center md:self-start">
              <img
                src={imgDetail(playerRecord.image)}
                alt={playerRecord.name}
                className="size-44 sm:size-52 md:size-60 rounded-2xl object-cover shadow-2xl ring-4 ring-white/20"
              />
              <span className="absolute -bottom-2 -right-2 size-14 rounded-2xl bg-navy text-white text-lg font-black flex items-center justify-center ring-4 ring-white/30">
                {playerRecord.number}
              </span>
            </div>

            <div className="max-w-2xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/70 mb-2">
                {club?.name ?? "Relate"} · {team.sport} · {team.name}
              </p>
              <h1 className="font-black tracking-tight leading-none text-white text-4xl sm:text-5xl md:text-6xl">
                {playerRecord.name}
              </h1>
              <p className="mt-2 text-cyan text-lg sm:text-xl font-semibold">
                {playerRecord.position}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3.5 py-1.5 rounded-full text-xs font-semibold text-white">
                  <LuUser /> Age {playerRecord.age}
                </span>
                <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3.5 py-1.5 rounded-full text-xs font-semibold text-white">
                  <LuRuler /> {playerRecord.height}
                </span>
                <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3.5 py-1.5 rounded-full text-xs font-semibold text-white">
                  <LuMapPin /> {playerRecord.hometown}
                </span>
                <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3.5 py-1.5 rounded-full text-xs font-semibold text-white">
                  <LuCalendar /> Joined {playerRecord.joined}
                </span>
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
                Player profile
              </p>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-navy mb-4">
                At a glance
              </h2>
              <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5">
                <DetailRow icon={<LuShirt />} label="Squad number" value={`No. ${playerRecord.number}`} />
                <DetailRow icon={<LuCrosshair />} label="Position" value={playerRecord.position} />
                <DetailRow icon={<LuUser />} label="Age" value={`${playerRecord.age} years`} />
                <DetailRow icon={<LuRuler />} label="Height" value={playerRecord.height} />
                <DetailRow icon={<LuCrosshair />} label="Preferred side" value={playerRecord.side} />
                <DetailRow icon={<LuMapPin />} label="Hometown" value={playerRecord.hometown} />
                <DetailRow icon={<LuCalendar />} label="Joined" value={String(playerRecord.joined)} />
              </div>
            </div>

            <div className="lg:col-span-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan mb-1">
                This season
              </p>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-navy mb-4">
                {team.initials} stats
              </h2>

              <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
                {playerRecord.stats.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl border border-gray-100 bg-alice-blue p-4 md:p-6 text-center"
                  >
                    <p className="text-2xl md:text-3xl font-black tracking-tight text-navy">
                      {s.value}
                    </p>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-gray mt-1">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 md:p-8">
                <h3 className="font-bold text-navy mb-3">About {playerRecord.name.split(" ")[0]}</h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  {playerRecord.bio}
                </p>
              </div>

              <div className="mt-6 rounded-2xl bg-navy text-white p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                <div>
                  <h3 className="font-bold text-lg">Want to play alongside {playerRecord.name.split(" ")[0]}?</h3>
                  <p className="text-sm text-white/70 mt-1">
                    Register for {team.name} and join the squad.
                  </p>
                </div>
                <JoinCta
                  href={`/join?club=${team.clubSlug}&team=${team.id}`}
                  className="shrink-0 inline-flex items-center justify-center gap-2 bg-cyan text-navy px-6 py-3 rounded-lg font-bold text-sm hover:bg-cyan-light transition-colors"
                >
                  Register to join <LuArrowRight />
                </JoinCta>
              </div>

              <Link
                href={`/sports/${team.id}`}
                className="mt-6 inline-flex items-center gap-1.5 text-sm text-slate-gray hover:text-navy transition-colors"
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