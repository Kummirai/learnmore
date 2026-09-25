"use client";

import { FaFacebook, FaInstagramSquare } from "react-icons/fa";
import { LuMenu, LuX, LuChevronDown } from "react-icons/lu";
import Link from "next/link";
import { useState } from "react";
import UserAvatar from "./UserAvatar";
import { CLUBS, SUB_CLUBS } from "@/constants/relate";

type NavItem = { link: string; path: string };
type NavGroup = { link: string; short: string; items: NavItem[] };

const navGroups: NavGroup[] = [
  {
    link: "Events & Sports",
    short: "Events",
    items: [
      { link: "Events", path: "/events" },
      { link: "Club Events", path: "/events/clubs" },
      { link: "Sports", path: "/sports" },
      { link: "Join a Team", path: "/join" },
    ],
  },
  {
    link: "Clubs",
    short: "Clubs",
    items: [
      { link: "Sprout", path: "/sprout" },
      { link: "Surge", path: "/surge" },
      { link: "Pulse", path: "/pulse" },
      { link: "Prime", path: "/prime" },
      { link: "Anchor", path: "/anchor" },
      { link: "Base", path: "/base" },
      { link: "Nexus", path: "/nexus" },
    ],
  },
  {
    link: "Season Guides",
    short: "Guides",
    items: [...CLUBS.filter((c) => c.slug !== "sprout"), ...SUB_CLUBS].map(
      (c) => ({
        link: `${c.name} S.G`,
        path: `/magazines/${c.slug}`,
      }),
    ),
  },
  {
    link: "Reading Plans",
    short: "Plans",
    items: [
      { link: "All Reading Plans", path: "/plans" },
      { link: "Bible Reading", path: "/plans#bible-reading" },
      {
        link: "Marriage & Relationships",
        path: "/plans#marriage-relationships",
      },
      { link: "Emotional Wellness", path: "/plans#emotional-wellness" },
      { link: "Finance & Stewardship", path: "/plans#finance-stewardship" },
      { link: "Academic", path: "/plans#academic" },
    ],
  },
  {
    link: "Bible Quiz",
    short: "Quiz",
    items: [
      { link: "Play the Quiz", path: "/bible-quiz/play" },
      { link: "Season Overview", path: "/bible-quiz" },
      { link: "Sprout Board", path: "/bible-quiz#sprout" },
      { link: "Surge Board", path: "/bible-quiz#surge" },
      { link: "Pulse Board", path: "/bible-quiz#pulse" },
      { link: "Prime Board", path: "/bible-quiz#prime" },
      { link: "Anchor Board", path: "/bible-quiz#anchor" },
      { link: "Quiz in the App", path: "/#download" },
    ],
  },
  {
    link: "Prayer & Requests",
    short: "Prayer",
    items: [
      { link: "Prayer Requests", path: "/prayer-requests" },
      { link: "Requests", path: "/requests" },
      { link: "Today's Prayer Times", path: "/prayer" },
      { link: "My Prayer Streak", path: "/profile#streaks" },
      { link: "Read & Pray Plans", path: "/plans" },
    ],
  },
];

const flatLinks = [
  { link: "Home", path: "/" },
  { link: "About", path: "/about" },
  { link: "Store", path: "/store" },
  ...navGroups.flatMap((g) => g.items),
];

