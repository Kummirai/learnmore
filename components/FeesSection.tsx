"use client"

import Link from "next/link"
import Image from "next/image"
import {LuCircleAlert, LuLoaderCircle, LuShoppingBag} from "react-icons/lu"
import {useStoreItems} from "@/components/store/useStoreItems"

const formatPrice = (n: number) => `R ${n.toLocaleString("en-ZA")}`

const FEATURED_COUNT = 4

export default function FeesSection() {
    const {items, loading, error} = useStoreItems()
    const featuredItems = items
        .slice(0, FEATURED_COUNT)
        .map((item, i) => ({item, featured: i === 1}))

    return (
        <section className={"reveal bg-stage px-6 py-24 md:px-4 md:py-32"}>
            <div className={"max-w-6xl mx-auto"}>
                <div className={"mb-12 max-w-2xl md:mb-16"}>
                    <p className={"mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan"}>
                        Relate Store
                    </p>
                    <h2 className={"text-3xl md:text-4xl font-semibold text-navy"}>
                        Wear the family
                    </h2>
                    <p className={"mt-4 text-lg text-navy/70"}>
                        Every purchase raises funds for Relate clubs and community programs. Order on WhatsApp and we&rsquo;ll sort out the rest.
                    </p>
                </div>
                {loading ? (
                    <div className={"flex items-center justify-center gap-3 py-12 text-gray-500"} role={"status"}>
                        <LuLoaderCircle className={"animate-spin text-xl"} />
                        <span className={"text-sm"}>Loading the store…</span>
                    </div>
                ) : error ? (
                    <div className={"rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center"} role={"alert"}>
                        <LuCircleAlert className={"text-red-500 text-xl mx-auto mb-2"} />
                        <p className={"text-sm font-semibold text-red-700 mb-1"}>We couldn&rsquo;t load the store.</p>
                        <p className={"text-sm text-red-600"}>{error}</p>
                    </div>
                ) : items.length === 0 ? (
                    <div className={"rounded-xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center"}>
                        <LuShoppingBag className={"text-2xl text-gray-400 mx-auto mb-2"} />
                        <p className={"text-sm text-gray-500"}>The store is empty right now — check back soon for new gear.</p>
                    </div>
                ) : (
                    <div className={"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"}>
                        {featuredItems.map(({item, featured}) => (
                            <div key={item.id}
                                 className={`bg-white rounded-2xl p-6 shadow-sm border-2 text-center flex flex-col hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ${featured ? "border-cyan relative" : "border-transparent"}`}>
                                {featured && (
                                    <span className={"absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan text-navy text-xs font-semibold px-4 py-1 rounded-full z-10"}>
                                        Most Popular
                                    </span>
                                )}
                                <a href={`/store/${item.id}`} className={"block aspect-square overflow-hidden mb-4 bg-gray-100 group"}>
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        width={640}
                                        height={640}
                                        className={"size-full object-cover group-hover:scale-105 transition-transform duration-500"}
                                    />
                                </a>
                                <h3 className={"text-lg font-semibold text-gray-800 mb-1"}>
                                    <a href={`/store/${item.id}`} className="hover:text-cyan transition-colors inline-flex min-h-11 items-center">{item.name}</a>
                                </h3>
                                <p className={"text-3xl font-bold text-navy mb-1"}>{formatPrice(item.price)}</p>
                                <p className={"text-sm text-gray-500 mb-4 flex-1"}>{item.blurb}</p>
                                <div className={"flex flex-col gap-2 mt-auto"}>
                                    <a href={`/store/checkout?item=${item.id}`}
                                       className={`block text-sm font-medium py-3 min-h-11 rounded transition-colors ${featured ? "bg-navy text-white hover:bg-navy-dark" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                                        Order now
                                    </a>
                                    <a href={`/store/${item.id}`}
                                       className="inline-flex min-h-11 items-center text-xs font-medium text-slate-gray hover:text-navy transition-colors">
                                        View details
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div className={"text-center"}>
                    <Link href={"/store"}
                          className={"link-chevron"}>
                        Browse the full store
                    </Link>
                </div>
            </div>
        </section>
    )
}
