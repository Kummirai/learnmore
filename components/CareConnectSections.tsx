import Image from "next/image";
import Link from "next/link";
import type { IconType } from "react-icons";
import {
  LuArrowRight,
  LuBadgeCheck,
  LuCalendarDays,
  LuCircleCheck,
  LuHandHeart,
  LuHeartHandshake,
  LuLeaf,
  LuMapPin,
  LuShieldCheck,
  LuSnowflake,
  LuSun,
  LuUsers,
} from "react-icons/lu";
import CareConnectGallery from "@/components/CareConnectGallery";

type Fact = {
  label: string;
  body: string;
  icon: IconType;
};

type Focus = {
  number: string;
  eyebrow: string;
  title: string;
  body: string;
  points: string[];
  icon: IconType;
  image: string;
  imageAlt: string;
  tint: string;
  ink: string;
  chip: string;
  chipInk: string;
};

type Moment = {
  period: string;
  title: string;
  status: string;
  items: string[];
  icon: IconType;
  tint: string;
  ink: string;
  chip: string;
  chipInk: string;
  pill: string;
  pillInk: string;
};

type Action = {
  icon: IconType;
  audience: string;
  title: string;
  body: string;
  cta: string;
  href: string;
  tint: string;
  ink: string;
  chip: string;
  chipInk: string;
};

const facts: Fact[] = [
  {
    label: "When",
    body: "First weekend of December, closing the March–November club year.",
    icon: LuCalendarDays,
  },
  {
    label: "The harvest",
    body: "Four seasonal outings per club; 50% of net surplus feeds the fund.",
    icon: LuLeaf,
  },
  {
    label: "How clubs choose",
    body: "A specific local need — never routine visits to funded institutions.",
    icon: LuMapPin,
  },
  {
    label: "Plan lock-in",
    body: "Proposals by end October or first week November, then reconciliation.",
    icon: LuShieldCheck,
  },
];

const focuses: Focus[] = [
  {
    number: "01",
    eyebrow: "Selection",
    title: "A need the club knows",
    body: "Every club researches, chooses and plans its own December focus around a concrete local need, such as families navigating a difficult season.",
    points: [
      "Clubs select the families and needs they can reach directly.",
      "Plans are built with local knowledge, not a central checklist.",
      "December outreach stays specific, personal and traceable.",
    ],
    icon: LuMapPin,
    image: "/images/care-connect/food-drive.jpg",
    imageAlt: "Hands passing food items across a distribution table",
    tint: "linear-gradient(150deg, #e7fbff 0%, #ffffff 70%)",
    ink: "#0a7e99",
    chip: "linear-gradient(135deg, #13c5dd 0%, #0fa3c4 100%)",
    chipInk: "#ffffff",
  },
  {
    number: "02",
    eyebrow: "Focus",
    title: "Direct, real-need care",
    body: "Clubs abstain from visiting established institutions that already receive government or external funding.",
    points: [
      "No duplication of support that already exists.",
      "Every rand and volunteer hour creates fresh impact.",
      "Care is delivered with dignity, confidentiality and respect.",
    ],
    icon: LuShieldCheck,
    image: "/images/care-connect/meal-packing.jpg",
    imageAlt: "Volunteers packing meal containers into bags",
    tint: "linear-gradient(150deg, #eaf4ff 0%, #ffffff 70%)",
    ink: "#0369a1",
    chip: "linear-gradient(135deg, #38bdf8 0%, #0369a1 100%)",
    chipInk: "#ffffff",
  },
  {
    number: "03",
    eyebrow: "Stewardship",
    title: "Plans locked, funds reconciled",
    body: "Stewardship runs through the whole year, not just the December weekend.",
    points: [
      "Programme and budget proposals by end October or first week November.",
      "November fund reconciliation before any outreach.",
      "Post-outing financial reports keep the harvest transparent.",
    ],
    icon: LuBadgeCheck,
    image: "/images/care-connect/hampers.jpg",
    imageAlt:
      "Volunteers filling paper grocery bags with food at an outdoor distribution point",
    tint: "linear-gradient(150deg, #fff8e3 0%, #ffffff 70%)",
    ink: "#8a680d",
    chip: "linear-gradient(135deg, #f4dfa0 0%, #f0b429 100%)",
    chipInk: "#0b192c",
  },
  {
    number: "04",
    eyebrow: "Harvest",
    title: "One weekend of direct care",
    body: "After November reconciliation, clubs execute their chosen outreach and close the club year together.",
    points: [
      "The year's pooled surplus becomes direct help for people in need.",
      "Clubs celebrate the official Year-End Club Program Close.",
    ],
    icon: LuHandHeart,
    image: "/images/care-connect/harvest-truck.jpg",
    imageAlt:
      "Volunteers unloading crates of fresh produce for a community food drive",
    tint: "linear-gradient(150deg, #e6f9f5 0%, #ffffff 70%)",
    ink: "#006666",
    chip: "linear-gradient(135deg, #14b8a6 0%, #008080 100%)",
    chipInk: "#ffffff",
  },
];

