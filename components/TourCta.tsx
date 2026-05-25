import Link from "next/link"
import {LuCalendarCheck, LuArrowRight} from "react-icons/lu"

export default function TourCta() {
    return (
        <section className={"py-16 md:py-24 bg-white px-4"}>
            <div className={"max-w-4xl mx-auto text-center"}>
                <div
                    className={"size-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6"}>
                    <LuCalendarCheck className={"text-4xl text-green-600"}/>
                </div>
                <h2 className={"text-3xl md:text-4xl font-bold text-gray-800 mb-4"}>
                    Come Visit Us
                </h2>
                <p className={"text-gray-500 text-lg mb-8 max-w-2xl mx-auto"}>
                    See our school in action! Schedule a personal tour and meet our teachers, 
                    explore our classrooms, and experience the LearnMore difference firsthand.
                </p>
                <Link href={"https://wa.me/27782677436?text=Hello%20LearnMore!%20I%27d%20like%20to%20book%20a%20school%20tour."}
                      target={"_blank"}
                      className={"inline-flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-green-700 transition-colors"}>
                    Book a School Tour <LuArrowRight/>
                </Link>
            </div>
        </section>
    )
}
