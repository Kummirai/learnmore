"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import { LuArrowLeft, LuCloudMoon, LuMoonStar, LuSun, LuSunMedium, LuSunrise, LuSunset } from "react-icons/lu";
import {
    PRAYER_COORDS,
    buildPrayerTimes,
    countdownParts,
    fallbackPrayer,
    nextPrayerEntry,
    time12,
    time24,
    type PrayerEntry,
} from "@/lib/prayer-times";

const PRAYER_ICONS: Record<string, React.ReactNode> = {
    dawn: <LuCloudMoon className="text-2xl"/>,
    sunrise: <LuSunrise className="text-2xl"/>,
    noon: <LuSun className="text-2xl"/>,
    afternoon: <LuSunMedium className="text-2xl"/>,
    sunset: <LuSunset className="text-2xl"/>,
    evening: <LuMoonStar className="text-2xl"/>,
};

const PRAYER_NOTES: Record<string, string> = {
    dawn: "First light",
    sunrise: "Day begins",
    noon: "Glad midday",
    afternoon: "Mid-afternoon",
    sunset: "Day falls",
    evening: "Night gathers",
};

function useTodayPrayers() {
    const [times, setTimes] = useState<PrayerEntry[] | null>(null);
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        let cancelled = false;
        (async () => {
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
            if (!cancelled) setTimes(buildPrayerTimes(base.sunrise, base.noon, base.sunset, new Date()));
        })();
        const tick = setInterval(() => setNow(new Date()), 1000);
        return () => {
            cancelled = true;
            clearInterval(tick);
        };
    }, []);

    const fb = fallbackPrayer(now);
    const entries = times ?? buildPrayerTimes(fb.sunrise, fb.noon, fb.sunset, now);
    const next = nextPrayerEntry(entries, now);
    return { entries, next, now };
}

export default function PrayerPage() {
    const { entries, next, now } = useTodayPrayers();
    const countdown = countdownParts(next.date.getTime() - now.getTime());
    const isNextTomorrow = next.date.toDateString() !== now.toDateString();
    const dateLine = now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

    return (
        <main className="min-h-screen bg-ghost-white">
            {/* Hero header */}
            <section className="relative overflow-hidden bg-navy-dark">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage:
                            "linear-gradient(100deg, rgba(21,31,58,0.97) 0%, rgba(29,42,77,0.9) 45%, rgba(15,163,196,0.5) 78%, rgba(19,197,221,0.25) 100%), url(https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1600&q=80)",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                />
                <div className="relative container mx-auto max-w-6xl px-6 py-14 md:py-20">
                    <Link
                        href={"/"}
                        className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium transition-colors"
                    >
                        <LuArrowLeft/> Back to home
                    </Link>
                    <p className={'mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-light'}>
                        Daily rhythm
                    </p>
                    <h1 className="mt-3 text-4xl md:text-5xl font-bold text-white">Today&apos;s Prayer Times</h1>
                    <p className="mt-2 text-white/70 font-medium">{dateLine}</p>

                    {/* Countdown banner */}
                    <div className="mt-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-light">
                                Next · {isNextTomorrow ? "Tomorrow " : ""}{next.label} Prayer
                            </p>
                            <p className="mt-1 text-4xl md:text-5xl font-bold tabular-nums text-white">
                                {countdown.h > 0 ? `${countdown.h}h ` : ""}{String(countdown.m).padStart(2, "0")}m{" "}
                                {String(countdown.s).padStart(2, "0")}s
                            </p>
                            <p className="mt-1 text-sm text-white/60 font-medium">
                                counts down from sunrise &amp; sunset · Johannesburg
                            </p>
                        </div>
                        <div className="shrink-0 text-4xl md:text-5xl font-light text-white/80">
                            {time24(next.date).replace(":", ":")}
                        </div>
                    </div>
                </div>
            </section>

            {/* Six moments */}
            <section className="container mx-auto max-w-6xl px-6 py-12 md:py-16">
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {entries.map((entry) => {
                        const isNext = entry.key === next.key && entry.date.getTime() === next.date.getTime();
                        const isPast = entry.date.getTime() < now.getTime() && !isNext;
                        return (
                            <div
                                key={entry.key}
                                className={`rounded-2xl border bg-white p-6 transition-shadow ${
                                    isNext
                                        ? "border-cyan-dark shadow-lg ring-2 ring-cyan-dark/40"
                                        : "border-slate-100"
                                } ${isPast ? "opacity-55" : ""}`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-cyan-dark">{PRAYER_ICONS[entry.key]}</span>
                                    {isNext ? (
                                        <span className="text-xs font-semibold bg-ice-blue text-cyan-dark px-3 py-1 rounded-full">
                                            Next
                                        </span>
                                    ) : isPast ? (
                                        <span className="text-xs font-medium text-slate-400 px-3 py-1 rounded-full bg-slate-50">
                                            Done
                                        </span>
                                    ) : (
                                        <span className="text-xs font-medium text-slate-400 px-3 py-1 rounded-full bg-slate-50">
                                            Upcoming
                                        </span>
                                    )}
                                </div>
                                <h3 className="mt-4 text-lg font-semibold text-navy-dark">{entry.label}</h3>
                                <p className={`text-3xl font-bold tabular-nums ${isNext ? "text-navy" : "text-navy"}`}>
                                    {time24(entry.date)}
                                </p>
                                <p className="mt-1 text-sm text-slate-500">
                                    {time12(entry.date)} · {PRAYER_NOTES[entry.key]}
                                </p>
                            </div>
                        );
                    })}
                </div>

                <p className="mt-8 text-sm text-slate-500">
                    Times are derived from today&apos;s astronomic sunrise and sunset (
                    {PRAYER_COORDS.lat}°S, {PRAYER_COORDS.lng}°E — Johannesburg). Dawn &amp; Evening sit 90 minutes before
                    sunrise and after sunset; Afternoon is the midpoint between noon and sunset. If the live sunrise
                    lookup is unavailable, the app falls back to 06:15 / 12:00 / 18:30.
                </p>
            </section>
        </main>
    );
}