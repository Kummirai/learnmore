"use client";

import {
  LuMapPin,
  LuPhone,
  LuMail,
  LuClock,
  LuArrowRight,
} from "react-icons/lu";
import { buildContactMailto } from "@/lib/contact-mailto";

export default function Contact() {
  const details = [
    {
      icon: <LuMapPin className={"text-2xl text-cyan-ink"} />,
      label: "Address",
      value: "123 Education Street, Learning City, 2000",
    },
    {
      icon: <LuPhone className={"text-2xl text-cyan-ink"} />,
      label: "Phone",
      value: "+27 78 267 7436",
    },
    {
      icon: <LuMail className={"text-2xl text-cyan-ink"} />,
      label: "Email",
      value: "info@relateworld.org",
    },
    {
      icon: <LuClock className={"text-2xl text-cyan-ink"} />,
      label: "Club Times",
      value: "Weekly meetups · Saturdays & evenings",
    },
  ];

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const subject = String(data.get("subject") || "").trim();
    const message = String(data.get("message") || "").trim();
    if (!name || !email || !message) return;
    window.location.href = buildContactMailto(name, email, subject, message);
  };

  return (
    <section className={"reveal bg-white px-4 py-24 md:py-36"}>
      <div className={"max-w-6xl mx-auto"}>
        <div className={"mb-12 max-w-2xl md:mb-16"}>
          <p
            className={
              "mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-navy/70"
            }
          >
            Get in touch
          </p>
          <h2 className={"text-3xl md:text-4xl font-semibold text-navy"}>
            We&apos;d love to hear from you
          </h2>
          <p className={"mt-4 text-lg text-navy/70"}>
            Want to join a club, ask for help in a hard season, or partner with
            us to fund lasting change? Reach out — someone will walk with you.
          </p>
        </div>
        <div className={"grid grid-cols-1 lg:grid-cols-2 gap-10 items-start"}>
          <div className={"grid grid-cols-1 sm:grid-cols-2 gap-4"}>
            {details.map((d, i) => (
              <div
                key={i}
                className={
                  "bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-3"
                }
              >
                <div className={"mt-0.5 shrink-0"}>{d.icon}</div>
                <div>
                  <div className={"text-sm text-gray-500"}>{d.label}</div>
                  <div className={"font-medium text-navy"}>{d.value}</div>
                </div>
              </div>
            ))}
          </div>
          <div className={"bg-white rounded-xl border border-gray-200 p-8"}>
            <h3 className={"text-xl font-semibold text-navy mb-4"}>
              Say Hello
            </h3>
            <form className={"space-y-4"} onSubmit={onSubmit}>
              <div className={"grid grid-cols-1 sm:grid-cols-2 gap-4"}>
                <div>
                  <label htmlFor={"contact-name"} className={"block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1.5"}>
                    Your Name
                  </label>
                  <input
                    id={"contact-name"}
                    name={"name"}
                    type="text"
                    placeholder="Your Name"
                    required
                    autoComplete="name"
                    className={
                      "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-base md:text-sm outline-none focus:ring-2 focus:ring-cyan/20 focus:border-cyan"
                    }
                  />
                </div>
                <div>
                  <label htmlFor={"contact-email"} className={"block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1.5"}>
                    Your Email
                  </label>
                  <input
                    id={"contact-email"}
                    name={"email"}
                    type="email"
                    placeholder="Your Email"
                    required
                    autoComplete="email"
                    spellCheck={false}
                    autoCapitalize="none"
                    className={
                      "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-base md:text-sm outline-none focus:ring-2 focus:ring-cyan/20 focus:border-cyan"
                    }
                  />
                </div>
              </div>
              <div>
                <label htmlFor={"contact-subject"} className={"block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1.5"}>
                  Subject
                </label>
                <input
                  id={"contact-subject"}
                  name={"subject"}
                  type="text"
                  placeholder="Subject"
                  className={
                    "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-base md:text-sm outline-none focus:ring-2 focus:ring-cyan/20 focus:border-cyan"
                  }
                />
              </div>
              <div>
                <label htmlFor={"contact-message"} className={"block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1.5"}>
                  Your Message
                </label>
                <textarea
                  id={"contact-message"}
                  name={"message"}
                  rows={4}
                  placeholder="Your Message"
                  required
                  className={
                    "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-base md:text-sm outline-none focus:ring-2 focus:ring-cyan/20 focus:border-cyan"
                  }
                />
              </div>
              <button
                type="submit"
                className={
                  "btn-pill btn-brand cursor-pointer sm:w-auto"
                }
              >
                Send via Email <LuArrowRight />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
