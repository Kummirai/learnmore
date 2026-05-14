"use client"

import Link from "next/link"
import {Roboto} from "next/font/google";
import {FaFacebook, FaInstagramSquare, FaTwitter} from "react-icons/fa";
import {LuMapPin, LuPhone, LuMail, LuClock, LuCircleCheck, LuCircleAlert} from "react-icons/lu";
import {useActionState} from "react";
import {subscribeNewsletter} from "@/app/(main)/newsletter/actions";

const roboto = Roboto({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function Footer() {
    const [state, formAction, pending] = useActionState(subscribeNewsletter, null)

    return (
        <footer className={"bg-gray-900 text-gray-300 px-4"}>
            <div className={"max-w-6xl mx-auto py-16"}>
                <div className={"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"}>
                    <div>
                        <h3 className={`text-2xl font-semibold text-white ${roboto.className} mb-4`}>LEARNMORE</h3>
                        <p className={"text-sm leading-relaxed mb-4"}>
                            A nurturing primary school for learners from Grade R to Grade 7, building bright futures since 2000.
                        </p>
                        <div className={"flex items-center gap-3"}>
                            <FaFacebook className={"hover:text-yellow-400 cursor-pointer transition-colors"}/>
                            <FaTwitter className={"hover:text-yellow-400 cursor-pointer transition-colors"}/>
                            <FaInstagramSquare className={"hover:text-yellow-400 cursor-pointer transition-colors"}/>
                        </div>
                    </div>
                    <div>
                        <h4 className={"text-white font-semibold mb-4"}>Quick Links</h4>
                        <ul className={"space-y-2 text-sm"}>
                            {[
                                {label: "About Us", path: "/about"},
                                {label: "Our Subjects", path: "/subjects"},
                                {label: "Our Team", path: "/team"},
                                {label: "School Fees", path: "/fees"},
                                {label: "FAQ", path: "/faq"},
                                {label: "Contact", path: "/contact"},
                            ].map((link, i) => (
                                <li key={i}>
                                    <Link href={link.path}
                                          className={"hover:text-yellow-400 transition-colors"}>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className={"text-white font-semibold mb-4"}>Contact Info</h4>
                        <ul className={"space-y-3 text-sm"}>
                            <li className={"flex items-start gap-2"}>
                                <LuMapPin className={"mt-1 shrink-0 text-yellow-400"}/>
                                <span>123 Education Street, Learning City, 2000</span>
                            </li>
                            <li className={"flex items-center gap-2"}>
                                <LuPhone className={"shrink-0 text-yellow-400"}/>
                                <span>+27 39 392 9210</span>
                            </li>
                            <li className={"flex items-center gap-2"}>
                                <LuMail className={"shrink-0 text-yellow-400"}/>
                                <span>info@learnmore.edu</span>
                            </li>
                            <li className={"flex items-start gap-2"}>
                                <LuClock className={"mt-1 shrink-0 text-yellow-400"}/>
                                <span>Mon - Fri: 7:30AM - 4:00PM</span>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className={"text-white font-semibold mb-4"}>Newsletter</h4>
                        <p className={"text-sm leading-relaxed mb-4"}>
                            Subscribe to get the latest updates and news.
                        </p>
                        {state?.success ? (
                            <div className={"flex items-start gap-2 text-sm text-green-400"}>
                                <LuCircleCheck className={"mt-0.5 shrink-0"}/>
                                <span>{state.message}</span>
                            </div>
                        ) : (
                            <form action={formAction} className={"flex"}>
                                <input type="email" name={"email"} placeholder="Your Email" required
                                       className={"bg-gray-800 text-sm px-4 py-2 w-full outline-none focus:ring-1 focus:ring-green-600"}/>
                                <button type={"submit"} disabled={pending}
                                        className={"bg-yellow-400 text-green-900 px-4 py-2 text-sm font-medium hover:bg-yellow-500 disabled:opacity-60 transition-colors shrink-0"}>
                                    {pending ? "..." : "Subscribe"}
                                </button>
                            </form>
                        )}
                        {state?.message && !state.success && (
                            <div className={"flex items-start gap-2 text-sm text-red-400 mt-2"}>
                                <LuCircleAlert className={"mt-0.5 shrink-0"}/>
                                <span>{state.message}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className={"border-t border-gray-800 py-6 text-center text-sm"}>
                <p>&copy; {new Date().getFullYear()} LearnMore Primary School. All rights reserved.</p>
            </div>
        </footer>
    )
}
