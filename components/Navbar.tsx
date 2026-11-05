"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LuMenu, LuX, LuChevronDown } from "react-icons/lu";
import JoinCta from "@/components/join/JoinCta";
import UserAvatar from "./UserAvatar";
import { useClubs } from "@/lib/useClubs";

type NavItem = { link: string; path: string };
type NavGroup = { link: string; short: string; items: NavItem[] };

const navGroups: NavGroup[] = [
  {
    link: "About",
    short: "About",
    items: [
      { link: "About Relate", path: "/about" },
      { link: "Our Team", path: "/team" },
    ],
  },
  {
    link: "Sports",
    short: "Sports",
    items: [
      { link: "Sports", path: "/sports" },
      { link: "Join a Team", path: "/join" },
      { link: "My Membership", path: "/membership" },
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
      { link: "Spark", path: "/spark" },
      { link: "Synergy", path: "/synergy" },
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
    ],
  },
  {
    link: "Members",
    short: "Members",
    items: [
      { link: "Smart Saver", path: "/savings" },
      { link: "My Profile", path: "/profile" },
    ],
  },
  {
    link: "Serve",
    short: "Serve",
    items: [
      { link: "Services", path: "/services" },
      { link: "Volunteer Offices", path: "/offices" },
    ],
  },
];