export default function Navbar({ overlay = false }: { overlay?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {},
  );

  const toggleGroup = (name: string) => {
    setExpandedGroups((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  // Hover accent per variant: bright cyan on dark heroes, darker cyan for contrast on white.
  const hoverText = overlay ? "hover:text-cyan-light" : "hover:text-cyan-dark";
  // Kept off the dropdown panels (white bg) — only the triggers that sit over the hero.
  const triggerShadow = overlay
    ? { textShadow: "0 1px 8px rgba(21,31,58,0.6)" }
    : undefined;

  return (
    <section
      className={
        overlay
          ? "absolute inset-x-0 top-0 z-30 pt-0 sm:mb-30"
          : "bg-white border-b border-gray-100"
      }
    >
      {overlay && (
        <div
          aria-hidden={true}
          className={"pointer-events-none absolute inset-x-0 top-0 h-32 -z-10"}
          style={{
            background:
              "linear-gradient(180deg, rgba(21,31,58,0.65) 0%, rgba(21,31,58,0.25) 60%, transparent 100%)",
          }}
        />
      )}
      <div
        className={
          "max-w-6xl mx-auto px-4 md:px-0 flex items-center justify-between gap-4"
        }
      >
        <Link
          href={"/"}
          className={`${overlay ? "text-white" : "text-navy"} flex items-center gap-2 py-3 md:py-4`}
        >
          <img
            src={"/images/relate-world-logo.png"}
            alt={"Relate World"}
            width={500}
            height={500}
            className={`relative h-14 md:h-20 w-auto object-contain self-center`}
          />
        </Link>
        <nav className={"hidden lg:block"}>
          <ul
            className={`flex items-center gap-3 xl:gap-5 py-3 ${overlay ? "text-white" : "text-navy"} whitespace-nowrap`}
          >
            <li>
              <Link
                href={"/"}
                className={`block text-sm  ${hoverText} transition-colors`}
                style={triggerShadow}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href={"/about"}
                className={`block text-sm  ${hoverText} transition-colors`}
                style={triggerShadow}
              >
                About
              </Link>
            </li>
            {navGroups.map((group) => (
              <li key={group.link} className={"relative group"}>
                <span
                  className={`flex items-center gap-1 text-sm  ${hoverText} transition-colors cursor-default`}
                  style={triggerShadow}
                >
                  {group.link}
                  <LuChevronDown
                    className={
                      "text-xs mt-0.5 group-hover:rotate-180 transition-transform"
                    }
                  />
                </span>
                <div
                  className={
                    "absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                  }
                >
                  <div
                    className={
                      "bg-white rounded-lg shadow-xl border border-gray-100 py-2 min-w-44"
                    }
                  >
                    {group.items.map((item) => (
                      <Link
                        key={item.path}
                        href={item.path}
                        className={
                          "block px-4 py-2 text-sm text-gray-700 hover:bg-alice-blue hover:text-[color:var(--club-accent-dark)] transition-colors"
                        }
                      >
                        {item.link}
                      </Link>
                    ))}
                  </div>
                </div>
              </li>
            ))}
            <li>
              <Link
                href={"/store"}
                className={`block text-sm  ${hoverText} transition-colors`}
                style={triggerShadow}
              >
                Store
              </Link>
            </li>
          </ul>
        </nav>
        <div className={"flex items-center gap-3"}>
          <UserAvatar />
          <button
            onClick={() => setMenuOpen(true)}
            className={`lg:hidden ${overlay ? "text-white" : "text-navy"} p-2 ${
              overlay ? "drop-shadow-[0_1px_4px_rgba(21,31,58,0.6)]" : ""
            }`}
          >
            <LuMenu className={"text-3xl"} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          className={
            "fixed inset-0 z-50 flex flex-col lg:hidden overflow-y-auto"
          }
          style={{ backgroundColor: "var(--club-chrome-dark)" }}
        >
          <div className={"flex items-center justify-between px-4 py-4"}>
            <Link
              href={"/"}
              className={"text-gray-50 flex items-center gap-2"}
              onClick={() => setMenuOpen(false)}
            >
              <img
                src={"/images/relate-world-logo.png"}
                alt={"Relate World"}
                width={500}
                height={500}
                className={"h-14 md:h-16 w-auto object-contain self-center"}
              />
            </Link>
            <button
              onClick={() => setMenuOpen(false)}
              className={"text-white p-2"}
            >
              <LuX className={"text-3xl"} />
            </button>
          </div>

          <nav className={"flex-1 overflow-y-auto px-6 py-6"}>
            <div className={"max-w-md mx-auto w-full flex flex-col gap-0.5"}>
              <Link
                href={"/"}
                onClick={() => setMenuOpen(false)}
                className={
                  "py-2 text-[14px] font-normal text-white/95 hover:text-[color:var(--club-accent)] transition-colors"
                }
              >
                Home
              </Link>
              <Link
                href={"/about"}
                onClick={() => setMenuOpen(false)}
                className={
                  "py-2 text-[14px] font-normal text-white/95 hover:text-[color:var(--club-accent)] transition-colors"
                }
              >
                About
              </Link>
              {navGroups.map((group) => (
                <div key={group.link} className={"border-b border-white/10"}>
                  <button
                    onClick={() => toggleGroup(group.link)}
                    className={
                      "w-full flex items-center justify-between gap-2 py-2.5 text-[14px] font-normal text-white/95 hover:text-[color:var(--club-accent)] transition-colors"
                    }
                  >
                    {group.short}
                    <LuChevronDown
                      className={`text-base shrink-0 transition-transform duration-200 ${expandedGroups[group.link] ? "rotate-180" : ""}`}
                    />
                  </button>
                  {expandedGroups[group.link] && (
                    <div className={"flex flex-col gap-1 pb-3"}>
                      {group.items.map((item) => (
                        <Link
                          key={item.path}
                          href={item.path}
                          onClick={() => setMenuOpen(false)}
                          className={
                            "border-l-2 border-white/20 pl-4 py-1.5 text-[13px] text-white/75 hover:border-[color:var(--club-accent)] hover:text-white transition-colors"
                          }
                        >
                          {item.link}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>

          <div
            className={"flex items-center justify-center gap-3 text-white pb-8"}
          >
            <FaFacebook className={"text-2xl"} />
            <FaInstagramSquare className={"text-2xl"} />
          </div>
        </div>
      )}
    </section>
  );
}
