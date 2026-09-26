"use client";

import {useCallback, useEffect, useMemo, useState} from "react";
import {
    LuFolderOpen,
    LuPlus,
    LuSave,
    LuSearch,
    LuTrash2,
    LuX,
} from "react-icons/lu";
import {AdminHeader, Badge, Button, Field, Input, Select, TextArea} from "@/components/admin/ui";

type Member = {name: string; age: string; relationship: string};
type Need = string;
type ActionLogEntry = {
    date: string;
    actionTaken: string;
    byWhom: string;
    amountsUsed: string;
    nextStep: string;
    dueDate: string;
};

type Record_ = {
    _id: string;
    recordId: string;
    dateOfIntake?: string;
    caseManager?: string;
    headOfHousehold?: string;
    contactNumber?: string;
    alternateContactNumber?: string | null;
    emailAddress?: string | null;
    physicalAddress?: string;
    preferredContactMethod?: string[];
    householdMembers?: Member[];
    summary?: string;
    urgencyLevel?: string;
    immediateNeeds?: string[];
    longTermNeeds?: string[];
    actionLog?: ActionLogEntry[];
    caseClosedDate?: string | null;
    reasonForClosure?: string | null;
    finalOutcome?: string | null;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
};

const CONTACT_METHODS = ["WhatsApp", "Phone call", "Email", "In person"];
const URGENCY = ["Low", "Medium", "High", "Critical"];

const emptyMember = (): Member => ({name: "", age: "", relationship: ""});
const emptyLog = (): ActionLogEntry => ({
    date: new Date().toISOString().slice(0, 10),
    actionTaken: "",
    byWhom: "",
    amountsUsed: "",
    nextStep: "",
    dueDate: "",
});

/** Draft state for the create/edit form. */
type Draft = Omit<Record_, "_id" | "createdAt" | "updatedAt">;

const blankDraft = (): Draft => ({
    recordId: "",
    dateOfIntake: new Date().toISOString().slice(0, 10),
    caseManager: "",
    headOfHousehold: "",
    contactNumber: "",
    alternateContactNumber: "",
    emailAddress: "",
    physicalAddress: "",
    preferredContactMethod: ["WhatsApp"],
    householdMembers: [emptyMember()],
    summary: "",
    urgencyLevel: "Medium",
    immediateNeeds: [],
    longTermNeeds: [],
    actionLog: [],
    caseClosedDate: null,
    reasonForClosure: "",
    finalOutcome: "",
    status: "Active",
});

function toDraft(r: Record_): Draft {
    return {
        recordId: r.recordId ?? "",
        dateOfIntake: r.dateOfIntake ?? "",
        caseManager: r.caseManager ?? "",
        headOfHousehold: r.headOfHousehold ?? "",
        contactNumber: r.contactNumber ?? "",
        alternateContactNumber: r.alternateContactNumber ?? "",
        emailAddress: r.emailAddress ?? "",
        physicalAddress: r.physicalAddress ?? "",
        preferredContactMethod: r.preferredContactMethod ?? [],
        householdMembers:
            r.householdMembers && r.householdMembers.length > 0 ? r.householdMembers : [emptyMember()],
        summary: r.summary ?? "",
        urgencyLevel: r.urgencyLevel ?? "Medium",
        immediateNeeds: r.immediateNeeds ?? [],
        longTermNeeds: r.longTermNeeds ?? [],
        actionLog: r.actionLog ?? [],
        caseClosedDate: r.caseClosedDate ?? null,
        reasonForClosure: r.reasonForClosure ?? "",
        finalOutcome: r.finalOutcome ?? "",
        status: r.status ?? "Active",
    };
}

