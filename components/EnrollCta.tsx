import Link from "next/link";
import { FaAndroid, FaApple, FaWhatsapp } from "react-icons/fa";
import { LuArrowDownToLine } from "react-icons/lu";

const APK_URL = "/relate-app.apk"; // drop the built APK into /public with this name

export default function EnrollCta() {
  return (
    <section
      className={"bg-gradient-to-br from-navy via-navy-soft to-navy-dark px-4"}
    >
      <div className={"max-w-4xl mx-auto py-20 text-center"}>
        <h2 className={"text-3xl md:text-4xl font-bold text-white mb-4"}>
          Find Your Crew. Grow in Every Area of Life.
        </h2>
        <p className={"text-cyan-light text-lg mb-8 max-w-2xl mx-auto"}>
          Skills, social and spiritual growth — all in one community. Clubs for
          every age and season of life, and it&apos;s 100% free to join.
        </p>

        {/* App download buttons */}
        <div className={"flex items-center justify-center gap-4 flex-wrap mb-10"}>
          <a
            href={APK_URL}
            download
            className={
              "inline-flex items-center gap-3 bg-cyan text-navy py-3 px-8 text-lg font-semibold rounded-lg hover:bg-cyan-dark transition-colors"
            }
          >
            <FaAndroid className={"text-2xl"} />
            <span className={"flex flex-col items-start leading-tight"}>
              <span className={"text-[10px] uppercase tracking-widest opacity-80"}>
                Download for Android
              </span>
              <span>Get the APK</span>
            </span>
          </a>
          <span
            className={
              "inline-flex items-center gap-3 bg-white/10 text-white/70 py-3 px-8 text-lg font-medium rounded-lg border border-white/20 cursor-not-allowed"
            }
            title={"Coming soon"}
          >
            <FaApple className={"text-2xl"} />
            <span className={"flex flex-col items-start leading-tight"}>
              <span className={"text-[10px] uppercase tracking-widest opacity-70"}>
                iOS
              </span>
              <span>Coming soon</span>
            </span>
          </span>
        </div>

        {/* Secondary actions */}
        <div className={"flex items-center justify-center gap-4 flex-wrap"}>
          <Link
            href={"/enroll"}
            className={
              "bg-white/20 text-white py-3 px-10 text-lg font-medium hover:bg-white/30 transition-colors backdrop-blur-sm border border-white/30"
            }
          >
            Join a Club
          </Link>
          <a
            href={"https://wa.me/27782677436"}
            target={"_blank"}
            rel={"noopener noreferrer"}
            className={
              "bg-white/20 text-white py-3 px-10 text-lg font-medium hover:bg-white/30 transition-colors backdrop-blur-sm border border-white/30 inline-flex items-center gap-2"
            }
          >
            <FaWhatsapp /> Chat on WhatsApp
          </a>
        </div>

        <p className={"text-white/50 text-sm mt-6 flex items-center justify-center gap-2"}>
          <LuArrowDownToLine /> Free download · Android 8.0+
        </p>
      </div>
    </section>
  );
}
