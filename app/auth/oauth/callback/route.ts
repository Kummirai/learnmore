import { NextRequest, NextResponse } from "next/server";
import { API_BASE } from "@/lib/config";

/**
 * Returns from the provider's OAuth consent screen.
 *
 * For the social flows the backend diverts the final redirect here (via the
 * web-session-bridge) carrying a one-time `bridgeToken` instead of setting its
 * own session cookie. This route exchanges that token for the real session
 * cookie and re-issues it on this site's domain — so the cookie is first-party
 * here rather than pinned to the API origin.
 */
export async function GET(request: NextRequest) {
    const {searchParams} = request.nextUrl;
    const origin = request.nextUrl.origin;
    const nextRaw = searchParams.get("next") || "/";
    const next = nextRaw.startsWith("/") && !nextRaw.startsWith("//") ? nextRaw : "/";
    const error = searchParams.get("error");

    if (error) {
        return NextResponse.redirect(new URL("/SignIn?error=oauth_failed", origin));
    }

    const token = searchParams.get("bridgeToken");
    if (!token) {
        // Reached the page without a bridge token — nothing to redeem.
        return NextResponse.redirect(new URL("/SignIn?error=no_session", origin));
    }

    try {
        const res = await fetch(`${API_BASE}/api/auth/web-session-bridge`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({token}),
            cache: "no-store",
        });
        const json = await res.json().catch(() => null);
        if (!res.ok || typeof json?.cookie !== "string" || !json.cookie) {
            // Token missing, expired or already redeemed.
            return NextResponse.redirect(new URL("/SignIn?error=session_expired", origin));
        }

        const {name, value, attrs} = parseSetCookie(json.cookie);
        if (!name || value === undefined) {
            return NextResponse.redirect(new URL("/SignIn?error=invalid_cookie", origin));
        }

        const response = NextResponse.redirect(new URL(next, origin));
        const secure = name.startsWith("__Secure-") || request.nextUrl.protocol === "https:";
        const maxAge = attrNumber(attrs["max-age"]) ?? attrNumber(attrs["expires"]);
        response.cookies.set({
            name,
            value,
            path: attrs["path"] || "/",
            httpOnly: true,
            sameSite: "lax",
            secure,
            ...(maxAge !== undefined ? {maxAge} : {}),
            domain: undefined,
        });
        return response;
    } catch {
        return NextResponse.redirect(new URL("/SignIn?error=oauth_failed", origin));
    }
}

type ParsedCookie = {
    name: string;
    value: string;
    attrs: Record<string, string>;
};

function parseSetCookie(cookie: string): ParsedCookie {
    const parts = cookie.split(";");
    const first = parts.shift() ?? "";
    const eq = first.indexOf("=");
    const name = eq > 0 ? first.slice(0, eq).trim() : first.trim();
    const value = eq > 0 ? first.slice(eq + 1).trim() : "";
    const attrs: Record<string, string> = {};
    for (const part of parts) {
        const e = part.indexOf("=");
        const key = (e > 0 ? part.slice(0, e) : part).trim().toLowerCase();
        const val = e > 0 ? part.slice(e + 1).trim() : "true";
        attrs[key] = val;
    }
    return {name, value, attrs};
}

function attrNumber(v: string | undefined): number | undefined {
    if (!v || v === "true") return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
}