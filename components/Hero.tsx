import Link from "next/link"

export default function Hero() {
    return (
        <section className={"h-[calc(100vh-168px)] flex items-center"}>
            <div className={"max-w-6xl w-full  mx-auto "}>
                <div className={"grid grid-cols-2"}>
                    <div
                        className={"flex flex-col items-start justify-center gap-5 "}>
                        <h2 className={"text-gray-700"}>WELCOME TO
                            LEARNMORE</h2>
                        <h3 className={"text-5xl font-semibold leading-6"}>Best
                            Learning
                            Institute</h3>
                        <p className={"max-w-sm leading-relaxed text-gray-700"}>Far
                            far away,
                            behind the word
                            mountains, far from the
                            countries Vokalia and Consonantia, there live the
                            blind
                            texts.</p>
                        <div className={"flex items-center gap-2"}>
                            <Link href={"#"}
                                  className={"bg-emerald-500 text-gray-50 py-3 px-10"}>Get
                                Started
                                Now</Link>
                            <Link href={"#"}
                                  className={"bg-white text-emerald-500 py-3 px-10"}>View
                                Courses</Link>
                        </div>
                    </div>
                    <div>

                    </div>
                </div>
            </div>

        </section>
    )
}