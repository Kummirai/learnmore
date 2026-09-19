import Link from "next/link"
import {LuArrowLeft, LuSearch, LuPlus, LuShirt, LuLaptop, LuBox, LuBook} from "react-icons/lu"
import {GrAccessibility} from "react-icons/gr"

type LostItem = {item: string; description: string; date: string; location: string; icon: React.ReactNode; status: "Lost" | "Found"}

const items: LostItem[] = [
    {item: "Green school jersey (size 10)", description: "Name tag: T. Mokoena. Lost on the sports field during break.", date: "13 May 2026", location: "Sports Field", icon: <LuShirt/>, status: "Lost"},
    {item: "Black lunch box (Batman)", description: "Found near the Grade 4 classroom. Unclaimed.", date: "12 May 2026", location: "Grade 4 Area", icon: <LuBox/>, status: "Found"},
    {item: "Navy water bottle (BPA-free)", description: "Label says 'J. Koen'. Left on the library desk.", date: "11 May 2026", location: "Library", icon: <LuBox/>, status: "Lost"},
    {item: "Pair of glasses (blue frame)", description: "Found in the school hall after assembly.", date: "10 May 2026", location: "School Hall", icon: <GrAccessibility/>, status: "Found"},
    {item: "Grade 6 Maths workbook", description: "Name on cover: P. Naidoo. Lost during aftercare.", date: "9 May 2026", location: "Aftercare Room", icon: <LuBook/>, status: "Lost"},
    {item: "White takkies (size 3)", description: "Found next to the jungle gym. One left behind.", date: "8 May 2026", location: "Playground", icon: <GrAccessibility/>, status: "Found"},
    {item: "Tablet in green case", description: "Lost near the computer lab. School property — please return to admin.", date: "7 May 2026", location: "Computer Lab", icon: <LuLaptop/>, status: "Lost"},
]

export default function LostFoundPage() {
    return (
        <section className={"flex-1 px-4 py-12"}>
            <div className={"max-w-6xl mx-auto"}>
                <Link href={"/"}
                      className={"inline-flex items-center gap-1 text-sm text-cyan hover:text-cyan-dark mb-6 transition-colors"}>
                    <LuArrowLeft/> Back to Home
                </Link>

                <div className={"text-center mb-12"}>
                    <div className={"flex items-center justify-center gap-3 mb-3"}>
                        <LuSearch className={"text-3xl text-cyan"}/>
                        <h1 className={"text-3xl md:text-4xl font-semibold text-gray-800"}>Lost & Found</h1>
                    </div>
                    <p className={"text-gray-500 max-w-xl mx-auto"}>
                        Report lost items or browse found property. Check here before buying replacements!
                    </p>
                </div>

                <div className={"max-w-3xl mx-auto space-y-4"}>
                    {items.map((item, i) => (
                        <div key={i}
                             className={`rounded-xl border p-4 md:p-5 flex items-start gap-4 transition-shadow hover:shadow-md ${item.status === "Lost" ? "bg-white border-gray-200" : "bg-alice-blue border-ice-blue"}`}>
                            <div className={`text-xl shrink-0 mt-1 ${item.status === "Lost" ? "text-gray-400" : "text-cyan"}`}>
                                {item.icon}
                            </div>
                            <div className={"flex-1 min-w-0"}>
                                <div className={"flex items-start justify-between gap-2 flex-wrap"}>
                                    <h2 className={"font-semibold text-gray-800"}>{item.item}</h2>
                                    <span
                                        className={`text-xs font-medium px-2 py-0.5 rounded shrink-0 ${item.status === "Lost" ? "bg-red-100 text-red-700" : "bg-ice-blue text-navy-dark"}`}>
                                        {item.status}
                                    </span>
                                </div>
                                <p className={"text-sm text-gray-600 mt-1"}>{item.description}</p>
                                <div className={"flex items-center gap-3 mt-2 text-xs text-gray-400"}>
                                    <span>{item.date}</span>
                                    <span>&middot;</span>
                                    <span>{item.location}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={"text-center mt-8"}>
                    <Link href={"/contact"}
                          className={"inline-flex items-center gap-2 bg-navy text-white px-6 py-3 rounded-lg hover:bg-navy-dark transition-colors"}>
                        <LuPlus/> Report a Lost or Found Item
                    </Link>
                </div>
            </div>
        </section>
    )
}
