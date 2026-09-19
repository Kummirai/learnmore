import {LuBookOpen, LuMonitor, LuTrophy, LuMusic, LuFlaskRound, LuTrees} from "react-icons/lu";

export default function Facilities() {
    const facilities = [
        {icon: <LuBookOpen className={"text-3xl text-white"}/>, label: "Library", color: "bg-navy"},
        {icon: <LuMonitor className={"text-3xl text-white"}/>, label: "Computer Lab", color: "bg-blue-600"},
        {icon: <LuTrophy className={"text-3xl text-white"}/>, label: "Sports Field", color: "bg-amber-600"},
        {icon: <LuMusic className={"text-3xl text-white"}/>, label: "Music Room", color: "bg-purple-600"},
        {icon: <LuFlaskRound className={"text-3xl text-white"}/>, label: "Science Lab", color: "bg-cyan-600"},
        {icon: <LuTrees className={"text-3xl text-white"}/>, label: "Playground", color: "bg-emerald-600"},
    ]

    return (
        <section className={"py-16 md:py-24 bg-white px-4"}>
            <div className={"max-w-6xl mx-auto"}>
                <div className={"text-center mb-12 md:mb-16"}>
                    <h4 className={"text-cyan font-medium mb-3"}>OUR FACILITIES</h4>
                    <h2 className={"text-3xl md:text-4xl font-semibold text-gray-800"}>
                        A Campus Designed for <span className={"text-cyan"}>Discovery</span>
                    </h2>
                    <p className={"text-gray-500 max-w-xl mx-auto mt-3"}>
                        Purpose-built spaces that inspire learning, creativity, and active play.
                    </p>
                </div>
                <div className={"grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"}>
                    {facilities.map((f, i) => (
                        <div key={i}
                             className={`${f.color} rounded-xl p-6 text-center text-white hover:scale-105 transition-transform cursor-pointer`}>
                            <div className={"flex justify-center mb-3"}>{f.icon}</div>
                            <span className={"text-sm font-medium"}>{f.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
