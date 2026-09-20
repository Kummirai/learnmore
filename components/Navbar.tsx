"use client";

import { Roboto } from "next/font/google";
import { FaFacebook, FaInstagramSquare } from "react-icons/fa";
import { LuMenu, LuX, LuChevronDown } from "react-icons/lu";
import { FaGraduationCap } from "react-icons/fa6";
import Link from "next/link";
import { useState } from "react";
import UserAvatar from "./UserAvatar";
import { CLUBS, SUB_CLUBS } from "@/constants/relate";

const roboto = Roboto({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

type NavItem = { link: string; path: string };
type NavGroup = { link: string; items: NavItem[] };

const navGroups: NavGroup[] = [
  {
    link: "Clubs",
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
    link: "Magazines",
    items: [...CLUBS.filter((c) => c.slug !== "sprout"), ...SUB_CLUBS].map(
      (c) => ({
        link: `${c.name} Magazines`,
        path: `/magazines/${c.slug}`,
      }),
    ),
  },
  {
    link: "Reading Plans",
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

  return (
    <section
      className={
        overlay
          ? "absolute inset-x-0 top-0 z-30 pt-3 sm:pt-4 lg:pt-5"
          : "bg-white border-b border-gray-100"
      }
    >
      <div
        className={
          "max-w-6xl mx-auto px-4 md:px-0 flex items-center justify-between gap-4"
        }
      >
        <Link
          href={"/"}
          className={`${overlay ? "text-white" : "text-navy"} flex items-center gap-2 py-3 md:py-4`}
        >
          <FaGraduationCap
            className={
              "text-4xl md:text-5xl text-[color:var(--club-accent)] self-center"
            }
          />
          <div className="leading-none">
            <h1
              className={`text-[1.7rem] md:text-[2rem] font-extrabold ${roboto.className} tracking-tight leading-none`}
            >
              Relate
              <span className="text-[color:var(--club-accent)] font-black">
                World
              </span>
            </h1>
            <p
              className={`text-[9px] md:text-[10px] uppercase tracking-[0.35em] ${overlay ? "text-white/60" : "text-slate-gray"} mt-1.5`}
            >
              Grow · Belong · Become
            </p>
          </div>
        </Link>
        <nav className={"hidden lg:block"}>
          <ul
            className={`flex items-center gap-3 xl:gap-5 py-3 ${overlay ? "text-white" : "text-navy"} whitespace-nowrap`}
          >
            <li>
              <Link
                href={"/"}
                className={`block text-sm  ${hoverText} transition-colors`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href={"/about"}
                className={`block text-sm  ${hoverText} transition-colors`}
              >
                About
              </Link>
            </li>
            {navGroups.map((group) => (
              <li key={group.link} className={"relative group"}>
                <span
                  className={`flex items-center gap-1 text-sm  ${hoverText} transition-colors cursor-default`}
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
            className={`lg:hidden ${overlay ? "text-white" : "text-navy"} p-2`}
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
              <FaGraduationCap
                className={
                  "text-4xl text-[color:var(--club-accent)] self-center"
                }
              />
              <div className="leading-none">
                <h1
                  className={`text-2xl font-extrabold ${roboto.className} tracking-tight leading-none`}
                >
                  Relate
                  <span className="text-[color:var(--club-accent)] font-black">
                    World
                  </span>
                </h1>
                <p className="text-[9px] uppercase tracking-[0.35em] text-white/60 mt-1.5">
                  Grow · Belong · Become
                </p>
              </div>
            </Link>
            <button
              onClick={() => setMenuOpen(false)}
              className={"text-white p-2"}
            >
              <LuX className={"text-3xl"} />
            </button>
          </div>

          <nav
            className={
              "flex-1 flex flex-col items-center justify-center gap-5 py-8"
            }
          >
            <Link
              href={"/"}
              onClick={() => setMenuOpen(false)}
              className={
                "text-white text-2xl font-medium hover:text-[color:var(--club-accent)] transition-colors"
              }
            >
              Home
            </Link>
            <Link
              href={"/about"}
              onClick={() => setMenuOpen(false)}
              className={
                "text-white text-2xl font-medium hover:text-[color:var(--club-accent)] transition-colors"
              }
            >
              About
            </Link>
            {navGroups.map((group) => (
              <div key={group.link} className={"w-full max-w-xs"}>
                <button
                  onClick={() => toggleGroup(group.link)}
                  className={
                    "w-full flex items-center justify-center gap-2 text-white text-2xl font-medium hover:text-[color:var(--club-accent)] transition-colors"
                  }
                >
                  {group.link}
                  <LuChevronDown
                    className={`text-lg transition-transform duration-200 ${expandedGroups[group.link] ? "rotate-180" : ""}`}
                  />
                </button>
                {expandedGroups[group.link] && (
                  <div className={"flex flex-col items-center gap-3 mt-3"}>
                    {group.items.map((item) => (
                      <Link
                        key={item.path}
                        href={item.path}
                        onClick={() => setMenuOpen(false)}
                        className={
                          "text-white/80 text-lg hover:text-[color:var(--club-accent)] transition-colors"
                        }
                      >
                        {item.link}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link
              href={"/enroll"}
              onClick={() => setMenuOpen(false)}
              className={
                "mt-4 bg-[color:var(--club-accent)] text-[color:var(--club-on-accent)] px-10 py-3 text-lg font-semibold"
              }
            >
              Enroll with us
            </Link>
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
