import Link from "next/link";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import {
  LuCalendarDays,
  LuMapPin,
  LuUsers,
  LuWallet,
  LuTent,
} from "react-icons/lu";

import PageHero from "@/components/PageHero";
import JoinCta from "@/components/join/JoinCta";
import CampRegisterForm from "@/components/sprout/CampRegisterForm";
import { getClub } from "@/constants/relate";
import { SPROUT_CAMP } from "@/constants/sproutCamp";
import { clipText, siteMetadata, SITE_NAME, SITE_URL } from "@/lib/seo";

export function generateMetadata(): Metadata {
  const title = `${SPROUT_CAMP.title} · ${SPROUT_CAMP.dateLabel}`;
  const description = clipText(SPROUT_CAMP.description);
  return siteMetadata(
    {
      title,
      description,
      openGraph: {
        type: "website",
        url: `${SITE_URL}/sprout/sprout-camp`,
        siteName: SITE_NAME,
        title,
        description,
      },
    },
    "/sprout/sprout-camp",
  );
}

function formatDeadline(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-ZA", { day: "numeric", month: "long" });
}

export default function SproutCampPage() {
  const camp = SPROUT_CAMP;
  const sprout = getClub("sprout")!;
  const deadline = formatDeadline(camp.registrationDeadline);
  const clubVars = {
    "--club-accent": sprout.color,
    "--club-accent-dark": sprout.colorDark,
  } as CSSProperties;

  return (
    <div style={clubVars}>
      <PageHero
        style={clubVars}
        title={camp.title}
        mobileTitle="Camp"
        tagline={camp.tagline}
        description={camp.description}
        watermark="Camp"
        bgImage={camp.image}
        actions={
          <>
            <Link
              href={"#register"}
              className={
                "inline-flex items-center gap-2 bg-white text-navy px-6 py-3 rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors"
              }
            >
              Register for camp →
            </Link>
            <Link
              href={`/${sprout.slug}#programs`}
              className={
                "inline-flex items-center gap-2 border border-white/30 bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-lg font-semibold text-sm hover:border-white/60 hover:bg-white/20 transition-colors"
              }
            >
              All Sprout programs
            </Link>
          </>
        }
        meta={[
          { label: "Dates", value: camp.dateLabel },
          { label: "Ages", value: camp.ageRange },
          { label: "Fee", value: camp.fee },
          { label: "Places", value: String(camp.capacity) },
        ]}
        metaEnd={
          <Link
            href={"/sprout/honors"}
            className={
              "inline-flex items-center gap-2 font-medium text-white hover:text-cyan-light transition-colors"
            }
          >
            <span className={"text-[11px] uppercase tracking-widest text-white/50"}>
              Earn
            </span>
            Sprout honors →
          </Link>
        }
      />

      <section className={"flex-1 px-4 py-12 bg-white"}>
        <div className={"max-w-6xl mx-auto"}>
          {/* At a glance */}
          <div className={"grid grid-cols-2 lg:grid-cols-4 gap-3 mb-12"}>
            {[
              { icon: <LuCalendarDays />, label: "When", value: camp.dateLabel },
              { icon: <LuMapPin />, label: "Where", value: camp.location },
              { icon: <LuWallet />, label: "Fee", value: camp.fee },
              {
                icon: <LuUsers />,
                label: "Registration closes",
                value: deadline,
              },
            ].map((item) => (
              <div
                key={item.label}
                className={"rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"}
              >
                <span className={"text-cyan text-lg"} aria-hidden={"true"}>
                  {item.icon}
                </span>
                <p
                  className={
                    "mt-2 text-[11px] uppercase tracking-widest text-gray-400"
                  }
                >
                  {item.label}
                </p>
                <p className={"font-semibold text-navy text-sm leading-snug"}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Highlights */}
          <div className={"mb-14"}>
            <span
              className={
                "text-xs uppercase tracking-widest text-(--club-accent) font-medium"
              }
            >
              What camp is about
            </span>
            <h2 className={"text-2xl md:text-3xl font-semibold text-gray-800 mt-1 mb-6"}>
              Four days built around belonging
            </h2>
            <div className={"grid grid-cols-1 sm:grid-cols-2 gap-5"}>
              {camp.highlights.map((h) => (
                <div
                  key={h.title}
                  className={
                    "rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                  }
                >
                  <span
                    className={"mb-3 block size-10 rounded-full"}
                    style={{ backgroundColor: sprout.color }}
                    aria-hidden={"true"}
                  />
                  <h3 className={"font-bold text-navy text-lg"}>{h.title}</h3>
                  <p className={"mt-1.5 text-sm text-gray-500 leading-relaxed"}>
                    {h.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Itinerary */}
          <div id={"itinerary"} className={"mb-14 scroll-mt-6"}>
            <span
              className={
                "text-xs uppercase tracking-widest text-(--club-accent) font-medium"
              }
            >
              Day by day
            </span>
            <h2 className={"text-2xl md:text-3xl font-semibold text-gray-800 mt-1 mb-2"}>
              The itinerary
            </h2>
            <p className={"text-gray-500 text-sm max-w-xl mb-6"}>
              Times are a guide — leaders flex around weather, energy and the
              campfire mood.
            </p>

            <div className={"grid grid-cols-1 md:grid-cols-2 gap-5"}>
              {camp.itinerary.map((day) => (
                <div
                  key={day.id}
                  className={
                    "rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                  }
                >
                  <div className={"flex items-baseline justify-between gap-3 mb-4"}>
                    <div>
                      <span
                        className={
                          "text-[11px] uppercase tracking-widest font-semibold"
                        }
                        style={{ color: sprout.colorDark }}
                      >
                        {day.day} · {day.date}
                      </span>
                      <h3 className={"text-lg font-bold text-navy leading-snug"}>
                        {day.title}
                      </h3>
                    </div>
                    <LuTent
                      className={"text-xl shrink-0"}
                      style={{ color: sprout.color }}
                      aria-hidden={"true"}
                    />
                  </div>
                  <ul className={"space-y-3"}>
                    {day.slots.map((slot) => (
                      <li
                        key={`${day.id}-${slot.time}-${slot.title}`}
                        className={"flex gap-4 border-t border-gray-100 pt-3"}
                      >
                        <span
                          className={
                            "w-14 shrink-0 text-xs font-bold text-gray-400 pt-0.5"
                          }
                        >
                          {slot.time}
                        </span>
                        <span className={"min-w-0"}>
                          <span className={"block text-sm font-semibold text-navy"}>
                            {slot.title}
                          </span>
                          {slot.detail && (
                            <span className={"block text-sm text-gray-500 leading-snug"}>
                              {slot.detail}
                            </span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Included + packing */}
          <div className={"mb-14 grid grid-cols-1 md:grid-cols-2 gap-5"}>
            <div
              className={"rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"}
            >
              <h3 className={"text-lg font-bold text-navy mb-1"}>
                What {camp.fee} covers
              </h3>
              <p className={"text-sm text-gray-500 mb-4"}>{camp.feeNote}</p>
              <ul className={"space-y-2.5"}>
                {camp.includes.map((item) => (
                  <li
                    key={item}
                    className={"flex gap-2.5 text-sm text-gray-700 leading-relaxed"}
                  >
                    <span
                      className={"mt-1.5 size-2 shrink-0 rounded-full"}
                      style={{ backgroundColor: sprout.color }}
                      aria-hidden={"true"}
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <p className={"mt-5 rounded-lg bg-alice-blue border border-cyan/20 px-4 py-3 text-sm text-gray-700"}>
                {camp.deposit}.
              </p>
            </div>

            <div
              className={"rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"}
            >
              <h3 className={"text-lg font-bold text-navy mb-4"}>
                Pack this list
              </h3>
              <ul className={"space-y-2.5"}>
                {camp.bring.map((item) => (
                  <li
                    key={item}
                    className={"flex gap-2.5 text-sm text-gray-700 leading-relaxed"}
                  >
                    <span
                      className={"mt-1.5 size-2 shrink-0 rounded-full"}
                      style={{ backgroundColor: sprout.colorDark }}
                      aria-hidden={"true"}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* FAQ */}
          <div className={"mb-14"}>
            <span
              className={
                "text-xs uppercase tracking-widest text-(--club-accent) font-medium"
              }
            >
              Parents ask
            </span>
            <h2 className={"text-2xl md:text-3xl font-semibold text-gray-800 mt-1 mb-6"}>
              Camp FAQ
            </h2>
            <div className={"border-t border-gray-200"}>
              {camp.faq.map((item) => (
                <details
                  key={item.q}
                  className={"group border-b border-gray-200 py-4"}
                >
                  <summary
                    className={
                      "flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-semibold text-navy marker:hidden"
                    }
                  >
                    {item.q}
                    <span
                      className={
                        "text-cyan text-xl transition-transform group-open:rotate-45"
                      }
                      aria-hidden={"true"}
                    >
                      +
                    </span>
                  </summary>
                  <p className={"mt-2.5 text-sm text-gray-600 leading-relaxed max-w-3xl"}>
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>

          {/* Register */}
          <div id={"register"} className={"scroll-mt-6"}>
            <div className={"mb-6"}>
              <span
                className={
                  "text-xs uppercase tracking-widest text-(--club-accent) font-medium"
                }
              >
                Registration
              </span>
              <h2 className={"text-2xl md:text-3xl font-semibold text-gray-800 mt-1 mb-2"}>
                Hold your camper&apos;s place
              </h2>
              <p className={"text-gray-500 text-sm max-w-xl"}>
                Two minutes, one form. A camp leader confirms by WhatsApp
                before {deadline}.
              </p>
            </div>

            <div className={"grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 items-start"}>
              <CampRegisterForm
                campSlug={camp.slug}
                edition={camp.edition}
                fee={camp.fee}
                deadlineLabel={deadline}
              />

              <aside
                className={
                  "rounded-2xl border border-gray-200 bg-alice-blue/60 p-6"
                }
              >
                <h3 className={"font-bold text-navy mb-4"}>Before you register</h3>
                <dl className={"space-y-4 text-sm"}>
                  {[
                    { label: "Camp dates", value: camp.dateLabel },
                    { label: "Location", value: camp.location },
                    { label: "Ages", value: camp.ageRange },
                    { label: "Fee", value: `${camp.fee} · ${camp.deposit}` },
                    { label: "Registration closes", value: deadline },
                    { label: "Places", value: `${camp.capacity} campers` },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className={
                        "flex items-baseline justify-between gap-4 border-b border-white/70 pb-3 last:border-0 last:pb-0"
                      }
                    >
                      <dt className={"text-slate-gray"}>{row.label}</dt>
                      <dd className={"font-semibold text-navy text-right"}>
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className={"mt-6 flex flex-col gap-3"}>
                  <JoinCta
                    href={`/join?club=${sprout.slug}`}
                    className={
                      "inline-flex items-center justify-center gap-2 bg-navy text-white px-5 py-3 rounded-lg font-semibold text-sm hover:bg-navy/90 transition-colors"
                    }
                  >
                    Not a Sprout member yet? Join first
                  </JoinCta>
                  <Link
                    href={"/sprout/honors"}
                    className={
                      "inline-flex items-center justify-center gap-2 border border-gray-300 text-navy px-5 py-3 rounded-lg font-semibold text-sm hover:border-cyan hover:text-cyan-dark transition-colors"
                    }
                  >
                    Honors they can earn at camp →
                  </Link>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
