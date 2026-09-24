"use client"

import {useState} from "react"
import Link from "next/link"
import {FaWhatsapp} from "react-icons/fa"
import {LuArrowRight, LuBadgeCheck} from "react-icons/lu"
import Navbar from "@/components/Navbar"
import {STORE_CATEGORIES, STORE_ITEMS, type StoreCategory} from "@/constants/relate"

const formatPrice = (n: number) => `R${n.toLocaleString("en-ZA")}`

const orderLink = (item?: {name: string; price: number}) =>
    `https://wa.me/27782677436${item ? `?text=${encodeURIComponent(`Hi RelateWorld! I'd like to order the ${item.name} (${formatPrice(item.price)}).`)}` : ""}`

export function StoreCard({item}: {item: (typeof STORE_ITEMS)[number]}) {
    return (
        <div className={"flex flex-col bg-white shadow-md rounded-xl overflow-hidden group"}>
            <Link href={`/store/${item.id}`} className={"block overflow-hidden"}>
                <img
                    src={item.image}
                    alt={item.name}
                    loading={"lazy"}
                    className={"w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"}
                />
            </Link>
            <div className={"p-4 text-sm"}>
                <p className={"font-bold text-slate-800"}>{formatPrice(item.price)}</p>
                <Link href={`/store/${item.id}`} className={"text-slate-800 font-semibold text-base my-1.5 block hover:text-cyan transition-colors"}>
                    {item.name}
                </Link>
                <p className={"text-slate-500"}>{item.blurb}</p>
                <div className={"grid grid-cols-2 gap-2 mt-3"}>
                    <Link
                        href={`/store/${item.id}`}
                        className={"bg-cyan text-navy py-2.5 rounded-lg font-medium text-center hover:bg-cyan-dark transition-colors"}>
                        Details
                    </Link>
                    <Link
                        href={orderLink(item)}
                        target={"_blank"}
                        rel={"noopener noreferrer"}
                        className={"inline-flex items-center justify-center gap-2 bg-navy text-white py-2.5 rounded-lg font-medium hover:bg-navy-dark transition-colors"}>
                        <FaWhatsapp/> Buy now
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default function StorePage() {
    const [category, setCategory] = useState<StoreCategory>("All")

    const items = category === "All" ? STORE_ITEMS : STORE_ITEMS.filter((i) => i.category === category)

    return (
        <>
            <Navbar />
            <header className="relative overflow-hidden bg-white border-b border-gray-100">
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{background: "linear-gradient(120deg, rgba(19,197,221,0.08) 0%, rgba(255,255,255,0) 55%)"}}
                />
                <div className={"relative max-w-6xl mx-auto px-4 md:px-0 py-14 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-center"}>
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan mb-3">Relate Store</p>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-navy leading-[1.05]">
                            Wear the emblem.<br />
                            Fund the mission.
                        </h1>
                        <p className="mt-4 text-slate-gray leading-relaxed max-w-md">
                            Every purchase raises funds for Relate clubs and community programs. Order on WhatsApp and we&rsquo;ll sort out the rest.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 mt-7">
                            <Link
                                href="/store/relate-tee"
                                className="inline-flex items-center justify-center gap-2 bg-cyan text-navy px-6 py-3.5 rounded-lg font-bold text-sm hover:bg-cyan-dark transition-colors">
                                Shop the black tee <LuArrowRight />
                            </Link>
                            <a
                                href={orderLink()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 border-2 border-navy text-navy px-6 py-3 rounded-lg font-bold text-sm hover:bg-navy hover:text-white transition-colors">
                                <FaWhatsapp /> Order on WhatsApp
                            </a>
                        </div>

                        <ul className="flex flex-wrap gap-x-5 gap-y-2 mt-8 text-sm text-slate-gray">
                            {["Funds Relate clubs", "Order via WhatsApp", "Pay on delivery or EFT"].map((t) => (
                                <li key={t} className="inline-flex items-center gap-1.5">
                                    <LuBadgeCheck className="text-cyan" /> {t}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/images/store/relate-tee/t-shirt-1.png"
                            alt="Relate black tee"
                            className="w-full aspect-square object-cover rounded-3xl border border-gray-100 shadow-xl"
                        />
                        <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-navy text-white text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md">
                            <span className="size-1.5 rounded-full bg-cyan" /> New · R160
                        </span>
                        <div className="absolute -bottom-5 -right-3 hidden md:flex items-center gap-3 bg-white rounded-2xl border border-gray-100 shadow-lg px-4 py-3">
                            <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-gray">
                                The black tee
                                <span className="block text-lg font-black text-navy tracking-tight">R160</span>
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <section className={"flex-1 px-4 py-12"}>
                <div className={"max-w-6xl mx-auto"}>
                    <div id={"stock"} className={"flex flex-wrap justify-center gap-2 mb-10 scroll-mt-8"}>
                        {STORE_CATEGORIES.map((c) => (
                            <button
                                key={c}
                                onClick={() => setCategory(c)}
                                className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    category === c
                                        ? "bg-navy text-white shadow-md"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>

                    <div className={"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"}>
                        {items.map((item) => (
                            <StoreCard key={item.id} item={item}/>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}
