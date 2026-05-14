import Hero from "@/components/Hero";
import Learn from "@/components/Learn";
import Stats from "@/components/Stats";
import Courses from "@/components/Courses";
import Events from "@/components/Events";
import PhotoHighlights from "@/components/PhotoHighlights";
import NewsHighlights from "@/components/NewsHighlights";
import Team from "@/components/Team";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  return (
    <>
      <Hero />
      <Learn />
      <Stats />
      <Courses />
      <Events />
      <PhotoHighlights />
      <NewsHighlights />
      <Team />
      <Testimonials />
    </>
  );
}
