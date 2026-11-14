"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {LuArrowLeft, LuArrowRight, LuCheck, LuLoaderCircle, LuShoppingBag} from "react-icons/lu";
import Navbar from "@/components/Navbar";
import {useAuth} from "@/components/AuthProvider";
import {useCart, useCartHydrated} from "@/lib/cart";
import {ordersApi, rememberBanking} from "@/lib/orders";

const formatPrice = (n: number) => `R${n.toLocaleString("en-ZA")}`;

type FieldErrors = {name?: string; phone?: string; email?: string};

export default function CheckoutPage() {
    const router = useRouter();
    const {user, loading: authLoading} = useAuth();
    const {lines, subtotal, count, clear} = useCart();
    const hydrated = useCartHydrated();

    const [errors, setErrors] = useState<FieldErrors>({});
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            router.replace(`/signin?next=${encodeURIComponent("/store/checkout")}`);
        }
    }, [authLoading, router, user]);

    const validate = (values: {name: string; phone: string; email: string}) => {
        const next: FieldErrors = {};
        if (!values.name) next.name = "Your name is required.";
        if (!values.phone) next.phone = "A contact number is required.";
        else if (values.phone.replace(/\D/g, "").length < 7) next.phone = "That number looks too short.";
        if (values.email && !/^\S+@\S+\.\S+$/.test(values.email)) next.email = "Check the email address.";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const submit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (submitting || lines.length === 0) return;

        const form = new FormData(event.currentTarget);
        const name = String(form.get("name") ?? "").trim();
        const phone = String(form.get("phone") ?? "").trim();
        const email = String(form.get("email") ?? "").trim();
        const note = String(form.get("note") ?? "").trim();

        if (!validate({name, phone, email})) return;

        setSubmitting(true);
        setSubmitError(null);
        try {
            const placed = await ordersApi.place(lines, {
                name,
                phone,
                email: email || undefined,
                note: note || undefined,
            });
            rememberBanking(placed.order._id, placed.banking);
            clear();
            router.push(`/store/orders/${placed.order._id}?new=1`);
        } catch (error) {
            const message = error instanceof Error ? error.message : "We couldn't place your order.";
            if (message.toLowerCase().includes("sign in")) {
                router.replace(`/signin?next=${encodeURIComponent("/store/checkout")}`);
                return;
            }
            setSubmitError(message);
        } finally {
            setSubmitting(false);
        }
    };

    const loading = !hydrated || authLoading || !user;

    return (
        <>
            <Navbar />
            <section className="flex-1 bg-white px-4 py-10 md:py-14">
                <div className="mx-auto max-w-5xl">
                    <Link
                        href="/store/cart"
                        className="mb-6 inline-flex min-h-11 items-center gap-1.5 text-sm text-slate-gray transition-colors hover:text-navy"
                    >
                        <LuArrowLeft /> Back to cart
                    </Link>

                    <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-cyan">Relate Store</p>
                    <h1 className="text-3xl font-black tracking-tight text-navy md:text-4xl">Checkout</h1>
                    <p className="mt-2 text-sm text-slate-gray">
                        {loading
                            ? "Loading your order…"
                            : count === 0
                              ? "Your cart is empty."
                              : `${count} item${count === 1 ? "" : "s"} · where should we send it?`}
                    </p>

                    {loading ? (
                        <div className="flex items-center gap-3 py-20 text-slate-gray" role="status">
                            <LuLoaderCircle className="animate-spin text-2xl" />
                            <span className="text-sm">Preparing checkout…</span>
                        </div>
                    ) : lines.length === 0 ? (
                        <div className="mt-8 rounded-3xl bg-alice-blue/40 px-6 py-16 text-center">
                            <span className="mx-auto mb-4 grid size-16 place-items-center rounded-full bg-white text-navy shadow-sm">
                                <LuShoppingBag className="text-2xl" />
                            </span>
                            <h2 className="text-lg font-bold text-navy">Nothing to check out yet</h2>
                            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-gray">
                                Add something from the store and it will appear here.
                            </p>
                            <Link
                                href="/store"
                                className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full btn-signin px-6 py-3 text-sm font-bold text-white transition-colors hover:brightness-95"
                            >
                                Browse the store <LuArrowRight />
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={submit} className="mt-8 grid gap-8 lg:grid-cols-5">
                            <div className="space-y-5 lg:col-span-3">
                                <div className="rounded-2xl bg-white p-4 shadow-[0_6px_22px_rgba(11,25,44,0.10)] md:p-5">
                                    <h2 className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-gray">
                                        Your order
                                    </h2>
                                    <div className="space-y-3">
                                        {lines.map((line) => (
                                            <div key={`${line.itemId}:${line.size ?? ""}`} className="flex items-center gap-3">
                                                <div className="size-14 shrink-0 overflow-hidden rounded-lg bg-alice-blue">
                                                    {line.image ? (
                                                        <Image
                                                            src={line.image}
                                                            alt={line.name}
                                                            width={112}
                                                            height={112}
                                                            className="size-full object-cover"
                                                        />
                                                    ) : null}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-semibold text-navy">{line.name}</p>
                                                    <p className="text-xs text-slate-gray">
                                                        {line.size ? `Size ${line.size} · ` : ""}
                                                        {line.qty} × {formatPrice(line.price)}
                                                    </p>
                                                </div>
                                                <span className="text-sm font-bold text-navy">
                                                    {formatPrice(line.price * line.qty)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="rounded-2xl bg-white p-4 shadow-[0_6px_22px_rgba(11,25,44,0.10)] md:p-5">
                                    <h2 className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-gray">
                                        Contact details
                                    </h2>
                                    <div className="grid gap-4">
                                        <label className="block">
                                            <span className="mb-1.5 block text-xs font-semibold text-navy">Full name</span>
                                            <input
                                                name="name"
                                                defaultValue={user?.name ?? ""}
                                                onChange={() => {
                                                    if (errors.name) setErrors((current) => ({...current, name: undefined}));
                                                }}
                                                autoComplete="name"
                                                placeholder="Your name"
                                                aria-invalid={Boolean(errors.name)}
                                                className={`h-12 w-full rounded-xl px-3.5 text-base text-ink outline-none transition focus:ring-2 md:text-sm ${
                                                    errors.name
                                                        ? "bg-red-50 focus:ring-red-200"
                                                        : "bg-alice-blue focus:bg-white focus:ring-blue/20"
                                                }`}
                                            />
                                            {errors.name ? <span className="mt-1 block text-xs text-red-600">{errors.name}</span> : null}
                                        </label>

                                        <label className="block">
                                            <span className="mb-1.5 block text-xs font-semibold text-navy">Contact number</span>
                                            <input
                                                name="phone"
                                                onChange={() => {
                                                    if (errors.phone) setErrors((current) => ({...current, phone: undefined}));
                                                }}
                                                type="tel"
                                                inputMode="tel"
                                                autoComplete="tel"
                                                placeholder="e.g. 082 123 4567"
                                                aria-invalid={Boolean(errors.phone)}
                                                className={`h-12 w-full rounded-xl px-3.5 text-base text-ink outline-none transition focus:ring-2 md:text-sm ${
                                                    errors.phone
                                                        ? "bg-red-50 focus:ring-red-200"
                                                        : "bg-alice-blue focus:bg-white focus:ring-blue/20"
                                                }`}
                                            />
                                            {errors.phone ? <span className="mt-1 block text-xs text-red-600">{errors.phone}</span> : null}
                                        </label>

                                        <label className="block">
                                            <span className="mb-1.5 block text-xs font-semibold text-navy">
                                                Email <span className="font-normal text-slate-gray">(optional)</span>
                                            </span>
                                            <input
                                                name="email"
                                                defaultValue={user?.email ?? ""}
                                                onChange={() => {
                                                    if (errors.email) setErrors((current) => ({...current, email: undefined}));
                                                }}
                                                type="email"
                                                autoComplete="email"
                                                placeholder="you@example.com"
                                                aria-invalid={Boolean(errors.email)}
                                                className={`h-12 w-full rounded-xl px-3.5 text-base text-ink outline-none transition focus:ring-2 md:text-sm ${
                                                    errors.email
                                                        ? "bg-red-50 focus:ring-red-200"
                                                        : "bg-alice-blue focus:bg-white focus:ring-blue/20"
                                                }`}
                                            />
                                            {errors.email ? <span className="mt-1 block text-xs text-red-600">{errors.email}</span> : null}
                                        </label>

                                        <label className="block">
                                            <span className="mb-1.5 block text-xs font-semibold text-navy">
                                                Notes <span className="font-normal text-slate-gray">(optional)</span>
                                            </span>
                                            <textarea
                                                name="note"
                                                rows={3}
                                                placeholder="Delivery area, club name, preferred collection point…"
                                                className="w-full rounded-xl bg-alice-blue px-3.5 py-3 text-base text-ink outline-none transition focus:bg-white focus:ring-2 focus:ring-blue/20 md:text-sm"
                                            />
                                        </label>
                                    </div>
                                </div>
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
                                        <span className="text-sm font-bold text-navy">Total due</span>
                                        <span className="text-2xl font-black tracking-tight text-navy">{formatPrice(subtotal)}</span>
                                    </div>

                                    {submitError ? (
                                        <p role="alert" className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">
                                            {submitError}
                                        </p>
                                    ) : null}

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl btn-signin px-6 text-sm font-bold text-white transition-colors hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {submitting ? (
                                            <>
                                                <LuLoaderCircle className="animate-spin text-lg" /> Placing order…
                                            </>
                                        ) : (
                                            <>
                                                <LuCheck className="text-lg" /> Place order
                                            </>
                                        )}
                                    </button>
                                    <p className="mt-3 text-center text-xs leading-relaxed text-slate-gray">
                                        Pay by EFT after checkout — your receipt shows the order number and our banking details.
                                    </p>
                                </div>
                            </aside>
                        </form>
                    )}
                </div>
            </section>
        </>
    );
}
