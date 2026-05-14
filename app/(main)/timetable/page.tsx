import Link from "next/link"
import {LuArrowLeft, LuClock} from "react-icons/lu"

type DaySlot = {time: string; subject: string; teacher: string; room: string}
type DaySchedule = {day: string; slots: DaySlot[]}

const timetable: DaySchedule[] = [
    {
        day: "Monday", slots: [
        {time: "08:00 - 08:45", subject: "Mathematics", teacher: "Ms. Dlamini", room: "101"},
        {time: "08:45 - 09:30", subject: "English", teacher: "Mr. Botha", room: "102"},
        {time: "09:30 - 10:00", subject: "Break", teacher: "—", room: "—"},
        {time: "10:00 - 10:45", subject: "Life Skills", teacher: "Ms. Nkosi", room: "103"},
        {time: "10:45 - 11:30", subject: "Afrikaans", teacher: "Ms. van der Merwe", room: "104"},
        {time: "11:30 - 12:15", subject: "Creative Arts", teacher: "Mr. Jacobs", room: "Art Room"},
        {time: "12:15 - 13:00", subject: "Lunch", teacher: "—", room: "—"},
        {time: "13:00 - 13:45", subject: "Physical Education", teacher: "Coach Singh", room: "Field"},
    ]},
    {
        day: "Tuesday", slots: [
        {time: "08:00 - 08:45", subject: "English", teacher: "Mr. Botha", room: "102"},
        {time: "08:45 - 09:30", subject: "Mathematics", teacher: "Ms. Dlamini", room: "101"},
        {time: "09:30 - 10:00", subject: "Break", teacher: "—", room: "—"},
        {time: "10:00 - 10:45", subject: "Science", teacher: "Mr. Naidoo", room: "Lab"},
        {time: "10:45 - 11:30", subject: "Geography", teacher: "Ms. Nkosi", room: "103"},
        {time: "11:30 - 12:15", subject: "Music", teacher: "Ms. Ferreira", room: "Music Room"},
        {time: "12:15 - 13:00", subject: "Lunch", teacher: "—", room: "—"},
        {time: "13:00 - 13:45", subject: "Library", teacher: "Ms. Govender", room: "Library"},
    ]},
    {
        day: "Wednesday", slots: [
        {time: "08:00 - 08:45", subject: "Mathematics", teacher: "Ms. Dlamini", room: "101"},
        {time: "08:45 - 09:30", subject: "Afrikaans", teacher: "Ms. van der Merwe", room: "104"},
        {time: "09:30 - 10:00", subject: "Break", teacher: "—", room: "—"},
        {time: "10:00 - 10:45", subject: "English", teacher: "Mr. Botha", room: "102"},
        {time: "10:45 - 11:30", subject: "Life Skills", teacher: "Ms. Nkosi", room: "103"},
        {time: "11:30 - 12:15", subject: "Computers", teacher: "Mr. Naidoo", room: "Computer Lab"},
        {time: "12:15 - 13:00", subject: "Lunch", teacher: "—", room: "—"},
        {time: "13:00 - 13:45", subject: "Sport", teacher: "Coach Singh", room: "Field"},
    ]},
    {
        day: "Thursday", slots: [
        {time: "08:00 - 08:45", subject: "Science", teacher: "Mr. Naidoo", room: "Lab"},
        {time: "08:45 - 09:30", subject: "Mathematics", teacher: "Ms. Dlamini", room: "101"},
        {time: "09:30 - 10:00", subject: "Break", teacher: "—", room: "—"},
        {time: "10:00 - 10:45", subject: "English", teacher: "Mr. Botha", room: "102"},
        {time: "10:45 - 11:30", subject: "Creative Arts", teacher: "Mr. Jacobs", room: "Art Room"},
        {time: "11:30 - 12:15", subject: "History", teacher: "Ms. Nkosi", room: "103"},
        {time: "12:15 - 13:00", subject: "Lunch", teacher: "—", room: "—"},
        {time: "13:00 - 13:45", subject: "Choir", teacher: "Ms. Ferreira", room: "Music Room"},
    ]},
    {
        day: "Friday", slots: [
        {time: "08:00 - 08:45", subject: "Mathematics", teacher: "Ms. Dlamini", room: "101"},
        {time: "08:45 - 09:30", subject: "English", teacher: "Mr. Botha", room: "102"},
        {time: "09:30 - 10:00", subject: "Break", teacher: "—", room: "—"},
        {time: "10:00 - 10:45", subject: "Assembly", teacher: "Principal", room: "Hall"},
        {time: "10:45 - 11:30", subject: "Life Skills", teacher: "Ms. Nkosi", room: "103"},
        {time: "11:30 - 12:15", subject: "Free Period / Remedial", teacher: "Various", room: "—"},
        {time: "12:15 - 13:00", subject: "Lunch", teacher: "—", room: "—"},
        {time: "13:00 - 13:45", subject: "Sport", teacher: "Coach Singh", room: "Field"},
    ]},
]

export default function TimetablePage() {
    return (
        <section className={"flex-1 px-4 py-12"}>
            <div className={"max-w-6xl mx-auto"}>
                <Link href={"/"}
                      className={"inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-700 mb-6 transition-colors"}>
                    <LuArrowLeft/> Back to Home
                </Link>

                <div className={"text-center mb-12"}>
                    <div className={"flex items-center justify-center gap-3 mb-3"}>
                        <LuClock className={"text-3xl text-green-600"}/>
                        <h1 className={"text-3xl md:text-4xl font-semibold text-gray-800"}>Weekly Timetable</h1>
                    </div>
                    <p className={"text-gray-500 max-w-xl mx-auto"}>
                        A sample weekly schedule for Grade 4 — times, subjects, teachers, and rooms.
                    </p>
                </div>

                <div className={"grid grid-cols-1 md:grid-cols-5 gap-4"}>
                    {timetable.map(day => (
                        <div key={day.day}
                             className={"bg-white rounded-xl border border-gray-200 overflow-hidden"}>
                            <div className={"bg-green-600 text-white text-center py-3 font-semibold text-lg"}>
                                {day.day}
                            </div>
                            <div className={"p-3 space-y-2"}>
                                {day.slots.map((slot, i) => (
                                    <div key={i}
                                         className={`text-sm p-2 rounded ${slot.subject === "Break" || slot.subject === "Lunch" ? "bg-yellow-50 border border-yellow-200" : "bg-gray-50"}`}>
                                        <div className={"font-medium text-gray-700"}>{slot.time}</div>
                                        <div className={"font-semibold text-gray-800"}>{slot.subject}</div>
                                        {slot.teacher !== "—" && (
                                            <div className={"text-gray-500 text-xs"}>{slot.teacher} &middot; {slot.room}</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
