import Link from "next/link"
import {LuArrowLeft, LuMegaphone} from "react-icons/lu"

type Announcement = {title: string; date: string; category: string; content: string; author: string}

const announcements: Announcement[] = [
    {
        title: "Winter Sports Day — Save the Date!",
        date: "14 May 2026",
        category: "Events",
        content: "Our annual Winter Sports Day will be held on Friday, 9 June. Learners from Grade R to 7 will participate in athletics, ball games, and fun relays. Parents are warmly invited to come and cheer. Please send a packed lunch and your child's school tracksuit.",
        author: "Coach Singh",
    },
    {
        title: "Parent-Teacher Evening: Term 2",
        date: "12 May 2026",
        category: "Parents",
        content: "The Term 2 Parent-Teacher Evening is scheduled for Tuesday, 30 May from 17:00 to 19:00. This is an opportunity to discuss your child's progress. Booking slots will open via the class WhatsApp groups. We look forward to seeing you.",
        author: "Ms. Dlamini",
    },
    {
        title: "Grade 7 — High School Application Workshop",
        date: "10 May 2026",
        category: "Grade 7",
        content: "Attention Grade 7 parents: We are hosting a High School Application Workshop on Thursday, 25 May at 18:00 in the school hall. We will cover application timelines, required documents, and entrance exam preparation. Refreshments will be provided.",
        author: "Principal",
    },
    {
        title: "Book Fair Next Week!",
        date: "8 May 2026",
        category: "Events",
        content: "The Scholastic Book Fair is coming to Learnmore! From 22-26 May, learners can browse and purchase books in the library. Every purchase helps the school earn free books for our library. Parents are welcome to visit during school hours.",
        author: "Ms. Govender",
    },
    {
        title: "Lost & Found Collection",
        date: "6 May 2026",
        category: "General",
        content: "Our lost and found box is overflowing! Please check the table outside the admin office for any missing items — labelled water bottles, jerseys, lunch boxes, and more. Unclaimed items will be donated on 1 June.",
        author: "Admin Office",
    },
    {
        title: "Homework Club Starting Next Week",
        date: "4 May 2026",
        category: "Academics",
        content: "We are excited to launch our after-school Homework Club! Running every Tuesday and Thursday from 14:00-15:30 in the Grade 6 classroom. Learners can complete homework with teacher supervision. Cost: R50 per session. Sign up at the admin office.",
        author: "Mr. Botha",
    },
    {
        title: "School Uniform Reminder",
        date: "2 May 2026",
        category: "General",
        content: "As the weather cools, please ensure your child wears the correct winter uniform: long-sleeved white shirt, green jersey or cardigan, grey trousers or skirt, and black shoes. No hoodies or non-regulation jackets, please.",
        author: "Admin Office",
    },
]

export default function AnnouncementsPage() {
    return (
        <section className={"flex-1 px-4 py-12"}>
            <div className={"max-w-6xl mx-auto"}>
                <Link href={"/"}
                      className={"inline-flex items-center gap-1 text-sm text-cyan hover:text-cyan-dark mb-6 transition-colors"}>
                    <LuArrowLeft/> Back to Home
                </Link>

                <div className={"text-center mb-12"}>
                    <div className={"flex items-center justify-center gap-3 mb-3"}>
                        <LuMegaphone className={"text-3xl text-cyan"}/>
                        <h1 className={"text-3xl md:text-4xl font-semibold text-gray-800"}>Class Announcements</h1>
                    </div>
                    <p className={"text-gray-500 max-w-xl mx-auto"}>
                        Stay up to date with the latest school news, events, and important notices.
                    </p>
                </div>

                <div className={"max-w-3xl mx-auto space-y-6"}>
                    {announcements.map((a, i) => (
                        <div key={i}
                             className={"bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"}>
                            <div className={"flex items-start justify-between mb-2 flex-wrap gap-2"}>
                                <h2 className={"text-lg font-semibold text-gray-800"}>{a.title}</h2>
                                <span
                                    className={"text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded whitespace-nowrap"}>{a.date}</span>
                            </div>
                            <div className={"flex items-center gap-2 mb-3"}>
                                <span
                                    className={"text-xs font-medium text-navy-dark bg-ice-blue px-2 py-0.5 rounded"}>{a.category}</span>
                                <span className={"text-xs text-gray-400"}>Posted by {a.author}</span>
                            </div>
                            <p className={"text-sm text-gray-600 leading-relaxed"}>{a.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
