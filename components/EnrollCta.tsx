import Link from "next/link"

export default function EnrollCta() {
    return (
        <section className={"bg-gradient-to-br from-navy via-navy-soft to-navy-dark px-4"}>
            <div className={"max-w-4xl mx-auto py-20 text-center"}>
                <h2 className={"text-3xl md:text-4xl font-bold text-white mb-4"}>
                    Ready to Join the LearnMore Family?
                </h2>
                <p className={"text-cyan-light text-lg mb-8 max-w-2xl mx-auto"}>
                    Give your child the gift of a quality education in a nurturing, vibrant environment. 
                    Enrollment is open for Grade R to Grade 7.
                </p>
                <div className={"flex items-center justify-center gap-4 flex-wrap"}>
                    <Link href={"/enroll"}
                          className={"bg-cyan text-navy py-3 px-10 text-lg font-semibold hover:bg-cyan-dark transition-colors"}>
                        Enroll Your Child
                    </Link>
                    <Link href={"/contact"}
                          className={"bg-white/20 text-white py-3 px-10 text-lg font-medium hover:bg-white/30 transition-colors backdrop-blur-sm border border-white/30"}>
                        Request a Callback
                    </Link>
                </div>
            </div>
        </section>
    )
}