export default function AdminRecordsPage() {
    const [records, setRecords] = useState<Record_[] | null>(null);
    const [query, setQuery] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [draft, setDraft] = useState<Draft>(blankDraft);
    const [formError, setFormError] = useState("");
    const [busy, setBusy] = useState(false);
    const [banner, setBanner] = useState("");

    const load = useCallback(async () => {
        try {
            const res = await fetch("/api/records", {cache: "no-store"});
            const json = await res.json().catch(() => null);
            if (!res.ok) {
                setFormError(typeof json?.error === "string" ? json.error : "Couldn't load records.");
                setRecords([]);
                return;
            }
            setFormError("");
            // GET /api/records returns a bare array.
            setRecords(Array.isArray(json) ? json.map((r: Record_) => ({...r, _id: String(r._id)})) : []);
        } catch {
            setFormError("Couldn't reach the API. Is the backend up?");
            setRecords([]);
        }
    }, []);

    useEffect(() => {
        (async () => {
            await load();
        })();
    }, [load]);

    const visible = useMemo(() => {
        if (!records) return null;
        const q = query.trim().toLowerCase();
        if (!q) return records;
        return records.filter((r) =>
            [r.recordId, r.headOfHousehold, r.caseManager, r.contactNumber, r.emailAddress, r.summary]
                .filter(Boolean)
                .some((f) => String(f).toLowerCase().includes(q)),
        );
    }, [records, query]);

    const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
        setDraft((prev) => ({...prev, [key]: value}));

    const startCreate = () => {
        setEditingId("new");
        setDraft(blankDraft());
        setFormError("");
        setBanner("");
    };

    const startEdit = (r: Record_) => {
        setEditingId(r._id);
        setDraft(toDraft(r));
        setFormError("");
        setBanner("");
    };

    const save = async () => {
        if (!draft.headOfHousehold?.trim()) {
            setFormError("Please enter the head of household.");
            return;
        }
        if (!draft.contactNumber?.trim()) {
            setFormError("Please enter a contact number.");
            return;
        }
        setBusy(true);
        setFormError("");
        try {
            const payload = {
                ...draft,
                emailAddress: draft.emailAddress || null,
                alternateContactNumber: draft.alternateContactNumber || null,
                reasonForClosure: draft.reasonForClosure || null,
                finalOutcome: draft.finalOutcome || null,
                // Drop the placeholder empty member rows.
                householdMembers: (draft.householdMembers ?? []).filter((m) => m.name?.trim()),
            };
            const isNew = editingId === "new";
            const res = await fetch("/api/records", {
                method: isNew ? "POST" : "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(isNew ? payload : {...payload, id: editingId}),
            });
            const json = await res.json().catch(() => null);
            if (!res.ok) {
                setFormError(typeof json?.error === "string" ? json.error : "Couldn't save this record.");
                return;
            }
            setBanner(isNew ? "Record created." : "Record updated.");
            setEditingId(null);
            await load();
        } catch {
            setFormError("Couldn't save this record.");
        } finally {
            setBusy(false);
        }
    };

    const remove = async (id: string) => {
        if (!window.confirm("Delete this family record permanently?")) return;
        setBusy(true);
        try {
            const res = await fetch("/api/records", {
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({id}),
            });
            if (!res.ok) {
                setFormError("Couldn't delete this record.");
                return;
            }
            if (editingId === id) setEditingId(null);
            await load();
        } catch {
            setFormError("Couldn't delete this record.");
        } finally {
            setBusy(false);
        }
    };

    const toggleInList = (key: "immediateNeeds" | "longTermNeeds", value: string) => {
        const list = draft[key] ?? [];
        set(key, list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
    };

    return (
        <div>
            <AdminHeader
                eyebrow="Casework"
                title="Family Records"
                sub="Every family Relate is supporting, with needs, actions taken and outcomes."
                actions={
                    <Button onClick={startCreate}>
                        <LuPlus/> New record
                    </Button>
                }
            />

            {banner ? (
                <p className="mb-4 rounded-lg bg-gold-50 px-4 py-2.5 text-sm text-gold-700">{banner}</p>
            ) : null}
            {formError && !editingId ? (
                <p className="mb-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{formError}</p>
            ) : null}

            {editingId ? (
                <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <h2 className="text-lg font-black text-navy">
                            {editingId === "new" ? "New family record" : `Edit ${draft.recordId}`}
                        </h2>
                        <Button variant="ghost" onClick={() => setEditingId(null)}>
                            <LuX/> Cancel
                        </Button>
                    </div>

                    {formError ? (
                        <p className="mb-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{formError}</p>
                    ) : null}

                    <Section title="Identification">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Record ID" hint="Leave blank to auto-generate.">
                                <Input value={draft.recordId} onChange={(e) => set("recordId", e.target.value)} placeholder="REC-…"/>
                            </Field>
                            <Field label="Date of intake">
                                <Input
                                    type="date"
                                    value={draft.dateOfIntake ?? ""}
                                    onChange={(e) => set("dateOfIntake", e.target.value)}
                                />
                            </Field>
                            <Field label="Case manager">
                                <Input value={draft.caseManager ?? ""} onChange={(e) => set("caseManager", e.target.value)}/>
                            </Field>
                            <Field label="Urgency">
                                <Select value={draft.urgencyLevel} onChange={(e) => set("urgencyLevel", e.target.value)}>
                                    {URGENCY.map((u) => (
                                        <option key={u} value={u}>
                                            {u}
                                        </option>
                                    ))}
                                </Select>
                            </Field>
                        </div>
                    </Section>

                    <Section title="Household">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Head of household">
                                <Input
                                    value={draft.headOfHousehold ?? ""}
                                    onChange={(e) => set("headOfHousehold", e.target.value)}
                                />
                            </Field>
                            <Field label="Contact number">
                                <Input
                                    value={draft.contactNumber ?? ""}
                                    onChange={(e) => set("contactNumber", e.target.value)}
                                />
                            </Field>
                            <Field label="Alternate number">
                                <Input
                                    value={draft.alternateContactNumber ?? ""}
                                    onChange={(e) => set("alternateContactNumber", e.target.value)}
                                />
                            </Field>
                            <Field label="Email">
                                <Input
                                    type="email"
                                    value={draft.emailAddress ?? ""}
                                    onChange={(e) => set("emailAddress", e.target.value)}
                                />
                            </Field>
                        </div>

                        <div className="mt-4">
                            <Field label="Physical address">
                                <Input
                                    value={draft.physicalAddress ?? ""}
                                    onChange={(e) => set("physicalAddress", e.target.value)}
                                />
                            </Field>
                        </div>

                        <div className="mt-4">
                            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-slate-gray">
                                Preferred contact method
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {CONTACT_METHODS.map((m) => {
                                    const on = (draft.preferredContactMethod ?? []).includes(m);
                                    return (
                                        <button
                                            key={m}
                                            type="button"
                                            onClick={() => {
                                                const list = draft.preferredContactMethod ?? [];
                                                set(
                                                    "preferredContactMethod",
                                                    on ? list.filter((x) => x !== m) : [...list, m],
                                                );
                                            }}
                                            aria-pressed={on}
                                            className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition ${
                                                on
                                                    ? "border-navy bg-navy text-white"
                                                    : "border-gray-200 bg-white text-gray-600 hover:border-cyan hover:bg-alice-blue"
                                            }`}
                                        >
                                            {m}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </Section>

                    <Section
                        title="Household members"
                        action={
                            <Button
                                variant="ghost"
                                onClick={() => set("householdMembers", [...(draft.householdMembers ?? []), emptyMember()])}
                            >
                                <LuPlus/> Add member
                            </Button>
                        }
                    >
                        <div className="grid gap-3">
                            {(draft.householdMembers ?? []).map((m, i) => (
                                <div key={i} className="grid gap-3 sm:grid-cols-[1fr_6rem_1fr_auto]">
                                    <Input
                                        value={m.name}
                                        placeholder="Name"
                                        onChange={(e) => {
                                            const next = [...(draft.householdMembers ?? [])];
                                            next[i] = {...m, name: e.target.value};
                                            set("householdMembers", next);
                                        }}
                                    />
                                    <Input
                                        value={m.age}
                                        placeholder="Age"
                                        onChange={(e) => {
                                            const next = [...(draft.householdMembers ?? [])];
                                            next[i] = {...m, age: e.target.value};
                                            set("householdMembers", next);
                                        }}
                                    />
                                    <Input
                                        value={m.relationship}
                                        placeholder="Relationship"
                                        onChange={(e) => {
                                            const next = [...(draft.householdMembers ?? [])];
                                            next[i] = {...m, relationship: e.target.value};
                                            set("householdMembers", next);
                                        }}
                                    />
                                    <Button
                                        variant="ghost"
                                        aria-label="Remove member"
                                        onClick={() =>
                                            set(
                                                "householdMembers",
                                                (draft.householdMembers ?? []).filter((_, x) => x !== i),
                                            )
                                        }
                                    >
                                        <LuTrash2/>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </Section>

                    <Section title="Assessment">
                        <Field label="Summary">
                            <TextArea
                                value={draft.summary ?? ""}
                                onChange={(e) => set("summary", e.target.value)}
                                className="min-h-[120px]"
                            />
                        </Field>

                        <NeedsPicker
                            label="Immediate needs"
                            options={draft.immediateNeeds ?? []}
                            onToggle={(v) => toggleInList("immediateNeeds", v)}
                        />
                        <NeedsPicker
                            label="Long-term needs"
                            options={draft.longTermNeeds ?? []}
                            onToggle={(v) => toggleInList("longTermNeeds", v)}
                        />
                    </Section>

                    <Section
                        title="Action log"
                        action={
                            <Button variant="ghost" onClick={() => set("actionLog", [...(draft.actionLog ?? []), emptyLog()])}>
                                <LuPlus/> Add entry
                            </Button>
                        }
                    >
                        {(draft.actionLog ?? []).length === 0 ? (
                            <p className="text-sm text-slate-gray">No actions logged yet.</p>
                        ) : (
                            <div className="grid gap-3">
                                {(draft.actionLog ?? []).map((entry, i) => (
                                    <div key={i} className="rounded-xl border border-gray-100 p-3">
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            <Input
                                                type="date"
                                                value={entry.date}
                                                onChange={(e) => updateLog(draft, set, i, "date", e.target.value)}
                                            />
                                            <Input
                                                value={entry.byWhom}
                                                placeholder="By whom"
                                                onChange={(e) => updateLog(draft, set, i, "byWhom", e.target.value)}
                                            />
                                        </div>
                                        <div className="mt-3">
                                            <TextArea
                                                value={entry.actionTaken}
                                                placeholder="What was done…"
                                                onChange={(e) => updateLog(draft, set, i, "actionTaken", e.target.value)}
                                            />
                                        </div>
                                        <div className="mt-3 grid gap-3 sm:grid-cols-3">
                                            <Input
                                                value={entry.amountsUsed}
                                                placeholder="Amounts used"
                                                onChange={(e) => updateLog(draft, set, i, "amountsUsed", e.target.value)}
                                            />
                                            <Input
                                                value={entry.nextStep}
                                                placeholder="Next step"
                                                onChange={(e) => updateLog(draft, set, i, "nextStep", e.target.value)}
                                            />
                                            <Input
                                                type="date"
                                                value={entry.dueDate}
                                                onChange={(e) => updateLog(draft, set, i, "dueDate", e.target.value)}
                                            />
                                        </div>
                                        <div className="mt-2 text-right">
                                            <Button
                                                variant="ghost"
                                                aria-label="Remove entry"
                                                onClick={() =>
                                                    set(
                                                        "actionLog",
                                                        (draft.actionLog ?? []).filter((_, x) => x !== i),
                                                    )
                                                }
                                            >
                                                <LuTrash2/> Remove
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Section>

                    <Section title="Closure">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Case closed date" hint="Setting this marks the record Closed.">
                                <Input
                                    type="date"
                                    value={draft.caseClosedDate ?? ""}
                                    onChange={(e) => set("caseClosedDate", e.target.value || null)}
                                />
                            </Field>
                            <Field label="Reason for closure">
                                <Input
                                    value={draft.reasonForClosure ?? ""}
                                    onChange={(e) => set("reasonForClosure", e.target.value)}
                                />
                            </Field>
                        </div>
                        <div className="mt-4">
                            <Field label="Final outcome">
                                <TextArea
                                    value={draft.finalOutcome ?? ""}
                                    onChange={(e) => set("finalOutcome", e.target.value)}
                                />
                            </Field>
                        </div>
                    </Section>

                    <div className="mt-5 flex gap-2">
                        <Button onClick={save} disabled={busy}>
                            <LuSave/> {busy ? "Saving…" : editingId === "new" ? "Create record" : "Save changes"}
                        </Button>
                        <Button variant="ghost" onClick={() => setEditingId(null)} disabled={busy}>
                            Cancel
                        </Button>
                    </div>
                </div>
            ) : null}

            <div className="mb-4">
                <Field label="Search">
                    <div className="relative">
                        <LuSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Record ID, head of household, case manager…"
                            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-base text-gray-800 shadow-sm outline-none transition focus:border-cyan focus:ring-2 focus:ring-cyan/20 md:text-sm"
                        />
                    </div>
                </Field>
            </div>

            {visible === null ? (
                <p className="rounded-2xl border border-dashed border-gray-300 bg-alice-blue/40 py-12 text-center text-sm text-slate-gray">
                    Loading records…
                </p>
            ) : visible.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-alice-blue/40 py-12 text-center">
                    <LuFolderOpen className="mx-auto mb-2 text-2xl text-slate-gray"/>
                    <p className="text-sm text-slate-gray">
                        {query ? "No records match that search." : "No family records yet."}
                    </p>
                </div>
            ) : (
                <div className="grid gap-3">
                    {visible.map((r) => (
                        <div key={r._id} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="font-semibold text-navy">
                                        {r.headOfHousehold || "Unnamed household"}
                                    </p>
                                    <p className="mt-0.5 text-xs text-slate-gray">
                                        {r.recordId} · {r.contactNumber || "—"}
                                        {r.caseManager ? ` · ${r.caseManager}` : ""}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {r.urgencyLevel ? <Badge tone={r.urgencyLevel === "Critical" || r.urgencyLevel === "High" ? "amber" : "slate"}>{r.urgencyLevel}</Badge> : null}
                                    <Badge tone={r.status === "Closed" ? "slate" : "gold"}>{r.status ?? "Active"}</Badge>
                                </div>
                            </div>
                            {r.summary ? (
                                <p className="mt-2 line-clamp-2 text-sm text-gray-600">{r.summary}</p>
                            ) : null}
                            <div className="mt-3 flex flex-wrap gap-2">
                                <Button variant="ghost" onClick={() => startEdit(r)}>
                                    Edit
                                </Button>
                                <Button variant="ghost" disabled={busy} onClick={() => remove(r._id)}>
                                    <LuTrash2/> Delete
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function updateLog(
    draft: Draft,
    set: (key: "actionLog", value: ActionLogEntry[]) => void,
    index: number,
    field: keyof ActionLogEntry,
    value: string,
) {
    const next = [...(draft.actionLog ?? [])];
    next[index] = {...next[index], [field]: value};
    set("actionLog", next);
}

function Section({
    title,
    action,
    children,
}: {
    title: string;
    action?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <section className="mb-6 border-t border-gray-100 pt-5 first:border-0 first:pt-0">
            <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-sm font-bold uppercase tracking-widest text-navy">{title}</h3>
                {action}
            </div>
            {children}
        </section>
    );
}

function NeedsPicker({
    label,
    options,
    onToggle,
}: {
    label: string;
    options: Need[];
    onToggle: (value: string) => void;
}) {
    const [value, setValue] = useState("");
    return (
        <div className="mt-4">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-slate-gray">
                {label}
            </span>
            <div className="mb-2 flex flex-wrap gap-1.5">
                {options.map((o) => (
                    <span
                        key={o}
                        className="inline-flex items-center gap-1 rounded-full bg-alice-blue px-2.5 py-0.5 text-xs font-semibold text-navy"
                    >
                        {o}
                        <button type="button" onClick={() => onToggle(o)} aria-label={`Remove ${o}`}>
                            <LuX className="text-[10px]"/>
                        </button>
                    </span>
                ))}
            </div>
            <div className="flex gap-2">
                <Input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Add a need and press enter"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            const v = value.trim();
                            if (v && !options.includes(v)) onToggle(v);
                            setValue("");
                        }
                    }}
                />
            </div>
        </div>
    );
}
