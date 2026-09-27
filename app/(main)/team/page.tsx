import type { Metadata } from "next";
import Link from "next/link";
import Team from "@/components/Team";
import { LuHandHeart } from "react-icons/lu";

export const metadata: Metadata = {
  title: "Our Team",
  description:
    "Meet the Relate Presidency, club directors and sports coaches who lead our clubs and programmes.",
  alternates: { canonical: "/team" },
};

export default function TeamPage() {
  return (
    <>
      <section className={"flex-1 px-4 pt-12 pb-4"}>
        <div className={"max-w-4xl mx-auto text-center"}>
          <h1
            className={"text-3xl md:text-4xl font-semibold text-gray-800 mb-3"}
          >
            Our Team
          </h1>
          <p className={"text-gray-500 max-w-xl mx-auto"}>
            Relate is run by volunteers. These are the people leading the
            Presidency, each club and every sports squad.
          </p>
          <Link
            href={"/volunteer"}
            className={
              "mt-6 inline-flex items-center gap-2 bg-[#13c5dd] text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-[#67e3f5] transition-colors"
            }
          >
            <LuHandHeart /> Volunteer with us
          </Link>
        </div>
      </section>

      <Team />
    </>
  );
}
