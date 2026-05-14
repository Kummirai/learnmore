import Link from "next/link"
import {LuArrowLeft, LuFileText} from "react-icons/lu"

type SubjectScore = {subject: string; score: number; outOf: number; grade: string}
type Report = {learner: string; grade: string; term: string; year: number; subjects: SubjectScore[]}

const reports: Report[] = [
    {
        learner: "Thandi M.", grade: "Grade 4", term: "Term 1", year: 2026,
        subjects: [
            {subject: "Mathematics", score: 78, outOf: 100, grade: "B"},
            {subject: "English", score: 85, outOf: 100, grade: "A"},
            {subject: "Afrikaans", score: 72, outOf: 100, grade: "B"},
            {subject: "Life Skills", score: 90, outOf: 100, grade: "A"},
            {subject: "Science", score: 81, outOf: 100, grade: "B"},
            {subject: "Creative Arts", score: 88, outOf: 100, grade: "A"},
        ]
    },
    {
        learner: "James K.", grade: "Grade 6", term: "Term 1", year: 2026,
        subjects: [
            {subject: "Mathematics", score: 92, outOf: 100, grade: "A"},
            {subject: "English", score: 76, outOf: 100, grade: "B"},
            {subject: "Afrikaans", score: 68, outOf: 100, grade: "C"},
            {subject: "Life Skills", score: 84, outOf: 100, grade: "B"},
            {subject: "Geography", score: 79, outOf: 100, grade: "B"},
            {subject: "History", score: 73, outOf: 100, grade: "B"},
        ]
    },
    {
        learner: "Priya N.", grade: "Grade 7", term: "Term 1", year: 2026,
        subjects: [
            {subject: "Mathematics", score: 95, outOf: 100, grade: "A"},
            {subject: "English", score: 88, outOf: 100, grade: "A"},
            {subject: "Afrikaans", score: 82, outOf: 100, grade: "B"},
            {subject: "Life Skills", score: 91, outOf: 100, grade: "A"},
            {subject: "Science", score: 87, outOf: 100, grade: "A"},
            {subject: "Creative Arts", score: 79, outOf: 100, grade: "B"},
        ]
    },
]

function gradeColor(g: string) {
    switch (g) {
        case "A":
            return "text-green-700 bg-green-100"
        case "B":
            return "text-blue-700 bg-blue-100"
        case "C":
            return "text-amber-700 bg-amber-100"
        default:
            return "text-red-700 bg-red-100"
    }
}

export default function ReportsPage() {
    return (
        <section className={"flex-1 px-4 py-12"}>
            <div className={"max-w-6xl mx-auto"}>
                <Link href={"/"}
                      className={"inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-700 mb-6 transition-colors"}>
                    <LuArrowLeft/> Back to Home
                </Link>

                <div className={"text-center mb-12"}>
                    <div className={"flex items-center justify-center gap-3 mb-3"}>
                        <LuFileText className={"text-3xl text-green-600"}/>
                        <h1 className={"text-3xl md:text-4xl font-semibold text-gray-800"}>Progress Reports</h1>
                    </div>
                    <p className={"text-gray-500 max-w-xl mx-auto"}>
                        View learner progress and term results for the current academic year.
                    </p>
                </div>

                <div className={"grid grid-cols-1 md:grid-cols-3 gap-6"}>
                    {reports.map((r, i) => (
                        <div key={i}
                             className={"bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"}>
                            <div className={"bg-green-600 text-white p-4"}>
                                <h2 className={"text-lg font-semibold"}>{r.learner}</h2>
                                <p className={"text-sm text-green-100"}>{r.grade} &middot; {r.term} {r.year}</p>
                            </div>
                            <div className={"p-4 space-y-2"}>
                                {r.subjects.map((s, j) => (
                                    <div key={j} className={"flex items-center justify-between text-sm"}>
                                        <span className={"text-gray-700"}>{s.subject}</span>
                                        <div className={"flex items-center gap-3"}>
                                            <span className={"text-gray-500"}>{s.score}/{s.outOf}</span>
                                            <span
                                                className={`text-xs font-bold px-2 py-0.5 rounded ${gradeColor(s.grade)}`}>{s.grade}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className={"bg-gray-50 px-4 py-3 text-center"}>
                                <span
                                    className={"text-xs text-green-600 font-medium"}>Average: {Math.round(r.subjects.reduce((a, s) => a + s.score / s.outOf, 0) / r.subjects.length * 100)}%</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={"text-center mt-8"}>
                    <p className={"text-sm text-gray-400"}>
                        Full downloadable report cards are available on request from the admin office.
                    </p>
                </div>
            </div>
        </section>
    )
}
