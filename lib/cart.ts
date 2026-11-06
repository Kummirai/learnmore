"use client";

import {useEffect, useSyncExternalStore} from "react";
import type {StoreItem} from "@/constants/relate";

/**
 * Browser cart shared by the storefront, product pages, cart and checkout.
 *
 * It is a tiny external store rather than a context so every consumer (header
 * badge included) re-renders from the same snapshot. Lines persist to
 * localStorage after hydration, which keeps server rendering deterministic.
 */

export type CartLine = {
    itemId: string;
    name: string;
    /** Unit price the buyer pays (offer price when one applies). */
    price: number;
    image: string;
    /** Apparel only — null for everything else. */
    size: string | null;
    qty: number;
};

const STORAGE_KEY = "relate:web-cart:v1";
const MAX_QTY = 20;
const EMPTY: CartLine[] = [];

let lines: CartLine[] = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function emit(next: CartLine[]) {
    lines = next;
    if (typeof window !== "undefined") {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
            // Private mode or a full quota: the in-memory cart still works.
        }
    }
    for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}

const getSnapshot = () => lines;
const getServerSnapshot = () => EMPTY;
const getHydrated = () => hydrated;
const getServerHydrated = () => false;

function toLine(value: unknown): CartLine | null {
    if (!value || typeof value !== "object") return null;
    const raw = value as Record<string, unknown>;
    if (typeof raw.itemId !== "string" || !raw.itemId) return null;
    if (typeof raw.name !== "string" || !raw.name) return null;
    if (typeof raw.price !== "number" || !Number.isFinite(raw.price)) return null;
    if (typeof raw.qty !== "number" || !Number.isFinite(raw.qty)) return null;
    return {
        itemId: raw.itemId,
        name: raw.name,
        price: raw.price,
        image: typeof raw.image === "string" ? raw.image : "",
        size: typeof raw.size === "string" && raw.size ? raw.size : null,
        qty: Math.min(MAX_QTY, Math.max(1, Math.floor(raw.qty))),
    };
}

/** Restores the saved cart once; safe to call from every consumer. */
export function hydrateCart() {
    if (hydrated || typeof window === "undefined") return;
    hydrated = true;

    const read = () => {
        try {
            const raw = window.localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            const parsed: unknown = JSON.parse(raw);
            if (!Array.isArray(parsed)) return;
            const restored = parsed
                .map(toLine)
                .filter((line): line is CartLine => line !== null);
            if (restored.length > 0) emit(restored);
        } catch {
            // Corrupt payload — start with an empty cart instead of crashing.
        }
    };

    read();
    // Let hydration-aware consumers render even when the saved cart is empty.
    for (const listener of listeners) listener();
    window.addEventListener("storage", (event) => {
        if (event.key === STORAGE_KEY) read();
    });
}

export function addToCart(
    item: StoreItem,
    opts: {qty?: number; size?: string | null} = {},
) {
    const qty = Math.min(MAX_QTY, Math.max(1, Math.floor(opts.qty ?? 1)));
    const size = opts.size ?? null;
    const price =
        typeof item.offerPrice === "number" && item.offerPrice < item.price
            ? item.offerPrice
            : item.price;

    const existing = lines.find((l) => l.itemId === item.id && l.size === size);
    if (existing) {
        emit(
            lines.map((l) =>
                l === existing ? {...l, qty: Math.min(MAX_QTY, l.qty + qty)} : l,
            ),
        );
        return;
    }
    emit([...lines, {itemId: item.id, name: item.name, price, image: item.image, size, qty}]);
}

export function setLineQty(itemId: string, size: string | null, qty: number) {
    const clamped = Math.min(MAX_QTY, Math.max(0, Math.floor(qty)));
    emit(
        clamped === 0
            ? lines.filter((l) => !(l.itemId === itemId && l.size === size))
            : lines.map((l) =>
                  l.itemId === itemId && l.size === size ? {...l, qty: clamped} : l,
              ),
    );
}

export function removeLine(itemId: string, size: string | null) {
    emit(lines.filter((l) => !(l.itemId === itemId && l.size === size)));
}

export function clearCart() {
    emit(EMPTY);
}

export function cartCount(value: CartLine[]) {
    return value.reduce((sum, line) => sum + line.qty, 0);
}

export function cartSubtotal(value: CartLine[]) {
    return value.reduce((sum, line) => sum + line.price * line.qty, 0);
}

export function useCart() {
    const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    useEffect(hydrateCart, []);
    return {
        lines: snapshot,
        count: cartCount(snapshot),
        subtotal: cartSubtotal(snapshot),
        add: addToCart,
        setQty: setLineQty,
        remove: removeLine,
        clear: clearCart,
    };
}

export function useCartCount() {
    const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    useEffect(hydrateCart, []);
    return cartCount(snapshot);
}

/** True once the saved cart has been read from localStorage. */
export function useCartHydrated() {
    const value = useSyncExternalStore(subscribe, getHydrated, getServerHydrated);
    useEffect(hydrateCart, []);
    return value;
}