const moments: Moment[] = [
  {
    period: "December – February",
    title: "Summer setup",
    status: "Prepare",
    icon: LuSun,
    tint: "linear-gradient(150deg, #fff8e3 0%, #ffffff 70%)",
    ink: "#8a680d",
    chip: "linear-gradient(135deg, #f4dfa0 0%, #f0b429 100%)",
    chipInk: "#0b192c",
    pill: "#f0b429",
    pillInk: "#0b192c",
    items: [
      "Member enrollment and leader training for the new year.",
      "Agree the annual outing calendar for each club.",
      "Launch Smart Saver habits for the year ahead.",
    ],
  },
  {
    period: "March – August",
    title: "Autumn & winter outings",
    status: "Reports #1–2",
    icon: LuLeaf,
    tint: "linear-gradient(150deg, #e7fbff 0%, #ffffff 70%)",
    ink: "#0b6b7d",
    chip: "linear-gradient(135deg, #13c5dd 0%, #0fa3c4 100%)",
    chipInk: "#0b192c",
    pill: "#13c5dd",
    pillInk: "#0b192c",
    items: [
      "One Autumn and one Winter outing per club.",
      "A Post-Outing Financial Report after each outing.",
      "50% of net surplus to the fund, 25% central, 25% local.",
    ],
  },
  {
    period: "September – first week November",
    title: "Spring push & lock-in",
    status: "Reports #3–4",
    icon: LuSnowflake,
    tint: "linear-gradient(150deg, #eaf4ff 0%, #ffffff 70%)",
    ink: "#0369a1",
    chip: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
    chipInk: "#ffffff",
    pill: "#0369a1",
    pillInk: "#ffffff",
    items: [
      "Two Spring outings complete the season of reports.",
      "Formal programme and budget proposals locked in.",
      "November fund reconciliation follows ahead of outreach.",
    ],
  },
  {
    period: "First weekend of December",
    title: "Harvest & year-end close",
    status: "Care & Connect",
    icon: LuHandHeart,
    tint: "linear-gradient(150deg, #e6f9f5 0%, #ffffff 70%)",
    ink: "#006666",
    chip: "linear-gradient(135deg, #0d9488 0%, #006b6b 100%)",
    chipInk: "#ffffff",
    pill: "#008080",
    pillInk: "#ffffff",
    items: [
      "Clubs execute their chosen Care & Connect outreach.",
      "The year's harvest reaches people in genuine need.",
      "The official Year-End Club Program Close is celebrated.",
    ],
  },
];

const actions: Action[] = [
  {
    icon: LuUsers,
    audience: "Families",
    title: "Enroll your child or teen",
    body: "Join the next intake across Sprout Kids (6–8), Sprout Teens (9–12), Sprout Twins or Search Club.",
    cta: "Register for intake",
    href: "/enroll",
    tint: "linear-gradient(150deg, #e7fbff 0%, #ffffff 70%)",
    ink: "#0a7e99",
    chip: "linear-gradient(135deg, #13c5dd 0%, #0fa3c4 100%)",
    chipInk: "#ffffff",
  },
  {
    icon: LuHeartHandshake,
    audience: "Partners",
    title: "Partner with a club",
    body: "Give resources, skills or sponsorship toward a club's verified December outreach.",
    cta: "Partner with us",
    href: "/contact",
    tint: "linear-gradient(150deg, #fff8e3 0%, #ffffff 70%)",
    ink: "#8a680d",
    chip: "linear-gradient(135deg, #f4dfa0 0%, #f0b429 100%)",
    chipInk: "#0b192c",
  },
  {
    icon: LuLeaf,
    audience: "Volunteers",
    title: "Volunteer your time",
    body: "Mentor young savers, help with outings, or support clubs on the day.",
    cta: "Volunteer",
    href: "/offices",
    tint: "linear-gradient(150deg, #e6f9f5 0%, #ffffff 70%)",
    ink: "#006666",
    chip: "linear-gradient(135deg, #0d9488 0%, #006b6b 100%)",
    chipInk: "#ffffff",
  },
];

