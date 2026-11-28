import Link from "next/link";
import { FaAndroid } from "react-icons/fa";
import { LuArrowDownToLine } from "react-icons/lu";

import IosPwaInstallCta from "@/components/IosPwaInstallCta";
import { LATEST_APK_URL as APK_URL } from "@/lib/app-version";

/** One closing band — enrolment and the club visit, side by side. */
export default function ClosingCta() {
  return (
    <section
      className={"reveal px-6 py-24 md:px-4 md:py-36"}
      style={{ background: "linear-gradient(150deg, #e7fbff 0%, #ffffff 70%)" }}
    >
      <div className={"mx-auto max-w-3xl text-center"}>
        <p
          className={
            "mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-ink"
          }
        >
          Join the family
        </p>
        <h2 className={"text-4xl font-semibold text-navy md:text-5xl"}>
          Find your crew.
        </h2>
        <p className={"mt-5 text-lg leading-relaxed text-navy/70"}>
          Skills, social and spiritual growth — all in one community. Clubs for
          every age and season of life, 100% free to join, and your first club
          visit is always free.
        </p>
        <div className={"mt-9 flex flex-wrap items-center justify-center gap-4"}>
          <a href={APK_URL} download className={"btn-pill btn-brand"}>
            <FaAndroid className={"text-lg"} />
            Download for Android
          </a>
          <Link href={"/#clubs"} className={"link-chevron"}>
            Visit a club
          </Link>
        </div>
        <div className={"mt-6 flex flex-col items-center justify-center gap-4"}>
          <p
            className={
              "flex items-center justify-center gap-2 text-sm text-cyan-ink"
            }
          >
            <LuArrowDownToLine /> Free download · Android 8.0+ · iPhone PWA
            available
          </p>
          <IosPwaInstallCta tone="light" align="center" />
        </div>
      </div>
    </section>
  );
}
