"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LuCookie } from "react-icons/lu";

export const COOKIE_CONSENT_KEY = "relate:cookie-consent";
export const OPEN_COOKIE_PREFERENCES_EVENT = "relate:open-cookie-preferences";

type Choice = {
  essential: true;
  analytics: boolean;
  at: string;
};

export default function CookieConsent() {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        if (!localStorage.getItem(COOKIE_CONSENT_KEY)) setOpen(true);
      } catch {
        setOpen(true);
      }
    }, 700);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const openPreferences = () => {
      setOpen(true);
      window.setTimeout(() => dialogRef.current?.focus(), 0);
    };
    window.addEventListener(OPEN_COOKIE_PREFERENCES_EVENT, openPreferences);
    return () =>
      window.removeEventListener(OPEN_COOKIE_PREFERENCES_EVENT, openPreferences);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const choose = (analytics: boolean) => {
    const choice: Choice = {
      essential: true,
      analytics,
      at: new Date().toISOString(),
    };
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(choice));
    } catch {
      // Storage can be unavailable in private modes — the banner still closes.
    }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-copy"
      className="rise-in fixed inset-x-3 bottom-3 z-[90] mx-auto max-w-2xl rounded-2xl border border-line bg-white p-4 shadow-[0_20px_60px_rgba(7,16,29,0.22)] sm:bottom-5 sm:p-5"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-soft text-blue">
          <LuCookie className="text-xl" />
        </div>

        <div className="flex-1">
          <h2 id="cookie-consent-title" className="text-sm font-bold text-navy">
            Your cookie choices
          </h2>
          <p id="cookie-consent-copy" className="mt-1 text-xs leading-relaxed text-slate-gray">
            We use essential cookies to keep you signed in and remember your
            preferences. With your permission we&rsquo;d also like to use
            analytics cookies to understand how RelateWorld is used. Read our{" "}
            <Link href="/cookies" className="font-semibold text-blue underline underline-offset-2">
              Cookie Policy
            </Link>
            .
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => choose(false)}
          className="min-h-11 rounded-xl border border-line px-5 text-sm font-semibold text-navy transition-colors hover:bg-alice-blue"
        >
          Essential only
        </button>
        <button
          type="button"
          onClick={() => choose(true)}
          className="min-h-11 rounded-xl bg-navy px-5 text-sm font-semibold text-white transition-colors hover:bg-navy-soft"
        >
          Accept all
        </button>
      </div>
    </div>
  );
}
