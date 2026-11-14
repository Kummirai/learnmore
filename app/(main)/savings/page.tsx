import {
    LuArrowUpRight,
    LuBriefcase,
    LuCalendarDays,
    LuDownload,
    LuLock,
    LuShieldCheck,
    LuSmartphone,
    LuSplit,
    LuWallet,
    LuWifi,
} from "react-icons/lu";
import { CLUB_SAVINGS_TARGETS } from "@/lib/savings";

const TARGET_TONES = ["#67e3f5", "#13c5dd", "#0fa3c4"] as const;

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

                <div className="relative overflow-hidden rounded-3xl bg-[linear-gradient(120deg,#171a21_0%,#2a2e38_55%,#06070a_100%)] p-5 text-white shadow-lg sm:max-w-md sm:p-6">
                    <span
                        aria-hidden
                        className="pointer-events-none absolute -right-10 -top-16 h-44 w-44 rounded-full bg-white/5"
                    />
                    <div className="relative">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold tracking-[0.2em] text-white/80">
                                SMART SAVER
                            </span>
                            <span className="text-[10px] font-semibold tracking-[0.18em] text-white/45">
                                DEBIT
                            </span>
                        </div>

                        <div className="mt-5 flex items-center gap-3">
                            <span
                                aria-hidden
                                className="relative block h-7 w-10 overflow-hidden rounded-md bg-gradient-to-br from-[#efd27f] to-[#b98f2f]"
                            >
                                <span className="absolute inset-x-1.5 top-1/3 h-px bg-[#5a3c0a]/40" />
                                <span className="absolute inset-y-1.5 left-1/2 w-px bg-[#5a3c0a]/30" />
                            </span>
                            <LuWifi aria-hidden className="size-5 rotate-90 text-white/55" />
                        </div>

                        <p className="mt-5 text-lg font-semibold tracking-[0.18em] text-white/90 sm:text-xl">
                            ••••&nbsp;&nbsp;••••&nbsp;&nbsp;••••&nbsp;&nbsp;6040
                        </p>

                        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
                            <div>
                                <p className="text-[9px] uppercase tracking-[0.16em] text-white/45">
                                    Card holder
                                </p>
                                <p className="mt-0.5 text-xs font-semibold tracking-wide text-white/90">
                                    RELATE MEMBER
                                </p>
                            </div>
                            <div>
                                <p className="text-[9px] uppercase tracking-[0.16em] text-white/45">
                                    Vault / wallet
                                </p>
                                <p className="mt-0.5 text-xs font-semibold tracking-wide text-white/90">
                                    60 / 40
                                </p>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="flex items-center" aria-hidden>
                                    <span className="size-6 rounded-full bg-[#EB001B]" />
                                    <span className="-ml-2.5 size-6 rounded-full bg-[#F79E1B]/90" />
                                </span>
                                <span className="mt-1 text-[11px] font-bold italic tracking-tight text-white/85">
                                    mastercard
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan">
                        Balances have a new home
                    </p>
                    <h2 className="mt-1 text-xl font-black tracking-tight text-navy md:text-2xl">
                        Your money lives in Smart Saver
                    </h2>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-slate-gray">
                        We&apos;ve separated the money app from the learning app. Your vault,
                        wallet, statements and withdrawals are now managed in Smart Saver.
                    </p>
                    <a
                        href="#install-smart-saver"
                        className="mt-4 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl btn-signin px-5 py-3 text-sm font-bold text-white transition hover:brightness-95"
                    >
                        <LuDownload className="size-4" /> Download Smart Saver
                    </a>
                    <p className="mt-2 text-xs text-slate-gray">
                        Smart Saver is a separate phone app — install it first, then sign in
                        with the same email you use for Relate.
                    </p>
                </div>

                <div
                    id="install-smart-saver"
                    className="mt-6 scroll-mt-28 rounded-2xl border border-cyan/25 bg-white p-5 shadow-sm"
                >
                    <div className="flex items-center gap-3">
                        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-ice-blue">
                            <LuSmartphone className="size-5 text-cyan" />
                        </span>
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan">
                                Get the app
                            </p>
                            <h2 className="text-base font-bold text-navy">
                                Download Smart Saver
                            </h2>
                        </div>
                    </div>
                    <ol className="mt-4 space-y-2.5 text-sm leading-6 text-slate-gray">
                        <li className="flex gap-3">
                            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-navy text-[11px] font-bold text-white">
                                1
                            </span>
                            <span>
                                Open the App Store on iPhone or Google Play on Android.
                            </span>
                        </li>
                        <li className="flex gap-3">
                            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-navy text-[11px] font-bold text-white">
                                2
                            </span>
                            <span>
                                Search for <strong className="text-navy">Smart Saver</strong>{" "}
                                and install it.
                            </span>
                        </li>
                        <li className="flex gap-3">
                            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-navy text-[11px] font-bold text-white">
                                3
                            </span>
                            <span>
                                Open Smart Saver and sign in with your Relate email — your
                                balance is waiting there.
                            </span>
                        </li>
                    </ol>
                    <p className="mt-4 flex items-start gap-2 rounded-xl bg-alice-blue/70 px-3.5 py-2.5 text-xs text-slate-gray">
                        <LuShieldCheck className="mt-0.5 size-3.5 shrink-0 text-cyan" />
                        Relate will never ask for your Smart Saver password. Already have
                        the app? Open it on your phone, not in the browser.
                    </p>
                </div>

                <div className="mt-8">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan">
                        Savings targets
                    </p>
                    <h2 className="mt-1 text-xl font-black tracking-tight text-navy">
                        What each club aims for
                    </h2>
                    <div className="mt-3 grid gap-2.5">
                        {CLUB_SAVINGS_TARGETS.map((target, index) => {
                            const tone = TARGET_TONES[index % TARGET_TONES.length];
                            return (
                                <div
                                    key={target.slug}
                                    className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white p-3.5 shadow-sm"
                                    style={{ borderLeft: `3px solid ${tone}` }}
                                >
                                    <div className="flex min-w-0 items-center gap-3">
                                        <span
                                            className="flex w-16 shrink-0 flex-col items-center rounded-xl px-2 py-1.5"
                                            style={{ backgroundColor: `${tone}1f` }}
                                        >
                                            <span
                                                className="text-sm font-black leading-none"
                                                style={{ color: tone }}
                                            >
                                                {target.ageRange.split(" yrs")[0]}
                                            </span>
                                            <span
                                                className="mt-0.5 text-[9px] font-bold tracking-widest"
                                                style={{ color: tone }}
                                            >
                                                YRS
                                            </span>
                                        </span>
                                        <p className="truncate text-sm font-bold text-navy">
                                            {target.name}
                                        </p>
                                    </div>
                                    <div className="shrink-0 text-right">
                                        <p className="text-base font-black text-navy">
                                            R{target.annual.toLocaleString("en-ZA")}
                                        </p>
                                        <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-gray">
                                            per year
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
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
                    <a
                        href="#install-smart-saver"
                        className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-navy underline decoration-cyan decoration-2 underline-offset-4 hover:text-cyan-dark"
                    >
                        Download Smart Saver
                        <LuArrowUpRight className="size-3.5" />
                    </a>
                </div>
            </div>
        </section>
    );
}
