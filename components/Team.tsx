"use client";

import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagramSquare } from "react-icons/fa";
import { LuShield, LuUsers } from "react-icons/lu";
import { useState } from "react";
import { SPORTS_TEAMS } from "@/constants/relate";
import { SQUADS, SPORTS_DIRECTOR } from "@/constants/squads";

type TeamMember = {
  name: string;
  role: string;
  src?: string;
};

type TeamGroup = {
  title: string;
  subtitle: string;
  members: TeamMember[];
  featured?: TeamMember;
};

const coachMembers: TeamMember[] = SPORTS_TEAMS.map((t) => ({
  name: SQUADS[t.id]?.coach.name ?? `${t.initials} Coach`,
  role: `Head Coach · ${t.name}`,
}));

const groups: TeamGroup[] = [
  {
    title: "Presidency",
    subtitle: "Setting direction and holding the organisation to account",
    featured: {
      name: "Milton Kumirai",
      role: "1st President",
      src: "/images/milton_kumirai.png",
    },
    members: [
      { name: "Moses Fusi", role: "2nd President" },
      { name: "Constance Lowani", role: "3rd President" },
      { name: "Talayiwa Ngwenya", role: "Secretary" },
      { name: "Anacleta Ncube", role: "Chief Finance Officer" },
    ],
  },
  {
    title: "Directors",
    subtitle: "Leading each club and its weekly programs",
    members: [
      { name: "Sprout Director", role: "Children 6–15 · weekly clubs" },
      { name: "Surge Director", role: "Young youth 16–21 · meetups" },
      { name: "Pulse Director", role: "Youth 21–33 · networking" },
      { name: "Prime Director", role: "Singles 33+ · peer circles" },
      { name: "Anchor Director", role: "Single parents · support groups" },
      { name: "Spark Director", role: "Newly married 0–5 yrs · gatherings" },
      { name: "Synergy Director", role: "Married 6+ yrs · retreats & mentoring" },
      { name: "Education Director", role: "Schools & learning programmes" },
    ],
  },
  {
    title: "Sports Director & Coaches",
    subtitle: "Leading every Relate team — Sprout, Surge and Pulse squads",
    featured: { name: SPORTS_DIRECTOR.name, role: SPORTS_DIRECTOR.role },
    members: coachMembers,
  },
];

function MemberCard({
  member,
  featured = false,
}: {
  member: TeamMember;
  featured?: boolean;
}) {
  const initials = member.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  return (
    <div
      className={`text-center group bg-white rounded-xl border p-4 sm:p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full
            ${featured ? "border-cyan shadow-md" : "border-gray-200"}`}
    >
      <div
        className={
          "size-20 sm:size-36 md:size-40 mx-auto rounded-full overflow-hidden mb-3 sm:mb-5 ring-4 ring-white shadow-lg group-hover:scale-105 transition-transform duration-300"
        }
      >
        {member.src ? (
          <img
            src={member.src}
            alt={member.name}
            className={"size-full object-cover"}
          />
        ) : (
          <div
            className={
              "size-full flex items-center justify-center bg-gradient-to-br from-navy to-cyan text-white text-2xl sm:text-4xl font-black"
            }
          >
            {initials}
          </div>
        )}
      </div>
      <h4 className={"text-sm sm:text-xl font-semibold text-gray-800 leading-snug"}>
        {member.name}
      </h4>
      <p className={"text-cyan text-xs sm:text-sm mb-0 sm:mb-3 flex-1"}>
        {member.role}
      </p>
      <div className={"hidden sm:flex items-center justify-center gap-1 text-gray-400"}>
        <Link
          href={"#"}
          aria-label={"Facebook"}
          className={
            "grid size-11 place-items-center hover:text-cyan transition-colors"
          }
        >
          <FaFacebook />
        </Link>
        <Link
          href={"#"}
          aria-label={"Twitter"}
          className={
            "grid size-11 place-items-center hover:text-cyan transition-colors"
          }
        >
          <FaTwitter />
        </Link>
        <Link
          href={"#"}
          aria-label={"Instagram"}
          className={
            "grid size-11 place-items-center hover:text-cyan transition-colors"
          }
        >
          <FaInstagramSquare />
        </Link>
      </div>
    </div>
  );
}

export default function Team() {
  const [showAll, setShowAll] = useState(false);

  return (
    <section className={"py-16 md:py-24 bg-white px-4"}>
      <div className={"max-w-5xl mx-auto"}>
        <div className={"text-center mb-12 md:mb-16"}>
          <h4 className={"text-cyan font-medium mb-3"}>OUR TEAM</h4>
          <h2 className={"text-3xl md:text-4xl font-semibold text-gray-800"}>
            Meet the Relate <br className={"hidden sm:block"} />
            Family
          </h2>
        </div>
        {groups.map((group) => {
          const icon =
            group.title === "Presidency" ? (
              <LuShield className={"text-cyan text-3xl"} />
            ) : (
              <LuUsers className={"text-cyan text-3xl"} />
            );
          const hasShowMore = group.members.length > 6;
          const visible =
            hasShowMore && !showAll ? group.members.slice(0, 6) : group.members;
          return (
            <div
              key={group.title}
              className={
                "py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-12 rounded-2xl mb-10 last:mb-0"
              }
            >
              <div className={"text-center mb-10"}>
                <h3
                  className={
                    "text-2xl md:text-3xl font-bold text-gray-800 flex items-center justify-center gap-3"
                  }
                >
                  {icon} {group.title}
                </h3>
                <p className={"text-gray-500 mt-2"}>{group.subtitle}</p>
              </div>

              {/* Featured member on its own row — original w-72 width, centered */}
              {group.featured && (
                <div className={"flex justify-center mb-6 sm:mb-8"}>
                  <div className={"w-full max-w-56 sm:max-w-72"}>
                    <MemberCard member={group.featured} featured />
                  </div>
                </div>
              )}

              {/* Two cards per row on mobile, three from md up */}
              <div
                className={
                  "grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 items-stretch"
                }
              >
                {visible.map((member, i) => (
                  <MemberCard key={i} member={member} />
                ))}
              </div>

              {hasShowMore && (
                <div className={"text-center mt-8"}>
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className={
                      "px-6 py-3 min-h-11 rounded-lg bg-navy text-white font-medium text-sm hover:bg-navy-dark transition-colors"
                    }
                  >
                    {showAll
                      ? "Show Less"
                      : `Show More (${group.members.length - 6} more)`}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
