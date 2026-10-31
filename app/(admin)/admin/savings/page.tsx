"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminHeader, Badge, Button, Card } from "@/components/admin/ui";
import { LuCheck, LuLoaderCircle, LuPlus, LuX } from "react-icons/lu";

type Target = { age: number; weekly: number; annual: number; cumulative: number } | null;

type Account = {
    userId: string;
    name: string;
    email: string;
    age: number | null;
    target: Target;
    vault: number;
    wallet: number;
    pending: number;
    lifetime: number;
    withdrawn: number;
    updatedAt: string | null;
};

type Withdrawal = {
    id: string;
    userId: string;
    name: string;
    email: string;
    amount: number;
    note: string;
    createdAt: string | null;
};

const zar = (value: number) =>
    `R${value.toLocaleString("en-ZA", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

export default function AdminSavingsPage() {
    return (
        <section
            className="flex-1 px-4 py-10 md:py-14"
            style={{ background: "linear-gradient(115deg, #f5f8fb 0%, #eff5f9 60%, #f5f8fb 100%)" }}
        >
            <div className="max-w-6xl mx-auto">
                <SavingsAdminBody />
            </div>
        </section>
    );
}

function SavingsAdminBody() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
    const [queue, setQueue] = useState({ count: 0, amount: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [busy, setBusy] = useState<string | null>(null);
    const [creditFor, setCreditFor] = useState<string | null>(null);
    const [creditAmount, setCreditAmount] = useState("");
    const [creditNote, setCreditNote] = useState("");

    const load = useCallback(async () => {
        try {
            const res = await fetch("/api/admin/smart-saver");
            const json = await res.json();
            if (!res.ok) throw new Error(json?.error || "Failed to load savings");
            setAccounts(json.data.accounts ?? []);
            setWithdrawals(json.data.pendingWithdrawals ?? []);
            setQueue(json.data.pendingQueue ?? { count: 0, amount: 0 });
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
                const res = await fetch("/api/admin/smart-saver");
                const json = await res.json();
                if (!res.ok) throw new Error(json?.error || "Failed to load savings");
                if (cancelled) return;
                setAccounts(json.data.accounts ?? []);
                setWithdrawals(json.data.pendingWithdrawals ?? []);
                setQueue(json.data.pendingQueue ?? { count: 0, amount: 0 });
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

    async function post(body: Record<string, unknown>, busyKey: string) {
        setBusy(busyKey);
        setError("");
        try {
            const res = await fetch("/api/admin/smart-saver", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json?.error || "Failed to save");
            await load();
            return true;
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to save");
            return false;
        } finally {
            setBusy(null);
        }
    }

    async function credit(userId: string) {
        const ok = await post(
            { action: "credit", userId, amount: Number(creditAmount), note: creditNote },
            `credit:${userId}`,
        );
        if (ok) {
            setCreditFor(null);
            setCreditAmount("");
            setCreditNote("");
        }
    }

    return (
        <>
            <AdminHeader
                eyebrow="Commerce & Tools"
                title="Smart Saver"
                sub="Credit savings (60/40 split), settle the Saturday queue and approve withdrawals."
                actions={
                    <Button
                        variant="accent"
                        onClick={() => post({ action: "settle" }, "settle")}
                        disabled={busy === "settle" || queue.count === 0}
                    >
                        {busy === "settle" ? (
                            <LuLoaderCircle className="size-4 animate-spin" />
                        ) : (
                            `Settle ${queue.count} pending`
                        )}
                    </Button>
                }
            />

            {error ? (
                <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                    {error}
                </p>
            ) : null}

            <div className="mb-4 grid gap-3 sm:grid-cols-2">
                <Card>
                    <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-cyan">Pending queue</p>
                    <p className="mt-1 text-2xl font-black text-navy">{zar(queue.amount)}</p>
                    <p className="text-xs text-slate-gray">
                        {queue.count} credit{queue.count === 1 ? "" : "s"} awaiting Saturday settlement
                    </p>
                </Card>
                <Card>
                    <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-cyan">Withdrawal requests</p>
                    <p className="mt-1 text-2xl font-black text-navy">{withdrawals.length}</p>
                    <p className="text-xs text-slate-gray">Waiting for your review</p>
                </Card>
            </div>

            {withdrawals.length > 0 ? (
                <Card className="mb-4">
                    <h2 className="mb-3 text-sm font-bold text-navy">Withdrawals to review</h2>
                    <ul className="divide-y divide-gray-100">
                        {withdrawals.map((w) => (
                            <li key={w.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-navy">
                                        {w.name} · {zar(w.amount)}
                                    </p>
                                    <p className="text-xs text-slate-gray">
                                        {w.email}
                                        {w.note ? ` — ${w.note}` : ""}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="accent"
                                        onClick={() => post({ action: "withdrawal", id: w.id, status: "paid" }, `w:${w.id}`)}
                                        disabled={busy === `w:${w.id}`}
                                        className="!min-h-9 !px-3 !py-1.5 text-xs"
                                    >
                                        <LuCheck className="size-3.5" /> Pay
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        onClick={() => post({ action: "withdrawal", id: w.id, status: "rejected" }, `w:${w.id}`)}
                                        disabled={busy === `w:${w.id}`}
                                        className="!min-h-9 !px-3 !py-1.5 text-xs"
                                    >
                                        <LuX className="size-3.5" /> Decline
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </Card>
            ) : null}

            {loading ? (
                <p className="flex items-center gap-2 text-sm text-slate-gray">
                    <LuLoaderCircle className="size-4 animate-spin" /> Loading accounts…
                </p>
            ) : accounts.length === 0 ? (
                <Card>
                    <p className="text-sm text-slate-gray">No savings accounts yet. Credit a member to start one.</p>
                </Card>
            ) : (
                <div className="space-y-3">
                    {accounts.map((a) => (
                        <Card key={a.userId}>
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="truncate font-bold text-navy">{a.name}</p>
                                    <p className="truncate text-xs text-slate-gray">{a.email}</p>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                    <Badge tone="sky">Vault {zar(a.vault)}</Badge>
                                    <Badge tone="slate">Wallet {zar(a.wallet)}</Badge>
                                    {a.pending > 0 ? <Badge tone="amber">Pending {zar(a.pending)}</Badge> : null}
                                    <Button
                                        variant="ghost"
                                        onClick={() => {
                                            setCreditFor(creditFor === a.userId ? null : a.userId);
                                            setCreditAmount("");
                                            setCreditNote("");
                                        }}
                                        className="!min-h-9 !px-3 !py-1.5 text-xs"
                                    >
                                        <LuPlus className="size-3.5" /> Credit
                                    </Button>
                                </div>
                            </div>

                            <p className="mt-2 text-xs text-slate-gray">
                                Lifetime {zar(a.lifetime)} · withdrawn {zar(a.withdrawn)}
                                {a.target
                                    ? ` · age ${a.target.age} target ${zar(a.target.weekly)}/week (${zar(a.target.cumulative)} cumulative)`
                                    : ""}
                            </p>

                            {creditFor === a.userId ? (
                                <div className="mt-3 grid gap-2 border-t border-gray-100 pt-3 sm:grid-cols-[140px_1fr_auto]">
                                    <input
                                        value={creditAmount}
                                        onChange={(e) => setCreditAmount(e.target.value)}
                                        inputMode="decimal"
                                        placeholder="Amount (R)"
                                        className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-cyan"
                                    />
                                    <input
                                        value={creditNote}
                                        onChange={(e) => setCreditNote(e.target.value)}
                                        placeholder="Note (e.g. weekly savings)"
                                        className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-cyan"
                                    />
                                    <Button
                                        onClick={() => credit(a.userId)}
                                        disabled={busy === `credit:${a.userId}` || !creditAmount}
                                        className="!min-h-10 !px-4 !py-2 text-xs"
                                    >
                                        {busy === `credit:${a.userId}` ? (
                                            <LuLoaderCircle className="size-3.5 animate-spin" />
                                        ) : (
                                            "Add credit"
                                        )}
                                    </Button>
                                </div>
                            ) : null}
                        </Card>
                    ))}
                </div>
            )}
        </>
    );
}
