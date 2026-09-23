/**
 * Shared prayer-time math — mirrors the mobile app's sunrise-sunset.org flow
 * (`prayer_app/src/app/(tabs)/index.tsx`). Six daily moments are derived from
 * astronomic sunrise, solar noon and sunset:
 *
 *   Dawn      = sunrise − 90 min
 *   Sunrise   = sunrise
 *   Noon      = solar noon
 *   Afternoon = midpoint of (noon + sunset)
 *   Sunset    = sunset
 *   Evening   = sunset + 90 min
 *
 * Same-origin reference coordinate is Johannesburg, matching the app's
 * fallback when no GPS fix is available.
 */

export type PrayerEntry = { key: string; label: string; date: Date };

export const PRAYER_COORDS = { lat: -25.7, lng: 28.2 };

export function dayMins(d: Date): number {
    return d.getHours() * 60 + d.getMinutes();
}

export function dateAtMins(m: number, ref: Date): Date {
    const d = new Date(ref);
    d.setHours(Math.floor(m / 60), m % 60, 0, 0);
    return d;
}

export function buildPrayerTimes(sunrise: Date, noon: Date, sunset: Date, ref: Date): PrayerEntry[] {
    const r = dayMins(sunrise);
    const n = dayMins(noon);
    const u = dayMins(sunset);
    return [
        { key: "dawn", label: "Dawn", date: dateAtMins(r - 90, ref) },
        { key: "sunrise", label: "Sunrise", date: new Date(sunrise) },
        { key: "noon", label: "Noon", date: new Date(noon) },
        { key: "afternoon", label: "Afternoon", date: dateAtMins(Math.floor((n + u) / 2), ref) },
        { key: "sunset", label: "Sunset", date: new Date(sunset) },
        { key: "evening", label: "Evening", date: dateAtMins(u + 90, ref) },
    ];
}

/** The next upcoming prayer today, or tomorrow's Dawn once today is done. */
export function nextPrayerEntry(times: PrayerEntry[], now: Date): PrayerEntry {
    const upcoming = times.filter((t) => t.date > now).sort((a, b) => a.date.getTime() - b.date.getTime());
    if (upcoming.length) return upcoming[0];
    const dawn = times.find((t) => t.key === "dawn") ?? times[0];
    const date = new Date(dawn.date);
    date.setDate(date.getDate() + 1);
    return { ...dawn, date };
}

/** Sanity times used when the sunrise-sunset API can't be reached (same as the app). */
export function fallbackPrayer(now: Date) {
    const at = (h: number, m: number) => {
        const d = new Date(now);
        d.setHours(h, m, 0, 0);
        return d;
    };
    return { sunrise: at(6, 15), noon: at(12, 0), sunset: at(18, 30) };
}

export function countdownParts(ms: number): { h: number; m: number; s: number; live: string } {
    const total = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    const pad = (n: number) => String(n).padStart(2, "0");
    return { h, m, s, live: h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}` };
}

export function time12(date: Date): string {
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
}

export function time24(date: Date): string {
    return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}