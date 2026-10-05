import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import type { CSSProperties } from "react";

import PageHero from "@/components/PageHero";
import JoinCta from "@/components/join/JoinCta";
import { getClub, getClubAccent } from "@/lib/clubs";
import { getSkills } from "@/lib/skills";
import { clipText, siteMetadata, SITE_NAME, SITE_URL } from "@/lib/seo";

type Params = { club: string };

/** Skills come from the API at request time. */
export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { club } = await params;
  return siteMetadata(
      {
        title: `${capitalize(club)} Skills`,
        description: clipText(
          `Every skill available in the ${capitalize(club)} framework — requirements and progress tracking.`,
        ),
        openGraph: {
          type: "website",
          url: `${SITE_URL}/${club}/skills`,
          siteName: SITE_NAME,
          title: `${capitalize(club)} Skills`,
          description: clipText(
            `Every skill available in the ${capitalize(club)} framework — requirements and progress tracking.`,
          ),
        },
      },
      `/${club}/skills`,
  );
}

function capitalize(str: string): string {
  return str
    .replace(/^./, (c) => c.toUpperCase())
    .replace(/-./g, (m) => m[1].toUpperCase());
}

export default async function SkillsPage({ params }: { params: Promise<Params> }) {
  const { club } = await params;
  let catalog;
  try {
    catalog = await getSkills(club);
  } catch {
    return <SkillsUnavailable clubSlug={club} />;
  }

  let targetClub;
  try {
    targetClub = await getClub(club);
  } catch {
    return <SkillsUnavailable clubSlug={club} />;
  }
  if (!targetClub) return <SkillsUnavailable clubSlug={club} />;

  const clubVars = {
    "--club-accent": targetClub.color,
    "--club-accent-dark": targetClub.colorDark,
  } as CSSProperties;

  return (
    <div style={clubVars}>
      <PageHero
        style={clubVars}
        title={`${targetClub.name} Skills`}
        mobileTitle="Skills"
        tagline="Skills developed. Progress tracked."
        description={`${catalog.count} skills across ${catalog.levels.length} levels in the ${targetClub.name} framework.`}
        watermark={String(catalog.count)}
        actions={
          <>
            <JoinCta
              href={`/join?club=${targetClub.slug}`}
              className={
                "inline-flex items-center gap-2 bg-white text-navy px-6 py-3 rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors"
              }
            >
              Join {targetClub.name}
            </JoinCta>
            <Link
              href={`/${targetClub.slug}`}
              className={
                "inline-flex items-center gap-2 border border-white/25 text-white px-6 py-3 rounded-lg font-semibold text-sm hover:border-white/60 transition-colors"
              }
            >
              Back to {targetClub.name} →
            </Link>
          </>
        }
        meta={[
          { label: "Skills", value: String(catalog.count) },
          { label: "Levels", value: String(catalog.levels.length) },
          { label: "Age group", value: targetClub.ageRange },
        ]}
        metaEnd={
          <Link
            href={`/${targetClub.slug}`}
            className={
              "inline-flex items-center gap-2 font-medium text-white hover:text-cyan-light transition-colors"
            }
          >
            <span className={"text-[11px] uppercase tracking-widest text-white/50"}>
              Back to
            </span>
            {targetClub.name} ←
          </Link>
        }
      />

      <section className={"flex-1 px-4 py-12 bg-white"}>
        <div className={"max-w-6xl mx-auto"}>
          {catalog.levels.map((level) => {
            const levelSkills = catalog.skillsByLevel(level.id);
            if (levelSkills.length === 0) return null;
            return (
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
                    Level {level.order} · {level.name}
                  </span>
                  <h2
                    className={
                      "text-2xl md:text-3xl font-semibold text-gray-800 mt-1"
                    }
                  >
                    {level.name} skills
                  </h2>
                  {level.description && (
                    <p className={"text-gray-500 text-sm max-w-2xl mt-1.5"}>
                      {level.description}
                    </p>
                  )}
                </div>

                <div
                  className={
                    "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  }
                >
                  {levelSkills.map((skill) => (
                    <Link
                      key={skill.id}
                      href={`/${club}/skills/${skill.id}`}
                      className={
                        "group block rounded-2xl bg-white p-3 transition-colors hover:bg-alice-blue/40"
                      }
                    >
                      <span
                        className={
                          "relative block h-44 overflow-hidden rounded-2xl"
                        }
                        style={{
                          background: `linear-gradient(135deg, ${level.colorDark ?? targetClub.colorDark} 0%, ${targetClub.color} 100%)`,
                        }}
                      >
                        {skill.image ? (
                          <Image
                            src={skill.image}
                            alt=""
                            fill
                            sizes={
                              "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            }
                            className={"object-cover"}
                          />
                        ) : (
                          <span
                            className={"absolute inset-0 flex items-center justify-center"}
                          >
                            <span
                              className={
                                "text-4xl font-black text-white/20"
                              }
                            >
                              {skill.name[0]}
                            </span>
                          </span>
                        )}
                      </span>

                      <span className={"block px-2 pb-1 pt-4"}>
                        <span
                          className={
                            "flex items-center gap-2 text-xs text-gray-500"
                          }
                        >
                          <span
                            className={"size-2.5 shrink-0 rounded-full"}
                            style={{ backgroundColor: level.color ?? targetClub.color }}
                            aria-hidden={"true"}
                          />
                          {level.name} · Skill
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
                            {skill.name}
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
                        {skill.description && (
                          <span
                            className={
                              "mt-2 block text-sm text-gray-500 leading-snug line-clamp-2"
                            }
                          >
                            {skill.description}
                          </span>
                        )}
                        <span
                          className={
                            "mt-2 block text-sm text-gray-500 leading-snug line-clamp-2"
                          }
                        >
                          {skill.requirements.length > 0 ? skill.requirements[0].text : ""}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

async function SkillsUnavailable({ clubSlug }: { clubSlug: string }) {
  const accent = await getClubAccent(clubSlug);
  const clubVars = {
    "--club-accent": accent.color,
    "--club-accent-dark": accent.colorDark,
  } as CSSProperties;

  return (
    <div style={clubVars}>
      <PageHero
        style={clubVars}
        title={`${capitalize(clubSlug)} Skills`}
        mobileTitle="Skills"
        tagline="Skills developed. Progress tracked."
        description="Browse skills, requirements and track your progress."
        meta={[{ label: "Club", value: capitalize(clubSlug) }]}
      />

      <section className={"flex-1 px-4 py-12 bg-white"}>
        <div
          className={
            "max-w-xl mx-auto text-center rounded-2xl border border-red-200 bg-red-50 px-6 py-14"
          }
        >
          <p className={"text-base font-semibold text-red-700 mb-1"}>
            We couldn&apos;t load the skills framework.
          </p>
          <p className={"text-sm text-red-600 mb-5"}>
            The skill list is unavailable right now — please try again in a moment.
          </p>
          <a
            href={`/${clubSlug}/skills`}
            className={
              "text-sm font-semibold text-red-700 underline underline-offset-4"
            }
          >
            Try again
          </a>
        </div>
      </section>
    </div>
  );
}
