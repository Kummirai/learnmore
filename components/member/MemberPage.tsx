"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { LuArrowLeft } from "react-icons/lu";

export default function MemberPage({
    eyebrow,
    title,
    sub,
    backHref,
    backLabel = "Back",
    wide = false,
    children,
}: {
    eyebrow: string;
    title: string;
    sub?: string;
    backHref?: string;
    backLabel?: string;
    wide?: boolean;
    children: ReactNode;
}) {
    return (
        <section
            className="flex-1 px-4 py-10 md:py-14"
            style={{ background: "linear-gradient(115deg, #f5f8fb 0%, #eff5f9 60%, #f5f8fb 100%)" }}
        >
            <div className={`mx-auto ${wide ? "max-w-4xl" : "max-w-3xl"}`}>
                {backHref && (
                    <Link
                        href={backHref}
                        className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-gray transition hover:text-navy"
                    >
                        <LuArrowLeft className="size-3.5" /> {backLabel}
                    </Link>
                )}
                <div className="mb-6">
                    <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.2em] text-cyan">
                        {eyebrow}
                    </p>
                    <h1 className="text-2xl font-black leading-none tracking-tight text-navy md:text-3xl">
                        {title}
                    </h1>
                    {sub ? <p className="mt-2 max-w-2xl text-sm text-slate-gray">{sub}</p> : null}
                </div>
                {children}
            </div>
        </section>
    );
}
