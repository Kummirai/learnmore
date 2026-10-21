import {LuBookOpen, LuMessageCircleHeart, LuMoonStar, LuSun, LuHandHeart, LuUsers} from "react-icons/lu";

export default function Facilities() {
    const facilities = [
        {icon: <LuBookOpen className={"text-3xl text-white"}/>, label: "Verse of the Day", color: "bg-navy"},
        {icon: <LuMessageCircleHeart className={"text-3xl text-white"}/>, label: "Prayer Requests", color: "bg-blue-600"},
        {icon: <LuMoonStar className={"text-3xl text-white"}/>, label: "Bible Reading Guides", color: "bg-amber-600"},
        {icon: <LuSun className={"text-3xl text-white"}/>, label: "Daily Prayer Times", color: "bg-purple-600"},
        {icon: <LuHandHeart className={"text-3xl text-white"}/>, label: "Ask for Help", color: "bg-cyan-600"},
        {icon: <LuUsers className={"text-3xl text-white"}/>, label: "WhatsApp Communities", color: "bg-gold-700"},
    ]

    return (
        <section className={"reveal bg-white px-6 py-24 md:px-4 md:py-32"}>
            <div className={"max-w-6xl mx-auto"}>
                <div className={"mb-12 max-w-2xl md:mb-16"}>
                    <p className={"mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan"}>
                        Inside the app
                    </p>
                    <h2 className={"text-3xl md:text-4xl font-semibold text-navy"}>
                        Everything you need for daily growth
                    </h2>
                    <p className={"mt-4 text-lg text-navy/70"}>
                        Tools that keep your faith and community close — wherever the day takes you.
                    </p>
                </div>
                <div className={"grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"}>
                    {facilities.map((f, i) => (
                        <div key={i}
                             className={`${f.color} rounded-3xl p-6 text-center text-white hover:-translate-y-1 hover:shadow-lg transition-all cursor-pointer`}>
                            <div className={"flex justify-center mb-3"}>{f.icon}</div>
                            <span className={"text-sm font-medium"}>{f.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
