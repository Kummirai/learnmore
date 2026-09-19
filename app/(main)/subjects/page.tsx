import Link from "next/link"
import {LuArrowLeft, LuBookOpen, LuFlaskConical, LuPencil, LuPalette, LuHeart, LuMusic, LuLanguages, LuCalculator} from "react-icons/lu"
import {FaRunning} from "react-icons/fa"

const subjects = [
    {
        icon: <LuCalculator className={"text-4xl text-blue-600"}/>,
        title: "Mathematics & Numeracy",
        phase: "Grade R - 7",
        description: "Building strong number sense, problem-solving skills, and logical thinking through fun, hands-on activities and real-world applications.",
        topics: ["Counting & Number Recognition", "Addition & Subtraction", "Multiplication & Division", "Fractions & Decimals", "Geometry & Measurement", "Data Handling & Graphs"],
        color: "bg-blue-50 border-blue-200"
    },
    {
        icon: <LuBookOpen className={"text-4xl text-purple-600"}/>,
        title: "English Language & Literacy",
        phase: "Grade R - 7",
        description: "Developing reading, writing, speaking, and listening skills through engaging stories, poetry, and creative writing exercises.",
        topics: ["Phonics & Reading", "Creative Writing", "Grammar & Spelling", "Comprehension", "Public Speaking", "Literature Studies"],
        color: "bg-purple-50 border-purple-200"
    },
    {
        icon: <LuFlaskConical className={"text-4xl text-cyan-600"}/>,
        title: "Science & Discovery",
        phase: "Grade 4 - 7",
        description: "Exploring the natural world through hands-on experiments, nature walks, and curious inquiry that sparks a love for scientific discovery.",
        topics: ["Life & Living Things", "Energy & Change", "Matter & Materials", "Planet Earth & Beyond", "Scientific Investigations", "Environmental Awareness"],
        color: "bg-cyan-50 border-cyan-200"
    },
    {
        icon: <LuPalette className={"text-4xl text-pink-600"}/>,
        title: "Creative Arts & Culture",
        phase: "Grade R - 7",
        description: "Expressing imagination through painting, music, drama, dance, and cultural celebrations that build confidence and creativity.",
        topics: ["Visual Arts & Drawing", "Music & Rhythm", "Drama & Role Play", "Dance & Movement", "Cultural Heritage", "Crafts & Design"],
        color: "bg-pink-50 border-pink-200"
    },
    {
        icon: <FaRunning className={"text-4xl text-orange-600"}/>,
        title: "Physical Education & Sport",
        phase: "Grade R - 7",
        description: "Building teamwork, coordination, and healthy habits through games, athletics, and physical activities that promote lifelong fitness.",
        topics: ["Ball Games & Team Sports", "Athletics & Fitness", "Gymnastics & Coordination", "Swimming & Water Safety", "Sportsmanship & Fair Play", "Health & Nutrition"],
        color: "bg-orange-50 border-orange-200"
    },
    {
        icon: <LuHeart className={"text-4xl text-cyan"}/>,
        title: "Life Skills & Social Studies",
        phase: "Grade 1 - 7",
        description: "Learning about our world, community, values, and becoming responsible young citizens with empathy and confidence.",
        topics: ["Personal & Social Well-being", "Citizenship & Democracy", "Geography & Our World", "History & Heritage", "Religious & Cultural Studies", "Financial Literacy"],
        color: "bg-alice-blue border-ice-blue"
    },
    {
        icon: <LuLanguages className={"text-4xl text-red-600"}/>,
        title: "Home Language (Afrikaans)",
        phase: "Grade 1 - 7",
        description: "Developing proficiency in reading, writing, and communicating in Afrikaans as a home or first additional language.",
        topics: ["Lees & Begrip", "Skryf & Spelling", "Praat & Luister", "Taalstruktuur", "Literatuur & Stories", "Kulturele Waardering"],
        color: "bg-red-50 border-red-200"
    },
    {
        icon: <LuMusic className={"text-4xl text-amber-600"}/>,
        title: "Music & Choir",
        phase: "Grade R - 7",
        description: "Developing musical talent through singing, instrument playing, and choir performances at school events and competitions.",
        topics: ["Vocal Training & Singing", "Recorder & Percussion", "Music Theory Basics", "Choir Practice", "Performance Skills", "Music Appreciation"],
        color: "bg-amber-50 border-amber-200"
    }
]

export default function SubjectsPage() {
    return (
        <section className={"flex-1 px-4 py-12"}>
            <div className={"max-w-6xl mx-auto"}>
                <Link href={"/"}
                      className={"inline-flex items-center gap-1 text-sm text-cyan hover:text-cyan-dark mb-6 transition-colors"}>
                    <LuArrowLeft/> Back to Home
                </Link>

                <div className={"text-center mb-12"}>
                    <h1 className={"text-3xl md:text-4xl font-semibold text-gray-800 mb-3"}>Our Subjects</h1>
                    <p className={"text-gray-500 max-w-xl mx-auto"}>
                        A rich and balanced curriculum designed to nurture every child&rsquo;s
                        academic, creative, and physical development from Grade R to Grade 7.
                    </p>
                </div>

                <div className={"grid grid-cols-1 md:grid-cols-2 gap-6"}>
                    {subjects.map((s, i) => (
                        <div key={i}
                             className={`rounded-xl border p-6 md:p-8 ${s.color} hover:shadow-md transition-shadow`}>
                            <div className={"flex items-start gap-4"}>
                                <div className={"shrink-0 mt-1"}>{s.icon}</div>
                                <div>
                                    <div className={"flex items-center gap-3 mb-1 flex-wrap"}>
                                        <h2 className={"text-lg md:text-xl font-semibold text-gray-800"}>{s.title}</h2>
                                        <span
                                            className={"text-xs font-medium text-gray-500 bg-white px-2 py-0.5 rounded"}>{s.phase}</span>
                                    </div>
                                    <p className={"text-gray-600 text-sm leading-relaxed mb-4"}>{s.description}</p>
                                    <div className={"flex flex-wrap gap-1.5"}>
                                        {s.topics.map((topic, j) => (
                                            <span key={j}
                                                  className={"text-xs bg-white/70 text-gray-600 px-2 py-1 rounded"}>
                                                {topic}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
