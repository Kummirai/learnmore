"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa";
import { LuMinus, LuPlus, LuTrash2, LuArrowLeft, LuLoaderCircle } from "react-icons/lu";
import { useStoreItems } from "@/components/store/useStoreItems";
import { type StoreItem } from "@/constants/relate";

const formatPrice = (n: number) => `R${n.toLocaleString("en-ZA")}`;
/** What the shopper actually pays — an offer price wins over the list price. */
const payable = (item: StoreItem) => item.offerPrice ?? item.price;
const WHATSAPP_NUMBER = "27782677436";

type Line = { item: StoreItem; qty: number };

function CheckoutInner() {
    const searchParams = useSearchParams();
    const initialId = searchParams.get("item");
    const { items: catalog } = useStoreItems();

    const [lines, setLines] = useState<Line[]>(() => {
        const start = initialId ? catalog.filter((i) => i.id === initialId).map((item) => ({ item, qty: 1 })) : [];
        return start;
    });

    const [name, setName] = useState("");
    const [area, setArea] = useState("");
    const [notes, setNotes] = useState("");
    const [added, setAdded] = useState(false);

    const total = useMemo(() => lines.reduce((sum, l) => sum + payable(l.item) * l.qty, 0), [lines]);

    const addItem = (id: string) => {
        const item = catalog.find((i) => i.id === id);
        if (!item) return;
        setLines((prev) => {
            const existing = prev.find((l) => l.item.id === id);
            if (existing) return prev.map((l) => (l.item.id === id ? { ...l, qty: l.qty + 1 } : l));
            return [...prev, { item, qty: 1 }];
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    };

    const setQty = (id: string, qty: number) =>
        setLines((prev) => prev.map((l) => (l.item.id === id ? { ...l, qty: Math.max(1, Math.min(99, qty)) } : l)));

    const removeLine = (id: string) => setLines((prev) => prev.filter((l) => l.item.id !== id));

    const orderText = useMemo(() => {
        const items = lines.map((l) => `• ${l.item.name} × ${l.qty} — ${formatPrice(payable(l.item) * l.qty)}`).join("\n");
        return [
            "Hi RelateWorld! I'd like to place a store order:",
            items || "(no items selected)",
            "",
            `Total: ${formatPrice(total)}`,
            name ? `Name: ${name}` : "",
            area ? `Delivery area: ${area}` : "",
            notes ? `Notes: ${notes}` : "",
        ]
            .filter(Boolean)
            .join("\n");
    }, [lines, total, name, area, notes]);

    const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(orderText)}`;

    return (
        <section className="flex-1 px-4 py-12 bg-white">
            <div className="max-w-5xl mx-auto">
                <Link href="/store" className="inline-flex items-center gap-1.5 text-sm text-slate-gray hover:text-navy mb-6 transition-colors">
                    <LuArrowLeft /> Back to store
                </Link>

                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan mb-2">Relate Store</p>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-navy mb-2">Your order</h1>
                <p className="text-slate-gray text-sm mb-8">
                    Review your items, add your details, and send the order through WhatsApp — we confirm payment and delivery in the chat.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Items + add more */}
                    <div className="lg:col-span-3">
                        {lines.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-gray-300 bg-alice-blue/50 py-12 text-center">
                                <p className="text-sm text-slate-gray mb-4">Your order is empty — add something from the store.</p>
                                <Link href="/store" className="text-sm font-semibold text-cyan hover:text-cyan-dark transition-colors">
                                    Browse the store →
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3 mb-6">
                                {lines.map(({ item, qty }) => (
                                    <div key={item.id} className="flex items-center gap-4 rounded-xl border border-gray-100 p-3">
                                        <div className="size-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={item.image} alt={item.name} className="size-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-navy text-sm truncate">{item.name}</p>
                                            <p className="text-xs text-slate-gray">{formatPrice(item.price)} each</p>
                                        </div>
                                        <div className="flex items-center rounded-lg border border-gray-200 overflow-hidden shrink-0">
                                            <button onClick={() => setQty(item.id, qty - 1)} disabled={qty <= 1} aria-label="Decrease quantity" className="px-2.5 py-2 text-navy hover:bg-alice-blue transition disabled:opacity-30">
                                                <LuMinus className="text-sm" />
                                            </button>
                                            <span className="w-8 text-center text-sm font-bold text-navy">{qty}</span>
                                            <button onClick={() => setQty(item.id, qty + 1)} aria-label="Increase quantity" className="px-2.5 py-2 text-navy hover:bg-alice-blue transition">
                                                <LuPlus className="text-sm" />
                                            </button>
                                        </div>
                                        <span className="w-20 text-right font-bold text-navy text-sm shrink-0">{formatPrice(payable(item) * qty)}</span>
                                        <button onClick={() => removeLine(item.id)} aria-label={`Remove ${item.name}`} className="text-slate-gray hover:text-red-600 transition-colors shrink-0">
                                            <LuTrash2 className="text-sm" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Add products */}
                        <div className="rounded-2xl border border-gray-100 p-4">
                            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-gray mb-3">Add more items</p>
                            <div className="flex flex-wrap gap-2">
                                {catalog.filter((i) => !lines.some((l) => l.item.id === i.id)).map((i) => (
                                    <button
                                        key={i.id}
                                        onClick={() => addItem(i.id)}
                                        className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-navy hover:border-cyan hover:bg-alice-blue/60 transition-colors"
                                    >
                                        <LuPlus className="text-cyan" /> {i.name}
                                    </button>
                                ))}
                            </div>
                            {added && <p className="text-xs text-cyan mt-2">Added to your order ✓</p>}
                        </div>
                    </div>

                    {/* Details + summary */}
                    <div className="lg:col-span-2">
                        <div className="bg-alice-blue rounded-2xl p-5">
                            <div className="grid gap-3 mb-4">
                                <label className="block">
                                    <span className="mb-1 block text-[11px] font-semibold uppercase tracking-widest text-slate-gray">Your name</span>
                                    <input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g. Thandi Mokoena"
                                        className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-base md:text-sm text-gray-800 outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/20 transition"
                                    />
                                </label>
                                <label className="block">
                                    <span className="mb-1 block text-[11px] font-semibold uppercase tracking-widest text-slate-gray">Delivery area</span>
                                    <input
                                        value={area}
                                        onChange={(e) => setArea(e.target.value)}
                                        placeholder="e.g. Randburg / club pickup"
                                        className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-base md:text-sm text-gray-800 outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/20 transition"
                                    />
                                </label>
                                <label className="block">
                                    <span className="mb-1 block text-[11px] font-semibold uppercase tracking-widest text-slate-gray">Notes (optional)</span>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Size, colour, club name…"
                                        rows={2}
                                        className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-base md:text-sm text-gray-800 outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/20 transition resize-none"
                                    />
                                </label>
                            </div>

                            <div className="flex items-baseline justify-between border-t border-gray-200 pt-4 mb-4">
                                <span className="text-sm text-slate-gray">Total</span>
                                <span className="text-2xl font-black text-navy">{formatPrice(total)}</span>
                            </div>

                            <a
                                href={waLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full inline-flex items-center justify-center gap-2 bg-cyan text-navy px-6 py-3.5 rounded-lg font-bold text-sm hover:bg-cyan-dark transition-colors"
                            >
                                <FaWhatsapp className="text-lg" /> Send order on WhatsApp
                            </a>
                            <p className="text-xs text-slate-gray mt-3 text-center leading-relaxed">
                                Your order opens pre-filled in WhatsApp. Every purchase funds Relate clubs and community programs.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense
            fallback={
                <section className="flex-1 px-4 py-20 flex items-center justify-center bg-white">
                    <div className="flex items-center gap-3 text-slate-gray">
                        <LuLoaderCircle className="animate-spin text-2xl" />
                        <span className="text-sm">Loading your order…</span>
                    </div>
                </section>
            }
        >
            <CheckoutInner />
        </Suspense>
    );
}
