"use client";

import Image from "next/image";
import { LuLoaderCircle, LuShield, LuUsers } from "react-icons/lu";
import { useState, useRef, type MouseEvent } from "react";
import { useSports } from "@/lib/useSports";

type TeamMember = {
  name: string;
  role: string;
  description?: string;
  src?: string;
  email?: string;
  facebook?: string;
  instagram?: string;
};

type TeamGroup = {
  title: string;
  subtitle: string;
  members: TeamMember[];
  featured?: TeamMember;
};

/** Title of the group fed by the sports catalogue — loading and error show here. */
const SPORTS_GROUP = "Sports Director & Coaches";

const staticGroups: TeamGroup[] = [
  {
    title: "Presidency",
    subtitle: "Setting direction and holding the organisation to account",
    featured: {
      name: "Milton Kumirai",
      role: "1st President",
      description:
        "Sets the vision and leads the Presidency, partnerships and overall governance.",
      src: "/images/milton_kumirai.png",
      email: "mailto:milton@relateword.org",
    },
    members: [
      {
        name: "Constance Lowani",
        role: "2nd President",
        description:
          "Supports the President and coordinates leadership across every club.",
        email: "mailto:presidency@relateword.org",
      },
      {
        name: "Moses Fusi",
        role: "Chief Finance Officer",
        description:
          "Oversees budgets, financial controls and monthly reporting.",
        email: "mailto:finance@relateword.org",
      },
      {
        name: "Noma Moyo",
        role: "Finance Officer",
        description:
          "Handles day-to-day finance operations and keeps records accurate.",
        email: "mailto:finance@relateword.org",
      },
      {
        name: "Finance Officer",
        role: "Finance Officer",
        description:
          "Supports finance operations, reconciliations and reporting.",
        email: "mailto:finance@relateword.org",
      },
      {
        name: "Talayiwa Ngwenya",
        role: "Secretary",
        description: "Manages records, correspondence and meeting minutes.",
        email: "mailto:secretary@relateword.org",
      },
      {
        name: "Doreen Moyo",
        role: "Secretary",
        description: "Coordinates schedules, records and member communication.",
        email: "mailto:secretary@relateword.org",
      },
      {
        name: "Sipho Ncube",
        role: "Secretary",
        description: "Keeps meetings organised and maintains official records.",
        email: "mailto:secretary@relateword.org",
      },
    ],
  },
  {
    title: "Directors",
    subtitle: "Leading each club and its weekly programs",
    members: [
      {
        name: "Sprout Director",
        role: "Children 6–16 · weekly clubs",
        description:
          "Leads weekly clubs and programmes for children aged 6–16.",
      },
      {
        name: "Surge Director",
        role: "Young youth 17–21 · meetups",
        description:
          "Guides meetups, mentoring and activities for youth aged 17–21.",
      },
      {
        name: "Pulse Director",
        role: "Youth 21–33 · networking",
        description: "Leads networking and community for youth aged 21–33.",
      },
      {
        name: "Prime Director",
        role: "Singles 33+ · peer circles",
        description:
          "Runs peer circles and support for singles aged 33 and over.",
      },
      {
        name: "Anchor Director",
        role: "Single parents · support groups",
        description:
          "Coordinates support groups and resources for single parents.",
      },
      {
        name: "Spark Director",
        role: "Newly married 0–5 yrs · gatherings",
        description: "Hosts gatherings and guidance for newly married couples.",
      },
      {
        name: "Synergy Director",
        role: "Married 6+ yrs · retreats & mentoring",
        description:
          "Organises retreats and mentoring for couples married 6+ years.",
      },
      {
        name: "Education Director",
        role: "Schools & learning programmes",
        description:
          "Oversees schools, learning programmes and educational support.",
      },
    ],
  },
  {
    title: "Career & Economic Pathways",
    subtitle: "Building pathways from need to independence",
    members: [
      {
        name: "Career and Pathways Officer",
        role: "Department Head / Executive Board Member",
        description:
          "Leads the department's strategy, partnerships and board work.",
      },
      {
        name: "Deputy Pathways Officer",
        role: "Vice-Head",
        description: "Supports the head and coordinates day-to-day operations.",
      },
      {
        name: "Departmental Secretary & Registrar",
        role: "Records, scheduling and candidate database",
        description:
          "Maintains records, scheduling and the candidate database.",
      },
      {
        name: "Corporate & Small Business Recruiter",
        role: "White-Collar & Retail Lead",
        description:
          "Connects candidates with white-collar and retail opportunities.",
      },
      {
        name: "Trade & Technical Outreach Specialist",
        role: "Blue-Collar & Contracting Lead",
        description:
          "Builds pathways into trade, technical and contracting work.",
      },
      {
        name: "Workplace Readiness & CV Specialist",
        role: "Candidate Preparation Lead",
        description:
          "Prepares candidates with CVs, interviews and workplace skills.",
      },
    ],
  },
];

