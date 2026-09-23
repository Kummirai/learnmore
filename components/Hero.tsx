"use client"

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaAndroid } from "react-icons/fa";
import Navbar from "@/components/Navbar";
import { CLUBS, MAGAZINES, type RelateClub, type RelateMagazine } from "@/constants/relate";

/* ── Next prayer time (mirrors the mobile app: sunrise-sunset.org + 6 derived moments) ── */
const PRAYER_COORDS = { lat: -25.7, lng: 28.2 }; // Johannesburg — the app's default when there's no location.

type PrayerEntry = { label: string; date: Date };

function dayMins(d: Date): number {
    return d.getHours() * 60 + d.getMinutes();
}

function dateAtMins(m: number, ref: Date): Date {
    const d = new Date(ref);
    d.setHours(Math.floor(m / 60), m % 60, 0, 0);
    return d;
}

function buildPrayerTimes(sunrise: Date, noon: Date, sunset: Date, ref: Date): PrayerEntry[] {
    const r = dayMins(sunrise);
    const n = dayMins(noon);
    const u = dayMins(sunset);
    return [
        { label: "Dawn", date: dateAtMins(r - 90, ref) },
        { label: "Sunrise", date: new Date(sunrise) },
        { label: "Noon", date: new Date(noon) },
        { label: "Afternoon", date: dateAtMins(Math.floor((n + u) / 2), ref) },
        { label: "Sunset", date: new Date(sunset) },
        { label: "Evening", date: dateAtMins(u + 90, ref) },
    ];
}

function nextPrayerEntry(times: PrayerEntry[], now: Date): PrayerEntry {
    const upcoming = times.filter((t) => t.date > now).sort((a, b) => a.date.getTime() - b.date.getTime());
    if (upcoming.length) return upcoming[0];
    const dawn = times.find((t) => t.label === "Dawn") ?? times[0];
    const date = new Date(dawn.date);
    date.setDate(date.getDate() + 1);
    return { label: dawn.label, date };
}

function fallbackPrayer(now: Date) {
    const at = (h: number, m: number) => {
        const d = new Date(now);
        d.setHours(h, m, 0, 0);
        return d;
    };
    return { sunrise: at(6, 15), noon: at(12, 0), sunset: at(18, 30) };
}

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
                countdown: h > 0 ? `${h}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s` : `${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`,
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
    title: string;
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
const btnGhost = "inline-flex items-center gap-2 border border-white/25 text-white px-6 py-3 rounded-lg font-semibold text-sm hover:border-white/60 transition-colors";

/** #RRGGBB + alpha → rgba() so gradients can sit over photos and keep text legible on the dark side. */
function hexA(hex: string, a: number): string {
    const n = hex.replace("#", "");
    if (n.length !== 6) return hex;
    const r = parseInt(n.slice(0, 2), 16), g = parseInt(n.slice(2, 4), 16), b = parseInt(n.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${a})`;
}

function prayerSlide(prayer: { label: string; countdown: string } | null): Slide {
    return {
        key: "prayer",
        chips: [],
        eyebrow: prayer ? `${prayer.label} Prayer` : undefined,
        title: prayer ? prayer.countdown : "Pray with us",
        tagline: "six moments, every day",
        description: "A live countdown to the next prayer moment. Dawn, sunrise, noon, afternoon, sunset and evening — a simple daily rhythm, with a verse for each.",
        watermark: "6",
        bg: {
            backgroundImage: `linear-gradient(100deg, rgba(21,31,58,0.97) 0%, rgba(29,42,77,0.92) 45%, rgba(15,163,196,0.55) 75%, rgba(19,197,221,0.25) 100%), url(https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1600&q=80)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
        },
        actions: (
            <>
                <Link href={"/enroll"} className={btnPrimary}>Start praying</Link>
                <Link href={"/about"} className={btnGhost}>About the rhythm</Link>
            </>
        ),
    };
}

