import type { Metadata } from "next";
import Hero from "@/components/Hero";
import ClubBento from "@/components/ClubBento";
import Vision from "@/components/Vision";
import Objectives from "@/components/Objectives";
import Principles from "@/components/Principles";
import CareConnectBanner from "@/components/CareConnectBanner";
import EventsSports from "@/components/EventsSports";
import EducationGlance from "@/components/EducationGlance";
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
      <CareConnectBanner />
      <EventsSports />
      <EducationGlance />
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
