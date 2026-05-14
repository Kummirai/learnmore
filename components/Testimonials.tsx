import {IoStarSharp} from "react-icons/io5";

export default function Testimonials() {
    const testimonials = [
        {
            quote: "My daughter has blossomed since joining LearnMore. The teachers truly care about each child's growth and happiness.",
            name: "Thandi Mokoena",
            role: "Parent of Grade 3 Learner",
            initials: "TM"
        },
        {
            quote: "I love coming to school every day! My teacher makes learning fun and I've made so many friends.",
            name: "Liam Botha",
            role: "Grade 7 Learner",
            initials: "LB"
        },
        {
            quote: "The foundation phase program is wonderful. My son started in Grade R not knowing his ABCs and now he's reading confidently.",
            name: "Priya Naidoo",
            role: "Parent of Grade 1 Learner",
            initials: "PN"
        }
    ]

    return (
        <section className={"py-16 md:py-24 bg-gray-50 px-4"}>
            <div className={"max-w-6xl mx-auto"}>
                <div className={"text-center mb-12 md:mb-16"}>
                    <h4 className={"text-green-600 font-medium mb-3"}>TESTIMONIALS</h4>
                    <h2 className={"text-3xl md:text-4xl font-semibold text-gray-800"}>
                        What Parents & Learners <br className={"hidden sm:block"}/>
                        Say About Us
                    </h2>
                </div>
                <div className={"grid grid-cols-1 md:grid-cols-3 gap-6"}>
                    {testimonials.map((t, i) => (
                        <div key={i}
                             className={"bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow"}>
                            <div className={"flex gap-1 text-amber-400 mb-4"}>
                                {[...Array(5)].map((_, j) => (
                                    <IoStarSharp key={j}/>
                                ))}
                            </div>
                            <p className={"text-gray-600 text-sm leading-relaxed mb-6"}>
                                &ldquo;{t.quote}&rdquo;
                            </p>
                            <div className={"flex items-center gap-3"}>
                                <div
                                    className={"size-10 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-semibold"}>
                                    {t.initials}
                                </div>
                                <div>
                                    <h4 className={"font-semibold text-gray-800 text-sm"}>{t.name}</h4>
                                    <p className={"text-gray-500 text-xs"}>{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
