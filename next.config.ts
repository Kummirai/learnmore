import type {NextConfig} from "next";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));

const apiBase =
    process.env.NEXT_PUBLIC_API_BASE ||
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL ||
    "https://relate-iota.vercel.app";

const nextConfig: NextConfig = {
    turbopack: {
        root,
    },
    images: {
        // Content images come from the backend, Supabase storage, the CDN and
        // user avatars, so any https host is optimisable. Localhost covers the
        // backend running next door in development.
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
            },
        ],
    },
    async headers() {
        const security = [
            {key: "X-Content-Type-Options", value: "nosniff"},
            {key: "X-Frame-Options", value: "DENY"},
            {key: "Referrer-Policy", value: "strict-origin-when-cross-origin"},
            {key: "X-DNS-Prefetch-Control", value: "on"},
            {
                key: "Permissions-Policy",
                value: "camera=(), microphone=(), geolocation=(), payment=()",
            },
        ];
        if (process.env.NODE_ENV === "production") {
            security.push({
                key: "Strict-Transport-Security",
                value: "max-age=63072000; includeSubDomains; preload",
            });
        }
        return [
            {
                source: "/:path*",
                headers: security,
            },
        ];
    },
    async redirects() {
        // The old volunteer sign-up page is retired; volunteer service now
        // runs through the offices programme.
        return [
            {
                source: "/volunteer",
                destination: "/offices",
                permanent: true,
            },
        ];
    },
    async rewrites() {
        // BFF proxy: every /api/* request the app makes is forwarded to the
        // Relate backend so sessions and cookies stay first-party on this
        // origin. The browser never talks to the backend directly.
        return [
            {
                source: "/api/:path*",
                destination: `${apiBase}/api/:path*`,
            },
        ];
    },
};

export default nextConfig;