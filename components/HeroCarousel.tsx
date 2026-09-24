"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { LuArrowRight, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import Navbar from "@/components/Navbar";

export type HeroSlide = {
  title: string;
  /** One-word title shown on small screens. */
  shortTitle?: string;
  description: string;
  image: string;
  accent: string;
  cta: { href: string; label: string };
  secondary?: { href: string; label: string };
};

const AUTOPLAY_MS = 5000;

export default function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback(
    (next: number) => setIndex((next + slides.length) % slides.length),
    [slides.length],
  );

  const restart = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      AUTOPLAY_MS,
    );
  }, [slides.length]);

  useEffect(() => {
    restart();
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [restart]);

  const slide = slides[index];

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden bg-navy"
      onMouseEnter={() => timer.current && clearInterval(timer.current)}
      onMouseLeave={restart}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${slide.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div
        aria-hidden
        className="absolute -top-24 -left-20 size-72 md:size-96 rounded-full bg-navy/50 opacity-70 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 -translate-x-[55%] -translate-y-1/2 size-96 md:size-[32rem] rounded-full bg-navy/40 blur-3xl"
      />

      <Navbar overlay />

      <div className="relative z-10 max-w-6xl mx-auto w-full px-4 sm:px-6 min-h-screen flex flex-col justify-center pt-28 pb-44 sm:pb-24">
        <div className="max-w-2xl mx-auto sm:mx-0 text-center sm:text-left flex flex-col gap-4 sm:gap-7">
          <h1
            className="font-black tracking-tight leading-none text-white"
            style={{
              fontSize: "clamp(4.8rem, 10vw, 7.5rem)",
              textShadow: "0 2px 16px rgba(21,31,58,0.55), 0 1px 3px rgba(21,31,58,0.45)",
            }}
          >
            <span className="hidden sm:inline">{slide.title}</span>
            <span className="sm:hidden">{slide.shortTitle ?? slide.title}</span>
          </h1>

          <p
            className="text-white leading-relaxed text-base md:text-lg max-w-[90%] mx-auto sm:max-w-sm sm:mx-0"
            style={{ textShadow: "0 1px 3px rgba(21,31,58,0.8), 0 2px 14px rgba(21,31,58,0.6)" }}
          >
            {slide.description}
          </p>

          <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-start mt-3">
            <Link
              href={slide.cta.href}
              className="inline-flex items-center justify-center gap-2 bg-white text-navy px-6 py-3.5 rounded-lg font-bold text-sm hover:bg-white/90 transition-colors"
            >
              {slide.cta.label} <LuArrowRight />
            </Link>
            {slide.secondary && (
              <a
                href={slide.secondary.href}
                {...(slide.secondary.href.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="inline-flex items-center justify-center gap-2 border border-white/30 bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-lg font-bold text-sm hover:border-white/60 hover:bg-white/20 transition-colors"
              >
                {slide.secondary.href.startsWith("https://wa.me") && (
                  <FaWhatsapp />
                )}
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
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => {
                go(i);
                restart();
              }}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-6" : "w-2"
              }`}
              style={{
                backgroundColor:
                  i === index ? slide.accent : "rgba(255,255,255,0.4)",
              }}
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