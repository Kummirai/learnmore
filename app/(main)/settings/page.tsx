"use client";

import { useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import { useAuth } from "@/components/AuthProvider";

const label = "block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1.5";
const inputCls =
    "w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[color:var(--club-accent)] focus:ring-2 focus:ring-[color:var(--club-accent)]/25 transition";

export default function SettingsPage() {
    return (
        <RequireAuth title="Settings">
            <SettingsBody />
        </RequireAuth>
    );
}

function SettingsBody() {
    const { user } = useAuth();
    const [name, setName] = useState(user?.name ?? "");
    const [saved, setSaved] = useState(false);

    return (
        <section className="flex-1 px-4 py-10 md:py-14" style={{ background: "linear-gradient(115deg, #151f3a 0%, #1d2a4d 60%, #2a4070 100%)" }}>
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-1">Settings</h1>
                <p className="text-gray-500 text-sm mb-6">Update how your name appears across Relate.</p>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        setSaved(true);
                        // When the backend is linked, persist via API here.
                    }}
                    className="grid gap-4"
                >
                    <div>
                        <label htmlFor="settings-name" className={label}>Display name</label>
                        <input id="settings-name" type="text" value={name} onChange={(e) => { setName(e.target.value); setSaved(false); }} className={inputCls} />
                    </div>
                    <div>
                        <label htmlFor="settings-email" className={label}>Email</label>
                        <input id="settings-email" type="email" value={user?.email ?? ""} disabled className={inputCls + " opacity-60 cursor-not-allowed"} />
                        <p className="text-xs text-gray-400 mt-1">Email is managed by your sign-in provider.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            className="rounded-lg px-6 py-2.5 text-sm font-semibold transition hover:brightness-95"
                            style={{ backgroundColor: "var(--club-accent)", color: "var(--club-on-accent)" }}
                        >
                            Save changes
                        </button>
                        {saved && <span className="text-sm text-cyan font-medium">Saved ✓</span>}
                    </div>
                </form>
            </div>
        </section>
    );
}
