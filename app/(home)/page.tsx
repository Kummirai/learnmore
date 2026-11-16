import type { Metadata } from "next";
import Hero from "@/components/Hero";
import ClubBento from "@/components/ClubBento";
import Vision from "@/components/Vision";
import Objectives from "@/components/Objectives";
import Principles from "@/components/Principles";
import Stats from "@/components/Stats";
import EventsSports from "@/components/EventsSports";
import PhotoHighlights from "@/components/PhotoHighlights";
import NewsHighlights from "@/components/NewsHighlights";
import Facilities from "@/components/Facilities";
import FeesSection from "@/components/FeesSection";
import Testimonials from "@/components/Testimonials";
import ClosingCta from "@/components/ClosingCta";
import FaqSection from "@/components/FaqSection";
import Contact from "@/components/Contact";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Hero />
      <Vision />
      <Objectives />
      <Principles />
      <ClubBento />
      <Stats />
      <EventsSports />
      <PhotoHighlights />
      <NewsHighlights />
      <Facilities />
      <FeesSection />
      <Testimonials />
      <ClosingCta />
      <FaqSection />
      <Contact />
    </>
  );
}
