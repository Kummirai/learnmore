/**
 * Cloudinary upload + URL helpers for public media (avatars, banners,
 * covers, galleries).
 *
 * Uploads are unsigned: the browser posts the file straight to Cloudinary
 * with the public upload preset, so no API key or secret ever ships to the
 * client. The returned `secure_url` is stored as-is in the database —
 * Supabase/Mongo only ever holds the URL string, never the file.
 */

export const CLOUDINARY_CLOUD_NAME =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    process.env.CLOUDINARY_CLOUD_NAME ||
    "";

export const CLOUDINARY_UPLOAD_PRESET =
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
    process.env.CLOUDINARY_UPLOAD_PRESET ||
    "";

export const isCloudinaryConfigured = !!(
    CLOUDINARY_CLOUD_NAME && CLOUDINARY_UPLOAD_PRESET
);

/**
 * Upload an image file straight to Cloudinary and return its secure URL.
 * Throws when unconfigured or when Cloudinary rejects the upload, so callers
 * surface a real error instead of storing a broken link.
 */
export async function uploadToCloudinary(
    file: File | Blob,
    folder?: string,
): Promise<string> {
    if (!isCloudinaryConfigured) {
        throw new Error(
            "Image uploads are not configured yet — set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.",
        );
    }
    const body = new FormData();
    body.append("file", file);
    body.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    if (folder) body.append("folder", folder);

    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body },
    );
    const json = await res.json().catch(() => null);
    if (!res.ok || typeof json?.secure_url !== "string") {
        throw new Error(json?.error?.message || "Upload failed.");
    }
    return json.secure_url as string;
}

const UPLOAD_MARK = "/image/upload/";

/**
 * Append `w_{width},f_auto,q_auto` to a Cloudinary URL so views fetch a
 * screen-sized WebP/AVIF instead of the multi-megabyte original. URLs that
 * aren't Cloudinary (Supabase, Unsplash, static site) and URLs that already
 * carry a transformation pass through untouched.
 */
export function getOptimizedImageUrl(url: string, width: number): string;
export function getOptimizedImageUrl(
    url: string | null | undefined,
    width: number,
): string | null | undefined;
export function getOptimizedImageUrl(
    url: string | null | undefined,
    width: number,
): string | null | undefined {
    if (!url || !url.includes(UPLOAD_MARK)) return url;
    const markerAt = url.indexOf(UPLOAD_MARK);
    const rest = url.slice(markerAt + UPLOAD_MARK.length);
    const firstSegment = rest.split("/")[0] ?? "";
    // A transform chain like "w_300,c_fill" has no dot and does have a
    // component separator — leave those alone so the helper stays idempotent.
    if (firstSegment && !firstSegment.includes(".") && firstSegment.includes("_")) {
        return url;
    }
    return url.replace(UPLOAD_MARK, `${UPLOAD_MARK}w_${width},f_auto,q_auto/`);
}
