import {Roboto} from "next/font/google";
import {FaRegClock} from "react-icons/fa6";
import {BsTelephone} from "react-icons/bs";
import {FaFacebook, FaInstagramSquare} from "react-icons/fa";

const roboto = Roboto({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function Navbar() {
    return (
        <>
            <section>
                <header
                    className={"max-w-6xl mx-auto py-6 flex items-center justify-between"}>
                    <div>
                        <h1 className={`text-3xl font-semibold ${roboto.className} leading-5`}>LEARNMORE</h1>
                        <p>Educational Learning Institute</p>
                    </div>
                    <nav className={"flex items-center gap-20"}>
                        <div className={"flex items-center gap-2"}>
                            <FaRegClock className={"text-4xl"}/>
                            <p className={"flex flex-col leading-5"}>
                                <span>Monday - Friday</span><span>8:00AM-8:00PM</span>
                            </p>
                        </div>
                        <div className={"flex items-center gap-2"}>
                            <BsTelephone className={"text-4xl"}/>
                            <p className={"flex flex-col leading-5"}>
                                <span>Call Us</span><span>+27 392 3929 210</span>
                            </p>
                        </div>
                        <div className={"flex items-center gap-2"}>
                            <p>
                                <FaFacebook className={"text-2xl"}/>
                            </p>
                            <p>
                                <FaInstagramSquare className={"text-2xl"}/>
                            </p>
                        </div>
                    </nav>
                </header>
            </section>
        </>
    )
}