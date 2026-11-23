import type { Metadata } from "next";
import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";
import EducationSections from "@/components/EducationSections";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Education",
  description:
    "Explore Relate World Education: school kits, peer learning, exam prep and Launchpad guidance that help learners become self-reliant.",
  alternates: { canonical: "/education" },
};

export default function EducationPage() {
  return (
    <>
      <PageHero
        bgImage="/images/heroes/sprout.webp"
        title="Education"
        mobileTitle="Education"
        tagline="Learn today. Lead tomorrow."
        description="Practical tools, peer learning, exam readiness and Launchpad guidance across all clubs."
        meta={[
          { label: "Covers", value: "All clubs" },
          { label: "Club season", value: "March – November" },
          { label: "Pillars", value: "4 programmes" },
        ]}
        actions={
          <>
            <Link href="#pillars" className="btn-pill btn-light">
              Explore the pillars
            </Link>
            <Link href="/join" className="btn-pill btn-outline-light">
              Join a club <LuArrowRight />
            </Link>
          </>
        }
      />
      <EducationSections />
    </>
  );
}
