"use client"

import {useState} from "react"
import Link from "next/link"
import {LuChevronDown, LuArrowRight} from "react-icons/lu"

const faqs = [
    {
        q: "What are the school hours?",
        a: "School starts at 7:45 AM and ends at 1:00 PM for Grade R, and 2:00 PM for Grade 1-7. Aftercare is available until 5:30 PM."
    },
    {
        q: "How do I enroll my child?",
        a: "You can enroll by visiting our Enroll page and filling out the online form, or visit the school office to collect a paper application."
    },
    {
        q: "What is the learner-to-teacher ratio?",
        a: "Average class size is 25 learners per teacher in Foundation Phase (R-3) and 30 in Intermediate Phase (4-7)."
    },
    {
        q: "Do you offer aftercare and transport?",
        a: "Yes! Aftercare runs until 5:30 PM with homework supervision. School bus service covers a 15km radius."
    },
]

export default function FaqSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    return (
        <section className={"py-16 md:py-24 bg-white px-4"}>
            <div className={"max-w-3xl mx-auto"}>
                <div className={"text-center mb-12"}>
                    <h4 className={"text-green-600 font-medium mb-3"}>FAQ</h4>
                    <h2 className={"text-3xl md:text-4xl font-semibold text-gray-800"}>
                        Frequently Asked <span className={"text-green-600"}>Questions</span>
                    </h2>
                </div>
                <div className={"space-y-3 mb-8"}>
                    {faqs.map((faq, i) => (
                        <div key={i} className={"bg-gray-50 rounded-xl overflow-hidden"}>
                            <button onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                    className={"w-full flex items-center justify-between p-5 text-left hover:bg-gray-100 transition-colors"}>
                                <span className={"font-medium text-gray-800 text-sm md:text-base pr-4"}>{faq.q}</span>
                                <LuChevronDown
                                    className={`text-lg text-gray-400 shrink-0 transition-transform duration-300 ${openIndex === i ? "rotate-180" : ""}`}/>
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ${openIndex === i ? "max-h-60" : "max-h-0"}`}>
                                <div className={"px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-200 pt-4"}>
                                    {faq.a}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className={"text-center"}>
                    <Link href={"/faq"}
                          className={"inline-flex items-center gap-2 text-green-600 font-medium text-sm hover:text-green-700 transition-colors"}>
                        View All FAQs <LuArrowRight/>
                    </Link>
                </div>
            </div>
        </section>
    )
}
