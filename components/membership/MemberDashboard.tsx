import Link from "next/link";
import {
  LuArrowRight,
  LuCalendarDays,
  LuCheck,
  LuExternalLink,
  LuMapPin,
  LuPencil,
  LuUsers,
} from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa";
import { type Membership } from "@/lib/membership";
import { getRelateClub, SPORTS_TEAMS } from "@/constants/relate";
import { getSquad } from "@/constants/squads";
import MembershipCard from "./MembershipCard";
import MembershipBenefits from "./MembershipBenefits";
import MembershipFaq from "./MembershipFaq";
import {
  STATUS_LABELS,
  formatDate,
  formatFixtureDate,
  withAlpha,
} from "./shared";

type StepState = "done" | "current" | "next";

type Step = { state: StepState; title: string; body: string };

const TIMELINE: Record<string, Step[]> = {
  done: [
    {
      state: "done",
      title: "Registered",
      body: "Your details reached Relate and a membership reference was issued in your name.",
    },
    {
      state: "done",
      title: "Membership active",
      body: "You're on the club roll straight away — no waiting list and nothing to pay.",
    },
    {
      state: "current",
      title: "Meet your leader",
      body: "Your leader messages on WhatsApp with the time and venue for your first gathering.",
    },
    {
      state: "next",
      title: "Settle into the rhythm",
      body: "Weekly gatherings, the monthly Club Gathering on the second Friday, and squad training if you've joined one.",
    },
  ],
  wait: [
    {
      state: "done",
      title: "Application received",
      body: "Your details are with your club leader and your reference is reserved.",
    },
    {
      state: "current",
      title: "Leader reviewing",
      body: "Your leader checks the details on the record. Watch WhatsApp for a message.",
    },
    {
      state: "next",
      title: "Welcome call or interview",
      body: "A short chat to meet you, answer questions and set your first gathering date.",
    },
    {
      state: "next",
      title: "Membership goes active",
      body: "Your card flips to active and everything in the club opens up.",
    },
  ],
  off: [
    {
      state: "done",
      title: "Application on file",
      body: "We still hold the details you sent, under your reference.",
    },
    {
      state: "current",
      title: "Speak to your leader",
      body: "Your leader can explain where things stand and what to do next.",
    },
    {
      state: "next",
      title: "Register again",
      body: "Run through the join form with updated details — it takes about two minutes.",
    },
  ],
};

function Field({
  label,
  caption,
  children,
}: {
  label: string;
  caption?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-gray">
        {label}
      </dt>
      <dd className="mt-1.5 text-[15px] font-semibold text-navy">{children}</dd>
      {caption && <p className="mt-0.5 text-xs text-slate-gray">{caption}</p>}
    </div>
  );
}

