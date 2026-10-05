"use client";

import {useCallback, useEffect, useState} from "react";
import Image from "next/image";
import {
    LuImage,
    LuPackage,
    LuPencil,
    LuPlus,
    LuSave,
    LuStore,
    LuTrash2,
    LuX,
} from "react-icons/lu";
import {AdminHeader, Badge, Button, Field, Input, Select, TextArea} from "@/components/admin/ui";

const CATEGORIES = ["Apparel", "Accessories", "Home & Study"];

type StoreItem = {
    _id: string;
    id: string;
    category: string;
    name: string;
    price: number;
    blurb: string;
    image: string;
    images: string[];
    sizes: string[];
    details: string[];
    offerPrice: number | null;
    rating: number | null;
    inStock: boolean;
    active: boolean;
};

type Draft = {
    name: string;
    category: string;
    price: string;
    offerPrice: string;
    blurb: string;
    image: string;
    images: string;
    sizes: string;
    details: string;
    inStock: boolean;
    active: boolean;
};

const blankDraft = (): Draft => ({
    name: "",
    category: "Apparel",
    price: "",
    offerPrice: "",
    blurb: "",
    image: "",
    images: "",
    sizes: "",
    details: "",
    inStock: true,
    active: true,
});

const toDraft = (i: StoreItem): Draft => ({
    name: i.name ?? "",
    category: i.category ?? "Apparel",
    price: i.price != null ? String(i.price) : "",
    offerPrice: i.offerPrice != null ? String(i.offerPrice) : "",
    blurb: i.blurb ?? "",
    image: i.image ?? "",
    images: (i.images ?? []).join("\n"),
    sizes: (i.sizes ?? []).join(", "),
    details: (i.details ?? []).join("\n"),
    inStock: i.inStock !== false,
    active: i.active !== false,
});