function MemberCard({
  member,
  featured = false,
}: {
  member: TeamMember;
  featured?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const element = cardRef.current;
    if (!element) return;
    const bounds = element.getBoundingClientRect();
    setPosition({ x: e.clientX - bounds.left, y: e.clientY - bounds.top });
  };

  const initials = member.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className={`stagger-item group relative h-full min-h-[13rem] w-full overflow-hidden rounded-xl border border-line bg-white p-0.5 shadow-sm transition-shadow duration-300 hover:shadow-lg sm:min-h-[21rem] ${
        featured ? "shadow-md" : ""
      }`}
    >
      {visible && (
        <div
          aria-hidden
          className="pointer-events-none absolute z-0 size-60 rounded-full bg-gradient-to-r from-cyan-light via-sky to-gold-300 opacity-80 blur-xl transition-opacity duration-300"
          style={{ top: position.y - 120, left: position.x - 120 }}
        />
      )}

      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center rounded-[10px] bg-white p-3 text-center sm:p-6">
        <div className="mb-2 size-16 overflow-hidden rounded-full shadow-md ring-4 ring-white transition-transform duration-300 group-hover:scale-105 sm:mb-4 sm:size-28">
          {member.src ? (
            <Image
              src={member.src}
              alt={member.name}
              width={320}
              height={320}
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-gradient-to-br from-navy to-blue text-2xl font-black text-white sm:text-3xl">
              {initials}
            </div>
          )}
        </div>

        <h4 className="text-sm font-semibold leading-snug text-navy sm:text-lg">
          {member.name}
        </h4>
        <p className="mt-1 text-xs text-blue sm:text-sm">{member.role}</p>

        {member.description && (
          <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-slate-gray sm:line-clamp-none sm:px-1 sm:text-xs">
            {member.description}
          </p>
        )}

        <div className="mt-2 flex items-center justify-center gap-3 text-blue sm:mt-4 sm:gap-4">
          <a
            href={member.email ?? "#"}
            aria-label={`Email ${member.name}`}
            className="transition hover:-translate-y-0.5 hover:text-cyan-ink"
          >
            <svg
              className="size-5 sm:size-6"
              viewBox="0 0 512 512"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48L48 64zM0 176L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-208L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
            </svg>
          </a>
          <a
            href={member.facebook ?? "#"}
            target="_blank"
            rel="noreferrer"
            aria-label={`${member.name} on Facebook`}
            className="transition hover:-translate-y-0.5 hover:text-cyan-ink"
          >
            <svg
              className="size-5 sm:size-6"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.266h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
            </svg>
          </a>
          <a
            href={member.instagram ?? "#"}
            target="_blank"
            rel="noreferrer"
            aria-label={`${member.name} on Instagram`}
            className="transition hover:-translate-y-0.5 hover:text-cyan-ink"
          >
            <svg
              className="size-5 sm:size-6"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Team() {
  const [showAll, setShowAll] = useState(false);
  const { sports, loading, error } = useSports();

  // The sports group is whatever the catalogue says it is: loading, failed
  // and published-nothing each get their own message instead of a blank row.
  const sportsStatus = loading
    ? "loading"
    : error
      ? "error"
      : sports && sports.teams.length > 0
        ? "ready"
        : "empty";

  const sportsGroup: TeamGroup = {
    title: SPORTS_GROUP,
    subtitle: "Leading every Relate team — Sprout, Surge and Pulse squads",
    featured: sports?.director.name
      ? {
          name: sports.director.name,
          role: sports.director.role,
          description:
            "Leads the sports programme and supports every Relate squad.",
        }
      : undefined,
    members: sports
      ? sports.teams.map((team) => ({
          name:
            sports.getSquad(team.id)?.coach.name ?? `${team.initials} Coach`,
          role: `Head Coach · ${team.name}`,
          description: `Coaches the ${team.name} squad and leads weekly training.`,
        }))
      : [],
  };

  const groups = [...staticGroups, sportsGroup];

  return (
    <section className={"reveal bg-white px-4 py-16 md:py-24"}>
      <div className={"mx-auto max-w-5xl"}>
        <div className={"mb-12 text-center md:mb-16"}>
          <h4 className={"text-blue font-medium mb-3"}>OUR TEAM</h4>
          <h2 className={"text-3xl md:text-4xl font-semibold text-navy"}>
            Meet the Relate <br className={"hidden sm:block"} />
            Family
          </h2>
        </div>
        {groups.map((group) => {
          const icon =
            group.title === "Presidency" ? (
              <LuShield className={"text-blue text-3xl"} />
            ) : (
              <LuUsers className={"text-blue text-3xl"} />
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
                    "text-2xl md:text-3xl font-bold text-navy flex items-center justify-center gap-3"
                  }
                >
                  {icon} {group.title}
                </h3>
                <p className={"text-slate-gray mt-2"}>{group.subtitle}</p>
              </div>

              {group.title === SPORTS_GROUP && sportsStatus !== "ready" ? (
                <div
                  className={
                    "rounded-2xl border border-dashed border-line bg-canvas p-6 text-center text-sm text-slate-gray"
                  }
                >
                  {sportsStatus === "loading" ? (
                    <span className={"inline-flex items-center gap-2"}>
                      <LuLoaderCircle className={"animate-spin"} /> Loading the
                      sports teams…
                    </span>
                  ) : sportsStatus === "error" ? (
                    "The sports teams could not be loaded right now — reload the page to try again."
                  ) : (
                    "No teams published yet."
                  )}
                </div>
              ) : (
                <>
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
                      "reveal reveal-stagger grid grid-cols-2 items-stretch gap-3 md:grid-cols-3 md:gap-4"
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
                          "px-6 py-3 min-h-11 rounded-lg btn-signin text-white font-medium text-sm hover:brightness-95 transition-colors"
                        }
                      >
                        {showAll
                          ? "Show Less"
                          : `Show More (${group.members.length - 6} more)`}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
