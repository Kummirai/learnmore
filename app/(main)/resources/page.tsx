import Link from "next/link"
import {LuBookOpen, LuDownload, LuFileText, LuVideo, LuLink} from "react-icons/lu"

type Resource = {title: string; description: string; type: string; icon: React.ReactNode; items: {name: string; url: string}[]}

const resources: Resource[] = [
    {
        title: "Reading & Literacy", description: "Recommended reading lists and comprehension worksheets.",
        type: "Worksheets", icon: <LuFileText className={"text-2xl text-blue-600"}/>,
        items: [
            {name: "Grade 4 Reading List (PDF)", url: "#"},
            {name: "Grade 5 Comprehension Worksheet", url: "#"},
            {name: "Grade 6 Book Report Template", url: "#"},
            {name: "Grade 7 Poetry Analysis Guide", url: "#"},
        ]
    },
    {
        title: "Mathematics", description: "Practice worksheets, times tables, and problem-solving packs.",
        type: "Worksheets", icon: <LuDownload className={"text-2xl text-purple-600"}/>,
        items: [
            {name: "Times Tables Grid (1-12)", url: "#"},
            {name: "Grade 5 Fraction Worksheets", url: "#"},
            {name: "Grade 6 Long Division Practice", url: "#"},
            {name: "Grade 7 Algebra Basics", url: "#"},
        ]
    },
    {
        title: "Science & Discovery", description: "Experiment guides, nature study resources, and videos.",
        type: "Videos", icon: <LuVideo className={"text-2xl text-cyan-600"}/>,
        items: [
            {name: "Water Cycle Animation", url: "#"},
            {name: "Solar System Fact Sheet", url: "#"},
            {name: "Kitchen Science Experiments", url: "#"},
            {name: "Nature Journal Template", url: "#"},
        ]
    },
    {
        title: "Afrikaans", description: "Leesstukke, werkkaarte en taaloefeninge.",
        type: "Worksheets", icon: <LuBookOpen className={"text-2xl text-red-600"}/>,
        items: [
            {name: "Graad 4 Leesstuk: My Gesin", url: "#"},
            {name: "Graad 5 Spellingsoefeninge", url: "#"},
            {name: "Graad 6 Taalstruktuur Werkkaart", url: "#"},
            {name: "Graad 7 Opstel Riglyne", url: "#"},
        ]
    },
    {
        title: "Study Skills", description: "Tips, planners, and guides to help learners study effectively.",
        type: "Guides", icon: <LuLink className={"text-2xl text-amber-600"}/>,
        items: [
            {name: "How to Create a Study Timetable", url: "#"},
            {name: "Mind Map Templates", url: "#"},
            {name: "Exam Preparation Checklist", url: "#"},
            {name: "Note-Taking Strategies Guide", url: "#"},
        ]
    },
]

export default function ResourcesPage() {
    return (
        <section className={"flex-1 px-4 py-12"}>
            <div className={"max-w-6xl mx-auto"}>
                <div className={"text-center mb-12"}>
                    <h1 className={"text-3xl md:text-4xl font-semibold text-gray-800 mb-3"}>Study Resources</h1>
                    <p className={"text-gray-500 max-w-xl mx-auto"}>
                        Downloadable worksheets, reading lists, study guides, and video resources
                        to support learning at home.
                    </p>
                </div>

                <div className={"grid grid-cols-1 md:grid-cols-2 gap-6"}>
                    {resources.map((r, i) => (
                        <div key={i}
                             className={"bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"}>
                            <div className={"flex items-start gap-4 mb-4"}>
                                <div className={"shrink-0 mt-1"}>{r.icon}</div>
                                <div>
                                    <h2 className={"text-lg font-semibold text-gray-800"}>{r.title}</h2>
                                    <p className={"text-sm text-gray-500"}>{r.description}</p>
                                    <span
                                        className={"inline-block mt-1 text-xs font-medium text-navy-dark bg-ice-blue px-2 py-0.5 rounded"}>{r.type}</span>
                                </div>
                            </div>
                            <ul className={"space-y-2"}>
                                {r.items.map((item, j) => (
                                    <li key={j}>
                                        <Link href={item.url}
                                              className={"flex items-center gap-2 text-sm text-cyan hover:text-cyan-dark transition-colors"}>
                                            <LuDownload className={"shrink-0"}/>
                                            <span>{item.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
