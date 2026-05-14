import Link from "next/link"
import {FaGraduationCap} from "react-icons/fa6";

export default function Hero() {
    return (
        <section className={"min-h-[calc(100vh-168px)] flex items-center px-4"}>
            <div className={"max-w-6xl w-full mx-auto"}>
                <div className={"grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"}>
                    <div
                        className={"flex flex-col items-start justify-center gap-5 order-2 lg:order-1"}>
                        <h2 className={"text-green-600 font-semibold text-sm sm:text-base"}>WELCOME TO LEARNMORE</h2>
                        <h3 className={"text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight text-gray-800"}>Nurturing
                            Young Minds
                            for a <span className={"text-green-600"}>Bright Future</span></h3>
                        <p className={"max-w-sm leading-relaxed text-gray-700 text-sm sm:text-base"}>
                            A loving and vibrant primary school for learners from Grade R to Grade 7.
                            Where every child discovers their potential through quality education,
                            creative play, and lifelong friendships.
                        </p>
                        <div className={"flex items-center gap-2 flex-wrap"}>
                            <Link href={"#"}
                                  className={"bg-green-600 text-white py-3 px-8 sm:px-10 text-sm sm:text-base"}>Enroll
                                Your Child</Link>
                            <Link href={"#"}
                                  className={"bg-yellow-400 text-green-900 py-3 px-8 sm:px-10 text-sm sm:text-base font-medium"}>Explore
                                Programs</Link>
                        </div>
                    </div>
                    <div className={"flex justify-center order-1 lg:order-2"}>
                        <div
                            className={"size-48 sm:size-64 md:size-80 rounded-full bg-green-600/20 flex items-center justify-center"}>
                            <FaGraduationCap
                                className={"text-6xl sm:text-7xl md:text-8xl text-green-600"}/>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
