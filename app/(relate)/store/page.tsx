"use client"

import {useEffect, useState} from "react"
import Link from "next/link"
import {FaWhatsapp} from "react-icons/fa"
import {LuArrowRight, LuBadgeCheck, LuShoppingBag} from "react-icons/lu"
import Navbar from "@/components/Navbar"
import {STORE_CATEGORIES, STORE_ITEMS, getStoreItem, type StoreCategory} from "@/constants/relate"

const formatPrice = (n: number) => `R${n.toLocaleString("en-ZA")}`

const orderLink = (item?: {name: string; price: number}) =>
    `https://wa.me/27782677436${item ? `?text=${encodeURIComponent(`Hi RelateWorld! I'd like to order the ${item.name} (${formatPrice(item.price)}).`)}` : ""}`

export function StoreCard({item}: {item: (typeof STORE_ITEMS)[number]}) {
    return (
        <div className={"flex flex-col group"}>
            <Link href={`/store/${item.id}`} className={"block overflow-hidden rounded-xl"}>
                <img
                    src={item.image}
                    alt={item.name}
                    loading={"lazy"}
                    className={"w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"}
                />
            </Link>
            <div className={"p-4 text-sm"}>
                <div className={"flex items-start justify-between gap-2"}>
                    <Link href={`/store/${item.id}`} className={"text-slate-800 font-semibold text-base hover:text-cyan transition-colors"}>
                        {item.name}
                    </Link>
                    <Link
                        href={orderLink(item)}
                        target={"_blank"}
                        rel={"noopener noreferrer"}
                        aria-label={`Order ${item.name} on WhatsApp`}
                        title="Buy now"
                        className={"text-cyan hover:text-cyan-dark transition-colors shrink-0"}>
                        <LuShoppingBag className="text-lg" />
                    </Link>
                </div>
                <p className={"font-bold text-cyan text-lg mt-1"}>{formatPrice(item.price)}</p>
                <p className={"text-slate-500 mt-1"}>{item.blurb}</p>
            </div>
        </div>
    )
}

function HeroShowcase() {
    const tee = getStoreItem("relate-tee")
    const allSlides = tee?.images?.length ? tee.images : tee ? [tee.image] : []
    const slides = allSlides.filter(
        (src) => src.includes("t-shirt-1") || src.includes("t-shirt-3"),
    )
    const [idx, setIdx] = useState(0)
    const [paused, setPaused] = useState(false)

    useEffect(() => {
        if (paused || slides.length < 2) return
        const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 4000)
        return () => clearInterval(t)
    }, [paused, slides.length])

    if (!tee || slides.length === 0) return null

    return (
        <div
            className="relative"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            <div className="relative aspect-square overflow-hidden rounded-3xl [mask-image:linear-gradient(to_bottom,black_65%,transparent)]">
                {slides.map((src, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        key={src}
                        src={src}
                        alt={`${tee.name} — shot ${i + 1}`}
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${
                            i === idx ? "opacity-100 scale-100" : "opacity-0 scale-105"
                        }`}
                    />
                ))}
            </div>

            <div className="absolute top-4 right-4 text-right">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-navy/60">
                    {tee.name}
                </p>
                <p className="text-3xl font-black tracking-tight text-navy [text-shadow:0_1px_3px_rgba(255,255,255,0.9)]">
                    {formatPrice(tee.price)}
                </p>
            </div>

            {slides.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => setIdx(i)}
                            aria-label={`Show shot ${i + 1} of ${tee.name}`}
                            className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${
                                i === idx
                                    ? "w-6 bg-white"
                                    : "w-1.5 bg-white/50 hover:bg-white/80"
                            }`}
                        />
                    ))}
                </div>
            )}
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
                        <h1 className="tracking-tight leading-[1.05] text-navy">
                            <span className="block text-3xl md:text-5xl font-black">Wear the emblem.</span>
                            <span className="block mt-1.5 text-xl md:text-3xl font-light italic text-cyan">Fund the mission.</span>
                        </h1>
                        <p className="mt-4 text-slate-gray leading-relaxed max-w-md">
                            Every purchase raises funds for Relate clubs and community programs. Order on WhatsApp and we&rsquo;ll sort out the rest.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 mt-7">
                            <Link
                                href="/store/relate-tee"
                                className="inline-flex items-center justify-center gap-2 bg-cyan text-white px-7 py-3.5 rounded-lg font-bold text-sm shadow-md shadow-cyan/25 hover:shadow-lg hover:shadow-cyan/30 hover:bg-cyan-dark transition-all">
                                Shop the black tee <LuArrowRight />
                            </Link>
                            <a
                                href={orderLink()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 text-navy font-bold text-sm px-6 py-3 rounded-lg border border-transparent hover:bg-ghost-white hover:border-cyan/40 transition-colors">
                                <FaWhatsapp className="text-cyan text-base" /> Order on WhatsApp
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
                        <HeroShowcase />
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
                                        ? "bg-cyan text-white shadow-md"
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
