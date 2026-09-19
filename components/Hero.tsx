import Link from "next/link";
import PageHero from "@/components/PageHero";

export default function Hero() {
  return (
    <PageHero
      title={"Grow"}
      tagline={"in every area of life"}
      description={
        "Share your gifts. Connect with your community. Deepen your faith. Relate brings it all together."
      }
      chips={[
        { label: "Skills" },
        { label: "Social" },
        { label: "Spiritual" },
      ]}
      watermark={"R–7"}
      actions={
        <>
          <Link
            href={"/enroll"}
            className={
              "inline-flex items-center gap-2 bg-white text-navy px-6 py-3 rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors"
            }
          >
            Enroll your child
          </Link>
          <Link
            href={"/subjects"}
            className={
              "inline-flex items-center gap-2 border border-white/25 text-white px-6 py-3 rounded-lg font-semibold text-sm hover:border-white/60 transition-colors"
            }
          >
            Explore subjects
          </Link>
        </>
      }
      meta={[
        { label: "Learners", value: "850+" },
        { label: "Grades", value: "R – 7" },
        { label: "Pass rate", value: "100%" },
      ]}
      metaEnd={
        <Link
          href={"/about"}
          className={
            "inline-flex items-center gap-2 font-medium text-white hover:text-cyan-light transition-colors"
          }
        >
          <span
            className={"text-[11px] uppercase tracking-widest text-white/50"}
          >
            Since 2000
          </span>
          About the school →
        </Link>
      }
    />
  );
}
