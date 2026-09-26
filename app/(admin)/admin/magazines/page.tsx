"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LuPlus, LuX, LuPencil } from "react-icons/lu";
import { Badge, AdminHeader, Button, Field, Input, Select } from "@/components/admin/ui";

type Row = {
    id: string;
    title: string;
    series: string;
    clubName: string;
    seasonLabel: string;
    status: "published" | "draft";
    updated: string;
};

const CLUB_SLUGS = [
    { value: "", label: "Relate (all clubs)" },
    { value: "sprout", label: "Sprout" },
    { value: "sprout-kids", label: "Sprout Kids" },
    { value: "sprout-tweens", label: "Sprout Tweens" },
    { value: "sprout-teens", label: "Sprout Teens" },
    { value: "surge", label: "Surge" },
    { value: "pulse", label: "Pulse" },
    { value: "prime", label: "Prime" },
    { value: "anchor", label: "Anchor" },
    { value: "base", label: "Base" },
    { value: "nexus", label: "Nexus" },
];

type PublicationItem = {
    id: string;
    title?: string;
    series?: string;
    clubSlug?: string;
    season?: {label?: string; start?: string; end?: string} | null;
    status?: string;
    updatedAt?: string | number | Date;
};

function displayClub(slug: string | undefined): string {
    if (!slug) return "Relate";
    const found = CLUB_SLUGS.find((c) => c.value === slug);
    return found ? found.label : slug;
}

export default function AdminMagazinesPage() {
    return (
  <section
      className="flex-1 px-4 py-10 md:py-14"
      style={{ background: "linear-gradient(115deg, #f5f8fb 0%, #eff5f9 60%, #f5f8fb 100%)" }}
  >
      <div className="max-w-5xl mx-auto">
          <MagazinesBody />
      </div>
  </section>
    );
}

async function fetchPublications(): Promise<PublicationItem[]> {
    const res = await fetch("/api/admin/publications");
    const json = await res.json();
    if (!res.ok) {
        throw new Error(typeof json?.error === "string" ? json.error : "Couldn't load publications.");
    }
    return Array.isArray(json?.data) ? (json.data as PublicationItem[]) : [];
}

