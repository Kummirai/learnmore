import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Navbar from "@/components/Navbar";
import JoinCta from "@/components/join/JoinCta";
import ModuleTracker from "@/components/skills/ModuleTracker";
import SkillDashboard from "@/components/skills/SkillDashboard";
import { getClub } from "@/lib/clubs";
import { getSkills, type SkillsCatalog } from "@/lib/skills";
import { clipText, siteMetadata, SITE_NAME, SITE_URL } from "@/lib/seo";

type Params = { club: string; skill: string };

/** Skills come from the API at request time. */
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { club, skill } = await params;
  let catalog: SkillsCatalog;
  try {
    catalog = await getSkills(club);
  } catch {
    return { title: `${capitalize(club)} Skills · Unavailable` };
  }
  const entry = catalog.getSkill(skill);
  if (!entry) return {};

  const title = `${entry.name} · ${capitalize(club)} Skill`;
  const description = clipText(
    `${entry.description ?? entry.requirements[0]?.text ?? ""}`,
  );
  const canonical = `/${club}/skills/${entry.id}`;
  return siteMetadata(
    {
      title,
      description,
      openGraph: {
        type: "website",
        url: `${SITE_URL}${canonical}`,
        siteName: SITE_NAME,
        title,
        description,
      },
    },
    canonical,
  );
}

