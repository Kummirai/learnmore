/**
 * Base URL of the Relate backend API.
 *
 * The browser never calls this directly — next.config.ts rewrites /api/* to it
 * so cookies stay first-party. This constant is used server-side when the app
 * itself needs to reach the backend (e.g. the OAuth session-bridge exchange).
 */
export const API_BASE =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL ||
    "https://relate-iota.vercel.app";