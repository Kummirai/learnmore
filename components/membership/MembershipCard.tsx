import Link from "next/link";
import { type Membership } from "@/lib/membership";
import { SPORTS_TEAMS } from "@/constants/relate";
import { barcodeBars, initialsOf, withAlpha } from "./shared";
import CopyReference from "./CopyReference";

/**
 * The membership card itself — printed-credential styling: club-colour edge,
 * security hatching, a perforated stub carrying the membership ID and a
 * barcode derived from that ID.
 */
export default function MembershipCard({
  member,
  accent,
  statusLabel,
  statusChip,
  className = "",
}: {
  member: Membership;
  accent: string;
  statusLabel: string;
  statusChip: string;
  className?: string;
}) {
  const initials = initialsOf(member.name) || "R";
  const reference = `#${member.reference ?? member.id ?? "—"}`;
  const bars = barcodeBars(member.reference ?? member.id ?? "");

  return (
    <div
      className={`relative overflow-hidden rounded-[26px] bg-navy-dark text-white ring-1 ring-white/10 shadow-[0_34px_60px_-30px_rgba(0,0,0,0.9)] ${className}`}
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 95% at 100% 0%, ${withAlpha(accent, 0.5)} 0%, transparent 58%)`,
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(118deg, rgba(255,255,255,0.55) 0 1px, transparent 1px 9px)",
          opacity: 0.12,
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-gold-500 via-gold-500/50 to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 w-1.5"
        style={{
          background: `linear-gradient(180deg, ${accent} 0%, ${withAlpha(accent, 0.15)} 100%)`,
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-7 right-2 select-none text-[7rem] font-black leading-none text-white/[0.06]"
      >
        {initials}
      </span>

      <div className="relative p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-white/55">
            Relate World
          </p>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${statusChip}`}
          >
            {statusLabel}
          </span>
        </div>

        <div className="mt-5 flex items-center gap-4">
          <span className="grid size-14 shrink-0 place-items-center rounded-full bg-white/10 text-lg font-black ring-1 ring-white/20">
            {initials}
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-xl font-black tracking-tight sm:text-2xl">
              {member.name}
            </h2>
            <p className="truncate text-sm text-white/60">
              {member.clubSlug ? (
                <Link
                  href={`/${member.clubSlug}`}
                  className="text-white/80 underline decoration-white/25 underline-offset-4 transition-colors hover:text-gold-500"
                >
                  {member.clubName ?? member.clubSlug}
                </Link>
              ) : (
                (member.clubName ?? "Relate")
              )}
              {member.teamId &&
                (SPORTS_TEAMS.some((t) => t.id === member.teamId) ? (
                  <>
                    {" · "}
                    <Link
                      href={`/sports/${member.teamId}`}
                      className="text-white/80 underline decoration-white/25 underline-offset-4 transition-colors hover:text-gold-500"
                    >
                      {member.teamName ?? member.teamId}
                    </Link>
                  </>
                ) : (
                  <>{" · "}{member.teamName ?? member.teamId}</>
                ))}
            </p>
          </div>
        </div>

        <dl className="mt-6 grid gap-5 border-t border-white/10 pt-5 sm:grid-cols-2">
          <div>
            <dt className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
              Membership ID
            </dt>
            <dd className="font-mono text-lg font-bold tracking-[0.15em] text-gold-500">
              {reference}
            </dd>
          </div>
          <div>
            <dt className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
              Valid from
            </dt>
            <dd className="font-mono text-sm font-semibold text-white/85">
              {member.joinedAt
                ? new Date(member.joinedAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "On registration"}
            </dd>
          </div>
        </dl>
      </div>

      {/* Tear-off stub: membership ID, barcode and a copy action. */}
      <div className="relative">
        <div aria-hidden className="mx-6 sm:mx-7 border-t border-dashed border-white/25" />
        <div className="flex items-end justify-between gap-4 px-6 py-4 sm:px-7">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">
              Member since · keep this ID
            </p>
            <p className="mt-1 font-mono text-xl font-bold tracking-[0.18em] text-gold-500">
              {reference}
            </p>
            <div aria-hidden className="mt-2 flex h-6 items-end gap-[3px]">
              {bars.map((w, i) => (
                <span
                  key={i}
                  className={i % 2 === 0 ? "bg-white/70" : "bg-transparent"}
                  style={{ width: `${w}px`, height: i % 5 === 0 ? "100%" : "78%" }}
                />
              ))}
            </div>
          </div>
          <CopyReference value={member.reference ?? member.id ?? ""} className="mb-1" />
        </div>
      </div>
    </div>
  );
}
