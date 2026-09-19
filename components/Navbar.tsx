"use client";

import { Roboto } from "next/font/google";
import { FaFacebook, FaInstagramSquare } from "react-icons/fa";
import { LuMenu, LuX, LuChevronDown } from "react-icons/lu";
import { FaGraduationCap } from "react-icons/fa6";
import Link from "next/link";
import { useState } from "react";
import UserAvatar from "./UserAvatar";

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
    items: [
      { link: "Footsteps", path: "/footsteps" },
      { link: "Rooted", path: "/rooted" },
    ],
  },
  {
    link: "Reading Plans",
    items: [
      { link: "News", path: "/news" },
      { link: "Teachers", path: "/teachers" },
      { link: "Contact", path: "/contact" },
      { link: "FAQ", path: "/faq" },
      { link: "Fees", path: "/fees" },
      { link: "Lost & Found", path: "/lost-found" },
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

  return (
    <section
      className={
        overlay
          ? "absolute inset-x-0 top-0 z-30 pt-3 sm:pt-4 lg:pt-5"
          : undefined
      }
      style={
        overlay
          ? undefined
          : {
              background:
                "linear-gradient(90deg, var(--club-chrome-dark), var(--club-chrome))",
            }
      }
    >
      <div
        className={
          "max-w-6xl mx-auto px-4 md:px-0 flex items-center justify-between gap-4"
        }
      >
        <Link
          href={"/"}
          className={"text-white flex items-center gap-2 py-3 md:py-4"}
        >
          <FaGraduationCap
            className={
              "text-4xl md:text-5xl text-[color:var(--club-accent)] self-center"
            }
          />
          <div>
            <h1
              className={`text-2xl md:text-3xl font-semibold ${roboto.className} leading-5`}
            >
              Relate
            </h1>
            <p className={"text-xs md:text-sm text-white/70"}>World</p>
          </div>
        </Link>
        <nav className={"hidden lg:block"}>
          <ul
            className={
              "flex items-center gap-3 xl:gap-5 py-3 text-white whitespace-nowrap"
            }
          >
            <li>
              <Link
                href={"/"}
                className={
                  "block text-sm xl:text-base hover:text-[color:var(--club-accent)] transition-colors"
                }
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href={"/about"}
                className={
                  "block text-sm xl:text-base hover:text-[color:var(--club-accent)] transition-colors"
                }
              >
                About
              </Link>
            </li>
            {navGroups.map((group) => (
              <li key={group.link} className={"relative group"}>
                <span
                  className={
                    "flex items-center gap-1 text-sm xl:text-base hover:text-[color:var(--club-accent)] transition-colors cursor-default"
                  }
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
                className={`block text-sm xl:text-base hover:text-[color:var(--club-accent)] transition-colors`}
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
            className={"lg:hidden text-white p-2"}
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
              <div>
                <h1
                  className={`text-2xl font-semibold ${roboto.className} leading-5`}
                >
                  RelateWorld
                </h1>
                <p className={"text-xs text-gray-50"}>Primary School</p>
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
