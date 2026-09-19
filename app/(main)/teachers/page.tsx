import Link from "next/link"
import {LuArrowLeft, LuMail, LuPhone} from "react-icons/lu"

type Teacher = {name: string; subjects: string[]; grades: string; bio: string; email: string; phone: string}

const teachers: Teacher[] = [
    {
        name: "Ms. Dlamini",
        subjects: ["Mathematics"],
        grades: "Grade 4 & 5",
        bio: "Passionate about making maths fun through games and real-world problem-solving.",
        email: "sdlamini@learnmore.co.za",
        phone: "+27 39 392 9201",
    },
    {
        name: "Mr. Botha",
        subjects: ["English", "Literacy"],
        grades: "Grade 4 - 7",
        bio: "Loves storytelling and encouraging learners to find their voice through creative writing.",
        email: "dbotha@learnmore.co.za",
        phone: "+27 39 392 9202",
    },
    {
        name: "Ms. Nkosi",
        subjects: ["Life Skills", "Geography", "History"],
        grades: "Grade 4 - 7",
        bio: "Dedicated to nurturing curious, well-rounded citizens who care about their world.",
        email: "tnkosi@learnmore.co.za",
        phone: "+27 39 392 9203",
    },
    {
        name: "Mr. Naidoo",
        subjects: ["Science", "Computers"],
        grades: "Grade 5 - 7",
        bio: "Enjoys hands-on experiments and introducing learners to the wonders of technology.",
        email: "knaidoo@learnmore.co.za",
        phone: "+27 39 392 9204",
    },
    {
        name: "Ms. van der Merwe",
        subjects: ["Afrikaans"],
        grades: "Grade 4 - 7",
        bio: "Brings Afrikaans language and culture to life through songs, poems, and stories.",
        email: "avdmerwe@learnmore.co.za",
        phone: "+27 39 392 9205",
    },
    {
        name: "Mr. Jacobs",
        subjects: ["Creative Arts"],
        grades: "Grade 4 - 7",
        bio: "Inspires creativity through painting, sculpture, drama, and cultural projects.",
        email: "pjacobs@learnmore.co.za",
        phone: "+27 39 392 9206",
    },
    {
        name: "Coach Singh",
        subjects: ["Physical Education", "Sport"],
        grades: "Grade R - 7",
        bio: "Believes every child can shine on the field. Coaches athletics, soccer, and netball.",
        email: "rsingh@learnmore.co.za",
        phone: "+27 39 392 9207",
    },
    {
        name: "Ms. Ferreira",
        subjects: ["Music", "Choir"],
        grades: "Grade R - 7",
        bio: "A talented musician who brings joy and harmony to the school through choir and music lessons.",
        email: "lferreira@learnmore.co.za",
        phone: "+27 39 392 9208",
    },
    {
        name: "Ms. Govender",
        subjects: ["Library", "Reading Support"],
        grades: "Grade R - 7",
        bio: "Runs the school library and helps every learner develop a love for reading.",
        email: "pgovender@learnmore.co.za",
        phone: "+27 39 392 9209",
    },
]

export default function TeachersPage() {
    return (
        <section className={"flex-1 px-4 py-12"}>
            <div className={"max-w-6xl mx-auto"}>
                <Link href={"/"}
                      className={"inline-flex items-center gap-1 text-sm text-cyan hover:text-cyan-dark mb-6 transition-colors"}>
                    <LuArrowLeft/> Back to Home
                </Link>

                <div className={"text-center mb-12"}>
                    <h1 className={"text-3xl md:text-4xl font-semibold text-gray-800 mb-3"}>Teacher Directory</h1>
                    <p className={"text-gray-500 max-w-xl mx-auto"}>
                        Meet our dedicated teaching staff. Contact them directly with any questions.
                    </p>
                </div>

                <div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"}>
                    {teachers.map((t, i) => (
                        <div key={i}
                             className={"bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"}>
                            <div className={"w-16 h-16 rounded-full bg-ice-blue flex items-center justify-center mb-4"}>
                                <span className={"text-2xl font-bold text-cyan"}>
                                    {t.name.split(" ").map(w => w[0]).join("")}
                                </span>
                            </div>
                            <h2 className={"text-lg font-semibold text-gray-800"}>{t.name}</h2>
                            <p className={"text-sm text-gray-500 mb-2"}>{t.grades}</p>
                            <div className={"flex flex-wrap gap-1.5 mb-3"}>
                                {t.subjects.map((s, j) => (
                                    <span key={j}
                                          className={"text-xs bg-ice-blue text-navy-dark px-2 py-0.5 rounded"}>{s}</span>
                                ))}
                            </div>
                            <p className={"text-sm text-gray-600 mb-4"}>{t.bio}</p>
                            <div className={"space-y-1 text-xs text-gray-500"}>
                                <div className={"flex items-center gap-2"}>
                                    <LuMail className={"shrink-0"}/>
                                    <a href={`mailto:${t.email}`}
                                       className={"text-cyan hover:underline"}>{t.email}</a>
                                </div>
                                <div className={"flex items-center gap-2"}>
                                    <LuPhone className={"shrink-0"}/>
                                    <span>{t.phone}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
