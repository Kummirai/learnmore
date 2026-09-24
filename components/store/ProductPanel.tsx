"use client";

import Link from "next/link";
import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { LuMinus, LuPlus } from "react-icons/lu";
import type { StoreItem } from "@/constants/relate";

const formatPrice = (n: number) => `R${n.toLocaleString("en-ZA")}`;
const WHATSAPP_NUMBER = "27782677436";

export default function ProductPanel({ item }: { item: StoreItem }) {
  const images = item.images?.length ? item.images : [item.image];
  const [active, setActive] = useState(images[0]);
  const [size, setSize] = useState<string | null>(item.sizes?.[0] ?? null);
  const [qty, setQty] = useState(1);

  const hasOffer = typeof item.offerPrice === "number" && item.offerPrice < item.price;
  const showPrice: number = hasOffer ? item.offerPrice! : item.price;
  const total = showPrice * qty;

  const sizeNote = size ? ` (size ${size})` : "";
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi RelateWorld! I'd like to order the ${item.name} × ${qty}${sizeNote} — ${formatPrice(total)}.`,
  )}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-16">
      {/* Gallery */}
      <div className="flex flex-col-reverse md:flex-row gap-3">
        <div className="flex md:flex-col gap-3 md:max-w-24 max-w-full md:basis-full">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(src)}
              aria-label={`View image ${i + 1} of ${item.name}`}
              className={`size-20 md:size-24 shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                active === src ? "border-cyan" : "border-gray-200 hover:border-cyan/60"
              } bg-alice-blue`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`${item.name} — view ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
        <div className="flex-1 aspect-square rounded-xl overflow-hidden bg-alice-blue border border-gray-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={active} alt={item.name} className="w-full h-full object-contain p-2 md:p-4" />
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col text-sm">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan mb-2">{item.category}</p>
        <h2 className="text-3xl font-black tracking-tight text-navy mb-1">{item.name}</h2>

        {typeof item.rating === "number" && (
          <div className="flex items-center gap-0.5 mt-2 text-cyan">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} filled={item.rating! > i} />
            ))}
            <p className="ml-2 text-slate-gray">({item.rating})</p>
          </div>
        )}

        <div className="mt-5 flex items-baseline gap-2.5">
          {hasOffer && (
            <p className="text-slate-gray line-through">{formatPrice(item.price)}</p>
          )}
          <p className="text-2xl font-black text-navy">{formatPrice(showPrice)}</p>
        </div>
        <p className="text-[11px] text-slate-gray mt-0.5">(incl. VAT)</p>

        <p className="text-gray-600 leading-relaxed mt-5">{item.blurb}</p>

        {item.details && (
          <>
            <p className="text-base font-bold text-navy mt-6 mb-2">About this product</p>
            <ul className="space-y-2 list-none">
              {item.details.map((d) => (
                <li key={d} className="flex gap-2 items-start text-gray-600">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan" />
                  {d}
                </li>
              ))}
            </ul>
          </>
        )}

        {item.sizes?.length && (
          <div className="mt-6">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-gray mb-2">
              Select size
            </p>
            <div className="flex flex-wrap gap-2">
              {item.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  aria-pressed={size === s}
                  className={`min-w-12 px-3 py-2.5 rounded-lg border font-semibold text-sm transition-colors ${
                    size === s
                      ? "bg-navy text-white border-navy"
                      : "border-gray-300 text-navy hover:border-navy hover:bg-alice-blue"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-gray mb-2">Quantity</p>
          <div className="flex items-center rounded-lg border border-gray-200 overflow-hidden w-fit">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              disabled={qty <= 1}
              aria-label="Decrease quantity"
              className="px-3.5 py-2.5 text-navy hover:bg-alice-blue transition disabled:opacity-30"
            >
              <LuMinus />
            </button>
            <span className="w-10 text-center font-bold text-navy">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(99, q + 1))}
              aria-label="Increase quantity"
              className="px-3.5 py-2.5 text-navy hover:bg-alice-blue transition"
            >
              <LuPlus />
            </button>
          </div>
        </div>

        <div className="flex items-baseline gap-2 mt-6">
          <span className="text-slate-gray">Total</span>
          <span className="text-2xl font-black text-navy">{formatPrice(total)}</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-cyan text-navy px-6 py-3.5 rounded-lg font-bold hover:bg-cyan-dark transition-colors"
          >
            <FaWhatsapp className="text-lg" /> Order on WhatsApp
          </a>
          <Link
            href={`/store/checkout?item=${item.id}`}
            className="flex-1 inline-flex items-center justify-center px-6 py-3.5 rounded-lg font-bold border-2 border-navy text-navy hover:bg-navy hover:text-white transition-colors"
          >
            Continue to basket
          </Link>
        </div>
        <p className="text-xs text-slate-gray mt-3">Pay on delivery or EFT — we confirm your order in the chat.</p>
      </div>
    </div>
  );
}

function Star({ filled }: { filled: boolean }) {
  return (
    <svg width="14" height="13" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M8.049.927c.3-.921 1.603-.921 1.902 0l1.294 3.983a1 1 0 0 0 .951.69h4.188c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 0 0-.364 1.118l1.295 3.983c.299.921-.756 1.688-1.54 1.118L9.589 13.63a1 1 0 0 0-1.176 0l-3.389 2.46c-.783.57-1.838-.197-1.539-1.118L4.78 10.99a1 1 0 0 0-.363-1.118L1.028 7.41c-.783-.57-.38-1.81.588-1.81h4.188a1 1 0 0 0 .95-.69z"
        fill="currentColor"
        fillOpacity={filled ? 1 : 0.35}
      />
    </svg>
  );
}