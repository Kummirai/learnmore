"use client";

import Link from "next/link";
import JoinCta from "@/components/join/JoinCta";
import { useEffect, useRef, useState } from "react";
import { FaAndroid } from "react-icons/fa";
import { LuChevronLeft, LuChevronRight, LuPause, LuPlay } from "react-icons/lu";
import Navbar from "@/components/Navbar";
import {
  MAGAZINES,
  type RelateClub,
  type RelateMagazine,
} from "@/constants/relate";
import { useClubs } from "@/lib/useClubs";
import { useNextPrayer } from "@/lib/useNextPrayer";
import { LATEST_APK_URL } from "@/lib/app-version";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

/* ── Slide model ────────────────────────────────────────────────────────────── */

type Slide = {
  key: string;
  chips: { dot?: boolean; label: string }[];
  title: React.ReactNode;
  /** Compact title shown on small screens (kept to two words max). */
  shortTitle?: React.ReactNode;
  tagline: string;
  description: string;
  watermark: string;
  /** Optional small label rendered above the title (e.g. "Dawn Prayer"). */
  eyebrow?: string;
  /** Optional pill pinned to the far right of the chips row (e.g. club age range). */
  ageRange?: string;
  bg: React.CSSProperties;
  actions: React.ReactNode;
};

const btnPrimary =
  "inline-flex items-center gap-2 bg-white text-navy px-6 py-3 rounded-full font-semibold text-sm hover:bg-white/90 transition-colors";
const btnGhost =
  "inline-flex items-center gap-2 border border-white/30 bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-white/20 hover:border-white/60 transition-colors";

const firstWord = (s: string) =>
  s
    .split(/[\s–—,·]+/)
    .filter(Boolean)
    .slice(0, 1)
    .join(" ");