export default function CareConnectSections() {
  return (
    <>
      <section id="mission" className="reveal bg-stage px-4 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-ink">
                Relate, Care &amp; Connect Day
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-navy md:text-5xl">
                Turning a year of effort into direct, real-need care.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-slate-gray md:text-lg">
                Every first weekend of December, clubs gather a year of seasonal
                outings, personal saving and teamwork, and pour it directly into
                families and individuals facing genuine need. True to our
                mission, the day is about walking alongside people—not distant
                charity.
              </p>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-[0_18px_42px_rgba(11,25,44,0.14)]">
              <Image
                src="/images/care-connect/pantry-line.jpg"
                alt="Volunteers sorting canned goods and fresh produce for distribution"
                fill
                sizes="(max-width: 1024px) 100vw, 540px"
                className="object-cover"
              />
            </div>
          </div>

          <div className="reveal reveal-stagger mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {facts.map(({ label, body, icon: Icon }) => (
              <article
                key={label}
                className="stagger-item border-t-2 border-cyan/60 pt-5"
              >
                <span className="grid size-11 place-items-center rounded-2xl bg-[linear-gradient(135deg,#13c5dd_0%,#0fa3c4_100%)] text-xl text-white shadow-[0_6px_16px_rgba(15,163,196,0.28)]">
                  <Icon />
                </span>
                <h3 className="mt-4 font-display text-base font-bold leading-snug text-navy">
                  {label}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-gray">
                  {body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="standard"
        className="bg-white px-4 pt-16 pb-6 md:pt-24 md:pb-10"
      >
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-ink">
                How the day works
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-navy md:text-5xl">
                Four commitments. One local need.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-slate-gray md:text-base">
              Each club carries its own plan from selection to reconciliation,
              so December care is specific, honest and owned locally.
            </p>
          </div>
        </div>
      </section>

      {focuses.map((focus, index) => {
        const Icon = focus.icon;
        const imageRight = index % 2 === 1;
        return (
          <section
            key={focus.title}
            className="px-4 py-12 md:py-16"
            style={{ background: focus.tint }}
          >
            <div className="mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-2 md:gap-14">
              <div
                className={`reveal relative aspect-[4/3] overflow-hidden rounded-xl shadow-[0_18px_42px_rgba(11,25,44,0.14)] ${
                  imageRight ? "md:order-2" : ""
                }`}
              >
                <Image
                  src={focus.image}
                  alt={focus.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 560px"
                  className="object-cover"
                />
                <span
                  className="absolute bottom-4 left-4 grid size-11 place-items-center rounded-2xl text-xl shadow-sm"
                  style={{
                    background: focus.chip,
                    color: focus.chipInk,
                  }}
                >
                  <Icon />
                </span>
              </div>
              <div className="reveal">
                <div className="flex items-baseline gap-4">
                  <span
                    className="font-display text-4xl font-black leading-none md:text-5xl"
                    style={{ color: focus.ink, opacity: 0.22 }}
                  >
                    {focus.number}
                  </span>
                  <p
                    className="text-xs font-semibold uppercase tracking-[0.2em]"
                    style={{ color: focus.ink }}
                  >
                    {focus.eyebrow}
                  </p>
                </div>
                <h3 className="mt-3 font-display text-2xl font-bold tracking-tight text-navy md:text-4xl">
                  {focus.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-gray md:text-base">
                  {focus.body}
                </p>
                <ul className="mt-5 space-y-3">
                  {focus.points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-3 text-sm leading-relaxed text-navy"
                    >
                      <LuCircleCheck
                        className="mt-0.5 shrink-0"
                        style={{ color: focus.ink }}
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        );
      })}

      <section id="season" className="bg-stage px-4 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-ink">
              How the year moves
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-navy md:text-5xl">
              One club season, four giving moments.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-gray md:text-lg">
              The Care &amp; Connect fund follows the March–November club
              season, from summer setup through four seasonal outings to the
              December harvest and official year-end close.
            </p>
          </div>

          <div className="relative mt-12 md:mt-16">
            <div className="absolute top-2 bottom-2 left-[23px] hidden w-px bg-line md:block" />
            <ol className="reveal reveal-stagger space-y-5 md:space-y-6">
              {moments.map((moment, index) => {
                const Icon = moment.icon;
                return (
                  <li
                    key={moment.title}
                    className="stagger-item relative md:pl-20"
                  >
                    <span
                      className="relative z-10 mb-4 grid size-12 place-items-center rounded-full border-4 border-stage text-xl shadow-[0_8px_18px_rgba(11,25,44,0.16)] md:absolute md:top-6 md:left-0 md:mb-0"
                      style={{
                        background: moment.chip,
                        color: moment.chipInk,
                      }}
                    >
                      <Icon />
                    </span>
                    <div
                      className="relative overflow-hidden rounded-3xl border border-line p-5 shadow-[0_1px_3px_rgba(11,25,44,0.05)] transition-[box-shadow,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-line hover:shadow-[0_22px_44px_rgba(11,25,44,0.12)] md:p-7"
                      style={{ background: moment.tint }}
                    >
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-y-0 left-0 w-1.5 select-none"
                        style={{ background: moment.chip }}
                      />
                      <span
                        aria-hidden
                        className="pointer-events-none absolute top-3 right-5 font-display text-6xl font-black leading-none select-none"
                        style={{ color: moment.ink, opacity: 0.1 }}
                      >
                        {index + 1}
                      </span>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        <span
                          className="text-[11px] font-bold uppercase tracking-[0.16em]"
                          style={{ color: moment.ink }}
                        >
                          {moment.period}
                        </span>
                        <span
                          className="rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide"
                          style={{
                            background: moment.pill,
                            color: moment.pillInk,
                          }}
                        >
                          {moment.status}
                        </span>
                      </div>
                      <h3 className="mt-2 font-display text-xl font-bold text-navy md:text-2xl">
                        {moment.title}
                      </h3>
                      <ul className="mt-4 space-y-2.5">
                        {moment.items.map((item) => (
                          <li
                            key={item}
                            className="flex gap-2.5 text-sm leading-relaxed text-slate-gray"
                          >
                            <LuCalendarDays
                              className="mt-0.5 shrink-0"
                              style={{ color: moment.ink }}
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>

      <section id="gallery" className="bg-white px-4 py-16 md:py-24">
        <CareConnectGallery />
      </section>

      <section id="get-involved" className="bg-stage px-4 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="reveal flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-ink">
                Get involved
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-navy md:text-5xl">
                Walk alongside our clubs.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-slate-gray md:text-base">
              Families, volunteers, partners and clubs all have a place in
              December&apos;s harvest.
            </p>
          </div>

          <div className="reveal reveal-stagger mt-10 grid gap-5 md:grid-cols-3">
            {actions.map(
              ({
                icon: Icon,
                audience,
                title,
                body,
                cta,
                href,
                tint,
                ink,
                chip,
                chipInk,
              }) => (
                <article
                  key={title}
                  className="stagger-item group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line p-6 shadow-[0_1px_3px_rgba(11,25,44,0.05)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_22px_44px_rgba(11,25,44,0.14)] md:p-7"
                  style={{ background: tint }}
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 left-0 w-1.5 select-none"
                    style={{ background: chip }}
                  />
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className="grid size-12 place-items-center rounded-2xl text-2xl"
                      style={{ background: chip, color: chipInk }}
                    >
                      <Icon />
                    </span>
                    <span
                      className="pt-1 text-[10px] font-bold uppercase tracking-[0.2em]"
                      style={{ color: ink }}
                    >
                      {audience}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-xl font-bold leading-snug text-navy md:text-2xl">
                    {title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-slate-gray">
                    {body}
                  </p>
                  <div className="mt-auto pt-6">
                    <Link
                      href={href}
                      className="btn-pill w-full text-white transition-[filter] duration-200 hover:brightness-110"
                      style={{ backgroundColor: ink }}
                    >
                      {cta} <LuArrowRight />
                    </Link>
                  </div>
                </article>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="bg-navy px-4 py-16 text-white md:py-24">
        <div className="mx-auto flex max-w-5xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-light">
              Serve with us
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
              Care grows stronger together.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/80 md:text-base">
              Join a club or talk to us about how you can help turn a year of
              saving into one weekend of real care.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/join" className="btn-pill btn-light">
              Join a club <LuArrowRight />
            </Link>
            <Link href="/contact" className="btn-pill btn-outline-light">
              Talk to us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
