"use client";

import Link from "next/link";
import { Roboto } from "next/font/google";
import { FaFacebook, FaInstagramSquare, FaTwitter } from "react-icons/fa";
import {
  LuMapPin,
  LuPhone,
  LuMail,
  LuClock,
  LuCircleCheck,
  LuCircleAlert,
} from "react-icons/lu";
import { useActionState } from "react";
import { subscribeNewsletter } from "@/app/(main)/newsletter/actions";

const roboto = Roboto({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Footer() {
  const [state, formAction, pending] = useActionState(
    subscribeNewsletter,
    null,
  );

  return (
    <footer
      className={"text-ice-blue px-4"}
      style={{
        background:
          "linear-gradient(180deg, var(--club-chrome), var(--club-chrome-dark))",
      }}
    >
      <div
        className={"h-1"}
        style={{ backgroundColor: "var(--club-accent)" }}
      />
      <div className={"max-w-6xl mx-auto py-16"}>
        <div
          className={"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"}
        >
          <div>
            <img
              src={"/images/relate-world-logo.png"}
              alt={"Relate World"}
              width={500}
              height={500}
              className={"h-14 md:h-16 w-auto object-contain self-start mb-4"}
            />
            <p className={"text-sm leading-relaxed mb-4"}>
              Skills, social and spiritual growth — all in one community. Free
              clubs for every age and season of life.
            </p>
            <div className={"flex items-center gap-1"}>
              <Link
                href={"#"}
                aria-label={"Facebook"}
                className={
                  "grid size-11 place-items-center hover:text-[color:var(--club-accent)] transition-colors"
                }
              >
                <FaFacebook />
              </Link>
              <Link
                href={"#"}
                aria-label={"Twitter"}
                className={
                  "grid size-11 place-items-center hover:text-[color:var(--club-accent)] transition-colors"
                }
              >
                <FaTwitter />
              </Link>
              <Link
                href={"#"}
                aria-label={"Instagram"}
                className={
                  "grid size-11 place-items-center hover:text-[color:var(--club-accent)] transition-colors"
                }
              >
                <FaInstagramSquare />
              </Link>
            </div>
          </div>
          <div>
            <h4 className={"text-white font-semibold mb-4"}>Quick Links</h4>
            <ul className={"space-y-2 text-sm"}>
              {[
                { label: "About Us", path: "/about" },
                { label: "Our Clubs", path: "/sprout" },
                { label: "Our Team", path: "/team" },
                { label: "Store", path: "/store" },
                { label: "FAQ", path: "/faq" },
                { label: "Contact", path: "/contact" },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.path}
                    className={
                      "py-2.5 min-h-11 flex items-center hover:text-[color:var(--club-accent)] transition-colors"
                    }
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className={"text-white font-semibold mb-4"}>Contact Info</h4>
            <ul className={"space-y-3 text-sm"}>
              <li className={"flex items-start gap-2"}>
                <LuMapPin
                  className={"mt-1 shrink-0 text-[color:var(--club-accent)]"}
                />
                <span>123 Education Street, Learning City, 2000</span>
              </li>
              <li className={"flex items-center gap-2"}>
                <LuPhone
                  className={"shrink-0 text-[color:var(--club-accent)]"}
                />
                <span>+27 78 267 7436</span>
              </li>
              <li className={"flex items-center gap-2"}>
                <LuMail
                  className={"shrink-0 text-[color:var(--club-accent)]"}
                />
                <span>info@RelateWorld.edu</span>
              </li>
              <li className={"flex items-start gap-2"}>
                <LuClock
                  className={"mt-1 shrink-0 text-[color:var(--club-accent)]"}
                />
                <span>Weekly club meetups · Saturdays & evenings</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className={"text-white font-semibold mb-4"}>Newsletter</h4>
            <p className={"text-sm leading-relaxed mb-4"}>
              Season updates, new reading guides and community news — straight
              to your inbox.
            </p>
            {state?.success ? (
              <div
                aria-live={"polite"}
                className={"flex items-start gap-2 text-sm text-cyan-light"}
              >
                <LuCircleCheck className={"mt-0.5 shrink-0"} />
                <span>{state.message}</span>
              </div>
            ) : (
              <form action={formAction} className={"flex"}>
                <input
                  type="email"
                  name={"email"}
                  placeholder="Your Email"
                  required
                  autoComplete="email"
                  spellCheck={false}
                  autoCapitalize="none"
                  className={
                    "bg-navy-soft text-base md:text-sm px-4 py-3 w-full outline-none focus:ring-1 focus:ring-[color:var(--club-accent)] text-white placeholder:text-cyan-light/60"
                  }
                />
                <button
                  type={"submit"}
                  disabled={pending}
                  className={
                    "bg-[color:var(--club-accent)] text-[color:var(--club-on-accent)] px-4 py-3 text-sm font-medium hover:bg-[color:var(--club-accent-dark)] disabled:opacity-60 transition-colors shrink-0"
                  }
                >
                  {pending ? "..." : "Subscribe"}
                </button>
              </form>
            )}
            {state?.message && !state.success && (
              <div
                aria-live={"polite"}
                className={"flex items-start gap-2 text-sm text-red-400 mt-2"}
              >
                <LuCircleAlert className={"mt-0.5 shrink-0"} />
                <span>{state.message}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={"border-t border-navy-soft py-6 text-center text-sm"}>
        <p>
          &copy; {new Date().getFullYear()} Relate. All
          rights reserved.
        </p>
      </div>
    </footer>
  );
}
