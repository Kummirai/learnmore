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
    blurb,
    next,
}: {
    children: React.ReactNode;
    title: string;
    /** Optional override for the prompt under the title. */
    blurb?: string;
    /** Path to return to after signing in (must start with "/"). */
    next?: string;
}) {
    const { user, loading } = useAuth();
    const signInHref =
        next && next.startsWith("/") && !next.startsWith("//")
            ? `/signin?next=${encodeURIComponent(next)}`
            : "/signin";

    if (loading) {
        return (
            <section className="flex-1 px-4 py-20 flex items-center justify-center" style={{ background: "linear-gradient(115deg, #f5f8fb 0%, #eff5f9 60%, #f5f8fb 100%)" }}>
                <div className="flex items-center gap-3 text-slate-gray">
                    <LuLoaderCircle className="animate-spin text-2xl" />
                    <span className="text-sm">Checking your session…</span>
                </div>
            </section>
        );
    }

    if (!user) {
        return (
            <section className="flex-1 px-4 py-20" style={{ background: "linear-gradient(115deg, #f5f8fb 0%, #eff5f9 60%, #f5f8fb 100%)" }}>
                <div className="max-w-md mx-auto text-center">
                    <div className="size-16 rounded-full bg-white flex items-center justify-center mx-auto mb-5 shadow-sm">
                        <LuLogIn className="text-3xl text-cyan" />
                    </div>
                    <h1 className="text-2xl font-bold text-navy mb-2">{title}</h1>
                    <p className="text-slate-gray text-sm mb-6">
                        {blurb ??
                            "Sign in to view this page — keep your clubs, reading guides and prayer rhythm in one place."}
                    </p>
                    <Link
                        href={signInHref}
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
