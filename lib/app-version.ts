/**
 * Latest published Android build for the Relate app — the single source of
 * truth behind GET /api/app-version, which the mobile app polls on launch.
 *
 * On every release: bump the two versions, point apkUrl at the new file
 * under public/downloads/, and paste the release notes below.
 */
export type AppVersionInfo = {
    latestVersion: string;
    minSupportedVersion: string;
    apkUrl: string;
    releaseNotes: string;
    forceUpdate: boolean;
};

export const APP_VERSION: AppVersionInfo = {
    latestVersion: "1.0.1",
    minSupportedVersion: "1.0.0",
    apkUrl: "https://relateworld.org/downloads/relate-world-v1.0.1.apk",
    releaseNotes:
        "• New Sprout Netball match tracking\n• Performance improvements and bug fixes",
    forceUpdate: false,
};
