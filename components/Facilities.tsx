import Link from "next/link";
import { FaAndroid } from "react-icons/fa";
import {
  LuBookOpen,
  LuHandHeart,
  LuMessageCircleHeart,
  LuMoonStar,
  LuSmartphone,
  LuSun,
  LuUsers,
} from "react-icons/lu";

import { LATEST_APK_URL as APK_URL } from "@/lib/app-version";

const features = [
  {
    icon: LuMessageCircleHeart,
    label: "Prayer Requests",
    body: "Share a need and pray together — privately or with your club.",
    chip: "bg-blue-soft text-blue ring-blue/10",
  },
  {
    icon: LuMoonStar,
    label: "Bible Reading Guides",
    body: "Season-long plans that meet you at your stage of faith.",
    chip: "bg-gold-100 text-gold-700 ring-gold-300/30",
  },
  {
    icon: LuSun,
    label: "Daily Prayer Times",
    body: "Six gentle prompts from dawn to evening.",
    chip: "bg-cyan/10 text-cyan-ink ring-cyan/20",
  },
  {
    icon: LuHandHeart,
    label: "Ask for Help",
    body: "Food, fees, uniforms, childcare or counselling — just ask.",
    chip: "bg-gold-100 text-gold-700 ring-gold-300/30",
  },
];

export default function Facilities() {
  return (
    <section
      className={
        "reveal reveal-stagger bg-white px-6 py-24 md:px-4 md:py-32"
      }
    >
      <div
        className={
          "mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16"
        }
      >
        <div>
          <p
            className={
              "mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan"
            }
          >
            Inside the app
          </p>
          <h2
            className={
              "text-3xl font-semibold text-navy sm:text-4xl lg:text-5xl"
            }
          >
            Everything you need for daily growth
          </h2>
          <p className={"mt-5 max-w-md text-lg leading-relaxed text-navy/70"}>
            Tools that keep your faith and community close — wherever the day
            takes you.
          </p>
          <div className={"mt-8 flex flex-wrap items-center gap-x-5 gap-y-4"}>
            <a href={APK_URL} download className={"btn-pill btn-brand"}>
              <FaAndroid className={"text-lg"} />
              Download the app
            </a>
            <Link href="/#clubs" className={"link-chevron"}>
              Explore the clubs
            </Link>
          </div>
          <p className={"mt-6 flex items-center gap-2 text-sm text-navy/60"}>
            <LuSmartphone className={"size-4 text-cyan-ink"} />
            Free on Android · iOS coming soon
          </p>
        </div>

        <div className={"grid gap-3 sm:grid-cols-2"}>
          <div
            className={
              "stagger-item relative overflow-hidden rounded-2xl border border-cyan/20 bg-gradient-to-br from-cyan/10 via-white to-sky/10 p-5 shadow-sm sm:col-span-2"
            }
          >
            <div
              aria-hidden
              className={
                "pointer-events-none absolute -right-8 -top-10 size-32 rounded-full bg-cyan/15 blur-2xl"
              }
            />
            <div className={"relative flex items-start gap-4"}>
              <span
                className={
                  "grid size-11 shrink-0 place-items-center rounded-xl bg-white text-cyan-ink shadow-sm ring-1 ring-cyan/20"
                }
              >
                <LuBookOpen className={"size-5"} />
              </span>
              <div>
                <p
                  className={
                    "text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-ink"
                  }
                >
                  Verse of the Day
                </p>
                <p
                  className={
                    "mt-2 font-display text-lg leading-snug text-navy"
                  }
                >
                  &ldquo;Your word is a lamp to my feet and a light to my
                  path.&rdquo;
                </p>
                <p className={"mt-1.5 text-xs text-navy/50"}>
                  Psalm 119:105
                </p>
              </div>
            </div>
          </div>

          {features.map(({ icon: Icon, label, body, chip }) => (
            <div
              key={label}
              className={
                "stagger-item rounded-2xl border border-black/5 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              }
            >
              <div
                className={`mb-3 grid size-10 place-items-center rounded-xl ring-1 ring-inset ${chip}`}
              >
                <Icon className={"size-5"} />
              </div>
              <h3 className={"text-sm font-semibold text-navy"}>{label}</h3>
              <p
                className={"mt-1 text-[13px] leading-relaxed text-navy/60"}
              >
                {body}
              </p>
            </div>
          ))}

          <div
            className={
              "stagger-item flex items-center gap-4 rounded-2xl border border-black/5 bg-white p-4 shadow-sm sm:col-span-2"
            }
          >
            <span
              className={
                "grid size-10 shrink-0 place-items-center rounded-xl bg-cyan/10 text-cyan-ink ring-1 ring-inset ring-cyan/20"
              }
            >
              <LuUsers className={"size-5"} />
            </span>
            <div className={"min-w-0"}>
              <h3 className={"text-sm font-semibold text-navy"}>
                WhatsApp Communities
              </h3>
              <p
                className={"mt-0.5 text-[13px] leading-relaxed text-navy/60"}
              >
                Your club&rsquo;s group, always in your pocket between meetups.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
