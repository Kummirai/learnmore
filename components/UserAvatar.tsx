"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    LuSettings,
    LuLogOut,
    LuShield,
    LuUser,
    LuLogIn,
} from "react-icons/lu";
import { useAuth } from "./AuthProvider";

/**
 * Avatar button in the navbar. Shows a placeholder glyph when signed out and
 * opens a dropdown: Sign in / Sign up — or Profile / Settings / Admin / Sign out when signed in.
 * Photo comes from the better-auth user record (`image`).
 */
export default function UserAvatar() {
    const { user, signOut } = useAuth();
    const [open, setOpen] = useState(false);
    const [imgFailed, setImgFailed] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);

    // Close on outside click or Escape.
    useEffect(() => {
        if (!open) return;
        const onDown = (e: MouseEvent) => {
            if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    const initials = user
        ? user.name
              .split(" ")
              .map((p) => p[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()
        : "";

    return (
        <div ref={rootRef} className="relative">
            <button
                onClick={() => setOpen((o) => !o)}
                aria-label={user ? "Account menu" : "Sign in"}
                aria-expanded={open}
                className={
                    "size-10 rounded-full overflow-hidden flex items-center justify-center transition-all bg-alice-blue " +
                    (open ? "ring-2 ring-[color:var(--club-accent)]" : "ring-1 ring-gray-200 hover:ring-gray-400")
                }
            >
                {user && user.image && !imgFailed ? (
                    <Image
                        src={user.image}
                        alt={user.name}
                        width={80}
                        height={80}
                        className="size-full object-cover"
                        onError={() => setImgFailed(true)}
                    />
                ) : user ? (
                    <span className="text-sm font-bold text-navy">{initials}</span>
                ) : (
                    <LuUser className="text-xl text-navy/70" />
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-2 w-60 rounded-xl bg-white shadow-xl border border-gray-100 py-2 z-50">
                    {user ? (
                        <>
                            <div className="px-4 py-2 border-b border-gray-100">
                                <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                            </div>
                            <Link
                                href="/profile"
                                className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-alice-blue hover:text-[color:var(--club-accent-dark)] transition-colors"
                            >
                                <LuUser className="text-base" /> Profile
                            </Link>
                            <Link
                                href="/settings"
                                className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-alice-blue hover:text-[color:var(--club-accent-dark)] transition-colors"
                            >
                                <LuSettings className="text-base" /> Settings
                            </Link>
                            {user.role === "admin" && (
                                <Link
                                    href="/admin"
                                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-alice-blue hover:text-[color:var(--club-accent-dark)] transition-colors"
                                >
                                    <LuShield className="text-base" /> Admin
                                </Link>
                            )}
                            <button
                                onClick={() => {
                                    signOut();
                                    setOpen(false);
                                }}
                                className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-alice-blue hover:text-[color:var(--club-accent-dark)] transition-colors text-left"
                            >
                                <LuLogOut className="text-base" /> Sign out
                            </button>
                        </>
                    ) : (
                        <Link
                            href="/signin"
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-alice-blue hover:text-[color:var(--club-accent-dark)] transition-colors"
                        >
                            <LuLogIn className="text-base" /> Sign in / Sign up
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
