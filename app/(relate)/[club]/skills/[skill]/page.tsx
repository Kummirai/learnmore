import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Navbar from "@/components/Navbar";
import JoinCta from "@/components/join/JoinCta";
import SkillProgress from "@/components/skills/SkillProgress";
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

  return (
    <>
      <header
        className={"relative overflow-hidden text-white"}
        style={{
          background: `linear-gradient(115deg, ${level?.colorDark ?? targetClub?.colorDark ?? "#1d2a4d"} 0%, #1d2a4d 62%, #151f3a 100%)`,
        }}
      >
        <Navbar overlay />

        {entry.image && (
          <Image
            src={entry.image}
            alt=""
            fill
            sizes={"100vw"}
            className={"object-cover opacity-35"}
          />
        )}

        <div
          aria-hidden={"true"}
          className={"absolute inset-0"}
          style={{
            background:
              "linear-gradient(180deg, rgba(21,31,58,0.55) 0%, rgba(21,31,58,0.35) 55%, rgba(21,31,58,0.72) 100%)",
          }}
        />

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

          <h1
            className={"font-black tracking-tight leading-[1.05] break-words"}
            style={{
              fontSize: "clamp(2rem, 7vw, 3.5rem)",
              textShadow: "0 1px 4px rgba(21,31,58,0.9), 0 2px 16px rgba(21,31,58,0.7)",
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
                textShadow: "0 1px 3px rgba(21,31,58,0.8), 0 2px 12px rgba(21,31,58,0.6)",
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
            {[
              { label: "Level", value: level?.name ?? "—" },
              { label: "Requirements", value: String(entry.requirements.length) },
              { label: "Club", value: capitalize(club) },
            ].map((item) => (
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
            <div
              className={"rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"}
            >
              <span
                className={
                  "text-xs uppercase tracking-widest font-medium"
                }
                style={{ color: level?.colorDark ?? targetClub?.colorDark ?? "#0fa3c4" }}
              >
                About this skill
              </span>
              <h2 className={"mt-1 text-xl font-bold text-navy"}>
                {capitalize(club)}
              </h2>
              <p className={"mt-2 text-sm text-gray-600 leading-relaxed"}>
                {entry.description ?? "No description provided."}
              </p>
              {level && (
                <p className={"mt-4 border-t border-gray-100 pt-4 text-sm text-gray-600 leading-relaxed"}>
                  <strong className={"text-navy"}>{level.name}</strong> —{" "}
                  {level.description ?? `Part of the ${level.name} level.`}
                </p>
              )}
            </div>

            <div
              className={"rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"}
            >
              <span
                className={
                  "text-xs uppercase tracking-widest font-medium"
                }
                style={{ color: level?.colorDark ?? targetClub?.colorDark ?? "#0fa3c4" }}
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
            <SkillProgress
              skillId={entry.id}
              skillName={entry.name}
              requirements={entry.requirements}
              clubSlug={club}
              whatsappGroupLink={targetClub?.whatsappGroupLink}
            />

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