function prayerSlide(
  prayer: { label: string; countdown: string } | null,
): Slide {
  return {
    key: "prayer",
    chips: [],
    eyebrow: prayer ? `${prayer.label} Prayer` : undefined,
    title: prayer ? prayer.countdown : "Pray with us",
    shortTitle: prayer ? undefined : "Pray",
    tagline: "six moments, every day",
    description:
      "A live countdown to the next prayer moment. Dawn, sunrise, noon, afternoon, sunset and evening — a simple daily rhythm, with a verse for each.",
    watermark: "6",
    bg: {
      backgroundImage: `url(https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1600&q=80)`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
    actions: (
      <>
        <Link href={"/prayer"} className={btnPrimary}>
          Start praying
        </Link>
        <Link href={"/about"} className={btnGhost}>
          About the rhythm
        </Link>
      </>
    ),
  };
}

function brandSlide(): Slide {
  return {
    key: "brand",
    chips: [],
    eyebrow: "Relate World",
    title: "Grow",
    tagline: "in every area of life",
    description:
      "Share your gifts. Connect with your community. Deepen your faith. Relate brings it all together.",
    watermark: "Relate",
    bg: {
      backgroundImage: `url(https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1600&q=80)`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
    actions: (
      <>
        <JoinCta href={"/join"} className={btnPrimary}>
          Join a club
        </JoinCta>
        <Link href={"/store"} className={btnGhost}>
          Explore the store
        </Link>
      </>
    ),
  };
}

function magazineSlide(mag: RelateMagazine): Slide {
  return {
    key: mag.slug,
    chips: [],
    title: mag.series,
    shortTitle: firstWord(mag.series),
    tagline: mag.theme,
    description: mag.summary,
    watermark: "13",
    bg: {
      backgroundImage: `url(${mag.cover})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
    actions: (
      <>
        <Link href={`/${mag.slug}`} className={btnPrimary}>
          Read {mag.series}
        </Link>
        <Link href={"/about"} className={btnGhost}>
          About the guides
        </Link>
      </>
    ),
  };
}

function clubSlide(club: RelateClub): Slide {
  const numericAge = club.ageRange
    .match(/^[\d–+ ]+/)?.[0]
    ?.replace("yrs", "")
    .trim();
  return {
    key: club.slug,
    chips: [],
    title: club.name,
    shortTitle: firstWord(club.name),
    tagline: club.tagline,
    description: club.description,
    watermark: numericAge ?? club.name,
    bg: {
      backgroundImage: `url(${club.heroImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center 30%",
    },
    actions: (
      <>
        <a href={LATEST_APK_URL} download className={btnPrimary}>
          <FaAndroid /> Download App Apk
        </a>
        <Link href={`/${club.slug}`} className={btnGhost}>
          Explore {club.name}
        </Link>
      </>
    ),
  };
}

function charitySlide(): Slide {
  return {
    key: "charity",
    chips: [],
    title: "Care",
    tagline: "share it — we can help",
    description:
      "Our charity arm stands with orphans, widows and child-headed families — food relief, school fees, uniforms, childcare and counselling. Share your need and we will review, refer or help. Send your request through the app.",
    watermark: "Care",
    bg: {
      backgroundImage: `url(https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1600&q=80)`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
    actions: (
      <>
        <Link href={"/requests"} className={btnPrimary}>
          Give or get help
        </Link>
        <a href={LATEST_APK_URL} download className={btnGhost}>
          <FaAndroid /> Send it in the app
        </a>
      </>
    ),
  };
}

const AUTOPLAY_MS = 6000;

export default function Hero() {
  const prayer = useNextPrayer();
  const { clubs } = useClubs();
  const slides: Slide[] = [
    brandSlide(),
    prayerSlide(prayer),
    charitySlide(),
    ...MAGAZINES.map(magazineSlide),
    ...clubs.map(clubSlide),
  ];

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const autoplay = !paused && !reducedMotion;
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!autoplay) return;
    timer.current = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      AUTOPLAY_MS,
    );
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [autoplay, slides.length]);

  const slide = slides[index];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Relate World highlights"
      className={"relative min-h-screen w-full overflow-hidden"}
    >
      {/* ── Crossfading backgrounds ── */}
      {slides.map((s, i) => (
        <div
          key={s.key}
          className={"absolute inset-0 transition-opacity duration-1000"}
          style={{ ...s.bg, opacity: i === index ? 1 : 0 }}
        />
      ))}
      {/* ── Watermark ── */}
      <div
        className={
          "absolute bottom-4 right-4 hidden pb-0.5 select-none md:block"
        }
      >
        <span
          key={slide.key}
          className={
            "block font-black leading-none tracking-tighter text-white"
          }
          style={{
            fontSize: "clamp(9rem, 24vw, 16rem)",
            opacity: 0.14,
            textShadow: "0 0 28px rgba(21,31,58,0.7)",
          }}
        >
          {slide.watermark}
        </span>
      </div>

      <Navbar overlay />

      <p
        aria-live={autoplay ? "off" : "polite"}
        className="sr-only"
      >
        Slide {index + 1} of {slides.length}: {slide.tagline}
      </p>

      {/* ── Content ── */}
      <div
        role="group"
        aria-roledescription="slide"
        aria-label={`${index + 1} of ${slides.length}`}
        className={
          "relative z-10 max-w-6xl mx-auto w-full px-4 sm:px-6 min-h-screen flex flex-col justify-center py-16 mt-15"
        }
      >
        <div className={"flex flex-col gap-3 text-center md:text-left"}>
          {/* Chips row + age-range pill on the far right of the same row */}
          <div
            className={
              "flex flex-wrap items-center justify-center gap-3 md:justify-start"
            }
          >
            {slide.ageRange && (
              <span
                className={
                  "md:ml-auto inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-1.5 rounded-full text-[11px] tracking-wide text-white/90 font-medium"
                }
              >
                {slide.ageRange}
              </span>
            )}
          </div>

          {slide.eyebrow && (
            <p
              key={`eb-${slide.key}`}
              className="-mb-[18px] md:-mb-[22px] text-[11px] uppercase tracking-[0.2em] text-white/70 font-medium"
            >
              {slide.eyebrow}
            </p>
          )}
          <h1
            key={`t-${slide.key}`}
            className={
              "font-black tracking-tight leading-none text-white break-words"
            }
            style={{
              fontSize: "clamp(2.5rem, 14vw, 4.8rem)",
              textShadow:
                "0 1px 2px rgba(21,31,58,0.95), 0 2px 14px rgba(21,31,58,0.85), 0 4px 36px rgba(21,31,58,0.6)",
            }}
          >
            <span className={"hidden sm:inline"}>{slide.title}</span>
            <span className={"sm:hidden"}>
              {slide.shortTitle ?? slide.title}
            </span>
          </h1>
          <p
            key={`tg-${slide.key}`}
            className={"text-lg md:text-2xl font-medium"}
            style={{
              color: "#ffffff",
              filter: "brightness(1.15)",
              textShadow:
                "0 1px 2px rgba(21,31,58,0.95), 0 2px 14px rgba(21,31,58,0.85), 0 4px 36px rgba(21,31,58,0.6)",
            }}
          >
            {slide.tagline}
          </p>
          <p
            key={`d-${slide.key}`}
            className={
              "max-w-[90%] mx-auto sm:max-w-[50vw] sm:mx-0 text-sm md:text-base text-white leading-relaxed"
            }
            style={{
              textShadow:
                "0 1px 2px rgba(21,31,58,0.95), 0 2px 14px rgba(21,31,58,0.85), 0 4px 36px rgba(21,31,58,0.6)",
            }}
          >
            {slide.description}
          </p>

          <div
            className={
              "flex flex-col items-center gap-5 mt-3 md:flex-row md:items-center md:justify-start"
            }
          >
            {slide.actions}
          </div>

          {/* Meta bar */}
          <div
            className={
              "mt-9 pt-6 border-t border-white/15 flex flex-wrap items-center justify-center gap-x-6 gap-y-4 text-sm md:justify-start md:gap-x-10"
            }
            style={{ textShadow: "0 1px 6px rgba(21,31,58,0.6)" }}
          >
            <div>
              <span
                className={
                  "block text-[11px] uppercase tracking-widest text-white/70 mb-0.5"
                }
              >
                Clubs
              </span>
              <span className={"font-semibold text-white"}>7</span>
            </div>
            <div>
              <span
                className={
                  "block text-[11px] uppercase tracking-widest text-white/70 mb-0.5"
                }
              >
                Programs
              </span>
              <span className={"font-semibold text-white"}>60+</span>
            </div>
            <div>
              <span
                className={
                  "block text-[11px] uppercase tracking-widest text-white/70 mb-0.5"
                }
              >
                Free
              </span>
              <span className={"font-semibold text-white"}>100%</span>
            </div>
            <div
              className={
                "hidden md:ml-auto md:flex md:flex-wrap md:items-center md:gap-x-8 md:gap-y-2"
              }
            >
              <Link
                href={"/about"}
                className={
                  "inline-flex items-center gap-2 font-medium text-white hover:text-cyan-light transition-colors"
                }
              >
                <span
                  className={
                    "text-[11px] uppercase tracking-widest text-white/70"
                  }
                >
                  Since 2026
                </span>
                About Relate →
              </Link>
            </div>
          </div>

          {/* ── Carousel controls ── */}
          <div
            className={
              "flex flex-wrap items-center justify-center gap-2 mt-4 md:justify-start"
            }
          >
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => setIndex((index - 1 + slides.length) % slides.length)}
              className="grid size-11 place-items-center rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors"
            >
              <LuChevronLeft aria-hidden />
            </button>
            {!reducedMotion && (
              <button
                type="button"
                aria-label={paused ? "Play slideshow" : "Pause slideshow"}
                onClick={() => setPaused((value) => !value)}
                className="grid size-11 place-items-center rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors"
              >
                {paused ? <LuPlay aria-hidden /> : <LuPause aria-hidden />}
              </button>
            )}
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => setIndex((index + 1) % slides.length)}
              className="grid size-11 place-items-center rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors"
            >
              <LuChevronRight aria-hidden />
            </button>
            <span
              className={
                "ml-2 hidden sm:inline text-[11px] uppercase tracking-widest text-white/50"
              }
            >
              {slide.key === "prayer" && "Prayer rhythm"}
              {slide.key === "charity" && "Charity & care"}
              {MAGAZINES.some((m) => m.slug === slide.key) && "Season guides"}
              {clubs.some((c) => c.slug === slide.key) && "Clubs"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
