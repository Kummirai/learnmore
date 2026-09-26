

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

const events = [
    {date: "15 Jan", title: "First Day of Term 1", type: "Important"},
    {date: "21 Mar", title: "Human Rights Day - School Closed", type: "Holiday"},
    {date: "28 Mar", title: "Term 1 Ends", type: "Important"},
    {date: "15 Apr", title: "Term 2 Begins", type: "Important"},
    {date: "27 Apr", title: "Freedom Day - School Closed", type: "Holiday"},
    {date: "15 Jun", title: "Winter Sports Day", type: "Event"},
    {date: "20 Jun", title: "Term 2 Ends", type: "Important"},
    {date: "12 Jul", title: "Term 3 Begins", type: "Important"},
    {date: "25 Jul", title: "Science Fair", type: "Event"},
    {date: "9 Aug", title: "Women's Day - School Closed", type: "Holiday"},
    {date: "15 Sep", title: "Heritage Day Celebrations", type: "Event"},
    {date: "19 Sep", title: "Term 3 Ends", type: "Important"},
    {date: "6 Oct", title: "Term 4 Begins", type: "Important"},
    {date: "15 Nov", title: "Grade 7 Farewell", type: "Event"},
    {date: "5 Dec", title: "Prize Giving Ceremony", type: "Event"},
    {date: "12 Dec", title: "Term 4 Ends / School Closes", type: "Important"},
]

const typeColor: Record<string, string> = {
    Important: "bg-ice-blue text-navy-dark border-cyan-dark",
    Holiday: "bg-red-100 text-red-700 border-red-300",
    Event: "bg-blue-100 text-blue-700 border-blue-300",
}

export default function CalendarPage() {
    return (
        <section className={"flex-1 px-4 py-12"}>
            <div className={"max-w-4xl mx-auto"}>
                <div className={"text-center mb-10"}>
                    <h1 className={"text-3xl md:text-4xl font-semibold text-gray-800 mb-3"}>School Calendar</h1>
                    <p className={"text-gray-500 max-w-xl mx-auto"}>Important dates, holidays, and events for the 2026 academic year.</p>
                </div>

                <div className={"flex flex-wrap gap-2 mb-6"}>
                    {Object.entries(typeColor).map(([type]) => (
                        <span key={type}
                              className={`text-xs px-3 py-1 rounded border ${typeColor[type]}`}>{type}</span>
                    ))}
                </div>

                <div className={"space-y-3"}>
                    {events.map((e, i) => (
                        <div key={i}
                             className={`bg-white rounded-lg p-4 border-l-4 ${e.type === "Important" ? "border-l-cyan" : e.type === "Holiday" ? "border-l-red-500" : "border-l-blue-500"} flex items-center justify-between hover:shadow-sm transition-shadow`}>
                            <div className={"flex items-center gap-4"}>
                                <div className={"text-center w-14 shrink-0"}>
                                    <p className={"text-xs text-gray-400"}>{e.date.split(" ")[0]}</p>
                                    <p className={"text-lg font-bold text-gray-800 leading-tight"}>{e.date.split(" ")[1]}</p>
                                </div>
                                <div>
                                    <p className={"font-medium text-gray-800 text-sm"}>{e.title}</p>
                                </div>
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded border ${typeColor[e.type] || ""} shrink-0`}>
                                {e.type}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
