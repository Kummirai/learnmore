"use client";

import { useCallback, useEffect, useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import { LuArrowDownToLine, LuLandmark, LuLoaderCircle, LuWallet } from "react-icons/lu";

type Target = { age: number; weekly: number; annual: number; cumulative: number } | null;

type Account = {
    vault: number;
    wallet: number;
    pending: number;
    lifetime: number;
    withdrawn: number;
    age: number | null;
    target: Target;
};

type Entry = {
    id: string;
    kind: "contribution" | "withdrawal";
    status: "pending" | "settled" | "paid" | "rejected";
    amount: number;
    vault: number;
    wallet: number;
    note: string;
    createdAt: string | null;
    settledAt: string | null;
};

const zar = (value: number) =>
    `R${value.toLocaleString("en-ZA", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

const STATUS_TONE: Record<Entry["status"], string> = {
    pending: "bg-orange-100 text-orange-800",
    settled: "bg-emerald-100 text-emerald-800",
    paid: "bg-ice-blue text-navy",
    rejected: "bg-red-100 text-red-700",
};

export default function SavingsPage() {
    return (
        <RequireAuth title="My Savings" next="/savings">
            <section
                className="flex-1 px-4 py-10 md:py-14"
                style={{ background: "linear-gradient(115deg, #f5f8fb 0%, #eff5f9 60%, #f5f8fb 100%)" }}
            >
                <div className="mx-auto max-w-3xl">
                    <SavingsBody />
                </div>
            </section>
        </RequireAuth>
    );
}

function SavingsBody() {
    const [account, setAccount] = useState<Account | null>(null);
    const [entries, setEntries] = useState<Entry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [amount, setAmount] = useState("");
    const [note, setNote] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [notice, setNotice] = useState("");

    const load = useCallback(async () => {
        try {
            const res = await fetch("/api/smart-saver");
            const json = await res.json();
            if (!res.ok) throw new Error(json?.error || "Failed to load savings");
            setAccount(json.data.account);
            setEntries(json.data.entries ?? []);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to load savings");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch("/api/smart-saver");
                const json = await res.json();
                if (!res.ok) throw new Error(json?.error || "Failed to load savings");
                if (cancelled) return;
                setAccount(json.data.account);
                setEntries(json.data.entries ?? []);
            } catch (e) {
                if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load savings");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    async function requestWithdrawal(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setNotice("");
        setSubmitting(true);
        try {
            const res = await fetch("/api/smart-saver", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: Number(amount), note }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json?.error || "Failed to request withdrawal");
            setAmount("");
            setNote("");
            setNotice("Withdrawal requested — an instructor will review it.");
            await load();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to request withdrawal");
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return (
            <p className="flex items-center gap-2 text-sm text-slate-gray">
                <LuLoaderCircle className="size-4 animate-spin" /> Loading your Smart Saver…
            </p>
        );
    }

    return (
        <>
            <div className="mb-6">
                <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.2em] text-cyan">Smart Saver</p>
                <h1 className="text-2xl font-black leading-none tracking-tight text-navy md:text-3xl">
                    Your savings
                </h1>
                <p className="mt-1 text-sm text-slate-gray">
                    Every rand is split 60/40 — 60% locked for university, 40% yours to spend.
                </p>
            </div>

            {error ? (
                <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                    {error}
                </p>
            ) : null}
            {notice ? (
                <p className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                    {notice}
                </p>
            ) : null}

            <div className="mb-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-gray-100 bg-navy p-5 text-white shadow-sm">
                    <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-cyan">
                        <LuLandmark className="size-3.5" /> Freedom Fund
                    </p>
                    <p className="mt-2 text-2xl font-black">{zar(account?.vault ?? 0)}</p>
                    <p className="mt-1 text-xs text-white/60">Locked until university</p>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-cyan">
                        <LuWallet className="size-3.5" /> Wallet
                    </p>
                    <p className="mt-2 text-2xl font-black text-navy">{zar(account?.wallet ?? 0)}</p>
                    <p className="mt-1 text-xs text-slate-gray">Available to withdraw</p>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-cyan">Pending</p>
                    <p className="mt-2 text-2xl font-black text-navy">{zar(account?.pending ?? 0)}</p>
                    <p className="mt-1 text-xs text-slate-gray">Settles on Saturday</p>
                </div>
            </div>

            {account?.target ? (
                <div className="mb-4 rounded-2xl border border-cyan/30 bg-ice-blue p-5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-cyan">
                        Your age {account.target.age} target
                    </p>
                    <p className="mt-1 text-lg font-black text-navy">
                        {zar(account.target.weekly)} every week · {zar(account.target.annual)} this year
                    </p>
                    <p className="mt-1 text-sm text-slate-gray">
                        Reach {zar(account.target.cumulative)} in your Freedom Fund by the end of age{" "}
                        {account.target.age}.
                    </p>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                        <div
                            className="h-full rounded-full bg-cyan"
                            style={{
                                width: `${Math.min(
                                    100,
                                    Math.round(
                                        ((account.lifetime || 0) / Math.max(1, account.target.cumulative)) * 100,
                                    ),
                                )}%`,
                            }}
                        />
                    </div>
                    <p className="mt-1 text-xs text-slate-gray">
                        {zar(account.lifetime)} saved of {zar(account.target.cumulative)}
                    </p>
                </div>
            ) : null}

            <div className="mb-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-navy">
                    <LuArrowDownToLine className="size-4 text-cyan" /> Request a withdrawal
                </h2>
                <form onSubmit={requestWithdrawal} className="grid gap-3 sm:grid-cols-[140px_1fr_auto]">
                    <input
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        inputMode="decimal"
                        placeholder="Amount (R)"
                        className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-cyan"
                    />
                    <input
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="What is it for?"
                        className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-cyan"
                    />
                    <button
                        type="submit"
                        disabled={submitting || !amount}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-soft disabled:opacity-50"
                    >
                        {submitting ? <LuLoaderCircle className="size-4 animate-spin" /> : "Request"}
                    </button>
                </form>
                <p className="mt-2 text-xs text-slate-gray">
                    Only your spendable wallet can be withdrawn. The Freedom Fund stays locked.
                </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
                <h2 className="border-b border-gray-100 px-5 py-4 text-sm font-bold text-navy">Ledger</h2>
                {entries.length === 0 ? (
                    <p className="px-5 py-6 text-sm text-slate-gray">
                        Nothing yet — your first credit from an instructor will appear here.
                    </p>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {entries.map((entry) => (
                            <li key={entry.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold capitalize text-navy">
                                        {entry.kind === "contribution" ? "Savings credit" : "Withdrawal"}
                                        {entry.note ? <span className="font-normal text-slate-gray"> — {entry.note}</span> : null}
                                    </p>
                                    <p className="text-xs text-slate-gray">
                                        {entry.createdAt ? new Date(entry.createdAt).toLocaleDateString("en-ZA") : ""}
                                        {entry.kind === "contribution" && entry.vault
                                            ? ` · ${zar(entry.vault)} vault / ${zar(entry.wallet)} wallet`
                                            : ""}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span
                                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_TONE[entry.status]}`}
                                    >
                                        {entry.status}
                                    </span>
                                    <span className="text-sm font-black text-navy">
                                        {entry.kind === "withdrawal" ? "−" : "+"}
                                        {zar(entry.amount)}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
}
