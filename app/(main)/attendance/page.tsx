import Link from "next/link"
import {LuArrowLeft, LuCheck, LuX, LuClock} from "react-icons/lu"

type AttendanceRecord = {learner: string; grade: string; present: number; absent: number; late: number; total: number}

const records: AttendanceRecord[] = [
    {learner: "Thandi M.", grade: "Grade 4", present: 42, absent: 1, late: 2, total: 45},
    {learner: "James K.", grade: "Grade 6", present: 40, absent: 3, late: 2, total: 45},
    {learner: "Priya N.", grade: "Grade 7", present: 44, absent: 0, late: 1, total: 45},
    {learner: "Liam P.", grade: "Grade 4", present: 38, absent: 5, late: 2, total: 45},
    {learner: "Zoe S.", grade: "Grade 5", present: 43, absent: 1, late: 1, total: 45},
    {learner: "Ethan R.", grade: "Grade 6", present: 41, absent: 2, late: 2, total: 45},
    {learner: "Amara O.", grade: "Grade 5", present: 45, absent: 0, late: 0, total: 45},
    {learner: "Sipho D.", grade: "Grade 7", present: 39, absent: 4, late: 2, total: 45},
]

export default function AttendancePage() {
    return (
        <section className={"flex-1 px-4 py-12"}>
            <div className={"max-w-6xl mx-auto"}>
                <Link href={"/"}
                      className={"inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-700 mb-6 transition-colors"}>
                    <LuArrowLeft/> Back to Home
                </Link>

                <div className={"text-center mb-12"}>
                    <div className={"flex items-center justify-center gap-3 mb-3"}>
                        <LuCheck className={"text-3xl text-green-600"}/>
                        <h1 className={"text-3xl md:text-4xl font-semibold text-gray-800"}>Attendance Tracker</h1>
                    </div>
                    <p className={"text-gray-500 max-w-xl mx-auto"}>
                        Term 1 attendance records. Present, absent, and late tracking for each learner.
                    </p>
                </div>

                <div className={"overflow-x-auto"}>
                    <table className={"w-full text-sm border-collapse"}>
                        <thead>
                        <tr className={"bg-green-600 text-white"}>
                            <th className={"p-3 text-left"}>Learner</th>
                            <th className={"p-3 text-left"}>Grade</th>
                            <th className={"p-3 text-center"}>
                                <div className={"flex items-center justify-center gap-1"}><LuCheck/> Present</div>
                            </th>
                            <th className={"p-3 text-center"}>
                                <div className={"flex items-center justify-center gap-1"}><LuX/> Absent</div>
                            </th>
                            <th className={"p-3 text-center"}>
                                <div className={"flex items-center justify-center gap-1"}><LuClock/> Late</div>
                            </th>
                            <th className={"p-3 text-center"}>%</th>
                        </tr>
                        </thead>
                        <tbody>
                        {records.map((r, i) => {
                            const pct = Math.round(r.present / r.total * 100)
                            return (
                                <tr key={i}
                                    className={`border-b border-gray-200 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-green-50 transition-colors`}>
                                    <td className={"p-3 font-medium text-gray-800"}>{r.learner}</td>
                                    <td className={"p-3 text-gray-600"}>{r.grade}</td>
                                    <td className={"p-3 text-center text-green-600 font-medium"}>{r.present}</td>
                                    <td className={"p-3 text-center text-red-500"}>{r.absent}</td>
                                    <td className={"p-3 text-center text-amber-500"}>{r.late}</td>
                                    <td className={"p-3 text-center"}>
                  <span className={`font-semibold ${pct >= 90 ? "text-green-600" : pct >= 80 ? "text-amber-600" : "text-red-600"}`}>
                    {pct}%
                  </span>
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </div>

                <div className={"mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800"}>
                    <strong>Note:</strong> Attendance figures are updated weekly. Please report any discrepancies to
                    the class teacher or admin office.
                </div>
            </div>
        </section>
    )
}
