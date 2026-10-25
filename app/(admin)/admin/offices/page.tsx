"use client";

import {useCallback, useEffect, useMemo, useState} from "react";
import {
    LuBuilding2,
    LuCheck,
    LuInbox,
    LuPlus,
    LuSearch,
    LuTrash2,
    LuX,
} from "react-icons/lu";
import {AdminHeader, Badge, Button, Field, Input, Select, TextArea} from "@/components/admin/ui";
import {useClubs} from "@/lib/useClubs";

type OfficeStatus = "open" | "filled" | "closed";
type ApplicationStatus = "pending" | "approved" | "rejected";

type Office = {
    _id: string;
    title: string;
    description: string;
    area: string | null;
    clubSlug: string | null;
    postedByName: string;
    status: OfficeStatus;
    createdAt: string;
};

type Application = {
    _id: string;
    officeTitle: string;
    name: string;
    email: string | null;
    motivation: string;
    status: ApplicationStatus;
    reviewNote: string | null;
    createdAt: string;
    reviewedAt: string | null;
    office?: {_id: string; title: string; status: OfficeStatus} | null;
};

const OFFICE_STATUS_LABEL: Record<OfficeStatus, string> = {
    open: "Open",
    filled: "Filled",
    closed: "Closed",
};

const OFFICE_STATUS_TONE: Record<OfficeStatus, "gold" | "amber" | "slate" | "sky"> = {
    open: "sky",
    filled: "gold",
    closed: "slate",
};

const APP_LABEL: Record<ApplicationStatus, string> = {
    pending: "Under review",
    approved: "Approved",
    rejected: "Not approved",
};

const APP_TONE: Record<ApplicationStatus, "gold" | "amber" | "slate" | "sky"> = {
    pending: "amber",
    approved: "gold",
    rejected: "slate",
};

/** Mirrors the backend's office area list (same as the app). */
const AREAS = [
    "Club Facilitation",
    "Children's Clubs",
    "Sports Coaching",
    "Season Guides & Content",
    "Education",
    "Prayer & Community Groups",
    "Photography & Design",
    "Social Media",
    "Website & IT",
    "Events & Logistics",
    "Admin & Data",
];

function dateText(value?: string | null): string {
    if (!value) return "—";
    const d = new Date(value);
    return Number.isNaN(d.getTime())
        ? "—"
        : d.toLocaleDateString(undefined, {month: "short", day: "numeric", year: "numeric"});
}

