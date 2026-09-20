"use client"

import {useState} from "react"
import Link from "next/link"
import {FaWhatsapp} from "react-icons/fa"
import PageHero from "@/components/PageHero"
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
                            href={orderLink()}
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
