"use client";

import Link from "next/link";
import { LuLogIn, LuLoaderCircle } from "react-icons/lu";
import { useAuth } from "./AuthProvider";

/**
 * Client-side gate for account pages. Renders children only for signed-in
 * users; visitors get a friendly sign-in prompt. Swap the demo auth for the
 * real backend later — the guard shape stays the same.
 */
export default function RequireAuth({
    children,
    title,
}: {
    children: React.ReactNode;
    title: string;
}) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <section className="flex-1 px-4 py-20 flex items-center justify-center" style={{ background: "linear-gradient(115deg, #151f3a 0%, #1d2a4d 60%, #2a4070 100%)" }}>
                <div className="flex items-center gap-3 text-white/80">
                    <LuLoaderCircle className="animate-spin text-2xl" />
                    <span className="text-sm">Checking your session…</span>
                </div>
            </section>
        );
    }

    if (!user) {
        return (
            <section className="flex-1 px-4 py-20" style={{ background: "linear-gradient(115deg, #151f3a 0%, #1d2a4d 60%, #2a4070 100%)" }}>
                <div className="max-w-md mx-auto text-center">
                    <div className="size-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-5">
                        <LuLogIn className="text-3xl text-[color:var(--club-accent)]" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
                    <p className="text-white/70 text-sm mb-6">
                        Sign in to view this page — keep your clubs, reading guides and prayer rhythm in one place.
                    </p>
                    <Link
                        href="/signin"
                        className="inline-flex items-center gap-2 rounded-lg px-8 py-3 text-sm font-semibold transition hover:brightness-95"
                        style={{ backgroundColor: "var(--club-accent)", color: "var(--club-on-accent)" }}
                    >
                        <LuLogIn /> Sign in
                    </Link>
                </div>
            </section>
        );
    }

    return <>{children}</>;
}
