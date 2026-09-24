"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { LuArrowRight, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import Navbar from "@/components/Navbar";

type Slide = {
  label: string;
  title: string;
  description: string;
  image: string;
  accent: string;
  cta: { href: string; label: string };
  secondary?: { href: string; label: string };
};

const SLIDES: Slide[] = [
  {
    label: "Club Meetups",
    title: "Weekly clubs for every age",
    description:
      "Sprout classes, Surge nights and Pulse meetups — free and open to all.",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=80&auto=format",
    accent: "#13c5dd",
    cta: { href: "/events/clubs", label: "Club events" },
    secondary: { href: "/events", label: "All events" },
  },
  {
    label: "Worship & Prayer",
    title: "Worship & prayer nights",
    description:
      "Surge fire nights, testimonies and evening prayer, together.",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1600&q=80&auto=format",
    accent: "#f59e0b",
    cta: { href: "/prayer", label: "Prayer times" },
    secondary: { href: "/events", label: "All events" },
  },
  {
    label: "Match Days",
    title: "Match days & league",
    description:
      "Football, netball and volleyball fixtures on the Relate grounds.",
    image:
      "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1600&q=80&auto=format",
    accent: "#4caf50",
    cta: { href: "/sports", label: "Sports teams" },
    secondary: { href: "https://wa.me/27782677436", label: "Join a team" },
  },
  {
    label: "Family",
    title: "Family gatherings",
    description:
      "Family tables, socials, camps and seasonal celebrations.",
    image:
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1600&q=80&auto=format",
    accent: "#f97316",
    cta: { href: "/events/clubs", label: "Club events" },
    secondary: { href: "/events", label: "All events" },
  },
];

const AUTOPLAY_MS = 5000;

export default function EventsHeroCarousel() {
  const [index, setIndex] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback((next: number) => {
    setIndex((next + SLIDES.length) % SLIDES.length);
  }, []);

  const restart = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), AUTOPLAY_MS);
  }, []);

  useEffect(() => {
    restart();
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [restart]);

  const slide = SLIDES[index];

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden bg-navy"
      onMouseEnter={() => timer.current && clearInterval(timer.current)}
      onMouseLeave={restart}
    >
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          backgroundImage: `linear-gradient(100deg, rgba(21,31,58,0.96) 0%, rgba(21,31,58,0.88) 40%, rgba(21,31,58,0.45) 75%, rgba(21,31,58,0.25) 100%), url(${slide.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 1,
        }}
      />

      <div
        className="absolute -top-32 -right-24 size-96 rounded-full blur-3xl opacity-30"
        style={{ backgroundColor: slide.accent }}
      />
      <div
        className="absolute bottom-10 -left-24 size-96 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: slide.accent }}
      />
      <div
        className="absolute -right-20 -top-28 size-[30rem] rounded-full border"
        style={{ borderColor: "color-mix(in srgb, white 15%, transparent)" }}
      />

      <Navbar overlay />

      <div className="relative z-10 max-w-6xl mx-auto w-full px-4 sm:px-6 min-h-screen flex flex-col justify-center py-24">
        <div className="max-w-2xl">
          <h1
            className="font-black tracking-tight leading-none text-white mt-6"
            style={{ fontSize: "clamp(2.75rem, 8vw, 5.5rem)" }}
          >
            {slide.title}
          </h1>

          <p className="mt-5 text-white/80 leading-relaxed text-base md:text-lg max-w-xl">
            {slide.description}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href={slide.cta.href}
              className="inline-flex items-center justify-center gap-2 bg-white text-navy px-6 py-3.5 rounded-lg font-bold text-sm hover:bg-white/90 transition-colors"
            >
              {slide.cta.label} <LuArrowRight />
            </Link>
            {slide.secondary && (
              <a
                href={slide.secondary.href}
                {...(slide.secondary.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-6 py-3 rounded-lg font-bold text-sm hover:border-white/60 hover:bg-white/10 transition-colors"
              >
                {slide.secondary.href.startsWith("https://wa.me") && <FaWhatsapp />}
                {slide.secondary.label}
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => {
            go(index - 1);
            restart();
          }}
          className="size-10 inline-flex items-center justify-center rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors"
        >
          <LuChevronLeft />
        </button>
        <div className="flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => {
                go(i);
                restart();
              }}
              className={`h-2 rounded-full transition-all ${i === index ? "w-6" : "w-2"}`}
              style={{ backgroundColor: i === index ? slide.accent : "rgba(255,255,255,0.4)" }}
            />
          ))}
        </div>
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => {
            go(index + 1);
            restart();
          }}
          className="size-10 inline-flex items-center justify-center rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors"
        >
          <LuChevronRight />
        </button>
      </div>
    </section>
  );
}