"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { authClient } from "@/lib/auth-client";

export type User = {
    name: string;
    email: string;
    image?: string | null;
    role: "member" | "admin" | "facilitator" | "user";
    emailVerified?: boolean;
};

type AuthContextType = {
    user: User | null;
    /** True while the saved session is being restored on first load. */
    loading: boolean;
    /** Starts the OAuth redirect for the given provider (Google or GitHub). */
    signInWith: (provider: "google" | "github", next?: string) => void;
    /** Signs in with email + password. Resolves to an error message, or null on success. */
    signInWithEmail: (email: string, password: string) => Promise<string | null>;
    /** Creates an account with email + password. Resolves to an error message, or null on success. */
    signUpWithEmail: (name: string, email: string, password: string) => Promise<string | null>;
    signOut: () => Promise<void>;
    /** Re-reads the session from the backend after things like profile edits. */
    refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

function toAppUser(u: {
    name?: unknown;
    email?: unknown;
    image?: unknown;
    role?: unknown;
    emailVerified?: unknown;
} | null | undefined): User | null {
    if (!u) return null;
    const raw = typeof u.role === "string" ? u.role : "user";
    return {
        name: typeof u.name === "string" ? u.name : "User",
        email: typeof u.email === "string" ? u.email : "",
        image: typeof u.image === "string" && u.image ? u.image : null,
        role: raw === "admin" || raw === "facilitator" ? raw : "member",
        emailVerified: Boolean(u.emailVerified),
    };
}

function messageFor(error: unknown): string {
    if (typeof error === "string" && error) return error;
    return "Something went wrong. Please try again.";
}

export function AuthProvider({children}: {children: ReactNode}) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async () => {
        try {
            const {data} = await authClient.getSession();
            setUser(toAppUser(data?.user));
        } catch {
            setUser(null);
        }
    }, []);

    useEffect(() => {
        // When loading is the very first effect these would race, so capture it.
        let cancelled = false;
        (async () => {
            try {
                const {data} = await authClient.getSession();
                if (!cancelled) setUser(toAppUser(data?.user));
            } catch {
                if (!cancelled) setUser(null);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    const signInWith = (provider: "google" | "github", next?: string) => {
        const origin = typeof window !== "undefined" ? window.location.origin : "";
        const safeNext =
            next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
        const callback = `${origin}/auth/oauth/callback?next=${encodeURIComponent(safeNext)}`;
        void authClient.signIn.social({
            provider,
            callbackURL: callback,
            errorCallbackURL: origin + "/SignIn?error=oauth_failed",
        });
    };

    const signInWithEmail = async (email: string, password: string) => {
        try {
            const {error} = await authClient.signIn.email({email, password});
            if (error) return messageFor(error.message);
            await refresh();
            return null;
        } catch (e) {
            return messageFor((e as Error)?.message);
        }
    };

    const signUpWithEmail = async (name: string, email: string, password: string) => {
        try {
            const {error} = await authClient.signUp.email({name, email, password});
            if (error) return messageFor(error.message);
            await refresh();
            return null;
        } catch (e) {
            return messageFor((e as Error)?.message);
        }
    };

    const signOut = async () => {
        try {
            await authClient.signOut();
        } catch {
            // Still clear the session locally even if the server call fails.
        }
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{user, loading, signInWith, signInWithEmail, signUpWithEmail, signOut, refresh}}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}