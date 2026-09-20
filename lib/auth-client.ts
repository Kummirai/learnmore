import { createAuthClient } from "better-auth/client";
import { adminClient } from "better-auth/client/plugins";

/**
 * The browser only ever talks to this origin — next.config.ts rewrites
 * /api/:path* to the Relate backend, so sessions stay first-party and no
 * CORS is involved. Never point the client at the backend URL directly.
 */
export const authClient = createAuthClient({
    baseURL:
        process.env.NEXT_PUBLIC_AUTH_URL ||
        (typeof window !== "undefined" ? window.location.origin : ""),
    plugins: [adminClient()],
});