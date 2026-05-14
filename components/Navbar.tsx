"use client"

import {Roboto} from "next/font/google"
import {FaRegClock} from "react-icons/fa6"
import {BsTelephone} from "react-icons/bs"
import {FaFacebook, FaInstagramSquare} from "react-icons/fa"
import {LuMenu, LuX} from "react-icons/lu"
import Link from "next/link"
import {useState} from "react"

const roboto = Roboto({
    variable: "--font-geist-mono",
    subsets: ["latin"],
})

export default function Navbar() {

    const [open, setOpen] = useState(false)

    const navLinks = [
        {id: 1, link: "Home", path: "/"},
        {id: 2, link: "About", path: "/about"},
        {id: 3, link: "Subjects", path: "/subjects"},
        {id: 4, link: "Team", path: "/team"},
        {id: 5, link: "Gallery", path: "/gallery"},
        {id: 6, link: "News", path: "/news"},
        {id: 7, link: "Events", path: "/calendar"},
        {id: 8, link: "Aftercare", path: "/aftercare"},
        {id: 9, link: "Fees", path: "/fees"},
        {id: 10, link: "FAQ", path: "/faq"},
        {id: 11, link: "Contact", path: "/contact"},
    ]

    return (
        <section>
            <div className={"max-w-6xl mx-auto py-4 md:py-6 flex items-center justify-between px-4 md:px-0"}>
                <Link href={"/"} className={"text-gray-50"}>
                    <h1 className={`text-2xl md:text-3xl font-semibold ${roboto.className} leading-5`}>LEARNMORE</h1>
                    <p className={"text-xs md:text-sm text-gray-50"}>Primary School</p>
                </Link>
                <nav
                    className={"hidden lg:flex items-center gap-6 xl:gap-10 text-gray-50 bg-green-600 py-2 px-4 xl:px-5"}>
                    <div className={"flex items-center gap-2 text-sm"}>
                        <FaRegClock className={"text-2xl xl:text-4xl shrink-0"}/>
                        <p className={"flex flex-col leading-4 xl:leading-5"}>
                            <span>Monday - Friday</span><span>8:00AM - 4:00PM</span>
                        </p>
                    </div>
                    <div className={"flex items-center gap-2 text-sm"}>
                        <BsTelephone className={"text-2xl xl:text-4xl shrink-0"}/>
                        <p className={"flex flex-col leading-4 xl:leading-5"}>
                            <span>Call Us</span><span>+27 39 392 9210</span>
                        </p>
                    </div>
                    <div className={"flex items-center gap-3"}>
                        <FaFacebook className={"text-xl xl:text-2xl"}/>
                        <FaInstagramSquare className={"text-xl xl:text-2xl"}/>
                    </div>
                </nav>
                <button onClick={() => setOpen(true)}
                        className={"lg:hidden text-white p-2"}>
                    <LuMenu className={"text-3xl"}/>
                </button>
            </div>

            <header
                className={"max-w-6xl mx-auto hidden lg:flex items-center justify-between glass-card"}>
                <nav className={"overflow-x-auto"}>
                    <ul className={"flex items-center gap-3 xl:gap-5 p-5 text-white whitespace-nowrap"}>
                        {navLinks.map(link => (
                            <li key={link.id}>
                                <Link href={link.path}
                                      className={"block text-sm xl:text-base hover:text-yellow-400 transition-colors"}>{link.link}</Link>
                            </li>
                        ))}
                    </ul>
                </nav>
                <Link href={"/enroll"}
                      className={"p-5 h-full bg-yellow-400 text-green-900 font-semibold text-sm xl:text-base shrink-0"}>
                    Enroll with us
                </Link>
            </header>

            {open && (
                <div className={"fixed inset-0 z-50 bg-green-700 flex flex-col lg:hidden overflow-y-auto"}>
                    <div className={"flex items-center justify-between px-4 py-4"}>
                        <Link href={"/"} className={"text-gray-50"} onClick={() => setOpen(false)}>
                            <h1 className={`text-2xl font-semibold ${roboto.className}`}>LEARNMORE</h1>
                            <p className={"text-xs text-gray-50"}>Primary School</p>
                        </Link>
                        <button onClick={() => setOpen(false)} className={"text-white p-2"}>
                            <LuX className={"text-3xl"}/>
                        </button>
                    </div>

                    <nav className={"flex-1 flex flex-col items-center justify-center gap-6 py-8"}>
                        {navLinks.map(link => (
                            <Link key={link.id} href={link.path}
                                  onClick={() => setOpen(false)}
                                  className={"text-white text-2xl font-medium hover:text-yellow-400 transition-colors"}>
                                {link.link}
                            </Link>
                        ))}
                        <Link href={"/enroll"} onClick={() => setOpen(false)}
                              className={"mt-4 bg-yellow-400 text-green-900 px-10 py-3 text-lg font-semibold"}>
                            Enroll with us
                        </Link>
                    </nav>

                    <div className={"flex items-center justify-center gap-3 text-white pb-8"}>
                        <FaFacebook className={"text-2xl"}/>
                        <FaInstagramSquare className={"text-2xl"}/>
                    </div>
                </div>
            )}
        </section>
    )
}