const panelId = (name: string) =>
  `nav-panel-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

export default function Navbar({ overlay = false }: { overlay?: boolean }) {
  const { clubs, subClubs, loading } = useClubs();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {},
  );
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const groups: NavGroup[] = loading
    ? navGroups
    : [
        ...navGroups.slice(0, 3),
        {
          link: "Season Guides",
          short: "Guides",
          items: [...clubs.filter((c) => c.slug !== "sprout"), ...subClubs].map(
            (c) => ({ link: `${c.name} S.G`, path: `/magazines/${c.slug}` }),
          ),
        },
        ...navGroups.slice(3),
      ];

  const toggleGroup = (name: string) => {
    setExpandedGroups((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  useEffect(() => {
    if (!menuOpen) return;

    const previous = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        return;
      }
      if (event.key !== "Tab" || !menuRef.current) return;

      const focusable = Array.from(
        menuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((node) => node.offsetParent !== null);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previous?.focus?.();
    };
  }, [menuOpen]);

  const hoverText = overlay ? "hover:text-cyan-light" : "hover:text-cyan-dark";
  const triggerShadow = overlay
    ? { textShadow: "0 1px 8px rgba(21,31,58,0.6)" }
    : undefined;

  return (
    <header
      className={
        overlay
          ? "absolute inset-x-0 top-0 z-30 pt-0 sm:mb-30"
          : "relative z-40 bg-white border-b border-gray-100"
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
          aria-label="Relate World home"
          className={`${overlay ? "text-white" : "text-navy"} flex items-center gap-2 py-3 md:py-4`}
        >
          <Image
            src={"/images/relate-world-logo.png"}
            alt=""
            width={500}
            height={500}
            priority
            className={"relative h-14 md:h-20 w-auto object-contain self-center"}
          />
        </Link>
        <nav aria-label="Main" className={"hidden lg:block"}>
          <ul
            className={`flex items-center gap-3 xl:gap-5 py-3 ${overlay ? "text-white" : "text-navy"} whitespace-nowrap`}
          >
            <li>
              <Link
                href={"/"}
                aria-current={pathname === "/" ? "page" : undefined}
                className={`inline-flex min-h-11 items-center text-[13px] ${hoverText} transition-colors`}
                style={triggerShadow}
              >
                Home
              </Link>
            </li>
            {groups.map((group) => {
              const id = panelId(group.link);
              const expanded = openGroup === group.link;
              return (
                <li
                  key={group.link}
                  className={"relative"}
                  onMouseEnter={() => setOpenGroup(group.link)}
                  onMouseLeave={() => setOpenGroup(null)}
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) {
                      setOpenGroup(null);
                    }
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") {
                      setOpenGroup(null);
                      event.currentTarget
                        .querySelector<HTMLButtonElement>("button")
                        ?.focus();
                    }
                  }}
                >
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={id}
                    onClick={() => setOpenGroup(expanded ? null : group.link)}
                    onFocus={() => setOpenGroup(group.link)}
                    className={`inline-flex min-h-11 items-center gap-1 text-[13px] ${hoverText} transition-colors`}
                    style={triggerShadow}
                  >
                    {group.link}
                    <LuChevronDown
                      aria-hidden
                      className={`text-xs mt-0.5 transition-transform ${expanded ? "rotate-180" : ""}`}
                    />
                  </button>
                  <div
                    id={id}
                    className={`absolute top-full left-0 pt-2 transition-all duration-200 ${
                      expanded
                        ? "visible opacity-100"
                        : "invisible opacity-0"
                    }`}
                  >
                    <div
                      className={
                        "bg-white rounded-lg shadow-xl border border-gray-100 py-2 min-w-44"
                      }
                    >
                      {group.items.map((item) =>
                        item.path === "/join" ? (
                          <JoinCta
                            key={item.path}
                            href={item.path}
                            memberLabel={null}
                            onClick={() => setOpenGroup(null)}
                            className={
                              "flex min-h-11 items-center px-4 py-2 text-[13px] text-gray-700 hover:bg-alice-blue hover:text-cyan-ink transition-colors"
                            }
                          >
                            {item.link}
                          </JoinCta>
                        ) : (
                          <Link
                            key={item.path}
                            href={item.path}
                            aria-current={
                              pathname === item.path ? "page" : undefined
                            }
                            onClick={() => setOpenGroup(null)}
                            className={
                              "flex min-h-11 items-center px-4 py-2 text-[13px] text-gray-700 hover:bg-alice-blue hover:text-cyan-ink transition-colors"
                            }
                          >
                            {item.link}
                          </Link>
                        ),
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
            <li>
              <Link
                href={"/store"}
                aria-current={pathname === "/store" ? "page" : undefined}
                className={`inline-flex min-h-11 items-center text-[13px] ${hoverText} transition-colors`}
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
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className={`lg:hidden ${overlay ? "text-white" : "text-navy"} grid size-11 place-items-center ${
              overlay ? "drop-shadow-[0_1px_4px_rgba(21,31,58,0.6)]" : ""
            }`}
          >
            <LuMenu aria-hidden className={"text-3xl"} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          ref={menuRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className={
            "fixed inset-0 z-50 flex flex-col lg:hidden overflow-y-auto"
          }
          style={{ backgroundColor: "var(--club-chrome-dark)" }}
        >
          <div className={"flex items-center justify-between px-4 py-4"}>
            <Link
              href={"/"}
              aria-label="Relate World home"
              className={"text-gray-50 flex items-center gap-2"}
              onClick={() => setMenuOpen(false)}
            >
              <Image
                src={"/images/relate-world-logo.png"}
                alt=""
                width={500}
                height={500}
                className={"h-14 md:h-16 w-auto object-contain self-center"}
              />
            </Link>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className={"grid size-11 place-items-center text-white"}
            >
              <LuX aria-hidden className={"text-3xl"} />
            </button>
          </div>

          <nav aria-label="Mobile" className={"flex-1 overflow-y-auto px-6 py-6"}>
            <div className={"max-w-md mx-auto w-full flex flex-col gap-0.5"}>
              <Link
                href={"/"}
                aria-current={pathname === "/" ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
                className={
                  "flex min-h-11 items-center py-2 text-[13px] font-normal text-white/95 hover:text-cyan-light transition-colors"
                }
              >
                Home
              </Link>
              {groups.map((group) => {
                const id = `mobile-${panelId(group.link)}`;
                const expanded = Boolean(expandedGroups[group.link]);
                return (
                  <div key={group.link} className={"border-b border-white/10"}>
                    <button
                      type="button"
                      onClick={() => toggleGroup(group.link)}
                      aria-expanded={expanded}
                      aria-controls={id}
                      className={
                        "w-full min-h-11 flex items-center justify-between gap-2 py-2.5 text-[13px] font-normal text-white/95 hover:text-cyan-light transition-colors"
                      }
                    >
                      {group.short}
                      <LuChevronDown
                        aria-hidden
                        className={`text-base shrink-0 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                      />
                    </button>
                    {expanded && (
                      <div id={id} className={"flex flex-col gap-1 pb-3"}>
                        {group.items.map((item) =>
                          item.path === "/join" ? (
                            <JoinCta
                              key={item.path}
                              href={item.path}
                              memberLabel={null}
                              onClick={() => setMenuOpen(false)}
                              className={
                                "flex min-h-11 items-center border-l-2 border-white/20 pl-4 py-1.5 text-[13px] text-white/75 hover:border-cyan-light hover:text-white transition-colors"
                              }
                            >
                              {item.link}
                            </JoinCta>
                          ) : (
                            <Link
                              key={item.path}
                              href={item.path}
                              aria-current={
                                pathname === item.path ? "page" : undefined
                              }
                              onClick={() => setMenuOpen(false)}
                              className={
                                "flex min-h-11 items-center border-l-2 border-white/20 pl-4 py-1.5 text-[13px] text-white/75 hover:border-cyan-light hover:text-white transition-colors"
                              }
                            >
                              {item.link}
                            </Link>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              <Link
                href={"/store"}
                aria-current={pathname === "/store" ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
                className={
                  "flex min-h-11 items-center py-2 text-[13px] font-normal text-white/95 hover:text-cyan-light transition-colors"
                }
              >
                Store
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
