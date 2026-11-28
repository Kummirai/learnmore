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

import IosPwaInstallCta from "@/components/IosPwaInstallCta";
import { LATEST_APK_URL as APK_URL } from "@/lib/app-version";

const features = [
  {
    icon: LuMessageCircleHeart,
    label: "Prayer Requests",
    body: "Share a need and pray together — privately or with your club.",
    chip: "bg-blue-soft text-blue",
    bg: "linear-gradient(160deg, rgba(56,189,248,0.10) 0%, rgba(255,255,255,0) 70%)",
  },
  {
    icon: LuMoonStar,
    label: "Bible Reading Guides",
    body: "Season-long plans that meet you at your stage of faith.",
    chip: "bg-gold-100 text-gold-700",
    bg: "linear-gradient(160deg, rgba(240,180,41,0.10) 0%, rgba(255,255,255,0) 70%)",
  },
  {
    icon: LuSun,
    label: "Daily Prayer Times",
    body: "Six gentle prompts from dawn to evening.",
    chip: "bg-cyan/10 text-cyan-ink",
    bg: "linear-gradient(160deg, rgba(19,197,221,0.10) 0%, rgba(255,255,255,0) 70%)",
  },
  {
    icon: LuHandHeart,
    label: "Ask for Help",
    body: "Food, fees, uniforms, childcare or counselling — just ask.",
    chip: "bg-gold-100 text-gold-700",
    bg: "linear-gradient(160deg, rgba(240,180,41,0.10) 0%, rgba(255,255,255,0) 70%)",
  },
];

export default function Facilities() {
  return (
    <section className={"reveal bg-white px-6 py-24 md:px-4 md:py-32"}>
      <div className={"mx-auto max-w-6xl"}>
        <div className={"mx-auto max-w-3xl text-center"}>
          <p
            className={
              "text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan"
            }
          >
            Inside the app
          </p>
          <h2
            className={
              "mt-4 text-3xl font-semibold leading-tight text-navy sm:text-4xl lg:text-5xl"
            }
          >
            Everything you need for daily growth
          </h2>
          <p className={"mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-navy/70"}>
            Tools that keep your faith and community close — wherever the day
            takes you.
          </p>
          <div
            className={
              "mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-4"
            }
          >
            <a href={APK_URL} download className={"btn-pill btn-brand"}>
              <FaAndroid className={"text-lg"} />
              Download the app
            </a>
            <Link href="/#clubs" className={"link-chevron"}>
              Explore the clubs
            </Link>
          </div>
          <div
            className={
              "mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-3"
            }
          >
            <p className={"flex items-center gap-2 text-sm text-navy/60"}>
              <LuSmartphone className={"size-4 text-cyan-ink"} />
              Free on Android · iPhone PWA available
            </p>
            <IosPwaInstallCta tone="light" align="center" />
          </div>
        </div>

        <div
          className={
            "reveal reveal-stagger mt-16 grid gap-10 text-center sm:grid-cols-2 lg:grid-cols-4 lg:gap-8"
          }
        >
          {features.map(({ icon: Icon, label, body, chip, bg }) => (
            <div
              key={label}
              className={"stagger-item rounded-2xl px-5 py-6"}
              style={{ background: bg }}
            >
              <span
                className={`mx-auto grid size-12 place-items-center rounded-2xl ${chip}`}
              >
                <Icon className={"size-6"} />
              </span>
              <h3 className={"mt-4 text-base font-semibold text-navy"}>
                {label}
              </h3>
              <p
                className={
                  "mx-auto mt-2 max-w-[16rem] text-sm leading-relaxed text-navy/60"
                }
              >
                {body}
              </p>
            </div>
          ))}
        </div>

        <div
          className={
            "mx-auto mt-8 flex max-w-xl items-center justify-center gap-3 rounded-2xl px-6 py-5 text-center"
          }
          style={{
            background:
              "linear-gradient(160deg, rgba(20,184,166,0.10) 0%, rgba(255,255,255,0) 70%)",
          }}
        >
          <span
            className={
              "grid size-9 shrink-0 place-items-center rounded-lg bg-cyan/10 text-cyan-ink"
            }
          >
            <LuUsers className={"size-4"} />
          </span>
          <p className={"text-sm leading-relaxed text-navy/60"}>
            <span className={"font-semibold text-navy"}>
              Relate World Clubs
            </span>{" "}
            — your club&rsquo;s group, always in your pocket between meetups.
          </p>
        </div>

        <figure
          className={
            "reveal mx-auto mt-16 max-w-4xl rounded-3xl px-8 py-12 text-center"
          }
          style={{
            background: "linear-gradient(150deg, #e7fbff 0%, #ffffff 70%)",
          }}
        >
          <span
            className={
              "mx-auto grid size-10 place-items-center rounded-xl bg-white text-cyan-ink shadow-sm"
            }
          >
            <LuBookOpen className={"size-5"} />
          </span>
          <p
            className={
              "mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-ink"
            }
          >
            Verse of the Day
          </p>
          <blockquote
            className={
              "mt-4 font-display text-2xl leading-snug tracking-tight text-navy md:text-3xl"
            }
          >
            &ldquo;Your word is a lamp to my feet and a light to my path.&rdquo;
          </blockquote>
          <figcaption className={"mt-4 text-sm font-medium text-navy/60"}>
            Psalm 119:105
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
