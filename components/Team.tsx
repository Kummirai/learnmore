import {FaFacebook, FaTwitter, FaInstagramSquare} from "react-icons/fa";

export default function Team() {
    const team = [
        {
            name: "Dr. Sarah Johnson",
            role: "Principal & Founder",
            initials: "SJ",
            color: "bg-green-600"
        },
        {
            name: "Mr. Mark Williams",
            role: "Deputy Principal",
            initials: "MW",
            color: "bg-blue-500"
        },
        {
            name: "Ms. Emily Chen",
            role: "Foundation Phase Head (R-3)",
            initials: "EC",
            color: "bg-purple-500"
        },
        {
            name: "Mr. David Okafor",
            role: "Intermediate Phase Head (4-7)",
            initials: "DO",
            color: "bg-orange-500"
        }
    ]

    return (
        <section className={"py-16 md:py-24 bg-white px-4"}>
            <div className={"max-w-6xl mx-auto"}>
                <div className={"text-center mb-12 md:mb-16"}>
                    <h4 className={"text-green-600 font-medium mb-3"}>OUR TEAM</h4>
                    <h2 className={"text-3xl md:text-4xl font-semibold text-gray-800"}>
                        Meet Our Dedicated <br className={"hidden sm:block"}/>
                        Educators
                    </h2>
                </div>
                <div className={"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"}>
                    {team.map((member, i) => (
                        <div key={i}
                             className={"text-center group"}>
                            <div
                                className={`size-32 sm:size-36 mx-auto rounded-full ${member.color} flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300`}>
                                <span
                                    className={"text-3xl sm:text-4xl font-bold text-white"}>{member.initials}</span>
                            </div>
                            <h3 className={"text-lg font-semibold text-gray-800"}>{member.name}</h3>
                            <p className={"text-green-600 text-sm mb-3"}>{member.role}</p>
                            <div className={"flex items-center justify-center gap-3 text-gray-400"}>
                                <FaFacebook className={"hover:text-green-600 cursor-pointer transition-colors"}/>
                                <FaTwitter className={"hover:text-green-600 cursor-pointer transition-colors"}/>
                                <FaInstagramSquare
                                    className={"hover:text-green-600 cursor-pointer transition-colors"}/>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
