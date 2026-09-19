import Link from "next/link"
import {LuArrowLeft, LuTrophy, LuMedal, LuStar, LuAward} from "react-icons/lu"
import {FaCrown} from "react-icons/fa"

const topStudents = [
    {
        name: "Amahle Zulu",
        grade: "Grade 7",
        average: "96%",
        subjects: 8,
        rank: 1,
        quote: "Hard work and dedication pay off. I study two hours every day and always ask questions when I don't understand.",
        color: "bg-amber-50 border-amber-300",
        icon: <FaCrown className={"text-amber-500 text-3xl"}/>,
        medal: "gold"
    },
    {
        name: "Liam van der Merwe",
        grade: "Grade 7",
        average: "94%",
        subjects: 8,
        rank: 2,
        quote: "I love mathematics and science. My teachers make learning fun and I always look forward to class.",
        color: "bg-gray-50 border-gray-300",
        icon: <LuTrophy className={"text-gray-400 text-3xl"}/>,
        medal: "silver"
    },
    {
        name: "Olivia Nkosi",
        grade: "Grade 6",
        average: "93%",
        subjects: 8,
        rank: 3,
        quote: "Reading is my superpower! I read at least one book every week and it helps me in all my subjects.",
        color: "bg-orange-50 border-orange-300",
        icon: <LuMedal className={"text-amber-600 text-3xl"}/>,
        medal: "bronze"
    },
    {
        name: "Sipho Dlamini",
        grade: "Grade 6",
        average: "91%",
        subjects: 8,
        rank: 4,
        icon: <LuStar className={"text-blue-500 text-3xl"}/>,
        medal: ""
    },
    {
        name: "Emma Botha",
        grade: "Grade 5",
        average: "92%",
        subjects: 7,
        rank: 5,
        icon: <LuStar className={"text-blue-500 text-3xl"}/>,
        medal: ""
    },
    {
        name: "Thabo Molefe",
        grade: "Grade 5",
        average: "90%",
        subjects: 7,
        rank: 6,
        icon: <LuStar className={"text-blue-500 text-3xl"}/>,
        medal: ""
    },
    {
        name: "Zara Abrahams",
        grade: "Grade 4",
        average: "95%",
        subjects: 7,
        rank: 7,
        icon: <LuStar className={"text-blue-500 text-3xl"}/>,
        medal: ""
    },
    {
        name: "Kabelo Mokoena",
        grade: "Grade 4",
        average: "89%",
        subjects: 7,
        rank: 8,
        icon: <LuStar className={"text-blue-500 text-3xl"}/>,
        medal: ""
    }
]

const gradeStats = [
    {grade: "Grade 7", passRate: "100%", avgScore: "82%", topScore: "96%"},
    {grade: "Grade 6", passRate: "100%", avgScore: "79%", topScore: "93%"},
    {grade: "Grade 5", passRate: "100%", avgScore: "78%", topScore: "92%"},
    {grade: "Grade 4", passRate: "100%", avgScore: "81%", topScore: "95%"},
]

export default function GalleryPage() {
    return (
        <section className={"flex-1 px-4 py-12"}>
            <div className={"max-w-6xl mx-auto"}>
                <Link href={"/"}
                      className={"inline-flex items-center gap-1 text-sm text-cyan hover:text-cyan-dark mb-6 transition-colors"}>
                    <LuArrowLeft/> Back to Home
                </Link>

                <div className={"text-center mb-12"}>
                    <h1 className={"text-3xl md:text-4xl font-semibold text-gray-800 mb-3"}>Academic Excellence</h1>
                    <p className={"text-gray-500 max-w-xl mx-auto"}>
                        Celebrating the hard work and outstanding achievements of our top-performing learners.
                    </p>
                </div>

                <div className={"grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"}>
                    {gradeStats.map((s, i) => (
                        <div key={i}
                             className={"bg-navy text-white rounded-xl p-4 md:p-6 text-center"}>
                            <p className={"text-xs md:text-sm text-cyan-light mb-1"}>{s.grade}</p>
                            <p className={"text-xl md:text-3xl font-bold"}>{s.passRate}</p>
                            <p className={"text-xs text-cyan-light"}>Pass Rate</p>
                            <hr className={"border-cyan my-2"}/>
                            <p className={"text-lg md:text-2xl font-bold"}>{s.avgScore}</p>
                            <p className={"text-xs text-cyan-light"}>Average Score</p>
                        </div>
                    ))}
                </div>

                <div className={"mb-8"}>
                    <div className={"flex items-center gap-2 mb-6"}>
                        <LuAward className={"text-2xl text-cyan"}/>
                        <h2 className={"text-xl md:text-2xl font-semibold text-gray-800"}>Top Performing Learners</h2>
                    </div>
                    <div className={"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"}>
                        {topStudents.map((s, i) => (
                            <div key={i}
                                 className={`rounded-xl border p-5 ${s.rank <= 3 ? s.color : "bg-white border-gray-200"} hover:shadow-md transition-shadow`}>
                                <div className={"flex items-center justify-between mb-3"}>
                                    <div className={"size-12 rounded-full bg-navy flex items-center justify-center text-white text-lg font-bold"}>
                                        {s.name.split(" ").map(n => n[0]).join("")}
                                    </div>
                                    <div className={"flex items-center gap-1"}>
                                        {s.rank <= 3 && s.icon}
                                        <span className={"text-xs text-gray-400"}>#{s.rank}</span>
                                    </div>
                                </div>
                                <h3 className={"font-semibold text-gray-800 text-sm"}>{s.name}</h3>
                                <p className={"text-xs text-gray-500 mb-2"}>{s.grade} &middot; {s.subjects} Subjects</p>
                                <p className={"text-2xl font-bold text-cyan mb-2"}>{s.average}</p>
                                {s.quote && (
                                    <p className={"text-xs text-gray-500 leading-relaxed italic"}>
                                        &ldquo;{s.quote}&rdquo;
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
