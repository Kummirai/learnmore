"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type User = {
    name: string;
    email: string;
    avatarUrl?: string;
    role: "member" | "admin";
    provider: "google" | "github" | "email";
};

type AuthContextType = {
    user: User | null;
    /** Placeholder for the real OAuth redirect flow — signs in a demo profile for now. */
    signInWith: (provider: "google" | "github") => void;
    signInWithEmail: (email: string) => void;
    signUpWithEmail: (email: string, name: string) => void;
    signOut: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "relate.auth.user";

/**
 * Demo profiles shown until the backend is linked up.
 * `signInWith` will become a redirect to the provider's OAuth consent screen.
 */
const DEMO_USERS: Record<"google" | "github", Omit<User, "provider">> = {
    google: {
        name: "Thandi Mokoena",
        email: "thandi.mokoena@relate.app",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces",
        role: "member",
    },
    github: {
        name: "Milton Kumirai",
        email: "milton.kumirai@relate.app",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=faces",
        role: "admin",
    },
};

export function AuthProvider({children}: {children: ReactNode}) {
    const [user, setUser] = useState<User | null>(null);

    // Restore the session on first load.
    useEffect(() => {
        try {
            const raw = window.localStorage.getItem(STORAGE_KEY);
            if (raw) setUser(JSON.parse(raw) as User);
        } catch {
            // Ignore corrupt storage — treat as signed out.
        }
    }, []);

    const persist = (u: User | null) => {
        setUser(u);
        try {
            if (u) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
            else window.localStorage.removeItem(STORAGE_KEY);
        } catch {
            // Storage unavailable (private mode) — session lives in memory only.
        }
    };

    const signInWith = (provider: "google" | "github") =>
        persist({...DEMO_USERS[provider], provider});

    const signInWithEmail = (email: string) =>
        persist({
            name: email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
            email,
            role: "member",
            provider: "email",
        });

    const signUpWithEmail = (email: string, name: string) =>
        persist({name: name || email.split("@")[0], email, role: "member", provider: "email"});

    const signOut = () => persist(null);

    return (
        <AuthContext.Provider value={{user, signInWith, signInWithEmail, signUpWithEmail, signOut}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
