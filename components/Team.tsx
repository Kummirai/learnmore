import {FaFacebook, FaTwitter, FaInstagramSquare} from "react-icons/fa";
import {LuStar, LuBriefcase, LuBookOpen} from "react-icons/lu";

type TeamMember = {
    name: string
    role: string
    src: string
}

type TeamGroup = {
    title: string
    subtitle: string
    bg: string
    members: TeamMember[]
}

export default function Team() {
    const groups: TeamGroup[] = [
        {
            title: "Leadership",
            subtitle: "Guiding our school with vision and dedication",
            bg: "bg-green-50",
            members: [
                {name: "Dr. Sarah Johnson", role: "Principal & Founder", src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face"},
                {name: "Mr. Mark Williams", role: "Vice Principal", src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face"},
            ]
        },
        {
            title: "Admin Staff",
            subtitle: "Keeping everything running smoothly behind the scenes",
            bg: "bg-blue-50",
            members: [
                {name: "Mrs. Linda Nel", role: "Administrative Assistant", src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face"},
                {name: "Ms. Thandi Mokoena", role: "Finance & Admissions", src: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=200&h=200&fit=crop&crop=face"},
                {name: "Mr. James Botha", role: "IT & Operations", src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"},
            ]
        },
        {
            title: "Teachers",
            subtitle: "Shaping young minds with passion and care",
            bg: "bg-purple-50",
            members: [
                {name: "Ms. Emily Chen", role: "Foundation Phase Head (R-3)", src: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=200&h=200&fit=crop&crop=face"},
                {name: "Mr. David Okafor", role: "Intermediate Phase Head (4-7)", src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face"},
                {name: "Mrs. Karen van der Merwe", role: "Grade R Teacher", src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face"},
                {name: "Miss Olivia Brown", role: "Grade 1 Teacher", src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face"},
                {name: "Mr. Thabo Nkosi", role: "Grade 4 Teacher", src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face"},
            ]
        }
    ]

    return (
        <section className={"py-16 md:py-24 bg-white px-4"}>
            <div className={"max-w-6xl mx-auto"}>
                <div className={"text-center mb-12 md:mb-16"}>
                    <h4 className={"text-green-600 font-medium mb-3"}>OUR TEAM</h4>
                    <h2 className={"text-3xl md:text-4xl font-semibold text-gray-800"}>
                        Meet Our Dedicated <br className={"hidden sm:block"}/>
                        Educators
                    </h2>
                </div>
                {groups.map(group => {
                    const icon = group.title === "Leadership" ? <LuStar className={"text-yellow-500 text-3xl"}/>
                        : group.title === "Admin Staff" ? <LuBriefcase className={"text-blue-500 text-3xl"}/>
                            : <LuBookOpen className={"text-green-600 text-3xl"}/>
                    return (
                    <div key={group.title} className={`${group.bg} py-12 md:py-16 px-6 md:px-12 rounded-2xl mb-10 last:mb-0`}>
                        <div className={"text-center mb-10"}>
                            <h3 className={"text-2xl md:text-3xl font-bold text-gray-800 flex items-center justify-center gap-3"}>
                                {icon} {group.title}
                            </h3>
                            <p className={"text-gray-500 mt-2"}>{group.subtitle}</p>
                        </div>
                        <div className={"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center"}
                             style={{
                                 gridTemplateColumns: group.members.length < 4
                                     ? `repeat(${group.members.length}, minmax(0, 1fr))`
                                     : undefined
                             }}>
                            {group.members.map((member, i) => (
                                <div key={i} className={"text-center group w-full max-w-64"}>
                                    <div
                                        className={"size-32 sm:size-36 mx-auto rounded-full overflow-hidden mb-5 ring-4 ring-white shadow-lg group-hover:scale-105 transition-transform duration-300"}>
                                        <img src={member.src} alt={member.name}
                                             className={"size-full object-cover"}/>
                                    </div>
                                    <h4 className={"text-lg font-semibold text-gray-800"}>{member.name}</h4>
                                    <p className={"text-green-600 text-sm mb-3"}>{member.role}</p>
                                    <div className={"flex items-center justify-center gap-3 text-gray-400"}>
                                        <FaFacebook
                                            className={"hover:text-green-600 cursor-pointer transition-colors"}/>
                                        <FaTwitter
                                            className={"hover:text-green-600 cursor-pointer transition-colors"}/>
                                        <FaInstagramSquare
                                            className={"hover:text-green-600 cursor-pointer transition-colors"}/>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    )
                })}
            </div>
        </section>
    )
}
