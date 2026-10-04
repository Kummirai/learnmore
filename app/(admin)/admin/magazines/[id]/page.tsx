"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MagazineEditor from "@/components/admin/MagazineEditor";
import { Button } from "@/components/admin/ui";

export default function AdminMagazinesEditPage({ params }: { params: Promise<{ id: string }> }) {
    return (
  <section
      className="flex-1 px-4 py-10 md:py-14"
      style={{ background: "linear-gradient(115deg, #f5f8fb 0%, #eff5f9 60%, #f5f8fb 100%)" }}
  >
      <div className="max-w-6xl mx-auto">
          <EditBody params={params} />
      </div>
  </section>
    );
}

function EditBody({ params }: { params: Promise<{ id: string }> }) {
    const [id, setId] = useState<string | null>(null);
    const [doc, setDoc] = useState<Record<string, unknown> | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;
        (async () => {
            const { id: slug } = await params;
            if (cancelled) return;
            setId(slug);
            try {
                const res = await fetch(`/api/admin/publications/${encodeURIComponent(slug)}`);
                const json = await res.json().catch(() => null);
                if (!res.ok || !json?.data) {
                    setError(typeof json?.error === "string" ? json.error : "Couldn't load this publication.");
                    return;
                }
                if (!cancelled) setDoc(json.data);
            } catch {
                if (!cancelled) setError("Couldn't reach the API. Is the backend up?");
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [params]);

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                    <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.2em] text-cyan">Library</p>
                    <h1 className="truncate text-xl md:text-2xl font-black tracking-tight text-navy">
                        {doc ? `Edit ${doc.kind === "bulletin" ? "bulletin" : "season guide"}` : "Editing…"}
                    </h1>
                    <p className="mt-0.5 truncate text-sm text-slate-gray">{id}</p>
                </div>
                <Link
                    href="/admin/magazines"
                    className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-alice-blue"
                >
                    Back to list
                </Link>
            </div>

            {error ? (
                <div className="rounded-2xl bg-white p-8 text-center shadow-xl">
                    <p className="font-bold text-navy">{error}</p>
                    <p className="mt-2 text-sm text-slate-gray">The backend may be unreachable right now.</p>
                    <Button className="mt-4" onClick={() => window.history.back()}>Go back</Button>
                </div>
            ) : doc ? (
                <MagazineEditor initial={doc} />
            ) : (
                <div className="rounded-2xl bg-white p-8 text-center text-sm text-slate-gray shadow-xl">Loading publication…</div>
            )}
        </div>
    );
}