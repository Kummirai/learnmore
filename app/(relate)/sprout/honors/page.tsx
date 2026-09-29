import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import type { CSSProperties } from "react";

import PageHero from "@/components/PageHero";
import JoinCta from "@/components/join/JoinCta";
import { getClub } from "@/constants/relate";
import {
  HONOR_COUNT,
  HONOR_LEVELS,
  HONOR_TRACK_BY_ID,
  SHAPE_LABEL,
} from "@/constants/sproutHonors";
import { clipText, siteMetadata, SITE_NAME, SITE_URL } from "@/lib/seo";

const DESCRIPTION =
  "Every Sprout Club honor — 13 badges across safety, money, digital skills, coding and media. Open one to see its requirements and track your progress.";

export function generateMetadata(): Metadata {
  return siteMetadata(
    {
      title: "Sprout Club Honors · Badges & Requirements",
      description: clipText(DESCRIPTION),
      openGraph: {
        type: "website",
        url: `${SITE_URL}/sprout/honors`,
        siteName: SITE_NAME,
        title: "Sprout Club Honors · Badges & Requirements",
        description: clipText(DESCRIPTION),
      },
    },
    "/sprout/honors",
  );
}

export default function SproutHonorsPage() {
  const sprout = getClub("sprout")!;
  const clubVars = {
    "--club-accent": sprout.color,
    "--club-accent-dark": sprout.colorDark,
  } as CSSProperties;

  return (
    <div style={clubVars}>
      <PageHero
        style={clubVars}
        title="Sprout Club Honors"
        mobileTitle="Honors"
        tagline="Badges earned. Skills proven."
        description={DESCRIPTION}
        watermark={String(HONOR_COUNT)}
        actions={
          <>
            <JoinCta
              href={`/join?club=${sprout.slug}`}
              className={
                "inline-flex items-center gap-2 bg-white text-navy px-6 py-3 rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors"
              }
            >
              Join Sprout
            </JoinCta>
            <Link
              href={"/sprout/sprout-camp"}
              className={
                "inline-flex items-center gap-2 border border-white/25 text-white px-6 py-3 rounded-lg font-semibold text-sm hover:border-white/60 transition-colors"
              }
            >
              Earn them at camp →
            </Link>
          </>
        }
        meta={[
          { label: "Honors", value: String(HONOR_COUNT) },
          { label: "Levels", value: String(HONOR_LEVELS.length) },
          { label: "Ages", value: sprout.ageRange },
        ]}
        metaEnd={
          <Link
            href={`/${sprout.slug}`}
            className={
              "inline-flex items-center gap-2 font-medium text-white hover:text-cyan-light transition-colors"
            }
          >
            <span className={"text-[11px] uppercase tracking-widest text-white/50"}>
              Back to
            </span>
            Sprout ←
          </Link>
        }
      />

      <section className={"flex-1 px-4 py-12 bg-white"}>
        <div className={"max-w-6xl mx-auto"}>
          {HONOR_LEVELS.map((level) => (
            <div
              key={level.id}
              id={`level-${level.id}`}
              className={"mb-14 scroll-mt-6 last:mb-0"}
            >
              <div className={"mb-5"}>
                <span
                  className={"text-xs uppercase tracking-widest font-medium"}
                  style={{ color: level.colorDark }}
                >
                  Level {level.levelNumber} · {level.ageBand}
                </span>
                <h2
                  className={
                    "text-2xl md:text-3xl font-semibold text-gray-800 mt-1"
                  }
                >
                  {level.name} honors
                </h2>
                <p className={"text-gray-500 text-sm max-w-2xl mt-1.5"}>
                  {level.focus}
                </p>
              </div>

              <div
                className={
                  "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                }
              >
                {level.badges.map((badge) => {
                  const track = HONOR_TRACK_BY_ID[badge.track];
                  return (
                    <Link
                      key={badge.id}
                      href={`/sprout/honors/${badge.id}`}
                      className={
                        "group relative block h-72 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:border-cyan hover:shadow-md transition-all"
                      }
                    >
                      <Image
                        src={track.image}
                        alt={""}
                        fill
                        sizes={
                          "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        }
                        className={
                          "absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
                        }
                      />
                      <span
                        aria-hidden={"true"}
                        className={"absolute inset-x-0 bottom-0 block h-52"}
                        style={{
                          background: `linear-gradient(to top, ${level.colorDark}f2 0%, ${level.colorDark}d9 70%, ${level.colorDark}00 100%)`,
                        }}
                      />
                      <span
                        className={"absolute inset-x-0 bottom-0 block px-5 pb-5"}
                      >
                        <span
                          className={
                            "flex items-center gap-2 text-xs text-white/70"
                          }
                        >
                          <span
                            className={"size-2.5 shrink-0 rounded-full"}
                            style={{ backgroundColor: track.color }}
                            aria-hidden={"true"}
                          />
                          {track.short} · {SHAPE_LABEL[badge.shape]}
                        </span>
                        <span
                          className={
                            "mt-1.5 flex items-center justify-between gap-3"
                          }
                        >
                          <span
                            className={
                              "block font-bold text-white text-[17px] leading-snug"
                            }
                          >
                            {badge.name}
                          </span>
                          <span
                            aria-hidden={"true"}
                            className={
                              "shrink-0 text-sm font-semibold text-cyan-light opacity-0 group-hover:opacity-100 transition-opacity"
                            }
                          >
                            →
                          </span>
                        </span>
                        <span
                          className={
                            "mt-2 block text-sm text-white/75 leading-snug line-clamp-2"
                          }
                        >
                          {badge.requirements[0].text}
                        </span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          <div
            className={
              "relative overflow-hidden rounded-2xl text-white shadow-sm"
            }
            style={{ backgroundColor: sprout.colorDark }}
          >
            <div
              className={"absolute inset-0"}
              style={{
                background: `linear-gradient(120deg, ${sprout.colorDark} 20%, #1d2a4d 100%)`,
              }}
            />
            <div
              className={
                "absolute -right-16 -top-20 size-64 rounded-full blur-3xl opacity-25"
              }
              style={{ backgroundColor: sprout.color }}
            />
            <div
              className={
                "relative px-6 py-8 md:px-10 md:py-10 md:flex md:items-center md:justify-between gap-5"
              }
            >
              <div>
                <span
                  className={"text-[11px] uppercase tracking-widest font-medium"}
                  style={{ color: sprout.color }}
                >
                  Start at level one
                </span>
                <h3 className={"mt-1 text-2xl md:text-3xl font-bold tracking-tight"}>
                  Earn your first honor this term
                </h3>
                <p className={"mt-2 text-white/80 text-sm md:text-base max-w-xl leading-relaxed"}>
                  Honors are worked towards at weekly Sprout Club and away at
                  Sprout Camp — leaders sign off each requirement as it&apos;s
                  proven.
                </p>
              </div>
              <div className={"mt-4 md:mt-0 shrink-0 flex flex-wrap gap-3"}>
                <JoinCta
                  href={`/join?club=${sprout.slug}`}
                  className={
                    "inline-flex items-center gap-2 bg-white text-navy px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors"
                  }
                >
                  Join Sprout
                </JoinCta>
                <Link
                  href={"/sprout/sprout-camp"}
                  className={
                    "inline-flex items-center gap-2 border border-white/30 px-5 py-2.5 rounded-lg font-semibold text-sm hover:border-white/70 transition-colors"
                  }
                >
                  Sprout Camp →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
