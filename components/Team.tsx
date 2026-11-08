"use client";

import Image from "next/image";
import Link from "next/link";
import {
  LuArrowRight,
  LuBriefcase,
  LuCheck,
  LuHandHeart,
  LuLoaderCircle,
  LuMapPin,
  LuShield,
  LuUsers,
} from "react-icons/lu";
import { useState } from "react";
import { useSports } from "@/lib/useSports";

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

/** Title of the group fed by the sports catalogue — loading and error show here. */
const SPORTS_GROUP = "Sports Director & Coaches";

const staticGroups: TeamGroup[] = [
  {
    title: "Presidency",
    subtitle: "Setting direction and holding the organisation to account",
    featured: {
      name: "Milton Kumirai",
      role: "1st President",
      src: "/images/milton_kumirai.png",
    },
    members: [
      { name: "Constance Lowani", role: "2nd President" },
      { name: "Moses Fusi", role: "Chief Finance Officer" },
      { name: "Talayiwa Ngwenya", role: "Secretary" },
      { name: "Anacleta Ncube", role: "Finance Officer" },
    ],
  },
  {
    title: "Directors",
    subtitle: "Leading each club and its weekly programs",
    members: [
      { name: "Sprout Director", role: "Children 6–16 · weekly clubs" },
      { name: "Surge Director", role: "Young youth 17–21 · meetups" },
      { name: "Pulse Director", role: "Youth 21–33 · networking" },
      { name: "Prime Director", role: "Singles 33+ · peer circles" },
      { name: "Anchor Director", role: "Single parents · support groups" },
      { name: "Spark Director", role: "Newly married 0–5 yrs · gatherings" },
      { name: "Synergy Director", role: "Married 6+ yrs · retreats & mentoring" },
      { name: "Education Director", role: "Schools & learning programmes" },
    ],
  },
];

type PathwaysRole = {
  title: string;
  subtitle: string;
  summary: string;
  responsibilities: string[];
};

