import { FaAndroid, FaWhatsapp } from "react-icons/fa";
import { LuArrowDownToLine } from "react-icons/lu";

const APK_URL = "/relate-app.apk";

export default function RequestAppCta({
  eyebrow,
  title,
  note,
}: {
  eyebrow: string;
  title: string;
  note: string;
}) {
  return (
    <section className={"bg-gradient-to-br from-navy via-navy-soft to-navy-dark px-4"}>
      <div className={"max-w-3xl mx-auto py-14 md:py-20 text-center"}>
        <p className={"text-xs font-semibold uppercase tracking-[0.2em] text-cyan-light"}>
          {eyebrow}
        </p>
        <h2 className={"mt-3 text-3xl md:text-4xl font-bold text-white"}>{title}</h2>
        <p className={"mt-4 text-white/70 max-w-xl mx-auto leading-relaxed"}>{note}</p>

        <div className={"flex flex-wrap items-center justify-center gap-4 mt-8"}>
          <a
            href={APK_URL}
            download
            className={
              "inline-flex items-center gap-3 bg-cyan text-navy py-3 px-8 rounded-lg font-semibold hover:bg-cyan-dark transition-colors"
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
          <a
            href={"https://wa.me/27782677436?text=" + encodeURIComponent("Hi RelateWorld! I'd like to make a request.")}
            target="_blank"
            rel="noopener noreferrer"
            className={
              "inline-flex items-center gap-2.5 border border-white/25 text-white py-3 px-8 rounded-lg font-semibold hover:bg-white/10 transition-colors"
            }
          >
            <FaWhatsapp className={"text-xl"} /> Chat on WhatsApp
          </a>
        </div>

        <p className={"mt-5 text-sm text-white/50 inline-flex items-center justify-center gap-2"}>
          <LuArrowDownToLine /> Free download · Android 8.0+ · Prayer and requests are sent through the app
        </p>
      </div>
    </section>
  );
}