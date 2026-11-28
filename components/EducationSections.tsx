import Image from "next/image";
import Link from "next/link";
import type { IconType } from "react-icons";
import {
  LuArrowRight,
  LuBadgeCheck,
  LuBookOpen,
  LuCalendarDays,
  LuCircleCheck,
  LuGraduationCap,
  LuHandHeart,
  LuLeaf,
  LuShieldCheck,
  LuSnowflake,
  LuSun,
  LuUsers,
} from "react-icons/lu";

type Principle = {
  title: string;
  body: string;
  icon: IconType;
};

type Pillar = {
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

type Season = {
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

const principles: Principle[] = [
  {
    title: "Compassionate Empowerment",
    body: "Lead with empathy while activating each learner's own agency and voice.",
    icon: LuHandHeart,
  },
  {
    title: "Dignity & Respect",
    body: "Protect privacy, culture, autonomy and confidentiality, and listen actively.",
    icon: LuShieldCheck,
  },
  {
    title: "Integrity & Stewardship",
    body: "Stay transparent and accountable with financial, material and human resources.",
    icon: LuBadgeCheck,
  },
  {
    title: "Sustainability & Self-Reliance",
    body: "Favour practical habits, skills and opportunities that build lasting independence.",
    icon: LuLeaf,
  },
  {
    title: "Community & Partnership",
    body: "Work with volunteer teachers, mentors, families and learning institutions.",
    icon: LuUsers,
  },
];

const pillars: Pillar[] = [
  {
    number: "01",
    eyebrow: "Tools",
    title: "Relate School Kit",
    body: "Keep essential classroom tools in learners' hands responsibly and sustainably.",
    points: [
      "Term 2 launches in April, after enrollment and induction settle, and runs through November.",
      "Year 1 stays stationery-only: 32-page A4 exercise books, HB pencils for Sprout Kids and ballpoint pens for Sprout Teens.",
      "Batch marks and show-to-swap renewals: about 3–4 weeks for pencils, 4–6 weeks for pens and 4–8 weeks for exercise books.",
      "A November exam-prep stationery check makes sure learners have working writing tools.",
    ],
    icon: LuBookOpen,
    image: "/images/education/school-kit.jpg",
    imageAlt: "Learners writing in exercise books with pencils during a class",
    tint: "linear-gradient(150deg, #e7fbff 0%, #ffffff 70%)",
    ink: "#0a7e99",
    chip: "linear-gradient(135deg, #13c5dd 0%, #0fa3c4 100%)",
    chipInk: "#ffffff",
  },
  {
    number: "02",
    eyebrow: "People",
    title: "Relate Peer Learning",
    body: "Grow academic confidence, peer support and cross-age connection.",
    points: [
      "Starts in April at the opening of Term 2, alongside Relate School Kit.",
      "Older buddies support younger learners, such as Sprout Teens helping Sprout Kids with homework, reading and everyday school tasks.",
      "Homework Weekend study and connection sessions are backed by light WhatsApp coordination for schedules and quick check-ins.",
    ],
    icon: LuUsers,
    image: "/images/education/peer-learning.jpg",
    imageAlt: "Older learners sharing books and helping each other read",
    tint: "linear-gradient(150deg, #eaf4ff 0%, #ffffff 70%)",
    ink: "#0369a1",
    chip: "linear-gradient(135deg, #38bdf8 0%, #0369a1 100%)",
    chipInk: "#ffffff",
  },
  {
    number: "03",
    eyebrow: "Revision",
    title: "Relate Exam Prep",
    body: "Make end-of-year exam readiness practical, focused and engaging.",
    points: [
      "Runs in Spring, October to November, with volunteer teachers guiding structured revision and practice.",
      "Quick-fire drills, flashcards and timed mini-checks keep revision lively.",
      "Works alongside the November exam-prep stationery check.",
    ],
    icon: LuGraduationCap,
    image: "/images/education/exam-prep.jpg",
    imageAlt: "Learners concentrating on revision work at their desks",
    tint: "linear-gradient(150deg, #fff8e3 0%, #ffffff 70%)",
    ink: "#8a680d",
    chip: "linear-gradient(135deg, #f4dfa0 0%, #f0b429 100%)",
    chipInk: "#0b192c",
  },
  {
    number: "04",
    eyebrow: "Next steps",
    title: "Relate Launchpad",
    body: "Give older youth in Search Club year-round support as they move into higher study, skills training and life transitions.",
    points: [
      "Career guidance, advising and life coaching to align strengths and skills with future goals.",
      "Help applying to universities and skills pathways, including BYU, ALX Africa and GetSkills.",
      "Application clinics, document and eligibility checks, and interview preparation.",
    ],
    icon: LuBadgeCheck,
    image: "/images/education/launchpad.jpg",
    imageAlt:
      "A young man reviewing study and application documents beside a laptop",
    tint: "linear-gradient(150deg, #e6f9f5 0%, #ffffff 70%)",
    ink: "#006666",
    chip: "linear-gradient(135deg, #14b8a6 0%, #008080 100%)",
    chipInk: "#ffffff",
  },
];

const seasons: Season[] = [
  {
    period: "December – February",
    title: "Summer intake",
    status: "Prepare",
    icon: LuSun,
    tint: "linear-gradient(150deg, #fff8e3 0%, #ffffff 70%)",
    ink: "#8a680d",
    chip: "linear-gradient(135deg, #f4dfa0 0%, #f0b429 100%)",
    chipInk: "#0b192c",
    pill: "#f0b429",
    pillInk: "#0b192c",
    items: [
      "Member enrollment and registration after the first-weekend December close.",
      "Prepare School Kit stock, batch marks and renewal logs.",
      "Form buddy pairings and map Launchpad intake windows.",
    ],
  },
  {
    period: "March – May",
    title: "Autumn launch",
    status: "Term 2",
    icon: LuLeaf,
    tint: "linear-gradient(150deg, #e7fbff 0%, #ffffff 70%)",
    ink: "#0b6b7d",
    chip: "linear-gradient(135deg, #13c5dd 0%, #0fa3c4 100%)",
    chipInk: "#0b192c",
    pill: "#13c5dd",
    pillInk: "#0b192c",
    items: [
      "Induction, skills discovery and early readiness.",
      "April: launch School Kit swaps and Peer Learning Homework Weekends.",
      "Begin career advising and early application preparation.",
    ],
  },
  {
    period: "June – August",
    title: "Winter sustain",
    status: "Keep going",
    icon: LuSnowflake,
    tint: "linear-gradient(150deg, #eaf4ff 0%, #ffffff 70%)",
    ink: "#0369a1",
    chip: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
    chipInk: "#ffffff",
    pill: "#0369a1",
    pillInk: "#ffffff",
    items: [
      "Maintain School Kit swaps and Homework Weekends mid-year.",
      "Run application clinics, eligibility checks and life coaching check-ins.",
      "Prepare for interviews and assessments.",
    ],
  },
  {
    period: "September – first weekend December",
    title: "Spring close",
    status: "Exam prep",
    icon: LuGraduationCap,
    tint: "linear-gradient(150deg, #e6f9f5 0%, #ffffff 70%)",
    ink: "#006666",
    chip: "linear-gradient(135deg, #0d9488 0%, #006b6b 100%)",
    chipInk: "#ffffff",
    pill: "#008080",
    pillInk: "#ffffff",
    items: [
      "October–November: volunteer-led exam prep and Education Department flash activities.",
      "Complete the November exam-prep stationery check.",
      "Follow admissions and transitions before the Relate, Care & Connect Day close.",
    ],
  },
];

export default function EducationSections() {
  return (
    <>
      <section id="mission" className="reveal bg-stage px-5 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="mx-auto max-w-3xl text-center lg:mx-0 lg:text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-ink">
                Education Department
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-navy md:text-5xl">
                Help today that does not become a need for help tomorrow.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-slate-gray md:text-lg">
                We support learners across all clubs—without overloading club
                leaders. Everything is built around practical skills, long-term
                networks and independence.
              </p>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-[0_18px_42px_rgba(11,25,44,0.14)]">
              <Image
                src="/images/heroes/sprout_kids.webp"
                alt="Young learners taking part in a Relate World classroom activity"
                fill
                sizes="(max-width: 1024px) 100vw, 540px"
                className="object-cover"
              />
            </div>
          </div>

          <div className="reveal reveal-stagger mt-14 grid gap-x-8 gap-y-10 md:grid-cols-3 lg:grid-cols-5">
            {principles.map(({ title, body, icon: Icon }) => (
              <article
                key={title}
                className="stagger-item border-t-2 border-cyan/60 pt-5"
              >
                <span className="grid size-11 place-items-center rounded-2xl bg-[linear-gradient(135deg,#13c5dd_0%,#0fa3c4_100%)] text-xl text-white shadow-[0_6px_16px_rgba(15,163,196,0.28)]">
                  <Icon />
                </span>
                <h3 className="mt-4 font-display text-base font-bold leading-snug text-navy">
                  {title}
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
        id="pillars"
        className="bg-white px-5 pt-16 pb-6 sm:px-6 md:pt-24 md:pb-10"
      >
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="mx-auto max-w-2xl text-center md:mx-0 md:text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-ink">
                Our four education pillars
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-navy md:text-5xl">
                Four ways we help learners grow.
              </h2>
            </div>
            <p className="mx-auto max-w-md text-center text-sm leading-relaxed text-slate-gray md:mx-0 md:text-left md:text-base">
              Each pillar can stand on its own. Together they cover the tools,
              relationships, revision and next steps a learner needs.
            </p>
          </div>
        </div>
      </section>

      {pillars.map((pillar, index) => {
        const Icon = pillar.icon;
        const imageRight = index % 2 === 1;
        return (
          <section
            key={pillar.title}
            className="px-5 py-12 sm:px-6 md:py-16"
            style={{ background: pillar.tint }}
          >
            <div className="mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-2 md:gap-14">
              <div
                className={`reveal relative aspect-[4/3] overflow-hidden rounded-xl shadow-[0_18px_42px_rgba(11,25,44,0.14)] ${
                  imageRight ? "md:order-2" : ""
                }`}
              >
                <Image
                  src={pillar.image}
                  alt={pillar.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 560px"
                  className="object-cover"
                />
                <span
                  className="absolute bottom-4 left-4 grid size-11 place-items-center rounded-2xl text-xl shadow-sm"
                  style={{
                    background: pillar.chip,
                    color: pillar.chipInk,
                  }}
                >
                  <Icon />
                </span>
              </div>
              <div className="reveal text-center md:text-left">
                <div className="flex items-baseline justify-center gap-4 md:justify-start">
                  <span
                    className="font-display text-4xl font-black leading-none md:text-5xl"
                    style={{ color: pillar.ink, opacity: 0.22 }}
                  >
                    {pillar.number}
                  </span>
                  <p
                    className="text-xs font-semibold uppercase tracking-[0.2em]"
                    style={{ color: pillar.ink }}
                  >
                    {pillar.eyebrow}
                  </p>
                </div>
                <h3 className="mt-3 font-display text-2xl font-bold tracking-tight text-navy md:text-4xl">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-gray md:text-base">
                  {pillar.body}
                </p>
                <ul className="mt-5 space-y-3 text-left">
                  {pillar.points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-3 text-sm leading-relaxed text-navy"
                    >
                      <LuCircleCheck
                        className="mt-0.5 shrink-0"
                        style={{ color: pillar.ink }}
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

      <section id="season" className="bg-stage px-5 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center md:mx-0 md:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-ink">
              How the year moves
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-navy md:text-5xl">
              One club season, four learning moments.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-gray md:text-lg">
              The Education programme follows the March–November club season,
              with summer intake and readiness before it, and Relate, Care &amp;
              Connect Day plus the official year-end close on the first weekend
              of December.
            </p>
          </div>

          <div className="relative mt-12 md:mt-16">
            <div className="absolute top-2 bottom-2 left-[23px] hidden w-px bg-line md:block" />
            <ol className="reveal reveal-stagger space-y-5 md:space-y-6">
              {seasons.map((season, index) => {
                const Icon = season.icon;
                return (
                  <li
                    key={season.title}
                    className="stagger-item relative md:pl-20"
                  >
                    <span
                      className="relative z-10 mb-4 grid size-12 place-items-center rounded-full border-4 border-stage text-xl shadow-[0_8px_18px_rgba(11,25,44,0.16)] md:absolute md:top-6 md:left-0 md:mb-0"
                      style={{
                        background: season.chip,
                        color: season.chipInk,
                      }}
                    >
                      <Icon />
                    </span>
                    <div
                      className="relative overflow-hidden rounded-3xl border border-line p-5 shadow-[0_1px_3px_rgba(11,25,44,0.05)] transition-[box-shadow,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-line hover:shadow-[0_22px_44px_rgba(11,25,44,0.12)] md:p-7"
                      style={{ background: season.tint }}
                    >
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-y-0 left-0 w-1.5 select-none"
                        style={{ background: season.chip }}
                      />
                      <span
                        aria-hidden
                        className="pointer-events-none absolute top-3 right-5 font-display text-6xl font-black leading-none select-none"
                        style={{ color: season.ink, opacity: 0.1 }}
                      >
                        {index + 1}
                      </span>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        <span
                          className="text-[11px] font-bold uppercase tracking-[0.16em]"
                          style={{ color: season.ink }}
                        >
                          {season.period}
                        </span>
                        <span
                          className="rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide"
                          style={{
                            background: season.pill,
                            color: season.pillInk,
                          }}
                        >
                          {season.status}
                        </span>
                      </div>
                      <h3 className="mt-2 font-display text-xl font-bold text-navy md:text-2xl">
                        {season.title}
                      </h3>
                      <ul className="mt-4 space-y-2.5">
                        {season.items.map((item) => (
                          <li
                            key={item}
                            className="flex gap-2.5 text-sm leading-relaxed text-slate-gray"
                          >
                            <LuCalendarDays
                              className="mt-0.5 shrink-0"
                              style={{ color: season.ink }}
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

      <section className="bg-navy px-5 py-16 text-white sm:px-6 md:py-24">
        <div className="mx-auto flex max-w-5xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="mx-auto max-w-2xl text-center md:mx-0 md:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-light">
              Bring it into your club
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
              Learning grows stronger together.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/80 md:text-base">
              Volunteer teachers, mentors, families and learning institutions
              all have a place in this work. Join a club or talk to us about how
              to serve.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 sm:flex-row">
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
