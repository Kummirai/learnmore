import {LuStar, LuTrophy, LuAward, LuMedal} from "react-icons/lu"

type Merit = {name: string; grade: string; achievement: string; date: string; stars: number; icon: React.ReactNode}

const merits: Merit[] = [
    {name: "Thandi M.", grade: "Grade 5", achievement: "Learner of the Month — May", date: "May 2026", stars: 5, icon: <LuTrophy className={"text-amber-500"}/>},
    {name: "James K.", grade: "Grade 7", achievement: "Perfect Attendance — Term 1", date: "Apr 2026", stars: 4, icon: <LuAward className={"text-blue-500"}/>},
    {name: "Amara O.", grade: "Grade 5", achievement: "Top Marks — Mathematics", date: "Apr 2026", stars: 5, icon: <LuMedal className={"text-gold-700"}/>},
    {name: "Priya N.", grade: "Grade 7", achievement: "Best Science Project: Water Filtration", date: "Mar 2026", stars: 5, icon: <LuTrophy className={"text-amber-500"}/>},
    {name: "Sipho D.", grade: "Grade 6", achievement: "Most Improved — English Literacy", date: "Mar 2026", stars: 3, icon: <LuAward className={"text-blue-500"}/>},
    {name: "Liam P.", grade: "Grade 4", achievement: "Star Helper — Always assists classmates", date: "Feb 2026", stars: 4, icon: <LuMedal className={"text-gold-700"}/>},
    {name: "Zoe S.", grade: "Grade 5", achievement: "Creative Arts Award — Best Painting", date: "Feb 2026", stars: 4, icon: <LuAward className={"text-purple-500"}/>},
    {name: "Ethan R.", grade: "Grade 6", achievement: "Sportsmanship Award — Soccer", date: "Feb 2026", stars: 3, icon: <LuMedal className={"text-orange-500"}/>},
    {name: "Mia K.", grade: "Grade 4", achievement: "Kindness Award — Most Caring Classmate", date: "Feb 2026", stars: 5, icon: <LuTrophy className={"text-pink-500"}/>},
    {name: "Daniel W.", grade: "Grade 6", achievement: "Best Reader — 20 Books in Term 1", date: "Mar 2026", stars: 4, icon: <LuStar className={"text-amber-500"}/>},
]

const starRow = (n: number) => (
    <span className={"flex gap-0.5"}>
        {Array.from({length: n}).map((_, i) => (
            <LuStar key={i} className={"text-amber-400 text-xs fill-amber-400"}/>
        ))}
    </span>
)

export default function MeritsPage() {
    return (
        <section className={"flex-1 px-4 py-12"}>
            <div className={"max-w-6xl mx-auto"}>
                <div className={"text-center mb-12"}>
                    <div className={"flex items-center justify-center gap-3 mb-3"}>
                        <LuStar className={"text-3xl text-amber-400 fill-amber-400"}/>
                        <h1 className={"text-3xl md:text-4xl font-semibold text-gray-800"}>Merit System</h1>
                    </div>
                    <p className={"text-gray-500 max-w-xl mx-auto"}>
                        Celebrating achievement, effort, and good character. Recognising our stars!
                    </p>
                </div>

                <div className={"max-w-3xl mx-auto space-y-4"}>
                    {merits.map((m, i) => (
                        <div key={i}
                             className={"bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4 hover:shadow-md transition-shadow"}>
                            <div className={"text-2xl shrink-0 mt-1"}>{m.icon}</div>
                            <div className={"flex-1 min-w-0"}>
                                <div className={"flex items-start justify-between gap-2 flex-wrap"}>
                                    <div>
                                        <h2 className={"font-semibold text-gray-800"}>{m.name}</h2>
                                        <span className={"text-xs text-gray-400"}>{m.grade}</span>
                                    </div>
                                    {starRow(m.stars)}
                                </div>
                                <p className={"text-sm text-gray-600 mt-1"}>{m.achievement}</p>
                                <p className={"text-xs text-gray-400 mt-1"}>{m.date}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={"mt-10 bg-amber-50 border border-amber-200 rounded-xl p-6 text-center"}>
                    <h3 className={"text-lg font-semibold text-amber-800 mb-2"}>How the Merit System Works</h3>
                    <p className={"text-sm text-amber-700 max-w-lg mx-auto"}>
                        Learners earn merit stars for academic excellence, good behaviour, helpfulness,
                        sports achievements, and creative accomplishments. Each star is recorded by the class teacher.
                        Learners who collect 20 stars receive a special certificate and prize at assembly.
                    </p>
                </div>
            </div>
        </section>
    )
}
