"use client";

import {useCallback, useEffect, useMemo, useState} from "react";
import {
    LuCheck,
    LuClock,
    LuHandHeart,
    LuInbox,
    LuSearch,
    LuTrash2,
    LuUserCheck,
    LuX,
} from "react-icons/lu";
import {AdminHeader, Badge, Button, Field, Select, TextArea} from "@/components/admin/ui";

type Status = "new" | "reviewing" | "contacted" | "active" | "declined";
type Filter = Status | "all";

type TimelineEntry = {text: string; by?: string; createdAt?: string};

type Volunteer = {
    _id: string;
    name: string;
    email: string;
    phone: string;
    area?: string | null;
    ageGroup?: string | null;
    areas: string[];
    about: string;
    availability?: string | null;
    userId?: string | null;
    status: Status;
    assignedTo?: string | null;
    assignedToName?: string | null;
    adminNote?: string | null;
    updatedCount?: number;
    createdAt?: string;
    timeline?: TimelineEntry[];
};

const STATUS_LABEL: Record<Status, string> = {
    new: "New",
    reviewing: "Reviewing",
    contacted: "Contacted",
    active: "Active",
    declined: "Declined",
};

const STATUS_TONE: Record<Status, "gold" | "amber" | "slate" | "sky"> = {
    new: "amber",
    reviewing: "sky",
    contacted: "sky",
    active: "gold",
    declined: "slate",
};

function dateText(value?: string): string {
    if (!value) return "unknown date";
    const d = new Date(value);
    return Number.isNaN(d.getTime())
        ? "unknown date"
        : d.toLocaleDateString(undefined, {month: "short", day: "numeric", year: "numeric"});
}

