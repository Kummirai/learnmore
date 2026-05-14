import Link from "next/link"
import {Roboto} from "next/font/google";
import {FaFacebook, FaInstagramSquare, FaTwitter} from "react-icons/fa";
import {LuMapPin, LuPhone, LuMail, LuClock} from "react-icons/lu";

const roboto = Roboto({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function Footer() {
    return (
        <footer className={"bg-gray-900 text-gray-300 px-4"}>
            <div className={"max-w-6xl mx-auto py-16"}>
                <div className={"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"}>
                    <div>
                        <h3 className={`text-2xl font-semibold text-white ${roboto.className} mb-4`}>LEARNMORE</h3>
                        <p className={"text-sm leading-relaxed mb-4"}>
                            Far far away, behind the word mountains, far from the countries Vokalia and Consonantia.
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
                            {["About Us", "Our Courses", "Our Team", "Pricing", "Contact"].map((link, i) => (
                                <li key={i}>
                                    <Link href={"#"} className={"hover:text-yellow-400 transition-colors"}>
                                        {link}
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
                                <span>Mon - Fri: 8:00AM - 4:00PM</span>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className={"text-white font-semibold mb-4"}>Newsletter</h4>
                        <p className={"text-sm leading-relaxed mb-4"}>
                            Subscribe to get the latest updates and news.
                        </p>
                        <div className={"flex"}>
                            <input type="email" placeholder="Your Email"
                                   className={"bg-gray-800 text-sm px-4 py-2 w-full outline-none focus:ring-1 focus:ring-green-600"}/>
                            <button
                                className={"bg-yellow-400 text-green-900 px-4 py-2 text-sm font-medium hover:bg-yellow-500 transition-colors"}>
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={"border-t border-gray-800 py-6 text-center text-sm"}>
                <p>&copy; {new Date().getFullYear()} LearnMore. All rights reserved.</p>
            </div>
        </footer>
    )
}
