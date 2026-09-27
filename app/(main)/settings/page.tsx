"use client";

import { useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import { useAuth } from "@/components/AuthProvider";
import { authClient } from "@/lib/auth-client";

const label = "block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1.5";
const inputCls =
    "w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-base md:text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[color:var(--club-accent)] focus:ring-2 focus:ring-[color:var(--club-accent)]/25 transition";

export default function SettingsPage() {
    return (
        <RequireAuth title="Settings">
            <SettingsBody />
        </RequireAuth>
    );
}

function SettingsBody() {
    const { user, refresh } = useAuth();
    const [name, setName] = useState(user?.name ?? "");
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const save = async (e: React.FormEvent) => {
        e.preventDefault();
        if (saving) return;
        setSaving(true);
        setSaved(false);
        setError("");
        try {
            const {error} = await authClient.updateUser({name: name.trim() || undefined});
            if (error) {
                setError(typeof error.message === "string" && error.message ? error.message : "Couldn't save your name.");
            } else {
                await refresh();
                setSaved(true);
            }
        } catch {
            setError("Couldn't save your name. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <section className="flex-1 px-4 py-10 md:py-14" style={{ background: "linear-gradient(115deg, #f5f8fb 0%, #eff5f9 60%, #f5f8fb 100%)" }}>
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-1">Settings</h1>
                <p className="text-gray-500 text-sm mb-6">Update how your name appears across Relate.</p>

                <form onSubmit={save} className="grid gap-4">
                    <div>
                        <label htmlFor="settings-name" className={label}>Display name</label>
                        <input id="settings-name" type="text" autoComplete="name" value={name} onChange={(e) => { setName(e.target.value); setSaved(false); }} className={inputCls} />
                    </div>
                    <div>
                        <label htmlFor="settings-email" className={label}>Email</label>
                        <input id="settings-email" type="email" value={user?.email ?? ""} disabled className={inputCls + " opacity-60 cursor-not-allowed"} />
                        <p className="text-xs text-gray-400 mt-1">Email is managed by your sign-in provider.</p>
                    </div>

                    {error && <p role="status" aria-live="polite" className="rounded-lg bg-red-50 text-red-600 text-sm px-4 py-2.5">{error}</p>}

                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full sm:w-auto rounded-lg px-6 py-3 text-sm font-semibold transition hover:brightness-95 disabled:opacity-60"
                            style={{ backgroundColor: "var(--club-accent)", color: "var(--club-on-accent)" }}
                        >
                            {saving ? "Saving…" : "Save changes"}
                        </button>
                        {saved && <span role="status" aria-live="polite" className="text-sm text-cyan font-medium">Saved ✓</span>}
                    </div>
                </form>
            </div>
        </section>
    );
}
