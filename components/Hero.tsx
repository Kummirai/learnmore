import Link from "next/link"
import {FaGraduationCap} from "react-icons/fa6";

export default function Hero() {
    return (
        <section className={"min-h-[calc(100vh-168px)] max-lg:min-h-[calc(100vh-120px)] flex items-center px-4"}>
            <div className={"max-w-6xl w-full mx-auto"}>
                <div className={"grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 items-center"}>
                    <div
                        className={"flex flex-col items-center lg:items-start justify-center gap-4 md:gap-5 text-center lg:text-left order-2 lg:order-1"}>
                        <h2 className={"text-green-600 font-semibold text-xs sm:text-sm md:text-base"}>WELCOME TO
                            LEARNMORE</h2>
                        <h1 className={"text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-snug md:leading-tight text-gray-800 max-w-lg"}>
                            Nurturing Young Minds
                            for a <span className={"text-green-600"}>Bright Future</span>
                        </h1>
                        <p className={"max-w-xs sm:max-w-sm leading-relaxed text-gray-700 text-xs sm:text-sm md:text-base"}>
                            A loving and vibrant primary school for learners from Grade R to Grade 7.
                            Where every child discovers their potential through quality education,
                            creative play, and lifelong friendships.
                        </p>
                        <div className={"flex items-center gap-2 sm:gap-3 flex-wrap justify-center lg:justify-start"}>
                            <Link href={"/enroll"}
                                  className={"bg-green-600 text-white py-2.5 sm:py-3 px-6 sm:px-10 text-xs sm:text-sm md:text-base"}>Enroll
                                Your Child</Link>
                            <Link href={"/subjects"}
                                  className={"bg-yellow-400 text-green-900 py-2.5 sm:py-3 px-6 sm:px-10 text-xs sm:text-sm md:text-base font-medium"}>Explore
                                Subjects</Link>
                        </div>
                    </div>
                    <div className={"flex justify-center order-1 lg:order-2"}>
                        <div
                            className={"size-40 sm:size-48 md:size-64 lg:size-80 rounded-full bg-green-600/20 flex items-center justify-center"}>
                            <FaGraduationCap
                                className={"text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-green-600"}/>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