const pathwaysRoles: PathwaysRole[] = [
  {
    title: "Career and Pathways Officer",
    subtitle: "Department Head / Executive Board Member",
    summary:
      "Leads the department and represents it on the Relate World Executive Board.",
    responsibilities: [
      "Set the department's strategy, seasonal placement targets and budget.",
      "Build corporate partnerships, apprenticeships and employer agreements.",
      "Lead the six-member committee and report to the board quarterly.",
      "Protect Relate World's zero-license, self-reliance model in every placement.",
    ],
  },
  {
    title: "Deputy Pathways Officer",
    subtitle: "Vice-Head",
    summary:
      "Runs the department's day-to-day operations and keeps the committee moving.",
    responsibilities: [
      "Translate strategy into daily workflows and clear role assignments.",
      "Run weekly syncs, track quotas and keep the placement pipeline moving.",
      "Step in for the Head and maintain continuity across seasons.",
      "Resolve employer and candidate inquiries with urgency.",
    ],
  },
  {
    title: "Departmental Secretary & Registrar",
    subtitle: "Records, scheduling and candidate database",
    summary:
      "Keeps the records, schedule and Job Seekers Database in order.",
    responsibilities: [
      "Maintain the Job Seekers Database and track every candidate's progress.",
      "Record minutes, decisions and action items for every meeting.",
      "Schedule interview prep, check-ins and employer follow-ups.",
      "Compile placement and activity metrics for seasonal appraisals.",
    ],
  },
  {
    title: "Corporate & Small Business Recruiter",
    subtitle: "White-Collar & Retail Lead",
    summary:
      "Opens doors with employers for office, retail and customer-facing roles.",
    responsibilities: [
      "Recruit opportunities in retail, office, admin, customer service and commercial roles.",
      "Build relationships with shopping centres, corporates, supermarkets and local businesses.",
      "Monitor job boards and employer portals daily.",
      "Create a steady pipeline of HR contacts and business owners.",
    ],
  },
  {
    title: "Trade & Technical Outreach Specialist",
    subtitle: "Blue-Collar & Contracting Lead",
    summary:
      "Connects skilled and willing workers with trade, technical and contracting work.",
    responsibilities: [
      "Build employer networks across electrical, construction, automotive, transport and logistics.",
      "Open apprenticeships, entry-level roles and seasonal contract work.",
      "Work with contractors, sites, workshops and fleet operators.",
      "Match candidates to short-term project work that can grow into permanent roles.",
    ],
  },
  {
    title: "Workplace Readiness & CV Specialist",
    subtitle: "Candidate Preparation Lead",
    summary:
      "Prepares candidates to walk into an interview ready to be hired.",
    responsibilities: [
      "Partner with Stream 5 (Relate Digital Services) to produce ATS-compliant CVs.",
      "Run mock interviews and practical workplace readiness sessions.",
      "Coach on dress, etiquette, communication and confidence.",
      "Debrief after interviews and turn feedback into the next step.",
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
  const initials = member.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  return (
    <div
      className={`stagger-item hover-lift group flex h-full flex-col rounded-xl border bg-white p-4 text-center shadow-sm sm:p-8
            ${featured ? "border-blue shadow-md" : "border-line"}`}
    >
      <div
        className={
          "size-20 sm:size-36 md:size-40 mx-auto rounded-full overflow-hidden mb-3 sm:mb-5 ring-4 ring-white shadow-lg group-hover:scale-105 transition-transform duration-300"
        }
      >
        {member.src ? (
          <Image
            src={member.src}
            alt={member.name}
            width={320}
            height={320}
            className={"size-full object-cover"}
          />
        ) : (
          <div
            className={
              "size-full flex items-center justify-center bg-gradient-to-br from-navy to-blue text-white text-2xl sm:text-4xl font-black"
            }
          >
            {initials}
          </div>
        )}
      </div>
      <h4 className={"text-sm sm:text-xl font-semibold text-navy leading-snug"}>
        {member.name}
      </h4>
      <p className={"text-blue text-xs sm:text-sm mb-0 sm:mb-3 flex-1"}>
        {member.role}
      </p>
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
      ? { name: sports.director.name, role: sports.director.role }
      : undefined,
    members: sports
      ? sports.teams.map((team) => ({
          name: sports.getSquad(team.id)?.coach.name ?? `${team.initials} Coach`,
          role: `Head Coach · ${team.name}`,
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
                          "px-6 py-3 min-h-11 rounded-lg bg-navy text-white font-medium text-sm hover:bg-navy-dark transition-colors"
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

        <div
          id={"career-pathways"}
          className={"mt-16 border-t border-line pt-14 md:mt-24 md:pt-20"}
        >
          <div className={"mx-auto max-w-3xl text-center"}>
            <span
              className={
                "inline-flex items-center gap-2 rounded-full bg-alice-blue px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-ink"
              }
            >
              <LuBriefcase className={"text-sm"} /> New department
            </span>
            <h2
              className={
                "mt-4 text-3xl font-semibold text-navy md:text-4xl"
              }
            >
              Career &amp; Economic Pathways
            </h2>
            <p className={"mt-3 text-slate-gray"}>
              Relate World is a community of engaged partners dedicated to
              strengthening youth governance, skills training and community
              development. Across our six clubs — Sprout, Surge, Pause, Prime,
              Spark and Synergy — we build character, resilience and practical
              life skills. This department turns that reach into real work:
              employer partnerships, job placements, apprenticeships and
              workplace readiness.
            </p>
          </div>

          <div className={"mt-6 flex flex-wrap justify-center gap-2"}>
            {[
              {
                icon: <LuMapPin />,
                label: "Johannesburg, South Africa",
              },
              {
                icon: <LuUsers />,
                label: "Board / volunteer leadership & committee roles",
              },
              {
                icon: <LuShield />,
                label: "Reports to the Executive Board",
              },
            ].map((item) => (
              <span
                key={item.label}
                className={
                  "inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-medium text-slate-gray"
                }
              >
                <span className={"text-cyan-ink"}>{item.icon}</span>
                {item.label}
              </span>
            ))}
          </div>

          <div
            className={
              "mx-auto mt-8 max-w-3xl rounded-2xl border border-gold-200 bg-gold-50 p-5 text-center"
            }
          >
            <p
              className={
                "text-[11px] font-bold uppercase tracking-[0.18em] text-gold-700"
              }
            >
              Guiding principle
            </p>
            <p className={"mt-1 font-semibold text-navy"}>
              Compassionate Empowerment
            </p>
            <p className={"mt-1 text-sm text-slate-gray"}>
              “Help today that doesn&rsquo;t become a need for help tomorrow.”
            </p>
          </div>

          <div className={"mx-auto mt-10 max-w-3xl text-center"}>
            <p className={"text-sm leading-relaxed text-slate-gray"}>
              Unemployment and financial dependence remain two of the biggest
              barriers facing our community. These founding roles exist to move
              people from receiving help to earning a living — with dignity,
              skills and a pathway to independence. A structured six-member
              committee connects Relate World&rsquo;s community reach to real
              economic opportunities: employer partnerships, placements,
              apprenticeships and candidate preparation.
            </p>
          </div>

          <div
            className={
              "reveal reveal-stagger mt-8 grid items-stretch gap-4 md:grid-cols-2"
            }
          >
            {pathwaysRoles.map((role, index) => (
              <article
                key={role.title}
                className={
                  "stagger-item hover-lift flex h-full flex-col rounded-2xl border border-line bg-white p-5 text-left shadow-sm sm:p-6"
                }
              >
                <div className={"flex items-start gap-3"}>
                  <span
                    className={
                      "flex size-10 shrink-0 items-center justify-center rounded-xl bg-navy text-sm font-bold text-cyan"
                    }
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3
                      className={
                        "text-lg font-bold leading-snug text-navy"
                      }
                    >
                      {role.title}
                    </h3>
                    <p
                      className={
                        "mt-0.5 text-xs font-semibold uppercase tracking-wide text-cyan-ink"
                      }
                    >
                      {role.subtitle}
                    </p>
                  </div>
                </div>
                <p className={"mt-3 text-sm leading-relaxed text-slate-gray"}>
                  {role.summary}
                </p>
                <p
                  className={
                    "mt-4 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-gray"
                  }
                >
                  Key responsibilities
                </p>
                <ul className={"mt-2 space-y-2"}>
                  {role.responsibilities.map((item) => (
                    <li
                      key={item}
                      className={
                        "flex gap-2 text-sm leading-relaxed text-gray-700"
                      }
                    >
                      <LuCheck className={"mt-0.5 shrink-0 text-cyan-ink"} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div
            className={
              "mx-auto mt-10 max-w-4xl rounded-2xl bg-navy p-6 text-center text-white md:p-8"
            }
          >
            <h3 className={"text-xl font-semibold md:text-2xl"}>
              Help build a pathway from need to independence.
            </h3>
            <p
              className={
                "mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-white/70"
              }
            >
              We are forming the founding committee. If one of these roles fits
              your experience, start the conversation — no CV is needed to
              express interest.
            </p>
            <div className={"mt-5 flex flex-wrap justify-center gap-3"}>
              <a
                href={`https://wa.me/27782677436?text=${encodeURIComponent(
                  "Hi Relate World! I'd like to express interest in the Career and Economic Pathways Department.",
                )}`}
                target={"_blank"}
                rel={"noreferrer"}
                className={"btn-pill btn-brand"}
              >
                <LuHandHeart /> Express interest
              </a>
              <Link href={"/offices"} className={"btn-pill btn-outline-light"}>
                Volunteer offices <LuArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