function brandSlide(): Slide {
    return {
        key: "brand",
        chips: [],
        title: "Grow",
        tagline: "in every area of life",
        description: "Share your gifts. Connect with your community. Deepen your faith. Relate brings it all together.",
        watermark: "Relate",
        bg: {
            backgroundImage: `linear-gradient(100deg, rgba(21,31,58,0.97) 0%, rgba(29,42,77,0.92) 45%, rgba(15,163,196,0.55) 75%, rgba(19,197,221,0.25) 100%), url(https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1600&q=80)`,
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
        tagline: mag.theme,
        description: mag.summary,
        watermark: "13",
        bg: {
            backgroundImage: `linear-gradient(100deg, rgba(21,31,58,0.97) 0%, rgba(21,31,58,0.9) 45%, rgba(21,31,58,0.55) 75%, rgba(21,31,58,0.35) 100%), url(${mag.cover})`,
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
        tagline: club.tagline,
        description: club.description,
        watermark: numericAge ?? club.name,
        bg: {
            backgroundImage: `linear-gradient(100deg, rgba(21,31,58,0.96) 0%, ${hexA(club.colorDark, 0.9)} 45%, ${hexA(club.color, 0.55)} 78%, ${hexA(club.color, 0.3)} 100%), url(${club.heroImage})`,
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

/* ── Seasonal Bible Quiz slide (Southern Hemisphere seasons) ── */
type SeasonName = "Summer" | "Autumn" | "Winter" | "Spring";

function currentSeason(): SeasonName {
    const m = new Date().getMonth() + 1; // 1–12
    if (m === 12 || m <= 2) return "Summer";
    if (m <= 5) return "Autumn";
    if (m <= 8) return "Winter";
    return "Spring";
}

const SEASON_QUIZ_COPY: Record<SeasonName, { blurb: string; image: string }> = {
    Summer: {
        blurb: "Soak up Genesis in the sun — every class reads five chapters a week and the quiz unlocks as soon as the reading's done. Best score owns the summer board.",
        image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=1600&q=80",
    },
    Autumn: {
        blurb: "Fresh chapters, fresh chances — read Genesis as the leaves turn, unlock each weekly quiz, and let a new high score keep climbing the class board.",
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=80",
    },
    Winter: {
        blurb: "Warm minds this winter — read Genesis by the fire, unlock the quiz after every five chapters, and beat the cold with the best score on the board.",
        image: "https://images.unsplash.com/photo-1516192518150-0d8fee5425e3?w=1600&q=80",
    },
    Spring: {
        blurb: "New season, new growth — Genesis is in full bloom, the quizzes unlock as you read, and the season's best scorers claim the board before summer.",
        image: "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?w=1600&q=80",
    },
};

function bibleQuizSlide(): Slide {
    const season = currentSeason();
    const copy = SEASON_QUIZ_COPY[season];
    return {
        key: "bible-quiz",
        chips: [],
        eyebrow: `${season} season`,
        title: `${season} Bible Quiz`,
        tagline: "one book · five chapters · the quiz unlocks when the read is done",
        description: copy.blurb,
        watermark: season,
        bg: {
            backgroundImage: `linear-gradient(100deg, rgba(21,31,58,0.97) 0%, rgba(29,42,77,0.9) 45%, rgba(255,196,46,0.5) 78%, rgba(255,196,46,0.2) 100%), url(${copy.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
        },
        actions: (
            <>
                <Link href={"/sprout-kids"} className={btnPrimary}>Play the {season} quiz</Link>
                <Link href={"/plans/pentateuch-in-60-days"} className={btnGhost}>Start reading Genesis</Link>
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

    const go = (dir: 1 | -1) => setIndex((i) => (i + dir + slides.length) % slides.length);
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
            {/* Ambient glows (constant, like the other heroes) */}
            <div className={"absolute -top-32 -right-24 size-96 rounded-full blur-3xl opacity-30"} style={{ backgroundColor: "var(--club-accent)" }} />
            <div className={"absolute bottom-10 -left-24 size-96 rounded-full blur-3xl opacity-20"} style={{ backgroundColor: "var(--club-accent)" }} />

            {/* ── Watermark ── */}
            <div className={"absolute bottom-0 right-4 hidden pb-0.5 select-none md:block"}>
                <span
                    key={slide.key}
                    className={"block font-black leading-none tracking-tighter text-white"}
                    style={{ fontSize: "clamp(9rem, 24vw, 16rem)", opacity: 0.14 }}
                >
                    {slide.watermark}
                </span>
            </div>

            <Navbar overlay />

            {/* ── Content ── */}
            <div className={"relative z-10 max-w-6xl mx-auto w-full px-4 sm:px-6 min-h-screen flex flex-col justify-center py-24"}>
                <div className={"flex flex-col gap-5 md:gap-6"}>
                    {/* Chips row + age-range pill on the far right of the same row */}
                    <div className={"flex flex-wrap items-center gap-3"}>
                        {slide.ageRange && (
                            <span className={"ml-auto inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-1.5 rounded-full text-[11px] tracking-wide text-white/90 font-medium"}>
                                {slide.ageRange}
                            </span>
                        )}
                    </div>

                    {slide.eyebrow && (
                        <p key={`eb-${slide.key}`} className="-mb-[18px] md:-mb-[22px] text-[11px] uppercase tracking-[0.2em] text-white/70 font-medium">
                            {slide.eyebrow}
                        </p>
                    )}
                    <h1 key={`t-${slide.key}`} className={"font-black tracking-tight leading-none text-white"} style={{ fontSize: "clamp(3.75rem, 12vw, 7.5rem)" }}>
                        {slide.title}
                    </h1>
                    <p key={`tg-${slide.key}`} className={"text-xl md:text-2xl font-medium"} style={{ color: "var(--club-accent)", filter: "brightness(1.15)" }}>
                        {slide.tagline}
                    </p>
                    <p key={`d-${slide.key}`} className={"max-w-xl text-sm md:text-base text-white/80 leading-relaxed"}>
                        {slide.description}
                    </p>

                    <div className={"flex flex-wrap items-center gap-3 mt-2"}>{slide.actions}</div>

                    {/* Meta bar */}
                    <div className={"mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center gap-x-10 gap-y-4 text-sm"}>
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
                        <div className={"ml-auto flex flex-wrap items-center gap-x-8 gap-y-2"}>
                            <Link href={"/about"} className={"inline-flex items-center gap-2 font-medium text-white hover:text-cyan-light transition-colors"}>
                                <span className={"text-[11px] uppercase tracking-widest text-white/70"}>Since 2026</span>
                                About Relate →
                            </Link>
                        </div>
                    </div>

                    {/* ── Carousel progress dots ── */}
                    <div className={"flex items-center gap-1.5 mt-4"}>
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
                            {MAGAZINES.some((m) => m.slug === slide.key) && "Reading guides"}
                            {CLUBS.some((c) => c.slug === slide.key) && "Clubs"}
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
