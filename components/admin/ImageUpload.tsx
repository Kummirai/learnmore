"use client";

import { useRef, useState } from "react";
import { LuImagePlus, LuLoader, LuUpload, LuX } from "react-icons/lu";
import { Button, Input } from "@/components/admin/ui";

const MAX_BYTES = 4 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/png,image/webp,image/avif";

function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Admin image field: paste a URL or upload the file to Supabase Storage.
 *
 * The browser never touches Supabase — it POSTs the file to
 * /api/admin/uploads, which authenticates the admin and writes the object
 * server-side. On success `onChange` receives the public URL, so this drops
 * into any controlled string field.
 */
export default function ImageUpload({
                                   value,
                                   onChange,
                                   label = "Cover image",
                                   hint,
                                   previewClassName = "h-[72px] w-[52px]",
                               }: {
    value: string;
    onChange: (url: string) => void;
    label?: string;
    hint?: string;
    previewClassName?: string;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);

    const upload = async (file: File) => {
        if (!file.type.startsWith("image/")) {
            setError("Choose a JPEG, PNG, WebP or AVIF image.");
            return;
        }
        if (file.size > MAX_BYTES) {
            setError(`That image is ${formatBytes(file.size)} — the limit is 4 MB.`);
            return;
        }

        setBusy(true);
        setError(null);
        setName(file.name);
        try {
            const body = new FormData();
            body.append("file", file);
            const res = await fetch("/api/admin/uploads", { method: "POST", body });
            const json = await res.json().catch(() => null);
            if (!res.ok) throw new Error(json?.error || "Upload failed.");
            onChange(json.url as string);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Upload failed.");
            setName(null);
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="space-y-2">
            <span className="block text-[11px] font-semibold uppercase tracking-widest text-slate-gray">
                {label}
            </span>

            <div className="flex flex-wrap items-center gap-3">
                {value ? (
                    <div className="relative shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={value}
                             alt="image preview"
                             className={`${previewClassName} rounded-md object-cover object-top ring-1 ring-gray-200`}/>
                        <button type="button"
                                onClick={() => onChange("")}
                                aria-label="Remove image"
                                className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-white text-gray-500 shadow ring-1 ring-gray-200 transition hover:text-red-600">
                            <LuX className="size-3.5"/>
                        </button>
                    </div>
                ) : null}

                <div className="min-w-[220px] flex-1">
                    <Input value={value}
                           onChange={(e) => onChange(e.target.value)}
                           placeholder="https://… or upload a file"
                           disabled={busy}/>
                </div>

                <input ref={inputRef}
                       type="file"
                       accept={ACCEPT}
                       className="hidden"
                       onChange={(e) => {
                           const file = e.target.files?.[0];
                           e.target.value = "";
                           if (file) void upload(file);
                       }}/>
                <Button type="button"
                        variant="ghost"
                        disabled={busy}
                        onClick={() => inputRef.current?.click()}>
                    {busy ? <LuLoader className="animate-spin"/> : <LuUpload/>}
                    {busy ? "Uploading…" : "Upload"}
                </Button>
            </div>

            {error ? (
                <p className="text-xs font-medium text-red-600">{error}</p>
            ) : busy && name ? (
                <p className="flex items-center gap-1.5 text-xs text-slate-gray">
                    <LuImagePlus className="size-3.5 shrink-0"/>
                    <span className="truncate">{name}</span>
                </p>
            ) : hint ? (
                <p className="text-xs text-gray-400">{hint}</p>
            ) : null}
        </div>
    );
}
