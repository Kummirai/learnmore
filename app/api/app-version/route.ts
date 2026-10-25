import { APP_VERSION } from "@/lib/app-version";

/**
 * Latest APK version, download link and release notes for the mobile app's
 * launch-time update check.
 *
 * next.config.ts rewrites /api/* to the backend as a BFF proxy, but route
 * files take precedence over rewrites, so this responds on this origin.
 * `no-store` stops devices/CDNs from caching an old version after a release.
 */
export async function GET() {
    return Response.json(APP_VERSION, {
        headers: { "Cache-Control": "no-store" },
    });
}
