import type { Metadata } from "next";
import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";
import CareConnectSections from "@/components/CareConnectSections";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Relate, Care & Connect Day",
  description:
    "Every first weekend of December, Relate World clubs turn a year of seasonal outings, Smart Saver habits and teamwork into direct, real-need community care.",
  alternates: { canonical: "/care-connect-day" },
};

export default function CareConnectDayPage() {
  return (
    <>
      <PageHero
        bgImage="/images/care-connect/produce-volunteers.jpg"
        title="Care and Connect"
        tagline="First weekend of December"
        description="Turn a year of saving and teamwork into real care this December."
        actions={
          <Link href="/contact" className="btn-pill btn-light">
            Support a club <LuArrowRight />
          </Link>
        }
      />
      <CareConnectSections />
    </>
  );
}
