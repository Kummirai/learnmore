"use client"

import {useState} from "react"
import {FaWhatsapp} from "react-icons/fa"
import PageHero from "@/components/PageHero"
import {STORE_CATEGORIES, STORE_ITEMS, type StoreCategory} from "@/constants/relate"

const formatPrice = (n: number) => `R${n.toLocaleString("en-ZA")}`

export default function StorePage() {
    const [category, setCategory] = useState<StoreCategory>("All")

    const items = category === "All" ? STORE_ITEMS : STORE_ITEMS.filter((i) => i.category === category)

    return (
        <>
            <PageHero
                title={"Relate Store"}
                tagline={"Fundraise with Relate"}
                description={"Every purchase raises funds for Relate clubs and community programs. Order on WhatsApp and we'll sort out the rest."}
                watermark={"10"}
                titleSize={"clamp(2.75rem, 8vw, 5.5rem)"}
                meta={[
                    {label: "Items", value: STORE_ITEMS.length},
                    {label: "Orders", value: "Via WhatsApp"},
                ]}
                actions={
                    <>
                        <a
                            href={"https://wa.me/27782677436"}
                            target={"_blank"}
                            rel={"noopener noreferrer"}
                            className={"inline-flex items-center gap-2 bg-white text-navy px-6 py-3 rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors"}>
                            <FaWhatsapp/> Order on WhatsApp
                        </a>
                        <a
                            href={"#stock"}
                            className={"inline-flex items-center gap-2 border border-white/25 text-white px-6 py-3 rounded-lg font-semibold text-sm hover:border-white/60 transition-colors"}>
                            Browse the store
                        </a>
                    </>
                }
            />

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
        </>
    )
}