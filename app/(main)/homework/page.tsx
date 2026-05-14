import Link from "next/link"
import {LuArrowLeft, LuBookOpen} from "react-icons/lu"

type HomeworkItem = {grade: string; subject: string; task: string; due: string; assigned: string}

const homework: HomeworkItem[] = [
    {grade: "Grade 4", subject: "Mathematics", task: "Complete worksheet on fractions — page 12-15", due: "Fri 19 May", assigned: "Mon 15 May"},
    {grade: "Grade 4", subject: "English", task: "Write a paragraph about your favourite animal", due: "Thu 18 May", assigned: "Tue 16 May"},
    {grade: "Grade 5", subject: "Science", task: "Draw and label the water cycle", due: "Fri 19 May", assigned: "Mon 15 May"},
    {grade: "Grade 5", subject: "Afrikaans", task: "Lees bladsy 20-22 en beantwoord vrae 1-5", due: "Wed 17 May", assigned: "Mon 15 May"},
    {grade: "Grade 6", subject: "Mathematics", task: "Practice long division — 10 sums", due: "Fri 19 May", assigned: "Tue 16 May"},
    {grade: "Grade 6", subject: "Geography", task: "Research project: Choose an African country and write 5 facts", due: "Mon 22 May", assigned: "Tue 16 May"},
    {grade: "Grade 7", subject: "English", task: "Book review — write one page about your current reading book", due: "Fri 19 May", assigned: "Mon 15 May"},
    {grade: "Grade 7", subject: "History", task: "Timeline of the South African Gold Rush (1886-1900)", due: "Thu 18 May", assigned: "Mon 15 May"},
    {grade: "Grade 4", subject: "Life Skills", task: "Bring a picture of your family for our 'Me and My World' project", due: "Wed 17 May", assigned: "Mon 15 May"},
    {grade: "Grade 5", subject: "Creative Arts", task: "Complete your self-portrait using any medium", due: "Fri 19 May", assigned: "Tue 16 May"},
]

export default function HomeworkPage() {
    return (
        <section className={"flex-1 px-4 py-12"}>
            <div className={"max-w-6xl mx-auto"}>
                <Link href={"/"}
                      className={"inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-700 mb-6 transition-colors"}>
                    <LuArrowLeft/> Back to Home
                </Link>

                <div className={"text-center mb-12"}>
                    <div className={"flex items-center justify-center gap-3 mb-3"}>
                        <LuBookOpen className={"text-3xl text-green-600"}/>
                        <h1 className={"text-3xl md:text-4xl font-semibold text-gray-800"}>Homework Diary</h1>
                    </div>
                    <p className={"text-gray-500 max-w-xl mx-auto"}>
                        Keep up with daily and weekly homework assignments for each grade.
                    </p>
                </div>

                <div className={"overflow-x-auto"}>
                    <table className={"w-full text-sm border-collapse"}>
                        <thead>
                        <tr className={"bg-green-600 text-white"}>
                            <th className={"p-3 text-left"}>Grade</th>
                            <th className={"p-3 text-left"}>Subject</th>
                            <th className={"p-3 text-left"}>Task</th>
                            <th className={"p-3 text-left"}>Assigned</th>
                            <th className={"p-3 text-left"}>Due</th>
                        </tr>
                        </thead>
                        <tbody>
                        {homework.map((item, i) => (
                            <tr key={i}
                                className={`border-b border-gray-200 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-green-50 transition-colors`}>
                                <td className={"p-3 font-medium text-gray-800"}>{item.grade}</td>
                                <td className={"p-3 text-gray-700"}>{item.subject}</td>
                                <td className={"p-3 text-gray-600 max-w-xs"}>{item.task}</td>
                                <td className={"p-3 text-gray-500"}>{item.assigned}</td>
                                <td className={"p-3 font-medium"}><span
                                    className={"text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded"}>{item.due}</span></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    )
}