export default function MemberDashboard({ member }: { member: Membership }) {
  const status =
    STATUS_LABELS[member.status ?? "active"] ?? STATUS_LABELS.active;
  const club = getRelateClub(member.clubSlug);
  const accent = club?.color ?? "#13c5dd";
  const accentDark = club?.colorDark ?? "#0fa3c4";
  const joinedLabel = formatDate(member.joinedAt);
  const reference = member.reference ?? member.id ?? "—";

  const team = member.teamId
    ? SPORTS_TEAMS.find((t) => t.id === member.teamId)
    : undefined;
  const squad = member.teamId ? getSquad(member.teamId) : undefined;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nextFixture =
    squad?.fixtures.find(
      (f) => new Date(`${f.date}T00:00:00`).getTime() >= today.getTime(),
    ) ?? squad?.fixtures[0];

  const steps = TIMELINE[status.tone] ?? TIMELINE.done;
  const clubPageHref = member.clubSlug ? `/${member.clubSlug}` : "/join";

  const meta = [
    { label: "Reference", value: `#${reference}`, accent: true },
    { label: "Member since", value: joinedLabel ?? "On registration" },
    { label: "Club", value: member.clubName ?? club?.name ?? "Relate" },
    {
      label: "Squad",
      value: member.teamName ?? team?.name ?? "No squad yet",
    },
  ];

  return (
    <>
      {/* ── Identity header ─────────────────────────────────────────── */}
      <section className="relative bg-navy-dark text-white">
        <div aria-hidden className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(115% 90% at 88% 6%, ${withAlpha(
                accent,
                0.4,
              )} 0%, transparent 62%)`,
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(118deg, rgba(255,255,255,0.55) 0 1px, transparent 1px 10px)",
              opacity: 0.07,
            }}
          />
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, #f0b429 32%, rgba(240,180,41,0.25) 68%, transparent 100%)",
            }}
          />
          <div
            className="absolute -left-28 top-4 size-80 rounded-full blur-3xl"
            style={{ backgroundColor: withAlpha(accent, 0.22) }}
          />
          <div className="absolute -right-16 bottom-0 size-72 rounded-full bg-navy-soft/50 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-28 md:pt-36 lg:pb-6">
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_auto] lg:gap-14">
            <div className="min-w-0">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-cyan-light">
                Relate · Membership record
              </p>
              <h1 className="mt-3 text-[clamp(2.35rem,7vw,4.25rem)] font-black leading-[0.95] tracking-[-0.03em]">
                {member.name}
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest ${status.chip}`}
                >
                  {status.label}
                </span>
                <p className="text-sm text-white/65">{status.note}</p>
              </div>

              <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-white/10 sm:grid-cols-4">
                {meta.map((item) => (
                  <div
                    key={item.label}
                    className="bg-white/[0.06] px-4 py-3"
                  >
                    <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
                      {item.label}
                    </dt>
                    <dd
                      className={`mt-1 truncate font-mono text-sm font-semibold ${
                        item.accent ? "text-gold-500" : "text-white"
                      }`}
                    >
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href={clubPageHref}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-navy transition-colors hover:bg-white/90"
                >
                  Open my club page <LuArrowRight className="text-xs" />
                </Link>
                {club?.whatsappGroupLink && (
                  <Link
                    href={club.whatsappGroupLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                  >
                    <FaWhatsapp className="text-base" /> Join the group
                    <LuExternalLink className="text-xs text-white/60" />
                  </Link>
                )}
              </div>
            </div>

            <div className="relative z-20 mx-auto w-full max-w-md lg:self-end lg:translate-y-16">
              <MembershipCard
                member={member}
                accent={accent}
                statusLabel={status.label}
                statusChip={status.chip}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── The record ──────────────────────────────────────────────── */}
      <section className="bg-white px-4 pb-16 pt-24 md:pt-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 max-w-2xl">
            <p className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-dark">
              Your record
            </p>
            <h2 className="text-3xl font-black tracking-tight text-navy md:text-4xl">
              Everything your leader has on file
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-gray">
              This is the copy kept on this device, exactly as you gave it when
              you registered. Your leader holds the same record — if something
              looks wrong, change it and they&rsquo;ll see it too.
            </p>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_1px_2px_rgba(21,31,58,0.05)] md:p-8">
            <dl className="grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Full name">{member.name}</Field>
              <Field
                label="Age"
                caption={
                  club ? `Club age band · ${club.ageRange}` : undefined
                }
              >
                {member.age ? `${member.age} years` : "—"}
              </Field>
              <Field label="Gender">
                {member.gender
                  ? member.gender.charAt(0).toUpperCase() +
                    member.gender.slice(1)
                  : "—"}
              </Field>
              <Field label="WhatsApp" caption="How your leader reaches you">
                <span className="font-mono">{member.phone ?? "—"}</span>
              </Field>
              <Field label="Area" caption="Neighbourhood you registered from">
                {member.area || "—"}
              </Field>
              <Field
                label="Club"
                caption={
                  club ? `${club.group} · ${club.ageRange}` : "Relate member"
                }
              >
                {member.clubSlug ? (
                  <Link
                    href={`/${member.clubSlug}`}
                    className="text-navy underline decoration-gold-400 decoration-2 underline-offset-4 transition-colors hover:text-cyan-dark"
                  >
                    {member.clubName ?? club?.name ?? member.clubSlug}
                  </Link>
                ) : (
                  (member.clubName ?? "Relate")
                )}
              </Field>
              <Field
                label="Squad"
                caption={team ? `${team.sport} · ${team.initials}` : "Optional"}
              >
                {member.teamId ? (
                  <Link
                    href={`/sports/${member.teamId}`}
                    className="text-navy underline decoration-gold-400 decoration-2 underline-offset-4 transition-colors hover:text-cyan-dark"
                  >
                    {member.teamName ?? team?.name ?? member.teamId}
                  </Link>
                ) : (
                  <span className="text-slate-gray">Not in a squad yet</span>
                )}
              </Field>
              <Field label="Membership reference" caption="Quote it to your leader">
                <span className="font-mono tracking-[0.12em] text-gold-700">
                  #{reference}
                </span>
              </Field>
              <Field label="Member since">
                {joinedLabel ?? "—"}
              </Field>
              <Field label="Status" caption={status.note}>
                <span
                  className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${status.chipLight}`}
                >
                  {status.label}
                </span>
              </Field>
              <Field
                label="Record ID"
                caption="Administrative ID — quote with your reference"
              >
                <span className="break-all font-mono text-xs font-medium text-slate-gray">
                  {member.id ?? "—"}
                </span>
              </Field>
            </dl>

            <div className="mt-8 border-t border-gray-100 pt-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-gray">
                Interests you picked
              </p>
              {member.interests && member.interests.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {member.interests.map((interest) => (
                    <span
                      key={interest}
                      className="rounded-full border border-gray-200 bg-alice-blue px-3 py-1.5 text-xs font-semibold text-navy"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-slate-gray">
                  Nothing recorded yet —{" "}
                  <Link
                    href="/join"
                    className="font-semibold text-navy underline decoration-gold-400 decoration-2 underline-offset-4"
                  >
                    add them when you update your details
                  </Link>
                  .
                </p>
              )}
            </div>
          </div>

          <p className="mt-5 max-w-2xl text-xs leading-relaxed text-slate-gray">
            This copy is stored on this device; your leader holds the full
            record. Lost your device? Ask your leader to look you up by name or
            by your reference.
          </p>
        </div>
      </section>

      {/* ── Status, next steps, squad ───────────────────────────────── */}
      <section className="bg-alice-blue px-4 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
            <div className="rounded-3xl border border-white bg-white p-6 shadow-[0_1px_2px_rgba(21,31,58,0.05)] md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="mb-1 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-dark">
                    Status &amp; next steps
                  </p>
                  <h2 className="text-2xl font-black tracking-tight text-navy">
                    Where your membership is right now
                  </h2>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest ${status.chipLight}`}
                >
                  {status.label}
                </span>
              </div>

              <ol className="mt-8">
                {steps.map((step, i) => (
                  <li key={step.title} className="relative flex gap-4 pb-7 last:pb-0">
                    {i < steps.length - 1 && (
                      <span
                        aria-hidden
                        className="absolute left-[15px] top-8 h-[calc(100%-1.75rem)] w-px bg-navy/10"
                      />
                    )}
                    <span
                      className={`relative z-10 grid size-8 shrink-0 place-items-center rounded-full text-xs font-black ${
                        step.state === "done"
                          ? "bg-gold-500 text-navy-dark"
                          : step.state === "current"
                            ? "bg-white text-cyan-dark ring-2 ring-cyan"
                            : "bg-white text-slate-gray ring-1 ring-gray-200"
                      }`}
                    >
                      {step.state === "done" ? (
                        <LuCheck className="text-sm" />
                      ) : (
                        i + 1
                      )}
                    </span>
                    <div className="pt-1">
                      <p
                        className={`text-sm font-bold ${
                          step.state === "next" ? "text-slate-gray" : "text-navy"
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className="mt-0.5 text-sm leading-relaxed text-slate-gray">
                        {step.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-8 flex flex-wrap gap-3 border-t border-gray-100 pt-6">
                <Link
                  href="/join"
                  className="inline-flex items-center gap-2 rounded-xl bg-navy px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy/90"
                >
                  <LuPencil className="text-xs" /> Update my details
                </Link>
                <Link
                  href="/events"
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-navy transition-colors hover:bg-gray-50"
                >
                  <LuCalendarDays className="text-xs" /> Club events
                </Link>
                {team ? (
                  <Link
                    href={`/sports/${team.id}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-navy transition-colors hover:bg-gray-50"
                  >
                    <LuUsers className="text-xs" /> My team page
                  </Link>
                ) : (
                  <Link
                    href="/sports"
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-navy transition-colors hover:bg-gray-50"
                  >
                    <LuUsers className="text-xs" /> Browse squads
                  </Link>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-white bg-white p-6 shadow-[0_1px_2px_rgba(21,31,58,0.05)] md:p-8">
              {team ? (
                <>
                  <p className="mb-1 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-dark">
                    Your squad
                  </p>
                  <h2 className="text-2xl font-black tracking-tight text-navy">
                    {team.name}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-gray">
                    {team.tagline}
                  </p>

                  <div className="mt-5 flex items-center gap-3 rounded-xl bg-alice-blue px-4 py-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-navy ring-1 ring-navy/10">
                      <LuUsers className="text-sm" />
                    </span>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-gray">
                        Head coach
                      </p>
                      <p className="text-sm font-bold text-navy">
                        {squad?.coach.name ?? "To be confirmed"}
                      </p>
                    </div>
                  </div>

                  {nextFixture && (
                    <div className="mt-4 rounded-xl border border-gold-200 bg-gold-50 px-4 py-4">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-700">
                        Next fixture
                      </p>
                      <p className="mt-1.5 font-mono text-sm font-bold text-navy">
                        {formatFixtureDate(nextFixture.date)} ·{" "}
                        {nextFixture.time}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-navy">
                        vs {nextFixture.opponent}
                        {nextFixture.home ? " · Home" : " · Away"}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-gray">
                        <LuMapPin className="text-xs" />
                        {nextFixture.venue} · {nextFixture.competition}
                      </p>
                    </div>
                  )}

                  <Link
                    href={`/sports/${team.id}`}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-navy transition-colors hover:text-cyan-dark"
                  >
                    Open the {team.name} page{" "}
                    <LuArrowRight className="text-xs" />
                  </Link>
                </>
              ) : club ? (
                <>
                  <p className="mb-1 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-dark">
                    Your club
                  </p>
                  <h2 className="text-2xl font-black tracking-tight text-navy">
                    {club.name}
                  </h2>
                  <p className="mt-1 text-sm font-semibold text-cyan-dark">
                    {club.tagline}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-gray">
                    {club.description}
                  </p>

                  <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-gray">
                    What {club.name} runs
                  </p>
                  <ul className="mt-2 grid gap-2">
                    {club.programs.slice(0, 4).map((program) => (
                      <li
                        key={program.name}
                        className="flex items-start gap-2 text-sm text-navy"
                      >
                        <span
                          className="mt-1.5 size-1.5 shrink-0 rounded-full"
                          style={{ backgroundColor: accentDark }}
                        />
                        <span>
                          <strong className="font-bold">{program.name}</strong>{" "}
                          <span className="text-slate-gray">
                            — {program.blurb}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href={`/${club.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-bold text-navy transition-colors hover:text-cyan-dark"
                    >
                      Open the {club.name} page{" "}
                      <LuArrowRight className="text-xs" />
                    </Link>
                    {club.whatsappGroupLink && (
                      <Link
                        href={club.whatsappGroupLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-bold text-navy transition-colors hover:text-cyan-dark"
                      >
                        <FaWhatsapp className="text-base" /> WhatsApp group
                      </Link>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <p className="mb-1 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-dark">
                    Your club
                  </p>
                  <h2 className="text-2xl font-black tracking-tight text-navy">
                    {member.clubName ?? "Relate"}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate-gray">
                    No club page is linked to this record yet. Register for a
                    club and everything it runs — gatherings, squads, season
                    guides — appears here.
                  </p>
                  <Link
                    href="/join"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-navy transition-colors hover:text-cyan-dark"
                  >
                    Register for a club <LuArrowRight className="text-xs" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <MembershipBenefits
        accent={accent}
        accentDark={accentDark}
        clubSlug={member.clubSlug}
      />
      <MembershipFaq />
    </>
  );
}
