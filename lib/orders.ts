"use client";

import type {CartLine} from "@/lib/cart";

/**
 * Store orders on the web — checkout, receipts and progress tracking.
 *
 * The backend owns pricing and status transitions; the web only reads them so
 * an order looks identical in the web store, the app and the admin console.
 */

export type OrderStatus =
    | "received"
    | "payment_received"
    | "shipped"
    | "delivered"
    | "cancelled";

export const ORDER_PROGRESS: OrderStatus[] = [
    "received",
    "payment_received",
    "shipped",
    "delivered",
];

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
    received: "Order received",
    payment_received: "Payment received",
    shipped: "Order shipped",
    delivered: "Order delivered",
    cancelled: "Cancelled",
};

export const ORDER_STATUS_SUB: Record<OrderStatus, string> = {
    received: "Waiting for payment",
    payment_received: "Being processed",
    shipped: "On its way to you",
    delivered: "Delivered",
    cancelled: "Order cancelled",
};

export type OrderItem = {
    itemId: string;
    name: string;
    price: number;
    qty: number;
    size?: string | null;
    image?: string;
};

export type OrderStatusEntry = {
    status: OrderStatus;
    at: string;
    note?: string;
};

export type Order = {
    _id: string;
    orderNumber: string;
    customerName: string;
    phone: string;
    email: string;
    note: string;
    items: OrderItem[];
    subtotal: number;
    total: number;
    currency: string;
    status: OrderStatus;
    statusHistory: OrderStatusEntry[];
    eta: string | null;
    createdAt: string | null;
    updatedAt: string | null;
};

export type OrderCustomer = {
    name: string;
    phone: string;
    email?: string;
    note?: string;
};

export type BankingDetails = {
    bankName: string;
    accountHolder: string;
    accountNumber: string;
    branchCode: string;
    accountType: string;
    reference: string;
    instructions: string;
};

export type PlacedOrder = {order: Order; banking: BankingDetails | null};
export type OrderReceipt = {order: Order; banking: BankingDetails | null};

type OrderEnvelope = {data?: unknown; error?: unknown; banking?: unknown};

async function orderFetchJson(path: string, init?: RequestInit): Promise<OrderEnvelope | null> {
    const res = await fetch(path, {
        cache: "no-store",
        credentials: "same-origin",
        ...init,
        headers: {
            ...(init?.body ? {"Content-Type": "application/json"} : {}),
            ...init?.headers,
        },
    });
    const json = await res.json().catch(() => null);
    if (!res.ok) {
        throw new Error(
            typeof json?.error === "string" && json.error
                ? json.error
                : "We couldn't complete that request.",
        );
    }
    return json;
}

function orderFetch<T>(path: string, init?: RequestInit): Promise<T> {
    return orderFetchJson(path, init).then((json) => json?.data as T);
}

export const ordersApi = {
    /** Prices are recomputed server-side from the catalogue. */
    place: (lines: CartLine[], customer: OrderCustomer) =>
        orderFetch<PlacedOrder>("/api/orders", {
            method: "POST",
            body: JSON.stringify({
                items: lines.map((l) => ({itemId: l.itemId, qty: l.qty, size: l.size})),
                customer,
            }),
        }),

    mine: () => orderFetch<Order[]>("/api/orders"),

    /** One order plus the current banking details, for the receipt. */
    get: async (id: string): Promise<OrderReceipt> => {
        const json = await orderFetchJson(`/api/orders/${encodeURIComponent(id)}`);
        return {
            order: json?.data as Order,
            banking: (json?.banking ?? null) as BankingDetails | null,
        };
    },
};

/** Index of the furthest step reached, for the progress bar. */
export function progressIndex(order: Order) {
    if (order.status === "cancelled") return -1;
    const index = ORDER_PROGRESS.indexOf(order.status);
    return index === -1 ? 0 : index;
}

export function formatOrderDate(value?: string | null) {
    if (!value) return "";
    const date = new Date(value);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-ZA", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

/** The latest history entry for a status (used to show when it happened). */
export function historyAt(order: Order, status: OrderStatus) {
    const entry = [...order.statusHistory].reverse().find((h) => h.status === status);
    return entry?.at ?? null;
}

const bankingKey = (orderId: string) => `relate:order-banking:${orderId}`;

/** The checkout response carries banking details; remember them for the receipt. */
export function rememberBanking(orderId: string, banking: BankingDetails | null) {
    if (!banking || typeof window === "undefined") return;
    try {
        window.localStorage.setItem(bankingKey(orderId), JSON.stringify(banking));
    } catch {
        // Storage may be unavailable; the receipt simply omits the panel.
    }
}

export function readBanking(orderId: string): BankingDetails | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = window.localStorage.getItem(bankingKey(orderId));
        return raw ? (JSON.parse(raw) as BankingDetails) : null;
    } catch {
        return null;
    }
}
