import {Roboto} from "next/font/google";
import {FaRegClock} from "react-icons/fa6";
import {BsTelephone} from "react-icons/bs";
import {FaFacebook, FaInstagramSquare} from "react-icons/fa";
import Link from "next/link";

const roboto = Roboto({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function Navbar() {

    const navLinks = [
        {id: 1, link: "Home", path: "/"},
        {id: 2, link: "All Courses", path: "/courses"},
        {id: 3, link: "About", path: "/about"},
        {id: 4, link: "Team", path: "/team"},
        {id: 5, link: "Pricing", path: "/pricing"},
        {id: 6, link: "Journal", path: "/journal"},
        {id: 7, link: "Contact", path: "Contact"},
    ]

    return (
        <>
            <section>
                <div
                    className={"max-w-6xl mx-auto py-6 flex items-center justify-between"}>
                    <div className={"text-gray-50 text-shadow-2xs"}>
                        <h1 className={`text-3xl font-semibold ${roboto.className} leading-5`}>LEARNMORE</h1>
                        <p className={"text-gray-50"}>Primary School</p>
                    </div>
                    <nav
                        className={"flex items-center gap-20 text-gray-50 bg-green-600 py-2 px-5"}>
                        <div className={"flex items-center gap-2"}>
                            <FaRegClock className={"text-4xl"}/>
                            <p className={"flex flex-col leading-5"}>
                                <span>Monday - Friday</span><span>8:00AM - 4:00PM</span>
                            </p>
                        </div>
                        <div className={"flex items-center gap-2"}>
                            <BsTelephone className={"text-4xl"}/>
                            <p className={"flex flex-col leading-5"}>
                                <span>Call Us</span><span>+27 39 392 9210</span>
                            </p>
                        </div>
                        <div className={"flex items-center gap-3"}>
                            <p>
                                <FaFacebook className={"text-2xl"}/>
                            </p>
                            <p>
                                <FaInstagramSquare className={"text-2xl"}/>
                            </p>
                        </div>
                    </nav>
                </div>
                <header
                    className={"max-w-6xl mx-auto flex items-center justify-between glass-card"}>
                    <nav>
                        <ul className={"flex items-center gap-5 p-5 text-white "}>
                            {navLinks.map(link => {
                                return (
                                    <li key={link.id}>
                                        <Link
                                            href={link.path}
                                            className={"block"}>{link.link}
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </nav>
                    <Link href={"#"}
                          className={"p-5 h-full bg-yellow-400 text-green-900 font-semibold"}>
                        Enroll with us
                    </Link>
                </header>
            </section>
        </>
    )
}