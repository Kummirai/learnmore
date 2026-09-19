"use client"

import {FaFacebook, FaTwitter, FaInstagramSquare} from "react-icons/fa";
import {LuStar, LuBriefcase, LuBookOpen} from "react-icons/lu";
import {useState} from "react";

type TeamMember = {
    name: string
    role: string
    src: string
    subject: string
}

type TeamGroup = {
    title: string
    subtitle: string
    members?: TeamMember[]
}

const allTeachers: TeamMember[] = [
    {name: "Ms. Dlamini", role: "Mathematics (Gr 4-5)", src: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=200&h=200&fit=crop&crop=face", subject: "Mathematics"},
    {name: "Mr. Khumalo", role: "Mathematics (Gr 6-7)", src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face", subject: "Mathematics"},
    {name: "Mr. Botha", role: "English (Gr 4-7)", src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face", subject: "English & Literacy"},
    {name: "Ms. Peters", role: "Literacy Specialist", src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face", subject: "English & Literacy"},
    {name: "Ms. van der Merwe", role: "Afrikaans (Gr 4-7)", src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face", subject: "Afrikaans"},
    {name: "Ms. Nkosi", role: "Life Skills & Geography (Gr 4-7)", src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face", subject: "Life Skills & Social Sciences"},
    {name: "Mr. Naidoo", role: "Science & Computers (Gr 5-7)", src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face", subject: "Science & Technology"},
    {name: "Mr. Jacobs", role: "Creative Arts (Gr 4-7)", src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face", subject: "Creative Arts"},
    {name: "Coach Singh", role: "PE & Sports (Gr R-7)", src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face", subject: "Physical Education & Sport"},
    {name: "Ms. Ferreira", role: "Music & Choir (Gr R-7)", src: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=200&h=200&fit=crop&crop=face", subject: "Music & Choir"},
    {name: "Ms. Govender", role: "Librarian & Reading (Gr R-7)", src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face", subject: "Library & Reading"},
]

const subjects = Array.from(new Set(allTeachers.map(t => t.subject)))

const chipBase = "px-5 py-2 rounded-full text-base font-medium transition-colors"
const chipActive = "bg-navy text-white shadow-md"
const chipInactive = "bg-gray-100 text-gray-600 hover:bg-gray-200"

export default function Team() {
    const [activeSubject, setActiveSubject] = useState<string | null>(null)
    const [showAll, setShowAll] = useState(false)

    const filtered = activeSubject
        ? allTeachers.filter(t => t.subject === activeSubject)
        : allTeachers

    const visible = showAll ? filtered : filtered.slice(0, 6)

    const groups: TeamGroup[] = [
        {
            title: "Leadership",
            subtitle: "Guiding our school with vision and dedication",
            members: [
                {name: "Dr. Sarah Johnson", role: "Principal & Founder", src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face", subject: ""},
                {name: "Mr. Mark Williams", role: "Vice Principal", src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face", subject: ""},
            ]
        },
        {
            title: "Admin Staff",
            subtitle: "Keeping everything running smoothly behind the scenes",
            members: [
                {name: "Mrs. Linda Nel", role: "Administrative Assistant", src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face", subject: ""},
                {name: "Ms. Thandi Mokoena", role: "Finance & Admissions", src: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=200&h=200&fit=crop&crop=face", subject: ""},
                {name: "Mr. James Botha", role: "IT & Operations", src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face", subject: ""},
            ]
        },
    ]

    return (
        <section className={"py-16 md:py-24 bg-white px-4"}>
            <div className={"max-w-4xl mx-auto"}>
                <div className={"text-center mb-12 md:mb-16"}>
                    <h4 className={"text-cyan font-medium mb-3"}>OUR TEAM</h4>
                    <h2 className={"text-3xl md:text-4xl font-semibold text-gray-800"}>
                        Meet Our Dedicated <br className={"hidden sm:block"}/>
                        Educators
                    </h2>
                </div>
                {groups.map(group => {
                    const icon = group.title === "Leadership" ? <LuStar className={"text-amber-500 text-3xl"}/>
                        : <LuBriefcase className={"text-cyan text-3xl"}/>
                    return (
                    <div key={group.title} className={"py-12 md:py-16 px-6 md:px-12 rounded-2xl mb-10 last:mb-0"}>
                        <div className={"text-center mb-10"}>
                            <h3 className={"text-2xl md:text-3xl font-bold text-gray-800 flex items-center justify-center gap-3"}>
                                {icon} {group.title}
                            </h3>
                            <p className={"text-gray-500 mt-2"}>{group.subtitle}</p>
                        </div>
                        <div className={"flex flex-wrap justify-center gap-8"}>
                            {group.members?.map((member, i) => (
                                <div key={i} className={"text-center group w-72 bg-white rounded-xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow"}>
                                    <div
                                        className={"size-36 sm:size-40 mx-auto rounded-full overflow-hidden mb-5 ring-4 ring-white shadow-lg group-hover:scale-105 transition-transform duration-300"}>
                                        <img src={member.src} alt={member.name}
                                             className={"size-full object-cover"}/>
                                    </div>
                                    <h4 className={"text-xl font-semibold text-gray-800"}>{member.name}</h4>
                                    <p className={"text-cyan text-sm mb-3"}>{member.role}</p>
                                    <div className={"flex items-center justify-center gap-3 text-gray-400"}>
                                        <FaFacebook
                                            className={"hover:text-cyan cursor-pointer transition-colors"}/>
                                        <FaTwitter
                                            className={"hover:text-cyan cursor-pointer transition-colors"}/>
                                        <FaInstagramSquare
                                            className={"hover:text-cyan cursor-pointer transition-colors"}/>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    )
                })}

                <div className={"py-12 md:py-16 px-6 md:px-12 rounded-2xl mb-10 last:mb-0"}>
                    <div className={"text-center mb-10"}>
                        <h3 className={"text-2xl md:text-3xl font-bold text-gray-800 flex items-center justify-center gap-3"}>
                            <LuBookOpen className={"text-cyan text-3xl"}/> Teachers
                        </h3>
                        <p className={"text-gray-500 mt-2"}>Shaping young minds with passion and care</p>
                    </div>
                    <div className={"max-w-7xl mx-auto"}>
                        <div className={"flex flex-wrap items-center justify-center gap-2 mb-8"}>
                            <button onClick={() => { setActiveSubject(null); setShowAll(false) }}
                                    className={`${chipBase} ${activeSubject === null ? chipActive : chipInactive}`}>
                                All
                            </button>
                            {subjects.map(s => (
                                <button key={s} onClick={() => { setActiveSubject(s); setShowAll(false) }}
                                        className={`${chipBase} ${activeSubject === s ? chipActive : chipInactive}`}>
                                    {s}
                                </button>
                            ))}
                        </div>
                        <div className={"grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 justify-items-center"}>
                            {visible.map((member, i) => (
                                <div key={i}
                                     className={"text-center group w-full max-w-64 bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"}>
                                    <div
                                        className={"size-32 sm:size-36 mx-auto rounded-full overflow-hidden mb-5 ring-4 ring-white shadow-lg group-hover:scale-105 transition-transform duration-300"}>
                                        <img src={member.src} alt={member.name}
                                             className={"size-full object-cover"}/>
                                    </div>
                                    <h4 className={"text-lg font-semibold text-gray-800"}>{member.name}</h4>
                                    <p className={"text-cyan text-sm mb-2"}>{member.role}</p>
                                    <span
                                        className={"inline-block text-xs bg-ice-blue text-navy-dark px-2 py-0.5 rounded"}>{member.subject}</span>
                                    <div className={"flex items-center justify-center gap-3 text-gray-400 mt-3"}>
                                        <FaFacebook
                                            className={"hover:text-cyan cursor-pointer transition-colors"}/>
                                        <FaTwitter
                                            className={"hover:text-cyan cursor-pointer transition-colors"}/>
                                        <FaInstagramSquare
                                            className={"hover:text-cyan cursor-pointer transition-colors"}/>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {filtered.length > 6 && (
                            <div className={"text-center mt-8"}>
                                <button onClick={() => setShowAll(!showAll)}
                                        className={"px-6 py-2.5 rounded-lg bg-navy text-white font-medium text-sm hover:bg-navy-dark transition-colors"}>
                                    {showAll ? "Show Less" : `Show More (${filtered.length - 6} more)`}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}
