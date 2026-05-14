import Link from "next/link"
import {LuArrowLeft, LuCake} from "react-icons/lu"

type Birthday = {name: string; grade: string; date: string; day: number}

const months = [
    {name: "January", birthdays: [
        {name: "Aisha B.", grade: "Grade 4", date: "3 Jan", day: 3},
        {name: "Liam P.", grade: "Grade 5", date: "15 Jan", day: 15},
        {name: "Chloe D.", grade: "Grade 7", date: "22 Jan", day: 22},
    ]},
    {name: "February", birthdays: [
        {name: "Sipho D.", grade: "Grade 6", date: "8 Feb", day: 8},
        {name: "Mia K.", grade: "Grade 4", date: "14 Feb", day: 14},
        {name: "Ethan R.", grade: "Grade 7", date: "28 Feb", day: 28},
    ]},
    {name: "March", birthdays: [
        {name: "Thandi M.", grade: "Grade 5", date: "5 Mar", day: 5},
        {name: "Oliver S.", grade: "Grade 4", date: "19 Mar", day: 19},
        {name: "Zoe N.", grade: "Grade 6", date: "27 Mar", day: 27},
    ]},
    {name: "April", birthdays: [
        {name: "James K.", grade: "Grade 7", date: "2 Apr", day: 2},
        {name: "Amara O.", grade: "Grade 5", date: "16 Apr", day: 16},
        {name: "Lwazi M.", grade: "Grade 4", date: "25 Apr", day: 25},
    ]},
    {name: "May", birthdays: [
        {name: "Priya N.", grade: "Grade 7", date: "1 May", day: 1},
        {name: "Daniel W.", grade: "Grade 6", date: "12 May", day: 12},
        {name: "Sarah V.", grade: "Grade 5", date: "20 May", day: 20},
        {name: "Tumelo R.", grade: "Grade 4", date: "29 May", day: 29},
    ]},
    {name: "June", birthdays: [
        {name: "Emma L.", grade: "Grade 4", date: "7 Jun", day: 7},
        {name: "Nadia F.", grade: "Grade 6", date: "18 Jun", day: 18},
        {name: "Kgomotso S.", grade: "Grade 7", date: "24 Jun", day: 24},
    ]},
    {name: "July", birthdays: [
        {name: "Ryan T.", grade: "Grade 5", date: "4 Jul", day: 4},
        {name: "Jessica P.", grade: "Grade 4", date: "11 Jul", day: 11},
        {name: "Buhle Z.", grade: "Grade 6", date: "23 Jul", day: 23},
    ]},
    {name: "August", birthdays: [
        {name: "Michael H.", grade: "Grade 7", date: "6 Aug", day: 6},
        {name: "Naledi M.", grade: "Grade 5", date: "15 Aug", day: 15},
        {name: "Fiona G.", grade: "Grade 4", date: "30 Aug", day: 30},
    ]},
    {name: "September", birthdays: [
        {name: "Dylan B.", grade: "Grade 6", date: "2 Sep", day: 2},
        {name: "Keitumetse P.", grade: "Grade 7", date: "13 Sep", day: 13},
        {name: "Hannah W.", grade: "Grade 4", date: "21 Sep", day: 21},
    ]},
    {name: "October", birthdays: [
        {name: "Troy N.", grade: "Grade 5", date: "5 Oct", day: 5},
        {name: "Mbali D.", grade: "Grade 6", date: "19 Oct", day: 19},
        {name: "Jenna K.", grade: "Grade 7", date: "31 Oct", day: 31},
    ]},
    {name: "November", birthdays: [
        {name: "Caleb R.", grade: "Grade 4", date: "8 Nov", day: 8},
        {name: "Zara M.", grade: "Grade 5", date: "17 Nov", day: 17},
        {name: "Themba N.", grade: "Grade 6", date: "26 Nov", day: 26},
    ]},
    {name: "December", birthdays: [
        {name: "Megan S.", grade: "Grade 7", date: "3 Dec", day: 3},
        {name: "Katlego M.", grade: "Grade 4", date: "14 Dec", day: 14},
        {name: "Nina W.", grade: "Grade 5", date: "25 Dec", day: 25},
    ]},
]

export default function BirthdaysPage() {
    return (
        <section className={"flex-1 px-4 py-12"}>
            <div className={"max-w-6xl mx-auto"}>
                <Link href={"/"}
                      className={"inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-700 mb-6 transition-colors"}>
                    <LuArrowLeft/> Back to Home
                </Link>

                <div className={"text-center mb-12"}>
                    <div className={"flex items-center justify-center gap-3 mb-3"}>
                        <LuCake className={"text-3xl text-green-600"}/>
                        <h1 className={"text-3xl md:text-4xl font-semibold text-gray-800"}>Birthday Calendar</h1>
                    </div>
                    <p className={"text-gray-500 max-w-xl mx-auto"}>
                        Celebrating our learners all year round! Check who is celebrating this month.
                    </p>
                </div>

                <div className={"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"}>
                    {months.map((month, i) => (
                        <div key={i}
                             className={"bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"}>
                            <div className={"bg-green-600 text-white text-center py-2 font-semibold text-sm"}>
                                {month.name}
                            </div>
                            <div className={"p-3 space-y-2"}>
                                {month.birthdays.length > 0 ? month.birthdays.map((b, j) => (
                                    <div key={j} className={"text-sm flex items-center justify-between"}>
                                        <div>
                                            <span className={"font-medium text-gray-800"}>{b.name}</span>
                                            <span className={"text-gray-400 ml-1"}>{b.grade}</span>
                                        </div>
                                        <span className={"text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded"}>
                                            {b.date}
                                        </span>
                                    </div>
                                )) : (
                                    <p className={"text-sm text-gray-400 text-center py-2"}>No birthdays</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
