"use client";

import {useCallback, useEffect, useMemo, useState} from "react";
import {
    LuBriefcase,
    LuBug,
    LuCheck,
    LuExternalLink,
    LuInbox,
    LuPalette,
    LuPlus,
    LuRefreshCw,
    LuSearch,
    LuWrench,
    LuX,
} from "react-icons/lu";
import {AdminHeader, Badge, Button, Field, Select, TextArea, Input} from "@/components/admin/ui";
import {useClubs} from "@/lib/useClubs";

type ServiceType = "bug" | "design" | "other";
type ServiceStatus = "open" | "accepted" | "submitted" | "approved" | "closed";
type Filter = ServiceStatus | "all";

type Submission = {
    note: string;
    githubLink: string | null;
    imageUrl: string | null;
    submittedAt: string;
};

type Review = {
    approved: boolean;
    note: string | null;
    reviewedAt: string;
};

type ClubService = {
    _id: string;
    title: string;
    description: string;
    type: ServiceType;
    clubSlug: string | null;
    posterName: string;
    status: ServiceStatus;
    acceptedByName: string | null;
    acceptedAt: string | null;
    submission: Submission | null;
    review: Review | null;
    createdAt: string;
};

const TYPE_META: Record<ServiceType, {label: string; icon: typeof LuBug}> = {
    bug: {label: "Bug fix", icon: LuBug},
    design: {label: "Design", icon: LuPalette},
    other: {label: "Task", icon: LuWrench},
};

const STATUS_LABEL: Record<ServiceStatus, string> = {
    open: "Open",
    accepted: "In progress",
    submitted: "In review",
    approved: "Approved",
    closed: "Closed",
};

const STATUS_TONE: Record<ServiceStatus, "gold" | "amber" | "slate" | "sky"> = {
    open: "sky",
    accepted: "slate",
    submitted: "amber",
    approved: "gold",
    closed: "slate",
};

function dateText(value?: string | null): string {
    if (!value) return "—";
    const d = new Date(value);
    return Number.isNaN(d.getTime())
        ? "—"
        : d.toLocaleDateString(undefined, {month: "short", day: "numeric", year: "numeric"});
}

