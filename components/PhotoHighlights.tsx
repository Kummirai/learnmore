"use client";

import { useState } from "react";
import Image from "next/image";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

const photos = [
  {
    label: "Saturday Morning Sprout Club",
    src: "https://images.unsplash.com/photo-1774599804869-71bafe4e4b59?q=80&w=400&h=300&fit=crop&fm=webp",
  },
  {
    label: "Surge Park Day",
    src: "https://images.unsplash.com/photo-1764192736615-02dad1afc2a3?q=80&w=400&h=300&fit=crop&fm=webp",
  },
  {
    label: "Pulse Networking Morning",
    src: "https://images.unsplash.com/photo-1625999874116-dba9a603fa24?q=80&w=400&h=300&fit=crop&fm=webp",
  },
  {
    label: "Spark Double Date",
    src: "https://images.unsplash.com/photo-1744972974629-daa2fdaa15ee?q=80&w=400&h=300&fit=crop&fm=webp",
  },
  {
    label: "Synergy Couples Retreat",
    src: "https://images.unsplash.com/photo-1729284440498-19b2295ac7bb?q=80&w=400&h=300&fit=crop&fm=webp",
  },
  {
    label: "Holiday Club Outing",
    src: "https://images.unsplash.com/photo-1630863494122-6b726a344d3d?q=80&w=400&h=300&fit=crop&fm=webp",
  },
];

export default function PhotoHighlights() {
  const [start, setStart] = useState(0);
  const visible = 4;

  const next = () => setStart((s) => Math.min(s + 1, photos.length - visible));
  const prev = () => setStart((s) => Math.max(s - 1, 0));

  return (
    <section className={"reveal bg-stage px-4 py-24 md:py-32"}>
      <div className={"max-w-6xl mx-auto"}>
        <div className={"mb-10 text-center"}>
          <p
            className={
              "mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-navy/70"
            }
          >
            Club life
          </p>
          <h2 className={"text-3xl font-semibold text-navy md:text-4xl"}>
            Moments at Relate
          </h2>
        </div>
        <div className={"relative"}>
          <div className={"grid grid-cols-2 md:grid-cols-4 gap-4"}>
            {photos.slice(start, start + visible).map((p, i) => (
              <div
                key={i}
                className={
                  "relative rounded-2xl aspect-[4/3] overflow-hidden group hover:scale-[1.02] transition-transform cursor-pointer"
                }
              >
                <Image
                  src={p.src}
                  alt={p.label}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className={"absolute inset-0 size-full object-cover"}
                />
                <div
                  className={
                    "absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
                  }
                />
                <div className={"absolute bottom-0 left-0 right-0 p-3"}>
                  <span className={"text-sm font-medium text-white"}>
                    {p.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {photos.length > visible && (
            <>
              <button
                onClick={prev}
                disabled={start === 0}
                className={
                  "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 size-11 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-cyan-ink disabled:opacity-30 disabled:cursor-not-allowed transition"
                }
              >
                <LuChevronLeft className={"text-xl"} />
              </button>
              <button
                onClick={next}
                disabled={start >= photos.length - visible}
                className={
                  "absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 size-11 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-cyan-ink disabled:opacity-30 disabled:cursor-not-allowed transition"
                }
              >
                <LuChevronRight className={"text-xl"} />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
