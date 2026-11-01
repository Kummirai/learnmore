"use client"

import {useEffect, useMemo, useState} from "react"
import Link from "next/link"
import Image from "next/image"
import {FaWhatsapp} from "react-icons/fa"
import {
    LuArrowRight,
    LuBadgeCheck,
    LuCircleAlert,
    LuSearch,
    LuShoppingBag,
    LuX,
} from "react-icons/lu"
import Navbar from "@/components/Navbar"
import {useStoreItems} from "@/components/store/useStoreItems"
import {STORE_CATEGORIES, type StoreCategory, type StoreItem} from "@/constants/relate"

const formatPrice = (n: number) => `R${n.toLocaleString("en-ZA")}`

const orderLink = (item?: {name: string; price: number}) =>
    `https://wa.me/27782677436${item ? `?text=${encodeURIComponent(`Hi RelateWorld! I'd like to order the ${item.name} (${formatPrice(item.price)}).`)}` : ""}`

export function StoreCard({item}: {item: StoreItem}) {
    const onSale = item.offerPrice != null && item.offerPrice < item.price
    const price = onSale ? item.offerPrice! : item.price
    const ratingLabel = item.rating ? `Rated ${item.rating} out of 5` : undefined

    return (
        <div className={"group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm hover-lift"}>
            <Link
                href={`/store/${item.id}`}
                className={"relative block aspect-square overflow-hidden bg-alice-blue"}
            >
                {item.image ? (
                    <Image
                        src={item.image}
                        alt={item.name}
                        width={720}
                        height={720}
                        className={"size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"}
                    />
                ) : (
                    <div className={"grid size-full place-items-center text-slate-gray"}>
                        <LuShoppingBag className={"text-3xl"}/>
                    </div>
                )}
                {onSale ? (
                    <span className={"absolute left-3 top-3 rounded-full bg-blue px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white shadow-sm"}>
                        Sale
                    </span>
                ) : null}
            </Link>

            <div className={"flex flex-1 flex-col p-3.5 sm:p-4"}>
                <div className={"flex items-start justify-between gap-2"}>
                    <p className={"text-[10px] font-bold uppercase tracking-[0.16em] text-blue"}>{item.category}</p>
                    {item.rating ? (
                        <div className={"flex items-center gap-0.5 text-amber-500"} aria-label={ratingLabel}>
                            {Array.from({length: 5}, (_, i) => (
                                <Star key={i} filled={item.rating! > i} />
                            ))}
                            <span className={"text-[10px] font-semibold text-slate-gray"}>{item.rating}</span>
                        </div>
                    ) : null}
                </div>

                <Link
                    href={`/store/${item.id}`}
                    className={"mt-1 line-clamp-2 text-[15px] font-bold leading-snug text-ink transition-colors hover:text-blue sm:text-base"}
                >
                    {item.name}
                </Link>
                {item.blurb ? (
                    <p className={"mt-1 line-clamp-2 text-xs leading-relaxed text-slate-gray"}>{item.blurb}</p>
                ) : null}

                <div className={"mt-auto flex items-end justify-between gap-2 pt-4"}>
                    <div>
                        <p className={"text-lg font-extrabold tracking-tight text-navy sm:text-xl"}>{formatPrice(price)}</p>
                        {onSale ? (
                            <p className={"text-[11px] font-medium text-slate-gray line-through"}>{formatPrice(item.price)}</p>
                        ) : null}
                    </div>
                    <Link
                        href={orderLink({name: item.name, price})}
                        target={"_blank"}
                        rel={"noopener noreferrer"}
                        aria-label={`Order ${item.name} on WhatsApp`}
                        title="Order on WhatsApp"
                        className={"grid size-10 shrink-0 place-items-center rounded-xl bg-navy text-white transition-colors hover:bg-blue"}
                    >
                        <LuShoppingBag className={"text-base"}/>
                    </Link>
                </div>
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
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-white/5 [mask-image:linear-gradient(to_bottom,black_72%,transparent)]">
                {slides.map((src, i) => (
                    <Image
                        key={src}
                        src={src}
                        alt={`${tee.name} — shot ${i + 1}`}
                        width={800}
                        height={800}
                        className={`absolute inset-0 size-full object-cover transition-all duration-1000 ease-in-out ${
                            i === idx ? "opacity-100 scale-100" : "opacity-0 scale-105"
                        }`}
                    />
                ))}
            </div>

            <div className="absolute right-4 top-4 text-right">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-sky/80">
                    {tee.name}
                </p>
                <p className="text-3xl font-black tracking-tight text-white [text-shadow:0_2px_12px_rgba(7,16,29,0.65)]">
                    {formatPrice(tee.price)}
                </p>
            </div>

            {slides.length > 1 && (
                <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2">
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
    const [search, setSearch] = useState("")
    const {items: allItems, loading, error} = useStoreItems()

    const items = useMemo(() => {
        const query = search.trim().toLowerCase()
        return allItems.filter((item) => {
            const matchesCategory = category === "All" || item.category === category
            const matchesSearch =
                !query ||
                item.name.toLowerCase().includes(query) ||
                item.category.toLowerCase().includes(query) ||
                item.blurb.toLowerCase().includes(query)
            return matchesCategory && matchesSearch
        })
    }, [allItems, category, search])

    return (
        <>
            <Navbar />
            <header className="border-b border-line bg-alice-blue px-4 pb-10 pt-8">
                <div className="mx-auto max-w-6xl">
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy via-navy to-navy-soft p-6 shadow-[0_24px_60px_rgba(7,16,29,0.28)] md:p-10">
                        <div className="pointer-events-none absolute -bottom-24 -right-16 size-72 rounded-full bg-sky/20 blur-2xl drift" />
                        <div className="pointer-events-none absolute -top-20 right-24 size-44 rounded-full bg-blue/25 blur-2xl soft-pulse" />

                        <div className="relative grid items-center gap-8 md:grid-cols-2">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-sky">Official Relate World Store</p>
                                <h1 className="mt-2 text-3xl font-extrabold leading-[1.08] tracking-tight text-white md:text-5xl">
                                    Connecting Hearts <span className="text-sky">Across Generations</span>
                                </h1>
                                <p className="mt-4 max-w-md text-sm leading-relaxed text-white/65">
                                    Every purchase supports clubs, fellowships and community programmes. Order on WhatsApp and we&rsquo;ll sort out the rest.
                                </p>

                                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                                    <a
                                        href="#stock"
                                        className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-soft px-6 py-3 text-sm font-bold text-navy transition hover:bg-white"
                                    >
                                        Explore products <LuArrowRight />
                                    </a>
                                    <a
                                        href={orderLink()}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/10"
                                    >
                                        <FaWhatsapp className="text-base text-sky" /> Order on WhatsApp
                                    </a>
                                </div>

                                <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/70">
                                    {["Funds Relate clubs", "Order via WhatsApp", "Pay on delivery or EFT"].map((t) => (
                                        <li key={t} className="inline-flex items-center gap-1.5">
                                            <LuBadgeCheck className="text-sky" /> {t}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mx-auto w-full max-w-sm md:ml-auto">
                                <div className="rounded-3xl bg-white/5 p-3 ring-1 ring-white/10 backdrop-blur-sm">
                                    <HeroShowcase items={allItems} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 divide-x divide-line rounded-2xl border border-line bg-white py-4 shadow-sm">
                        {[
                            {label: "Products", value: loading ? "…" : allItems.length},
                            {label: "Categories", value: STORE_CATEGORIES.length - 1},
                            {label: "Community funded", value: "100%"},
                        ].map((stat) => (
                            <div key={stat.label} className="text-center">
                                <p className="text-xl font-extrabold tracking-tight text-navy md:text-2xl">{stat.value}</p>
                                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-gray">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center">
                        <label className="relative flex-1">
                            <span className="sr-only">Search the store</span>
                            <LuSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-gray" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search the store"
                                type="search"
                                className="h-12 w-full rounded-2xl border border-line bg-white pl-11 pr-11 text-sm text-ink outline-none transition focus:border-blue focus:ring-2 focus:ring-blue/15"
                            />
                            {search ? (
                                <button
                                    type="button"
                                    onClick={() => setSearch("")}
                                    aria-label="Clear product search"
                                    className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-slate-gray transition hover:bg-alice-blue hover:text-navy"
                                >
                                    <LuX />
                                </button>
                            ) : null}
                        </label>

                        <div id="stock" className="flex flex-wrap gap-2 scroll-mt-24">
                            {STORE_CATEGORIES.map((c) => (
                                <button
                                    key={c}
                                    onClick={() => setCategory(c)}
                                    className={`min-h-11 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                                        category === c
                                            ? "bg-blue text-white shadow-sm"
                                            : "border border-line bg-white text-slate-gray hover:border-blue/40 hover:text-navy"
                                    }`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </header>

            <section className={"flex-1 px-4 py-10"}>
                <div className={"mx-auto max-w-6xl"}>
                    <div className={"mb-5 flex items-baseline justify-between gap-4"}>
                        <h2 className={"text-lg font-extrabold tracking-tight text-navy md:text-xl"}>
                            {search.trim() ? `Results for “${search.trim()}”` : category === "All" ? "All products" : category}
                        </h2>
                        <span className={"rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-slate-gray"}>
                            {loading ? "…" : items.length}
                        </span>
                    </div>

                    {loading ? (
                        <div className={"grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4"} role={"status"} aria-label={"Loading the store"}>
                            {Array.from({length: 8}).map((_, i) => (
                                <div key={i} className={"overflow-hidden rounded-2xl border border-line bg-white"}>
                                    <div className={"aspect-square animate-pulse bg-alice-blue"} />
                                    <div className={"space-y-2 p-4"}>
                                        <div className={"h-2.5 w-16 animate-pulse rounded bg-alice-blue"} />
                                        <div className={"h-4 w-4/5 animate-pulse rounded bg-alice-blue"} />
                                        <div className={"h-3 w-3/5 animate-pulse rounded bg-alice-blue"} />
                                        <div className={"h-5 w-20 animate-pulse rounded bg-alice-blue"} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className={"rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center"} role={"alert"}>
                            <LuCircleAlert className={"mx-auto mb-3 text-2xl text-red-500"} />
                            <p className={"mb-1 text-sm font-semibold text-red-700"}>We couldn&rsquo;t load the store.</p>
                            <p className={"mb-5 text-sm text-red-600"}>{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className={"min-h-11 rounded-lg bg-red-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-red-700"}>
                                Try again
                            </button>
                        </div>
                    ) : allItems.length === 0 ? (
                        <div className={"rounded-2xl border border-dashed border-line bg-white py-16 text-center"}>
                            <LuShoppingBag className={"mx-auto mb-3 text-3xl text-slate-gray"} />
                            <p className={"mb-1 text-base font-semibold text-navy"}>Nothing in stock right now</p>
                            <p className={"text-sm text-slate-gray"}>New Relate gear lands here soon — check back shortly.</p>
                        </div>
                    ) : items.length === 0 ? (
                        <div className={"rounded-2xl border border-dashed border-line bg-white py-12 text-center"}>
                            <p className={"text-sm text-slate-gray"}>
                                {search.trim() ? `No products match “${search.trim()}”.` : `No products in ${category} yet.`}
                            </p>
                            <button
                                onClick={() => { setCategory("All"); setSearch("") }}
                                className={"mt-4 min-h-11 rounded-lg bg-navy px-5 text-sm font-semibold text-white transition hover:bg-navy-soft"}
                            >
                                Show all products
                            </button>
                        </div>
                    ) : (
                        <div key={`${category}-${search}`} className={"reveal reveal-stagger grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4"}>
                            {items.map((item) => (
                                <div key={item.id} className={"stagger-item"}>
                                    <StoreCard item={item}/>
                                </div>
                            ))}
                        </div>
                    )}

                    <p className={"mt-8 flex items-start gap-2 rounded-2xl border border-line bg-white px-4 py-3 text-xs leading-relaxed text-slate-gray"}>
                        <LuBadgeCheck className={"mt-0.5 shrink-0 text-blue"} />
                        Pay by EFT after checkout — your order number and our banking details appear on the receipt, and every purchase funds Relate clubs and community programmes.
                    </p>
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
