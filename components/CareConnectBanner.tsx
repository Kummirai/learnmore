import Link from "next/link";
import { LuArrowRight, LuCalendarDays, LuHandHeart, LuUsers } from "react-icons/lu";

const facts = [
  {
    icon: LuCalendarDays,
    label: "When",
    value: "First weekend of December",
    chip: "linear-gradient(135deg, #13c5dd 0%, #0fa3c4 100%)",
  },
  {
    icon: LuHandHeart,
    label: "The harvest",
    value: "50% of club collections",
    chip: "linear-gradient(135deg, #14b8a6 0%, #008080 100%)",
  },
  {
    icon: LuUsers,
    label: "Who takes part",
    value: "Every club, one local need",
    chip: "linear-gradient(135deg, #38bdf8 0%, #0369a1 100%)",
  },
];

export default function CareConnectBanner() {
  return (
    <section
      className={"reveal relative overflow-hidden px-6 py-24 md:px-4 md:py-32"}
      style={{
        background: "linear-gradient(150deg, #e7fbff 0%, #ffffff 70%)",
      }}
    >
      <div
        aria-hidden
        className={
          "pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-cyan/10 blur-3xl"
        }
      />

      <div className={"relative mx-auto max-w-6xl"}>
        <div className={"mx-auto max-w-3xl text-center"}>
          <h2
            className={
              "text-3xl font-semibold leading-tight text-navy md:text-5xl"
            }
          >
            Care &amp; Connect Day
          </h2>
          <p className={"mt-3 text-lg font-medium text-cyan-ink md:text-2xl"}>
            One weekend. Every club. Real care.
          </p>
          <p
            className={
              "mx-auto mt-5 max-w-2xl text-base leading-relaxed text-navy/70 md:text-lg"
            }
          >
            Care &amp; Connect Day closes our club year. Each club researches a
            concrete local need, pools the season&apos;s harvest and delivers
            direct help — food, essentials and time — to families who need it
            most, with dignity and without duplicating support that already
            exists.
          </p>
        </div>

        <div className={"reveal reveal-stagger mt-10 grid gap-4 sm:grid-cols-3"}>
          {facts.map((fact) => {
            const Icon = fact.icon;
            return (
              <div
                key={fact.label}
                className={
                  "stagger-item rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm"
                }
              >
                <span
                  aria-hidden
                  className={
                    "grid size-9 place-items-center rounded-lg text-white shadow-sm"
                  }
                  style={{ background: fact.chip }}
                >
                  <Icon className={"size-4"} />
                </span>
                <p
                  className={
                    "mt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-gray"
                  }
                >
                  {fact.label}
                </p>
                <p className={"mt-1 text-sm font-semibold text-navy"}>
                  {fact.value}
                </p>
              </div>
            );
          })}
        </div>

        <div
          className={
            "mt-16 flex flex-col items-center justify-center gap-5 sm:flex-row"
          }
        >
          <Link href={"/care-connect-day"} className={"btn-pill btn-brand"}>
            Join us <LuArrowRight />
          </Link>
          <Link href={"/#clubs"} className={"link-chevron"}>
            Find your club
          </Link>
          <p className={"text-sm text-navy/60"}>
            Open to active club members.
          </p>
        </div>
      </div>
    </section>
  );
}
