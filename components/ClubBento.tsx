"use client";

import Image from "next/image";
import Link from "next/link";
import { LuChevronRight } from "react-icons/lu";
import { useClubs } from "@/lib/useClubs";
import { useNextPrayer } from "@/lib/useNextPrayer";

/**
 * The signature bento: a live prayer-countdown anchor tile plus one photo
 * tile per club — the Apple product grid, with one tile that is alive.
 */
export default function ClubBento() {
  const { clubs, loading } = useClubs();
  const prayer = useNextPrayer();
  const seven = clubs.slice(0, 7);
  const skeleton = loading && seven.length === 0;

  return (
    <section className={"bg-white px-4 py-24 md:py-36"}>
      <div className={"max-w-6xl mx-auto"}>
        <div className={"reveal mx-auto mb-12 max-w-2xl text-center md:mb-16"}>
          <p
            className={
              "mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-navy/70"
            }
          >
            Our clubs
          </p>
          <h2 className={"text-4xl font-semibold text-navy md:text-5xl"}>
            A club for every season of life
          </h2>
          <p className={"mt-4 text-lg text-navy/70"}>
            Seven clubs, one family — find the crew that fits yours.
          </p>
        </div>

        <div className={"grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"}>
          {/* Live anchor — counts down to the next prayer moment */}
          <div
            className={
              "reveal relative flex min-h-[240px] flex-col justify-between overflow-hidden rounded-3xl bg-navy p-7 text-white sm:col-span-2 lg:col-span-2 lg:row-span-2"
            }
          >
            <div>
              <p className={"text-[11px] uppercase tracking-[0.18em] text-white/60"}>
                Daily rhythm
              </p>
              <p className={"mt-1 text-base font-medium text-white/90"}>
                {prayer ? `${prayer.label} prayer` : "Pray with us"}
              </p>
            </div>
            <div>
              <p
                className={
                  "text-5xl font-semibold tracking-tight tabular-nums md:text-6xl"
                }
              >
                {prayer ? prayer.countdown : "6×"}
              </p>
              <p className={"mt-2 text-sm text-white/70"}>
                {prayer ? "until the next moment" : "six moments, every day"}
              </p>
              <Link
                href={"/prayer"}
                className={
                  "mt-4 inline-flex items-center gap-1 text-[15px] font-medium text-white/90 transition-colors hover:text-white"
                }
              >
                Prayer times <LuChevronRight className={""} />
              </Link>
            </div>
          </div>

          {/* Club photo tiles */}
          {seven.map((club, i) => (
            <Link
              key={club.slug}
              href={`/${club.slug}`}
              className={
                "reveal group relative aspect-[4/3] min-h-[190px] overflow-hidden rounded-3xl sm:aspect-auto"
              }
              style={{ transitionDelay: `${Math.min(i, 7) * 60}ms` }}
            >
              {club.heroImage ? (
                <Image
                  src={club.heroImage}
                  alt={club.name}
                  fill
                  sizes={
                    "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  }
                  className={
                    "absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  }
                />
              ) : (
                <div
                  className={"absolute inset-0"}
                  style={{
                    background: `linear-gradient(135deg, ${club.color}, ${club.colorDark})`,
                  }}
                />
              )}
              <div
                className={
                  "absolute inset-0 bg-gradient-to-t from-navy-dark/85 via-navy-dark/20 to-transparent"
                }
              />
              <div className={"absolute inset-x-0 bottom-0 p-5"}>
                <span
                  className={
                    "mb-2 inline-block rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium text-white/90 backdrop-blur"
                  }
                >
                  {club.ageRange}
                </span>
                <p
                  className={
                    "flex items-center gap-1 text-xl font-semibold text-white"
                  }
                >
                  {club.name}
                  <LuChevronRight
                    className={
                      "-translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                    }
                  />
                </p>
              </div>
            </Link>
          ))}

          {/* Matching CTA */}
          <Link
            href={"/enroll"}
            className={
              "reveal flex min-h-[190px] flex-col justify-between rounded-3xl border border-black/5 bg-tile p-6 transition-colors hover:border-cyan-ink/40"
            }
            style={{ transitionDelay: "420ms" }}
          >
            <p className={"text-[11px] uppercase tracking-[0.18em] text-navy/70"}>
              Not sure?
            </p>
            <div>
              <p className={"text-xl font-semibold text-navy"}>Find your crew</p>
              <p className={"mt-1 text-sm text-navy/70"}>
                Tell us your season of life — we&apos;ll match you to a club.
              </p>
              <span className={"link-chevron mt-3 inline-flex"}>
                Get matched
              </span>
            </div>
          </Link>

          {/* Loading skeletons for the photo tiles */}
          {skeleton &&
            Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className={
                  "min-h-[190px] animate-pulse rounded-3xl bg-tile"
                }
                aria-hidden={true}
              />
            ))}
        </div>
      </div>
    </section>
  );
}
