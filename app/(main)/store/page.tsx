"use client"

import Link from "next/link"
import {useState} from "react"
import {LuArrowLeft, LuShoppingBag} from "react-icons/lu"
import {FaWhatsapp} from "react-icons/fa"
import {STORE_CATEGORIES, STORE_ITEMS, type StoreCategory} from "@/constants/relate"

const formatPrice = (n: number) => `R${n.toLocaleString("en-ZA")}`

export default function StorePage() {
    const [category, setCategory] = useState<StoreCategory>("All")

    const items = category === "All" ? STORE_ITEMS : STORE_ITEMS.filter((i) => i.category === category)

    return (
        <section className={"flex-1 px-4 py-12"}>
            <div className={"max-w-6xl mx-auto"}>
                <Link href={"/"}
                      className={"inline-flex items-center gap-1 text-sm text-cyan hover:text-cyan-dark mb-6 transition-colors"}>
                    <LuArrowLeft/> Back to Home
                </Link>

                <div className={"text-center mb-10"}>
                    <div className={"inline-flex items-center gap-2 text-xs uppercase tracking-widest text-cyan font-medium mb-2"}>
                        <LuShoppingBag/> Relate Store
                    </div>
                    <h1 className={"text-3xl md:text-4xl font-semibold text-gray-800 mb-3"}>Fundraise with Relate</h1>
                    <p className={"text-gray-500 max-w-xl mx-auto text-sm"}>
                        Every purchase raises funds for Relate clubs and community programs. Order on WhatsApp and we&rsquo;ll sort out the rest.
                    </p>
                </div>

                <div className={"flex flex-wrap justify-center gap-2 mb-10"}>
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

                <div className={"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"}>
                    {items.map((item) => (
                        <div key={item.id}
                             className={"bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col"}>
                            <div className={"aspect-square overflow-hidden"}>
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className={"w-full h-full object-cover hover:scale-105 transition-transform duration-300"}
                                />
                            </div>
                            <div className={"p-4 flex flex-col flex-1"}>
                                <span className={"text-[11px] uppercase tracking-wider text-cyan-dark font-medium mb-1"}>{item.category}</span>
                                <h3 className={"font-semibold text-gray-800 text-sm mb-1"}>{item.name}</h3>
                                <p className={"text-gray-500 text-xs mb-3 flex-1"}>{item.blurb}</p>
                                <div className={"flex items-center justify-between"}>
                                    <span className={"font-semibold text-navy"}>{formatPrice(item.price)}</span>
                                    <a
                                        href={"https://wa.me/27782677436"}
                                        target={"_blank"}
                                        rel={"noopener noreferrer"}
                                        className={"inline-flex items-center gap-1.5 bg-cyan text-navy px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-cyan-light transition-colors"}>
                                        <FaWhatsapp/> Order
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}