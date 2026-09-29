import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Navbar from "@/components/Navbar";
import JoinCta from "@/components/join/JoinCta";
import HonorProgress from "@/components/sprout/HonorProgress";
import { getClub } from "@/constants/relate";
import {
  HONOR_ENTRIES,
  getHonor,
  honorWhereEarned,
  neighborHonors,
} from "@/constants/sproutHonors";
import { clipText, siteMetadata, SITE_NAME, SITE_URL } from "@/lib/seo";

type Params = { badge: string };

/** Every honor gets its own page, generated at build time. */
export function generateStaticParams(): Params[] {
  return HONOR_ENTRIES.map((e) => ({ badge: e.badge.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { badge } = await params;
  const entry = getHonor(badge);
  if (!entry) return {};

  const title = `${entry.badge.name} · ${entry.level.name} Honor`;
  const description = clipText(
    `${entry.track.name} — ${entry.badge.requirements[0].text}`,
  );
  const canonical = `/sprout/honors/${entry.badge.id}`;
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

export default async function HonorDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { badge } = await params;
  const entry = getHonor(badge);
  if (!entry) notFound();

  const { level, badge: honor, track } = entry;
  const club = getClub("sprout")!;
  const { prev, next } = neighborHonors(honor.id);

  return (
    <>
      <header
        className={"relative overflow-hidden text-white"}
        style={{
          background: `linear-gradient(115deg, ${level.colorDark} 0%, #1d2a4d 62%, #151f3a 100%)`,
        }}
      >
        <Navbar overlay />

        <span
          aria-hidden={"true"}
          className={
            "absolute -right-24 -top-24 size-96 rounded-full blur-3xl opacity-30"
          }
          style={{ backgroundColor: track.color }}
        />
        <span
          aria-hidden={"true"}
          className={
            "absolute -left-20 bottom-0 size-72 rounded-full blur-3xl opacity-20"
          }
          style={{ backgroundColor: level.color }}
        />

        <div className={"relative max-w-6xl mx-auto px-4 pt-32 pb-14"}>
          <nav
            aria-label={"Breadcrumb"}
            className={"mb-8 flex flex-wrap items-center gap-2 text-xs"}
          >
            <Link
              href={"/sprout"}
              className={"text-white/60 hover:text-white transition-colors"}
            >
              Sprout
            </Link>
            <span className={"text-white/30"}>/</span>
            <Link
              href={"/sprout/honors"}
              className={"text-white/60 hover:text-white transition-colors"}
            >
              Honors
            </Link>
            <span className={"text-white/30"}>/</span>
            <span className={"text-white font-semibold"}>{honor.name}</span>
          </nav>

          <h1
            className={"font-black tracking-tight leading-[1.05] break-words"}
            style={{ fontSize: "clamp(2rem, 7vw, 3.5rem)" }}
          >
            {honor.name}
          </h1>

          <p
            className={
              "mt-3 max-w-xl text-sm md:text-base text-white/85 leading-relaxed"
            }
          >
            {honor.concept}
          </p>

          <dl
            className={
              "mt-7 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-white/15 pt-5"
            }
          >
            {[
              { label: "For", value: level.name },
              { label: "Track", value: track.short },
              {
                label: "Requirements",
                value: String(honor.requirements.length),
              },
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
              href={`/join?club=${level.clubSlug}`}
              className={
                "inline-flex items-center gap-2 bg-white text-navy px-6 py-3 rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors"
              }
            >
              Join {level.name}
            </JoinCta>
            <Link
              href={"/sprout/sprout-camp"}
              className={
                "inline-flex items-center gap-2 border border-white/30 px-6 py-3 rounded-lg font-semibold text-sm hover:border-white/70 transition-colors"
              }
            >
              Earn it at camp →
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
                style={{ color: level.colorDark }}
              >
                About this honor
              </span>
              <h2 className={"mt-1 text-xl font-bold text-navy"}>
                {track.name}
              </h2>
              <p className={"mt-2 text-sm text-gray-600 leading-relaxed"}>
                {track.blurb}
              </p>
              <p className={"mt-4 border-t border-gray-100 pt-4 text-sm text-gray-600 leading-relaxed"}>
                <strong className={"text-navy"}>{level.name}</strong> —{" "}
                {level.focus}
              </p>
            </div>

            <div
              className={"rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"}
            >
              <span
                className={
                  "text-xs uppercase tracking-widest font-medium"
                }
                style={{ color: level.colorDark }}
              >
                Where it&apos;s earned
              </span>
              <p className={"mt-2 text-sm text-gray-600 leading-relaxed"}>
                {honorWhereEarned(entry)}
              </p>
              <div className={"mt-4 flex flex-wrap gap-3"}>
                <Link
                  href={`/${level.clubSlug}`}
                  className={
                    "inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-navy hover:border-cyan hover:text-cyan-dark transition-colors"
                  }
                >
                  {level.name} page →
                </Link>
                <a
                  href={club.whatsappGroupLink}
                  target={"_blank"}
                  rel={"noreferrer"}
                  className={
                    "inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-navy hover:border-cyan hover:text-cyan-dark transition-colors"
                  }
                >
                  Ask a leader →
                </a>
              </div>
            </div>

            <nav
              aria-label={"More honors"}
              className={
                "flex items-stretch justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
              }
            >
              {prev ? (
                <Link
                  href={`/sprout/honors/${prev.badge.id}`}
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
                    {prev.badge.name}
                  </span>
                </Link>
              ) : (
                <span className={"px-3 py-2 text-sm text-gray-300"}>
                  ← First honor
                </span>
              )}
              {next ? (
                <Link
                  href={`/sprout/honors/${next.badge.id}`}
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
                    {next.badge.name}
                  </span>
                </Link>
              ) : (
                <span className={"px-3 py-2 text-sm text-gray-300 text-right"}>
                  Last honor →
                </span>
              )}
            </nav>
          </div>

          <div className={"lg:sticky lg:top-6 space-y-5"}>
            <HonorProgress
              badgeId={honor.id}
              badgeName={honor.name}
              requirements={honor.requirements}
              whatsappGroupLink={club.whatsappGroupLink}
            />

            <div
              className={
                "rounded-2xl border border-gray-200 bg-alice-blue/60 p-6"
              }
            >
              <h3 className={"font-bold text-navy mb-1"}>
                Not a Sprout member yet?
              </h3>
              <p className={"text-sm text-slate-gray mb-4"}>
                Join {level.name} and start earning honors this term — free, and
                your leader walks with you through every requirement.
              </p>
              <JoinCta
                href={`/join?club=${level.clubSlug}`}
                className={
                  "inline-flex items-center justify-center gap-2 w-full bg-navy text-white px-5 py-3 rounded-lg font-semibold text-sm hover:bg-navy/90 transition-colors"
                }
              >
                Join {level.name}
              </JoinCta>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
