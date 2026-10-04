"use client"

import {useEffect, useState} from "react"
import Link from "next/link"
import {FaWhatsapp} from "react-icons/fa"
import {LuArrowRight, LuBadgeCheck, LuCircleAlert, LuLoaderCircle, LuShoppingBag} from "react-icons/lu"
import Navbar from "@/components/Navbar"
import {useStoreItems} from "@/components/store/useStoreItems"
import {STORE_CATEGORIES, type StoreCategory, type StoreItem} from "@/constants/relate"

const formatPrice = (n: number) => `R${n.toLocaleString("en-ZA")}`

const orderLink = (item?: {name: string; price: number}) =>
    `https://wa.me/27782677436${item ? `?text=${encodeURIComponent(`Hi RelateWorld! I'd like to order the ${item.name} (${formatPrice(item.price)}).`)}` : ""}`

export function StoreCard({item}: {item: StoreItem}) {
    const onSale = item.offerPrice != null && item.offerPrice < item.price
    const ratingLabel = item.rating ? `Rated ${item.rating} out of 5` : undefined
    return (
        <div className={"flex flex-col group"}>
            <Link href={`/store/${item.id}`} className={"block overflow-hidden rounded-xl bg-alice-blue"}>
                {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={item.image}
                        alt={item.name}
                        loading={"lazy"}
                        className={"w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"}
                    />
                ) : (
                    <div className={"w-full h-48 flex items-center justify-center text-slate-gray"}>
                        <LuShoppingBag className={"text-2xl"}/>
                    </div>
                )}
            </Link>
            <div className={"p-4 text-sm"}>
                <div className={"flex items-start justify-between gap-2"}>
                    <Link href={`/store/${item.id}`} className={"inline-flex min-h-11 items-center text-slate-800 font-semibold text-base hover:text-cyan transition-colors"}>
                        {item.name}
                    </Link>
                    <Link
                        href={orderLink({name: item.name, price: onSale ? item.offerPrice! : item.price})}
                        target={"_blank"}
                        rel={"noopener noreferrer"}
                        aria-label={`Order ${item.name} on WhatsApp`}
                        title="Buy now"
                        className={"grid size-11 place-items-center text-cyan hover:text-cyan-dark transition-colors shrink-0"}>
                        <LuShoppingBag className="text-lg" />
                    </Link>
                </div>
                {onSale ? (
                    <p className={"font-bold text-cyan text-lg mt-1 flex items-baseline gap-1.5"}>
                        {formatPrice(item.offerPrice!)}
                        <span className={"text-xs font-medium text-slate-gray line-through"}>{formatPrice(item.price)}</span>
                    </p>
                ) : (
                    <p className={"font-bold text-cyan text-lg mt-1"}>{formatPrice(item.price)}</p>
                )}
                {item.rating ? (
                    <div className={"flex items-center gap-0.5 mt-1.5 text-amber-500"} aria-label={ratingLabel}>
                        {Array.from({length: 5 }, (_, i) => (
                            <Star key={i} filled={item.rating! > i} />
                        ))}
                    </div>
                ) : null}
                <p className={"text-slate-500 mt-1.5"}>{item.blurb}</p>
            </div>
        </div>
    )
}

function HeroShowcase({items}: {items: StoreItem[]}) {
    const tee = items.find((i) => i.id === "relate-tee")
    const allSlides = tee?.images?.length ? tee.images : tee ? [tee.image] : []
    const slides = allSlides.filter(Boolean)
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
                            className="grid size-11 -m-2.5 place-items-center rounded-full"
                        >
                            <span
                                className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${
                                    i === idx
                                        ? "w-6 bg-white"
                                        : "w-1.5 bg-white/50 hover:bg-white/80"
                                }`}
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default function StorePage() {
    const [category, setCategory] = useState<StoreCategory>("All")
    const {items: allItems, loading, error} = useStoreItems()

    const items = category === "All" ? allItems : allItems.filter((i) => i.category === category)

    return (
        <>
            <Navbar />
            <header className="relative overflow-hidden bg-white border-b border-gray-100">
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{background: "linear-gradient(120deg, rgba(19,197,221,0.08) 0%, rgba(255,255,255,0) 55%)"}}
                />
                <div className={"relative max-w-6xl mx-auto px-4 lg:px-0 py-14 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-center"}>
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
                        <HeroShowcase items={allItems} />
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
                                className={`px-5 py-2.5 min-h-11 rounded-lg text-sm font-medium transition-colors ${
                                    category === c
                                        ? "bg-cyan text-white shadow-md"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className={"flex items-center justify-center gap-3 py-16 text-slate-gray"} role={"status"}>
                            <LuLoaderCircle className={"animate-spin text-2xl"} />
                            <span className={"text-sm"}>Loading the store…</span>
                        </div>
                    ) : error ? (
                        <div className={"rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center"} role={"alert"}>
                            <LuCircleAlert className={"text-red-500 text-2xl mx-auto mb-3"} />
                            <p className={"text-sm font-semibold text-red-700 mb-1"}>We couldn&rsquo;t load the store.</p>
                            <p className={"text-sm text-red-600 mb-5"}>{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className={"min-h-11 px-6 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"}>
                                Try again
                            </button>
                        </div>
                    ) : allItems.length === 0 ? (
                        <div className={"rounded-2xl border border-dashed border-gray-300 bg-alice-blue/50 py-16 text-center"}>
                            <LuShoppingBag className={"text-3xl text-slate-gray mx-auto mb-3"} />
                            <p className={"text-base font-semibold text-navy mb-1"}>Nothing in stock right now</p>
                            <p className={"text-sm text-slate-gray"}>New Relate gear lands here soon — check back shortly.</p>
                        </div>
                    ) : items.length === 0 ? (
                        <div className={"rounded-2xl border border-dashed border-gray-300 bg-alice-blue/50 py-12 text-center"}>
                            <p className={"text-sm text-slate-gray"}>No products in {category} yet — check the other categories.</p>
                        </div>
                    ) : (
                        <div className={"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"}>
                            {items.map((item) => (
                                <StoreCard key={item.id} item={item}/>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    )
}

function Star({filled}: {filled: boolean}) {
    return (
        <svg width="13" height="12" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path
                d="M8.049.927c.3-.921 1.603-.921 1.902 0l1.294 3.983a1 1 0 0 0 .951.69h4.188c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 0 0-.364 1.118l1.295 3.983c.299.921-.756 1.688-1.54 1.118L9.589 13.63a1 1 0 0 0-1.176 0l-3.389 2.46c-.783.57-1.838-.197-1.539-1.118L4.78 10.99a1 1 0 0 0-.363-1.118L1.028 7.41c-.783-.57-.38-1.81.588-1.81h4.188a1 1 0 0 0 .95-.69z"
                fill="currentColor"
                fillOpacity={filled ? 1 : 0.35}
            />
        </svg>
    )
}