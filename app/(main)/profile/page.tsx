"use client";

import Link from "next/link";
import { LuArrowLeft } from "react-icons/lu";
import RequireAuth from "@/components/RequireAuth";
import { useAuth } from "@/components/AuthProvider";

function PageShell({children}: {children: React.ReactNode}) {
    return (
        <section className="flex-1 px-4 py-10 md:py-14" style={{ background: "linear-gradient(115deg, #151f3a 0%, #1d2a4d 60%, #2a4070 100%)" }}>
            <div className="max-w-2xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white mb-6 transition-colors">
                    <LuArrowLeft /> Back to Home
                </Link>
                {children}
            </div>
        </section>
    );
}

export default function ProfilePage() {
    return (
        <RequireAuth title="Profile">
            <PageShell>
                <ProfileBody />
            </PageShell>
        </RequireAuth>
    );
}

function ProfileBody() {
    const { user } = useAuth();
    if (!user) return null;

    return (
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <div className="flex items-center gap-4 mb-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={user.avatarUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=13c5dd&color=1d2a4d`}
                    alt={user.name}
                    className="size-16 rounded-full object-cover"
                />
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
                    <p className="text-sm text-gray-500">{user.email}</p>
                </div>
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-alice-blue rounded-xl px-4 py-3">
                    <dt className="text-[11px] uppercase tracking-widest text-gray-500">Member role</dt>
                    <dd className="text-sm font-semibold text-gray-800 capitalize">{user.role}</dd>
                </div>
                <div className="bg-alice-blue rounded-xl px-4 py-3">
                    <dt className="text-[11px] uppercase tracking-widest text-gray-500">Signed in via</dt>
                    <dd className="text-sm font-semibold text-gray-800 capitalize">{user.provider}</dd>
                </div>
            </dl>

            <p className="text-xs text-gray-400 mt-6">
                Club memberships, prayer streaks and saved reading guides will appear here once the backend is linked.
            </p>
        </div>
    );
}
