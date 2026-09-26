/**
 * Registration — club is chosen ONCE, at signup, and locked forever.
 *
 * The website guarantees two things registration-time that admin + club pages
 * depend on:
 *
 *   1. The club comes from one grouped selector (6 choices with ages), because
 *      a New Relate member always belongs to a real age band, not a club name.
 *   2. That choice becomes IMMUTABLE. No user-facing flow can ever change it —
 *      not via the profile page, not via a back-door param. Only an admin can.
 *
 * We render the immutable club lock as the final step ("so this stays yours").
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaCheck, FaLock, FaUsers, FaBaby, FaCrown } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa";
import PageHero from "@/components/PageHero";

const CLUBS = [
  { key: "kids", label: "Sprout Kids", ages: "6–8 yrs", group: "Sprout", accent: "#f97316", icon: FaBaby },
  { key: "tweens", label: "Sprout Tweens", ages: "9–11 yrs", group: "Sprout", accent: "#f59e0b", icon: FaBaby },
  { key: "teens", label: "Sprout Teens", ages: "12–16 yrs", group: "Sprout", accent: "#f59e0b", icon: FaBaby },
  { key: "surge", label: "Surge", ages: "16–21 yrs", group: "Surge", accent: "#06b6d4", icon: FaCrown },
  { key: "pulse", label: "Pulse", ages: "21–33 yrs", group: "Pulse", accent: "#8b5cf6", icon: FaCrown },
  { key: "adults", label: "Adults", ages: "33+ yrs", group: "Adults", accent: "#1e3a8a", icon: FaUsers },
];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<"choose" | "locked">("choose");
  const [selected, setSelected] = useState<string | null>(null);

  function choose(clubKey: string) {
    setSelected(clubKey);
    setStep("locked");
  }

  const club = CLUBS.find((c) => c.key === selected);

  return (
    <>
      <PageHero
        title={"Join a club"}
        mobileTitle={"Join"}
        tagline={"Pick your club. It stays yours."}
        description={
          "Your club is set at registration — by age band, matched to the member you are today. Once you pick, it can only be changed by an admin."
        }
        watermark={"RF"}
        meta={[{ label: "6 clubs", value: "" }]}
      />

      <section className="flex-1 px-4 py-12 bg-white">
        <div className="max-w-3xl mx-auto">
          {step === "choose" ? (
            <>
              <h2 className="text-2xl font-black text-navy mb-2">Which club is for you?</h2>
              <p className="text-sm text-slate-gray mb-6">
                One choice, locked at signup. Choose by the age band that fits you today.
              </p>

              <div className="grid sm:grid-cols-2 gap-3">
                {CLUBS.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => choose(c.key)}
                    className="group text-left rounded-2xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all text-navy"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: c.accent }}>
                        {c.group}
                      </span>
                      <c.icon className="text-xl text-slate-gray group-hover:hidden" />
                    </div>
                    <h3 className="text-lg font-black mt-1">{c.label}</h3>
                    <p className="text-xs text-slate-gray">{c.ages}</p>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm text-center">
              <div className="mx-auto size-14 rounded-full flex items-center justify-center bg-gold-50 mb-4">
                <FaCheck className="text-2xl text-gold-700" />
              </div>
              <h2 className="text-2xl font-black text-navy mb-1">Club locked</h2>
              <p className="text-sm text-slate-gray mb-6">
                Welcome to the{" "}
                <span className="font-bold" style={{ color: club!.accent }}>
                  {club!.label}
                </span>{" "}
                · {club!.ages}.
              </p>

              <div className="max-w-sm mx-auto rounded-2xl bg-slate-50 border border-slate-200 p-4 text-left flex items-start gap-3">
                <FaLock className="text-slate-gray mt-0.5" />
                <div className="text-xs leading-relaxed text-navy">
                  <p className="font-bold mb-0.5">This choice is locked</p>
                  <p className="text-slate-gray">
                    Your club shows in your profile and club pages, and unlocks your club&apos;s Bible Quiz
                    board. Only an admin can change it — not you, not the app, not us.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={`https://wa.me/27782677436?text=${encodeURIComponent(`Hi RelateWorld! I've joined as ${club!.label} (${club!.ages}). Please send a link to download the Relate app.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-navy text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-navy/90 transition-colors"
                >
                  <FaWhatsapp className="text-base" /> Download the app
                </a>
                <button
                  onClick={() => router.push("/plans/getting-started-in-the-bible")}
                  className="inline-flex items-center justify-center gap-2 border border-gray-200 text-navy px-6 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
                >
                  Start reading the Bible
                </button>
              </div>
              <button
                onClick={() => setStep("choose")}
                className="mt-3 text-xs text-slate-gray underline hover:text-navy transition-colors"
              >
                Change my choice (demo only — real accounts are locked)
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
