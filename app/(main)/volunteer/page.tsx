import type {Metadata} from "next"
import Link from "next/link"
import PageHero from "@/components/PageHero"
import {
    LuArrowRight,
    LuCalendarCheck,
    LuTrophy,
    LuBookOpen,
    LuHeart,
    LuUsers,
    LuMegaphone,
    LuWrench,
    LuSchool,
    LuHandHeart,
} from "react-icons/lu"
import type {IconType} from "react-icons"

export const metadata: Metadata = {
    title: "Volunteer",
    description:
        "Ways to serve at Relate — club facilitation, sports coaching, content, prayer, community groups, media and outreach.",
    alternates: {canonical: "/volunteer"},
}

type Role = {
    title: string
    commitment: string
    icon: IconType
    body: string
    fits: string
}

type Category = {
    heading: string
    blurb: string
    roles: Role[]
}

const categories: Category[] = [
    {
        heading: "Clubs & Programmes",
        blurb:
            "Our clubs meet weekly across every age and life stage. Everything else starts here.",
        roles: [
            {
                title: "Club Facilitator",
                commitment: "Weekly · 2 hrs",
                icon: LuUsers,
                body: "Lead one weekly club session — welcome, run the programme, and help people connect. Seven clubs run each week across Sprout, Surge, Pulse, Prime, Anchor, Base and Nexus.",
                fits: "Anyone who enjoys facilitating a group",
            },
            {
                title: "Children's Club Helper",
                commitment: "Weekly · 2 hrs",
                icon: LuHandHeart,
                body: "Support the Sprout Kids, Tweens and Teens sessions — games, crafts, music and stories, with safeguarding always observed.",
                fits: "Parents, guardians and youth workers",
            },
            {
                title: "Club Welcome Host",
                commitment: "Monthly · 1 hr",
                icon: LuHeart,
                body: "Be the first friendly face for new arrivals, help them settle in, and point them to the right small group for their age.",
                fits: "Warm, outgoing people",
            },
        ],
    },
    {
        heading: "Sports",
        blurb:
            "Fifteen squads compete across football, netball and volleyball. Sport is a major entry point.",
        roles: [
            {
                title: "Head Coach",
                commitment: "Weekly practice",
                icon: LuTrophy,
                body: "Coach one squad through training and match days. Fifteen squads are in operation, so there is room to join an existing team or start a new one.",
                fits: "Qualified or experienced players",
            },
            {
                title: "Team Manager",
                commitment: "2–3 hrs weekly",
                icon: LuCalendarCheck,
                body: "Handle registration, kit, attendance and communication for a squad so the coach can focus on the team.",
                fits: "Organised administrators",
            },
            {
                title: "Fixture & Results Admin",
                commitment: "Few hours monthly",
                icon: LuCalendarCheck,
                body: "Keep the season calendar accurate — scheduling fixtures, recording results and updating league tables on the site.",
                fits: "Detail-minded people who like systems",
            },
        ],
    },
    {
        heading: "Content & Learning",
        blurb:
            "Our season guides and reading plans are written and edited by volunteers.",
        roles: [
            {
                title: "Season Guide Editor",
                commitment: "Seasonal · 4–6 hrs/week",
                icon: LuBookOpen,
                body: "Shape each club's season guide — daily readings, discussion questions and reflections. One guide is produced per club per season.",
                fits: "Writers, teachers and Bible students",
            },
            {
                title: "Reading Plan Curator",
                commitment: "3–4 hrs monthly",
                icon: LuBookOpen,
                body: "Research and maintain the reading library across Bible reading, relationships, wellness, academic and finance.",
                fits: "Researchers and content planners",
            },
            {
                title: "Education Volunteer",
                commitment: "Termly",
                icon: LuSchool,
                body: "Support our education work — school grants, learner support and curriculum guidance, working alongside the Education Director.",
                fits: "Teachers and education professionals",
            },
        ],
    },
    {
        heading: "Prayer & Community",
        blurb:
            "Prayer and community groups run all year, online and in person.",
        roles: [
            {
                title: "Prayer & Intercession Team",
                commitment: "Weekly · flexible",
                icon: LuHeart,
                body: "Intercede for the church, our clubs, our families and the requests people bring us through the prayer line.",
                fits: "Anyone who enjoys praying for others",
            },
            {
                title: "Prayer Request Response",
                commitment: "A few hours weekly",
                icon: LuHeart,
                body: "Read incoming prayer requests and community requests, and reply with care and a listening ear.",
                fits: "Compassionate, careful writers",
            },
            {
                title: "Community Group Host",
                commitment: "Monthly · 2 hrs",
                icon: LuUsers,
                body: "Host an ongoing small group — in person or online — built around shared interests, support and genuine connection.",
                fits: "People who enjoy hosting",
            },
        ],
    },
    {
        heading: "Media, Tech & Operations",
        blurb:
            "The work behind the work — how the site, our teams and our events actually run.",
        roles: [
            {
                title: "Photography & Design",
                commitment: "Event-based",
                icon: LuMegaphone,
                body: "Capture club nights, sports days and community events, and design the artwork that carries our brand.",
                fits: "Photographers and graphic designers",
            },
            {
                title: "Social Media & Communications",
                commitment: "4–5 hrs weekly",
                icon: LuMegaphone,
                body: "Tell the stories of what is happening across our clubs and teams — announcements, recaps and highlights.",
                fits: "Writers comfortable on social platforms",
            },
            {
                title: "Website & IT Support",
                commitment: "Ad hoc",
                icon: LuWrench,
                body: "Keep the site, the mobile app and our member accounts healthy — bug reports, content fixes and new features.",
                fits: "Developers and tech-savvy volunteers",
            },
            {
                title: "Events & Logistics",
                commitment: "Event-based",
                icon: LuCalendarCheck,
                body: "Plan venues, equipment, transport and setup for club meets, sports days, retreats and socials.",
                fits: "Calm, practical problem-solvers",
            },
        ],
    },
]

