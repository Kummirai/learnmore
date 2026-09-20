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
        <div className={"group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"}>
            <Link href={`/store/${item.id}`} className={"relative aspect-square overflow-hidden bg-gray-100 block"}>
                <img
                    src={item.image}
                    alt={item.name}
                    loading={"lazy"}
                    className={"w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"}
                />
                <span className={"absolute top-3 left-3 bg-white/90 backdrop-blur text-[10px] uppercase tracking-wider text-gray-700 font-medium px-2.5 py-1 rounded-full shadow-sm"}>
                    {item.category}
                </span>
                <span
                    aria-hidden
                    className={"absolute bottom-3 right-3 size-10 rounded-full bg-cyan text-navy hidden sm:flex items-center justify-center shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"}>
                    <FaWhatsapp className={"text-lg"}/>
                </span>
                <span
                    aria-hidden
                    className={"absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-navy/85 text-white text-xs font-semibold text-center py-2.5"}>
                    View product
                </span>
            </Link>
            <div className={"p-4 flex flex-col flex-1"}>
                <div className={"flex items-start justify-between gap-3 mb-1"}>
                    <h3 className={"font-semibold text-gray-800 text-sm leading-snug"}>
                        <Link href={`/store/${item.id}`} className="hover:text-cyan-dark transition-colors">{item.name}</Link>
                    </h3>
                    <span className={"shrink-0 font-bold text-navy text-sm"}>{formatPrice(item.price)}</span>
                </div>
                <p className={"text-gray-500 text-xs leading-relaxed mb-4 flex-1"}>{item.blurb}</p>
                <div className={"flex items-center gap-2"}>
                    <Link
                        href={`/store/${item.id}`}
                        className={"inline-flex items-center justify-center flex-1 bg-white border border-gray-200 text-navy px-3 py-2.5 rounded-lg text-xs font-semibold hover:border-navy/40 transition-colors"}>
                        Details
                    </Link>
                    <Link
                        href={`/store/checkout?item=${item.id}`}
                        className={"inline-flex items-center justify-center gap-2 flex-1 bg-cyan text-navy px-3 py-2.5 rounded-lg text-xs font-semibold hover:bg-cyan-dark transition-colors"}>
                        <FaWhatsapp/> Order
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
