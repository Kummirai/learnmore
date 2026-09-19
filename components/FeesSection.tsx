import Link from "next/link"
import {LuArrowRight} from "react-icons/lu"

const fees = [
    {grade: "Grade R", monthly: "R 600", annual: "R 7,200", featured: false},
    {grade: "Grade 1 - 3", monthly: "R 650", annual: "R 7,800", featured: true},
    {grade: "Grade 4 - 5", monthly: "R 700", annual: "R 8,400", featured: false},
    {grade: "Grade 6 - 7", monthly: "R 750", annual: "R 9,000", featured: false},
]

export default function FeesSection() {
    return (
        <section className={"py-16 md:py-24 bg-gray-50 px-4"}>
            <div className={"max-w-6xl mx-auto"}>
                <div className={"text-center mb-12 md:mb-16"}>
                    <h4 className={"text-cyan font-medium mb-3"}>SCHOOL FEES</h4>
                    <h2 className={"text-3xl md:text-4xl font-semibold text-gray-800"}>
                        Affordable & <span className={"text-cyan"}>Transparent</span>
                    </h2>
                    <p className={"text-gray-500 max-w-xl mx-auto mt-3"}>
                        2026 academic year fees. Payment plans and sibling discounts available.
                    </p>
                </div>
                <div className={"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"}>
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
                <div className={"text-center"}>
                    <Link href={"/fees"}
                          className={"inline-flex items-center gap-2 text-cyan font-medium text-sm hover:text-cyan-dark transition-colors"}>
                        View Full Fee Breakdown <LuArrowRight/>
                    </Link>
                </div>
            </div>
        </section>
    )
}
