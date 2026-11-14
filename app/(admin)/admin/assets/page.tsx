"use client";

import {useCallback, useEffect, useMemo, useState} from "react";
import type {IconType} from "react-icons";
import {
    LuArmchair,
    LuBarcode,
    LuBoxes,
    LuCar,
    LuLaptop,
    LuPackage,
    LuPencil,
    LuPlus,
    LuPrinter,
    LuSave,
    LuSearch,
    LuSmartphone,
    LuTablet,
    LuTrash2,
    LuVideo,
    LuWrench,
    LuX,
} from "react-icons/lu";
import {AdminHeader, Badge, Button, Field, Input, Select, TextArea} from "@/components/admin/ui";

type Asset = {
    _id: string;
    name: string;
    category: string;
    description: string;
    year: number | null;
    model: string;
    serialNumber: string;
    createdByName: string | null;
    createdAt: string | null;
};

const CATEGORIES = [
    "Computer",
    "Mobile phone",
    "Tablet",
    "Printer",
    "Audio & visual",
    "Furniture",
    "Vehicle",
    "Tools",
    "Other",
] as const;

const CATEGORY_ICON: Record<string, IconType> = {
    Computer: LuLaptop,
    "Mobile phone": LuSmartphone,
    Tablet: LuTablet,
    Printer: LuPrinter,
    "Audio & visual": LuVideo,
    Furniture: LuArmchair,
    Vehicle: LuCar,
    Tools: LuWrench,
    Other: LuPackage,
};

type Draft = {
    name: string;
    category: string;
    description: string;
    year: string;
    model: string;
    serialNumber: string;
};

const blankDraft = (): Draft => ({
    name: "",
    category: "Computer",
    description: "",
    year: "",
    model: "",
    serialNumber: "",
});

const toDraft = (a: Asset): Draft => ({
    name: a.name ?? "",
    category: a.category || "Other",
    description: a.description ?? "",
    year: a.year ? String(a.year) : "",
    model: a.model ?? "",
    serialNumber: a.serialNumber ?? "",
});

