import Link from "next/link";
import Image from "next/image";
import { LuCircleCheck } from "react-icons/lu";
import JoinCta from "@/components/join/JoinCta";
import type { CSSProperties } from "react";

import PageHero from "@/components/PageHero";
import { programSlug, programsByPillar } from "@/constants/relate";
import { getAllClubs, getClub, getClubClasses } from "@/lib/clubs";
import { getPublications } from "@/lib/publications";
import { getClubEvents } from "@/lib/events";
import PublicationLibrary from "@/components/publications/PublicationLibrary";
import { getHonors } from "@/lib/honors";
import DataError from "@/components/DataError";

export default async function ClubPage({ slug }: { slug: string }) {
  let club;
  try {
    club = await getClub(slug);
  } catch {
    return (
      <section className={"flex-1 px-4 py-12"}>
        <div className={"max-w-4xl mx-auto"}>
          <DataError label={"This club"} />
        </div>
      </section>
    );
  }

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
  const events = await getClubEvents(club.slug);
  const magazines = publications.filter((p) => p.kind === "magazine");
  const classes = await getClubClasses(club.slug).catch(() => []);
  // Honors are Sprout-only — one API read, and an explicit error if it fails.
  const loadsHonors =
    club.slug === "sprout" || club.slug.startsWith("sprout-");
  const honors = loadsHonors ? await getHonors().catch(() => null) : null;
  const honorLevel = honors?.honorLevelForClub(club.slug);
  const honorsError =
    loadsHonors && honors === null
      ? "The Sprout honors framework couldn't be loaded right now — the badges are temporarily unavailable."
      : null;
  const numericAge = club.ageRange.match(/^[\d–+ ]+/) ? club.ageRange : null;
  const parent = club.parentSlug
    ? await getClub(club.parentSlug).catch(() => undefined)
    : undefined;
  const allClubs = await getAllClubs().catch(() => []);
  // Sprout pages lead with Events & Activities — the programs list and its
  // flagship banner are replaced by what's on the calendar.
  const isSprout = club.slug === "sprout" || club.slug.startsWith("sprout-");
  const banner = isSprout
    ? {
        eyebrow: "Get involved",
        title: "Join Activities and Events",
        blurb: `Come along to ${club.name} and the extra dates on the calendar — take part, bring a friend and tick something off every week.`,
        events: true,
      }
    : club.programs[0]
      ? {
          eyebrow: "The weekly flagship",
          title: club.programs[0].name,
          blurb: club.programs[0].blurb,
          events: false,
        }
      : null;
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
        bgImage={club.heroImage}
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
              href={isSprout ? "#events" : "#programs"}
              className={
                "inline-flex items-center gap-2 border border-white/25 text-white px-6 py-3 rounded-lg font-semibold text-sm hover:border-white/60 transition-colors"
              }
            >
              {isSprout ? "See what's on" : "Explore programs"}
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

      {honorsError && (
        <section
          id={"honors"}
          className={"px-4 py-12 bg-white scroll-mt-6 border-b border-gray-100"}
        >
          <div className={"max-w-6xl mx-auto"}>
            <span
              className={
                "text-xs uppercase tracking-widest text-red-500 font-medium"
              }
            >
              Honors &amp; badges
            </span>
            <h2
              className={
                "text-2xl md:text-3xl font-semibold text-gray-800 mt-1 mb-4"
              }
            >
              Honors unavailable
            </h2>
            <p
              className={
                "max-w-xl rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600"
              }
            >
              {honorsError}
            </p>
          </div>
        </section>
      )}

      {honors && honorLevel && (
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
                const track = honors.trackById[badge.track];
                return (
                  <Link
                    key={badge.id}
                    href={`/sprout/honors/${badge.id}`}
                    className={
                      "group block rounded-2xl bg-white p-3 transition-colors hover:bg-alice-blue/40"
                    }
                  >
                    <span
                      className={"relative block h-44 overflow-hidden rounded-2xl"}
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
                    </span>
                    <span className={"block px-2 pb-1 pt-4"}>
                      <span
                        className={"flex items-center gap-2 text-xs text-gray-500"}
                      >
                        <span
                          className={"size-2.5 shrink-0 rounded-full"}
                          style={{ backgroundColor: track.color }}
                          aria-hidden={"true"}
                        />
                        {track.name} · {honors.shapeLabels[badge.shape]}
                      </span>
                      <span
                        className={"mt-1.5 flex items-center justify-between gap-3"}
                      >
                        <span
                          className={
                            "block font-bold text-gray-800 text-[17px] leading-snug group-hover:text-cyan transition-colors"
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
                        {badge.requirements[0].text}
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
          {(club.mission || club.vision) && (
            <div className={"mb-10 grid gap-4 md:grid-cols-2"}>
              {club.mission && (
                <div
                  className={
                    "rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                  }
                >
                  <span
                    className={
                      "text-[11px] uppercase tracking-widest font-semibold"
                    }
                    style={{ color: club.color }}
                  >
                    Mission
                  </span>
                  <p className={"mt-2 text-sm text-gray-600 leading-relaxed"}>
                    {club.mission}
                  </p>
                </div>
              )}
              {club.vision && (
                <div
                  className={
                    "rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                  }
                >
                  <span
                    className={
                      "text-[11px] uppercase tracking-widest font-semibold"
                    }
                    style={{ color: club.color }}
                  >
                    Vision
                  </span>
                  <p className={"mt-2 text-sm text-gray-600 leading-relaxed"}>
                    {club.vision}
                  </p>
                </div>
              )}
            </div>
          )}

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

          {!isSprout && (
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
                the weekly flagship first, then everything grouped under the
                three pillars: Shift, Sanctuary and Connect.
              </p>
            </div>
          )}

          {banner && (
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
                    {banner.eyebrow}
                  </span>
                  <h3
                    className={
                      "mt-1 text-2xl md:text-3xl font-bold tracking-tight"
                    }
                  >
                    {banner.title}
                  </h3>
                  <p
                    className={
                      "mt-2 text-white/80 text-sm md:text-base max-w-xl leading-relaxed"
                    }
                  >
                    {banner.blurb}
                  </p>
                </div>
                <div
                  className={
                    "shrink-0 self-start md:self-center flex flex-wrap items-center gap-3"
                  }
                >
                  <JoinCta
                    href={`/join?club=${club.slug}`}
                    className={
                      "inline-flex items-center gap-2 bg-white text-navy px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors"
                    }
                  >
                    Join {club.name}
                  </JoinCta>
                  {banner.events && (
                    <a
                      href={"#events"}
                      className={
                        "inline-flex items-center gap-2 border border-white/30 px-5 py-2.5 rounded-lg font-semibold text-sm hover:border-white/70 transition-colors"
                      }
                    >
                      See what&apos;s on →
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {!isSprout &&
            programsByPillar(club).map((group) => {
              const items = group.programs.filter((p) => p !== club.programs[0]);
              if (items.length === 0) return null;
              return (
                <div key={group.pillar ?? "all"} className={"mb-8"}>
                  <h3
                    className={
                      "text-sm font-semibold text-gray-400 uppercase tracking-widest mb-2"
                    }
                  >
                    {group.pillar
                      ? group.pillar + (group.label ? ` · ${group.label}` : "")
                      : "More ways to be involved"}
                  </h3>
                  <div className={"grid grid-cols-1 md:grid-cols-2 gap-x-12"}>
                    {items.map((p) => (
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
                </div>
              );
            })}

          {club.slug === "sprout" && (
            <Link
              href={"/sprout/honors"}
              className={
                "group mt-8 flex items-center gap-5 rounded-2xl border border-green-200 bg-green-50 p-6 hover:border-green-300 hover:bg-green-100 transition-colors"
              }
            >
              <span
                className={
                  "flex size-12 shrink-0 items-center justify-center rounded-full bg-green-600 text-white"
                }
                aria-hidden={"true"}
              >
                <LuCircleCheck className={"text-xl"} />
              </span>
              <span className={"min-w-0 flex-1"}>
                <span
                  className={
                    "block text-[11px] uppercase tracking-widest text-green-700 font-semibold"
                  }
                >
                  Honors &amp; badges
                </span>
                <span
                  className={"block font-bold text-green-900 text-lg leading-snug"}
                >
                  Sprout Club Honors framework
                </span>
                <span className={"block text-sm text-green-800 leading-snug"}>
                  Thirteen honors across safety, money, digital skills, coding
                  and media — earned from Sprout Kids through to Sprout Teens.
                </span>
              </span>
              <span
                className={
                  "hidden shrink-0 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white group-hover:bg-green-700 transition-colors sm:block"
                }
              >
                See the honors →
              </span>
            </Link>
          )}

          <div id={"events"} className={"mt-12 scroll-mt-8"}>
            <span
              className={
                "text-xs uppercase tracking-widest text-cyan font-medium"
              }
            >
              What&apos;s on
            </span>
            <h2
              className={
                "text-2xl md:text-3xl font-semibold text-gray-800 mt-1 mb-2"
              }
            >
              Events &amp; Activities
            </h2>
            <p className={"text-gray-500 text-sm max-w-xl mb-6"}>
              {isSprout
                ? `Every date on for ${club.name} — weekly gatherings, special days out and the camps that fill the term.`
                : `Upcoming dates for ${club.name} — the week-to-week rhythm sits in the programs above, these are the extra gatherings to put in the diary.`}
            </p>

            {events.length > 0 ? (
              <div
                className={
                  "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                }
              >
                {events.map((event) => {
                  const when = new Date(`${event.date}T00:00:00`);
                  const meta = [
                    event.time,
                    event.location,
                    event.fee || "Free",
                  ]
                    .filter(Boolean)
                    .join(" · ");
                  return (
                    <Link
                      key={event.id}
                      href={`/events/${event.id}`}
                      className={
                        "group block rounded-2xl bg-white p-3 transition-colors hover:bg-alice-blue/40"
                      }
                    >
                      <span
                        className={
                          "relative block h-44 overflow-hidden rounded-2xl"
                        }
                        style={
                          event.imageUrl
                            ? undefined
                            : {
                                background: `linear-gradient(135deg, ${club.colorDark} 0%, #1d2a4d 100%)`,
                              }
                        }
                      >
                        {event.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={event.imageUrl}
                            alt={event.title}
                            loading="lazy"
                            className={
                              "absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
                            }
                          />
                        ) : (
                          <span
                            className={
                              "absolute inset-0 flex flex-col items-center justify-center text-white"
                            }
                          >
                            <span
                              className={"text-4xl font-black leading-none"}
                            >
                              {when.getDate()}
                            </span>
                            <span
                              className={
                                "mt-1 text-xs uppercase tracking-widest text-white/70"
                              }
                            >
                              {when.toLocaleDateString("en-GB", {
                                month: "short",
                              })}
                            </span>
                          </span>
                        )}
                      </span>

                      <span className={"block px-2 pb-1 pt-4"}>
                        <span
                          className={
                            "block text-xs font-medium uppercase tracking-widest text-cyan"
                          }
                        >
                          {when.toLocaleDateString("en-GB", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                        <span
                          className={
                            "mt-1.5 flex items-center justify-between gap-3"
                          }
                        >
                          <span
                            className={
                              "block font-bold text-gray-800 text-[17px] leading-snug group-hover:text-cyan-dark transition-colors"
                            }
                          >
                            {event.title}
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
                            "mt-1 block text-[13px] text-slate-gray leading-snug"
                          }
                        >
                          {meta}
                        </span>
                        {event.description && (
                          <span
                            className={
                              "mt-1.5 block text-sm text-gray-500 leading-snug line-clamp-2"
                            }
                          >
                            {event.description}
                          </span>
                        )}
                      </span>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div
                className={
                  "rounded-xl border border-dashed border-gray-200 bg-alice-blue/40 px-5 py-6 text-sm text-gray-500"
                }
              >
                No dates on the calendar yet — new ones appear here as soon as
                leaders set them.
              </div>
            )}

            <Link
              href={"/events"}
              className={
                "mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan hover:text-cyan-dark transition-colors"
              }
            >
              All Relate events →
            </Link>
          </div>

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

          {allClubs.length > 1 && (
            <div className={"mt-12 bg-alice-blue rounded-xl p-8 text-center"}>
              <h2 className={"text-xl font-semibold text-gray-800 mb-5"}>
                Explore more clubs
              </h2>
              <div className={"flex flex-wrap justify-center gap-3"}>
                {allClubs.filter((c) => c.slug !== club.slug).map((c) => (
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
