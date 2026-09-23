"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LuArrowLeft, LuFlame } from "react-icons/lu";
import RequireAuth from "@/components/RequireAuth";
import { useAuth } from "@/components/AuthProvider";

function PageShell({children}: {children: React.ReactNode}) {
    return (
        <section className="flex-1 px-4 py-10 md:py-14" style={{ background: "linear-gradient(115deg, #f5f8fb 0%, #eff5f9 60%, #f5f8fb 100%)" }}>
            <div className="max-w-2xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-1 text-sm text-slate-gray hover:text-navy mb-6 transition-colors">
                    <LuArrowLeft /> Back to Home
                </Link>
                {children}
            </div>
        </section>
    );
}

export default function ProfilePage() {
    return (
        <RequireAuth title="Profile">
            <PageShell>
                <ProfileBody />
            </PageShell>
        </RequireAuth>
    );
}

function localKey(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

/** Daily prayers needed for a day to count toward the prayer streak (matches backend). */
const PRAYER_THRESHOLD = 3;

/** Consecutive days of logging ending today (or yesterday, if today isn't logged yet). */
function currentStreak(days: string[]): number {
    const logged = new Set(days);
    const cursor = new Date();
    if (!logged.has(localKey(cursor))) {
        cursor.setDate(cursor.getDate() - 1);
        if (!logged.has(localKey(cursor))) return 0;
    }
    let streak = 0;
    while (logged.has(localKey(cursor))) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
}

/** Days that hit the daily prayer completion threshold — matches mobile + backend. */
function qualifyingPrayerDays(data: unknown): string[] {
    if (!data || typeof data !== "object") return [];
    return Object.entries(data as Record<string, unknown>)
        .filter(([, value]) => {
            if (!value || typeof value !== "object") return false;
            const completed = Object.values(value as Record<string, unknown>).filter(Boolean).length;
            return completed >= PRAYER_THRESHOLD;
        })
        .map(([date]) => date);
}

function ProfileBody() {
    const { user } = useAuth();
    const [prayerDays, setPrayerDays] = useState<string[]>([]);
    const [readingDays, setReadingDays] = useState<string[]>([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const [s, r] = await Promise.all([
                    fetch("/api/streaks").then((res) => res.json()),
                    fetch("/api/reading-streak").then((res) => res.json()),
                ]);
                if (!cancelled) {
                    setPrayerDays(qualifyingPrayerDays(s?.data));
                    setReadingDays(Array.isArray(r?.data) ? r.data : []);
                }
            } catch {
                // Leave stats empty if the API is unreachable.
            } finally {
                if (!cancelled) setLoaded(true);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    if (!user) return null;

    const prayerStreak = currentStreak(prayerDays);
    const readingStreak = currentStreak(readingDays);

    return (
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <div className="flex items-center gap-4 mb-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={user.image ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=13c5dd&color=1d2a4d`}
                    alt={user.name}
                    className="size-16 rounded-full object-cover"
                />
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
                    <p className="text-sm text-gray-500">{user.email}</p>
                </div>
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-alice-blue rounded-xl px-4 py-3">
                    <dt className="text-[11px] uppercase tracking-widest text-gray-500">Member role</dt>
                    <dd className="text-sm font-semibold text-gray-800 capitalize">{user.role === "facilitator" ? "Facilitator" : user.role === "admin" ? "Admin" : "Member"}</dd>
                </div>
                <div className="bg-alice-blue rounded-xl px-4 py-3">
                    <dt className="text-[11px] uppercase tracking-widest text-gray-500">Email status</dt>
                    <dd className="text-sm font-semibold text-gray-800">{user.emailVerified ? "Verified" : "Not verified"}</dd>
                </div>
            </dl>

            <div id="streaks" className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 scroll-mt-28">
                <div className="rounded-xl border border-orange-100 bg-orange-50 px-4 py-3">
                    <dt className="text-[11px] uppercase tracking-widest text-orange-500 flex items-center gap-1">
                        <LuFlame /> Prayer streak
                    </dt>
                    <dd className="text-2xl font-bold text-gray-800">
                        {loaded ? `${prayerStreak} ${prayerStreak === 1 ? "day" : "days"}` : "…"}
                    </dd>
                    <dd className="text-xs text-gray-500 mt-0.5">{prayerDays.length} prayer day{prayerDays.length === 1 ? "" : "s"} logged</dd>
                </div>
                <div className="rounded-xl border border-cyan-100 bg-cyan-50 px-4 py-3">
                    <dt className="text-[11px] uppercase tracking-widest text-cyan flex items-center gap-1">
                        <LuFlame /> Reading streak
                    </dt>
                    <dd className="text-2xl font-bold text-gray-800">
                        {loaded ? `${readingStreak} ${readingStreak === 1 ? "day" : "days"}` : "…"}
                    </dd>
                    <dd className="text-xs text-gray-500 mt-0.5">{readingDays.length} reading day{readingDays.length === 1 ? "" : "s"} logged</dd>
                </div>
            </div>

            <p className="text-xs text-gray-400 mt-6">
                Streaks are synced from your mobile app. Club memberships and saved reading guides will appear here soon.
            </p>
        </div>
    );
}