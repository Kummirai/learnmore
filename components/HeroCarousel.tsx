"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { LuArrowRight, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import Navbar from "@/components/Navbar";

export type HeroSlide = {
  title: string;
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
          backgroundImage: `linear-gradient(100deg, rgba(21,31,58,0.96) 0%, rgba(21,31,58,0.88) 40%, rgba(21,31,58,0.45) 75%, rgba(21,31,58,0.25) 100%), url(${slide.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
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

      <div className="relative z-10 max-w-6xl mx-auto w-full px-4 sm:px-6 min-h-screen flex flex-col justify-center pt-24 pb-44 sm:pb-24">
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
                {...(slide.secondary.href.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-6 py-3 rounded-lg font-bold text-sm hover:border-white/60 hover:bg-white/10 transition-colors"
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