export default function AdminOfficesPage() {
    const {allClubs} = useClubs();
    const [view, setView] = useState<"applications" | "offices">("applications");
    const [applications, setApplications] = useState<Application[] | null>(null);
    const [offices, setOffices] = useState<Office[] | null>(null);
    const [appFilter, setAppFilter] = useState<ApplicationStatus | "all">("pending");
    const [query, setQuery] = useState("");
    const [busy, setBusy] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [banner, setBanner] = useState("");
    const [notes, setNotes] = useState<Record<string, string>>({});

    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState<{title: string; description: string; area: string; clubSlug: string}>({
        title: "",
        description: "",
        area: "",
        clubSlug: "",
    });
    const [saving, setSaving] = useState(false);

    const load = useCallback(async () => {
        try {
            const [appsRes, officesRes] = await Promise.all([
                fetch("/api/community/offices/applications", {cache: "no-store"}),
                fetch("/api/community/offices", {cache: "no-store"}),
            ]);
            const appsJson = await appsRes.json().catch(() => null);
            const officesJson = await officesRes.json().catch(() => null);
            if (!appsRes.ok) {
                setError(typeof appsJson?.error === "string" ? appsJson.error : "Couldn't load applications.");
                setApplications([]);
            } else {
                setError("");
                setApplications(Array.isArray(appsJson?.data) ? appsJson.data : []);
            }
            setOffices(officesRes.ok && Array.isArray(officesJson?.data) ? officesJson.data : []);
        } catch {
            setError("Couldn't reach the API. Is the backend up?");
            setApplications([]);
            setOffices([]);
        }
    }, []);

    useEffect(() => {
        (async () => {
            await load();
        })();
    }, [load]);

    const visibleApps = useMemo(() => {
        if (!applications) return null;
        const byStatus =
            appFilter === "all" ? applications : applications.filter((a) => a.status === appFilter);
        // Review first: pending always sits above the rest.
        const sorted = [...byStatus].sort((a, b) => {
            const pa = a.status === "pending" ? 0 : 1;
            const pb = b.status === "pending" ? 0 : 1;
            if (pa !== pb) return pa - pb;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        const q = query.trim().toLowerCase();
        if (!q) return sorted;
        return sorted.filter((a) =>
            [a.name, a.email, a.officeTitle, a.motivation].filter(Boolean).some((f) =>
                String(f).toLowerCase().includes(q),
            ),
        );
    }, [applications, appFilter, query]);

    const visibleOffices = useMemo(() => {
        if (!offices) return null;
        const q = query.trim().toLowerCase();
        if (!q) return offices;
        return offices.filter((o) =>
            [o.title, o.description, o.area, o.postedByName].filter(Boolean).some((f) =>
                String(f).toLowerCase().includes(q),
            ),
        );
    }, [offices, query]);

    const reviewApplication = async (id: string, action: "approve" | "reject") => {
        const note = (notes[id] ?? "").trim();
        setBusy(id);
        setError("");
        setBanner("");
        try {
            const res = await fetch(`/api/community/offices/applications/${id}`, {
                method: "PATCH",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({action, note: note || undefined}),
            });
            const json = await res.json().catch(() => null);
            if (!res.ok) {
                setError(typeof json?.error === "string" ? json.error : "Couldn't review this application.");
                return;
            }
            setBanner(action === "approve" ? "Application approved — the office is now filled." : "Application rejected.");
            await load();
        } catch {
            setError("Review failed. Try again.");
        } finally {
            setBusy(null);
        }
    };

    const officeAction = async (office: Office, action: "reopen" | "close") => {
        setBusy(office._id);
        setError("");
        setBanner("");
        try {
            const res = await fetch(`/api/community/offices/${office._id}`, {
                method: "PATCH",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({action}),
            });
            const json = await res.json().catch(() => null);
            if (!res.ok) {
                setError(typeof json?.error === "string" ? json.error : "Couldn't update this office.");
                return;
            }
            setBanner(action === "reopen" ? `"${office.title}" is open again.` : `"${office.title}" is closed.`);
            await load();
        } catch {
            setError("Update failed. Try again.");
        } finally {
            setBusy(null);
        }
    };

    const removeOffice = async (office: Office) => {
        if (!window.confirm(`Delete "${office.title}" and all its applications permanently?`)) return;
        setBusy(office._id);
        setError("");
        setBanner("");
        try {
            const res = await fetch(`/api/community/offices/${office._id}`, {method: "DELETE"});
            const json = await res.json().catch(() => null);
            if (!res.ok) {
                setError(typeof json?.error === "string" ? json.error : "Couldn't delete this office.");
                return;
            }
            setBanner(`Deleted "${office.title}".`);
            await load();
        } catch {
            setError("Delete failed. Try again.");
        } finally {
            setBusy(null);
        }
    };

    const createOffice = async () => {
        if (!form.title.trim() || !form.description.trim()) {
            setError("A title and description are required.");
            return;
        }
        setSaving(true);
        setError("");
        setBanner("");
        try {
            const res = await fetch("/api/community/offices", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    title: form.title.trim(),
                    description: form.description.trim(),
                    area: form.area || null,
                    clubSlug: form.clubSlug || null,
                }),
            });
            const json = await res.json().catch(() => null);
            if (!res.ok) {
                setError(typeof json?.error === "string" ? json.error : "Couldn't post the office.");
                return;
            }
            setBanner(`"${form.title.trim()}" is live — every member has been notified.`);
            setForm({title: "", description: "", area: "", clubSlug: ""});
            setShowForm(false);
            setView("offices");
        } catch {
            setError("Posting failed. Try again.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <AdminHeader
                eyebrow="Serving"
                title="Volunteer Offices"
                sub="Open roles the community can step into, and the applications they attract. Approving an application fills the office."
                actions={
                    <>
                        <Button
                            variant={view === "applications" ? "primary" : "ghost"}
                            onClick={() => setView("applications")}
                        >
                            Applications
                        </Button>
                        <Button
                            variant={view === "offices" ? "primary" : "ghost"}
                            onClick={() => setView("offices")}
                        >
                            Offices
                        </Button>
                        <Button variant="accent" onClick={() => setShowForm((v) => !v)}>
                            <LuPlus/> {showForm ? "Close form" : "Post an office"}
                        </Button>
                    </>
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
                        New volunteer office
                    </p>
                    <div className="grid gap-4 md:grid-cols-2">
                        <Field label="Title">
                            <Input
                                value={form.title}
                                onChange={(e) => setForm((f) => ({...f, title: e.target.value}))}
                                placeholder="e.g. Kids Club Coordinator"
                            />
                        </Field>
                        <Field label="Area (optional)">
                            <Select value={form.area} onChange={(e) => setForm((f) => ({...f, area: e.target.value}))}>
                                <option value="">No area</option>
                                {AREAS.map((a) => (
                                    <option key={a} value={a}>
                                        {a}
                                    </option>
                                ))}
                            </Select>
                        </Field>
                    </div>
                    <Field label="Description">
                        <TextArea
                            value={form.description}
                            onChange={(e) => setForm((f) => ({...f, description: e.target.value}))}
                            rows={4}
                            placeholder="What the office involves, the time commitment, and who it suits."
                        />
                    </Field>
                    <Field label="Club (optional)" hint="Leave as Whole community to show it to everyone.">
                        <Select value={form.clubSlug} onChange={(e) => setForm((f) => ({...f, clubSlug: e.target.value}))}>
                            <option value="">Whole community</option>
                            {allClubs.map((c) => (
                                <option key={c.slug} value={c.slug}>
                                    {c.name}
                                </option>
                            ))}
                        </Select>
                    </Field>
                    <div className="mt-2 flex gap-2">
                        <Button variant="accent" disabled={saving} onClick={createOffice}>
                            {saving ? "Posting…" : "Post office"}
                        </Button>
                        <Button variant="ghost" onClick={() => setShowForm(false)}>
                            Cancel
                        </Button>
                    </div>
                </div>
            ) : null}

            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end">
                {view === "applications" ? (
                    <Field label="Application status">
                        <Select
                            value={appFilter}
                            onChange={(e) => setAppFilter(e.target.value as ApplicationStatus | "all")}
                        >
                            <option value="pending">Under review</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Not approved</option>
                            <option value="all">All</option>
                        </Select>
                    </Field>
                ) : null}
                <div className="flex-1">
                    <Field label="Search">
                        <div className="relative">
                            <LuSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder={view === "applications" ? "Name, email, office or text…" : "Title, area or description…"}
                                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-base text-gray-800 shadow-sm outline-none transition focus:border-cyan focus:ring-2 focus:ring-cyan/20 md:text-sm"
                            />
                        </div>
                    </Field>
                </div>
            </div>

            {view === "applications" ? (
                visibleApps === null ? (
                    <p className="rounded-2xl border border-dashed border-gray-300 bg-alice-blue/40 py-12 text-center text-sm text-slate-gray">
                        Loading applications…
                    </p>
                ) : visibleApps.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-alice-blue/40 py-12 text-center">
                        <LuInbox className="mx-auto mb-2 text-2xl text-slate-gray"/>
                        <p className="text-sm text-slate-gray">
                            {query
                                ? "No applications match that search."
                                : appFilter === "pending"
                                  ? "No pending applications."
                                  : "No applications here."}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {visibleApps.map((a) => (
                            <div key={a._id} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:p-5">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="font-semibold text-navy">
                                            {a.name}
                                            {a.email ? <span className="ml-2 text-xs font-normal text-slate-gray">{a.email}</span> : null}
                                        </p>
                                        <p className="mt-0.5 text-xs text-slate-gray">
                                            Applied for <span className="font-semibold text-navy">{a.office?.title || a.officeTitle}</span>{" "}
                                            · {dateText(a.createdAt)}
                                        </p>
                                    </div>
                                    <Badge tone={APP_TONE[a.status] ?? "slate"}>
                                        {APP_LABEL[a.status] ?? a.status}
                                    </Badge>
                                </div>

                                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-gray-700">
                                    {a.motivation}
                                </p>

                                {a.reviewNote ? (
                                    <p className="mt-2 text-xs text-slate-gray">Admin note: {a.reviewNote}</p>
                                ) : null}
                                {a.reviewedAt ? (
                                    <p className="mt-1 text-xs text-slate-gray">Reviewed {dateText(a.reviewedAt)}</p>
                                ) : null}

                                {a.status === "pending" ? (
                                    <div className="mt-4 border-t border-gray-50 pt-4">
                                        <Field label="Note to the applicant" hint="Optional.">
                                            <TextArea
                                                value={notes[a._id] ?? ""}
                                                onChange={(e) => setNotes((prev) => ({...prev, [a._id]: e.target.value}))}
                                                rows={2}
                                                placeholder="Why, or what happens next…"
                                            />
                                        </Field>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            <Button
                                                disabled={busy === a._id}
                                                onClick={() => reviewApplication(a._id, "approve")}
                                            >
                                                <LuCheck/> Approve — fill office
                                            </Button>
                                            <Button
                                                variant="danger"
                                                disabled={busy === a._id}
                                                onClick={() => {
                                                    if (window.confirm(`Reject ${a.name}'s application? They can apply again later.`)) {
                                                        void reviewApplication(a._id, "reject");
                                                    }
                                                }}
                                            >
                                                <LuX/> Reject
                                            </Button>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        ))}
                    </div>
                )
            ) : visibleOffices === null ? (
                <p className="rounded-2xl border border-dashed border-gray-300 bg-alice-blue/40 py-12 text-center text-sm text-slate-gray">
                    Loading offices…
                </p>
            ) : visibleOffices.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-alice-blue/40 py-12 text-center">
                    <LuBuilding2 className="mx-auto mb-2 text-2xl text-slate-gray"/>
                    <p className="text-sm text-slate-gray">
                        {query ? "No offices match that search." : "No offices yet — post the first one."}
                    </p>
                </div>
            ) : (
                <div className="grid gap-3">
                    {visibleOffices.map((o) => {
                        const club = o.clubSlug ? allClubs.find((c) => c.slug === o.clubSlug) : null;
                        return (
                            <div key={o._id} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:p-5">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            {o.area ? (
                                                <span className="rounded-full bg-alice-blue px-2.5 py-0.5 text-xs font-semibold text-navy">
                                                    {o.area}
                                                </span>
                                            ) : null}
                                            {club ? (
                                                <span className="rounded-full bg-cyan/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-dark">
                                                    {club.name}
                                                </span>
                                            ) : null}
                                            <Badge tone={OFFICE_STATUS_TONE[o.status] ?? "slate"}>
                                                {OFFICE_STATUS_LABEL[o.status] ?? o.status}
                                            </Badge>
                                        </div>
                                        <p className="mt-2 font-semibold text-navy">{o.title}</p>
                                        <p className="mt-0.5 text-xs text-slate-gray">
                                            {o.postedByName} · posted {dateText(o.createdAt)}
                                        </p>
                                    </div>
                                </div>

                                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-gray-700">
                                    {o.description}
                                </p>

                                <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-50 pt-4">
                                    {o.status !== "open" ? (
                                        <Button
                                            variant="ghost"
                                            disabled={busy === o._id}
                                            onClick={() => officeAction(o, "reopen")}
                                        >
                                            Reopen
                                        </Button>
                                    ) : null}
                                    {o.status !== "closed" ? (
                                        <Button
                                            variant="ghost"
                                            disabled={busy === o._id}
                                            onClick={() => officeAction(o, "close")}
                                        >
                                            Close
                                        </Button>
                                    ) : null}
                                    <Button
                                        variant="danger"
                                        disabled={busy === o._id}
                                        onClick={() => removeOffice(o)}
                                        aria-label="Delete office"
                                        className="ml-auto"
                                    >
                                        <LuTrash2/>
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <p className="mt-6 flex items-center gap-1.5 text-xs text-gray-400">
                <LuBuilding2 className="shrink-0"/>
                Offices are visible to every signed-in member at /offices — they apply with a short motivation note.
            </p>
        </div>
    );
}
