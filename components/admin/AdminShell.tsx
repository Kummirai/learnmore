"use client";

import {useCallback, useEffect, useState} from "react";
import Link from "next/link";
import Image from "next/image";
import {usePathname} from "next/navigation";
import {LuChevronLeft, LuLoaderCircle, LuShieldAlert, LuX} from "react-icons/lu";
import {useAuth} from "@/components/AuthProvider";
import {ADMIN_NAV, isAdminRole, type AdminNavCounts} from "@/components/admin/nav";

/**
 * Dashboard shell: role-gated, with a persistent sidebar on desktop and a
 * slide-over drawer on mobile. Owns the queue badge counts so every page
 * shares one polling loop.
 */
export default function AdminShell({children}: {children: React.ReactNode}) {
    const {user, loading} = useAuth();
    const pathname = usePathname() ?? "/admin";
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [counts, setCounts] = useState<AdminNavCounts>({});

    // Pending-queue badges. Each endpoint already exists; a failure here must
    // never block the dashboard, so counts simply stay absent.
    const loadCounts = useCallback(async (signal?: AbortSignal) => {
        const endpoints: [string, string][] = [
            ["/admin/volunteers", "/api/admin/volunteers?status=new&countOnly=1"],
            ["/admin/help-requests", "/api/help-requests?status=open&countOnly=1"],
            ["/admin/social-joins", "/api/community/social-join?status=pending&countOnly=1"],
            ["/admin/orders", "/api/admin/orders?status=received&countOnly=1"],
        ];
        const results = await Promise.all(
            endpoints.map(async ([href, url]) => {
                try {
                    const res = await fetch(url, {signal, cache: "no-store"});
                    if (!res.ok) return [href, 0] as const;
                    const json = await res.json().catch(() => null);
                    const data = json?.data;
                    if (typeof json?.count === "number") return [href, json.count] as const;
                    return [href, Array.isArray(data) ? data.length : 0] as const;
                } catch {
                    return [href, 0] as const;
                }
            }),
        );
        const next: AdminNavCounts = {};
        for (const [href, count] of results) {
            if (count > 0) next[href] = count;
        }
        return next;
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        void loadCounts(controller.signal).then(setCounts).catch(() => undefined);
        const timer = setInterval(() => {
            void loadCounts(controller.signal).then(setCounts).catch(() => undefined);
        }, 60_000);
        return () => {
            controller.abort();
            clearInterval(timer);
        };
    }, [loadCounts]);

    if (loading) {
        return (
            <div className="flex min-h-dvh items-center justify-center bg-[#f5f8fb]">
                <div className="flex items-center gap-3 text-slate-gray">
                    <LuLoaderCircle className="animate-spin text-2xl"/>
                    <span className="text-sm">Checking your access…</span>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex min-h-dvh items-center justify-center bg-[#f5f8fb] px-4">
                <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
                    <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-alice-blue">
                        <LuShieldAlert className="text-3xl text-cyan"/>
                    </div>
                    <h1 className="text-2xl font-bold text-navy">Sign in required</h1>
                    <p className="mt-2 text-sm text-slate-gray">
                        The Relate dashboard is for admins. Sign in with an admin account to continue.
                    </p>
                    <Link
                        href="/signin"
                        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-navy px-8 py-3 text-sm font-semibold text-white transition hover:bg-navy-soft"
                    >
                        Sign in
                    </Link>
                </div>
            </div>
        );
    }

    if (!isAdminRole(user.role)) {
        return (
            <div className="flex min-h-dvh items-center justify-center bg-[#f5f8fb] px-4">
                <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
                    <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-red-50">
                        <LuShieldAlert className="text-3xl text-red-500"/>
                    </div>
                    <h1 className="text-2xl font-bold text-navy">Admins only</h1>
                    <p className="mt-2 text-sm text-slate-gray">
                        You&apos;re signed in as <span className="font-semibold">{user.email}</span>, which
                        doesn&apos;t have dashboard access. If that looks wrong, ask an existing admin to
                        update your role.
                    </p>
                    <div className="mt-6 flex justify-center gap-3">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-alice-blue"
                        >
                            <LuChevronLeft/> Back to site
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-dvh bg-[#f5f8fb]">
            {/* Mobile top bar */}
            <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 py-3 lg:hidden">
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src={"/images/relate-world-logo.png"}
                        alt={"Relate World"}
                        width={500}
                        height={500}
                        priority
                        className={"h-9 w-auto object-contain self-center"}
                    />
                    <span className="font-black tracking-tight text-navy">Dashboard</span>
                </Link>
                <button
                    onClick={() => setDrawerOpen(true)}
                    aria-label="Open dashboard menu"
                    className="rounded-lg p-2 text-navy transition hover:bg-alice-blue"
                >
                    <span className="flex flex-col gap-1">
                        <span className="block h-0.5 w-5 rounded bg-current"/>
                        <span className="block h-0.5 w-5 rounded bg-current"/>
                        <span className="block h-0.5 w-5 rounded bg-current"/>
                    </span>
                </button>
            </header>

            <div className="lg:flex">
                {/* Desktop sidebar */}
                <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white lg:flex lg:flex-col lg:sticky lg:top-0 lg:h-dvh">
                    <SidebarContent pathname={pathname} counts={counts} onNavigate={() => undefined}/>
                </aside>

                {/* Mobile drawer */}
                {drawerOpen && (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        <button
                            aria-label="Close dashboard menu"
                            onClick={() => setDrawerOpen(false)}
                            className="absolute inset-0 bg-navy/40"
                        />
                        <aside className="relative flex h-full w-72 max-w-[85vw] flex-col bg-white shadow-2xl">
                            <button
                                onClick={() => setDrawerOpen(false)}
                                aria-label="Close dashboard menu"
                                className="absolute right-3 top-3 z-10 rounded-lg p-2 text-slate-gray transition hover:bg-alice-blue"
                            >
                                <LuX/>
                            </button>
                            <SidebarContent pathname={pathname} counts={counts} onNavigate={() => setDrawerOpen(false)}/>
                        </aside>
                    </div>
                )}

                <main className="min-w-0 flex-1 px-4 py-6 md:px-8 md:py-9">
                    <div className="mx-auto max-w-5xl">{children}</div>
                </main>
            </div>
        </div>
    );
}

function SidebarContent({
    pathname,
    counts,
    onNavigate,
}: {
    pathname: string;
    counts: AdminNavCounts;
    onNavigate: () => void;
}) {
    return (
        <>
            <div className="border-b border-gray-100 px-5 py-5">
                <Link href={"/"} onClick={onNavigate} className="block">
                    <Image
                        src={"/images/relate-world-logo.png"}
                        alt={"Relate World"}
                        width={500}
                        height={500}
                        className={"h-12 w-auto object-contain self-center"}
                    />
                    <span className="mt-2 block">
                        <span className="block font-black tracking-tight text-navy">Relate</span>
                        <span className="block text-[11px] font-medium uppercase tracking-[0.2em] text-cyan">Dashboard</span>
                    </span>
                </Link>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4">
                {ADMIN_NAV.map((group) => (
                    <div key={group.heading} className="mb-5 last:mb-0">
                        <p className="mb-1.5 px-3 text-[10px] font-medium uppercase tracking-[0.2em] text-gray-400">
                            {group.heading}
                        </p>
                        <ul className="space-y-0.5">
                            {group.items.map((item) => {
                                const active =
                                    pathname === item.href || pathname.startsWith(`${item.href}/`);
                                const count = counts[item.href];
                                const Icon = item.icon;
                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            onClick={onNavigate}
                                            aria-current={active ? "page" : undefined}
                                            title={item.description}
                                            className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                                                active
                                                    ? "bg-navy text-white"
                                                    : "text-gray-600 hover:bg-alice-blue hover:text-navy"
                                            }`}
                                        >
                                            <Icon className="shrink-0 text-base"/>
                                            <span className="min-w-0 flex-1 truncate">{item.label}</span>
                                            {typeof count === "number" && count > 0 ? (
                                                <span
                                                    className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-black ${
                                                        active ? "bg-white/20 text-white" : "bg-cyan text-navy"
                                                    }`}
                                                >
                                                    {count}
                                                </span>
                                            ) : null}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>

            <div className="border-t border-gray-100 p-3">
                <Link
                    href="/"
                    onClick={onNavigate}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-gray-500 transition hover:bg-alice-blue hover:text-navy"
                >
                    <LuChevronLeft className="text-base"/>
                    Back to site
                </Link>
            </div>
        </>
    );
}
