"use client";

import Image from "next/image";
import { useState } from "react";
import {
  LuBadgeCheck,
  LuCalendarDays,
  LuMapPin,
} from "react-icons/lu";

type Category = "autumn" | "winter" | "spring" | "harvest";

const filters: { id: "all" | Category; label: string }[] = [
  { id: "all", label: "All clubs" },
  { id: "autumn", label: "Autumn outing" },
  { id: "winter", label: "Winter outing" },
  { id: "spring", label: "Spring outings" },
  { id: "harvest", label: "Care & Connect harvest" },
];

type Entry = {
  category: Category;
  number: string;
  period: string;
  status: string;
  season: string;
  focus: string;
  report: string;
  caption: string;
  image: string;
  alt: string;
  ink: string;
  chip: string;
  chipInk: string;
  pill: string;
  pillInk: string;
};

const entries: Entry[] = [
  {
    category: "autumn",
    number: "01",
    period: "March – May",
    status: "Autumn outing",
    season: "The season begins",
    focus: "Focus: chosen by each club",
    report: "Report #1 filed · 50% to the fund",
    caption:
      "Clubs run their first seasonal outing, submit Post-Outing Report #1 and send half of the net surplus into the December fund.",
    image: "/images/care-connect/pantry-line.jpg",
    alt: "Volunteers sorting canned goods and fresh produce for distribution",
    ink: "#8a680d",
    chip: "linear-gradient(135deg, #f4dfa0 0%, #f0b429 100%)",
    chipInk: "#0b192c",
    pill: "#f0b429",
    pillInk: "#0b192c",
  },
  {
    category: "winter",
    number: "02",
    period: "June – August",
    status: "Winter outing",
    season: "Mid-year momentum",
    focus: "Focus: chosen by each club",
    report: "Report #2 filed · 50% to the fund",
    caption:
      "A second outing keeps the harvest growing mid-year, with Post-Outing Report #2 filed and shared transparently.",
    image: "/images/care-connect/meal-packing.jpg",
    alt: "Volunteers packing meal containers into bags",
    ink: "#0369a1",
    chip: "linear-gradient(135deg, #38bdf8 0%, #0369a1 100%)",
    chipInk: "#ffffff",
    pill: "#0369a1",
    pillInk: "#ffffff",
  },
  {
    category: "spring",
    number: "03",
    period: "September – November",
    status: "Spring outings",
    season: "Reports complete",
    focus: "Focus: locked in for December",
    report: "Reports #3–4 filed · plan locked in",
    caption:
      "Two Spring outings complete the season of reports, and each club submits its Care & Connect programme and budget by early November.",
    image: "/images/care-connect/food-drive.jpg",
    alt: "Hands passing food items across a distribution table",
    ink: "#0b6b7d",
    chip: "linear-gradient(135deg, #13c5dd 0%, #0fa3c4 100%)",
    chipInk: "#ffffff",
    pill: "#13c5dd",
    pillInk: "#0b192c",
  },
  {
    category: "harvest",
    number: "04",
    period: "First weekend of December",
    status: "Care & Connect harvest",
    season: "The harvest weekend",
    focus: "Focus: club-chosen, direct need",
    report: "Year-end close · direct, hands-on care",
    caption:
      "The year's pooled surplus becomes hands-on care for families and individuals in genuine need, closing the club year.",
    image: "/images/care-connect/hampers.jpg",
    alt: "Volunteers filling paper grocery bags with food at an outdoor distribution point",
    ink: "#006666",
    chip: "linear-gradient(135deg, #0d9488 0%, #006b6b 100%)",
    chipInk: "#ffffff",
    pill: "#008080",
    pillInk: "#ffffff",
  },
];

const summary = [
  "4 seasonal outings",
  "4 post-outing reports",
  "50% of surplus to the fund",
  "1 harvest weekend",
];

export default function CareConnectGallery() {
  const [active, setActive] = useState<"all" | Category>("all");
  const visible =
    active === "all"
      ? entries
      : entries.filter((entry) => entry.category === active);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="reveal flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-ink">
            Year in review
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-navy md:text-5xl">
            Our clubs in action across the year.
          </h2>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-slate-gray md:text-base">
          Explore the outings, teamwork and Care &amp; Connect moments that
          built up to December.
        </p>
      </div>

      <div
        role="group"
        aria-label="Filter the year-in-review gallery"
        className="mt-8 flex flex-wrap gap-2"
      >
        {filters.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            aria-pressed={active === id}
            onClick={() => setActive(id)}
            className={`min-h-11 rounded-full px-4 text-sm font-semibold transition-colors ${
              active === id
                ? "bg-navy text-white"
                : "bg-white text-navy ring-1 ring-line hover:bg-stage"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {visible.length} {visible.length === 1 ? "moment" : "moments"} shown
      </p>

      <div className="reveal reveal-stagger mt-10 grid gap-x-8 gap-y-12 md:mt-12 md:grid-cols-2 md:gap-x-12 md:gap-y-16">
        {visible.map((entry) => {
          const featured = entry.category === "harvest";
          return (
            <article
              key={entry.category}
              className={`stagger-item group ${
                featured
                  ? "md:col-span-2 md:grid md:grid-cols-2 md:items-center md:gap-12"
                  : ""
              }`}
            >
              <div
                className={`relative aspect-[4/3] overflow-hidden rounded-xl ${
                  featured ? "md:aspect-[16/11]" : ""
                }`}
              >
                <Image
                  src={entry.image}
                  alt={entry.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 560px"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <span
                  aria-hidden
                  className="absolute bottom-3 left-3 grid size-10 place-items-center rounded-2xl font-display text-sm font-black shadow-sm"
                  style={{ background: entry.chip, color: entry.chipInk }}
                >
                  {entry.number}
                </span>
              </div>
              <div className={featured ? "mt-5 md:mt-0" : "mt-5"}>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em]"
                    style={{ color: entry.ink }}
                  >
                    <LuCalendarDays />
                    {entry.period}
                  </span>
                  <span
                    className="rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide"
                    style={{ background: entry.pill, color: entry.pillInk }}
                  >
                    {entry.status}
                  </span>
                </div>
                <h3 className="mt-2 font-display text-xl font-bold leading-snug text-navy md:text-2xl">
                  {entry.season}
                </h3>
                <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-gray">
                  <LuMapPin style={{ color: entry.ink }} />
                  {entry.focus}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-gray">
                  {entry.caption}
                </p>
                <p
                  className="mt-3 flex items-center gap-1.5 text-xs font-semibold"
                  style={{ color: entry.ink }}
                >
                  <LuBadgeCheck className="shrink-0" />
                  {entry.report}
                </p>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-12 flex flex-wrap gap-2.5">
        {summary.map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-xs font-semibold text-navy ring-1 ring-line md:text-sm"
          >
            <span aria-hidden className="size-1.5 rounded-full bg-cyan" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