export default function AdminStorePage() {
    const [items, setItems] = useState<StoreItem[] | null>(null);
    const [editing, setEditing] = useState<{key: string; label: string} | null>(null);
    const [draft, setDraft] = useState<Draft>(blankDraft);
    const [error, setError] = useState("");
    const [banner, setBanner] = useState("");
    const [busy, setBusy] = useState(false);

    const load = useCallback(async () => {
        try {
            const res = await fetch("/api/admin/store", {cache: "no-store"});
            const json = await res.json().catch(() => null);
            if (!res.ok) {
                setError(typeof json?.error === "string" ? json.error : "Couldn't load merch.");
                setItems([]);
                return;
            }
            setError("");
            setItems(Array.isArray(json?.data) ? json.data : []);
        } catch {
            setError("Couldn't reach the API. Is the backend up?");
            setItems([]);
        }
    }, []);

    useEffect(() => {
        (async () => {
            await load();
        })();
    }, [load]);

    const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
        setDraft((prev) => ({...prev, [key]: value}));

    const startCreate = () => {
        setEditing({key: "new", label: "New merch item"});
        setDraft(blankDraft());
        setError("");
        setBanner("");
    };

    const startEdit = (i: StoreItem) => {
        setEditing({key: i._id, label: `Edit ${i.name}`});
        setDraft(toDraft(i));
        setError("");
        setBanner("");
    };

    const save = async () => {
        if (!draft.name.trim()) return setError("Item name is required.");
        if (draft.price === "" || Number(draft.price) < 0) return setError("Enter a valid price.");
        if (draft.offerPrice && Number(draft.offerPrice) > Number(draft.price)) {
            return setError("Offer price can't be higher than the price.");
        }

        setBusy(true);
        setError("");
        try {
            const isNew = editing?.key === "new";
            const url = isNew ? "/api/admin/store" : `/api/admin/store/${editing?.key}`;
            const res = await fetch(url, {
                method: isNew ? "POST" : "PATCH",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(draft),
            });
            const json = await res.json().catch(() => null);
            if (!res.ok) {
                setError(typeof json?.error === "string" ? json.error : "Couldn't save this item.");
                return;
            }
            setBanner(isNew ? "Merch item created." : "Merch item updated.");
            setEditing(null);
            await load();
        } catch {
            setError("Couldn't save this item.");
        } finally {
            setBusy(false);
        }
    };

    const remove = async (i: StoreItem) => {
        if (!window.confirm(`Delete "${i.name}" from the store?`)) return;
        setBusy(true);
        try {
            const res = await fetch(`/api/admin/store/${i._id}`, {method: "DELETE"});
            if (!res.ok) {
                const json = await res.json().catch(() => null);
                setError(typeof json?.error === "string" ? json.error : "Couldn't delete this item.");
                return;
            }
            if (editing?.key === i._id) setEditing(null);
            setBanner("Merch item deleted.");
            await load();
        } catch {
            setError("Couldn't delete this item.");
        } finally {
            setBusy(false);
        }
    };

    const toggleFlag = async (i: StoreItem, flag: "active" | "inStock") => {
        setBusy(true);
        try {
            const res = await fetch(`/api/admin/store/${i._id}`, {
                method: "PATCH",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({[flag]: !i[flag]}),
            });
            if (!res.ok) {
                const json = await res.json().catch(() => null);
                setError(typeof json?.error === "string" ? json.error : "Couldn't update this item.");
                return;
            }
            await load();
        } catch {
            setError("Couldn't update this item.");
        } finally {
            setBusy(false);
        }
    };

    return (
        <div>
            <AdminHeader
                eyebrow="Merch"
                title="Store"
                sub="Items published to the Relate storefront. Anything inactive is hidden from shoppers."
                actions={
                    <Button onClick={startCreate}>
                        <LuPlus/> New item
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
                        <Field label="Name">
                            <Input value={draft.name} onChange={(e) => set("name", e.target.value)} placeholder="Relate Hoodie"/>
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
                        <Field label="Price" hint="ZAR">
                            <Input
                                type="number"
                                min={0}
                                step="1"
                                value={draft.price}
                                onChange={(e) => set("price", e.target.value)}
                            />
                        </Field>
                        <Field label="Offer price" hint="Optional — lower than price.">
                            <Input
                                type="number"
                                min={0}
                                step="1"
                                value={draft.offerPrice}
                                onChange={(e) => set("offerPrice", e.target.value)}
                            />
                        </Field>
                    </div>

                    <div className="mt-4">
                        <Field label="Blurb" hint="One line shown on the product card.">
                            <Input value={draft.blurb} onChange={(e) => set("blurb", e.target.value)}/>
                        </Field>
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <Field label="Image URL" hint="Absolute https:// link or a path in /public.">
                            <Input
                                value={draft.image}
                                onChange={(e) => set("image", e.target.value)}
                                placeholder="https://…"
                            />
                        </Field>
                        <Field label="Sizes" hint="Comma separated, e.g. S, M, L">
                            <Input value={draft.sizes} onChange={(e) => set("sizes", e.target.value)}/>
                        </Field>
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <Field label="Gallery images" hint="One URL per line.">
                            <TextArea
                                value={draft.images}
                                onChange={(e) => set("images", e.target.value)}
                                className="min-h-[110px]"
                            />
                        </Field>
                        <Field label="Details" hint="One bullet per line.">
                            <TextArea
                                value={draft.details}
                                onChange={(e) => set("details", e.target.value)}
                                className="min-h-[110px]"
                            />
                        </Field>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-5">
                        <label className="flex items-center gap-2 text-sm font-semibold text-navy">
                            <input
                                type="checkbox"
                                checked={draft.inStock}
                                onChange={(e) => set("inStock", e.target.checked)}
                                className="h-4 w-4 accent-cyan"
                            />
                            In stock
                        </label>
                        <label className="flex items-center gap-2 text-sm font-semibold text-navy">
                            <input
                                type="checkbox"
                                checked={draft.active}
                                onChange={(e) => set("active", e.target.checked)}
                                className="h-4 w-4 accent-cyan"
                            />
                            Published to the storefront
                        </label>
                    </div>

                    <div className="mt-5 flex gap-2">
                        <Button onClick={save} disabled={busy}>
                            <LuSave/> {busy ? "Saving…" : editing.key === "new" ? "Create item" : "Save changes"}
                        </Button>
                        <Button variant="ghost" onClick={() => setEditing(null)} disabled={busy}>
                            Cancel
                        </Button>
                    </div>
                </div>
            ) : null}

            {items === null ? (
                <p className="rounded-2xl border border-dashed border-gray-300 bg-alice-blue/40 py-12 text-center text-sm text-slate-gray">
                    Loading merch…
                </p>
            ) : items.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-alice-blue/40 py-12 text-center">
                    <LuStore className="mx-auto mb-2 text-2xl text-slate-gray"/>
                    <p className="text-sm text-slate-gray">
                        No merch items yet. The storefront keeps showing the bundled items until you add one.
                    </p>
                </div>
            ) : (
                <div className="grid gap-3">
                    {items.map((i) => (
                        <div key={i._id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-alice-blue">
                                {i.image ? (
                                    <Image src={i.image} alt="" width={64} height={64} className="h-full w-full object-cover"/>
                                ) : (
                                    <LuImage className="text-slate-gray"/>
                                )}
                            </div>
                            <div className="min-w-[12rem] flex-1">
                                <p className="font-semibold text-navy">{i.name}</p>
                                <p className="mt-0.5 text-xs text-slate-gray">
                                    {i.category} · {i.offerPrice != null ? `R${i.offerPrice} (was R${i.price})` : `R${i.price}`}
                                    {i.sizes.length > 0 ? ` · ${i.sizes.join(", ")}` : ""}
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge tone={i.active ? "gold" : "slate"}>{i.active ? "Live" : "Hidden"}</Badge>
                                {!i.inStock ? <Badge tone="amber">Out of stock</Badge> : null}
                                <Button variant="ghost" onClick={() => toggleFlag(i, "active")} disabled={busy}>
                                    {i.active ? "Hide" : "Publish"}
                                </Button>
                                <Button variant="ghost" onClick={() => startEdit(i)}>
                                    <LuPencil/> Edit
                                </Button>
                                <Button variant="danger" onClick={() => remove(i)} disabled={busy}>
                                    <LuTrash2/> Delete
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <p className="mt-6 flex items-start gap-2 rounded-xl bg-alice-blue/60 px-4 py-3 text-xs text-slate-gray">
                <LuPackage className="mt-0.5 shrink-0"/>
                Checkout still runs on WhatsApp delivery or EFT. Publishing an item here adds it to the storefront
                immediately; hiding it removes it without touching the item.
            </p>
        </div>
    );
}
