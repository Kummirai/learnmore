"use client";

import { useState } from "react";
import Image from "next/image";

const photos = [
  {
    label: "Saturday Morning Sprout Club",
    src: "/images/heroes/sprout.webp",
  },
  {
    label: "Surge Park Day",
    src: "/images/heroes/surge.webp",
  },
  {
    label: "Pulse Networking Morning",
    src: "/images/heroes/pulse.webp",
  },
  {
    label: "Prime Peer Circle",
    src: "/images/heroes/prime.webp",
  },
  {
    label: "Anchor Family Outing",
    src: "/images/heroes/anchor.webp",
  },
  {
    label: "Spark Double Date",
    src: "/images/heroes/spark.webp",
  },
  {
    label: "Synergy Couples Retreat",
    src: "/images/heroes/synergy.webp",
  },
];

export default function PhotoHighlights() {
  const [active, setActive] = useState(0);
  const count = photos.length;
  const leftIdx = (active - 1 + count) % count;
  const rightIdx = (active + 1) % count;

  return (
    <section className={"reveal bg-stage px-6 py-24 md:px-4 md:py-32"}>
      <div className={"max-w-6xl mx-auto"}>
        <div className={"mb-10 text-center"}>
          <p
            className={
              "mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan"
            }
          >
            Club life
          </p>
          <h2 className={"text-3xl font-semibold text-navy md:text-4xl"}>
            Moments at Relate
          </h2>
        </div>

        <div className={"flex flex-col items-center"}>
          <div className={"flex items-start justify-center gap-3 md:gap-5"}>
            <button
              type="button"
              onClick={() => setActive(leftIdx)}
              aria-label={`Show ${photos[leftIdx].label}`}
              className={
                "hidden w-48 cursor-pointer flex-col items-center md:flex lg:w-56"
              }
            >
              <div
                className={
                  "relative aspect-[4/3] w-full overflow-hidden rounded-xl shadow-sm"
                }
              >
                <Image
                  src={photos[leftIdx].src}
                  alt={photos[leftIdx].label}
                  fill
                  sizes="(max-width: 1024px) 192px, 224px"
                  className={"object-cover"}
                />
              </div>
              <p className={"mt-2 text-center text-sm text-slate-gray"}>
                {photos[leftIdx].label}
              </p>
            </button>

            <div
              className={
                "flex w-full max-w-[20rem] flex-col items-center sm:max-w-[24rem] md:w-72 md:max-w-none lg:w-80"
              }
            >
              <div
                className={
                  "relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-lg transition-transform duration-300 hover:scale-[1.02]"
                }
              >
                <Image
                  src={photos[active].src}
                  alt={photos[active].label}
                  fill
                  sizes="(max-width: 768px) 100vw, 320px"
                  className={"object-cover"}
                />
              </div>
              <p
                className={
                  "mt-3 text-center text-base font-semibold text-navy"
                }
              >
                {photos[active].label}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActive(rightIdx)}
              aria-label={`Show ${photos[rightIdx].label}`}
              className={
                "hidden w-48 cursor-pointer flex-col items-center md:flex lg:w-56"
              }
            >
              <div
                className={
                  "relative aspect-[4/3] w-full overflow-hidden rounded-xl shadow-sm"
                }
              >
                <Image
                  src={photos[rightIdx].src}
                  alt={photos[rightIdx].label}
                  fill
                  sizes="(max-width: 1024px) 192px, 224px"
                  className={"object-cover"}
                />
              </div>
              <p className={"mt-2 text-center text-sm text-slate-gray"}>
                {photos[rightIdx].label}
              </p>
            </button>
          </div>

          <div className={"mt-5 flex items-center gap-2"}>
            {photos.map((photo, i) => (
              <button
                key={photo.src}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show ${photo.label}`}
                aria-current={i === active ? "true" : undefined}
                className={`cursor-pointer rounded-full transition ${
                  i === active
                    ? "size-2.5 bg-navy"
                    : "size-2 bg-line hover:bg-slate-gray"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
