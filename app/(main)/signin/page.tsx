"use client";

import { useState } from "react";
import Link from "next/link";
import { FaGoogle, FaGithub } from "react-icons/fa6";
import { LuMail, LuEye, LuEyeOff, LuArrowLeft } from "react-icons/lu";
import { useAuth } from "@/components/AuthProvider";

const inputCls =
    "w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[color:var(--club-accent)] focus:ring-2 focus:ring-[color:var(--club-accent)]/25 transition";

export default function SignInPage() {
    const { signInWith, signInWithEmail, signUpWithEmail } = useAuth();
    const [mode, setMode] = useState<"signin" | "signup">("signin");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState("");

    const validate = () => {
        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Please enter a valid email address.");
            return false;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return false;
        }
        if (mode === "signup" && !name.trim()) {
            setError("Please tell us your name.");
            return false;
        }
        setError("");
        return true;
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        if (mode === "signin") signInWithEmail(email);
        else signUpWithEmail(email, name);
        window.location.href = "/";
    };

    const oauth = (provider: "google" | "github") => {
        signInWith(provider);
        window.location.href = "/";
        // When the backend is linked: window.location.href = `/api/auth/${provider}`;
    };

    return (
        <section
            className="flex-1 px-4 py-12 md:py-16"
            style={{ background: "linear-gradient(115deg, #151f3a 0%, #1d2a4d 60%, #2a4070 100%)" }}
        >
            <div className="max-w-md mx-auto">
                <Link href="/" className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white mb-6 transition-colors">
                    <LuArrowLeft /> Back to Home
                </Link>
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        {mode === "signin" ? "Welcome back" : "Create your account"}
                    </h1>
                    <p className="text-gray-500 text-sm mt-1 mb-6">
                        {mode === "signin"
                            ? "Sign in to keep your clubs, reading guides and prayer rhythm close."
                            : "Join Relate — skills, social and spiritual growth, all in one community."}
                    </p>

                    <div className="grid gap-3">
                        <button
                            onClick={() => oauth("google")}
                            className="flex items-center justify-center gap-3 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                        >
                            <FaGoogle className="text-lg" /> Continue with Google
                        </button>
                        <button
                            onClick={() => oauth("github")}
                            className="flex items-center justify-center gap-3 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                        >
                            <FaGithub className="text-lg" /> Continue with GitHub
                        </button>
                    </div>

                    <div className="flex items-center gap-4 my-6">
                        <span className="h-px flex-1 bg-gray-200" />
                        <span className="text-xs uppercase tracking-widest text-gray-400">or</span>
                        <span className="h-px flex-1 bg-gray-200" />
                    </div>
                    <form onSubmit={submit} className="grid gap-3">
                        {mode === "signup" && (
                            <div>
                                <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1.5">Name</label>
                                <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={inputCls} />
                            </div>
                        )}
                        <div>
                            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1.5">Email</label>
                            <div className="relative">
                                <LuMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputCls + " pl-10"} />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1.5">Password</label>
                            <div className="relative">
                                <input id="password" type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={inputCls + " pr-10"} />
                                <button type="button" onClick={() => setShowPw((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" aria-label={showPw ? "Hide password" : "Show password"}>
                                    {showPw ? <LuEyeOff /> : <LuEye />}
                                </button>
                            </div>
                        </div>

                        {error && <p className="rounded-lg bg-red-50 text-red-600 text-sm px-4 py-2.5">{error}</p>}

                        <button type="submit" className="w-full rounded-lg px-4 py-3 text-sm font-semibold transition hover:brightness-95 mt-1" style={{ backgroundColor: "var(--club-accent)", color: "var(--club-on-accent)" }}>
                            {mode === "signin" ? "Sign in" : "Create account"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        {mode === "signin" ? "New to Relate? " : "Already have an account? "}
                        <button onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); }} className="font-semibold text-cyan hover:text-cyan-dark transition-colors">
                            {mode === "signin" ? "Create an account" : "Sign in"}
                        </button>
                    </p>
                </div>
            </div>
        </section>
    );
}
