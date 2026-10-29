"use client";

import { LuBookOpen } from "react-icons/lu";
import type { PortalYear } from "@/lib/programming-portal";

/**
 * Study material for the active year — short lessons with runnable code
 * examples the student reads before coding the milestones.
 */
export default function LessonNotes({ year }: { year: PortalYear }) {
  return (
    <section
      className={"portal-card p-5 md:p-6"}
      aria-label={"Study material"}
    >
      <div className={"flex flex-wrap items-end justify-between gap-3 pb-4"}>
        <div>
          <span
            className={
              "flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-teal"
            }
          >
            <LuBookOpen className={"size-3.5"} />
            Study material
          </span>
          <h2 className={"mt-1 text-xl font-black text-white"}>
            Year {year.year} lessons
          </h2>
        </div>
        <p className={"text-xs text-white/50"}>
          Read these first — then build the milestones in the sandbox.
        </p>
      </div>

      <ol
        className={
          "grid grid-cols-1 gap-px bg-portal-line sm:grid-cols-2 border border-portal-line"
        }
      >
        {year.lessons.map((lesson, index) => (
          <li
            key={lesson.id}
            className={"flex flex-col bg-portal-slate p-4 md:p-5"}
          >
            <div className={"flex items-start gap-3"}>
              <span
                className={
                  "grid size-7 shrink-0 place-items-center border border-teal/50 bg-teal/10 text-xs font-black text-teal-glow"
                }
                aria-hidden={"true"}
              >
                {index + 1}
              </span>
              <h3 className={"mt-0.5 text-sm font-bold leading-snug text-white"}>
                {lesson.title}
              </h3>
            </div>

            <p className={"mt-2.5 text-sm leading-relaxed text-white/65"}>
              {lesson.body}
            </p>

            {lesson.example ? (
              <div className={"mt-3 border border-portal-line bg-portal-ink"}>
                <p
                  className={
                    "font-code border-b border-portal-line px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/40"
                  }
                >
                  {lesson.example.lang} example
                </p>
                <pre
                  className={
                    "font-code overflow-x-auto whitespace-pre p-3 text-[12px] leading-relaxed text-teal-glow/90"
                  }
                >
                  <code>{lesson.example.code}</code>
                </pre>
              </div>
            ) : (
              <p
                className={
                  "mt-3 border border-teal/40 bg-teal/10 px-3 py-2 text-xs font-semibold text-teal-glow"
                }
              >
                When every box above is ticked — claim your Master Web Builder
                Badge below.
              </p>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
