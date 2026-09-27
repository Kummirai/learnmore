import Link from "next/link";
import { LuArrowRight, LuCheck, LuIdCard } from "react-icons/lu";
import { CLUBS, SUB_CLUBS } from "@/constants/relate";
import MembershipBenefits from "./MembershipBenefits";
import MembershipFaq from "./MembershipFaq";
import { barcodeBars, withAlpha } from "./shared";

const ACCENT = "#13c5dd";
const ACCENT_DARK = "#0fa3c4";

const STEPS = [
  {
    title: "Pick your club",
    body: "There's one for every season of life — children, teens, young adults, singles, couples and families. Age bands keep each club right for its members.",
  },
  {
    title: "Register in two minutes",
    body: "Your name, age, WhatsApp number, where you're from and what you're into. Under 18s add a parent or guardian, and everyone accepts the community standards.",
  },
  {
    title: "Card, ID, active",
    body: "Your membership ID is issued the moment you submit, your leader is notified, and this page becomes your membership dashboard.",
  },
];

export default function MembershipJoinPrompt() {
  const clubs = [...CLUBS, ...SUB_CLUBS];
  const ghostBars = barcodeBars("RELATEMEMBER");

  const meta = [
    { label: "Clubs", value: `${clubs.length} to pick from` },
    { label: "Cost", value: "Free — always" },
    { label: "Activation", value: "Instant" },
  ];

  return (
    <>
      {/* ── Header ──────────────────────────────────────────────────── */}
      <section className="relative bg-navy-dark text-white">
        <div aria-hidden className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(115% 90% at 88% 6%, ${withAlpha(
                ACCENT,
                0.38,
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
          <div className="absolute -left-28 top-4 size-80 rounded-full bg-cyan/20 blur-3xl" />
          <div className="absolute -right-16 bottom-0 size-72 rounded-full bg-navy-soft/50 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-28 md:pt-36 lg:pb-6">
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_auto] lg:gap-14">
            <div className="min-w-0">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-cyan-light">
                Relate · Membership
              </p>
              <h1 className="mt-3 text-[clamp(2.35rem,7vw,4.25rem)] font-black leading-[0.95] tracking-[-0.03em]">
                Your membership
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/70 md:text-base">
                A free record that follows you through Relate: your club, your
                squad, your interests and a membership ID your leader can look
                you up by. It starts the moment you register — and this page is
                where you keep it.
              </p>

              <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-white/10 sm:grid-cols-3">
                {meta.map((item) => (
                  <div key={item.label} className="bg-white/[0.06] px-4 py-3">
                    <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
                      {item.label}
                    </dt>
                    <dd className="mt-1 font-mono text-sm font-semibold text-white">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/join"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-navy transition-colors hover:bg-white/90"
                >
                  Register to join <LuArrowRight className="text-xs" />
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  See how it works
                </a>
              </div>
            </div>

            {/* Placeholder card — what they'll own once they register. */}
            <div className="relative z-20 mx-auto w-full max-w-md lg:self-end lg:translate-y-16">
              <div className="relative overflow-hidden rounded-[26px] border border-dashed border-white/25 bg-white/[0.05] p-6 sm:p-7">
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background: `radial-gradient(120% 95% at 100% 0%, ${withAlpha(
                      ACCENT,
                      0.22,
                    )} 0%, transparent 58%)`,
                  }}
                />
                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-white/45">
                      Relate World
                    </p>
                    <span className="shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white/55 ring-1 ring-white/20">
                      Your card
                    </span>
                  </div>

                  <div className="mt-5 flex items-center gap-4">
                    <span className="grid size-14 shrink-0 place-items-center rounded-full bg-white/10 text-white/45 ring-1 ring-white/20">
                      <LuIdCard className="text-xl" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-xl font-black tracking-tight text-white/45 sm:text-2xl">
                        Your name
                      </p>
                      <p className="truncate text-sm text-white/35">
                        Your club · your squad
                      </p>
                    </div>
                  </div>

                  <dl className="mt-6 grid gap-5 border-t border-white/10 pt-5 sm:grid-cols-2">
                    <div>
                      <dt className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
                        Membership ID
                      </dt>
                      <dd className="font-mono text-lg font-bold tracking-[0.15em] text-white/35">
                        #XXX0000
                      </dd>
                    </div>
                    <div>
                      <dt className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
                        Valid from
                      </dt>
                      <dd className="font-mono text-sm font-semibold text-white/35">
                        Your first day
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="relative">
                  <div
                    aria-hidden
                    className="mt-6 border-t border-dashed border-white/20"
                  />
                  <div className="flex items-end justify-between gap-4 px-0 pb-0 pt-4">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/35">
                        Member since · keep this ID
                      </p>
                      <p className="mt-1 font-mono text-xl font-bold tracking-[0.18em] text-white/35">
                        #XXX0000
                      </p>
                      <div aria-hidden className="mt-2 flex h-6 items-end gap-[3px]">
                        {ghostBars.map((w, i) => (
                          <span
                            key={i}
                            className={i % 2 === 0 ? "bg-white/25" : "bg-transparent"}
                            style={{
                              width: `${w}px`,
                              height: i % 5 === 0 ? "100%" : "78%",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="mb-1 inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-xs font-bold uppercase tracking-widest text-white/40">
                      <LuCheck className="text-sm" /> Yours
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────────── */}
      <section id="how-it-works" className="bg-white px-4 pb-16 pt-24 md:pt-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-2xl">
            <p className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-dark">
              How membership works
            </p>
            <h2 className="text-3xl font-black tracking-tight text-navy md:text-4xl">
              Three steps, about two minutes
            </h2>
          </div>

          <ol className="grid gap-6 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <li
                key={step.title}
                className="rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_1px_2px_rgba(21,31,58,0.05)]"
              >
                <span className="font-mono text-xs font-bold tracking-[0.2em] text-cyan-dark">
                  0{i + 1}
                </span>
                <h3 className="mt-3 text-lg font-black tracking-tight text-navy">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-gray">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-10">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-gray">
              Clubs you can register for
            </p>
            <div className="flex flex-wrap gap-2">
              {clubs.map((club) => (
                <Link
                  key={club.slug}
                  href={`/${club.slug}`}
                  className="group inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-navy transition-colors hover:border-navy/25 hover:bg-alice-blue"
                >
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: club.color }}
                  />
                  {club.name}
                  <span className="text-slate-gray">{club.ageRange}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <MembershipBenefits accent={ACCENT} accentDark={ACCENT_DARK} />
      <MembershipFaq />

      {/* ── Closing CTA ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-navy-dark px-4 py-16 text-white md:py-20">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `radial-gradient(100% 120% at 12% 0%, ${withAlpha(
              ACCENT,
              0.32,
            )} 0%, transparent 60%)`,
          }}
        />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-cyan-light">
            Ready when you are
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
            Claim your membership card
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70">
            Register for a club, keep your membership ID, and show up.
            Everything else — gatherings, squads, reading plans, the season
            ahead — is already waiting.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/join"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-navy transition-colors hover:bg-white/90"
            >
              Register to join <LuArrowRight className="text-xs" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Back to home
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
