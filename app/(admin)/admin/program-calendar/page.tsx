"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AdminHeader, Badge, Button, Field, Input, Select, TextArea } from "@/components/admin/ui";
import { useClubs } from "@/lib/useClubs";
import { LuExternalLink, LuPlus, LuTrash2 } from "react-icons/lu";

type CalendarEntry = {
    id: string;
    date: string;
    endDate?: string;
    title: string;
    description?: string;
    term?: string;
    time?: string;
    location?: string;
    setting?: string;
};

type Payload = {
    key: string;
    entries: CalendarEntry[];
    /** Serialised form of the last loaded/saved state — drives the dirty flag. */
    saved: string;
};

const DEFAULT_YEAR = 2027;
const YEAR_OPTIONS = [2025, 2026, 2027, 2028, 2029, 2030];
const TERMS = ["", "Term 1", "Term 2", "Term 3"];
const SETTINGS = ["", "Indoor", "Outdoor", "Indoor/Outdoor"];
const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

export default function AdminProgramCalendarPage() {
    return (
        <section
            className="flex-1 px-4 py-10 md:py-14"
            style={{ background: "linear-gradient(115deg, #f5f8fb 0%, #eff5f9 60%, #f5f8fb 100%)" }}
        >
            <div className="max-w-6xl mx-auto">
                <CalendarBody />
            </div>
        </section>
    );
}

