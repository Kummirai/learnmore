import Link from "next/link";
import type { IconType } from "react-icons";
import {
  LuArrowRight,
  LuBookOpen,
  LuBadgeCheck,
  LuGraduationCap,
  LuUsers,
} from "react-icons/lu";

type Programme = {
  title: string;
  body: string;
  when: string;
  icon: IconType;
  chip: string;
  ink: string;
};

const programmes: Programme[] = [
  {
    title: "Relate School Kit",
    body: "Keeps essential classroom tools in learners' hands — year one stays stationery-only, renewed through batch marks and show-to-swap.",
    when: "April – November",
    icon: LuBookOpen,
    chip: "linear-gradient(135deg, #13c5dd 0%, #0fa3c4 100%)",
    ink: "#0a7e99",
  },
  {
    title: "Relate Peer Learning",
    body: "Older buddies support younger learners with homework, reading and everyday school tasks, backed by Homework Weekend sessions.",
    when: "From April",
    icon: LuUsers,
    chip: "linear-gradient(135deg, #38bdf8 0%, #0369a1 100%)",
    ink: "#0369a1",
  },
  {
    title: "Relate Exam Prep",
    body: "Structured revision, flashcards and timed mini-checks guided by volunteer teachers, plus a November stationery check.",
    when: "October – November",
    icon: LuGraduationCap,
    chip: "linear-gradient(135deg, #f4dfa0 0%, #f0b429 100%)",
    ink: "#8a680d",
  },
  {
    title: "Relate Launchpad",
    body: "Career guidance, application clinics and interview preparation for youth moving into higher study, skills training and life.",
    when: "Year-round",
    icon: LuBadgeCheck,
    chip: "linear-gradient(135deg, #14b8a6 0%, #008080 100%)",
    ink: "#006666",
  },
];

export default function EducationGlance() {
  return (
    <section
      className={"reveal reveal-stagger px-6 py-24 md:px-4 md:py-32"}
      style={{ background: "linear-gradient(150deg, #e6f9f5 0%, #ffffff 70%)" }}
    >
      <div className={"mx-auto max-w-6xl"}>
        <div className={"mb-12 text-center"}>
          <p
            className={
              "mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan"
            }
          >
            Education
          </p>
          <h2 className={"text-3xl font-semibold text-navy md:text-4xl"}>
            Learning that lasts beyond the classroom
          </h2>
          <p
            className={
              "mx-auto mt-4 max-w-2xl text-base leading-relaxed text-navy/70"
            }
          >
            Education runs across every club — from essential stationery to
            university applications — so learners build practical habits,
            confidence and a path to self-reliance.
          </p>
        </div>

        <div className={"grid gap-4 sm:grid-cols-2 md:gap-5"}>
          {programmes.map((programme) => {
            const Icon = programme.icon;
            return (
              <article
                key={programme.title}
                className={
                  "stagger-item hover-lift rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm"
                }
              >
                <div className={"flex items-start gap-4"}>
                  <span
                    aria-hidden
                    className={
                      "grid size-11 shrink-0 place-items-center rounded-xl text-white shadow-sm"
                    }
                    style={{ background: programme.chip }}
                  >
                    <Icon className={"size-5"} />
                  </span>
                  <div>
                    <p
                      className={
                        "text-[11px] font-semibold uppercase tracking-[0.16em]"
                      }
                      style={{ color: programme.ink }}
                    >
                      {programme.when}
                    </p>
                    <h3
                      className={
                        "mt-1 text-lg font-semibold text-navy"
                      }
                    >
                      {programme.title}
                    </h3>
                    <p
                      className={
                        "mt-2 text-sm leading-relaxed text-navy/70"
                      }
                    >
                      {programme.body}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div
          className={
            "mt-10 flex flex-col items-center justify-between gap-5 md:flex-row"
          }
        >
          <p className={"text-center text-sm text-slate-gray"}>
            Covers all clubs · Club season March – November · 4 programmes
          </p>
          <div className={"flex flex-wrap items-center justify-center gap-4"}>
            <Link href={"/join"} className={"link-chevron"}>
              Join a club
            </Link>
            <Link href={"/education"} className={"btn-pill btn-brand"}>
              Explore Education <LuArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
