"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    LuCalendarDays,
    LuMegaphone,
    LuPencil,
    LuPlus,
    LuSave,
    LuTrash2,
    LuX,
} from "react-icons/lu";
import { AdminHeader, Badge, Button, Field, Input, Select, TextArea } from "@/components/admin/ui";
import { useClubs } from "@/lib/useClubs";

type AgendaRow = {
    time: string;
    title: string;
    description: string;
};

type EventRow = {
    _id: string;
    title: string;
    date: string;
    time?: string;
    dateTo?: string;
    timeTo?: string;
    location?: string;
    fee?: string;
    description?: string;
    notes?: string;
    imageUrl?: string | null;
    author?: string;
    category?: string;
    eyebrow?: string;
    titleAccent?: string;
    host?: string;
    capacity?: number;
    clubSlug?: string;
    tags?: string[];
    agenda?: AgendaRow[];
    attending?: number;
    createdAt?: string;
};

type Draft = {
    title: string;
    clubSlug: string;
    date: string;
    time: string;
    dateTo: string;
    timeTo: string;
    location: string;
    fee: string;
    capacity: string;
    category: string;
    eyebrow: string;
    titleAccent: string;
    author: string;
    host: string;
    imageUrl: string;
    description: string;
    notes: string;
    tags: string;
    agenda: AgendaRow[];
};

const blankAgendaRow = (): AgendaRow => ({ time: "", title: "", description: "" });

const blankDraft = (): Draft => ({
    title: "",
    clubSlug: "",
    date: "",
    time: "",
    dateTo: "",
    timeTo: "",
    location: "",
    fee: "Free",
    capacity: "",
    category: "",
    eyebrow: "",
    titleAccent: "",
    author: "",
    host: "",
    imageUrl: "",
    description: "",
    notes: "",
    tags: "",
    agenda: [],
});

const toDraft = (e: EventRow): Draft => ({
    title: e.title ?? "",
    clubSlug: e.clubSlug ?? "",
    date: (e.date ?? "").slice(0, 10),
    time: e.time ?? "",
    dateTo: e.dateTo ? e.dateTo.slice(0, 10) : "",
    timeTo: e.timeTo ?? "",
    location: e.location ?? "",
    fee: e.fee || "Free",
    capacity: e.capacity != null ? String(e.capacity) : "",
    category: e.category ?? "",
    eyebrow: e.eyebrow ?? "",
    titleAccent: e.titleAccent ?? "",
    author: e.author ?? "",
    host: e.host ?? "",
    imageUrl: e.imageUrl ?? "",
    description: e.description ?? "",
    notes: e.notes ?? "",
    tags: (e.tags ?? []).join(", "),
    agenda: (e.agenda ?? []).map((a) => ({
        time: a.time ?? "",
        title: a.title ?? "",
        description: a.description ?? "",
    })),
});

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const todayKey = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

/** "2026-10-07" → "Wed 7 Oct"; falls back to the raw string. */
const shortDate = (iso: string) => {
    const key = iso.slice(0, 10);
    const [y, m, d] = key.split("-").map((n) => parseInt(n, 10));
    if (!y || !m || !d) return key;
    return `${d} ${MONTHS[m - 1]}${y !== new Date().getFullYear() ? ` ${y}` : ""}`;
};

export default function AdminEventsPage() {
    return <EventsBody />;
}

