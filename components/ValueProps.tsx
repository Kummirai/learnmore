import Link from "next/link";
import {
  LuArrowRight,
  LuBadgeCheck,
  LuGraduationCap,
  LuHandHeart,
  LuMessageCircleHeart,
  LuSun,
  LuUsers,
} from "react-icons/lu";

const points = [
  {
    icon: LuGraduationCap,
    title: "Skills for every season",
    body: "Life skills, mentoring and career guidance — from school support to CV writing and financial literacy.",
    href: "/join",
    cta: "Find your club",
  },
  {
    icon: LuUsers,
    title: "A club for every age",
    body: "Children, young adults, singles, single parents and couples — from 6 to 60+, everyone finds their crew.",
    href: "/#clubs",
    cta: "See the clubs",
  },
  {
    icon: LuSun,
    title: "A daily spiritual rhythm",
    body: "Six prayer times from dawn to evening, a verse for every day, and season guides for every age.",
    href: "/prayer",
    cta: "Today's prayer",
  },
  {
    icon: LuMessageCircleHeart,
    title: "Real community",
    body: "A WhatsApp group with weekly meetups — not a mailing list. Small-group leaders walk with you.",
    href: "/events",
    cta: "See what's on",
  },
  {
    icon: LuBadgeCheck,
    title: "Free to join, always",
    body: "Every club, program and prayer time is free. Sponsorship covers school fees, uniforms and meals for families who need a hand.",
    href: "/join",
    cta: "Join free",
  },
  {
    icon: LuHandHeart,
    title: "Support when life gets hard",
    body: "Food relief, school fees, uniforms, childcare and counselling — ask for help and someone walks with you.",
    href: "/requests",
    cta: "Ask for help",
  },
];

export default function ValueProps() {
  return (
    <section
      className={
        "reveal reveal-stagger bg-white px-6 py-24 md:px-4 md:py-32"
      }
    >
      <div className={"max-w-6xl mx-auto"}>
        <div className={"mx-auto max-w-2xl text-center"}>
          <span
            className={
              "inline-flex items-center justify-center rounded-full border border-line bg-tile px-4 py-1.5 text-sm font-medium text-navy"
            }
          >
            What Relate does
          </span>
          <h2
            className={
              "mt-6 text-3xl font-semibold text-navy sm:text-4xl md:text-5xl"
            }
          >
            Grow in every area of life
          </h2>
          <p
            className={
              "mx-auto mt-3 max-w-[530px] text-sm text-navy/60 md:text-base"
            }
          >
            Practical skills, real community and a daily spiritual rhythm — for
            every age and season of life.
          </p>
        </div>

        <div
          className={
            "mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line shadow-sm shadow-navy/5 sm:grid-cols-2 md:grid-cols-3"
          }
        >
          {points.map(({ icon: Icon, title, body, href, cta }) => (
            <div
              key={title}
              className={
                "stagger-item flex flex-col items-start bg-white px-6 py-8 transition-colors hover:bg-tile"
              }
            >
              <div
                className={
                  "mb-8 grid size-12 place-items-center rounded-xl border border-line bg-white text-navy shadow-sm"
                }
              >
                <Icon className={"size-5"} />
              </div>
              <h3 className={"text-base font-semibold text-navy"}>{title}</h3>
              <p
                className={
                  "mt-2.5 text-sm leading-relaxed text-navy/60"
                }
              >
                {body}
              </p>
              <Link
                href={href}
                className={
                  "group/link mt-auto flex items-center gap-1.5 pt-6 text-sm font-medium text-cyan-ink transition-colors hover:text-navy"
                }
              >
                {cta}
                <LuArrowRight
                  className={
                    "size-4 transition-transform group-hover/link:translate-x-0.5"
                  }
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
