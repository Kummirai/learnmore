"use client"

import {useEffect, useMemo, useState} from "react"
import Link from "next/link"
import Image from "next/image"
import {
    LuArrowRight,
    LuBadgeCheck,
    LuCheck,
    LuChevronLeft,
    LuChevronRight,
    LuCircleAlert,
    LuReceiptText,
    LuSearch,
    LuShoppingBag,
    LuX,
} from "react-icons/lu"
import Navbar from "@/components/Navbar"
import {useStoreItems} from "@/components/store/useStoreItems"
import {useCart} from "@/lib/cart"
import {STORE_CATEGORIES, type StoreCategory, type StoreItem} from "@/constants/relate"

const formatPrice = (n: number) => `R${n.toLocaleString("en-ZA")}`

export function StoreCard({item}: {item: StoreItem}) {
    const {add} = useCart()
    const [added, setAdded] = useState(false)
    const onSale = item.offerPrice != null && item.offerPrice < item.price
    const price = onSale ? item.offerPrice! : item.price
    const ratingLabel = item.rating ? `Rated ${item.rating} out of 5` : undefined
    const needsSize = (item.sizes?.length ?? 0) > 0

    const addToCart = () => {
        if (needsSize) return
        add(item)
        setAdded(true)
        setTimeout(() => setAdded(false), 1500)
    }

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
                    {needsSize ? (
                        <Link
                            href={`/store/${item.id}`}
                            aria-label={`Choose a size for ${item.name}`}
                            title="Choose a size"
                            className={"grid size-10 shrink-0 place-items-center rounded-xl bg-navy text-white transition-colors hover:bg-blue"}
                        >
                            <LuShoppingBag className={"text-base"}/>
                        </Link>
                    ) : (
                        <button
                            type="button"
                            onClick={addToCart}
                            aria-label={added ? `${item.name} added to cart` : `Add ${item.name} to cart`}
                            title="Add to cart"
                            className={`grid size-10 shrink-0 place-items-center rounded-xl text-white transition-colors ${
                                added ? "bg-emerald-600" : "bg-navy hover:bg-blue"
                            }`}
                        >
                            {added ? <LuCheck className={"text-base"}/> : <LuShoppingBag className={"text-base"}/>}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

function HeroSpotlight({item, loading}: {item: StoreItem | null; loading: boolean}) {
    const slides = item ? (item.images?.length ? item.images : [item.image]).filter(Boolean) : []
    const [idx, setIdx] = useState(0)
    const [paused, setPaused] = useState(false)
    const many = slides.length > 1

    useEffect(() => {
        if (paused || !many) return
        const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 5000)
        return () => clearInterval(t)
    }, [paused, many, slides.length])

    const onSale = Boolean(item && item.offerPrice != null && item.offerPrice < item.price)
    const price = item ? (onSale ? item.offerPrice! : item.price) : 0
    const discount = item && onSale ? Math.round((1 - item.offerPrice! / item.price) * 100) : 0
    const href = item ? `/store/${item.id}` : "#stock"
    const go = (delta: number) => {
        if (!many) return
        setIdx((i) => (i + delta + slides.length) % slides.length)
    }

    return (
        <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            <div className="relative">
                {loading ? (
                    <div
                        className="aspect-[4/3] animate-pulse rounded-[1.75rem] bg-alice-blue ring-1 ring-line md:aspect-[4/5]"
                        aria-hidden
                    />
                ) : item && slides.length > 0 ? (
                    <div className="group relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-white shadow-[0_28px_70px_rgba(11,25,44,0.18)] ring-1 ring-line md:aspect-[4/5]">
                        {slides.map((src, i) => (
                            <Image
                                key={src}
                                src={src}
                                alt={`${item.name} — shot ${i + 1}`}
                                width={800}
                                height={1000}
                                priority={i === 0}
                                className={`absolute inset-0 size-full object-cover transition-all duration-1000 ease-in-out ${
                                    i === idx ? "scale-100 opacity-100" : "scale-105 opacity-0"
                                }`}
                            />
                        ))}

                        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3.5">
                            <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-navy shadow-sm backdrop-blur">
                                Featured drop
                            </span>
                            {discount > 0 ? (
                                <span className="rounded-full bg-navy px-2.5 py-1 text-[10px] font-extrabold text-white shadow-sm">
                                    −{discount}%
                                </span>
                            ) : null}
                        </div>

                        {many ? (
                            <>
                                <button
                                    type="button"
                                    onClick={() => go(-1)}
                                    aria-label="Previous product image"
                                    className="absolute left-3 top-1/2 hidden size-9 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-navy opacity-0 shadow-md backdrop-blur transition hover:bg-white group-hover:opacity-100 md:grid"
                                >
                                    <LuChevronLeft aria-hidden />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => go(1)}
                                    aria-label="Next product image"
                                    className="absolute right-3 top-1/2 hidden size-9 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-navy opacity-0 shadow-md backdrop-blur transition hover:bg-white group-hover:opacity-100 md:grid"
                                >
                                    <LuChevronRight aria-hidden />
                                </button>
                            </>
                        ) : null}
                    </div>
                ) : (
                    <div className="grid aspect-[4/3] place-items-center rounded-[1.75rem] bg-gradient-to-br from-alice-blue to-blue-soft/70 p-8 text-center ring-1 ring-line md:aspect-[4/5]">
                        <div>
                            <LuShoppingBag className="mx-auto text-5xl text-blue/40" />
                            <p className="mt-4 text-sm font-semibold text-navy">New gear landing soon</p>
                            <p className="mt-1 text-xs text-slate-gray">Check back for the next Relate World drop.</p>
                        </div>
                    </div>
                )}

                <div className="relative z-10 mx-3 -mt-12 rounded-2xl border border-line bg-white/95 p-3.5 shadow-[0_18px_40px_rgba(11,25,44,0.16)] backdrop-blur sm:mx-5">
                    <div className="flex items-center gap-3">
                        <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue">
                                {item?.category ?? "Official gear"}
                            </p>
                            <p className="mt-0.5 truncate text-sm font-extrabold text-navy">
                                {loading ? "Loading featured product…" : item ? item.name : "Relate World Store"}
                            </p>
                            {item && !loading ? (
                                <div className="mt-0.5 flex items-baseline gap-1.5">
                                    <span className="text-sm font-extrabold text-navy">{formatPrice(price)}</span>
                                    {onSale ? (
                                        <span className="text-[11px] font-medium text-slate-gray line-through">
                                            {formatPrice(item.price)}
                                        </span>
                                    ) : null}
                                    {item.rating ? (
                                        <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-semibold text-slate-gray">
                                            <Star filled /> {item.rating}
                                        </span>
                                    ) : null}
                                </div>
                            ) : (
                                <p className="mt-0.5 text-xs text-slate-gray">
                                    {loading ? "Fetching the latest drop" : "Browse the collection"}
                                </p>
                            )}
                        </div>
                        <Link
                            href={href}
                            className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full bg-navy px-5 text-sm font-bold text-white transition-colors hover:bg-blue"
                        >
                            Shop now <LuArrowRight className="text-sm" />
                        </Link>
                    </div>
                </div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3 px-2">
                {many ? (
                    <div className="flex items-center gap-1">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => setIdx(i)}
                                aria-label={`Show shot ${i + 1} of ${item!.name}`}
                                className="grid size-8 place-items-center rounded-full"
                            >
                                <span
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                        i === idx ? "w-5 bg-navy" : "w-1.5 bg-navy/20 hover:bg-navy/40"
                                    }`}
                                />
                            </button>
                        ))}
                    </div>
                ) : (
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-gray">
                        Official merchandise
                    </span>
                )}

                {many ? (
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold tracking-[0.18em] text-slate-gray">
                            {String(idx + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
                        </span>
                        <button
                            type="button"
                            onClick={() => go(-1)}
                            aria-label="Previous product image"
                            className="grid size-9 place-items-center rounded-full border border-line bg-white text-navy transition hover:border-navy"
                        >
                            <LuChevronLeft aria-hidden />
                        </button>
                        <button
                            type="button"
                            onClick={() => go(1)}
                            aria-label="Next product image"
                            className="grid size-9 place-items-center rounded-full border border-line bg-white text-navy transition hover:border-navy"
                        >
                            <LuChevronRight aria-hidden />
                        </button>
                    </div>
                ) : null}
            </div>
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

    const featured = useMemo(() => {
        const withImage = allItems.filter((item) => item.image)
        return withImage.find((item) => item.id === "relate-tee") ?? withImage.find((item) => item.sizes?.length) ?? withImage[0] ?? null
    }, [allItems])

    const topSale = useMemo(
        () =>
            allItems.reduce((best, item) => {
                if (item.offerPrice == null || item.offerPrice >= item.price) return best
                return Math.max(best, Math.round((1 - item.offerPrice / item.price) * 100))
            }, 0),
        [allItems]
    )

    const counts = useMemo(() => {
        const map = Object.fromEntries(STORE_CATEGORIES.map((c) => [c, 0])) as Record<StoreCategory, number>
        map.All = allItems.length
        for (const item of allItems) map[item.category] += 1
        return map
    }, [allItems])

    const categoryImages = useMemo(() => {
        const map = new Map<string, string>()
        for (const item of allItems) {
            if (item.image && !map.has(item.category)) map.set(item.category, item.image)
        }
        return map
    }, [allItems])

    const shopCategory = (next: StoreCategory) => {
        setCategory(next)
        document.getElementById("stock")?.scrollIntoView({behavior: "smooth", block: "start"})
    }

    return (
        <>
            <Navbar />
            <header className="bg-white px-4 pb-7 pt-5 md:pt-7">
                <div className="mx-auto max-w-6xl">
                    <section className="relative overflow-hidden rounded-[2rem] border border-line bg-gradient-to-br from-alice-blue via-white to-blue-soft/60">
                        <div className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-sky/15 blur-3xl" />
                        <div className="pointer-events-none absolute -bottom-28 left-1/4 size-72 rounded-full bg-blue/10 blur-3xl" />

                        <div className="relative grid items-center gap-8 p-5 sm:p-8 md:grid-cols-[1.02fr_0.98fr] md:gap-10 md:p-10 lg:p-12">
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="inline-flex items-center gap-2 rounded-full border border-navy/10 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-navy shadow-sm">
                                        <span className="size-1.5 rounded-full bg-blue" />
                                        Official Relate World Store
                                    </span>
                                    {topSale > 0 ? (
                                        <a
                                            href="#stock"
                                            className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-navy transition hover:bg-amber-300"
                                        >
                                            Sale up to {topSale}% off <LuArrowRight className="text-xs" />
                                        </a>
                                    ) : null}
                                </div>

                                <h1 className="mt-5 text-[2.4rem] font-extrabold leading-[0.95] tracking-[-0.035em] text-navy sm:text-5xl lg:text-[3.4rem]">
                                    Connecting Hearts <span className="text-blue">Across Generations</span>
                                </h1>
                                <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-gray md:text-[15px]">
                                    Apparel, accessories and home &amp; study pieces made to carry the Relate story. Add to cart, pay by EFT and track every order — purchases fund Relate clubs.
                                </p>

                                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                                    <a
                                        href="#stock"
                                        className="inline-flex items-center justify-center gap-2 rounded-full bg-navy px-6 py-3.5 text-sm font-bold text-white shadow-[0_12px_28px_rgba(11,25,44,0.25)] transition hover:bg-blue"
                                    >
                                        Shop the collection <LuArrowRight />
                                    </a>
                                    <Link
                                        href="/store/orders"
                                        className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-white px-6 py-3.5 text-sm font-bold text-navy transition hover:border-navy/30 hover:bg-alice-blue"
                                    >
                                        <LuReceiptText className="text-base text-blue" /> My orders
                                    </Link>
                                </div>

                                <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 border-t border-line/80 pt-5 text-[11px] font-semibold text-slate-gray">
                                    {["Secure EFT checkout", "Order tracking", "Funds Relate clubs"].map((t) => (
                                        <li key={t} className="inline-flex items-center gap-1.5">
                                            <LuBadgeCheck className="text-blue" /> {t}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mx-auto w-full max-w-md md:ml-auto">
                                <HeroSpotlight item={featured} loading={loading} />
                            </div>
                        </div>
                    </section>

                    <div className="mb-3 mt-6 flex items-end justify-between">
                        <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-gray">
                            Shop by category
                        </h2>
                        <a href="#stock" className="text-xs font-semibold text-blue transition hover:text-navy">
                            View all products
                        </a>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
                        {STORE_CATEGORIES.map((c) => {
                            const active = category === c
                            const count = counts[c] ?? 0
                            const image = c === "All" ? null : categoryImages.get(c)
                            return (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => shopCategory(c)}
                                    aria-pressed={active}
                                    className={`group relative h-32 overflow-hidden rounded-2xl text-left shadow-sm transition sm:h-36 ${
                                        active ? "ring-2 ring-blue" : "ring-1 ring-line hover:shadow-md"
                                    }`}
                                >
                                    {image ? (
                                        <Image
                                            src={image}
                                            alt=""
                                            fill
                                            sizes="(min-width: 1024px) 25vw, 50vw"
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    ) : (
                                        <span className="absolute inset-0 bg-gradient-to-br from-navy via-navy-soft to-blue" />
                                    )}
                                    <span className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent" />
                                    <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3.5">
                                        <span>
                                            <span className="block text-sm font-extrabold text-white">
                                                {c === "All" ? "All products" : c}
                                            </span>
                                            <span className="mt-0.5 block text-[11px] font-medium text-white/70">
                                                {loading ? "Loading…" : `${count} item${count === 1 ? "" : "s"}`}
                                            </span>
                                        </span>
                                        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white/15 text-white ring-1 ring-white/30 backdrop-blur transition group-hover:bg-white group-hover:text-navy">
                                            <LuArrowRight className="text-sm" />
                                        </span>
                                    </span>
                                </button>
                            )
                        })}
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
