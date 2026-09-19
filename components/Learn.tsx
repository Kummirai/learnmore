import {LuHeart, LuUsers, LuShield, LuSparkles} from "react-icons/lu";

export default function Learn() {
    const features = [
        {
            icon: <LuHeart className={"text-4xl text-cyan"}/>,
            title: "Qualified Educators",
            description: "Our passionate teachers nurture each child's unique talents and create a love for learning."
        },
        {
            icon: <LuUsers className={"text-4xl text-cyan"}/>,
            title: "Small Classes",
            description: "Small class sizes ensure every learner gets the attention and support they deserve."
        },
        {
            icon: <LuShield className={"text-4xl text-cyan"}/>,
            title: "Safe & Nurturing",
            description: "A warm, caring environment where children feel safe, valued, and inspired to grow."
        },
        {
            icon: <LuSparkles className={"text-4xl text-cyan"}/>,
            title: "Holistic Growth",
            description: "Balancing academics, sports, arts, and life skills for well-rounded development."
        }
    ]

    return (
        <section className={"py-16 md:py-24 bg-white px-4"}>
            <div className={"max-w-6xl mx-auto"}>
                <div className={"text-center mb-12 md:mb-16"}>
                    <h4 className={"text-cyan font-medium mb-3"}>WHY LEARNMORE</h4>
                    <h2 className={"text-3xl md:text-4xl font-semibold text-gray-800"}>
                        Where Learning Feels Like <br className={"hidden sm:block"}/>
                        Play
                    </h2>
                </div>
                <div className={"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"}>
                    {features.map((feature, i) => (
                        <div key={i}
                             className={"bg-gray-50 p-6 rounded-lg text-center hover:shadow-lg transition-shadow duration-300"}>
                            <div className={"mb-4 flex justify-center"}>{feature.icon}</div>
                            <h3 className={"text-lg font-semibold text-gray-800 mb-2"}>{feature.title}</h3>
                            <p className={"text-gray-600 text-sm leading-relaxed"}>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