function EventsBody() {
    const { allClubs, find, loading: clubsLoading } = useClubs();
    const [events, setEvents] = useState<EventRow[] | null>(null);
    const [editing, setEditing] = useState<{ key: string; label: string } | null>(null);
    const [draft, setDraft] = useState<Draft>(blankDraft);
    const [error, setError] = useState("");
    const [banner, setBanner] = useState("");
    const [busy, setBusy] = useState(false);

    const [search, setSearch] = useState("");
    const [clubFilter, setClubFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "upcoming" | "past">("all");

    const load = useCallback(async () => {
        try {
            const res = await fetch("/api/community/events", { cache: "no-store" });
            const json = await res.json().catch(() => null);
            if (!res.ok) {
                setError(typeof json?.error === "string" ? json.error : "Couldn't load events.");
                setEvents([]);
                return;
            }
            setError("");
            setEvents(Array.isArray(json?.data) ? json.data : []);
        } catch {
            setError("Couldn't reach the API. Is the backend up?");
            setEvents([]);
        }
    }, []);

    useEffect(() => {
        (async () => {
            await load();
        })();
    }, [load]);

    const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
        setDraft((prev) => ({ ...prev, [key]: value }));

    const startCreate = () => {
        setEditing({ key: "new", label: "New event" });
        setDraft(blankDraft());
        setError("");
        setBanner("");
    };

    const startEdit = (e: EventRow) => {
        setEditing({ key: e._id, label: `Edit ${e.title}` });
        setDraft(toDraft(e));
        setError("");
        setBanner("");
    };

    const save = async () => {
        if (!draft.title.trim()) return setError("A title is required.");
        if (!draft.clubSlug) return setError("Choose the club this event belongs to.");
        if (!draft.date) return setError("A start date is required.");
        if (draft.dateTo && draft.dateTo < draft.date) {
            return setError("The end date can't be before the start date.");
        }

        setBusy(true);
        setError("");
        try {
            const isNew = editing?.key === "new";
            const payload = {
                title: draft.title.trim(),
                description: draft.description.trim(),
                date: draft.date,
                time: draft.time.trim(),
                dateTo: draft.dateTo || undefined,
                timeTo: draft.timeTo.trim() || undefined,
                agenda: draft.agenda
                    .filter((a) => a.title.trim() || a.time.trim())
                    .map((a) => ({
                        time: a.time.trim(),
                        title: a.title.trim(),
                        description: a.description.trim(),
                    })),
                notes: draft.notes.trim() || undefined,
                location: draft.location.trim(),
                fee: draft.fee.trim() || "Free",
                clubSlug: draft.clubSlug,
                imageUrl: draft.imageUrl.trim() || null,
                author: draft.author.trim() || "Admin",
                category: draft.category.trim() || undefined,
                eyebrow: draft.eyebrow.trim() || undefined,
                titleAccent: draft.titleAccent.trim() || undefined,
                host: draft.host.trim() || undefined,
                capacity: draft.capacity ? parseInt(draft.capacity, 10) || undefined : undefined,
                tags: draft.tags
                    .split(",")
                    .map((t) => t.trim().toUpperCase())
                    .filter(Boolean),
            };
            const res = await fetch("/api/community/events", {
                method: isNew ? "POST" : "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(isNew ? payload : { _id: editing?.key, ...payload }),
            });
            const json = await res.json().catch(() => null);
            if (!res.ok) {
                setError(typeof json?.error === "string" ? json.error : "Couldn't save this event.");
                return;
            }
            setBanner(isNew ? "Event created — it's live on club pages and the events hub." : "Event updated.");
            setEditing(null);
            await load();
        } catch {
            setError("Couldn't save this event.");
        } finally {
            setBusy(false);
        }
    };

    const remove = async (e: EventRow) => {
        if (!window.confirm(`Delete "${e.title}"? RSVPs and payments for it go too.`)) return;
        setBusy(true);
        try {
            const res = await fetch("/api/community/events", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ _id: e._id }),
            });
            if (!res.ok) {
                const json = await res.json().catch(() => null);
                setError(typeof json?.error === "string" ? json.error : "Couldn't delete this event.");
                return;
            }
            if (editing?.key === e._id) setEditing(null);
            setBanner("Event deleted.");
            await load();
        } catch {
            setError("Couldn't delete this event.");
        } finally {
            setBusy(false);
        }
    };

    const visible = useMemo(() => {
        const today = todayKey();
        const needle = search.trim().toLowerCase();
        return (events ?? [])
            .filter((e) => {
                const key = (e.date ?? "").slice(0, 10);
                if (statusFilter === "upcoming" && key < today) return false;
                if (statusFilter === "past" && (!key || key >= today)) return false;
                if (clubFilter && e.clubSlug !== clubFilter) return false;
                if (needle) {
                    const hay = `${e.title ?? ""} ${e.location ?? ""} ${e.category ?? ""}`.toLowerCase();
                    if (!hay.includes(needle)) return false;
                }
                return true;
            })
            .sort((a, b) => {
                const ak = (a.date ?? "").slice(0, 10);
                const bk = (b.date ?? "").slice(0, 10);
                const aPast = ak < today;
                const bPast = bk < today;
                if (aPast !== bPast) return aPast ? 1 : -1;
                return aPast ? bk.localeCompare(ak) : ak.localeCompare(bk);
            });
    }, [events, search, clubFilter, statusFilter]);

    const setAgenda = (index: number, patch: Partial<AgendaRow>) =>
        setDraft((prev) => ({
            ...prev,
            agenda: prev.agenda.map((row, i) => (i === index ? { ...row, ...patch } : row)),
        }));

    return (
        <div>
            <AdminHeader
                eyebrow="Community"
                title="Events"
                sub="Every event shown on club pages, in the community feeds and on the events hub. Changes go live immediately."
                actions={
                    <Button onClick={startCreate}>
                        <LuPlus/> New event
                    </Button>
                }
            />

            {banner ? (
                <p className="mb-4 rounded-lg bg-gold-50 px-4 py-2.5 text-sm text-gold-700">{banner}</p>
            ) : null}
            {error && !editing ? (
                <p className="mb-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
            ) : null}

            {editing ? (
                <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <h2 className="text-lg font-black text-navy">{editing.label}</h2>
                        <Button variant="ghost" onClick={() => setEditing(null)}>
                            <LuX/> Cancel
                        </Button>
                    </div>

                    {error ? (
                        <p className="mb-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
                    ) : null}

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <Field label="Title">
                                <Input
                                    value={draft.title}
                                    onChange={(e) => set("title", e.target.value)}
                                    placeholder="Ridge Hike"
                                />
                            </Field>
                        </div>
                        <Field label="Club" hint="Required — events live inside a club.">
                            <Select value={draft.clubSlug} onChange={(e) => set("clubSlug", e.target.value)}>
                                <option value="">Choose a club…</option>
                                {allClubs.map((c) => (
                                    <option key={c.slug} value={c.slug}>
                                        {c.name}
                                    </option>
                                ))}
                            </Select>
                        </Field>
                        <Field label="Category" hint="Short chip, e.g. HIKING.">
                            <Input value={draft.category} onChange={(e) => set("category", e.target.value)}/>
                        </Field>
                        <Field label="Start date">
                            <Input type="date" value={draft.date} onChange={(e) => set("date", e.target.value)}/>
                        </Field>
                        <Field label="Start time" hint="e.g. 6:30 PM">
                            <Input value={draft.time} onChange={(e) => set("time", e.target.value)}/>
                        </Field>
                        <Field label="End date" hint="Optional — for multi-day events.">
                            <Input type="date" value={draft.dateTo} onChange={(e) => set("dateTo", e.target.value)}/>
                        </Field>
                        <Field label="End time">
                            <Input value={draft.timeTo} onChange={(e) => set("timeTo", e.target.value)}/>
                        </Field>
                        <Field label="Location">
                            <Input
                                value={draft.location}
                                onChange={(e) => set("location", e.target.value)}
                                placeholder="Jonsson Park, gate 2"
                            />
                        </Field>
                        <Field label="Fee" hint='Text as shown to members — "Free" or "R120".'>
                            <Input value={draft.fee} onChange={(e) => set("fee", e.target.value)}/>
                        </Field>
                        <Field label="Capacity" hint="Optional seat limit.">
                            <Input
                                type="number"
                                min={0}
                                value={draft.capacity}
                                onChange={(e) => set("capacity", e.target.value)}
                            />
                        </Field>
                        <Field label="Host">
                            <Input value={draft.host} onChange={(e) => set("host", e.target.value)}/>
                        </Field>
                        <Field label="Eyebrow" hint="Optional small label above the title.">
                            <Input value={draft.eyebrow} onChange={(e) => set("eyebrow", e.target.value)}/>
                        </Field>
                        <Field label="Title accent" hint="Optional emphasised part of the title.">
                            <Input
                                value={draft.titleAccent}
                                onChange={(e) => set("titleAccent", e.target.value)}
                            />
                        </Field>
                        <Field label="Author">
                            <Input value={draft.author} onChange={(e) => set("author", e.target.value)}/>
                        </Field>
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div>
                            <Field label="Cover image URL" hint="Absolute https:// link.">
                                <Input
                                    value={draft.imageUrl}
                                    onChange={(e) => set("imageUrl", e.target.value)}
                                    placeholder="https://…"
                                />
                            </Field>
                            {draft.imageUrl ? (
                                <div className="mt-2 h-28 w-full overflow-hidden rounded-xl bg-alice-blue">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={draft.imageUrl}
                                        alt=""
                                        className="h-full w-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.style.display = "none";
                                        }}
                                    />
                                </div>
                            ) : null}
                        </div>
                        <Field label="Tags" hint="Comma separated, e.g. KIDS, OUTDOOR">
                            <Input value={draft.tags} onChange={(e) => set("tags", e.target.value)}/>
                        </Field>
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <Field label="Description">
                            <TextArea
                                value={draft.description}
                                onChange={(e) => set("description", e.target.value)}
                                className="min-h-[120px]"
                            />
                        </Field>
                        <Field label="Notes" hint="What to bring, packing list, etc.">
                            <TextArea
                                value={draft.notes}
                                onChange={(e) => set("notes", e.target.value)}
                                className="min-h-[120px]"
                            />
                        </Field>
                    </div>

                    <div className="mt-4">
                        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-slate-gray">
                            Agenda
                        </p>
                        <div className="grid gap-2">
                            {draft.agenda.map((row, i) => (
                                <div key={i} className="rounded-xl border border-gray-100 bg-alice-blue/40 p-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-28 shrink-0">
                                            <Input
                                                value={row.time}
                                                onChange={(e) => setAgenda(i, { time: e.target.value })}
                                                placeholder="10:00 AM"
                                            />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <Input
                                                value={row.title}
                                                onChange={(e) => setAgenda(i, { title: e.target.value })}
                                                placeholder="Welcome & icebreakers"
                                            />
                                        </div>
                                        <Button
                                            variant="ghost"
                                            className="px-3"
                                            aria-label="Remove agenda row"
                                            onClick={() =>
                                                setDraft((prev) => ({
                                                    ...prev,
                                                    agenda: prev.agenda.filter((_, idx) => idx !== i),
                                                }))
                                            }
                                        >
                                            <LuX/>
                                        </Button>
                                    </div>
                                    <div className="mt-2">
                                        <Input
                                            value={row.description}
                                            onChange={(e) => setAgenda(i, { description: e.target.value })}
                                            placeholder="What happens (optional)"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button
                            variant="ghost"
                            className="mt-2"
                            onClick={() => setDraft((prev) => ({ ...prev, agenda: [...prev.agenda, blankAgendaRow()] }))}
                        >
                            <LuPlus/> Add agenda row
                        </Button>
                    </div>

                    <div className="mt-5 flex gap-2">
                        <Button onClick={save} disabled={busy}>
                            <LuSave/> {busy ? "Saving…" : editing.key === "new" ? "Create event" : "Save changes"}
                        </Button>
                        <Button variant="ghost" onClick={() => setEditing(null)} disabled={busy}>
                            Cancel
                        </Button>
                    </div>
                </div>
            ) : null}

            {/* Filters */}
            <div className="mb-4 grid gap-3 sm:grid-cols-3">
                <Field label="Search">
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Title, location or category…"
                    />
                </Field>
                <Field label="Club">
                    <Select value={clubFilter} onChange={(e) => setClubFilter(e.target.value)}>
                        <option value="">All clubs</option>
                        {allClubs.map((c) => (
                            <option key={c.slug} value={c.slug}>
                                {c.name}
                            </option>
                        ))}
                    </Select>
                </Field>
                <Field label="When">
                    <Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as "all" | "upcoming" | "past")}
                    >
                        <option value="all">All events</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="past">Past</option>
                    </Select>
                </Field>
            </div>

            {events === null || clubsLoading ? (
                <p className="rounded-2xl border border-dashed border-gray-300 bg-alice-blue/40 py-12 text-center text-sm text-slate-gray">
                    Loading events…
                </p>
            ) : visible.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-alice-blue/40 py-12 text-center">
                    <LuCalendarDays className="mx-auto mb-2 text-2xl text-slate-gray"/>
                    <p className="text-sm text-slate-gray">
                        {events.length === 0
                            ? "No events yet. Create the first one — it appears on its club page right away."
                            : "No events match these filters."}
                    </p>
                </div>
            ) : (
                <div className="grid gap-3">
                    {visible.map((e) => {
                        const key = (e.date ?? "").slice(0, 10);
                        const past = key < todayKey();
                        const club = e.clubSlug ? find(e.clubSlug)?.name ?? e.clubSlug : "";
                        return (
                            <div
                                key={e._id}
                                className="flex flex-wrap items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                            >
                                <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center overflow-hidden rounded-xl bg-navy text-white">
                                    <span className="text-[10px] font-semibold uppercase tracking-widest text-cyan">
                                        {MONTHS[parseInt(key.slice(5, 7), 10) - 1] ?? ""}
                                    </span>
                                    <span className="text-xl font-black leading-none">
                                        {key.slice(8, 10) || "–"}
                                    </span>
                                </div>
                                <div className="min-w-[12rem] flex-1">
                                    <p className="font-semibold text-navy">{e.title}</p>
                                    <p className="mt-0.5 text-xs text-slate-gray">
                                        {shortDate(e.date ?? "")}
                                        {e.time ? ` · ${e.time}` : ""}
                                        {e.timeTo ? ` – ${e.timeTo}` : ""}
                                        {e.location ? ` · ${e.location}` : ""}
                                    </p>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    {club ? <Badge tone="sky">{club}</Badge> : null}
                                    {e.category ? <Badge tone="slate">{e.category}</Badge> : null}
                                    <Badge tone={e.fee && e.fee !== "Free" ? "gold" : "slate"}>
                                        {e.fee || "Free"}
                                    </Badge>
                                    {e.capacity != null ? (
                                        <Badge tone="amber">
                                            {e.attending ?? 0}/{e.capacity} going
                                        </Badge>
                                    ) : (e.attending ?? 0) > 0 ? (
                                        <Badge tone="slate">{e.attending} going</Badge>
                                    ) : null}
                                    {past ? <Badge tone="slate">Past</Badge> : null}
                                    <Button variant="ghost" onClick={() => startEdit(e)}>
                                        <LuPencil/> Edit
                                    </Button>
                                    <Button variant="danger" onClick={() => remove(e)} disabled={busy}>
                                        <LuTrash2/> Delete
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <p className="mt-6 flex items-start gap-2 rounded-xl bg-alice-blue/60 px-4 py-3 text-xs text-slate-gray">
                <LuMegaphone className="mt-0.5 shrink-0"/>
                Events are shared with the mobile app — new and edited events show up within about 30 seconds.
                <Link href="/events" className="ml-auto shrink-0 font-semibold text-navy underline">
                    Open the events hub
                </Link>
            </p>
        </div>
    );
}