export default function AdminAssetsPage() {
    const [assets, setAssets] = useState<Asset[] | null>(null);
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState("All");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [draft, setDraft] = useState<Draft>(blankDraft);
    const [formError, setFormError] = useState("");
    const [busy, setBusy] = useState(false);
    const [banner, setBanner] = useState("");

    const load = useCallback(async () => {
        try {
            const res = await fetch("/api/assets", {cache: "no-store"});
            const json = await res.json().catch(() => null);
            if (!res.ok) {
                setFormError(typeof json?.error === "string" ? json.error : "Couldn't load assets.");
                setAssets([]);
                return;
            }
            setFormError("");
            setAssets(Array.isArray(json?.data) ? json.data : []);
        } catch {
            setFormError("Couldn't reach the API. Is the backend up?");
            setAssets([]);
        }
    }, []);

    useEffect(() => {
        (async () => {
            await load();
        })();
    }, [load]);

    const visible = useMemo(() => {
        if (!assets) return null;
        const q = query.trim().toLowerCase();
        return assets.filter((a) => {
            if (filter !== "All" && (a.category || "Other") !== filter) return false;
            if (!q) return true;
            return [a.name, a.model, a.serialNumber, a.description, a.category]
                .filter(Boolean)
                .some((field) => String(field).toLowerCase().includes(q));
        });
    }, [assets, query, filter]);

    const stats = useMemo(() => {
        const list = assets ?? [];
        return {
            total: list.length,
            categories: new Set(list.map((a) => a.category || "Other")).size,
            noSerial: list.filter((a) => !a.serialNumber).length,
        };
    }, [assets]);

    const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
        setDraft((prev) => ({...prev, [key]: value}));

    const startCreate = () => {
        setEditingId("new");
        setDraft(blankDraft());
        setFormError("");
        setBanner("");
    };

    const startEdit = (a: Asset) => {
        setEditingId(a._id);
        setDraft(toDraft(a));
        setFormError("");
        setBanner("");
    };

    const save = async () => {
        if (!draft.name.trim()) {
            setFormError("Please give the asset a name.");
            return;
        }
        const yearText = draft.year.trim();
        const year = yearText ? Number(yearText) : null;
        if (yearText && (!Number.isFinite(year) || (year as number) < 1900 || (year as number) > 2100)) {
            setFormError("Enter a year between 1900 and 2100, or leave it blank.");
            return;
        }
        setBusy(true);
        setFormError("");
        try {
            const payload = {
                name: draft.name.trim(),
                category: draft.category,
                description: draft.description.trim(),
                year: year === null ? null : Math.trunc(year as number),
                model: draft.model.trim(),
                serialNumber: draft.serialNumber.trim(),
            };
            const isNew = editingId === "new";
            const res = await fetch("/api/assets", {
                method: isNew ? "POST" : "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(isNew ? payload : {...payload, id: editingId}),
            });
            const json = await res.json().catch(() => null);
            if (!res.ok) {
                setFormError(typeof json?.error === "string" ? json.error : "Couldn't save this asset.");
                return;
            }
            setBanner(isNew ? "Asset added to the register." : "Asset updated.");
            setEditingId(null);
            await load();
        } catch {
            setFormError("Couldn't save this asset.");
        } finally {
            setBusy(false);
        }
    };

    const remove = async (a: Asset) => {
        if (!window.confirm(`Remove "${a.name}" from the asset register?`)) return;
        setBusy(true);
        try {
            const res = await fetch("/api/assets", {
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({id: a._id}),
            });
            if (!res.ok) {
                setFormError("Couldn't delete this asset.");
                return;
            }
            if (editingId === a._id) setEditingId(null);
            setBanner("Asset removed.");
            await load();
        } catch {
            setFormError("Couldn't delete this asset.");
        } finally {
            setBusy(false);
        }
    };

    return (
        <div>
            <AdminHeader
                eyebrow="Stewardship"
                title="Assets"
                sub="Every computer, phone and piece of equipment Relate World owns."
                actions={
                    <Button onClick={startCreate}>
                        <LuPlus/> New asset
                    </Button>
                }
            />

            {banner ? (
                <p className="mb-4 rounded-lg bg-ice-blue px-4 py-2.5 text-sm text-navy">{banner}</p>
            ) : null}
            {formError && !editingId ? (
                <p className="mb-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{formError}</p>
            ) : null}

            <div className="mb-5 grid gap-3 sm:grid-cols-3">
                <StatTile icon={LuBoxes} label="Items recorded" value={stats.total}/>
                <StatTile icon={LuPackage} label="Categories" value={stats.categories}/>
                <StatTile icon={LuBarcode} label="Without a serial" value={stats.noSerial}/>
            </div>

            {editingId ? (
                <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5 md:p-6">
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <h2 className="text-lg font-black text-navy">
                            {editingId === "new" ? "New asset" : `Edit ${draft.name || "asset"}`}
                        </h2>
                        <Button variant="ghost" onClick={() => setEditingId(null)}>
                            <LuX/> Cancel
                        </Button>
                    </div>

                    {formError ? (
                        <p className="mb-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{formError}</p>
                    ) : null}

                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Name">
                            <Input
                                value={draft.name}
                                onChange={(e) => set("name", e.target.value)}
                                placeholder="e.g. Office laptop"
                            />
                        </Field>
                        <Field label="Category">
                            <Select value={draft.category} onChange={(e) => set("category", e.target.value)}>
                                {CATEGORIES.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </Select>
                        </Field>
                        <Field label="Model">
                            <Input
                                value={draft.model}
                                onChange={(e) => set("model", e.target.value)}
                                placeholder="e.g. ThinkPad E14"
                            />
                        </Field>
                        <Field label="Year" hint="Year acquired — leave blank if unknown.">
                            <Input
                                value={draft.year}
                                onChange={(e) => set("year", e.target.value.replace(/[^\d]/g, "").slice(0, 4))}
                                inputMode="numeric"
                                placeholder="e.g. 2024"
                            />
                        </Field>
                        <div className="sm:col-span-2">
                            <Field label="Serial number" hint="Optional — furniture and tools often have none.">
                                <Input
                                    value={draft.serialNumber}
                                    onChange={(e) => set("serialNumber", e.target.value)}
                                    placeholder="Leave blank if the item has no serial number"
                                />
                            </Field>
                        </div>
                        <div className="sm:col-span-2">
                            <Field label="Description">
                                <TextArea
                                    value={draft.description}
                                    onChange={(e) => set("description", e.target.value)}
                                    placeholder="What it is, its condition, who uses it…"
                                    className="min-h-[110px]"
                                />
                            </Field>
                        </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                        <Button onClick={save} disabled={busy}>
                            <LuSave/> {editingId === "new" ? "Add asset" : "Save changes"}
                        </Button>
                        <Button variant="ghost" onClick={() => setEditingId(null)} disabled={busy}>
                            Cancel
                        </Button>
                    </div>
                </div>
            ) : null}

            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <LuSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"/>
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search name, model or serial number"
                        className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-3.5 text-base text-gray-800 shadow-sm outline-none transition focus:border-cyan focus:ring-2 focus:ring-cyan/20 placeholder:text-gray-400 md:text-sm"
                    />
                </div>
                <div className="sm:w-56">
                    <Select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter by category">
                        <option value="All">All categories</option>
                        {CATEGORIES.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </Select>
                </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
                {visible === null ? (
                    <div className="divide-y divide-gray-50">
                        {[0, 1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-4">
                                <div className="h-11 w-11 shrink-0 animate-pulse rounded-xl bg-alice-blue"/>
                                <div className="flex-1 space-y-2">
                                    <div className="h-3.5 w-1/3 animate-pulse rounded bg-alice-blue"/>
                                    <div className="h-3 w-1/2 animate-pulse rounded bg-alice-blue"/>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : visible.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
                        <LuBoxes className="text-3xl text-slate-gray"/>
                        <p className="text-base font-bold text-navy">
                            {assets && assets.length > 0 ? "Nothing matches your search" : "No assets recorded yet"}
                        </p>
                        <p className="max-w-sm text-sm text-slate-gray">
                            {assets && assets.length > 0
                                ? "Try a different search term or category."
                                : "Add the computers, phones and other equipment Relate World owns so nothing goes untracked."}
                        </p>
                        {assets && assets.length > 0 ? (
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setQuery("");
                                    setFilter("All");
                                }}
                            >
                                Clear filters
                            </Button>
                        ) : (
                            <Button onClick={startCreate}>
                                <LuPlus/> Add the first asset
                            </Button>
                        )}
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-50">
                        {visible.map((a) => {
                            const Icon = CATEGORY_ICON[a.category] ?? LuPackage;
                            return (
                                <li key={a._id} className="flex flex-wrap items-start gap-4 p-4 sm:flex-nowrap">
                                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ice-blue text-navy">
                                        <Icon className="text-lg"/>
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="text-[15px] font-bold text-navy">{a.name}</p>
                                            <Badge tone="sky">{a.category || "Other"}</Badge>
                                        </div>
                                        <p className="mt-0.5 text-xs text-slate-gray">
                                            {[a.model, a.year].filter(Boolean).join(" · ") || "No model or year recorded"}
                                        </p>
                                        {a.description ? (
                                            <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{a.description}</p>
                                        ) : null}
                                        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-gray">
                                            <LuBarcode/>
                                            {a.serialNumber ? (
                                                <span className="font-mono tracking-wide text-gray-700">{a.serialNumber}</span>
                                            ) : (
                                                <span>No serial number</span>
                                            )}
                                        </p>
                                    </div>
                                    <div className="flex shrink-0 gap-2">
                                        <Button variant="ghost" onClick={() => startEdit(a)} aria-label={`Edit ${a.name}`}>
                                            <LuPencil/>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            onClick={() => remove(a)}
                                            disabled={busy}
                                            aria-label={`Delete ${a.name}`}
                                            className="text-red-600 hover:bg-red-50"
                                        >
                                            <LuTrash2/>
                                        </Button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>

            {visible && visible.length > 0 ? (
                <p className="mt-3 text-xs text-slate-gray">
                    Showing {visible.length} of {assets?.length ?? 0} item{(assets?.length ?? 0) === 1 ? "" : "s"}.
                </p>
            ) : null}
        </div>
    );
}

function StatTile({icon: Icon, label, value}: {icon: IconType; label: string; value: number}) {
    return (
        <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan/15 text-cyan-ink">
                <Icon className="text-lg"/>
            </span>
            <div>
                <p className="text-xl font-black leading-none text-navy">{value}</p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-slate-gray">{label}</p>
            </div>
        </div>
    );
}