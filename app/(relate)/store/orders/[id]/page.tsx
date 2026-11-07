"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import Image from "next/image";
import {useParams, useRouter} from "next/navigation";
import {
    LuArrowLeft,
    LuArrowRight,
    LuCircleAlert,
    LuLoaderCircle,
    LuPackage,
    LuReceiptText,
    LuWallet,
} from "react-icons/lu";
import Navbar from "@/components/Navbar";
import {useAuth} from "@/components/AuthProvider";
import {
    ORDER_PROGRESS,
    ORDER_STATUS_LABEL,
    ORDER_STATUS_SUB,
    formatOrderDate,
    historyAt,
    ordersApi,
    progressIndex,
    readBanking,
    type BankingDetails,
    type Order,
} from "@/lib/orders";

const formatPrice = (n: number) => `R${n.toLocaleString("en-ZA")}`;

export default function OrderDetailPage() {
    const params = useParams<{id: string}>();
    const router = useRouter();
    const {user, loading: authLoading} = useAuth();

    const [order, setOrder] = useState<Order | null>(null);
    const [banking, setBanking] = useState<BankingDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const id = typeof params?.id === "string" ? params.id : "";

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            router.replace(`/signin?next=${encodeURIComponent(`/store/orders/${id}`)}`);
            return;
        }
        let cancelled = false;
        (async () => {
            try {
                const receipt = await ordersApi.get(id);
                if (!cancelled) {
                    setOrder(receipt.order);
                    setError(null);
                    const saved = receipt.banking ?? readBanking(receipt.order._id);
                    if (saved) setBanking(saved);
                }
            } catch (loadError) {
                if (!cancelled) {
                    setError(loadError instanceof Error ? loadError.message : "We couldn't load that order.");
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [authLoading, id, router, user]);

    if (loading) {
        return (
            <>
                <Navbar />
                <section className="flex flex-1 items-center justify-center bg-white px-4 py-24">
                    <div className="flex items-center gap-3 text-slate-gray" role="status">
                        <LuLoaderCircle className="animate-spin text-2xl" />
                        <span className="text-sm">Fetching your order…</span>
                    </div>
                </section>
            </>
        );
    }

    if (!order) {
        return (
            <>
                <Navbar />
                <section className="flex-1 bg-white px-4 py-16">
                    <div className="mx-auto max-w-xl rounded-2xl bg-alice-blue/40 px-6 py-14 text-center shadow-sm">
                        <LuCircleAlert className="mx-auto mb-3 text-3xl text-slate-gray" />
                        <p className="text-sm font-semibold text-navy">{error || "Order not found."}</p>
                        <Link
                            href="/store/orders"
                            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg bg-navy px-5 text-sm font-semibold text-white transition-colors hover:bg-navy-soft"
                        >
                            <LuReceiptText /> All my orders
                        </Link>
                    </div>
                </section>
            </>
        );
    }

    const cancelled = order.status === "cancelled";
    const step = progressIndex(order);
    const waitingPayment = order.status === "received";
    const totalItems = order.items.reduce((sum, item) => sum + item.qty, 0);

    return (
        <>
            <Navbar />
            <section className="flex-1 bg-white px-4 py-10 md:py-14">
                <div className="mx-auto max-w-4xl">
                    <Link
                        href="/store/orders"
                        className="mb-6 inline-flex min-h-11 items-center gap-1.5 text-sm text-slate-gray transition-colors hover:text-navy"
                    >
                        <LuArrowLeft /> All my orders
                    </Link>

                    <div className="flex flex-wrap items-end justify-between gap-3">
                        <div>
                            <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-cyan">Order receipt</p>
                            <h1 className="text-3xl font-black tracking-tight text-navy md:text-4xl">{order.orderNumber}</h1>
                            <p className="mt-1 text-sm text-slate-gray">
                                {formatOrderDate(order.createdAt) || "Just placed"} · {totalItems} item{totalItems === 1 ? "" : "s"}
                            </p>
                        </div>
                        <Link
                            href="/store"
                            className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-slate-gray transition-colors hover:text-navy"
                        >
                            Keep shopping <LuArrowRight />
                        </Link>
                    </div>

                    {waitingPayment ? (
                        <div className="mt-6 flex items-start gap-3 rounded-2xl bg-cyan/10 px-4 py-3 text-sm text-navy">
                            <LuWallet className="mt-0.5 shrink-0 text-cyan-dark" />
                            <p>
                                Order placed. Use <strong>{order.orderNumber}</strong> as your EFT reference — payment starts processing your order.
                            </p>
                        </div>
                    ) : null}

                    <div className="mt-6 grid gap-5">
                        {/* Status */}
                        <div className="rounded-2xl bg-white p-5 shadow-[0_6px_22px_rgba(11,25,44,0.10)] md:p-6">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <span className={`grid size-12 place-items-center rounded-xl ${
                                        cancelled ? "bg-red-50 text-red-600" : step >= 3 ? "bg-emerald-50 text-emerald-700" : "bg-alice-blue text-navy"
                                    }`}>
                                        {cancelled ? <LuCircleAlert className="text-xl" /> : step >= 3 ? <LuPackage className="text-xl" /> : <LuPackage className="text-xl" />}
                                    </span>
                                    <div>
                                        <p className="text-base font-bold text-navy">{ORDER_STATUS_LABEL[order.status]}</p>
                                        <p className="text-xs text-slate-gray">{ORDER_STATUS_SUB[order.status]}</p>
                                    </div>
                                </div>
                                <span className="rounded-full bg-alice-blue px-3 py-1.5 text-xs font-semibold text-slate-gray">
                                    {order.eta ? `Est. delivery ${formatOrderDate(order.eta)}` : "Delivery date to be confirmed"}
                                </span>
                            </div>

                            {!cancelled ? (
                                <ol className="mt-6 grid gap-0">
                                    {ORDER_PROGRESS.map((status, index) => {
                                        const done = index < step;
                                        const current = index === step;
                                        const at = historyAt(order, status);
                                        return (
                                            <li key={status} className="relative flex gap-3 pb-5 last:pb-0">
                                                {index < ORDER_PROGRESS.length - 1 ? (
                                                    <span className={`absolute left-[11px] top-6 h-full w-0.5 ${done ? "bg-cyan" : "bg-line"}`} />
                                                ) : null}
                                                <span className={`relative z-10 grid size-6 shrink-0 place-items-center rounded-full text-[10px] font-bold ${
                                                    done
                                                        ? "bg-cyan text-white"
                                                        : current
                                                          ? "bg-cyan/15 text-cyan-dark"
                                                          : "bg-alice-blue text-slate-gray"
                                                }`}>
                                                    {done ? "✓" : index + 1}
                                                </span>
                                                <div className="min-w-0">
                                                    <p className={`text-sm font-semibold ${done || current ? "text-navy" : "text-slate-gray"}`}>
                                                        {ORDER_STATUS_LABEL[status]}
                                                    </p>
                                                    <p className="text-xs text-slate-gray">{ORDER_STATUS_SUB[status]}</p>
                                                    {at ? <p className="mt-0.5 text-[11px] text-slate-gray">{formatOrderDate(at)}</p> : null}
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ol>
                            ) : order.statusHistory.length > 0 ? (
                                <ul className="mt-5 space-y-2">
                                    {[...order.statusHistory].reverse().map((entry, index) => (
                                        <li key={`${entry.status}-${index}`} className="flex flex-wrap justify-between gap-2 text-sm">
                                            <span className="font-semibold text-navy">{ORDER_STATUS_LABEL[entry.status] ?? entry.status}</span>
                                            <span className="text-xs text-slate-gray">
                                                {formatOrderDate(entry.at)}
                                                {entry.note ? ` · ${entry.note}` : ""}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : null}
                        </div>

                        {/* Receipt */}
                        <div className="rounded-2xl bg-white p-5 shadow-[0_6px_22px_rgba(11,25,44,0.10)] md:p-6">
                            <div className="mb-4 flex items-center justify-between gap-3">
                                <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-gray">Receipt</h2>
                                <span className="rounded-full bg-alice-blue px-3 py-1 text-xs font-semibold text-navy">{order.orderNumber}</span>
                            </div>

                            <div className="space-y-3">
                                {order.items.map((item, index) => (
                                    <div key={`${item.itemId}-${index}`} className="flex items-center gap-3">
                                        <div className="size-14 shrink-0 overflow-hidden rounded-lg bg-alice-blue">
                                            {item.image ? (
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    width={112}
                                                    height={112}
                                                    className="size-full object-cover"
                                                />
                                            ) : null}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold text-navy">{item.name}</p>
                                            <p className="text-xs text-slate-gray">
                                                {item.size ? `Size ${item.size} · ` : ""}
                                                {item.qty} × {formatPrice(item.price)}
                                            </p>
                                        </div>
                                        <span className="text-sm font-bold text-navy">{formatPrice(item.price * item.qty)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="my-4 h-px bg-line" />
                            <div className="flex items-baseline justify-between">
                                <span className="text-sm font-bold text-navy">Total</span>
                                <span className="text-2xl font-black tracking-tight text-navy">{formatPrice(order.total)}</span>
                            </div>

                            <div className="mt-4 rounded-xl bg-alice-blue/60 px-4 py-3 text-xs leading-relaxed text-slate-gray">
                                <p className="font-semibold text-navy">
                                    {order.customerName}
                                    {order.phone ? ` · ${order.phone}` : ""}
                                </p>
                                {order.email ? <p>{order.email}</p> : null}
                                {order.note ? <p className="mt-1 italic">“{order.note}”</p> : null}
                            </div>
                        </div>

                        {/* Banking */}
                        {banking ? (
                            <div className="rounded-2xl bg-white p-5 shadow-[0_6px_22px_rgba(11,25,44,0.10)] md:p-6">
                                <div className="mb-4 flex items-center gap-2">
                                    <LuWallet className="text-navy" />
                                    <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-gray">
                                        {waitingPayment ? "Pay this to start your order" : "Banking details"}
                                    </h2>
                                </div>
                                <dl className="grid gap-2 text-sm sm:grid-cols-2">
                                    {[
                                        ["Bank", banking.bankName],
                                        ["Account holder", banking.accountHolder],
                                        ["Account number", banking.accountNumber],
                                        ["Branch code", banking.branchCode],
                                        ["Account type", banking.accountType],
                                    ]
                                        .filter(([, value]) => Boolean(value))
                                        .map(([label, value]) => (
                                            <div key={label} className="flex justify-between gap-3 border-b border-line/70 py-1.5 sm:border-0 sm:py-0">
                                                <dt className="text-slate-gray">{label}</dt>
                                                <dd className="font-semibold text-navy">{value}</dd>
                                            </div>
                                        ))}
                                </dl>
                                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-alice-blue/60 px-4 py-3">
                                    <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-gray">Reference</span>
                                    <span className="text-sm font-black text-navy">{order.orderNumber}</span>
                                </div>
                                {banking.instructions ? (
                                    <p className="mt-3 text-xs leading-relaxed text-slate-gray">{banking.instructions}</p>
                                ) : null}
                            </div>
                        ) : null}
                    </div>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Link
                            href="/store/orders"
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-alice-blue px-5 py-3 text-sm font-bold text-navy transition-colors hover:bg-blue-soft hover:text-blue"
                        >
                            <LuReceiptText /> All my orders
                        </Link>
                        <Link
                            href="/store"
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-navy px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-navy-soft"
                        >
                            Keep shopping <LuArrowRight />
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
