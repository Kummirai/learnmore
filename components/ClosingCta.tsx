import Link from "next/link";
import { FaAndroid } from "react-icons/fa";
import { LuArrowDownToLine } from "react-icons/lu";

const APK_URL = "/relate-app.apk";

/** One dark closing band — enrolment and the club visit, side by side. */
export default function ClosingCta() {
  return (
    <section className={"bg-navy px-4 py-24 md:py-36"}>
      <div className={"reveal mx-auto max-w-3xl text-center"}>
        <p
          className={
            "mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan"
          }
        >
          Join the family
        </p>
        <h2 className={"text-4xl font-semibold text-white md:text-5xl"}>
          Find your crew.
        </h2>
        <p className={"mt-5 text-lg leading-relaxed text-white/75"}>
          Skills, social and spiritual growth — all in one community. Clubs for
          every age and season of life, 100% free to join, and your first club
          visit is always free.
        </p>
        <div
          className={
            "mt-9 flex flex-wrap items-center justify-center gap-4"
          }
        >
          <a href={APK_URL} download className={"btn-pill btn-light"}>
            <FaAndroid className={"text-lg"} />
            Download for Android
          </a>
          <Link
            href={
              "https://wa.me/27782677436?text=Hello%20Relate!%20I%27d%20like%20to%20visit%20a%20club."
            }
            target={"_blank"}
            className={"btn-pill btn-outline-light"}
          >
            Visit a club
          </Link>
        </div>
        <p
          className={
            "mt-6 flex items-center justify-center gap-2 text-sm text-cyan"
          }
        >
          <LuArrowDownToLine /> Free download · Android 8.0+ · iOS coming soon
        </p>
      </div>
    </section>
  );
}
