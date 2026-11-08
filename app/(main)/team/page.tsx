import type { Metadata } from "next";
import Link from "next/link";
import Team from "@/components/Team";
import { LuHandHeart } from "react-icons/lu";

export const metadata: Metadata = {
  title: "Our Team",
  description:
    "Meet the Relate Presidency, club directors, sports coaches and the founding Career & Economic Pathways committee.",
  alternates: { canonical: "/team" },
};

export default function TeamPage() {
  return (
    <>
      <section className={"reveal flex-1 px-4 pt-16 md:pt-24 pb-4"}>
        <div className={"max-w-4xl mx-auto text-center"}>
          <h1
            className={"text-4xl md:text-5xl font-semibold text-navy mb-4"}
          >
            Our Team
          </h1>
          <p className={"text-gray-500 max-w-xl mx-auto"}>
            Relate is run by volunteers. These are the people leading the
            Presidency, each club and every sports squad — and the founding
            roles shaping our new Career &amp; Economic Pathways Department.
          </p>
          <div className={"mt-6 flex flex-wrap justify-center gap-3"}>
            <Link
              href={"/offices"}
              className={
                "btn-pill btn-brand"
              }
            >
              <LuHandHeart /> Volunteer offices
            </Link>
            <Link
              href={"/team#career-pathways"}
              className={
                "btn-pill border border-line bg-white text-navy hover:bg-alice-blue"
              }
            >
              Founding roles
            </Link>
          </div>
        </div>
      </section>

      <Team />
    </>
  );
}
