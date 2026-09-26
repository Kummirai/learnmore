"use client";

import {useCallback, useEffect, useState} from "react";
import {
    LuArchive,
    LuCheck,
    LuFolderPlus,
    LuInbox,
    LuMessageSquare,
    LuSearch,
    LuSend,
    LuUserCheck,
} from "react-icons/lu";
import {AdminHeader, Badge, Button, Field, Select, TextArea} from "@/components/admin/ui";

type Status = "open" | "in_progress" | "resolved" | "archived";
type Filter = Status | "all";

type Message = {from?: string; fromName?: string; text: string; createdAt?: string};

type HelpRequest = {
    _id: string;
    name: string;
    email: string;
    phone: string;
    area?: string;
    ageGroup?: string;
    contactMethod?: string;
    urgency?: string;
    whoFor?: string;
    helpType?: string;
    description: string;
    status: Status;
    recordId?: string | null;
    assignedTo?: string | null;
    assignedToName?: string | null;
    messages?: Message[];
    createdAt?: string;
    updatedAt?: string;
};

const STATUS_LABEL: Record<Status, string> = {
    open: "Open",
    in_progress: "In progress",
    resolved: "Resolved",
    archived: "Archived",
};

const STATUS_TONE: Record<Status, "gold" | "amber" | "slate" | "sky"> = {
    open: "amber",
    in_progress: "sky",
    resolved: "gold",
    archived: "slate",
};

const URGENCY_TONE: Record<string, "gold" | "amber" | "slate" | "sky"> = {
    Urgent: "amber",
    "This week": "sky",
    "Not urgent": "slate",
};

function dateText(value?: string): string {
    if (!value) return "unknown date";
    const d = new Date(value);
    return Number.isNaN(d.getTime())
        ? "unknown date"
        : d.toLocaleDateString(undefined, {month: "short", day: "numeric", year: "numeric"});
}

function clockText(value?: string): string {
    if (!value) return "";
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? "" : d.toLocaleString();
}

