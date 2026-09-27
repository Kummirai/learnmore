import Link from "next/link";
import { LuArrowRight, LuUsers } from "react-icons/lu";
import { type Membership } from "@/lib/membership";

/** Legacy records predate auto-activation — map every status we've stored. */
const STATUS_LABELS: Record<string, { label: string; badge: string }> = {
  active: {
    label: "Active member",
    badge: "bg-gold-50 text-gold-700 border-gold-200",
  },
  accepted: {
    label: "Active member",
    badge: "bg-gold-50 text-gold-700 border-gold-200",
  },
  pending_interview: {
    label: "Under review",
    badge: "bg-alice-blue text-cyan border-cyan/20",
  },
  rejected: {
    label: "Not active",
    badge: "bg-gray-100 text-slate-gray border-gray-200",
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

  const status = STATUS_LABELS[member.status ?? "active"] ?? STATUS_LABELS.active;
  const joined = member.joinedAt
    ? new Date(member.joinedAt)
    : null;
  const joinedLabel =
    joined && !Number.isNaN(joined.getTime())
      ? joined.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : null;

  return (
    <section className="flex-1 px-4 py-16 bg-white">
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

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
            <div className="shrink-0 size-14 rounded-full bg-navy text-white flex items-center justify-center text-lg font-black">
              {initialsOf(member.name)}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-black text-navy truncate">
                {member.name}
              </h2>
              <p className="text-xs text-slate-gray">
                {member.age ? `${member.age} years` : "Member"}
                {member.gender ? ` · ${member.gender}` : ""}
              </p>
            </div>
            <span
              className={`shrink-0 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${status.badge}`}
            >
              {status.label}
            </span>
          </div>

          <dl className="pt-5 space-y-4 text-sm">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <dt className="text-[11px] font-bold uppercase tracking-widest text-slate-gray w-28 shrink-0">
                Club
              </dt>
              <dd className="font-semibold text-navy">
                {member.clubSlug ? (
                  <Link
                    href={`/${member.clubSlug}`}
                    className="text-cyan hover:underline"
                  >
                    {member.clubName ?? member.clubSlug}
                  </Link>
                ) : (
                  member.clubName ?? "—"
                )}
              </dd>
            </div>

            {member.teamId && (
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <dt className="text-[11px] font-bold uppercase tracking-widest text-slate-gray w-28 shrink-0">
                  Squad
                </dt>
                <dd className="font-semibold text-navy">
                  <Link
                    href={`/sports/${member.teamId}`}
                    className="text-cyan hover:underline"
                  >
                    {member.teamName ?? member.teamId}
                  </Link>
                  {member.sport ? (
                    <span className="text-slate-gray font-normal">
                      {" "}· {member.sport}
                    </span>
                  ) : null}
                </dd>
              </div>
            )}

            {member.interests && member.interests.length > 0 && (
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
                <dt className="text-[11px] font-bold uppercase tracking-widest text-slate-gray w-28 shrink-0">
                  Interests
                </dt>
                <dd className="flex flex-wrap gap-2">
                  {member.interests.map((interest) => (
                    <span
                      key={interest}
                      className="text-xs font-semibold bg-alice-blue text-cyan px-2.5 py-1 rounded-full"
                    >
                      {interest}
                    </span>
                  ))}
                </dd>
              </div>
            )}

            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <dt className="text-[11px] font-bold uppercase tracking-widest text-slate-gray w-28 shrink-0">
                Member since
              </dt>
              <dd className="font-semibold text-navy">
                {joinedLabel ?? "—"}
              </dd>
            </div>

            {(member.reference || member.id) && (
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <dt className="text-[11px] font-bold uppercase tracking-widest text-slate-gray w-28 shrink-0">
                  Reference
                </dt>
                <dd className="font-mono font-semibold text-navy">
                  #{member.reference ?? member.id}
                </dd>
              </div>
            )}
          </dl>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={member.teamId ? `/sports/${member.teamId}` : `/${member.clubSlug ?? ""}`}
            className="inline-flex items-center justify-center gap-2 bg-navy text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-navy/90 transition-colors"
          >
            {member.teamId ? "Open my team page" : "Open my club page"}{" "}
            <LuArrowRight className="text-xs" />
          </Link>
          <Link
            href="/join"
            className="inline-flex items-center justify-center gap-2 border border-gray-200 text-navy px-6 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
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
