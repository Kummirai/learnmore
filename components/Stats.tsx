import {LuUsers, LuBookOpen, LuHeartHandshake, LuCalendar} from "react-icons/lu";

export default function Stats() {
    const stats = [
        {icon: <LuUsers className={"text-4xl"}/>, value: "850+", label: "Happy Learners"},
        {icon: <LuBookOpen className={"text-4xl"}/>, value: "14", label: "Subjects Offered"},
        {icon: <LuHeartHandshake className={"text-4xl"}/>, value: "60+", label: "Dedicated Staff"},
        {icon: <LuCalendar className={"text-4xl"}/>, value: "25+", label: "Years of Excellence"}
    ]

    return (
        <section className={"py-16 md:py-20 bg-navy px-4"}>
            <div className={"max-w-6xl mx-auto"}>
                <div className={"grid grid-cols-2 lg:grid-cols-4 gap-8"}>
                    {stats.map((stat, i) => (
                        <div key={i} className={"text-center text-white"}>
                            <div className={"flex justify-center mb-4"}>{stat.icon}</div>
                            <p className={"text-3xl md:text-4xl font-bold mb-1"}>{stat.value}</p>
                            <p className={"text-cyan-light text-sm md:text-base"}>{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
