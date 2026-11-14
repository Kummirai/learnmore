"use client";

import type { ReactNode } from "react";

/* Shared admin UI primitives — styled with the site's navy/cyan palette. */

export const inputCls =
    "w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-base md:text-sm text-gray-800 shadow-sm outline-none transition focus:border-cyan focus:ring-2 focus:ring-cyan/20 placeholder:text-gray-400";

export function Field({
    label,
    hint,
    children,
}: {
    label: string;
    hint?: string;
    children: ReactNode;
}) {
    return (
        <label className="block">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-slate-gray">
                {label}
            </span>
            {children}
            {hint ? <span className="mt-1 block text-xs text-gray-400">{hint}</span> : null}
        </label>
    );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return <input {...props} className={inputCls} />;
}

export function TextArea({
    className = "",
    ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return <textarea {...props} className={`${inputCls} min-h-[84px] ${className}`} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={inputCls} />;
}

export function Button({
    variant = "primary",
    className = "",
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "accent" | "ghost" | "danger";
}) {
    const styles: Record<string, string> = {
        primary: "btn-signin text-white hover:brightness-95",
        accent: "bg-cyan text-navy hover:bg-cyan-dark",
        ghost: "border border-gray-200 bg-white text-gray-700 hover:bg-alice-blue",
        danger: "bg-red-600 text-white hover:bg-red-700",
    };
    return (
        <button
            {...props}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-3.5 py-2.5 min-h-10 text-[13px] font-semibold transition disabled:opacity-50 sm:px-4 sm:py-3 sm:min-h-11 sm:text-sm ${styles[variant]} ${className}`}
        />
    );
}

export function Badge({
    tone = "slate",
    children,
}: {
    tone?: "gold" | "amber" | "slate" | "sky";
    children: ReactNode;
}) {
    const colors: Record<string, string> = {
        gold: "bg-gold-100 text-gold-800",
        // Orange, not amber: amber sits too close to the brand gold to read as a
        // distinct warning state.
        amber: "bg-orange-100 text-orange-800",
        slate: "bg-alice-blue text-slate-gray",
        sky: "bg-ice-blue text-navy",
    };
    return (
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold sm:text-xs ${colors[tone]}`}>
            {children}
        </span>
    );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
    return (
        <div className={`rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5 ${className}`}>
            {children}
        </div>
    );
}

/** Page header in the site's editorial style: cyan eyebrow + bold navy title. */
export function AdminHeader({
    eyebrow,
    title,
    sub,
    actions,
}: {
    eyebrow: string;
    title: string;
    sub?: string;
    actions?: ReactNode;
}) {
    return (
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
                <p className="mb-1 text-[10.5px] font-medium uppercase tracking-[0.2em] text-cyan sm:text-[11px]">{eyebrow}</p>
                <h1 className="text-xl font-black leading-tight tracking-tight text-navy sm:text-2xl md:text-3xl">{title}</h1>
                {sub ? <p className="mt-1 text-[13px] text-slate-gray sm:text-sm">{sub}</p> : null}
            </div>
            {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
        </div>
    );
}
