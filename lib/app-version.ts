/**
 * Latest published Android build for the Relate app — the single source of
 * truth behind GET /api/app-version (which the mobile app polls on launch)
 * and behind every "Download the app" button on the site, so all surfaces
 * always point at the same build.
 *
 * On every release:
 *   1. Bump LATEST_VERSION below and the mobile app's `expo.version`.
 *   2. Build the APK, then publish it as a GitHub Release on
 *      Kummirai/learnmore (public, so the asset downloads without a login)
 *      with tag `vX.Y.Z` and the asset named `relate-world-vX.Y.Z.apk` —
 *      both are derived from LATEST_VERSION, so the URL lines up
 *      automatically.
 *   3. Paste the release notes below.
 *
 * The APK never enters the git tree (release assets are hosted outside it),
 * so Netlify never ships a 100 MB binary with the site.
 */
export type AppVersionInfo = {
    latestVersion: string;
    minSupportedVersion: string;
    apkUrl: string;
    releaseNotes: string;
    forceUpdate: boolean;
};

const LATEST_VERSION = "1.0.4";

/** Release-asset URL for a given version — GitHub serves it as an attachment. */
export const LATEST_APK_URL =
    `https://github.com/Kummirai/learnmore/releases/download/v${LATEST_VERSION}/relate-world-v${LATEST_VERSION}.apk`;

export const APP_VERSION: AppVersionInfo = {
    latestVersion: LATEST_VERSION,
    minSupportedVersion: "1.0.0",
    apkUrl: LATEST_APK_URL,
    releaseNotes:
        "• Upgraded to Expo SDK 57\n• Delete your account from Profile\n• Updated app icons\n• Store now shows live products\n• General stability fixes",
    forceUpdate: false,
};