export default function AdminServicesPage() {
    const {allClubs, loading: clubsLoading} = useClubs();
    const [services, setServices] = useState<ClubService[] | null>(null);
    const [filter, setFilter] = useState<Filter>("submitted");
    const [query, setQuery] = useState("");
    const [busy, setBusy] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [banner, setBanner] = useState("");
    const [notes, setNotes] = useState<Record<string, string>>({});

    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState<{title: string; description: string; type: ServiceType; clubSlug: string}>({
        title: "",
        description: "",
        type: "bug",
        clubSlug: "",
    });
    const [saving, setSaving] = useState(false);

    const load = useCallback(async (status: Filter) => {
        try {
            const qs = status === "all" ? "" : `?status=${status}`;
            const res = await fetch(`/api/community/services${qs}`, {cache: "no-store"});
            const json = await res.json().catch(() => null);
            if (!res.ok) {
                setError(typeof json?.error === "string" ? json.error : "Couldn't load services.");
                setServices([]);
                return;
            }
            setError("");
            setServices(Array.isArray(json?.data) ? json.data : []);
        } catch {
            setError("Couldn't reach the API. Is the backend up?");
            setServices([]);
        }
    }, []);

    useEffect(() => {
        (async () => {
            await load(filter);
        })();
    }, [filter, load]);

    const visible = useMemo(() => {
        if (!services) return null;
        const q = query.trim().toLowerCase();
        if (!q) return services;
        return services.filter((s) =>
            [s.title, s.description, s.posterName, s.acceptedByName]
                .filter(Boolean)
                .some((field) => String(field).toLowerCase().includes(q)),
        );
    }, [services, query]);

    const patch = async (id: string, body: Record<string, unknown>, success?: string) => {
        setBusy(id);
        setError("");
        setBanner("");
        try {
            const res = await fetch(`/api/community/services/${id}`, {
                method: "PATCH",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body),
            });
            const json = await res.json().catch(() => null);
            if (!res.ok) {
                setError(typeof json?.error === "string" ? json.error : "Couldn't update this service.");
                return;
            }
            if (success) setBanner(success);
            await load(filter);
        } catch {
            setError("Update failed. Try again.");
        } finally {
            setBusy(null);
        }
    };

    const createService = async () => {
        if (!form.title.trim() || !form.description.trim()) {
            setError("A title and description are required.");
            return;
        }
        setSaving(true);
        setError("");
        setBanner("");
        try {
            const res = await fetch("/api/community/services", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    title: form.title.trim(),
                    description: form.description.trim(),
                    type: form.type,
                    clubSlug: form.clubSlug || null,
                }),
            });
            const json = await res.json().catch(() => null);
            if (!res.ok) {
                setError(typeof json?.error === "string" ? json.error : "Couldn't post the service.");
                return;
            }
            setBanner(`"${form.title.trim()}" is live — every member has been notified.`);
            setForm({title: "", description: "", type: "bug", clubSlug: ""});
            setShowForm(false);
            setFilter("open");
        } catch {
            setError("Posting failed. Try again.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <AdminHeader
                eyebrow="Marketplace"
                title="Services"
                sub="Post tasks and design work for members to claim, then review what they deliver. Every post notifies all members."
                actions={
                    <Button variant="accent" onClick={() => setShowForm((v) => !v)}>
                        <LuPlus/> {showForm ? "Close form" : "Post a service"}
                    </Button>
                }
            />

            {banner ? (
                <p className="mb-4 rounded-lg bg-gold-50 px-4 py-2.5 text-sm text-gold-700">{banner}</p>
            ) : null}
            {error ? (
                <p className="mb-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
            ) : null}

            {showForm ? (
                <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-slate-gray">
                        New service
                    </p>
                    <div className="grid gap-4 md:grid-cols-2">
                        <Field label="Title">
                            <Input
                                value={form.title}
                                onChange={(e) => setForm((f) => ({...f, title: e.target.value}))}
                                placeholder="e.g. Fix the event payment bug"
                            />
                        </Field>
                        <Field label="Type">
                            <Select
                                value={form.type}
                                onChange={(e) => setForm((f) => ({...f, type: e.target.value as ServiceType}))}
                            >
                                <option value="bug">Bug fix — needs a GitHub link</option>
                                <option value="design">Design — needs an image</option>
                                <option value="other">Task — link or image</option>
                            </Select>
                        </Field>
                    </div>
                    <Field label="What needs doing?">
                        <TextArea
                            value={form.description}
                            onChange={(e) => setForm((f) => ({...f, description: e.target.value}))}
                            rows={4}
                            placeholder="Describe the work, useful links or context, and what done looks like."
                        />
                    </Field>
                    <Field label="Club (optional)" hint="Leave as All members to show it to everyone.">
                        <Select value={form.clubSlug} onChange={(e) => setForm((f) => ({...f, clubSlug: e.target.value}))}>
                            <option value="">All members</option>
                            {allClubs.map((c) => (
                                <option key={c.slug} value={c.slug}>
                                    {c.name}
                                </option>
                            ))}
                        </Select>
                    </Field>
                    <div className="mt-2 flex gap-2">
                        <Button variant="accent" disabled={saving} onClick={createService}>
                            {saving ? "Posting…" : "Post service"}
                        </Button>
                        <Button variant="ghost" onClick={() => setShowForm(false)}>
                            Cancel
                        </Button>
                    </div>
                </div>
            ) : null}

            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end">
                <Field label="Status">
                    <Select value={filter} onChange={(e) => setFilter(e.target.value as Filter)}>
                        <option value="submitted">In review</option>
                        <option value="open">Open</option>
                        <option value="accepted">In progress</option>
                        <option value="approved">Approved</option>
                        <option value="closed">Closed</option>
                        <option value="all">All</option>
                    </Select>
                </Field>
                <div className="flex-1">
                    <Field label="Search">
                        <div className="relative">
                            <LuSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Title, description or member…"
                                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-base text-gray-800 shadow-sm outline-none transition focus:border-cyan focus:ring-2 focus:ring-cyan/20 md:text-sm"
                            />
                        </div>
                    </Field>
                </div>
            </div>

            {visible === null ? (
                <p className="rounded-2xl border border-dashed border-gray-300 bg-alice-blue/40 py-12 text-center text-sm text-slate-gray">
                    Loading services…
                </p>
            ) : visible.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-alice-blue/40 py-12 text-center">
                    <LuInbox className="mx-auto mb-2 text-2xl text-slate-gray"/>
                    <p className="text-sm text-slate-gray">
                        {query
                            ? "No services match that search."
                            : filter === "submitted"
                              ? "Nothing is waiting for review."
                              : `No ${filter === "all" ? "" : STATUS_LABEL[filter as ServiceStatus].toLowerCase() + " "}services.`}
                    </p>
                </div>
            ) : (
                <div className="grid gap-3">
                    {visible.map((s) => {
                        const TypeIcon = TYPE_META[s.type]?.icon ?? LuWrench;
                        const typeLabel = TYPE_META[s.type]?.label ?? s.type;
                        const note = notes[s._id] ?? "";
                        const club = s.clubSlug ? allClubs.find((c) => c.slug === s.clubSlug) : null;
                        return (
                            <div key={s._id} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:p-5">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-alice-blue px-2.5 py-0.5 text-xs font-semibold text-navy">
                                                <TypeIcon/> {typeLabel}
                                            </span>
                                            {club ? (
                                                <span className="rounded-full bg-cyan/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-dark">
                                                    {club.name}
                                                </span>
                                            ) : null}
                                            <Badge tone={STATUS_TONE[s.status] ?? "slate"}>
                                                {STATUS_LABEL[s.status] ?? s.status}
                                            </Badge>
                                        </div>
                                        <p className="mt-2 font-semibold text-navy">{s.title}</p>
                                        <p className="mt-0.5 text-xs text-slate-gray">
                                            {s.posterName} · posted {dateText(s.createdAt)}
                                            {s.acceptedByName
                                                ? ` · claimed by ${s.acceptedByName}${s.acceptedAt ? ` (${dateText(s.acceptedAt)})` : ""}`
                                                : ""}
                                        </p>
                                    </div>
                                </div>

                                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-gray-700">
                                    {s.description}
                                </p>

                                {s.submission ? (
                                    <div className="mt-3 rounded-xl bg-alice-blue/50 p-3.5">
                                        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-gray">
                                            Submitted {dateText(s.submission.submittedAt)}
                                        </p>
                                        <p className="mt-1.5 whitespace-pre-line text-sm text-gray-700">
                                            {s.submission.note}
                                        </p>
                                        <div className="mt-2 flex flex-wrap items-center gap-3">
                                            {s.submission.githubLink ? (
                                                <a
                                                    href={s.submission.githubLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-dark hover:underline"
                                                >
                                                    <LuExternalLink/> Open GitHub link
                                                </a>
                                            ) : null}
                                            {s.submission.imageUrl ? (
                                                <a
                                                    href={s.submission.imageUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm font-semibold text-cyan-dark hover:underline"
                                                >
                                                    View design image →
                                                </a>
                                            ) : null}
                                        </div>
                                    </div>
                                ) : null}

                                {s.review ? (
                                    <p className={`mt-3 text-xs font-semibold ${s.review.approved ? "text-green-700" : "text-orange-700"}`}>
                                        {s.review.approved
                                            ? `Approved ${dateText(s.review.reviewedAt)}`
                                            : `Sent back for changes ${dateText(s.review.reviewedAt)}`}
                                        {s.review.note ? ` — "${s.review.note}"` : ""}
                                    </p>
                                ) : null}

                                <div className="mt-4 border-t border-gray-50 pt-4">
                                    {s.status === "submitted" ? (
                                        <Field label="Note for the member" hint="Optional — included with approve or send-back.">
                                            <TextArea
                                                value={note}
                                                onChange={(e) => setNotes((prev) => ({...prev, [s._id]: e.target.value}))}
                                                rows={2}
                                                placeholder="What looks good, or what needs changing…"
                                            />
                                        </Field>
                                    ) : null}
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {s.status === "submitted" ? (
                                            <>
                                                <Button
                                                    disabled={busy === s._id}
                                                    onClick={() => patch(s._id, {action: "approve", note: note || undefined}, `Approved "${s.title}".`)}
                                                >
                                                    <LuCheck/> Approve work
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    disabled={busy === s._id}
                                                    onClick={() => patch(s._id, {action: "reopen", note: note || undefined}, `Sent "${s.title}" back for changes.`)}
                                                >
                                                    <LuX/> Send back
                                                </Button>
                                            </>
                                        ) : null}
                                        {s.status === "closed" ? (
                                            <Button
                                                variant="ghost"
                                                disabled={busy === s._id}
                                                onClick={() => patch(s._id, {action: "reopen"}, `Reopened "${s.title}".`)}
                                            >
                                                <LuRefreshCw/> Reopen
                                            </Button>
                                        ) : null}
                                        {s.status !== "closed" ? (
                                            <Button
                                                variant="ghost"
                                                disabled={busy === s._id}
                                                onClick={() => {
                                                    if (window.confirm(`Close "${s.title}"? It moves out of the open list.`)) {
                                                        void patch(s._id, {action: "close"}, `Closed "${s.title}".`);
                                                    }
                                                }}
                                            >
                                                Close
                                            </Button>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <p className="mt-6 flex items-center gap-1.5 text-xs text-gray-400">
                <LuBriefcase className="shrink-0"/>
                {clubsLoading ? "Loading clubs…" : "Members claim open services in the app or at /services — one member per service."}
            </p>
        </div>
    );
}
