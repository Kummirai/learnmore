"use client"

import {useState} from "react"
import Link from "next/link"
import {LuChevronDown} from "react-icons/lu"

const faqs = [
    {
        q: "Is Relate really free to join?",
        a: "Yes. Every club, weekly program and prayer time is completely free. Sponsorship covers school fees, uniforms and meals for families who need a hand — no one pays to belong."
    },
    {
        q: "Which club is right for me or my family?",
        a: "There's a club for every season of life: Sprout (children 6–15), Surge (16–21), Pulse (21–33), Prime (singles 33+), Anchor (single parents), Spark (0–5 years married) and Synergy (6+ years married). Message us on WhatsApp and we'll help you find your crew."
    },
    {
        q: "What happens at a typical club gathering?",
        a: "Each club meets weekly — games, real conversations and practical skills, with an optional faith component. Sprout runs Saturday morning activities, Pulse hosts monthly networking, Synergy hosts couples’ retreats. Every program serves a meal or snack."
    },
    {
        q: "Do I need to be religious to join?",
        a: "Not at all. Prayer groups, worship nights and Bible study are optional and open to everyone. Most members come for the community, the skills and the support — faith is there if and when you want it."
    },
]

export default function FaqSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    return (
        <section className={"reveal bg-stage px-4 py-24 md:py-36"}>
            <div className={"max-w-3xl mx-auto"}>
                <div className={"mb-12 text-center"}>
                    <p className={"mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-navy/70"}>FAQ</p>
                    <h2 className={"text-3xl md:text-4xl font-semibold text-navy"}>
                        Frequently asked questions
                    </h2>
                </div>
                <div className={"space-y-3 mb-8"}>
                    {faqs.map((faq, i) => (
                        <div key={i} className={"bg-white rounded-2xl overflow-hidden border border-black/5"}>
                            <button onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                    className={"w-full flex items-center justify-between p-5 text-left hover:bg-tile transition-colors"}>
                                <span className={"font-medium text-navy text-sm md:text-base pr-4"}>{faq.q}</span>
                                <LuChevronDown
                                    className={`text-lg text-navy/60 shrink-0 transition-transform duration-300 ${openIndex === i ? "rotate-180" : ""}`}/>
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ${openIndex === i ? "max-h-none" : "max-h-0"}`}>
                                <div className={"px-5 pb-5 text-sm text-navy/75 leading-relaxed border-t border-black/5 pt-4"}>
                                    {faq.a}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className={"text-center"}>
                    <Link href={"/faq"}
                          className={"link-chevron"}>
                        View all FAQs
                    </Link>
                </div>
            </div>
        </section>
    )
}
