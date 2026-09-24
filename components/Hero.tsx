"use client"

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaAndroid } from "react-icons/fa";
import Navbar from "@/components/Navbar";
import { CLUBS, MAGAZINES, type RelateClub, type RelateMagazine } from "@/constants/relate";

/* ── Next prayer time (shared math in lib/prayer-times, mirrors the mobile app) ── */
import { PRAYER_COORDS, buildPrayerTimes, fallbackPrayer, nextPrayerEntry, type PrayerEntry } from "@/lib/prayer-times";

function useNextPrayer() {
    const [next, setNext] = useState<{ label: string; countdown: string } | null>(null);
    const timesRef = useRef<PrayerEntry[] | null>(null);

    useEffect(() => {
        let cancelled = false;

        const refreshTimes = async () => {
            let base = fallbackPrayer(new Date());
            try {
                const res = await fetch(
                    `https://api.sunrise-sunset.org/json?lat=${PRAYER_COORDS.lat}&lng=${PRAYER_COORDS.lng}&formatted=0`,
                );
                const data = await res.json();
                if (data?.results) {
                    base = {
                        sunrise: new Date(data.results.sunrise),
                        noon: new Date(data.results.solar_noon),
                        sunset: new Date(data.results.sunset),
                    };
                }
            } catch {
                // offline — keep the sane fallback
            }
            if (!cancelled) timesRef.current = buildPrayerTimes(base.sunrise, base.noon, base.sunset, new Date());
        };

        const tick = () => {
            const now = new Date();
            const fb = fallbackPrayer(now);
            const times = timesRef.current ?? buildPrayerTimes(fb.sunrise, fb.noon, fb.sunset, now);
            const n = nextPrayerEntry(times, now);
            const diff = Math.max(0, n.date.getTime() - now.getTime());
            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            setNext({
                label: n.label,
                countdown: h > 0 ? `${h}h ${String(m).padStart(2, "0")}m ${supSeconds(s)}` : `${String(m).padStart(2, "0")}m ${supSeconds(s)}`,
            });
        };

        refreshTimes();
        tick();
        const timer = setInterval(tick, 1000);
        return () => {
            cancelled = true;
            clearInterval(timer);
        };
    }, []);

    return next;
}

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

const btnPrimary = "inline-flex items-center gap-2 bg-white text-navy px-6 py-3 rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors";
const btnGhost = "inline-flex items-center gap-2 border border-white/30 bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-white/20 hover:border-white/60 transition-colors";

const firstWord = (s: string) => s.split(/[\s–—,·]+/).filter(Boolean).slice(0, 1).join(" ");

const SUP_DIGITS = "⁰¹²³⁴⁵⁶⁷⁸⁹";
const supSeconds = (n: number) => String(n).padStart(2, "0").replace(/\d/g, (d) => SUP_DIGITS[Number(d)]);

function prayerSlide(prayer: { label: string; countdown: string } | null): Slide {
    return {
        key: "prayer",
        chips: [],
        eyebrow: prayer ? `${prayer.label} Prayer` : undefined,
        title: prayer ? prayer.countdown : "Pray with us",
        shortTitle: prayer ? undefined : "Pray",
        tagline: "six moments, every day",
        description: "A live countdown to the next prayer moment. Dawn, sunrise, noon, afternoon, sunset and evening — a simple daily rhythm, with a verse for each.",
        watermark: "6",
        bg: {
            backgroundImage: `url(https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1600&q=80)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
        },
        actions: (
            <>
                <Link href={"/prayer"} className={btnPrimary}>Start praying</Link>
                <Link href={"/about"} className={btnGhost}>About the rhythm</Link>
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
        description: "Share your gifts. Connect with your community. Deepen your faith. Relate brings it all together.",
        watermark: "Relate",
        bg: {
            backgroundImage: `url(https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1600&q=80)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
        },
        actions: (
            <>
                <Link href={"/enroll"} className={btnPrimary}>Join a club</Link>
                <Link href={"/store"} className={btnGhost}>Explore the store</Link>
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
                <Link href={`/${mag.slug}`} className={btnPrimary}>Read {mag.series}</Link>
                <Link href={"/about"} className={btnGhost}>About the guides</Link>
            </>
        ),
    };
}

