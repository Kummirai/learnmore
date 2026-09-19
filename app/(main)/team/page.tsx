import Link from "next/link"
import {LuArrowLeft} from "react-icons/lu"
import {FaFacebook, FaTwitter, FaInstagramSquare} from "react-icons/fa"

const staff = [
    {name: "Dr. Sarah Johnson", role: "Principal & Founder", initials: "SJ", color: "bg-navy", dept: "Leadership"},
    {name: "Mr. Mark Williams", role: "Deputy Principal", initials: "MW", color: "bg-blue-600", dept: "Leadership"},
    {name: "Ms. Emily Chen", role: "Foundation Phase Head", initials: "EC", color: "bg-purple-600", dept: "Leadership"},
    {name: "Mr. David Okafor", role: "Intermediate Phase Head", initials: "DO", color: "bg-orange-600", dept: "Leadership"},
    {name: "Mrs. Thandi Zulu", role: "Grade R Teacher", initials: "TZ", color: "bg-pink-600", dept: "Foundation Phase"},
    {name: "Miss Lisa Pretorius", role: "Grade 1 Teacher", initials: "LP", color: "bg-rose-600", dept: "Foundation Phase"},
    {name: "Mr. James Nkosi", role: "Grade 2 Teacher", initials: "JN", color: "bg-amber-600", dept: "Foundation Phase"},
    {name: "Mrs. Priya Naidoo", role: "Grade 3 Teacher", initials: "PN", color: "bg-teal-600", dept: "Foundation Phase"},
    {name: "Mr. Robert Molefe", role: "Mathematics Teacher", initials: "RM", color: "bg-cyan-600", dept: "Intermediate Phase"},
    {name: "Ms. Anna van Wyk", role: "Science Teacher", initials: "AV", color: "bg-indigo-600", dept: "Intermediate Phase"},
    {name: "Mrs. Grace Osei", role: "English Teacher", initials: "GO", color: "bg-violet-600", dept: "Intermediate Phase"},
    {name: "Mr. Samuel Chen", role: "Physical Education", initials: "SC", color: "bg-lime-600", dept: "Specialist"},
    {name: "Ms. Zara Abrahams", role: "Creative Arts Teacher", initials: "ZA", color: "bg-fuchsia-600", dept: "Specialist"},
    {name: "Mrs. Kate Mokoena", role: "Music & Choir", initials: "KM", color: "bg-sky-600", dept: "Specialist"},
    {name: "Mr. Patrick du Toit", role: "ICT & Digital Literacy", initials: "PD", color: "bg-stone-600", dept: "Specialist"},
    {name: "Mrs. Susan Lee", role: "Learning Support", initials: "SL", color: "bg-emerald-600", dept: "Support"},
]

const departments = ["Leadership", "Foundation Phase", "Intermediate Phase", "Specialist", "Support"] as const

export default function TeamPage() {
    return (
        <section className={"flex-1 px-4 py-12"}>
            <div className={"max-w-6xl mx-auto"}>
                <Link href={"/"}
                      className={"inline-flex items-center gap-1 text-sm text-cyan hover:text-cyan-dark mb-6 transition-colors"}>
                    <LuArrowLeft/> Back to Home
                </Link>

                <div className={"text-center mb-12"}>
                    <h1 className={"text-3xl md:text-4xl font-semibold text-gray-800 mb-3"}>Our Staff</h1>
                    <p className={"text-gray-500 max-w-xl mx-auto"}>Meet the dedicated team of educators and support staff who make LearnMore a special place to learn and grow.</p>
                </div>

                {departments.map(dept => {
                    const members = staff.filter(s => s.dept === dept)
                    if (!members.length) return null
                    return (
                        <div key={dept} className={"mb-12"}>
                            <h2 className={"text-lg font-semibold text-cyan mb-6 border-b border-gray-200 pb-2"}>{dept}</h2>
                            <div className={"grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"}>
                                {members.map((s, i) => (
                                    <div key={i} className={"bg-white rounded-xl p-5 text-center shadow-sm hover:shadow-md transition-shadow"}>
                                        <div className={`size-16 sm:size-20 mx-auto rounded-full ${s.color} flex items-center justify-center mb-3`}>
                                            <span className={"text-xl sm:text-2xl font-bold text-white"}>{s.initials}</span>
                                        </div>
                                        <h3 className={"font-semibold text-gray-800 text-sm"}>{s.name}</h3>
                                        <p className={"text-cyan text-xs mb-3"}>{s.role}</p>
                                        <div className={"flex items-center justify-center gap-2 text-gray-400"}>
                                            <FaFacebook className={"hover:text-cyan cursor-pointer transition-colors text-sm"}/>
                                            <FaTwitter className={"hover:text-cyan cursor-pointer transition-colors text-sm"}/>
                                            <FaInstagramSquare className={"hover:text-cyan cursor-pointer transition-colors text-sm"}/>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}
