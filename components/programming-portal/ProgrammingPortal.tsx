"use client";

import { useMemo, useState } from "react";
import { LuArrowUpRight, LuWallet } from "react-icons/lu";
import LessonNotes from "@/components/programming-portal/LessonNotes";
import MilestoneChecklist from "@/components/programming-portal/MilestoneChecklist";
import PortalHeader from "@/components/programming-portal/PortalHeader";
import {
  PORTAL_YEARS,
  milestoneKey,
} from "@/lib/programming-portal";
import { useProgrammingPortal } from "@/lib/use-programming-portal";

const zar = (value: number) =>
  `R${value.toLocaleString("en-ZA", { minimumFractionDigits: 0 })}`;

/**
 * The Sprout Tweens 4-Year Evolving Profile learning portal.
 *
 * Blueprint §4: this is a curated-resource directory, not a code playground.
 * Students review the external links, build their capstone, and an instructor
 * approves each milestone from the admin panel.
 */
export default function ProgrammingPortal() {
  const { user, progress, loading, error } = useProgrammingPortal();

  const [activeYear, setActiveYear] = useState(1);

  const year =
    PORTAL_YEARS.find((y) => y.year === activeYear) ?? PORTAL_YEARS[0];

  const doneKeys = useMemo(() => {
    const set = new Set<string>();
    for (const key of progress?.milestones ?? []) set.add(key);
    return set;
  }, [progress]);

  const yearDone = year.milestones.filter((m) =>
    doneKeys.has(milestoneKey(year.year, m.id)),
  ).length;

  return (
    <div className={"min-h-screen bg-portal-ink text-white"}>
      <PortalHeader
        approved={doneKeys.size}
        studentName={user?.name ?? null}
      />

      <div className={"mx-auto max-w-6xl px-4 py-8"}>
        {loading ? (
          <p
            className={
              "portal-card flex items-center gap-3 px-5 py-6 text-sm text-white/70"
            }
          >
            <span
              className={
                "size-4 animate-spin border-2 border-teal border-t-transparent"
              }
              aria-hidden={"true"}
            />
            Loading your portal progress…
          </p>
        ) : null}

        {error ? (
          <p
            role={"alert"}
            className={
              "mb-4 border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300"
            }
          >
            {error}
          </p>
        ) : null}

        {/* Year selector */}
        <div
          id={"portal-curriculum"}
          className={
            "flex flex-wrap gap-1 border border-portal-line bg-portal-slate p-1.5 scroll-mt-24"
          }
          role={"tablist"}
          aria-label={"Curriculum year"}
        >
          {PORTAL_YEARS.map((item) => {
            const active = item.year === activeYear;
            return (
              <button
                key={item.year}
                type={"button"}
                role={"tab"}
                aria-selected={active}
                onClick={() => setActiveYear(item.year)}
                className={"portal-tab flex-1 !border-b-2 text-left"}
                style={
                  active
                    ? {
                        backgroundColor: "rgba(0,128,128,0.16)",
                        borderBottomColor: "#008080",
                        color: "#ffffff",
                      }
                    : undefined
                }
              >
                <span className={"block text-[10px] uppercase tracking-widest"}>
                  Year {item.year} · Age {item.age}
                </span>
                <span className={"mt-0.5 block text-sm font-black"}>
                  {item.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Year intro */}
        <section className={"portal-card mt-4 p-5 md:p-6"}>
          <div className={"flex flex-wrap items-start justify-between gap-4"}>
            <div className={"min-w-0 flex-1"}>
              <span
                className={
                  "text-[11px] font-bold uppercase tracking-widest text-teal"
                }
              >
                Year {year.year} · {year.subtitle}
              </span>
              <h1 className={"mt-1 text-2xl font-black text-white"}>
                {year.title}
              </h1>
              <p
                className={"mt-2 max-w-2xl text-sm leading-relaxed text-white/65"}
              >
                {year.focus}
              </p>
              <p className={"mt-3 text-sm leading-relaxed text-white/80"}>
                <span
                  className={
                    "font-bold uppercase tracking-wider text-teal-glow"
                  }
                >
                  Capstone:{" "}
                </span>
                {year.profileAddition}
              </p>
            </div>
            <p
              className={
                "border border-teal/40 bg-teal/10 px-4 py-2 text-sm font-black text-teal-glow"
              }
            >
              {yearDone}/{year.milestones.length} approved
            </p>
          </div>

          <div className={"mt-4 grid gap-4 border-t border-portal-line pt-4 md:grid-cols-2"}>
            <div>
              <p
                className={
                  "text-[11px] font-bold uppercase tracking-widest text-white/40"
                }
              >
                Concepts you&apos;ll learn
              </p>
              <div className={"mt-2 flex flex-wrap gap-2"}>
                {year.concepts.map((concept) => (
                  <span
                    key={concept}
                    className={
                      "font-code border border-portal-line bg-portal-ink px-2.5 py-1 text-[11px] font-semibold text-white/75"
                    }
                  >
                    {concept}
                  </span>
                ))}
              </div>
            </div>

            <div
              className={
                "border border-teal/30 bg-teal/5 px-4 py-3"
              }
            >
              <p
                className={
                  "flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-teal-glow"
                }
              >
                <LuWallet className={"size-3.5"} /> Smart Saver target · age{" "}
                {year.age}
              </p>
              <p className={"mt-1.5 text-sm font-bold text-white"}>
                {zar(year.savingsTarget.weekly)} / week →{" "}
                {zar(year.savingsTarget.annual)} this year
              </p>
              <p className={"mt-0.5 text-xs text-white/55"}>
                {zar(year.savingsTarget.cumulative)} cumulative in your
                University Freedom Fund by the end of this year.
              </p>
            </div>
          </div>
        </section>

        <div className={"mt-4 space-y-4"}>
          <LessonNotes year={year} />

          {/* Curated external resources — blueprint §4 */}
          <section className={"portal-card p-5 md:p-6"} aria-label={"Resources"}>
            <div className={"flex flex-wrap items-end justify-between gap-3 pb-4"}>
              <div>
                <span
                  className={
                    "text-[11px] font-bold uppercase tracking-widest text-teal"
                  }
                >
                  Curated resources
                </span>
                <h2 className={"mt-1 text-xl font-black text-white"}>
                  Learn from the experts
                </h2>
              </div>
              <p className={"text-xs text-white/50"}>
                Free, verified sites — everything opens in a new tab.
              </p>
            </div>
            <ul
              className={
                "grid grid-cols-1 gap-px border border-portal-line bg-portal-line sm:grid-cols-2"
              }
            >
              {year.resources.map((resource) => (
                <li key={resource.url} className={"bg-portal-slate"}>
                  <a
                    href={resource.url}
                    target={"_blank"}
                    rel={"noreferrer"}
                    className={
                      "flex items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-white/85 transition-colors hover:bg-teal/10 hover:text-white"
                    }
                  >
                    {resource.label}
                    <LuArrowUpRight className={"size-4 shrink-0 text-teal"} />
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <MilestoneChecklist year={year} doneKeys={doneKeys} />
        </div>
      </div>
    </div>
  );
}
