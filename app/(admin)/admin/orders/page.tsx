"use client";

import {useCallback, useEffect, useMemo, useState} from "react";
import {
    LuBan,
    LuCheck,
    LuChevronDown,
    LuChevronRight,
    LuClock3,
    LuPackageCheck,
    LuSearch,
    LuTruck,
    LuWallet,
} from "react-icons/lu";
import {AdminHeader, Badge, Button, Field, Input, Select} from "@/components/admin/ui";

type Status = "received" | "payment_received" | "shipped" | "delivered" | "cancelled";
type Filter = Status | "all";

type OrderItem = {
    itemId: string;
    name: string;
    price: number;
    qty: number;
    size?: string | null;
    image?: string;
};

type StatusEntry = {status: Status; at: string; note?: string};

type Order = {
    _id: string;
    orderNumber: string;
    userId?: string | null;
    customerName: string;
    phone: string;
    email: string;
    note: string;
    items: OrderItem[];
    subtotal: number;
    total: number;
    currency: string;
    status: Status;
    statusHistory: StatusEntry[];
    eta: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
};

const STATUS_LABEL: Record<Status, string> = {
    received: "Waiting for payment",
    payment_received: "Payment received",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
};

const STATUS_TONE: Record<Status, "gold" | "amber" | "slate" | "sky"> = {
    received: "amber",
    payment_received: "sky",
    shipped: "gold",
    delivered: "gold",
    cancelled: "slate",
};

const NEXT_STEP: Partial<Record<Status, {status: Status; label: string; icon: typeof LuTruck}>> = {
    received: {status: "payment_received", label: "Mark payment received", icon: LuWallet},
    payment_received: {status: "shipped", label: "Mark shipped", icon: LuTruck},
    shipped: {status: "delivered", label: "Mark delivered", icon: LuPackageCheck},
};

function dateText(value?: string | null): string {
    if (!value) return "unknown date";
    const d = new Date(value);
    return Number.isNaN(d.getTime())
        ? "unknown date"
        : d.toLocaleDateString(undefined, {month: "short", day: "numeric", year: "numeric"});
}

function money(value: number): string {
    return `R${Number.isFinite(value) ? value.toLocaleString() : 0}`;
}

