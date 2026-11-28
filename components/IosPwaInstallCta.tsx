"use client";

import Link from "next/link";
import { useId, useState, useSyncExternalStore } from "react";
import { FaApple } from "react-icons/fa";
import { LuArrowUpRight, LuChevronDown } from "react-icons/lu";

type IosPwaInstallCtaProps = {
  tone?: "light" | "dark";
  align?: "left" | "center";
  label?: string;
  emphasis?: "default" | "primary";
};

const subscribe = () => () => {};

const getIosBrowserSnapshot = () => {
  if (typeof window === "undefined") return false;

  const nav = window.navigator;
  const isIos =
    /iPad|iPhone|iPod/.test(nav.userAgent) ||
    (nav.platform === "MacIntel" && nav.maxTouchPoints > 1);
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (nav as Navigator & { standalone?: boolean }).standalone === true;

  return isIos && !isStandalone;
};

const getServerSnapshot = () => false;

/** True only on iOS Safari when the app is not already on the home screen. */
export function useIosPwaInstallable() {
  return useSyncExternalStore(
    subscribe,
    getIosBrowserSnapshot,
    getServerSnapshot,
  );
}

export default function IosPwaInstallCta({
  tone = "light",
  align = "left",
  label = "Add to Home Screen",
  emphasis = "default",
}: IosPwaInstallCtaProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const visible = useIosPwaInstallable();

  if (!visible) return null;

  const dark = tone === "dark";
  const panelClasses = dark
    ? "mt-3 w-[min(21rem,calc(100vw-3rem))] rounded-2xl border border-white/20 bg-navy/95 p-4 text-left shadow-2xl ring-1 ring-white/10 backdrop-blur"
    : "mt-3 w-[min(21rem,calc(100vw-3rem))] rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-xl ring-1 ring-slate-900/5";
  const textClasses = dark
    ? "text-sm leading-relaxed text-white/75"
    : "text-sm leading-relaxed text-navy/70";
  const stepClasses = dark
    ? "grid size-5 shrink-0 place-items-center rounded-full bg-white/15 text-[11px] font-semibold text-white"
    : "grid size-5 shrink-0 place-items-center rounded-full bg-cyan/10 text-[11px] font-semibold text-cyan-ink";

  return (
    <div
      className={
        align === "center"
          ? "flex w-full flex-col items-center"
          : "flex flex-col items-start"
      }
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className={
          dark
            ? emphasis === "primary"
              ? "btn-pill bg-white text-sm font-semibold text-navy hover:bg-white/90"
              : "btn-pill border border-white/35 bg-white/10 text-sm text-white backdrop-blur hover:bg-white/20"
            : emphasis === "primary"
              ? "btn-pill bg-navy text-sm font-semibold text-white hover:bg-navy/90"
              : "btn-pill border border-cyan/25 bg-cyan/5 text-sm text-cyan-ink hover:bg-cyan/10"
        }
      >
        <FaApple className="text-base" />
        {label}
        <LuChevronDown
          aria-hidden
          className={`size-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div id={panelId} hidden={!open} className={panelClasses}>
        <p
          className={
            dark
              ? "text-sm font-semibold text-white"
              : "text-sm font-semibold text-navy"
          }
        >
          Install Relate on iPhone
        </p>
        <ol className={`mt-3 space-y-2 ${textClasses}`}>
          <li className="flex gap-2">
            <span className={stepClasses}>1</span>
            <span>Make sure you&apos;re in Safari (not an in-app browser).</span>
          </li>
          <li className="flex gap-2">
            <span className={stepClasses}>2</span>
            <span>Tap the Share button.</span>
          </li>
          <li className="flex gap-2">
            <span className={stepClasses}>3</span>
            <span>Tap Add to Home Screen, then Add.</span>
          </li>
        </ol>
        <Link
          href="/app/"
          className={
            dark
              ? "mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-light hover:text-white"
              : "mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-ink hover:text-cyan-dark"
          }
        >
          Open Relate PWA
          <LuArrowUpRight className="size-4" />
        </Link>
        <p
          className={
            dark
              ? "mt-3 text-xs leading-relaxed text-white/55"
              : "mt-3 text-xs leading-relaxed text-navy/50"
          }
        >
          Chrome and Firefox on iOS can&apos;t add apps to the home screen.
        </p>
      </div>
    </div>
  );
}
