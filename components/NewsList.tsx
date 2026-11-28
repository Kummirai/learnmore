"use client";

import { useState } from "react";
import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";
import { newsPosts, type NewsTag } from "@/lib/news";

type Filter = NewsTag | "All";

const filters: Filter[] = [
  "All",
  ...Array.from(new Set(newsPosts.map((p) => p.tag))),
];

export default function NewsList() {
  const [active, setActive] = useState<Filter>("All");
  const [featured, ...rest] = newsPosts;
  const visible =
    active === "All" ? rest : newsPosts.filter((p) => p.tag === active);

  return (
    <section
      className={"reveal flex-1 px-6 py-16 md:px-4 md:py-24"}
      style={{ background: "linear-gradient(150deg, #fff8e3 0%, #ffffff 70%)" }}
    >
      <div className={"mx-auto max-w-5xl"}>
        <div className={"mx-auto mb-12 max-w-2xl text-center"}>
          <p
            className={
              "mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan"
            }
          >
            Latest news
          </p>
          <h1 className={"text-4xl font-semibold text-navy md:text-5xl"}>
            News from the Relate family
          </h1>
          <p className={"mt-4 text-lg leading-relaxed text-navy/70"}>
            Season dates, new programmes and stories from the clubs — everything
            happening across Relate World, all in one place.
          </p>
        </div>

        {active === "All" && (
          <article
            className={
              "hover-lift mb-10 rounded-3xl border border-black/5 p-7 md:p-10"
            }
            style={{
              background: "linear-gradient(150deg, #e7fbff 0%, #ffffff 70%)",
            }}
          >
            <div className={"mb-4 flex flex-wrap items-center gap-3"}>
              <span
                className={`inline-block text-xs font-medium px-2 py-0.5 rounded ${featured.color}`}
              >
                {featured.tag}
              </span>
              <span className={"text-xs font-medium text-navy/60"}>
                {featured.dateLabel}
              </span>
            </div>
            <h2
              className={
                "text-2xl font-semibold leading-snug text-navy md:text-3xl"
              }
            >
              {featured.title}
            </h2>
            <p className={"mt-3 max-w-2xl text-base leading-relaxed text-navy/70"}>
              {featured.excerpt}
            </p>
            {featured.href && (
              <Link
                href={featured.href}
                className={"link-chevron mt-5 inline-flex"}
              >
                {featured.cta ?? "Read more"}
              </Link>
            )}
          </article>
        )}

        <div
          className={"mb-8 flex flex-wrap items-center justify-center gap-2"}
          role={"group"}
          aria-label={"Filter news by topic"}
        >
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={active === f}
              onClick={() => setActive(f)}
              className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                active === f
                  ? "bg-navy text-white"
                  : "border border-black/10 bg-white text-navy/70 hover:border-cyan/50 hover:text-navy"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className={"grid grid-cols-1 gap-5 sm:grid-cols-2"}>
          {visible.map((p) => (
            <article
              key={p.slug}
              className={
                "hover-lift flex flex-col rounded-2xl border border-black/5 bg-white p-6"
              }
            >
              <div className={"mb-3 flex flex-wrap items-center gap-3"}>
                <span
                  className={`inline-block text-xs font-medium px-2 py-0.5 rounded ${p.color}`}
                >
                  {p.tag}
                </span>
                <span className={"text-xs text-navy/60"}>{p.dateLabel}</span>
              </div>
              <h2 className={"text-lg font-semibold leading-snug text-navy"}>
                {p.title}
              </h2>
              <p
                className={
                  "mt-2 flex-1 text-sm leading-relaxed text-navy/70"
                }
              >
                {p.excerpt}
              </p>
              {p.href && (
                <Link href={p.href} className={"link-chevron mt-4 text-[15px]"}>
                  {p.cta ?? "Read more"}
                </Link>
              )}
            </article>
          ))}
        </div>

        {visible.length === 0 && (
          <p className={"py-10 text-center text-sm text-navy/60"}>
            Nothing here yet — check back soon.
          </p>
        )}

        <div className={"mt-16 flex flex-col items-center gap-4 text-center"}>
          <p className={"text-lg font-medium text-navy"}>
            Be part of the next story.
          </p>
          <Link href={"/join"} className={"btn-pill btn-brand"}>
            Join a club <LuArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