export default function AdminHelpRequestsPage() {
    const [requests, setRequests] = useState<HelpRequest[] | null>(null);
    const [filter, setFilter] = useState<Filter>("open");
    const [assigned, setAssigned] = useState<"all" | "me">("all");
    const [query, setQuery] = useState("");
    const [openId, setOpenId] = useState<string | null>(null);
    const [detail, setDetail] = useState<HelpRequest | null>(null);
    const [reply, setReply] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    const load = useCallback(async () => {
        const params = new URLSearchParams();
        if (filter !== "all") params.set("status", filter);
        if (assigned === "me") params.set("assigned", "me");
        try {
            const res = await fetch(`/api/help-requests?${params}`, {cache: "no-store"});
            const json = await res.json().catch(() => null);
            if (!res.ok) {
                setError(typeof json?.error === "string" ? json.error : "Couldn't load help requests.");
                setRequests([]);
                return;
            }
            setError("");
            setRequests(Array.isArray(json?.data) ? json.data : []);
        } catch {
            setError("Couldn't reach the API. Is the backend up?");
            setRequests([]);
        }
    }, [filter, assigned]);

    useEffect(() => {
        (async () => {
            await load();
        })();
    }, [load]);

    // Full thread is only fetched when a request is opened.
    useEffect(() => {
        if (!openId) return;
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch(`/api/help-requests/${openId}`, {cache: "no-store"});
                const json = await res.json().catch(() => null);
                if (!cancelled && res.ok) setDetail(json?.data ?? null);
            } catch {
                if (!cancelled) setError("Couldn't load that request.");
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [openId]);

    const visible = (requests ?? []).filter((r) => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return [r.name, r.email, r.phone, r.area, r.helpType, r.description]
            .filter(Boolean)
            .some((f) => String(f).toLowerCase().includes(q));
    });

    const act = async (id: string, path: string, body?: Record<string, unknown>) => {
        setBusy(true);
        setError("");
        try {
            const res = await fetch(`/api/help-requests/${id}${path}`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: body ? JSON.stringify(body) : undefined,
            });
            const json = await res.json().catch(() => null);
            if (!res.ok) {
                setError(typeof json?.error === "string" ? json.error : "That action failed.");
                return false;
            }
            await load();
            if (openId === id) {
                setOpenId(null);
                setDetail(null);
            }
            return true;
        } catch {
            setError("That action failed. Try again.");
            return false;
        } finally {
            setBusy(false);
        }
    };

    const setStatus = async (id: string, status: Status) => {
        setBusy(true);
        setError("");
        try {
            const res = await fetch(`/api/help-requests/${id}`, {
                method: "PATCH",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({status}),
            });
            const json = await res.json().catch(() => null);
            if (!res.ok) {
                setError(typeof json?.error === "string" ? json.error : "Couldn't update the status.");
                return;
            }
            await load();
        } catch {
            setError("Couldn't update the status.");
        } finally {
            setBusy(false);
        }
    };

    const sendReply = async (id: string) => {
        const text = reply.trim();
        if (!text) return;
        setBusy(true);
        setError("");
        try {
            const res = await fetch(`/api/help-requests/${id}/messages`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({text}),
            });
            const json = await res.json().catch(() => null);
            if (!res.ok) {
                setError(typeof json?.error === "string" ? json.error : "Couldn't send that reply.");
                return;
            }
            setReply("");
            const refreshed = await fetch(`/api/help-requests/${id}`, {cache: "no-store"});
            const refreshedJson = await refreshed.json().catch(() => null);
            setDetail(refreshedJson?.data ?? null);
        } catch {
            setError("Couldn't send that reply.");
        } finally {
            setBusy(false);
        }
    };

    return (
        <div>
            <AdminHeader
                eyebrow="Support"
                title="Help Requests"
                sub="Triage what people have asked for, reply in the thread, and convert to a family record when it needs follow-up."
            />

            {error ? (
                <p className="mb-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
            ) : null}

            <div className="mb-4 grid gap-3 sm:grid-cols-3">
                <Field label="Status">
                    <Select value={filter} onChange={(e) => setFilter(e.target.value as Filter)}>
                        <option value="open">Open</option>
                        <option value="in_progress">In progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="archived">Archived</option>
                        <option value="all">All</option>
                    </Select>
                </Field>
                <Field label="Assignment">
                    <Select value={assigned} onChange={(e) => setAssigned(e.target.value as "all" | "me")}>
                        <option value="all">Anyone</option>
                        <option value="me">Assigned to me</option>
                    </Select>
                </Field>
                <Field label="Search">
                    <div className="relative">
                        <LuSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Name, area, type…"
                            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-base text-gray-800 shadow-sm outline-none transition focus:border-cyan focus:ring-2 focus:ring-cyan/20 md:text-sm"
                        />
                    </div>
                </Field>
            </div>

            {requests === null ? (
                <p className="rounded-2xl border border-dashed border-gray-300 bg-alice-blue/40 py-12 text-center text-sm text-slate-gray">
                    Loading help requests…
                </p>
            ) : visible.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-alice-blue/40 py-12 text-center">
                    <LuInbox className="mx-auto mb-2 text-2xl text-slate-gray"/>
                    <p className="text-sm text-slate-gray">
                        {query ? "No requests match that search." : "No help requests in this view."}
                    </p>
                </div>
            ) : (
                <div className="grid gap-3">
                    {visible.map((r) => {
                        const isOpen = openId === r._id;
                        return (
                            <div key={r._id} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:p-5">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="font-semibold text-navy">{r.name}</p>
                                        <p className="mt-0.5 text-xs text-slate-gray">
                                            {r.helpType ?? "General"} · {r.area ?? "—"} · {dateText(r.createdAt)}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        {r.urgency ? <Badge tone={URGENCY_TONE[r.urgency] ?? "slate"}>{r.urgency}</Badge> : null}
                                        {r.assignedToName ? <Badge tone="sky">{r.assignedToName}</Badge> : null}
                                        <Badge tone={STATUS_TONE[r.status] ?? "slate"}>
                                            {STATUS_LABEL[r.status] ?? r.status}
                                        </Badge>
                                    </div>
                                </div>

                                <p className="mt-2 text-sm text-gray-600">
                                    <span className="text-[11px] uppercase tracking-widest text-slate-gray mr-2">
                                        Contact
                                    </span>
                                    {r.email} · WhatsApp {r.phone || "—"}
                                    {r.ageGroup ? ` · ${r.ageGroup}` : ""}
                                    {r.whoFor ? ` · for ${r.whoFor}` : ""}
                                </p>

                                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-700">
                                    {r.description}
                                </p>

                                {r.recordId ? (
                                    <p className="mt-2 text-xs font-semibold text-gold-700">
                                        Converted to a family record
                                    </p>
                                ) : null}

                                <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-50 pt-4">
                                    <Button
                                        variant="ghost"
                                        onClick={() => {
                                            setOpenId(isOpen ? null : r._id);
                                            if (isOpen) setDetail(null);
                                        }}
                                    >
                                        <LuMessageSquare/> {isOpen ? "Hide thread" : `Thread${r.messages?.length ? ` (${r.messages.length})` : ""}`}
                                    </Button>
                                    {r.assignedTo ? (
                                        <Button variant="ghost" disabled={busy} onClick={() => act(r._id, "/assign", {assign: false})}>
                                            Unassign
                                        </Button>
                                    ) : (
                                        <Button variant="ghost" disabled={busy} onClick={() => act(r._id, "/assign", {assign: true})}>
                                            <LuUserCheck/> Assign to me
                                        </Button>
                                    )}
                                    {!r.recordId ? (
                                        <Button variant="ghost" disabled={busy} onClick={() => act(r._id, "/convert")}>
                                            <LuFolderPlus/> Convert to record
                                        </Button>
                                    ) : null}
                                    {r.status !== "resolved" ? (
                                        <Button disabled={busy} onClick={() => setStatus(r._id, "resolved")}>
                                            <LuCheck/> Resolve
                                        </Button>
                                    ) : (
                                        <Button variant="ghost" disabled={busy} onClick={() => setStatus(r._id, "archived")}>
                                            <LuArchive/> Archive
                                        </Button>
                                    )}
                                </div>

                                {isOpen ? (
                                    <div className="mt-4 rounded-xl bg-alice-blue/40 p-4">
                                        <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-slate-gray">
                                            Conversation
                                        </p>
                                        {detail?.messages && detail.messages.length > 0 ? (
                                            <ul className="mb-3 space-y-2">
                                                {detail.messages.map((m, i) => {
                                                    const fromUser = m.from === "user";
                                                    const system = m.from === "system";
                                                    return (
                                                        <li
                                                            key={i}
                                                            className={`rounded-lg px-3 py-2 text-sm ${
                                                                system
                                                                    ? "bg-white/70 text-slate-gray italic"
                                                                    : fromUser
                                                                      ? "bg-white text-gray-700"
                                                                      : "bg-navy text-white"
                                                            }`}
                                                        >
                                                            <span className="text-[11px] font-bold uppercase tracking-widest opacity-70">
                                                                {system ? "System" : fromUser ? (detail.name ?? "Them") : "Relate"}
                                                            </span>
                                                            <p className="mt-0.5 whitespace-pre-line">{m.text}</p>
                                                            {m.createdAt ? (
                                                                <p className="mt-1 text-[10px] opacity-60">{clockText(m.createdAt)}</p>
                                                            ) : null}
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        ) : (
                                            <p className="mb-3 text-sm text-slate-gray">No replies yet.</p>
                                        )}
                                        <TextArea
                                            value={reply}
                                            onChange={(e) => setReply(e.target.value)}
                                            placeholder="Write a reply to the person who asked…"
                                        />
                                        <div className="mt-2">
                                            <Button disabled={busy || !reply.trim()} onClick={() => sendReply(r._id)}>
                                                <LuSend/> Send reply
                                            </Button>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
