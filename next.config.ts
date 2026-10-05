import type {NextConfig} from "next";

const apiBase =
    process.env.NEXT_PUBLIC_API_BASE ||
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL ||
    "https://relate-iota.vercel.app";

const nextConfig: NextConfig = {
    /* config options here */
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