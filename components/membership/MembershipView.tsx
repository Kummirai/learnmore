import Link from "next/link";
import { LuArrowRight, LuUsers } from "react-icons/lu";
import { type Membership } from "@/lib/membership";
import { getRelateClub } from "@/constants/relate";

/** Legacy records predate auto-activation — map every status we've stored. */
const STATUS_LABELS: Record<string, { label: string; chip: string }> = {
  active: { label: "Active member", chip: "bg-gold-500 text-navy-dark" },
  accepted: { label: "Active member", chip: "bg-gold-500 text-navy-dark" },
  pending_interview: {
    label: "Under review",
    chip: "bg-white/10 text-white ring-1 ring-white/25",
  },
  rejected: {
    label: "Not active",
    chip: "bg-white/10 text-white/60 ring-1 ring-white/15",
  },
};

const initialsOf = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

/** "#13c5dd" + 0.4 → "#13c5dd66" (8-digit hex with alpha). */
const withAlpha = (hex: string, alpha: number) =>
  `${hex}${Math.round(alpha * 255)
    .toString(16)
    .padStart(2, "0")}`;

export default function MembershipView({ member }: { member: Membership | null }) {
  if (!member) {
    return (
      <section className="flex-1 px-4 py-16 bg-white">
        <div className="max-w-xl mx-auto text-center">
          <div className="mx-auto size-16 rounded-full flex items-center justify-center bg-gold-50 mb-5">
            <LuUsers className="text-2xl text-gold-700" />
          </div>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-cyan mb-2">
            Relate · Membership
          </p>
          <h1 className="text-3xl font-black tracking-tight text-navy mb-3">
            Your membership
          </h1>
          <p className="text-sm text-slate-gray mb-7 max-w-md mx-auto">
            No membership found on this device — membership is kept on the
            device you registered from. Register for a club and it will show
            up here straight away.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/join"
              className="inline-flex items-center justify-center gap-2 bg-navy text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-navy/90 transition-colors"
            >
              Register to join <LuArrowRight className="text-xs" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 border border-gray-200 text-navy px-6 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              Back to home
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const status =
    STATUS_LABELS[member.status ?? "active"] ?? STATUS_LABELS.active;
  const club = getRelateClub(member.clubSlug);
  const accent = club?.color ?? "#13c5dd";
  const initials = initialsOf(member.name) || "R";
  const joined = member.joinedAt ? new Date(member.joinedAt) : null;
  const joinedLabel =
    joined && !Number.isNaN(joined.getTime())
      ? joined.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : null;

  return (
    <section className="flex-1 px-4 py-14 bg-gradient-to-b from-alice-blue/70 via-white to-white">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-cyan mb-2">
            Relate · Membership
          </p>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-navy mb-2">
            Your membership
          </h1>
          <p className="text-sm text-slate-gray">
            {member.clubName ?? "Your club"} · kept up to date with your club
            leader.
          </p>
        </div>

        {/* Membership credential — club-coloured glow, gold reference. */}
        <div className="relative overflow-hidden rounded-3xl bg-navy-dark text-white shadow-xl ring-1 ring-white/10">
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background: `radial-gradient(130% 100% at 100% 0%, ${withAlpha(
                accent,
                0.45,
              )} 0%, transparent 58%)`,
            }}
          />
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-gold-500 via-gold-500/60 to-transparent"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-7 right-3 text-[7rem] font-black leading-none text-white/5 select-none"
          >
            {initials}
          </span>

          <div className="relative p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">
                Relate World
              </p>
              <span
                className={`shrink-0 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${status.chip}`}
              >
                {status.label}
              </span>
            </div>

            <div className="mt-5 flex items-center gap-4">
              <span className="grid size-14 shrink-0 place-items-center rounded-full bg-white/10 text-lg font-black ring-1 ring-white/20">
                {initials}
              </span>
              <div className="min-w-0">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight truncate">
                  {member.name}
                </h2>
                <p className="text-sm text-white/60 truncate">
                  {member.clubSlug ? (
                    <Link
                      href={`/${member.clubSlug}`}
                      className="text-white/75 hover:text-gold-500 transition-colors underline decoration-white/25 underline-offset-4"
                    >
                      {member.clubName ?? member.clubSlug}
                    </Link>
                  ) : (
                    member.clubName ?? "Relate"
                  )}
                  {member.teamId && (
                    <>
                      {" · "}
                      <Link
                        href={`/sports/${member.teamId}`}
                        className="text-white/75 hover:text-gold-500 transition-colors underline decoration-white/25 underline-offset-4"
                      >
                        {member.teamName ?? member.teamId}
                      </Link>
                    </>
                  )}
                </p>
              </div>
            </div>

            <dl className="mt-6 grid gap-5 border-t border-white/10 pt-5 sm:grid-cols-2">
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1.5">
                  Membership reference
                </dt>
                <dd className="font-mono text-lg font-bold tracking-[0.15em] text-gold-500">
                  #{member.reference ?? member.id}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1.5">
                  Member since
                </dt>
                <dd className="text-sm font-semibold text-white/85">
                  {joinedLabel ?? "—"}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {member.interests && member.interests.length > 0 && (
          <div className="mt-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-gray mb-3">
              Your interests
            </p>
            <div className="flex flex-wrap gap-2">
              {member.interests.map((interest) => (
                <span
                  key={interest}
                  className="text-xs font-semibold bg-white text-navy border border-gray-200 px-3 py-1.5 rounded-full"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-7 flex flex-col sm:flex-row gap-3">
          <Link
            href={
              member.teamId
                ? `/sports/${member.teamId}`
                : `/${member.clubSlug ?? ""}`
            }
            className="inline-flex items-center justify-center gap-2 bg-navy text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-navy/90 transition-colors"
          >
            {member.teamId ? "Open my team page" : "Open my club page"}{" "}
            <LuArrowRight className="text-xs" />
          </Link>
          <Link
            href="/join"
            className="inline-flex items-center justify-center gap-2 border border-gray-200 bg-white text-navy px-6 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            Join an activity
          </Link>
        </div>

        <p className="mt-6 text-center text-xs text-slate-gray">
          This copy is stored on this device; your leader holds the full
          record. Lost your device? Ask your leader to look you up by name.
        </p>
      </div>
    </section>
  );
}