function CalendarBody() {
    const { allClubs, loading: clubsLoading, error: clubsError } = useClubs();
    const [clubSlug, setClubSlug] = useState("sprout-kids");
    const [year, setYear] = useState(DEFAULT_YEAR);
    const [reload, setReload] = useState(0);
    const [payload, setPayload] = useState<Payload | null>(null);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState<{ key: string; msg: string; tone: "ok" | "error" } | null>(null);
    const [saving, setSaving] = useState(false);

    const key = `${clubSlug}:${year}`;

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch(`/api/admin/program-calendar/${clubSlug}?year=${year}`, {
                    cache: "no-store",
                });
                const json = await res.json().catch(() => null);
                if (cancelled) return;
                if (!res.ok) {
                    setError(typeof json?.error === "string" ? json.error : "Couldn't load this calendar.");
                    setPayload({ key, entries: [], saved: "" });
                    return;
                }
                const entries = Array.isArray(json?.data?.entries) ? json.data.entries : [];
                setError("");
                setPayload({ key, entries, saved: JSON.stringify(entries) });
            } catch {
                if (cancelled) return;
                setError("Couldn't reach the API. Is the backend up?");
                setPayload({ key, entries: [], saved: "" });
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [clubSlug, year, key, reload]);

    const loading = clubsLoading || payload === null || payload.key !== key;
    const entries = useMemo(
        () => (payload && payload.key === key ? payload.entries : []),
        [payload, key],
    );
    const dirty = Boolean(payload && payload.key === key && JSON.stringify(entries) !== payload.saved);
    const club = allClubs.find((c) => c.slug === clubSlug);

    const rows = useMemo(() => {
        return entries
            .map((entry, index) => ({ entry, index }))
            .sort(
                (a, b) =>
                    a.entry.date.localeCompare(b.entry.date) ||
                    a.entry.title.localeCompare(b.entry.title),
            );
    }, [entries]);

    const months = useMemo(() => {
        const out: { month: number; rows: { entry: CalendarEntry; index: number }[] }[] = [];
        for (const row of rows) {
            const month = Number(row.entry.date.slice(5, 7)) - 1;
            const last = out[out.length - 1];
            if (last && last.month === month) last.rows.push(row);
            else out.push({ month, rows: [row] });
        }
        return out;
    }, [rows]);

    const patchEntry = (index: number, patch: Partial<CalendarEntry>) => {
        setPayload((prev) => {
            if (!prev || prev.key !== key) return prev;
            const next = prev.entries.map((entry, i) => (i === index ? { ...entry, ...patch } : entry));
            return { ...prev, entries: next };
        });
    };

    const addEntry = () => {
        setPayload((prev) => {
            if (!prev || prev.key !== key) return prev;
            const id = `cal-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
            return { ...prev, entries: [...prev.entries, { id, date: nextSessionDate(prev.entries, year), title: "" }] };
        });
        setNotice(null);
    };

    const removeEntry = (index: number) => {
        setPayload((prev) => {
            if (!prev || prev.key !== key) return prev;
            return { ...prev, entries: prev.entries.filter((_, i) => i !== index) };
        });
        setNotice(null);
    };

    const save = async () => {
        if (!payload || payload.key !== key || error) return;
        setSaving(true);
        setNotice(null);
        try {
            const res = await fetch("/api/admin/program-calendar", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ clubSlug, year, entries: payload.entries }),
            });
            const json = await res.json().catch(() => null);
            if (!res.ok) {
                setNotice({
                    key,
                    tone: "error",
                    msg: typeof json?.error === "string" ? json.error : "Couldn't save this calendar.",
                });
                return;
            }
            const savedEntries: CalendarEntry[] = Array.isArray(json?.data?.entries)
                ? json.data.entries
                : payload.entries;
            setPayload({ key, entries: savedEntries, saved: JSON.stringify(savedEntries) });
            setNotice({ key, tone: "ok", msg: `Saved ${savedEntries.length} dates for ${year}.` });
        } catch {
            setNotice({ key, tone: "error", msg: "Couldn't reach the API. Is the backend up?" });
        } finally {
            setSaving(false);
        }
    };

    const removeYear = async () => {
        if (!window.confirm(`Delete the whole ${year} calendar for ${clubSlug}?`)) return;
        setNotice(null);
        try {
            const res = await fetch(`/api/admin/program-calendar/${clubSlug}?year=${year}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                const json = await res.json().catch(() => null);
                setNotice({
                    key,
                    tone: "error",
                    msg: typeof json?.error === "string" ? json.error : "Couldn't delete this calendar.",
                });
                return;
            }
            setPayload({ key, entries: [], saved: JSON.stringify([]) });
            setNotice({ key, tone: "ok", msg: `The ${year} calendar was deleted.` });
        } catch {
            setNotice({ key, tone: "error", msg: "Couldn't reach the API. Is the backend up?" });
        }
    };

    if (clubsError) {
        return (
            <div className="bg-white rounded-2xl shadow-xl p-5 md:p-7">
                <AdminHeader
                    eyebrow="Clubs"
                    title="Program Calendar"
                    sub="Each club's year calendar — the dates shown under Programs & Activities on its page."
                />
                <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{clubsError}</p>
            </div>
        );
    }

    const currentNotice = notice && notice.key === key ? notice : null;

    return (
        <div className="bg-white rounded-2xl shadow-xl p-5 md:p-7">
            <AdminHeader
                eyebrow={club ? club.name : capitalize(clubSlug)}
                title="Program Calendar"
                sub="One year per club. Saved dates replace the pillar list on the club page for every visitor."
                actions={
                    <>
                        <label className="relative">
                            <span className="sr-only">Club</span>
                            <Select value={clubSlug} onChange={(e) => setClubSlug(e.target.value)}>
                                {allClubs.length === 0 && <option value={clubSlug}>{capitalize(clubSlug)}</option>}
                                {allClubs.map((c) => (
                                    <option key={c.slug} value={c.slug}>
                                        {c.name}
                                    </option>
                                ))}
                            </Select>
                        </label>
                        <label className="relative">
                            <span className="sr-only">Year</span>
                            <Select value={year} onChange={(e) => setYear(Number(e.target.value))}>
                                {YEAR_OPTIONS.map((y) => (
                                    <option key={y} value={y}>
                                        {y}
                                    </option>
                                ))}
                            </Select>
                        </label>
                        <Link
                            href={`/${clubSlug}`}
                            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-alice-blue transition"
                        >
                            <LuExternalLink className="text-sm" /> Public page
                        </Link>
                        <Button variant="accent" onClick={addEntry} disabled={loading}>
                            <LuPlus /> Add date
                        </Button>
                        <Button onClick={save} disabled={loading || saving || !dirty || Boolean(error)}>
                            {saving ? "Saving…" : dirty ? "Save calendar" : "Saved"}
                        </Button>
                    </>
                }
            />

            {error && (
                <div className="mb-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
                    {error}{" "}
                    <button
                        type="button"
                        className="font-semibold underline"
                        onClick={() => {
                            setPayload(null);
                            setReload((n) => n + 1);
                        }}
                    >
                        Try again
                    </button>
                </div>
            )}
            {currentNotice && (
                <div
                    className={`mb-4 rounded-lg px-4 py-2.5 text-sm ${
                        currentNotice.tone === "ok" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
                    }`}
                >
                    {currentNotice.msg}
                </div>
            )}

            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 bg-alice-blue/40 px-4 py-3">
                <p className="text-xs text-slate-gray">
                    {loading
                        ? "Loading this calendar…"
                        : entries.length === 0
                          ? `No ${year} calendar yet — add the first date.`
                          : `${entries.length} dates · ${rows[0].entry.date} → ${rows[rows.length - 1].entry.date}`}
                </p>
                <div className="flex items-center gap-3">
                    {dirty && <Badge tone="amber">Unsaved changes</Badge>}
                    {!dirty && entries.length > 0 && <Badge tone="sky">{year} published</Badge>}
                    {entries.length > 0 && (
                        <button
                            type="button"
                            onClick={removeYear}
                            className="text-xs font-semibold text-red-600 hover:underline"
                        >
                            Delete {year}
                        </button>
                    )}
                </div>
            </div>

            {loading ? (
                <p className="rounded-lg bg-alice-blue px-4 py-2.5 text-sm text-slate-gray">Loading this calendar…</p>
            ) : months.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 px-4 py-10 text-center">
                    <p className="text-sm font-semibold text-navy">Nothing here yet</p>
                    <p className="mt-1 text-xs text-slate-gray">
                        Add a date to start the {year} calendar for {club ? club.name : clubSlug}. Sessions usually run
                        fortnightly — “Add date” lands two weeks after the last one.
                    </p>
                    <Button variant="accent" className="mt-4" onClick={addEntry}>
                        <LuPlus /> Add date
                    </Button>
                </div>
            ) : (
                <div className="space-y-6">
                    {months.map((group) => (
                        <section key={group.month}>
                            <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-gray">
                                {MONTHS[group.month]} {year}
                            </h3>
                            <div className="space-y-3">
                                {group.rows.map(({ entry, index }) => (
                                    <div
                                        key={entry.id}
                                        className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
                                    >
                                        <div className="grid gap-3 md:grid-cols-12">
                                            <div className="md:col-span-2">
                                                <Field label="Date">
                                                    <Input
                                                        type="date"
                                                        value={entry.date}
                                                        onChange={(e) => patchEntry(index, { date: e.target.value })}
                                                    />
                                                </Field>
                                            </div>
                                            <div className="md:col-span-4">
                                                <Field label="Title">
                                                    <Input
                                                        value={entry.title}
                                                        placeholder="Smart Saver Kickoff"
                                                        onChange={(e) => patchEntry(index, { title: e.target.value })}
                                                    />
                                                </Field>
                                            </div>
                                            <div className="md:col-span-2">
                                                <Field label="Term">
                                                    <Select
                                                        value={entry.term ?? ""}
                                                        onChange={(e) => patchEntry(index, { term: e.target.value })}
                                                    >
                                                        {TERMS.map((term) => (
                                                            <option key={term} value={term}>
                                                                {term || "—"}
                                                            </option>
                                                        ))}
                                                    </Select>
                                                </Field>
                                            </div>
                                            <div className="md:col-span-2">
                                                <Field label="Setting">
                                                    <Select
                                                        value={entry.setting ?? ""}
                                                        onChange={(e) => patchEntry(index, { setting: e.target.value })}
                                                    >
                                                        {SETTINGS.map((setting) => (
                                                            <option key={setting} value={setting}>
                                                                {setting || "—"}
                                                            </option>
                                                        ))}
                                                    </Select>
                                                </Field>
                                            </div>
                                            <div className="flex items-end justify-end md:col-span-2">
                                                <Button
                                                    variant="ghost"
                                                    className="text-red-600"
                                                    onClick={() => removeEntry(index)}
                                                    aria-label={`Delete ${entry.title || entry.date}`}
                                                >
                                                    <LuTrash2 />
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="mt-3 grid gap-3 md:grid-cols-12">
                                            <div className="md:col-span-2">
                                                <Field label="Time" hint="Optional">
                                                    <Input
                                                        value={entry.time ?? ""}
                                                        placeholder="10:00"
                                                        onChange={(e) => patchEntry(index, { time: e.target.value })}
                                                    />
                                                </Field>
                                            </div>
                                            <div className="md:col-span-3">
                                                <Field label="Location" hint="Optional">
                                                    <Input
                                                        value={entry.location ?? ""}
                                                        placeholder="Main hall"
                                                        onChange={(e) => patchEntry(index, { location: e.target.value })}
                                                    />
                                                </Field>
                                            </div>
                                            <div className="md:col-span-7">
                                                <Field label="What happens" hint="Shown when someone opens the date">
                                                    <TextArea
                                                        value={entry.description ?? ""}
                                                        rows={2}
                                                        onChange={(e) =>
                                                            patchEntry(index, { description: e.target.value })
                                                        }
                                                    />
                                                </Field>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            )}
        </div>
    );
}

/** Next session date: the usual start, or two weeks after the last entry. */
function nextSessionDate(entries: CalendarEntry[], year: number): string {
    const dated = entries
        .filter((entry) => /^\d{4}-\d{2}-\d{2}$/.test(entry.date))
        .map((entry) => entry.date)
        .sort();
    const last = dated[dated.length - 1];
    if (!last) return `${year}-03-01`;
    const date = new Date(`${last}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + 14);
    return date.toISOString().slice(0, 10);
}

function capitalize(str: string): string {
    return str.replace(/^./, (c) => c.toUpperCase()).replace(/-./g, (m) => m[1].toUpperCase());
}
