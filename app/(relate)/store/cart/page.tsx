"use client";

import Link from "next/link";
import Image from "next/image";
import {LuArrowRight, LuMinus, LuPlus, LuShoppingBag, LuTrash2} from "react-icons/lu";
import Navbar from "@/components/Navbar";
import {useCart, useCartHydrated} from "@/lib/cart";

const formatPrice = (n: number) => `R${n.toLocaleString("en-ZA")}`;

export default function CartPage() {
    const {lines, count, subtotal, setQty, remove} = useCart();
    const hydrated = useCartHydrated();

    return (
        <>
            <Navbar />
            <section className="flex-1 bg-white px-4 py-10 md:py-14">
                <div className="mx-auto max-w-5xl">
                    <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
                        <div>
                            <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-cyan">Relate Store</p>
                            <h1 className="text-3xl font-black tracking-tight text-navy md:text-4xl">Your cart</h1>
                            <p className="mt-1 text-sm text-slate-gray">
                                {!hydrated || count === 0
                                    ? "Nothing here yet."
                                    : `${count} item${count === 1 ? "" : "s"} ready for checkout.`}
                            </p>
                        </div>
                        <Link
                            href="/store"
                            className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-slate-gray transition-colors hover:text-navy"
                        >
                            Continue shopping <LuArrowRight />
                        </Link>
                    </div>

                    {!hydrated ? (
                        <div className="grid gap-3" role="status" aria-label="Loading your cart">
                            {Array.from({length: 2}).map((_, i) => (
                                <div key={i} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-[0_6px_22px_rgba(11,25,44,0.10)]">
                                    <div className="size-20 animate-pulse rounded-xl bg-alice-blue" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3.5 w-2/5 animate-pulse rounded bg-alice-blue" />
                                        <div className="h-3 w-1/4 animate-pulse rounded bg-alice-blue" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : lines.length === 0 ? (
                        <div className="rounded-3xl bg-alice-blue/40 px-6 py-16 text-center">
                            <span className="mx-auto mb-4 grid size-16 place-items-center rounded-full bg-white text-navy shadow-sm">
                                <LuShoppingBag className="text-2xl" />
                            </span>
                            <h2 className="text-lg font-bold text-navy">Your cart is empty</h2>
                            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-gray">
                                Browse the Relate Store for merch, apparel and gifts — every purchase funds clubs and community programmes.
                            </p>
                            <Link
                                href="/store"
                                className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-navy px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-navy-soft"
                            >
                                Start shopping <LuArrowRight />
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-8 lg:grid-cols-5">
                            <div className="space-y-3 lg:col-span-3">
                                {lines.map((line) => (
                                    <div
                                        key={`${line.itemId}:${line.size ?? ""}`}
                                        className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-3 shadow-[0_6px_22px_rgba(11,25,44,0.10)] sm:flex-nowrap sm:gap-4 sm:p-4"
                                    >
                                        <Link
                                            href={`/store/${line.itemId}`}
                                            className="size-20 shrink-0 overflow-hidden rounded-xl bg-alice-blue"
                                            aria-label={`View ${line.name}`}
                                        >
                                            {line.image ? (
                                                <Image
                                                    src={line.image}
                                                    alt={line.name}
                                                    width={160}
                                                    height={160}
                                                    className="size-full object-cover"
                                                />
                                            ) : (
                                                <span className="grid size-full place-items-center text-slate-gray">
                                                    <LuShoppingBag />
                                                </span>
                                            )}
                                        </Link>

                                        <div className="min-w-0 flex-1">
                                            <Link
                                                href={`/store/${line.itemId}`}
                                                className="line-clamp-2 text-sm font-bold text-navy transition-colors hover:text-blue"
                                            >
                                                {line.name}
                                            </Link>
                                            {line.size ? (
                                                <p className="mt-0.5 text-xs text-slate-gray">Size {line.size}</p>
                                            ) : null}
                                            <p className="mt-1 text-sm font-bold text-navy">{formatPrice(line.price * line.qty)}</p>
                                        </div>

                                        <div className="flex items-center overflow-hidden rounded-lg bg-alice-blue">
                                            <button
                                                type="button"
                                                onClick={() => setQty(line.itemId, line.size, line.qty - 1)}
                                                aria-label={`Decrease quantity of ${line.name}`}
                                                className="grid size-11 place-items-center text-navy transition-colors hover:bg-alice-blue"
                                            >
                                                <LuMinus className="text-sm" />
                                            </button>
                                            <span className="w-9 text-center text-sm font-bold text-navy">{line.qty}</span>
                                            <button
                                                type="button"
                                                onClick={() => setQty(line.itemId, line.size, line.qty + 1)}
                                                aria-label={`Increase quantity of ${line.name}`}
                                                className="grid size-11 place-items-center text-navy transition-colors hover:bg-alice-blue"
                                            >
                                                <LuPlus className="text-sm" />
                                            </button>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => remove(line.itemId, line.size)}
                                            aria-label={`Remove ${line.name}`}
                                            className="grid size-11 shrink-0 place-items-center rounded-lg text-slate-gray transition-colors hover:bg-red-50 hover:text-red-600"
                                        >
                                            <LuTrash2 className="text-base" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <aside className="lg:col-span-2">
                                <div className="rounded-2xl bg-alice-blue p-5 md:p-6">
                                    <h2 className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-gray">
                                        Order summary
                                    </h2>
                                    <div className="space-y-2.5 text-sm">
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-gray">Subtotal</span>
                                            <span className="font-semibold text-navy">{formatPrice(subtotal)}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-gray">Delivery</span>
                                            <span className="font-semibold text-cyan-dark">Arranged on payment</span>
                                        </div>
                                    </div>
                                    <div className="my-4 h-px bg-navy/10" />
                                    <div className="flex items-baseline justify-between">
                                        <span className="text-sm font-bold text-navy">Total</span>
                                        <span className="text-2xl font-black tracking-tight text-navy">{formatPrice(subtotal)}</span>
                                    </div>

                                    <Link
                                        href="/store/checkout"
                                        className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-navy px-6 text-sm font-bold text-white transition-colors hover:bg-navy-soft"
                                    >
                                        Checkout <LuArrowRight />
                                    </Link>
                                    <p className="mt-3 text-center text-xs leading-relaxed text-slate-gray">
                                        Pay by EFT after checkout — your receipt carries the order number and our banking details.
                                    </p>
                                </div>
                            </aside>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
