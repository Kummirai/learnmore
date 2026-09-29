import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import {
  LuClapperboard,
  LuCode,
  LuHeartPulse,
  LuCheck,
  LuMonitor,
  LuWallet,
} from "react-icons/lu";

import PageHero from "@/components/PageHero";
import JoinCta from "@/components/join/JoinCta";
import { getClub } from "@/constants/relate";
import {
  HONOR_COUNT,
  HONOR_LEVELS,
  HONOR_TRACKS,
  HONOR_TRACK_BY_ID,
  SHAPE_LABEL,
  honorMatrix,
  type HonorTrackId,
} from "@/constants/sproutHonors";
import { clipText, siteMetadata, SITE_NAME, SITE_URL } from "@/lib/seo";

const DESCRIPTION =
  "The Sprout Club honors framework — 13 badges across safety, money, digital skills, coding and media, earned from Sprout Kids to Sprout Teens.";

const TRACK_ICON: Record<HonorTrackId, React.ReactNode> = {
  safety: <LuHeartPulse aria-hidden={"true"} />,
  finance: <LuWallet aria-hidden={"true"} />,
  productivity: <LuMonitor aria-hidden={"true"} />,
  code: <LuCode aria-hidden={"true"} />,
  media: <LuClapperboard aria-hidden={"true"} />,
};

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
  const coreTracks = HONOR_TRACKS.filter((t) => !t.teensOnly);
  const mediaTrack = HONOR_TRACKS.find((t) => t.teensOnly);
  const matrix = honorMatrix();
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
          { label: "Levels", value: String(HONOR_LEVELS.length) },
          { label: "Honors", value: String(HONOR_COUNT) },
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
          {/* Level jump bar */}
          <nav
            aria-label={"Honor levels"}
            className={
              "flex flex-wrap gap-2 mb-10 sticky top-0 z-20 bg-white/95 backdrop-blur-md py-3 -mt-3 border-b border-gray-100"
            }
          >
            {HONOR_LEVELS.map((level) => (
              <a
                key={level.id}
                href={`#level-${level.id}`}
                style={{ "--level-accent": level.colorDark } as CSSProperties}
                className={
                  "inline-flex items-center gap-2 min-h-11 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-navy hover:border-transparent hover:bg-(--level-accent) hover:text-white transition-colors"
                }
              >
                <span
                  className={"size-2.5 rounded-full"}
                  style={{ backgroundColor: level.color }}
                />
                {level.name} · {level.ageBand.replace("Ages ", "")}
              </a>
            ))}
          </nav>

          {/* Overview matrix */}
          <div className={"mb-14"}>
            <span
              className={
                "text-xs uppercase tracking-widest text-(--club-accent) font-medium"
              }
            >
              Age group progression
            </span>
            <h2 className={"text-2xl md:text-3xl font-semibold text-gray-800 mt-1 mb-2"}>
              Every level, every track
            </h2>
            <p className={"text-gray-500 text-sm max-w-xl mb-6"}>
              One badge per track at each level — the same four tracks grow with
              your child, from circular patches to a woven-sash honour pin.
            </p>

            <div className={"overflow-x-auto rounded-2xl border border-gray-200"}>
              <table className={"w-full min-w-[46rem] text-left border-collapse"}>
                <thead>
                  <tr className={"bg-alice-blue"}>
                    <th
                      scope={"col"}
                      className={
                        "px-4 py-3 text-[11px] uppercase tracking-widest text-slate-gray font-semibold"
                      }
                    >
                      Age group
                    </th>
                    {coreTracks.map((track) => (
                      <th
                        key={track.id}
                        scope={"col"}
                        className={"px-4 py-3 text-[11px] uppercase tracking-widest font-semibold"}
                        style={{ color: track.color }}
                      >
                        {track.short}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {HONOR_LEVELS.map((level, i) => (
                    <tr key={level.id} className={"border-t border-gray-100"}>
                      <th scope={"row"} className={"px-4 py-4 align-top"}>
                        <a
                          href={`#level-${level.id}`}
                          className={"font-bold text-navy hover:text-cyan-dark transition-colors"}
                        >
                          {level.name}
                        </a>
                        <span className={"block text-xs font-normal text-gray-400"}>
                          {level.ageBand}
                        </span>
                      </th>
                      {matrix[i].slice(0, coreTracks.length).map((cell, j) => (
                        <td key={j} className={"px-4 py-4 align-top text-sm text-gray-700"}>
                          {cell ? cell.name : <span className={"text-gray-300"}>—</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {mediaTrack && (
              <p className={"mt-3 text-sm text-gray-500"}>
                <span
                  className={"mr-1.5 inline-block size-2.5 rounded-full align-middle"}
                  style={{ backgroundColor: mediaTrack.color }}
                />
                <strong className={"text-navy"}>Teen extra:</strong> the{" "}
                <Link
                  href={"#badge-media-communications"}
                  className={"text-cyan-dark underline underline-offset-2"}
                >
                  Media &amp; Communications Honor
                </Link>{" "}
                opens a fifth track at Levels 3 only.
              </p>
            )}
          </div>

          {/* Tracks */}
          <div className={"mb-14"}>
            <span
              className={
                "text-xs uppercase tracking-widest text-(--club-accent) font-medium"
              }
            >
              The tracks
            </span>
            <h2 className={"text-2xl md:text-3xl font-semibold text-gray-800 mt-1 mb-6"}>
              Four skills, one badge each per level
            </h2>
            <div className={"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"}>
              {coreTracks.map((track) => (
                <div
                  key={track.id}
                  className={
                    "group relative h-64 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                  }
                >
                  <Image
                    src={track.image}
                    alt={""}
                    fill
                    sizes={
                      "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    }
                    className={
                      "absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    }
                  />
                  <div
                    className={
                      "absolute inset-x-3 bottom-3 rounded-xl bg-white p-4 shadow-sm"
                    }
                  >
                    <div className={"flex items-center gap-2.5"}>
                      <span
                        className={
                          "flex size-8 shrink-0 items-center justify-center rounded-full text-white text-sm"
                        }
                        style={{ backgroundColor: track.color }}
                      >
                        {TRACK_ICON[track.id]}
                      </span>
                      <h3
                        className={
                          "font-bold text-navy text-[15px] leading-snug"
                        }
                      >
                        {track.name}
                      </h3>
                    </div>
                    <p className={"mt-1.5 text-sm text-gray-500 leading-snug"}>
                      {track.blurb}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Levels */}
          {HONOR_LEVELS.map((level) => (
            <div key={level.id} id={`level-${level.id}`} className={"mb-16 scroll-mt-6"}>
              <div className={"flex flex-wrap items-end justify-between gap-4 mb-6"}>
                <div>
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
                  <p className={"text-gray-500 text-sm max-w-2xl mt-2"}>
                    {level.focus}
                  </p>
                </div>
                <Link
                  href={`/join?club=${level.clubSlug}`}
                  className={
                    "inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white hover:brightness-95 transition"
                  }
                  style={{ backgroundColor: level.colorDark }}
                >
                  Join {level.name} →
                </Link>
              </div>

              <div className={"grid grid-cols-1 md:grid-cols-2 gap-5"}>
                {level.badges.map((badge) => {
                  const track = HONOR_TRACK_BY_ID[badge.track];
                  return (
                    <article
                      key={badge.id}
                      id={`badge-${badge.id}`}
                      className={
                        "group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm scroll-mt-6 hover:shadow-md transition-shadow"
                      }
                    >
                      <div className={"flex items-start gap-4"}>
                        <span
                          className={
                            "mt-0.5 flex size-11 shrink-0 items-center justify-center text-white"
                          }
                          style={{
                            backgroundColor: track.color,
                            borderRadius: badge.shape === "pin" ? "9999px" : "0.75rem",
                          }}
                          aria-hidden={"true"}
                        >
                          {TRACK_ICON[badge.track]}
                        </span>
                        <div className={"min-w-0 flex-1"}>
                          <div className={"flex flex-wrap items-center gap-2"}>
                            <h3 className={"font-bold text-navy text-lg leading-snug"}>
                              {badge.name}
                            </h3>
                            <span
                              className={
                                "rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                              }
                              style={{
                                color: track.color,
                                borderColor: `${track.color}55`,
                              }}
                            >
                              {track.short}
                            </span>
                          </div>
                          <p className={"mt-0.5 text-xs text-gray-400"}>
                            {SHAPE_LABEL[badge.shape]} · {badge.concept}
                          </p>
                        </div>
                      </div>

                      <p className={"mt-4 text-[11px] font-bold uppercase tracking-widest text-gray-400"}>
                        Requirements
                      </p>
                      <ul className={"mt-2 space-y-2.5"}>
                        {badge.requirements.map((req) => (
                          <li
                            key={req}
                            className={"flex gap-2.5 text-sm text-gray-700 leading-relaxed"}
                          >
                            <LuCheck
                              className={"mt-1 shrink-0 text-sm"}
                              style={{ color: level.colorDark }}
                              aria-hidden={"true"}
                            />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </article>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Closing CTA */}
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
            <div className={"relative px-6 py-8 md:px-10 md:py-10 md:flex md:items-center md:justify-between gap-5"}>
              <div>
                <span
                  className={"text-[11px] uppercase tracking-widest font-medium"}
                  style={{ color: sprout.color }}
                >
                  Start at level one
                </span>
                <h3 className={"mt-1 text-2xl md:text-3xl font-bold tracking-tight"}>
                  Earn your first badge this term
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