const steps = [
    {
        title: "Choose what suits you",
        body: "Pick the area you want to serve in. Most roles need a couple of hours a week, and none of them require prior experience.",
    },
    {
        title: "Talk to us",
        body: "Tell us a little about yourself and what you are interested in. We will match you with the right director and give you a proper induction.",
    },
    {
        title: "Start serving",
        body: "You will be paired with an experienced volunteer, supported by your club director, and prayed for every step of the way.",
    },
]

export default function VolunteerPage() {
    return (
        <>
            <PageHero
                title="Volunteer"
                mobileTitle="Volunteer"
                tagline="Everyone here is a volunteer"
                description="Relate runs on people like you. Pick the part of the work you would like to carry, tell us when you can, and we will find you a place."
                watermark="Serve"
                navbar={false}
            />

            <section className={"flex-1 px-4 py-14"}>
                <div className={"max-w-5xl mx-auto space-y-14"}>
                    {categories.map((cat) => (
                        <div key={cat.heading}>
                            <div className={"mb-6"}>
                                <h2 className={"text-2xl md:text-3xl font-black tracking-tight text-navy"}>
                                    {cat.heading}
                                </h2>
                                <p className={"text-slate-gray text-sm mt-1.5 max-w-2xl"}>
                                    {cat.blurb}
                                </p>
                            </div>
                            <div className={"grid grid-cols-1 md:grid-cols-2 gap-4"}>
                                {cat.roles.map((role) => {
                                    const Icon = role.icon
                                    return (
                                        <div key={role.title}
                                             className={"bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col"}>
                                            <div className={"flex items-start gap-4 mb-3"}>
                                                <span className={"grid size-11 shrink-0 place-items-center rounded-xl bg-alice-blue text-cyan-dark"}>
                                                    <Icon className={"text-xl"}/>
                                                </span>
                                                <div className={"min-w-0"}>
                                                    <h3 className={"font-bold text-navy leading-snug"}>
                                                        {role.title}
                                                    </h3>
                                                    <p className={"text-[11px] font-semibold uppercase tracking-widest text-cyan-dark mt-0.5"}>
                                                        {role.commitment}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className={"text-gray-600 text-sm leading-relaxed flex-1"}>
                                                {role.body}
                                            </p>
                                            <p className={"mt-3 text-xs text-gray-400 border-t border-gray-100 pt-3"}>
                                                <span className={"font-semibold text-slate-gray"}>Suits: </span>
                                                {role.fits}
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className={"bg-white px-4 py-16 border-t border-gray-100"}>
                <div className={"max-w-5xl mx-auto"}>
                    <h2 className={"text-2xl md:text-3xl font-black tracking-tight text-navy text-center mb-2"}>
                        How to get started
                    </h2>
                    <p className={"text-slate-gray text-sm text-center mb-10 max-w-lg mx-auto"}>
                        Three steps, and you are serving.
                    </p>
                    <ol className={"grid grid-cols-1 md:grid-cols-3 gap-4 list-none p-0 m-0 mb-12"}>
                        {steps.map((step, i) => (
                            <li key={step.title}
                                className={"bg-alice-blue/40 rounded-2xl p-6 relative"}>
                                <span className={"grid size-8 place-items-center rounded-full bg-cyan text-navy font-black text-sm mb-3"}>
                                    {i + 1}
                                </span>
                                <h3 className={"font-bold text-navy mb-1.5"}>{step.title}</h3>
                                <p className={"text-gray-600 text-sm leading-relaxed"}>{step.body}</p>
                            </li>
                        ))}
                    </ol>
                    <div className={"text-center"}>
                        <Link href={"/contact"}
                              className={
                                  "inline-flex items-center gap-2 bg-navy text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-navy-soft transition-colors"
                              }>
                            Get in touch <LuArrowRight/>
                        </Link>
                        <p className={"text-gray-400 text-xs mt-3"}>
                            Positions listed here are illustrative — tell us what you can do and we
                            will find you a place.
                        </p>
                    </div>
                </div>
            </section>
        </>
    )
}
