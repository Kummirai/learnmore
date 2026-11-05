import {
    LuArrowUpRight,
    LuBriefcase,
    LuCalendarDays,
    LuLock,
    LuShieldCheck,
    LuSmartphone,
    LuSplit,
    LuWallet,
} from "react-icons/lu";

const SMART_SAVER_URL = "uidesignsrelate://home";

const STEPS = [
    {
        icon: LuBriefcase,
        title: "Earn in Relate",
        body: "Complete paid projects and club work in Relate World.",
    },
    {
        icon: LuSplit,
        title: "Split 60 / 40",
        body: "Every payout is divided between your locked vault and spendable wallet.",
    },
    {
        icon: LuSmartphone,
        title: "Track in Smart Saver",
        body: "Balances, statements and withdrawals live in the separate Smart Saver app.",
    },
];

export default function SavingsPage() {
    return (
        <section
            className="flex-1 px-4 py-10 md:py-14"
            style={{ background: "linear-gradient(115deg, #f5f8fb 0%, #eff5f9 60%, #f5f8fb 100%)" }}
        >
            <div className="mx-auto max-w-3xl">
                <div className="mb-6">
                    <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.2em] text-cyan">
                        Smart Saver
                    </p>
                    <h1 className="text-2xl font-black leading-none tracking-tight text-navy md:text-3xl">
                        Your money has a new home
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm text-slate-gray">
                        Relate World is for learning and earning. Balances, statements and
                        withdrawals now live in the separate Smart Saver app.
                    </p>
                </div>

                <div className="relative overflow-hidden rounded-3xl bg-navy p-6 text-white shadow-sm md:p-8">
                    <div
                        className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full"
                        style={{ background: "radial-gradient(circle, rgba(255,255,255,0.1), transparent 65%)" }}
                    />
                    <div className="relative">
                        <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-cyan/10">
                            <LuShieldCheck className="size-6 text-cyan" />
                        </span>
                        <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan">
                            Balances app
                        </p>
                        <h2 className="mt-2 text-2xl font-black tracking-tight md:text-3xl">
                            Open Smart Saver to see your balance
                        </h2>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-white/65">
                            Your vault, wallet and transaction history are managed inside the
                            Smart Saver app. Relate will never ask for your Smart Saver password.
                        </p>
                        <a
                            href={SMART_SAVER_URL}
                            className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-cyan px-5 py-3 text-sm font-bold text-navy transition hover:brightness-105"
                        >
                            Open Smart Saver
                            <LuArrowUpRight className="size-4" />
                        </a>
                        <p className="mt-3 text-xs text-white/45">
                            If the app doesn&apos;t open, install Smart Saver on your device first.
                        </p>
                    </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                        <span className="inline-flex size-9 items-center justify-center rounded-xl bg-amber-100">
                            <LuLock className="size-4 text-amber-700" />
                        </span>
                        <p className="mt-3 text-2xl font-black text-navy">60%</p>
                        <p className="text-sm font-bold text-navy">Vault</p>
                        <p className="text-xs text-slate-gray">Locked for university</p>
                    </div>
                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                        <span className="inline-flex size-9 items-center justify-center rounded-xl bg-emerald-100">
                            <LuWallet className="size-4 text-emerald-700" />
                        </span>
                        <p className="mt-3 text-2xl font-black text-navy">40%</p>
                        <p className="text-sm font-bold text-navy">Wallet</p>
                        <p className="text-xs text-slate-gray">Yours to spend</p>
                    </div>
                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                        <span className="inline-flex size-9 items-center justify-center rounded-xl bg-ice-blue">
                            <LuCalendarDays className="size-4 text-cyan" />
                        </span>
                        <p className="mt-3 text-2xl font-black text-navy">Saturday</p>
                        <p className="text-sm font-bold text-navy">Settlement</p>
                        <p className="text-xs text-slate-gray">Weekly earnings clear</p>
                    </div>
                </div>

                <div className="mt-6">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan">
                        How it fits together
                    </p>
                    <h2 className="mt-1 text-xl font-black text-navy">Learn here. Bank there.</h2>
                    <div className="mt-3 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                        {STEPS.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <div
                                    key={step.title}
                                    className={`flex items-center gap-4 p-4 ${
                                        index < STEPS.length - 1 ? "border-b border-gray-100" : ""
                                    }`}
                                >
                                    <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-ice-blue">
                                        <Icon className="size-5 text-navy" />
                                    </span>
                                    <div>
                                        <p className="text-sm font-bold text-navy">{step.title}</p>
                                        <p className="text-xs leading-5 text-slate-gray">{step.body}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-4 rounded-2xl border border-cyan/30 bg-ice-blue p-5">
                    <h2 className="text-sm font-bold text-navy">Keep learning in Relate</h2>
                    <p className="mt-1 text-sm leading-6 text-slate-gray">
                        The Smart Saver skill, weekly targets and your progress stay in Relate
                        World. Only the money itself moved to the Smart Saver app.
                    </p>
                </div>
            </div>
        </section>
    );
}
