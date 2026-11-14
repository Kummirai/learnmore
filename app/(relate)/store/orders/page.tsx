"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {LuArrowRight, LuLoaderCircle, LuPackage, LuReceiptText} from "react-icons/lu";
import Navbar from "@/components/Navbar";
import {useAuth} from "@/components/AuthProvider";
import {
    ORDER_STATUS_LABEL,
    ORDER_STATUS_SUB,
    formatOrderDate,
    ordersApi,
    type Order,
    type OrderStatus,
} from "@/lib/orders";

const formatPrice = (n: number) => `R${n.toLocaleString("en-ZA")}`;

const STATUS_TONE: Record<OrderStatus, string> = {
    received: "bg-cyan/15 text-cyan-dark",
    payment_received: "bg-blue/10 text-blue",
    shipped: "bg-amber-50 text-amber-700",
    delivered: "bg-emerald-50 text-emerald-700",
    cancelled: "bg-red-50 text-red-600",
};

export default function OrdersPage() {
    const router = useRouter();
    const {user, loading: authLoading} = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            router.replace(`/signin?next=${encodeURIComponent("/store/orders")}`);
            return;
        }
        let cancelled = false;
        (async () => {
            try {
                const data = await ordersApi.mine();
                if (!cancelled) {
                    setOrders(data);
                    setError(null);
                }
            } catch (loadError) {
                if (!cancelled) {
                    setError(loadError instanceof Error ? loadError.message : "We couldn't load your orders.");
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [authLoading, router, user]);

    return (
        <>
            <Navbar />
            <section className="flex-1 bg-white px-4 py-10 md:py-14">
                <div className="mx-auto max-w-4xl">
                    <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
                        <div>
                            <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-cyan">Relate Store</p>
                            <h1 className="text-3xl font-black tracking-tight text-navy md:text-4xl">My orders</h1>
                            <p className="mt-1 text-sm text-slate-gray">
                                {loading || orders.length === 0
                                    ? "Track every order and payment from here."
                                    : `${orders.length} order${orders.length === 1 ? "" : "s"} on your account.`}
                            </p>
                        </div>
                        <Link
                            href="/store"
                            className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-slate-gray transition-colors hover:text-navy"
                        >
                            Continue shopping <LuArrowRight />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex items-center gap-3 py-20 text-slate-gray" role="status">
                            <LuLoaderCircle className="animate-spin text-2xl" />
                            <span className="text-sm">Loading your orders…</span>
                        </div>
                    ) : error ? (
                        <div role="alert" className="rounded-2xl bg-red-50 px-6 py-10 text-center shadow-sm">
                            <p className="text-sm font-semibold text-red-700">{error}</p>
                            <button
                                type="button"
                                onClick={() => window.location.reload()}
                                className="mt-4 min-h-11 rounded-lg bg-red-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
                            >
                                Try again
                            </button>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="rounded-3xl bg-alice-blue/40 px-6 py-16 text-center">
                            <span className="mx-auto mb-4 grid size-16 place-items-center rounded-full bg-white text-navy shadow-sm">
                                <LuReceiptText className="text-2xl" />
                            </span>
                            <h2 className="text-lg font-bold text-navy">No orders yet</h2>
                            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-gray">
                                When you check out, your receipts and delivery progress will appear here.
                            </p>
                            <Link
                                href="/store"
                                className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full btn-signin px-6 py-3 text-sm font-bold text-white transition-colors hover:brightness-95"
                            >
                                Browse the store <LuArrowRight />
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {orders.map((order) => {
                                const itemCount = order.items.reduce((sum, item) => sum + item.qty, 0);
                                return (
                                    <Link
                                        key={order._id}
                                        href={`/store/orders/${order._id}`}
                                        className="group flex flex-wrap items-center gap-4 rounded-2xl bg-white p-4 shadow-[0_6px_22px_rgba(11,25,44,0.10)] transition-shadow hover:shadow-[0_10px_28px_rgba(11,25,44,0.12)] sm:flex-nowrap sm:p-5"
                                    >
                                        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-alice-blue text-navy">
                                            <LuPackage className="text-xl" />
                                        </span>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="text-sm font-bold text-navy">{order.orderNumber}</p>
                                                <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${STATUS_TONE[order.status]}`}>
                                                    {ORDER_STATUS_LABEL[order.status]}
                                                </span>
                                            </div>
                                            <p className="mt-0.5 text-xs text-slate-gray">
                                                {formatOrderDate(order.createdAt) || "Just placed"} · {itemCount} item{itemCount === 1 ? "" : "s"} · {ORDER_STATUS_SUB[order.status]}
                                            </p>
                                        </div>

                                        <span className="text-base font-black tracking-tight text-navy">{formatPrice(order.total)}</span>
                                        <LuArrowRight className="shrink-0 text-slate-gray transition-transform group-hover:translate-x-0.5 group-hover:text-blue" />
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
