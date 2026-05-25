"use client"

import {Roboto} from "next/font/google"
import {FaRegClock} from "react-icons/fa6"
import {BsTelephone} from "react-icons/bs"
import {FaFacebook, FaInstagramSquare} from "react-icons/fa"
import {LuMenu, LuX, LuChevronDown} from "react-icons/lu"
import {FaGraduationCap} from "react-icons/fa6"
import Link from "next/link"
import {useState} from "react"

const roboto = Roboto({
    variable: "--font-geist-mono",
    subsets: ["latin"],
})

type NavItem = {link: string; path: string}
type NavGroup = {link: string; items: NavItem[]}

const navGroups: NavGroup[] = [
    {
        link: "Academics", items: [
        {link: "Subjects", path: "/subjects"},
        {link: "Timetable", path: "/timetable"},
        {link: "Resources", path: "/resources"},
        {link: "Merits", path: "/merits"},
    ]},
    {
        link: "School Life", items: [
        {link: "Gallery", path: "/gallery"},
        {link: "Events", path: "/calendar"},
    ]},
    {
        link: "Connect", items: [
        {link: "News", path: "/news"},
        {link: "Teachers", path: "/teachers"},
        {link: "Contact", path: "/contact"},
        {link: "FAQ", path: "/faq"},
        {link: "Fees", path: "/fees"},
        {link: "Lost & Found", path: "/lost-found"},
    ]},
]

const flatLinks = [
    {link: "Home", path: "/"},
    {link: "About", path: "/about"},
    ...navGroups.flatMap(g => g.items),
]

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})

    const toggleGroup = (name: string) => {
        setExpandedGroups(prev => ({...prev, [name]: !prev[name]}))
    }

    return (
        <section className={"bg-green-700"}>
            <div className={"max-w-6xl mx-auto py-4 md:py-6 flex items-center justify-between px-4 md:px-0"}>
                <Link href={"/"} className={"text-gray-50 flex items-center gap-2"}>
                    <FaGraduationCap className={"text-4xl md:text-5xl text-yellow-400 self-center"}/>
                    <div>
                        <h1 className={`text-2xl md:text-3xl font-semibold ${roboto.className} leading-5`}>LEARNMORE</h1>
                        <p className={"text-xs md:text-sm text-gray-50"}>Primary School</p>
                    </div>
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
                            <span>Call Us</span>                            <span>+27 78 267 7436</span>
                        </p>
                    </div>
                    <div className={"flex items-center gap-3"}>
                        <FaFacebook className={"text-xl xl:text-2xl"}/>
                        <FaInstagramSquare className={"text-xl xl:text-2xl"}/>
                    </div>
                </nav>
                <button onClick={() => setMenuOpen(true)}
                        className={"lg:hidden text-white p-2"}>
                    <LuMenu className={"text-3xl"}/>
                </button>
            </div>

            <header
                className={"max-w-6xl mx-auto hidden lg:flex items-center justify-between bg-green-800/40 backdrop-blur-xl relative z-50"}>
                <nav>
                    <ul className={"flex items-center gap-3 xl:gap-5 p-5 text-white whitespace-nowrap"}>
                        <li>
                            <Link href={"/"}
                                  className={"block text-sm xl:text-base hover:text-yellow-400 transition-colors"}>Home</Link>
                        </li>
                        <li>
                            <Link href={"/about"}
                                  className={"block text-sm xl:text-base hover:text-yellow-400 transition-colors"}>About</Link>
                        </li>
                        {navGroups.map(group => (
                            <li key={group.link} className={"relative group"}>
                                <span
                                    className={"flex items-center gap-1 text-sm xl:text-base hover:text-yellow-400 transition-colors cursor-default"}>
                                    {group.link}
                                    <LuChevronDown className={"text-xs mt-0.5 group-hover:rotate-180 transition-transform"}/>
                                </span>
                                <div
                                    className={"absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"}>
                                    <div className={"bg-white rounded-lg shadow-xl border border-gray-100 py-2 min-w-44"}>
                                        {group.items.map(item => (
                                            <Link key={item.path} href={item.path}
                                                  className={"block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"}>
                                                {item.link}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </nav>
                <Link href={"/enroll"}
                      className={"p-5 h-full bg-yellow-400 text-green-900 font-semibold text-sm xl:text-base shrink-0"}>
                    Enroll with us
                </Link>
            </header>

            {menuOpen && (
                <div className={"fixed inset-0 z-50 bg-green-700 flex flex-col lg:hidden overflow-y-auto"}>
                    <div className={"flex items-center justify-between px-4 py-4"}>
                        <Link href={"/"} className={"text-gray-50 flex items-center gap-2"} onClick={() => setMenuOpen(false)}>
                            <FaGraduationCap className={"text-4xl text-yellow-400 self-center"}/>
                            <div>
                                <h1 className={`text-2xl font-semibold ${roboto.className} leading-5`}>LEARNMORE</h1>
                                <p className={"text-xs text-gray-50"}>Primary School</p>
                            </div>
                        </Link>
                        <button onClick={() => setMenuOpen(false)} className={"text-white p-2"}>
                            <LuX className={"text-3xl"}/>
                        </button>
                    </div>

                    <nav className={"flex-1 flex flex-col items-center justify-center gap-5 py-8"}>
                        <Link href={"/"} onClick={() => setMenuOpen(false)}
                              className={"text-white text-2xl font-medium hover:text-yellow-400 transition-colors"}>
                            Home
                        </Link>
                        <Link href={"/about"} onClick={() => setMenuOpen(false)}
                              className={"text-white text-2xl font-medium hover:text-yellow-400 transition-colors"}>
                            About
                        </Link>
                        {navGroups.map(group => (
                            <div key={group.link} className={"w-full max-w-xs"}>
                                <button
                                    onClick={() => toggleGroup(group.link)}
                                    className={"w-full flex items-center justify-center gap-2 text-white text-2xl font-medium hover:text-yellow-400 transition-colors"}>
                                    {group.link}
                                    <LuChevronDown
                                        className={`text-lg transition-transform duration-200 ${expandedGroups[group.link] ? "rotate-180" : ""}`}/>
                                </button>
                                {expandedGroups[group.link] && (
                                    <div className={"flex flex-col items-center gap-3 mt-3"}>
                                        {group.items.map(item => (
                                            <Link key={item.path} href={item.path}
                                                  onClick={() => setMenuOpen(false)}
                                                  className={"text-white/80 text-lg hover:text-yellow-400 transition-colors"}>
                                                {item.link}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        <Link href={"/enroll"} onClick={() => setMenuOpen(false)}
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
