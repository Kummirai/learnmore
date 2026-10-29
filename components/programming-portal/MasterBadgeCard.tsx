"use client";

import Link from "next/link";
import {
  LuCircleCheck,
  LuLoaderCircle,
  LuLock,
  LuTrophy,
} from "react-icons/lu";
import {
  MASTER_BADGE_NAME,
  type PortalProgress,
  masterBadgeGaps,
} from "@/lib/programming-portal";

/**
 * Year 4 graduation card — official submission for the Sprout Tweens Master
 * Web Builder Badge once every milestone is done and all four quizzes passed.
 */
export default function MasterBadgeCard({
  progress,
  busy,
  signedIn,
  onClaim,
}: {
  progress: PortalProgress | null;
  busy: boolean;
  signedIn: boolean;
  onClaim: () => Promise<void>;
}) {
  const awarded = !!progress?.masterBadgeAwarded;
  const gaps = masterBadgeGaps(progress);
  const ready = signedIn && gaps.length === 0 && !awarded;

  return (
    <section
      className={
        "portal-card relative overflow-hidden p-6 md:p-8" +
        (awarded ? " portal-glow border-teal" : "")
      }
      aria-label={"Master Web Builder Badge"}
    >
      {awarded ? (
        <span
          aria-hidden={"true"}
          className={
            "absolute -right-16 -top-16 size-56 rounded-full bg-teal/20 blur-3xl"
          }
        />
      ) : null}

      <div className={"relative flex flex-wrap items-start gap-5"}>
        <span
          className={
            "grid size-16 shrink-0 place-items-center border " +
            (awarded
              ? "border-teal bg-teal/20 text-teal-glow"
              : "border-portal-line bg-portal-ink text-white/30")
          }
          aria-hidden={"true"}
        >
          {awarded ? (
            <LuTrophy className={"size-8"} />
          ) : (
            <LuLock className={"size-7"} />
          )}
        </span>

        <div className={"min-w-0 flex-1"}>
          <span
            className={
              "text-[11px] font-bold uppercase tracking-widest text-teal"
            }
          >
            Year 4 graduation
          </span>
          <h2 className={"mt-1 text-xl font-black text-white"}>
            {MASTER_BADGE_NAME}
          </h2>
          <p className={"mt-2 max-w-2xl text-sm leading-relaxed text-white/60"}>
            You&apos;ve grown one website across four years — HTML to grids to
            JavaScript to a multi-page hub. Submit your master showcase to make
            it official.
          </p>

          {awarded ? (
            <p
              className={
                "mt-4 inline-flex items-center gap-2 border border-teal bg-teal/15 px-4 py-2 text-sm font-black text-teal-glow"
              }
            >
              <LuCircleCheck className={"size-4"} />
              Badge earned — congratulations, Master Web Builder!
            </p>
          ) : (
            <div className={"mt-4"}>
              {gaps.length ? (
                <ul className={"space-y-1.5"}>
                  {gaps.map((gap) => (
                    <li
                      key={gap}
                      className={
                        "flex items-center gap-2 text-sm text-white/70"
                      }
                    >
                      <span
                        className={
                          "size-1.5 shrink-0 bg-gold-400"
                        }
                        aria-hidden={"true"}
                      />
                      {gap}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={"text-sm font-semibold text-teal-glow"}>
                  Everything is ready — submit below!
                </p>
              )}

              {!signedIn ? (
                <Link
                  href={
                    "/signin?next=/sprout-tweens/skills/sprout_03_programming/learn"
                  }
                  className={"portal-btn portal-btn-primary mt-4"}
                >
                  Sign in to submit
                </Link>
              ) : (
                <button
                  type={"button"}
                  onClick={() => void onClaim()}
                  disabled={!ready || busy}
                  className={
                    "portal-btn mt-4 " +
                    (ready ? "portal-btn-primary portal-glow" : "portal-btn-ghost")
                  }
                >
                  {busy ? (
                    <LuLoaderCircle className={"size-4 animate-spin"} />
                  ) : (
                    <LuTrophy className={"size-4"} />
                  )}
                  Submit my Master Showcase
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
