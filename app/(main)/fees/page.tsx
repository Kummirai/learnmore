import Link from "next/link"
import {LuArrowLeft, LuCheck, LuX} from "react-icons/lu"

const fees = [
    {
        grade: "Grade R",
        monthly: "R 600",
        annual: "R 7,200",
        featured: false,
    },
    {
        grade: "Grade 1 - 3",
        monthly: "R 650",
        annual: "R 7,800",
        featured: true,
    },
    {
        grade: "Grade 4 - 5",
        monthly: "R 700",
        annual: "R 8,400",
        featured: false,
    },
    {
        grade: "Grade 6 - 7",
        monthly: "R 750",
        annual: "R 9,000",
        featured: false,
    },
]

const included = [
    "All textbooks and workbooks",
    "Stationery pack",
    "Computer lab access",
    "Library membership",
    "Sports participation",
    "Choir & music programs",
    "School trips (1 per term)",
    "Aftercare (until 4:30PM)",
]

const extra = [
    "Holiday care program: R 150/day",
    "Private music lessons: R 350/month",
    "Bus transport: R 600/month",
    "School uniform: From R 450",
    "Extramural sports kit: From R 300",
]

export default function FeesPage() {
    return (
        <section className={"flex-1 px-4 py-12"}>
            <div className={"max-w-6xl mx-auto"}>
                <Link href={"/"}
                      className={"inline-flex items-center gap-1 text-sm text-cyan hover:text-cyan-dark mb-6 transition-colors"}>
                    <LuArrowLeft/> Back to Home
                </Link>

                <div className={"text-center mb-10"}>
                    <h1 className={"text-3xl md:text-4xl font-semibold text-gray-800 mb-3"}>School Fees</h1>
                    <p className={"text-gray-500 max-w-xl mx-auto"}>Affordable, transparent fee structure for the 2026 academic year. Payment plans available.</p>
                </div>

                <div className={"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"}>
                    {fees.map((f, i) => (
                        <div key={i}
                             className={`bg-white rounded-xl p-6 shadow-sm border-2 text-center ${f.featured ? "border-cyan relative" : "border-transparent"}`}>
                            {f.featured && (
                                <span className={"absolute -top-3 left-1/2 -translate-x-1/2 bg-navy text-white text-xs font-medium px-4 py-1 rounded-full"}>
                                    Most Popular
                                </span>
                            )}
                            <h3 className={"text-lg font-semibold text-gray-800 mb-1"}>{f.grade}</h3>
                            <p className={"text-3xl font-bold text-cyan mb-1"}>{f.monthly}</p>
                            <p className={"text-sm text-gray-500 mb-4"}>per month / <span className={"text-gray-700"}>{f.annual}</span> annually</p>
                            <Link href={"/enroll"}
                                  className={`block text-sm font-medium py-2.5 rounded transition-colors ${f.featured ? "bg-navy text-white hover:bg-navy-dark" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                                Enroll Now
                            </Link>
                        </div>
                    ))}
                </div>

                <div className={"grid grid-cols-1 md:grid-cols-2 gap-8"}>
                    <div className={"bg-white rounded-xl p-8 shadow-sm"}>
                        <h2 className={"text-lg font-semibold text-gray-800 mb-4"}>Fees Include</h2>
                        <ul className={"space-y-2"}>
                            {included.map((item, i) => (
                                <li key={i} className={"flex items-start gap-2 text-sm text-gray-600"}>
                                    <LuCheck className={"text-cyan mt-0.5 shrink-0"}/>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className={"bg-white rounded-xl p-8 shadow-sm"}>
                        <h2 className={"text-lg font-semibold text-gray-800 mb-4"}>Additional Costs</h2>
                        <ul className={"space-y-2"}>
                            {extra.map((item, i) => (
                                <li key={i} className={"flex items-start gap-2 text-sm text-gray-600"}>
                                    <LuX className={"text-orange-500 mt-0.5 shrink-0"}/>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                        <p className={"text-xs text-gray-400 mt-4"}>* All fees are per term unless otherwise noted.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
