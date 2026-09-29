import Link from "next/link";
import Image from "next/image";
import JoinCta from "@/components/join/JoinCta";
import type { CSSProperties } from "react";

import PageHero from "@/components/PageHero";
import {
  CLUBS,
  getClub,
  getClubClass,
  getClubClasses,
  programSlug,
} from "@/constants/relate";
import { getPublications } from "@/lib/publications";
import PublicationLibrary from "@/components/publications/PublicationLibrary";
import {
  HONOR_TRACK_BY_ID,
  SHAPE_LABEL,
  honorLevelForClub,
} from "@/constants/sproutHonors";

export default async function ClubPage({ slug }: { slug: string }) {
  const club = getClub(slug) ?? getClubClass(slug);

  if (!club) {
    return (
      <section className={"flex-1 px-4 py-12"}>
        <div className={"max-w-4xl mx-auto"}>
          <h1 className={"text-3xl font-semibold text-gray-800"}>
            Club not found
          </h1>
        </div>
      </section>
    );
  }

  const publications = await getPublications(club.slug);
  const magazines = publications.filter((p) => p.kind === "magazine");
  const classes = getClubClasses(club.slug);
  const honorLevel = honorLevelForClub(club.slug);
  const numericAge = club.ageRange.match(/^[\d–+ ]+/) ? club.ageRange : null;
  const parent = club.parentSlug ? getClub(club.parentSlug) : undefined;
  const clubVars = {
    "--club-accent": club.color,
    "--club-accent-dark": club.colorDark,
  } as CSSProperties;

  return (
    <>
      <PageHero
        title={club.name}
        mobileTitle={club.name.split(/\s+/)[0]}
        tagline={club.tagline}
        description={club.description}
        watermark={
          numericAge ? numericAge.replace(" yrs", "").trim() : undefined
        }
        actions={
          <>
            <JoinCta
              href={`/join?club=${club.slug}`}
              className={
                "inline-flex items-center gap-2 bg-white text-navy px-6 py-3 rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors"
              }
            >
              Join {club.name}
            </JoinCta>
            <a
              href={"#programs"}
              className={
                "inline-flex items-center gap-2 border border-white/25 text-white px-6 py-3 rounded-lg font-semibold text-sm hover:border-white/60 transition-colors"
              }
            >
              Explore programs
            </a>
          </>
        }
        meta={[
          { label: "Group", value: club.group },
          { label: "Age", value: club.ageRange },
          { label: "Programs", value: club.programs.length },
        ]}
        metaEnd={
          <>
            {parent && (
              <Link
                href={`/${parent.slug}`}
                className={
                  "inline-flex items-center gap-2 font-medium text-white hover:text-cyan-light transition-colors"
                }
              >
                <span
                  className={
                    "text-[11px] uppercase tracking-widest text-white/50"
                  }
                >
                  Part of
                </span>
                {parent.name} ←
              </Link>
            )}
            {!parent &&
              magazines.map((m) => (
                <Link
                  key={m.id}
                  href={`/library/${m.id}`}
                  className={
                    "inline-flex items-center gap-2 font-medium text-white hover:text-cyan-light transition-colors"
                  }
                >
                  <span
                    className={
                      "text-[11px] uppercase tracking-widest text-white/50"
                    }
                  >
                    Reading guide
                  </span>
                  {m.series ?? m.title} →
                </Link>
              ))}
          </>
        }
      />

      {honorLevel && (
        <section
          id={"honors"}
          className={"px-4 py-12 bg-white scroll-mt-6 border-b border-gray-100"}
        >
          <div className={"max-w-6xl mx-auto"}>
            <span
              className={
                "text-xs uppercase tracking-widest text-cyan font-medium"
              }
            >
              Honors &amp; badges
            </span>
            <h2
              className={
                "text-2xl md:text-3xl font-semibold text-gray-800 mt-1 mb-2"
              }
            >
              What {honorLevel.name} works toward
            </h2>
            <p className={"text-gray-500 text-sm max-w-xl mb-6"}>
              Level {honorLevel.levelNumber} of the Sprout Club honors framework
              — {honorLevel.focus}
            </p>

            <div
              className={
                "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              }
            >
              {honorLevel.badges.map((badge) => {
                const track = HONOR_TRACK_BY_ID[badge.track];
                return (
                  <Link
                    key={badge.id}
                    href={`/sprout/honors#badge-${badge.id}`}
                    className={
                      "group relative block h-72 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:border-cyan hover:shadow-md transition-all"
                    }
                  >
                    <Image
                      src={track.image}
                      alt={""}
                      fill
                      sizes={
                        "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                      }
                      className={
                        "absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
                      }
                    />
                    <span
                      className={
                        "absolute inset-x-3 bottom-3 block rounded-xl bg-white p-4 shadow-sm"
                      }
                    >
                      <span
                        className={
                          "flex items-center gap-2 text-xs text-gray-400"
                        }
                      >
                        <span
                          className={"size-2.5 shrink-0 rounded-full"}
                          style={{ backgroundColor: track.color }}
                          aria-hidden={"true"}
                        />
                        {track.name} · {SHAPE_LABEL[badge.shape]}
                      </span>
                      <span
                        className={
                          "mt-1.5 flex items-center justify-between gap-3"
                        }
                      >
                        <span
                          className={
                            "block font-bold text-navy text-[17px] leading-snug group-hover:text-cyan-dark transition-colors"
                          }
                        >
                          {badge.name}
                        </span>
                        <span
                          aria-hidden={"true"}
                          className={
                            "shrink-0 text-sm font-semibold text-cyan opacity-0 group-hover:opacity-100 transition-opacity"
                          }
                        >
                          →
                        </span>
                      </span>
                      <span
                        className={
                          "mt-2 block text-sm text-gray-500 leading-snug line-clamp-2"
                        }
                      >
                        {badge.requirements[0]}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>

            <Link
              href={`/sprout/honors#level-${honorLevel.id}`}
              className={
                "mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan hover:text-cyan-dark transition-colors"
              }
            >
              All requirements for {honorLevel.name} →
            </Link>
          </div>
        </section>
      )}

      <section className={"flex-1 px-4 py-12"}>
        <div className={"max-w-6xl mx-auto"}>
          {classes.length > 0 && (
            <div className={"mb-10"}>
              <span
                className={
                  "text-xs uppercase tracking-widest text-cyan font-medium"
                }
              >
                Age groups
              </span>
              <h2
                className={
                  "text-2xl md:text-3xl font-semibold text-gray-800 mt-1 mb-2"
                }
              >
                {club.name} runs in three age groups
              </h2>
              <p className={"text-gray-500 text-sm max-w-xl mb-6"}>
                Pick the band that fits your child — each has its own leaders,
                rhythm and weekly program.
              </p>
              <div className={"border-t border-gray-200"}>
                {classes.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/${c.slug}`}
                    className={
                      "group flex items-center gap-5 md:gap-8 py-6 border-b border-gray-200 hover:bg-alice-blue/70 transition-colors"
                    }
                  >
                    <div className={"w-20 md:w-48 shrink-0"}>
                      <span
                        className={
                          "block font-black tracking-tight leading-none"
                        }
                        style={{
                          color: c.color,
                          fontSize: "clamp(2.25rem, 5vw, 3.25rem)",
                        }}
                      >
                        {c.ageRange.split(" yrs")[0]}
                      </span>
                    </div>
                    <div className={"flex-1 min-w-0"}>
                      <h3
                        className={
                          "font-bold text-gray-800 text-lg leading-snug"
                        }
                      >
                        {c.name}
                      </h3>
                      <p
                        className={
                          "text-sm text-gray-500 leading-snug line-clamp-2"
                        }
                      >
                        {c.tagline}
                      </p>
                    </div>
                    <span
                      className={
                        "shrink-0 text-sm font-semibold text-cyan group-hover:text-cyan-dark transition-colors"
                      }
                    >
                      View programs
                      <span
                        className={
                          "inline-block ml-1 group-hover:translate-x-1 transition-transform"
                        }
                      >
                        →
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div id={"programs"} className={"scroll-mt-8 mb-10"}>
            <span
              className={
                "text-xs uppercase tracking-widest text-cyan font-medium"
              }
            >
              What happens here
            </span>
            <h2
              className={
                "text-2xl md:text-3xl font-semibold text-gray-800 mt-1"
              }
            >
              Programs &amp; Activities
            </h2>
            <p className={"text-gray-500 text-sm mt-2 max-w-xl"}>
              {club.programs.length} programs for {club.group.toLowerCase()} —
              one weekly flagship, then the whole menu of ways to be involved.
            </p>
          </div>

          {club.programs[0] && (
            <div
              className={
                "relative overflow-hidden rounded-2xl text-white mb-10 shadow-sm"
              }
              style={{ backgroundColor: club.colorDark }}
            >
              <div
                className={"absolute inset-0"}
                style={{
                  background: `linear-gradient(120deg, ${club.colorDark} 20%, #1d2a4d 100%)`,
                }}
              />
              <div
                className={
                  "absolute -right-16 -top-20 size-64 rounded-full blur-3xl opacity-25"
                }
                style={{ backgroundColor: club.color }}
              />
              <div
                className={
                  "relative px-6 py-8 md:px-10 md:py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5"
                }
              >
                <div>
                  <span
                    className={
                      "text-[11px] uppercase tracking-widest font-medium"
                    }
                    style={{ color: club.color }}
                  >
                    The weekly flagship
                  </span>
                  <h3
                    className={
                      "mt-1 text-2xl md:text-3xl font-bold tracking-tight"
                    }
                  >
                    {club.programs[0].name}
                  </h3>
                  <p
                    className={
                      "mt-2 text-white/80 text-sm md:text-base max-w-xl leading-relaxed"
                    }
                  >
                    {club.programs[0].blurb}
                  </p>
                </div>
                <div className={"shrink-0 self-start md:self-center"}>
                  <JoinCta
                    href={`/join?club=${club.slug}`}
                    className={
                      "inline-flex items-center gap-2 bg-white text-navy px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors"
                    }
                  >
                    Join {club.name}
                  </JoinCta>
                </div>
              </div>
            </div>
          )}

          {club.programs.length > 1 && (
            <>
              <h3
                className={
                  "text-sm font-semibold text-gray-400 uppercase tracking-widest mb-2"
                }
              >
                More ways to be involved
              </h3>
              <div className={"grid grid-cols-1 md:grid-cols-2 gap-x-12"}>
                {club.programs.slice(1).map((p) => (
                  <Link
                    key={p.name}
                    href={`/${club.slug}/${programSlug(p.name)}`}
                    className={
                      "group -mx-3 flex items-baseline gap-3 rounded-lg px-3 py-4 border-b border-gray-100 hover:bg-alice-blue/70 transition-colors"
                    }
                  >
                    <span
                      className={"size-2 shrink-0 rounded-full self-center"}
                      style={{ backgroundColor: club.color }}
                    />
                    <div className={"min-w-0"}>
                      <h4
                        className={
                          "font-medium text-gray-800 text-[15px] group-hover:text-cyan-dark transition-colors"
                        }
                      >
                        {p.name}
                      </h4>
                      <p className={"text-sm text-gray-500 leading-snug"}>
                        {p.blurb}
                      </p>
                    </div>
                    <span
                      aria-hidden={"true"}
                      className={
                        "ml-auto self-center text-sm font-semibold text-cyan opacity-0 group-hover:opacity-100 transition-opacity"
                      }
                    >
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </>
          )}

          {club.slug === "sprout" && (
            <Link
              href={"/sprout/honors"}
              className={
                "group mt-8 flex items-center gap-5 rounded-2xl border border-gray-200 bg-alice-blue/60 p-6 hover:border-cyan hover:bg-alice-blue transition-colors"
              }
            >
              <span
                className={
                  "flex size-12 shrink-0 items-center justify-center rounded-full text-white text-xl"
                }
                style={{ backgroundColor: club.colorDark }}
                aria-hidden={"true"}
              >
                ★
              </span>
              <span className={"min-w-0 flex-1"}>
                <span
                  className={
                    "block text-[11px] uppercase tracking-widest text-cyan font-semibold"
                  }
                >
                  Honors &amp; badges
                </span>
                <span className={"block font-bold text-navy text-lg leading-snug"}>
                  Sprout Club Honors framework
                </span>
                <span className={"block text-sm text-gray-500 leading-snug"}>
                  Thirteen honors across safety, money, digital skills, coding
                  and media — earned from Sprout Kids through to Sprout Teens.
                </span>
              </span>
              <span
                className={
                  "hidden shrink-0 text-sm font-semibold text-cyan group-hover:translate-x-1 transition-transform sm:block"
                }
              >
                See the honors →
              </span>
            </Link>
          )}

          {publications.length > 0 && (
            <div
              id={"library"}
              style={clubVars}
              className={"mt-12 mb-12 scroll-mt-8"}
            >
              <span
                className={
                  "text-xs uppercase tracking-widest text-(--club-accent) font-medium"
                }
              >
                Library
              </span>
              <h2
                className={
                  "text-2xl md:text-3xl font-semibold text-gray-800 mt-1 mb-2"
                }
              >
                Reading for {club.name}
              </h2>
              <p className={"text-gray-500 text-sm max-w-xl mb-6"}>
                This season’s study guide and bulletin — open to read, no
                account needed.
              </p>
              <PublicationLibrary
                publications={publications}
                clubName={club.name}
              />
            </div>
          )}

          {CLUBS.length > 1 && (
            <div className={"mt-12 bg-alice-blue rounded-xl p-8 text-center"}>
              <h2 className={"text-xl font-semibold text-gray-800 mb-5"}>
                Explore more clubs
              </h2>
              <div className={"flex flex-wrap justify-center gap-3"}>
                {CLUBS.filter((c) => c.slug !== club.slug).map((c) => (
                  <Link
                    key={c.slug}
                    href={`/${c.slug}`}
                    className={
                      "inline-flex items-center gap-2 bg-white border border-gray-200 text-navy px-4 py-3 min-h-11 rounded-lg text-sm font-medium hover:border-cyan hover:text-cyan-dark transition-colors"
                    }
                  >
                    <span
                      className={"size-2.5 rounded-full"}
                      style={{ backgroundColor: c.color }}
                    />
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
