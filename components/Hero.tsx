import Link from "next/link"
import {FaGraduationCap} from "react-icons/fa6"
import {LuBookOpen} from "react-icons/lu"

export default function Hero() {
    return (
        <section className={"relative h-[100vh] max-lg:min-h-[calc(100vh-120px)] flex items-center px-4 overflow-hidden bg-gradient-to-br from-navy via-navy-soft to-navy-dark"}>
            <div className={"absolute top-10 -left-20 size-72 rounded-full bg-cyan/20 blur-3xl"}/>
            <div className={"absolute bottom-10 -right-20 size-96 rounded-full bg-cyan/10 blur-3xl"}/>
            <div className={"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] rounded-full bg-cyan/5 blur-3xl"}/>
            <div className={"absolute bottom-20 left-1/4 size-32 rounded-full bg-cyan/10 blur-xl"}/>

            <div className={"relative z-10 max-w-6xl w-full mx-auto"}>
                <div className={"grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 items-center"}>
                    <div
                        className={"flex flex-col items-center lg:items-start justify-center gap-4 md:gap-5 text-center lg:text-left order-2 lg:order-1"}>
                        <div className={"flex items-center gap-2 text-cyan font-semibold text-xs sm:text-sm md:text-base"}>
                            <LuBookOpen className={"text-lg"}/>
                            <span>WELCOME TO LEARNMORE</span>
                        </div>
                        <h1 className={"text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-snug md:leading-tight text-white max-w-lg"}>
                            Nurturing Young Minds
                            for a <span className={"text-cyan"}>Bright Future</span>
                        </h1>
                        <p className={"max-w-xs sm:max-w-sm leading-relaxed text-gray-100 text-xs sm:text-sm md:text-base"}>
                            A loving and vibrant primary school for learners from Grade R to Grade 7.
                            Where every child discovers their potential through quality education,
                            creative play, and lifelong friendships.
                        </p>
                        <div className={"flex items-center gap-2 sm:gap-3 flex-wrap justify-center lg:justify-start"}>
                            <Link href={"/enroll"}
                                  className={"bg-cyan text-navy py-2.5 sm:py-3 px-6 sm:px-10 text-xs sm:text-sm md:text-base font-medium hover:bg-cyan-dark transition-colors"}>Enroll
                                Your Child</Link>
                            <Link href={"/subjects"}
                                  className={"bg-white/20 text-white py-2.5 sm:py-3 px-6 sm:px-10 text-xs sm:text-sm md:text-base font-medium hover:bg-white/30 transition-colors backdrop-blur-sm border border-white/30"}>Explore
                                Subjects</Link>
                        </div>
                    </div>
                    <div className={"flex justify-center order-1 lg:order-2"}>
                        <div
                            className={"size-40 sm:size-48 md:size-64 lg:size-80 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20"}>
                            <FaGraduationCap
                                className={"text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-cyan"}/>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
