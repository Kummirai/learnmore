import Link from "next/link";
import JoinCta from "@/components/join/JoinCta";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";

import PageHero from "@/components/PageHero";
import { programSlug, type RelateClub, type RelateProgram } from "@/constants/relate";
import { getClub } from "@/lib/clubs";
import { clipText, siteMetadata, SITE_NAME, SITE_URL } from "@/lib/seo";

/** Clubs come from the catalogue at request time — no build-time params. */
export const dynamic = "force-dynamic";

type Params = { club: string; program: string };

async function findProgram(
  clubSlug: string,
  programSlugPath: string,
): Promise<{ club?: RelateClub; program?: RelateProgram }> {
  const club = await getClub(clubSlug).catch(() => undefined);
  if (!club) return {};
  const program = club.programs.find(
    (p) => programSlug(p.name) === programSlugPath,
  );
  return { club, program };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { club: clubSlug, program: programPath } = await params;
  const { club, program } = await findProgram(clubSlug, programPath);
  if (!club || !program) return {};

  const title = `${program.name} · ${club.name} Program`;
  const description = clipText(program.blurb);
  const canonical = `/${club.slug}/${programSlug(program.name)}`;
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

export default async function ClubProgramPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { club: clubSlug, program: programPath } = await params;
  const { club, program } = await findProgram(clubSlug, programPath);
  if (!club || !program) notFound();

  const parent = club.parentSlug
    ? await getClub(club.parentSlug).catch(() => undefined)
    : undefined;
  const others = club.programs.filter((p) => p.name !== program.name);
  const clubVars = {
    "--club-accent": club.color,
    "--club-accent-dark": club.colorDark,
  } as CSSProperties;

  return (
    <>
      <PageHero
        style={clubVars}
        title={program.name}
        mobileTitle={program.name.split(/\s+/)[0]}
        tagline={club.tagline}
        description={program.blurb}
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
            <Link
              href={`/${club.slug}#programs`}
              className={
                "inline-flex items-center gap-2 border border-white/25 text-white px-6 py-3 rounded-lg font-semibold text-sm hover:border-white/60 transition-colors"
              }
            >
              All {club.name} programs
            </Link>
          </>
        }
        meta={[
          { label: "Club", value: club.name },
          { label: "Group", value: club.group },
          { label: "Age", value: club.ageRange },
        ]}
        metaEnd={
          parent ? (
            <Link
              href={`/${parent.slug}`}
              className={
                "inline-flex items-center gap-2 font-medium text-white hover:text-cyan-light transition-colors"
              }
            >
              <span
                className={"text-[11px] uppercase tracking-widest text-white/50"}
              >
                Part of
              </span>
              {parent.name} ←
            </Link>
          ) : undefined
        }
      />

      <section className={"flex-1 px-4 py-12"}>
        <div className={"max-w-6xl mx-auto"}>
          <div style={clubVars}>
            <span
              className={
                "text-xs uppercase tracking-widest text-(--club-accent) font-medium"
              }
            >
              About this program
            </span>
            <h2
              className={
                "text-2xl md:text-3xl font-semibold text-gray-800 mt-1 mb-4"
              }
            >
              {program.name} at {club.name}
            </h2>
            <div
              className={
                "rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm"
              }
            >
              <span
                className={"mb-4 block size-10 rounded-full"}
                style={{ backgroundColor: club.color }}
                aria-hidden={"true"}
              />
              <p className={"text-gray-700 leading-relaxed md:text-lg"}>
                {program.detail}
              </p>
            </div>

            <div
              className={
                "mt-6 flex flex-wrap items-center gap-3"
              }
            >
              <JoinCta
                href={`/join?club=${club.slug}`}
                className={
                  "inline-flex items-center gap-2 text-white px-6 py-3 rounded-lg font-semibold text-sm hover:brightness-95 transition"
                }
                style={{ backgroundColor: club.colorDark }}
              >
                Join {club.name} — take part in {program.name}
              </JoinCta>
              <Link
                href={`/${club.slug}#programs`}
                className={
                  "inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold text-sm hover:border-cyan hover:text-cyan-dark transition-colors"
                }
              >
                ← Back to {club.name}
              </Link>
            </div>

            {others.length > 0 && (
              <div className={"mt-14"}>
                <h3
                  className={
                    "text-sm font-semibold text-gray-400 uppercase tracking-widest mb-2"
                  }
                >
                  More ways to be involved
                </h3>
                <div className={"grid grid-cols-1 md:grid-cols-2 gap-x-12"}>
                  {others.map((p) => (
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
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
