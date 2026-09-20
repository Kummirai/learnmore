"use client";

import RequireAuth from "@/components/RequireAuth";
import { useAuth } from "@/components/AuthProvider";

export default function AdminPage() {
    return (
        <RequireAuth title="Admin">
            <AdminBody />
        </RequireAuth>
    );
}

function AdminBody() {
    const { user } = useAuth();

    if (user?.role !== "admin") {
        return (
            <section className="flex-1 px-4 py-20 text-center" style={{ background: "linear-gradient(115deg, #151f3a 0%, #1d2a4d 60%, #2a4070 100%)" }}>
                <h1 className="text-2xl font-bold text-white mb-2">Admin area</h1>
                <p className="text-white/70 text-sm max-w-md mx-auto">
                    This area is for Relate admins. Your account doesn&apos;t have admin access — if you believe that&apos;s a mistake, contact the team.
                </p>
            </section>
        );
    }

    return (
        <section className="flex-1 px-4 py-10 md:py-14" style={{ background: "linear-gradient(115deg, #151f3a 0%, #1d2a4d 60%, #2a4070 100%)" }}>
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Admin dashboard</h1>
                <p className="text-white/70 text-sm mb-8">
                    Welcome back, {user?.name}. Members, clubs and store orders will surface here once the backend is linked.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { label: "Members", value: "—" },
                        { label: "Clubs", value: "7" },
                        { label: "Store orders", value: "—" },
                    ].map((s) => (
                        <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm">
                            <p className="text-[11px] uppercase tracking-widest text-gray-500">{s.label}</p>
                            <p className="text-3xl font-black text-gray-800 mt-1">{s.value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
