import { createAuthClient } from "better-auth/client";
import { adminClient } from "better-auth/client/plugins";

const baseURL =
    process.env.NEXT_PUBLIC_API_BASE ||
    process.env.API_BASE ||
    "https://relate-iota.vercel.app";

export const authClient = createAuthClient({
    baseURL,
    plugins: [adminClient()],
});