function clubSlide(club: RelateClub): Slide {
    const numericAge = club.ageRange.match(/^[\d–+ ]+/)?.[0]?.replace("yrs", "").trim();
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
            backgroundPosition: "center",
        },
        actions: (
            <>
                <a href={"/relate-app.apk"} download className={btnPrimary}>
                    <FaAndroid /> Download App Apk
                </a>
                <Link href={`/${club.slug}`} className={btnGhost}>Explore {club.name}</Link>
            </>
        ),
    };
}

/* ── Seasonal Bible Quiz slide (shared season logic in lib/season) ── */
import { SEASON_QUIZ } from "@/lib/season";

function bibleQuizSlide(): Slide {
    const { season, year, bookLabel, windowLabel, blurb, image } = SEASON_QUIZ;
    return {
        key: "bible-quiz",
        chips: [],
        eyebrow: `${season} ${year} season`,
        title: `${season} Bible Quiz`,
        shortTitle: "Quiz",
        tagline: `${bookLabel} · quiz rounds run weekly across the clubs · ${windowLabel}`,
        description: blurb,
        watermark: season,
        bg: {
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
        },
        actions: (
            <>
                <Link href={"/bible-quiz/play"} className={btnPrimary}>Play the {season} quiz</Link>
                <Link href={"/bible-quiz#overview"} className={btnGhost}>See the season&apos;s top 5</Link>
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
        description: "Our charity arm stands with orphans, widows and child-headed families — food relief, school fees, uniforms, childcare and counselling. Share your need and we will review, refer or help. Send your request through the app.",
        watermark: "Care",
        bg: {
            backgroundImage: `url(https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1600&q=80)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
        },
        actions: (
            <>
                <Link href={"/requests"} className={btnPrimary}>Give or get help</Link>
                <a href={"/relate-app.apk"} download className={btnGhost}>
                    <FaAndroid /> Send it in the app
                </a>
            </>
        ),
    };
}

const AUTOPLAY_MS = 6000;

export default function Hero() {
    const prayer = useNextPrayer();
    const slides: Slide[] = [
        brandSlide(),
        prayerSlide(prayer),
        bibleQuizSlide(),
        charitySlide(),
        ...MAGAZINES.map(magazineSlide),
        ...CLUBS.map(clubSlide),
    ];

    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const timer = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (paused) return;
        timer.current = setInterval(() => setIndex((i) => (i + 1) % slides.length), AUTOPLAY_MS);
        return () => { if (timer.current) clearInterval(timer.current); };
    }, [paused, slides.length]);

    const slide = slides[index];

    return (
        <section
            className={"relative min-h-screen w-full overflow-hidden"}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {/* ── Crossfading backgrounds ── */}
            {slides.map((s, i) => (
                <div
                    key={s.key}
                    className={"absolute inset-0 transition-opacity duration-1000"}
                    style={{ ...s.bg, opacity: i === index ? 1 : 0 }}
                />
            ))}
            <div aria-hidden={"true"}
                 className={"absolute -top-24 -left-20 size-72 md:size-96 rounded-full bg-navy/50 opacity-70 blur-3xl"}/>
            <div aria-hidden={"true"}
                 className={"absolute left-1/2 top-1/2 -translate-x-[55%] -translate-y-1/2 size-96 md:size-[32rem] rounded-full bg-navy/40 blur-3xl"}/>
            {/* ── Watermark ── */}
            <div className={"absolute bottom-0 right-4 hidden pb-0.5 select-none md:block"}>
                <span
                    key={slide.key}
                    className={"block font-black leading-none tracking-tighter text-white"}
                    style={{ fontSize: "clamp(9rem, 24vw, 16rem)", opacity: 0.14, textShadow: "0 0 28px rgba(21,31,58,0.7)" }}
                >
                    {slide.watermark}
                </span>
            </div>

            <Navbar overlay />

            {/* ── Content ── */}
            <div className={"relative z-10 max-w-6xl mx-auto w-full px-4 sm:px-6 min-h-screen flex flex-col justify-center py-24"}>
                <div className={"flex flex-col gap-5 text-center md:text-left"}>
                    {/* Chips row + age-range pill on the far right of the same row */}
                    <div className={"flex flex-wrap items-center justify-center gap-3 md:justify-start"}>
                        {slide.ageRange && (
                            <span className={"md:ml-auto inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-1.5 rounded-full text-[11px] tracking-wide text-white/90 font-medium"}>
                                {slide.ageRange}
                            </span>
                        )}
                    </div>

                    {slide.eyebrow && (
                        <p key={`eb-${slide.key}`} className="-mb-[18px] md:-mb-[22px] text-[11px] uppercase tracking-[0.2em] text-white/70 font-medium">
                            {slide.eyebrow}
                        </p>
                    )}
                    <h1 key={`t-${slide.key}`} className={"font-black tracking-tight leading-none text-white"} style={{ fontSize: "4.8rem", textShadow: "0 2px 16px rgba(21,31,58,0.55), 0 1px 3px rgba(21,31,58,0.45)" }}>
                            <span className={"hidden sm:inline"}>{slide.title}</span>
                            <span className={"sm:hidden"}>{slide.shortTitle ?? slide.title}</span>
                        </h1>
                    <p key={`tg-${slide.key}`} className={"text-lg md:text-2xl font-medium"} style={{ color: "var(--club-accent)", filter: "brightness(1.15)", textShadow: "0 1px 4px rgba(21,31,58,0.7), 0 2px 14px rgba(21,31,58,0.55)" }}>
                        {slide.tagline}
                    </p>
                    <p key={`d-${slide.key}`} className={"max-w-[90%] mx-auto sm:max-w-[50vw] sm:mx-0 text-sm md:text-base text-white leading-relaxed"} style={{ textShadow: "0 1px 3px rgba(21,31,58,0.8), 0 2px 14px rgba(21,31,58,0.6)" }}>
                        {slide.description}
                    </p>

                    <div className={"flex flex-col items-center gap-5 mt-3 md:flex-row md:items-center md:justify-start"}>{slide.actions}</div>

                    {/* Meta bar */}
                    <div className={"mt-9 pt-6 border-t border-white/15 flex flex-wrap items-center justify-center gap-x-6 gap-y-4 text-sm md:justify-start md:gap-x-10"} style={{ textShadow: "0 1px 6px rgba(21,31,58,0.6)" }}>
                        <div>
                            <span className={"block text-[11px] uppercase tracking-widest text-white/70 mb-0.5"}>Clubs</span>
                            <span className={"font-semibold text-white"}>7</span>
                        </div>
                        <div>
                            <span className={"block text-[11px] uppercase tracking-widest text-white/70 mb-0.5"}>Programs</span>
                            <span className={"font-semibold text-white"}>60+</span>
                        </div>
                        <div>
                            <span className={"block text-[11px] uppercase tracking-widest text-white/70 mb-0.5"}>Free</span>
                            <span className={"font-semibold text-white"}>100%</span>
                        </div>
                        <div className={"hidden md:ml-auto md:flex md:flex-wrap md:items-center md:gap-x-8 md:gap-y-2"}>
                            <Link href={"/about"} className={"inline-flex items-center gap-2 font-medium text-white hover:text-cyan-light transition-colors"}>
                                <span className={"text-[11px] uppercase tracking-widest text-white/70"}>Since 2026</span>
                                About Relate →
                            </Link>
                        </div>
                    </div>

                    {/* ── Carousel progress dots ── */}
                    <div className={"flex items-center justify-center gap-1.5 mt-4 md:justify-start"}>
                        {slides.map((s, i) => (
                            <button
                                key={s.key}
                                aria-label={`Go to slide ${i + 1}`}
                                onClick={() => setIndex(i)}
                                className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-cyan" : "w-1.5 bg-white/40 hover:bg-white/70"}`}
                            />
                        ))}
                        <span className={"ml-2 text-[11px] uppercase tracking-widest text-white/50"}>
                            {slide.key === "prayer" && "Prayer rhythm"}
                            {slide.key === "bible-quiz" && "Season quiz"}
                            {slide.key === "charity" && "Charity & care"}
                            {MAGAZINES.some((m) => m.slug === slide.key) && "Reading guides"}
                            {CLUBS.some((c) => c.slug === slide.key) && "Clubs"}
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