function MagazinesBody() {
    const [rows, setRows] = useState<Row[] | null>(null);
    const [filter, setFilter] = useState<"" | "published" | "draft">("");
    const [busy, setBusy] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [creating, setCreating] = useState(false);

    const toRows = (items: PublicationItem[]): Row[] =>
        items.map((p) => ({
            id: p.id,
            title: p.title || p.id,
            series: p.series || "",
            clubName: displayClub(p.clubSlug),
            seasonLabel:
                p.season?.label || (p.season?.start && p.season?.end ? `${p.season.start} → ${p.season.end}` : ""),
            status: p.status === "published" ? "published" : "draft",
            updated: p.updatedAt ? new Date(p.updatedAt).toLocaleDateString(undefined, {month: "short", day: "numeric", year: "numeric"}) : "",
        }));

    const load = async () => {
        try {
            setRows(toRows(await fetchPublications()));
        } catch (e) {
            setError(e instanceof Error ? e.message : "Couldn't reach the API. Is the backend up?");
            setRows([]);
        }
    };

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const items = await fetchPublications();
                if (cancelled) return;
                setRows(toRows(items));
            } catch (e) {
                if (cancelled) return;
                setError(e instanceof Error ? e.message : "Couldn't reach the API. Is the backend up?");
                setRows([]);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    const visible = filter ? (rows ?? []).filter((r) => r.status === filter) : rows ?? [];

    const setStatus = async (id: string, status: "published" | "draft") => {
        setBusy(id);
        setError("");
        try {
            const res = await fetch(`/api/admin/publications/${id}`, {
                method: "PATCH",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({status}),
            });
            if (!res.ok) {
                const json = await res.json().catch(() => null);
                setError(typeof json?.error === "string" ? json.error : "Update failed.");
                return;
            }
            void load();
        } catch {
            setError("Update failed. Try again.");
        } finally {
            setBusy(null);
        }
    };

    const remove = async (row: Row) => {
        if (!window.confirm(`Delete "${row.title}"? This cannot be undone.`)) return;
        setBusy(row.id);
        setError("");
        try {
            const res = await fetch(`/api/admin/publications/${row.id}`, {method: "DELETE"});
            if (!res.ok) {
                const json = await res.json().catch(() => null);
                setError(typeof json?.error === "string" ? json.error : "Delete failed.");
                return;
            }
            void load();
        } catch {
            setError("Delete failed. Try again.");
        } finally {
            setBusy(null);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl p-5 md:p-7">
            <AdminHeader
                eyebrow="Library"
                title="Season Guides"
                sub="Drafts and published issues, newest first."
                actions={
                    <>
                        <Select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)}>
                            <option value="">All statuses</option>
                            <option value="published">Published</option>
                            <option value="draft">Drafts</option>
                        </Select>
                        <Button onClick={() => setCreating(true)}>
                            <LuPlus /> New season guide
                        </Button>
                    </>
                }
            />

            {error && <p className="mb-4 rounded-lg bg-red-50 text-red-600 text-sm px-4 py-2.5">{error}</p>}

            <div className="overflow-x-auto rounded-2xl border border-gray-100">
                <table className="w-full min-w-[640px] text-left text-sm">
                    <thead>
                        <tr className="border-b border-gray-100 text-[11px] uppercase tracking-widest text-slate-gray bg-alice-blue/60">
                            <th className="px-4 py-3 font-semibold">Publication</th>
                            <th className="px-4 py-3 font-semibold">Club</th>
                            <th className="hidden px-4 py-3 font-semibold md:table-cell">Season</th>
                            <th className="px-4 py-3 font-semibold">Status</th>
                            <th className="px-4 py-3 text-right font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visible.map((row) => (
                            <tr key={row.id} className="border-b border-gray-50 last:border-0 hover:bg-alice-blue/40 transition-colors">
                                <td className="px-4 py-3.5">
                                    <Link href={`/admin/magazines/${encodeURIComponent(row.id)}`} className="group">
                                        <span className="font-semibold text-navy transition group-hover:text-cyan">{row.title}</span>
                                        <div className="text-xs text-slate-gray">
                                            {[row.series, row.id].filter(Boolean).join(" · ")}
                                        </div>
                                    </Link>
                                </td>
                                <td className="px-4 py-3.5 text-gray-600">{row.clubName}</td>
                                <td className="hidden px-4 py-3.5 text-gray-500 md:table-cell">{row.seasonLabel || "—"}</td>
                                <td className="px-4 py-3.5">
                                    <Badge tone={row.status === "published" ? "gold" : "amber"}>
                                        {row.status === "published" ? "Published" : "Draft"}
                                    </Badge>
                                </td>
                                <td className="px-4 py-3.5">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            href={`/admin/magazines/${encodeURIComponent(row.id)}`}
                                            className="rounded-lg bg-alice-blue px-2.5 py-1.5 text-xs font-semibold text-navy transition hover:bg-sky-100"
                                        >
                                            <LuPencil className="mr-1 inline" /> Edit
                                        </Link>
                                        <button
                                            onClick={() => setStatus(row.id, row.status === "published" ? "draft" : "published")}
                                            disabled={busy === row.id}
                                            className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${
                                                row.status === "published"
                                                    ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                                                    : "bg-gold-100 text-gold-800 hover:bg-gold-200"
                                            }`}
                                        >
                                            {row.status === "published" ? "Unpublish" : "Publish"}
                                        </button>
                                        <button
                                            onClick={() => remove(row)}
                                            disabled={busy === row.id}
                                            className="rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {visible.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-gray">
                                    {rows === null ? "Loading…" : "No season guides in this view. Adjust the filter or create one."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {creating && (
                <NewMagazineModal
                    onDone={(created) => {
                        setCreating(false);
                        if (created) void load();
                    }}
                />
            )}

            <p className="mt-4 text-xs text-gray-400">
                Creating a season guide here makes a draft. Add its reading plan from the API before publishing.
            </p>
        </div>
    );
}

function NewMagazineModal({onDone}: {onDone: (created: boolean) => void}) {
    const [id, setId] = useState("");
    const [series, setSeries] = useState("");
    const [title, setTitle] = useState("");
    const [clubSlug, setClubSlug] = useState("");
    const [seasonName, setSeasonName] = useState("");
    const [seasonStart, setSeasonStart] = useState("");
    const [seasonEnd, setSeasonEnd] = useState("");
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (busy) return;
        setBusy(true);
        setError("");
        try {
            const slug = id.trim().toLowerCase();
            if (!slug) {
                setError("A slug id is required (e.g. footsteps-spring-2026).");
                setBusy(false);
                return;
            }
            const payload: Record<string, unknown> = {
                id: slug,
                kind: "magazine",
                series: series.trim() || undefined,
                title: title.trim() || series.trim() || slug,
                clubSlug: clubSlug.trim() || undefined,
                status: "draft",
            };
            if (seasonName.trim() && seasonStart && seasonEnd && seasonEnd >= seasonStart) {
                payload.season = {
                    name: seasonName.trim(),
                    start: seasonStart,
                    end: seasonEnd,
                    label: `${seasonName.trim()} · ${seasonStart} – ${seasonEnd}`,
                };
            }
            const res = await fetch("/api/admin/publications", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(payload),
            });
            const json = await res.json().catch(() => null);
            if (!res.ok) {
                setError(typeof json?.error === "string" ? json.error : "Couldn't create the season guide.");
                return;
            }
            onDone(true);
        } catch {
            setError("Couldn't create the season guide. Try again.");
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 p-4">
            <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-navy">New season guide</h3>
                    <button onClick={() => onDone(false)} aria-label="Close" className="text-gray-400 hover:text-gray-600">
                        <LuX />
                    </button>
                </div>
                <form onSubmit={submit} className="grid gap-4">
                    <Field label="Slug id" hint="Lowercase letters, numbers and dashes. e.g. anchored-spring-2026">
                        <Input value={id} onChange={(e) => setId(e.target.value)} placeholder="e.g. anchored-spring-2026" />
                    </Field>
                    <Field label="Series">
                        <Input value={series} onChange={(e) => setSeries(e.target.value)} placeholder="e.g. Rooted" />
                    </Field>
                    <Field label="Title (optional, defaults to series)">
                        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Rooted — Spring 2026" />
                    </Field>
                    <Field label="Club">
                        <Select value={clubSlug} onChange={(e) => setClubSlug(e.target.value)}>
                            {CLUB_SLUGS.map((c) => (
                                <option key={c.value} value={c.value}>{c.label}</option>
                            ))}
                        </Select>
                    </Field>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <Field label="Season name">
                            <Input value={seasonName} onChange={(e) => setSeasonName(e.target.value)} placeholder="e.g. Spring 2026" />
                        </Field>
                        <Field label="Start date">
                            <Input type="date" value={seasonStart} onChange={(e) => setSeasonStart(e.target.value)} />
                        </Field>
                        <Field label="End date">
                            <Input type="date" value={seasonEnd} onChange={(e) => setSeasonEnd(e.target.value)} />
                        </Field>
                    </div>
                    {error && <p className="rounded-lg bg-red-50 text-red-600 text-sm px-4 py-2.5">{error}</p>}
                    <div className="flex items-center justify-end gap-2">
                        <Button type="button" variant="ghost" onClick={() => onDone(false)}>Cancel</Button>
                        <Button type="submit" disabled={busy}>{busy ? "Creating…" : "Create draft"}</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}