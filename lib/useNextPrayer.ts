import { useEffect, useRef, useState } from "react";
import {
  PRAYER_COORDS,
  buildPrayerTimes,
  fallbackPrayer,
  nextPrayerEntry,
  type PrayerEntry,
} from "@/lib/prayer-times";

const SUP_DIGITS = "⁰¹²³⁴⁵⁶⁷⁸⁹";
const supSeconds = (n: number) =>
  String(n)
    .padStart(2, "0")
    .replace(/\d/g, (d) => SUP_DIGITS[Number(d)]);

/** Live label + countdown to the next prayer moment (shared by hero and bento). */
export function useNextPrayer() {
  const [next, setNext] = useState<{ label: string; countdown: string } | null>(
    null,
  );
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
      if (!cancelled)
        timesRef.current = buildPrayerTimes(
          base.sunrise,
          base.noon,
          base.sunset,
          new Date(),
        );
    };

    const tick = () => {
      const now = new Date();
      const fb = fallbackPrayer(now);
      const times =
        timesRef.current ??
        buildPrayerTimes(fb.sunrise, fb.noon, fb.sunset, now);
      const n = nextPrayerEntry(times, now);
      const diff = Math.max(0, n.date.getTime() - now.getTime());
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setNext({
        label: n.label,
        countdown:
          h > 0
            ? `${h}h ${String(m).padStart(2, "0")}m ${supSeconds(s)}`
            : `${String(m).padStart(2, "0")}m ${supSeconds(s)}`,
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
