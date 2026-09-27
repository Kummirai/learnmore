"use client";

import { useState } from "react";
import { LuChevronDown } from "react-icons/lu";

const FAQS = [
  {
    q: "Is a Relate membership free?",
    a: "Yes — clubs, squads, reading plans, events and prayer times are all free, with no fee and no renewal. Sponsorship covers school fees, uniforms and meals for families who need a hand.",
  },
  {
    q: "What is my membership reference for?",
    a: "It's your lookup code: the first three letters of your club plus six characters. Quote it to your leader instead of giving out your number again — it's also printed on the tear-off stub of your card.",
  },
  {
    q: "What happens right after I register?",
    a: "Your membership is active immediately. Your leader gets in touch on WhatsApp with the time and venue for your first gathering, and you're part of the monthly Club Gathering — every second Friday.",
  },
  {
    q: "Why is there no record on this device?",
    a: "Your copy of the record lives on the device you registered from. Open this page on that device, or run through the join form again — your leader can also find you by name or phone number.",
  },
  {
    q: "How do I change my details or my squad?",
    a: "Go through the join form once more: it's pre-filled with everything we already know, so you only touch what's changed. Your leader receives the update against your reference.",
  },
  {
    q: "Who can see my phone number?",
    a: "Your club leaders and the Relate admin team — nobody else. Public team pages show first names only, and your card shows the details your leader recorded.",
  },
];

export default function MembershipFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="border-t border-gray-100 bg-alice-blue px-4 py-16 md:py-20">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <p className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-dark">
            Membership FAQ
          </p>
          <h2 className="text-3xl font-black tracking-tight text-navy md:text-4xl">
            Questions members actually ask
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q}
                className="rounded-xl border border-white/70 bg-white shadow-[0_1px_2px_rgba(21,31,58,0.05)]"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`membership-faq-${i}`}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left transition-colors hover:bg-alice-blue/60"
                >
                  <span className="text-sm font-semibold text-navy md:text-base">
                    {item.q}
                  </span>
                  <LuChevronDown
                    className={`shrink-0 text-lg text-slate-gray transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  id={`membership-faq-${i}`}
                  hidden={!isOpen}
                  className="border-t border-gray-100 px-5 pb-5 pt-4"
                >
                  <p className="text-sm leading-relaxed text-slate-gray">
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
