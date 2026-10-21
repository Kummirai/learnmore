import Hero from "@/components/Hero";
import ClubBento from "@/components/ClubBento";
import ValueProps from "@/components/ValueProps";
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

export default function Home() {
  return (
    <>
      <Hero />
      <ClubBento />
      <ValueProps />
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
