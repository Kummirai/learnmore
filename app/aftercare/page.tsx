import Link from "next/link"
import {LuArrowLeft, LuClock, LuUsers, LuPalette, LuHeart, LuMusic} from "react-icons/lu"
import {FaRunning} from "react-icons/fa"

const programs = [
    {
        icon: <LuClock className={"text-3xl text-green-600"}/>,
        title: "Aftercare Program",
        time: "Mon - Fri: 1:00PM - 5:30PM",
        desc: "Supervised homework completion, quiet reading time, and structured play activities in a safe environment.",
        ages: "Grade R - 7",
        color: "bg-green-50 border-green-200"
    },
    {
        icon: <FaRunning className={"text-3xl text-orange-600"}/>,
        title: "Sports Clubs",
        time: "Mon, Wed, Fri: 2:30PM - 4:00PM",
        desc: "Soccer, netball, athletics, swimming, and ball games coached by qualified instructors.",
        ages: "Grade 1 - 7",
        color: "bg-orange-50 border-orange-200"
    },
    {
        icon: <LuMusic className={"text-3xl text-purple-600"}/>,
        title: "Music & Choir",
        time: "Tue & Thu: 2:30PM - 4:00PM",
        desc: "Recorder lessons, choir practice, and percussion for learners interested in developing musical skills.",
        ages: "Grade R - 7",
        color: "bg-purple-50 border-purple-200"
    },
    {
        icon: <LuPalette className={"text-3xl text-pink-600"}/>,
        title: "Arts & Crafts Club",
        time: "Wed: 2:30PM - 4:00PM",
        desc: "Painting, drawing, clay modeling, and creative craft projects that spark imagination.",
        ages: "Grade R - 7",
        color: "bg-pink-50 border-pink-200"
    },
    {
        icon: <LuUsers className={"text-3xl text-blue-600"}/>,
        title: "Homework Support",
        time: "Mon - Thu: 2:30PM - 4:00PM",
        desc: "Structured homework sessions with teacher supervision to ensure assignments are completed correctly.",
        ages: "Grade 1 - 7",
        color: "bg-blue-50 border-blue-200"
    },
    {
        icon: <LuHeart className={"text-3xl text-cyan-600"}/>,
        title: "Holiday Care Program",
        time: "School Holidays: 8:00AM - 5:00PM",
        desc: "Fun-filled holiday programs with excursions, games, arts, and sports during school breaks.",
        ages: "Grade R - 7",
        color: "bg-cyan-50 border-cyan-200"
    },
]

export default function AftercarePage() {
    return (
        <section className={"flex-1 px-4 py-12"}>
            <div className={"max-w-6xl mx-auto"}>
                <Link href={"/"}
                      className={"inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-700 mb-6 transition-colors"}>
                    <LuArrowLeft/> Back to Home
                </Link>

                <div className={"text-center mb-10"}>
                    <h1 className={"text-3xl md:text-4xl font-semibold text-gray-800 mb-3"}>Aftercare & Extramurals</h1>
                    <p className={"text-gray-500 max-w-xl mx-auto"}>Keeping your child safe, active, and engaged beyond the school day with quality aftercare and enrichment programs.</p>
                </div>

                <div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"}>
                    {programs.map((p, i) => (
                        <div key={i}
                             className={`rounded-xl border p-6 ${p.color} hover:shadow-md transition-shadow`}>
                            <div className={"mb-4"}>{p.icon}</div>
                            <h3 className={"text-lg font-semibold text-gray-800 mb-1"}>{p.title}</h3>
                            <div className={"flex items-center gap-2 text-xs text-gray-500 mb-3"}>
                                <LuClock className={"shrink-0"}/>
                                <span>{p.time}</span>
                                <span className={"text-gray-300"}>|</span>
                                <span>{p.ages}</span>
                            </div>
                            <p className={"text-sm text-gray-600 leading-relaxed"}>{p.desc}</p>
                        </div>
                    ))}
                </div>

                <div className={"bg-white rounded-xl p-8 shadow-sm mt-8 text-center"}>
                    <h2 className={"text-lg font-semibold text-gray-800 mb-2"}>Need More Information?</h2>
                    <p className={"text-sm text-gray-600 mb-4"}>Contact our aftercare coordinator for fees and availability.</p>
                    <Link href={"/contact"}
                          className={"inline-block bg-green-600 text-white px-8 py-3 text-sm font-medium rounded hover:bg-green-700 transition-colors"}>
                        Contact Us
                    </Link>
                </div>
            </div>
        </section>
    )
}