/** `2026-10-14` for the date input, taken from an ISO timestamp or a plain date. */
function toDateInput(value?: string | null): string {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : "";
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[] | null>(null);
    const [filter, setFilter] = useState<Filter>("all");
    const [query, setQuery] = useState("");
    const [openId, setOpenId] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const [etaDraft, setEtaDraft] = useState<Record<string, string>>({});
    const [noteDraft, setNoteDraft] = useState<Record<string, string>>({});

    const load = useCallback(async () => {
        const params = new URLSearchParams();
        if (filter !== "all") params.set("status", filter);
        try {
            const res = await fetch(`/api/admin/orders?${params}`, {cache: "no-store"});
            const json = await res.json().catch(() => null);
            if (!res.ok) {
                setError(typeof json?.error === "string" ? json.error : "Couldn't load orders.");
                setOrders([]);
                return;
            }
            setError("");
            setOrders(Array.isArray(json?.data) ? json.data : []);
        } catch {
            setError("Couldn't reach the API. Is the backend up?");
            setOrders([]);
        }
    }, [filter]);

    useEffect(() => {
        (async () => {
            await load();
        })();
    }, [load]);

    const visible = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return orders ?? [];
        return (orders ?? []).filter((o) =>
            [o.orderNumber, o.customerName, o.phone, o.email, o.note, ...o.items.map((i) => i.name)]
                .filter(Boolean)
                .some((f) => String(f).toLowerCase().includes(q)),
        );
    }, [orders, query]);

    /** PATCH the order, then refresh the queue. */
    const patch = async (id: string, body: Record<string, unknown>, after?: () => void) => {
        setBusy(true);
        setError("");
        try {
            const res = await fetch(`/api/admin/orders/${id}`, {
                method: "PATCH",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body),
            });
            const json = await res.json().catch(() => null);
            if (!res.ok) {
                setError(typeof json?.error === "string" ? json.error : "That update failed.");
                return;
            }
            after?.();
            await load();
        } catch {
            setError("That update failed. Try again.");
        } finally {
            setBusy(false);
        }
    };

    const advance = (o: Order) => {
        const step = NEXT_STEP[o.status];
        if (!step) return;
        const note = (noteDraft[o._id] ?? "").trim();
        patch(
            o._id,
            note ? {status: step.status, note} : {status: step.status},
            () => {
                const next = {...noteDraft};
                delete next[o._id];
                setNoteDraft(next);
            },
        );
    };

    const cancel = (o: Order) => {
        if (!window.confirm(`Cancel ${o.orderNumber}? The buyer will see this on their phone.`)) return;
        const note = (noteDraft[o._id] ?? "").trim();
        patch(o._id, note ? {status: "cancelled", note} : {status: "cancelled"});
    };

    const saveEta = (o: Order) => {
        const eta = etaDraft[o._id] ?? "";
        patch(o._id, {eta});
    };

    return (
        <div>
            <AdminHeader
                eyebrow="Commerce"
                title="Orders"
                sub="Store checkouts waiting on payment and fulfilment — move each order forward and the buyer sees it update in the app."
            />

            {error ? (
                <p className="mb-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
            ) : null}

            <div className="mb-4 grid gap-3 sm:grid-cols-3">
                <Field label="Status">
                    <Select value={filter} onChange={(e) => setFilter(e.target.value as Filter)}>
                        <option value="all">All orders</option>
                        <option value="received">Waiting for payment</option>
                        <option value="payment_received">Payment received</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </Select>
                </Field>
                <Field label="Search">
                    <div className="relative">
                        <LuSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Order number, customer, item…"
                            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-base text-gray-800 shadow-sm outline-none transition focus:border-cyan focus:ring-2 focus:ring-cyan/20 md:text-sm"
                        />
                    </div>
                </Field>
                <Field label="Queue">
                    <p className="rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-slate-gray shadow-sm">
                        {orders === null ? "Loading…" : `${visible.length} order${visible.length === 1 ? "" : "s"} in view`}
                    </p>
                </Field>
            </div>

            {orders === null ? (
                <p className="rounded-2xl border border-dashed border-gray-300 bg-alice-blue/40 py-12 text-center text-sm text-slate-gray">
                    Loading orders…
                </p>
            ) : visible.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-alice-blue/40 py-12 text-center">
                    <LuTruck className="mx-auto mb-2 text-2xl text-slate-gray"/>
                    <p className="text-sm text-slate-gray">
                        {query ? "No orders match that search." : "No orders in this view."}
                    </p>
                </div>
            ) : (
                <div className="grid gap-3">
                    {visible.map((o) => {
                        const isOpen = openId === o._id;
                        const step = NEXT_STEP[o.status];
                        const itemSummary = o.items
                            .map((i) => `${i.qty}× ${i.name}${i.size ? ` (${i.size})` : ""}`)
                            .join(", ");

                        return (
                            <div key={o._id} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:p-5">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="font-semibold text-navy">{o.orderNumber}</p>
                                        <p className="mt-0.5 text-xs text-slate-gray">
                                            {dateText(o.createdAt)} · {o.customerName}
                                            {o.phone ? ` · ${o.phone}` : ""}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-sm font-bold text-navy">{money(o.total)}</span>
                                        <Badge tone={STATUS_TONE[o.status] ?? "slate"}>{STATUS_LABEL[o.status] ?? o.status}</Badge>
                                    </div>
                                </div>

                                <p className="mt-2 text-sm text-gray-600">
                                    <span className="mr-2 text-[11px] uppercase tracking-widest text-slate-gray">Items</span>
                                    {itemSummary || "—"}
                                </p>
                                {o.email ? (
                                    <p className="mt-1 text-sm text-gray-600">
                                        <span className="mr-2 text-[11px] uppercase tracking-widest text-slate-gray">Email</span>
                                        {o.email}
                                    </p>
                                ) : null}
                                {o.note ? (
                                    <p className="mt-1 text-sm italic text-gray-500">“{o.note}”</p>
                                ) : null}

                                <div className="mt-4 flex flex-wrap items-end gap-3 border-t border-gray-50 pt-4">
                                    <div className="w-44">
                                        <Field label="Estimated delivery">
                                            <Input
                                                type="date"
                                                value={etaDraft[o._id] ?? toDateInput(o.eta)}
                                                onChange={(e) => setEtaDraft((d) => ({...d, [o._id]: e.target.value}))}
                                            />
                                        </Field>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        disabled={busy}
                                        onClick={() => saveEta(o)}
                                    >
                                        <LuClock3/> Save ETA
                                    </Button>
                                    <div className="ml-auto flex flex-wrap gap-2">
                                        <Button
                                            disabled={busy || !step}
                                            onClick={() => advance(o)}
                                            title={step ? `Sets status to ${STATUS_LABEL[step.status]}` : "This order is finished"}
                                        >
                                            {step ? <step.icon/> : <LuCheck/>} {step ? step.label : "Completed"}
                                        </Button>
                                        {o.status !== "delivered" && o.status !== "cancelled" ? (
                                            <Button variant="danger" disabled={busy} onClick={() => cancel(o)}>
                                                <LuBan/> Cancel order
                                            </Button>
                                        ) : null}
                                        <Button
                                            variant="ghost"
                                            onClick={() => {
                                                setOpenId(isOpen ? null : o._id);
                                            }}
                                        >
                                            {isOpen ? <LuChevronDown/> : <LuChevronRight/>} History
                                        </Button>
                                    </div>
                                </div>

                                {isOpen ? (
                                    <div className="mt-4 grid gap-4 rounded-xl bg-alice-blue/40 p-4 md:grid-cols-2">
                                        <div>
                                            <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-slate-gray">
                                                Receipt
                                            </p>
                                            <ul className="space-y-2">
                                                {o.items.map((i, idx) => (
                                                    <li key={`${i.itemId}-${idx}`} className="flex items-center gap-3 text-sm">
                                                        {i.image ? (
                                                            // eslint-disable-next-line @next/next/no-img-element
                                                            <img src={i.image} alt="" className="h-9 w-9 rounded-lg object-cover"/>
                                                        ) : null}
                                                        <span className="flex-1 text-gray-700">
                                                            {i.name}
                                                            {i.size ? ` · ${i.size}` : ""} × {i.qty}
                                                        </span>
                                                        <span className="font-semibold text-navy">{money(i.price * i.qty)}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <p className="mt-3 flex items-center justify-between border-t border-gray-200 pt-2 text-sm font-bold text-navy">
                                                <span>Total</span>
                                                <span>{money(o.total)}</span>
                                            </p>
                                        </div>

                                        <div>
                                            <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-slate-gray">
                                                Status history
                                            </p>
                                            <ul className="space-y-2">
                                                {[...(o.statusHistory ?? [])].reverse().map((h, i) => (
                                                    <li key={i} className="text-sm text-gray-700">
                                                        <span className="font-semibold text-navy">
                                                            {STATUS_LABEL[h.status] ?? h.status}
                                                        </span>
                                                        <span className="ml-2 text-xs text-slate-gray">{dateText(h.at)}</span>
                                                        {h.note ? <p className="text-xs italic text-gray-500">{h.note}</p> : null}
                                                    </li>
                                                ))}
                                            </ul>

                                            <div className="mt-3">
                                                <Field label="Note for this update" hint="Stored on the order's history.">
                                                    <Input
                                                        value={noteDraft[o._id] ?? ""}
                                                        onChange={(e) => setNoteDraft((d) => ({...d, [o._id]: e.target.value}))}
                                                        placeholder="e.g. Proof of payment received"
                                                    />
                                                </Field>
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