export default async function SkillDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { club, skill } = await params;
  let catalog: SkillsCatalog;
  try {
    catalog = await getSkills(club);
  } catch {
    return <SkillUnavailable clubSlug={club} skillId={skill} />;
  }

  const entry = catalog.getSkill(skill);
  if (!entry) notFound();

  const level = catalog.getLevel(entry.levelId);
  const targetClub = await getClub(club).catch(() => undefined);
  const allSkills = catalog.skills;
  const idx = allSkills.findIndex((s) => s.id === skill);
  const prev = idx > 0 ? allSkills[idx - 1] : undefined;
  const next = idx >= 0 && idx < allSkills.length - 1 ? allSkills[idx + 1] : undefined;
  const accent = level?.colorDark ?? targetClub?.colorDark ?? "#0fa3c4";
  const entryLevels = (entry.levels ?? []).filter(Boolean);
  const hasLearningPortal =
    club === "sprout-tweens" && skill === "sprout_03_programming";
  const totalRequirements = entryLevels.length
    ? entryLevels.reduce(
        (sum, l) => sum + (l.requirements?.length ?? 0),
        0,
      )
    : entry.requirements.length;
  const heroFacts = [
    { label: "Level", value: level?.name ?? "—" },
    ...(entry.type ? [{ label: "Type", value: entry.type }] : []),
    { label: "Requirements", value: String(totalRequirements) },
    { label: "Club", value: capitalize(club) },
  ];

  return (
    <>
      <header
        className={"relative overflow-hidden text-white"}
        style={{
          background: entry.image
            ? "linear-gradient(115deg, #0b0c0f 0%, #101114 60%, #08090b 100%)"
            : `linear-gradient(115deg, ${level?.colorDark ?? targetClub?.colorDark ?? "#1d2a4d"} 0%, #1d2a4d 62%, #151f3a 100%)`,
        }}
      >
        <Navbar overlay />

        {entry.image && (
          <Image
            src={entry.image}
            alt=""
            fill
            sizes={"100vw"}
            className={"object-cover opacity-50"}
          />
        )}

        <span
          aria-hidden={"true"}
          className={
            "absolute -right-24 -top-24 size-96 rounded-full blur-3xl opacity-30"
          }
          style={{ backgroundColor: entry.color ?? targetClub?.color ?? "#13c5dd" }}
        />
        <span
          aria-hidden={"true"}
          className={
            "absolute -left-20 bottom-0 size-72 rounded-full blur-3xl opacity-20"
          }
          style={{ backgroundColor: level?.color ?? targetClub?.color ?? "#13c5dd" }}
        />

        <div className={"relative max-w-6xl mx-auto px-4 pt-32 pb-14"}>
          <nav
            aria-label={"Breadcrumb"}
            className={"mb-8 flex flex-wrap items-center gap-2 text-xs"}
          >
            <Link
              href={`/${club}`}
              className={"text-white/60 hover:text-white transition-colors"}
            >
              {capitalize(club)}
            </Link>
            <span className={"text-white/30"}>/</span>
            <Link
              href={`/${club}/skills`}
              className={"text-white/60 hover:text-white transition-colors"}
            >
              Skills
            </Link>
            <span className={"text-white/30"}>/</span>
            <span className={"text-white font-semibold"}>{entry.name}</span>
          </nav>

          {entry.type && (
            <p
              className={
                "mb-4 inline-block rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white/90"
              }
            >
              {entry.type} skill
            </p>
          )}

          <h1
            className={"font-black tracking-tight leading-[1.05] break-words"}
            style={{
              fontSize: "clamp(2rem, 7vw, 3.5rem)",
              textShadow: "0 1px 2px rgba(0,0,0,0.95), 0 2px 14px rgba(0,0,0,0.85), 0 4px 36px rgba(0,0,0,0.6)",
            }}
          >
            {entry.name}
          </h1>

          {entry.description && (
            <p
              className={
                "mt-3 max-w-xl text-sm md:text-base text-white/85 leading-relaxed"
              }
              style={{
                textShadow: "0 1px 2px rgba(0,0,0,0.95), 0 2px 14px rgba(0,0,0,0.85), 0 4px 36px rgba(0,0,0,0.6)",
              }}
            >
              {entry.description}
            </p>
          )}

          <dl
            className={
              "mt-7 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-white/15 pt-5"
            }
          >
            {heroFacts.map((item) => (
              <div key={item.label}>
                <dt
                  className={
                    "block text-[11px] uppercase tracking-widest text-white/60"
                  }
                >
                  {item.label}
                </dt>
                <dd className={"font-semibold text-white"}>{item.value}</dd>
              </div>
            ))}
          </dl>

          <div className={"mt-7 flex flex-wrap gap-3"}>
            {hasLearningPortal && (
              <Link
                href={`/${club}/skills/${skill}/learn`}
                className={
                  "inline-flex items-center gap-2 bg-teal px-6 py-3 font-semibold text-white transition-colors hover:bg-teal-dark"
                }
              >
                Open Learning Portal →
              </Link>
            )}
            <JoinCta
              href={`/join?club=${club}`}
              className={
                "inline-flex items-center gap-2 bg-white text-navy px-6 py-3 rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors"
              }
            >
              Join {capitalize(club)}
            </JoinCta>
            <Link
              href={`/${club}/skills`}
              className={
                "inline-flex items-center gap-2 border border-white/30 px-6 py-3 rounded-lg font-semibold text-sm hover:border-white/70 transition-colors"
              }
            >
              All skills →
            </Link>
          </div>
        </div>
      </header>

      <section className={"flex-1 px-4 py-12 bg-white"}>
        <div
          className={
            "max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 items-start"
          }
        >
          <div className={"space-y-5"}>
            {hasLearningPortal && (
              <div
                className={
                  "relative overflow-hidden bg-deep-navy p-6 text-white"
                }
              >
                <span
                  aria-hidden={"true"}
                  className={
                    "absolute -right-12 -top-12 size-48 rounded-full bg-teal/25 blur-3xl"
                  }
                />
                <div className={"relative"}>
                  <span
                    className={
                      "inline-block border border-teal/50 bg-teal/15 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-teal-glow"
                    }
                  >
                    Ages 9–12 · 4-Year Cycle
                  </span>
                  <h2 className={"mt-3 text-xl font-black"}>
                    The 4-Year Evolving Profile portal
                  </h2>
                  <p
                    className={
                      "mt-2 text-sm leading-relaxed text-white/75"
                    }
                  >
                    Build one personal website that grows with you — HTML &amp;
                    CSS at 9, grids &amp; forms at 10, JavaScript at 11, a
                    published multi-page hub at 12. Follow curated free
                    resources, then your instructor signs off each milestone.
                  </p>
                  <Link
                    href={`/${club}/skills/${skill}/learn`}
                    className={
                      "mt-4 inline-flex items-center gap-2 bg-teal px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-teal-dark"
                    }
                  >
                    Enter the Learning Portal →
                  </Link>
                </div>
              </div>
            )}
            <div
              className={"rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"}
            >
              <span
                className={
                  "text-xs uppercase tracking-widest font-medium"
                }
                style={{ color: accent }}
              >
                Overview
              </span>
              <p className={"mt-2 text-sm text-gray-600 leading-relaxed"}>
                {entry.description ?? "No description provided."}
              </p>
              {entry.detail?.tools?.length ? (
                <div className={"mt-4 border-t border-gray-100 pt-4"}>
                  <p
                    className={
                      "text-[11px] font-bold uppercase tracking-widest text-gray-400"
                    }
                  >
                    You&apos;ll use
                  </p>
                  <div className={"mt-2 flex flex-wrap gap-2"}>
                    {entry.detail.tools.map((tool) => (
                      <span
                        key={tool}
                        className={
                          "rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700"
                        }
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
              {entry.detail?.appFeatures?.length ? (
                <div className={"mt-4 border-t border-gray-100 pt-4"}>
                  <p
                    className={
                      "text-[11px] font-bold uppercase tracking-widest text-gray-400"
                    }
                  >
                    In the app
                  </p>
                  <div className={"mt-2 flex flex-wrap gap-2"}>
                    {entry.detail.appFeatures.map((feature) => (
                      <span
                        key={feature}
                        className={
                          "rounded-full border border-cyan/25 bg-alice-blue/60 px-3 py-1 text-xs font-semibold text-cyan-dark"
                        }
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
              {entry.output && (
                <div
                  className={
                    "mt-4 rounded-xl border border-cyan/20 bg-alice-blue/60 px-4 py-3"
                  }
                >
                  <p
                    className={
                      "text-[11px] font-bold uppercase tracking-widest text-cyan-dark"
                    }
                  >
                    You walk away with
                  </p>
                  <p className={"mt-1 text-sm text-gray-700 leading-relaxed"}>
                    {entry.output}
                  </p>
                </div>
              )}
            </div>

            {entry.detail?.pathways && (
              <div
                className={"rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"}
              >
                <span
                  className={"text-xs uppercase tracking-widest font-medium"}
                  style={{ color: accent }}
                >
                  Your pathway
                </span>
                <div className={"mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4"}>
                  {entry.detail.pathways.sproutGraduate && (
                    <div
                      className={
                        "rounded-xl border border-gray-100 bg-gray-50 px-4 py-3.5"
                      }
                    >
                      <p
                        className={
                          "text-[11px] font-bold uppercase tracking-widest text-gray-400"
                        }
                      >
                        Coming from Sprout
                      </p>
                      <p className={"mt-1.5 text-sm text-gray-700 leading-relaxed"}>
                        {entry.detail.pathways.sproutGraduate}
                      </p>
                    </div>
                  )}
                  {entry.detail.pathways.directEntrant && (
                    <div
                      className={
                        "rounded-xl border border-gray-100 bg-gray-50 px-4 py-3.5"
                      }
                    >
                      <p
                        className={
                          "text-[11px] font-bold uppercase tracking-widest text-gray-400"
                        }
                      >
                        Direct entrant
                      </p>
                      <p className={"mt-1.5 text-sm text-gray-700 leading-relaxed"}>
                        {entry.detail.pathways.directEntrant}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {entry.modules?.length ? (
              <ModuleTracker skill={entry} clubSlug={club} accent={accent} />
            ) : null}

            {entry.levels.some((level) => level.requirements.length > 0) ? (
              <SkillDashboard
                skill={entry}
                clubSlug={club}
                whatsappGroupLink={targetClub?.whatsappGroupLink}
                accent={accent}
              />
            ) : null}

            <div
              className={"rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"}
            >
              <span
                className={
                  "text-xs uppercase tracking-widest font-medium"
                }
                style={{ color: accent }}
              >
                Where it&apos;s developed
              </span>
              <p className={"mt-2 text-sm text-gray-600 leading-relaxed"}>
                Practised at weekly {capitalize(club)} sessions, then proven in front of a leader who signs each requirement off.
              </p>
              <div className={"mt-4 flex flex-wrap gap-3"}>
                <Link
                  href={`/${club}`}
                  className={
                    "inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-navy hover:border-cyan hover:text-cyan-dark transition-colors"
                  }
                >
                  {capitalize(club)} page →
                </Link>
                {targetClub && (
                  <a
                    href={targetClub.whatsappGroupLink ?? `/${club}`}
                    target={"_blank"}
                    rel={"noreferrer"}
                    className={
                      "inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-navy hover:border-cyan hover:text-cyan-dark transition-colors"
                    }
                  >
                    Ask a leader →
                  </a>
                )}
              </div>
            </div>

            <nav
              aria-label={"More skills"}
              className={
                "flex items-stretch justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
              }
            >
              {prev ? (
                <Link
                  href={`/${club}/skills/${prev.id}`}
                  className={
                    "group min-w-0 rounded-lg px-3 py-2 text-sm hover:bg-alice-blue/60 transition-colors"
                  }
                >
                  <span
                    className={
                      "block text-[11px] uppercase tracking-widest text-gray-400"
                    }
                  >
                    ← Previous
                  </span>
                  <span
                    className={
                      "block font-semibold text-navy group-hover:text-cyan-dark transition-colors truncate"
                    }
                  >
                    {prev.name}
                  </span>
                </Link>
              ) : (
                <span className={"px-3 py-2 text-sm text-gray-300"}>
                  ← First skill
                </span>
              )}
              {next ? (
                <Link
                  href={`/${club}/skills/${next.id}`}
                  className={
                    "group min-w-0 rounded-lg px-3 py-2 text-sm text-right hover:bg-alice-blue/60 transition-colors ml-auto"
                  }
                >
                  <span
                    className={
                      "block text-[11px] uppercase tracking-widest text-gray-400"
                    }
                  >
                    Next →
                  </span>
                  <span
                    className={
                      "block font-semibold text-navy group-hover:text-cyan-dark transition-colors truncate"
                    }
                  >
                    {next.name}
                  </span>
                </Link>
              ) : (
                <span className={"px-3 py-2 text-sm text-gray-300 text-right"}>
                  Last skill →
                </span>
              )}
            </nav>
          </div>

          <div className={"lg:sticky lg:top-6 space-y-5"}>
            <div
              className={"rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"}
            >
              <span
                className={
                  "text-xs uppercase tracking-widest font-medium"
                }
                style={{ color: accent }}
              >
                Quick facts
              </span>
              <dl className={"mt-3 space-y-3"}>
                {[
                  ...(entry.type ? [{ label: "Skill type", value: entry.type }] : []),
                  {
                    label: "Levels",
                    value: entryLevels.length
                      ? entryLevels.map((l) => l.name).join(" · ")
                      : (level?.name ?? "—"),
                  },
                  { label: "Requirements", value: `${totalRequirements} to prove` },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={"border-b border-gray-100 pb-3 last:border-0 last:pb-0"}
                  >
                    <dt
                      className={
                        "block text-[11px] uppercase tracking-widest text-gray-400"
                      }
                    >
                      {item.label}
                    </dt>
                    <dd className={"text-sm font-semibold text-navy leading-snug"}>
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div
              className={
                "rounded-2xl border border-gray-200 bg-alice-blue/60 p-6"
              }
            >
              <h3 className={"font-bold text-navy mb-1"}>
                Not a {capitalize(club)} member yet?
              </h3>
              <p className={"text-sm text-slate-gray mb-4"}>
                Join {capitalize(club)} and start developing skills this term — free,
                and your leader walks with you through every requirement.
              </p>
              <JoinCta
                href={`/join?club=${club}`}
                className={
                  "inline-flex items-center justify-center gap-2 w-full bg-navy text-white px-5 py-3 rounded-lg font-semibold text-sm hover:bg-navy/90 transition-colors"
                }
              >
                Join {capitalize(club)}
              </JoinCta>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function SkillUnavailable({ clubSlug, skillId }: { clubSlug: string; skillId: string }) {
  return (
    <>
      <header
        className={"relative overflow-hidden text-white bg-navy"}
      >
        <Navbar overlay />
        <div className={"relative max-w-6xl mx-auto px-4 pt-32 pb-14"}>
          <h1
            className={"font-black tracking-tight leading-[1.05]"}
            style={{ fontSize: "clamp(2rem, 7vw, 3.5rem)" }}
          >
            {capitalize(clubSlug)} Skills
          </h1>
          <p
            className={
              "mt-3 max-w-xl text-sm md:text-base text-white/85 leading-relaxed"
            }
          >
            Every skill in the framework, its requirements and the progress
            panel that tracks it.
          </p>
        </div>
      </header>

      <section className={"flex-1 px-4 py-12 bg-white"}>
        <div
          className={
            "max-w-xl mx-auto text-center rounded-2xl border border-red-200 bg-red-50 px-6 py-14"
          }
        >
          <p className={"text-base font-semibold text-red-700 mb-1"}>
            We couldn&apos;t load this skill.
          </p>
          <p className={"text-sm text-red-600 mb-5"}>
            The skills framework is unavailable right now — please try again
            in a moment.
          </p>
          <a
            href={`/${clubSlug}/skills/${skillId}`}
            className={
              "text-sm font-semibold text-red-700 underline underline-offset-4"
            }
          >
            Try again
          </a>
        </div>
      </section>
    </>
  );
}

function capitalize(str: string): string {
  return str
    .replace(/^./, (c) => c.toUpperCase())
    .replace(/-./g, (m) => m[1].toUpperCase());
}
