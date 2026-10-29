import Link from "next/link";
import type { Metadata } from "next";

import Navbar from "@/components/Navbar";
import ProgrammingPortal from "@/components/programming-portal/ProgrammingPortal";
import { clipText, siteMetadata, SITE_NAME, SITE_URL } from "@/lib/seo";

const CANONICAL = "/sprout-tweens/skills/sprout_03_programming/learn";

export const metadata: Metadata = siteMetadata(
  {
    title: "Programming Learning Portal · Sprout Tweens",
    description: clipText(
      "The Sprout Tweens 4-year evolving profile website curriculum — build your personal site from first HTML tag to a published multi-page hub with a live code sandbox, milestones, quizzes and XP.",
    ),
    openGraph: {
      type: "website",
      url: `${SITE_URL}${CANONICAL}`,
      siteName: SITE_NAME,
      title: "Programming Learning Portal · Sprout Tweens",
      description:
        "Four years, one growing website. HTML to JavaScript, with a live sandbox and XP.",
    },
  },
  CANONICAL,
);

/**
 * Sprout Tweens Programming Learning Portal — the embedded, self-contained
 * home of the 4-Year Evolving Profile curriculum (ages 9–12). Coding happens
 * here on the web app; the Expo companion mirrors XP, badges and streaks.
 */
export default async function ProgrammingPortalPage() {
  return (
    <>
      <header className={"relative overflow-hidden text-white bg-deep-navy"}>
        <Navbar overlay />
        <span
          aria-hidden={"true"}
          className={
            "absolute -right-24 -top-24 size-96 rounded-full bg-teal/25 blur-3xl"
          }
        />
        <span
          aria-hidden={"true"}
          className={
            "absolute -left-16 bottom-0 size-64 rounded-full bg-teal/10 blur-3xl"
          }
        />

        <div className={"relative mx-auto max-w-6xl px-4 pt-32 pb-12"}>
          <nav
            aria-label={"Breadcrumb"}
            className={"mb-8 flex flex-wrap items-center gap-2 text-xs"}
          >
            <Link
              href={"/sprout-tweens"}
              className={"text-white/60 transition-colors hover:text-white"}
            >
              Sprout Tweens
            </Link>
            <span className={"text-white/30"}>/</span>
            <Link
              href={"/sprout-tweens/skills"}
              className={"text-white/60 transition-colors hover:text-white"}
            >
              Skills
            </Link>
            <span className={"text-white/30"}>/</span>
            <Link
              href={"/sprout-tweens/skills/sprout_03_programming"}
              className={"text-white/60 transition-colors hover:text-white"}
            >
              Programming
            </Link>
            <span className={"text-white/30"}>/</span>
            <span className={"font-semibold text-white"}>Learning Portal</span>
          </nav>

          <p
            className={
              "mb-4 inline-block border border-teal/50 bg-teal/15 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-teal-glow"
            }
          >
            Ages 9–12 · 4-Year Cycle
          </p>

          <h1
            className={
              "font-black leading-[1.05] tracking-tight"
            }
            style={{
              fontSize: "clamp(2rem, 6.5vw, 3.4rem)",
              textShadow:
                "0 1px 2px rgba(0,0,0,0.9), 0 2px 14px rgba(0,0,0,0.8)",
            }}
          >
            The Programming Learning Portal
          </h1>

          <p
            className={
              "mt-3 max-w-2xl text-sm leading-relaxed text-white/85 md:text-base"
            }
          >
            One personal website that grows with you — from your first HTML tag
            at age 9 to a published multi-page hub at 12. Write real code in the
            live sandbox, tick off milestones, pass quizzes and earn XP. Your
            work is never restarted; it&apos;s only layered.
          </p>

          <div className={"mt-7 flex flex-wrap gap-3"}>
            <a
              href={"#portal-sandbox"}
              className={
                "portal-btn portal-btn-primary portal-glow !px-6 !py-3"
              }
            >
              Start coding
            </a>
            <Link
              href={"/sprout-tweens/skills/sprout_03_programming"}
              className={
                "portal-btn portal-btn-ghost !px-6 !py-3 !text-white/85"
              }
            >
              Skill overview →
            </Link>
          </div>
        </div>
      </header>

      <ProgrammingPortal />
    </>
  );
}
