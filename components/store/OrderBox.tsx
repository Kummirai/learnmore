"use client";

import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { LuMinus, LuPlus } from "react-icons/lu";
import type { StoreItem } from "@/constants/relate";

const formatPrice = (n: number) => `R${n.toLocaleString("en-ZA")}`;

/** Quantity stepper + WhatsApp order CTA on the product detail page. */
export default function OrderBox({ item }: { item: StoreItem }) {
    const [qty, setQty] = useState(1);
    const total = item.price * qty;

    const waLink = `https://wa.me/27782677436?text=${encodeURIComponent(
        `Hi RelateWorld! I'd like to order the ${item.name} × ${qty} (${formatPrice(total)}).`,
    )}`;

    return (
        <div className="bg-alice-blue rounded-2xl p-5">
            <div className="flex items-center gap-4 mb-4">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-gray">Quantity</span>
                <div className="flex items-center rounded-lg border border-gray-200 bg-white overflow-hidden">
                    <button
                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                        disabled={qty <= 1}
                        aria-label="Decrease quantity"
                        className="px-3.5 py-2.5 text-navy hover:bg-alice-blue transition disabled:opacity-30"
                    >
                        <LuMinus />
                    </button>
                    <span className="w-10 text-center font-bold text-navy">{qty}</span>
                    <button
                        onClick={() => setQty((q) => Math.min(99, q + 1))}
                        aria-label="Increase quantity"
                        className="px-3.5 py-2.5 text-navy hover:bg-alice-blue transition"
                    >
                        <LuPlus />
                    </button>
                </div>
            </div>

            <div className="flex items-baseline justify-between mb-4">
                <span className="text-sm text-slate-gray">Total</span>
                <span className="text-2xl font-black text-navy">{formatPrice(total)}</span>
            </div>

            <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-cyan text-navy px-6 py-3.5 rounded-lg font-bold text-sm hover:bg-cyan-dark transition-colors"
            >
                <FaWhatsapp className="text-lg" /> Order on WhatsApp
            </a>
            <p className="text-xs text-slate-gray mt-3 text-center">
                Pay on delivery or EFT — we confirm your order in the chat.
            </p>
        </div>
    );
}