function initials(name: string): string {
    return name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

export default function AdminVolunteersPage() {
    const [volunteers, setVolunteers] = useState<Volunteer[] | null>(null);
    const [filter, setFilter] = useState<Filter>("new");
    const [query, setQuery] = useState("");
    const [busy, setBusy] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [notes, setNotes] = useState<Record<string, string>>({});

    const load = useCallback(async (status: Filter) => {
        try {
            const res = await fetch(`/api/admin/volunteers?status=${status}`, {cache: "no-store"});
            const json = await res.json().catch(() => null);
            if (!res.ok) {
                setError(typeof json?.error === "string" ? json.error : "Couldn't load volunteer requests.");
                setVolunteers([]);
                return;
            }
            setError("");
            setVolunteers(Array.isArray(json?.data) ? json.data : []);
        } catch {
            setError("Couldn't reach the API. Is the backend up?");
            setVolunteers([]);
        }
    }, []);

    useEffect(() => {
        (async () => {
            await load(filter);
        })();
    }, [filter, load]);

    const visible = useMemo(() => {
        if (!volunteers) return null;
        const q = query.trim().toLowerCase();
        if (!q) return volunteers;
        return volunteers.filter((v) =>
            [v.name, v.email, v.phone, v.area, ...(v.areas ?? [])]
                .filter(Boolean)
                .some((field) => String(field).toLowerCase().includes(q)),
        );
    }, [volunteers, query]);

    const patch = async (id: string, body: Record<string, unknown>) => {
        setBusy(id);
        setError("");
        try {
            const res = await fetch(`/api/admin/volunteers/${id}`, {
                method: "PATCH",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body),
            });
            const json = await res.json().catch(() => null);
            if (!res.ok) {
                setError(typeof json?.error === "string" ? json.error : "Couldn't update this request.");
                return;
            }
            await load(filter);
        } catch {
            setError("Update failed. Try again.");
        } finally {
            setBusy(null);
        }
    };

    const assign = async (id: string, assign: boolean) => {
        setBusy(id);
        setError("");
        try {
            const res = await fetch(`/api/admin/volunteers/${id}/assign`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({assign}),
            });
            const json = await res.json().catch(() => null);
            if (!res.ok) {
                setError(typeof json?.error === "string" ? json.error : "Couldn't update the assignment.");
                return;
            }
            await load(filter);
        } catch {
            setError("Assignment failed. Try again.");
        } finally {
            setBusy(null);
        }
    };

    const remove = async (id: string) => {
        if (!window.confirm("Delete this volunteer request permanently?")) return;
        setBusy(id);
        setError("");
        try {
            const res = await fetch(`/api/admin/volunteers/${id}`, {method: "DELETE"});
            const json = await res.json().catch(() => null);
            if (!res.ok) {
                setError(typeof json?.error === "string" ? json.error : "Couldn't delete this request.");
                return;
            }
            await load(filter);
        } catch {
            setError("Delete failed. Try again.");
        } finally {
            setBusy(null);
        }
    };

    return (
        <div>
            <AdminHeader
                eyebrow="Serving"
                title="Volunteer Requests"
                sub="Review people who applied through the volunteer page, then move them through to active."
            />

            {error ? (
                <p className="mb-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
            ) : null}

            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end">
                <Field label="Status">
                    <Select value={filter} onChange={(e) => setFilter(e.target.value as Filter)}>
                        <option value="new">New</option>
                        <option value="reviewing">Reviewing</option>
                        <option value="contacted">Contacted</option>
                        <option value="active">Active</option>
                        <option value="declined">Declined</option>
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
                                placeholder="Name, email, phone or area…"
                                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-base text-gray-800 shadow-sm outline-none transition focus:border-cyan focus:ring-2 focus:ring-cyan/20 md:text-sm"
                            />
                        </div>
                    </Field>
                </div>
            </div>

            {visible === null ? (
                <p className="rounded-2xl border border-dashed border-gray-300 bg-alice-blue/40 py-12 text-center text-sm text-slate-gray">
                    Loading volunteer requests…
                </p>
            ) : visible.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-alice-blue/40 py-12 text-center">
                    <LuInbox className="mx-auto mb-2 text-2xl text-slate-gray"/>
                    <p className="text-sm text-slate-gray">
                        {query ? "No requests match that search." : `No ${filter === "all" ? "" : STATUS_LABEL[filter].toLowerCase() + " "}volunteer requests.`}
                    </p>
                </div>
            ) : (
                <div className="grid gap-3">
                    {visible.map((v) => {
                        const note = notes[v._id] ?? v.adminNote ?? "";
                        return (
                            <div
                                key={v._id}
                                className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:p-5"
                            >
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div className="flex min-w-0 items-start gap-3">
                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-alice-blue text-sm font-bold text-navy">
                                            {initials(v.name || "?")}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-navy">{v.name}</p>
                                            <p className="mt-0.5 text-xs text-slate-gray">
                                                {v.email} · WhatsApp {v.phone}
                                                {v.area ? ` · ${v.area}` : ""} · {dateText(v.createdAt)}
                                                {typeof v.updatedCount === "number" && v.updatedCount > 1
                                                    ? ` · updated ${v.updatedCount}×`
                                                    : ""}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {v.assignedToName ? (
                                            <Badge tone="sky">{v.assignedToName}</Badge>
                                        ) : null}
                                        <Badge tone={STATUS_TONE[v.status] ?? "slate"}>
                                            {STATUS_LABEL[v.status] ?? v.status}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="mt-3 flex flex-wrap gap-1.5">
                                    {(v.areas ?? []).map((a) => (
                                        <span
                                            key={a}
                                            className="rounded-full bg-alice-blue px-2.5 py-0.5 text-xs font-semibold text-navy"
                                        >
                                            {a}
                                        </span>
                                    ))}
                                </div>

                                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-gray-700">
                                    {v.about}
                                </p>

                                {v.availability ? (
                                    <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-gray">
                                        <LuClock className="shrink-0"/>
                                        {v.availability}
                                    </p>
                                ) : null}

                                {v.timeline && v.timeline.length > 0 ? (
                                    <details className="mt-3 rounded-xl bg-alice-blue/50 p-3">
                                        <summary className="cursor-pointer text-xs font-semibold text-navy">
                                            Activity ({v.timeline.length})
                                        </summary>
                                        <ul className="mt-2 space-y-1">
                                            {v.timeline.map((t, i) => (
                                                <li key={i} className="text-xs text-slate-gray">
                                                    <span className="font-semibold text-navy">{t.by ?? "System"}</span>{" "}
                                                    {t.text} · {dateText(t.createdAt)}
                                                </li>
                                            ))}
                                        </ul>
                                    </details>
                                ) : null}

                                <div className="mt-4 border-t border-gray-50 pt-4">
                                    <Field label="Internal note" hint="Only admins see this.">
                                        <TextArea
                                            value={note}
                                            onChange={(e) => setNotes((prev) => ({...prev, [v._id]: e.target.value}))}
                                            placeholder="Notes about this volunteer…"
                                        />
                                    </Field>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        <Button
                                            variant="ghost"
                                            disabled={busy === v._id || note === (v.adminNote ?? "")}
                                            onClick={() => patch(v._id, {adminNote: note})}
                                        >
                                            Save note
                                        </Button>
                                        {v.assignedTo ? (
                                            <Button
                                                variant="ghost"
                                                disabled={busy === v._id}
                                                onClick={() => assign(v._id, false)}
                                            >
                                                <LuX/> Unassign
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="ghost"
                                                disabled={busy === v._id}
                                                onClick={() => assign(v._id, true)}
                                            >
                                                <LuUserCheck/> Assign to me
                                            </Button>
                                        )}
                                        {v.status !== "contacted" && v.status !== "active" ? (
                                            <Button
                                                variant="ghost"
                                                disabled={busy === v._id}
                                                onClick={() => patch(v._id, {status: "contacted"})}
                                            >
                                                Mark contacted
                                            </Button>
                                        ) : null}
                                        {v.status !== "active" ? (
                                            <Button
                                                disabled={busy === v._id}
                                                onClick={() => patch(v._id, {status: "active"})}
                                            >
                                                <LuCheck/> Approve
                                            </Button>
                                        ) : null}
                                        {v.status !== "declined" ? (
                                            <Button
                                                variant="danger"
                                                disabled={busy === v._id}
                                                onClick={() => patch(v._id, {status: "declined"})}
                                            >
                                                Decline
                                            </Button>
                                        ) : null}
                                        <Button
                                            variant="ghost"
                                            disabled={busy === v._id}
                                            onClick={() => remove(v._id)}
                                            aria-label="Delete request"
                                            className="ml-auto"
                                        >
                                            <LuTrash2/>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <p className="mt-6 flex items-center gap-1.5 text-xs text-gray-400">
                <LuHandHeart className="shrink-0"/>
                Applications come from the volunteer page. Volunteers are notified when you change their
                status.
            </p>
        </div>
    );
}
