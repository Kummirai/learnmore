"use client";

import {useCallback, useEffect, useMemo, useState} from "react";
import Link from "next/link";
import {
    LuArrowRight,
    LuBriefcase,
    LuBug,
    LuCheck,
    LuExternalLink,
    LuLoaderCircle,
    LuLogIn,
    LuPalette,
    LuRefreshCw,
    LuUpload,
    LuWrench,
} from "react-icons/lu";
import Navbar from "@/components/Navbar";
import {useAuth} from "@/components/AuthProvider";
import {uploadToCloudinary} from "@/lib/cloudinary";

type ServiceType = "bug" | "design" | "other";
type ServiceStatus = "open" | "accepted" | "submitted" | "approved" | "closed";
type Tab = "open" | "mine" | "all";

type ClubService = {
    _id: string;
    title: string;
    description: string;
    type: ServiceType;
    clubSlug: string | null;
    posterName: string;
    status: ServiceStatus;
    acceptedById: string | null;
    acceptedByName: string | null;
    submission: {
        note: string;
        githubLink: string | null;
        imageUrl: string | null;
        submittedAt: string;
    } | null;
    review: {approved: boolean; note: string | null} | null;
    createdAt: string;
    isClaimedByMe?: boolean;
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

const STATUS_CLS: Record<ServiceStatus, string> = {
    open: "bg-emerald-50 text-emerald-700",
    accepted: "bg-alice-blue text-navy",
    submitted: "bg-orange-50 text-orange-700",
    approved: "bg-emerald-50 text-emerald-700",
    closed: "bg-gray-100 text-slate-gray",
};

const TABS: {key: Tab; label: string}[] = [
    {key: "open", label: "Open"},
    {key: "mine", label: "My work"},
    {key: "all", label: "All"},
];

function dateText(value?: string | null): string {
    if (!value) return "—";
    const d = new Date(value);
    return Number.isNaN(d.getTime())
        ? "—"
        : d.toLocaleDateString(undefined, {month: "short", day: "numeric"});
}

async function uploadImage(file: File): Promise<string> {
    // Unsigned direct-to-Cloudinary upload; the public URL lands on the
    // submission record unchanged (backend stores the string only).
    return uploadToCloudinary(file, "relate/services");
}

function SignInCta({label}: {label: string}) {
    return (
        <Link
            href="/signin"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-navy transition hover:border-cyan hover:text-cyan-dark"
        >
            <LuLogIn/> Sign in to {label}
        </Link>
    );
}

export default function ServicesPage() {
    const {user, loading: authLoading} = useAuth();
    const [services, setServices] = useState<ClubService[] | null>(null);
    const [tab, setTab] = useState<Tab>("open");
    const [error, setError] = useState("");
    const [busy, setBusy] = useState<string | null>(null);
    const [submittingId, setSubmittingId] = useState<string | null>(null);
    const [form, setForm] = useState<{note: string; githubLink: string; imageUrl: string; uploading: boolean}>({
        note: "",
        githubLink: "",
        imageUrl: "",
        uploading: false,
    });

    const load = useCallback(async () => {
        try {
            const res = await fetch("/api/community/services", {cache: "no-store"});
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
            await load();
        })();
    }, [load]);

    const visible = useMemo(() => {
        if (!services) return null;
        if (tab === "mine") return services.filter((s) => s.isClaimedByMe);
        if (tab === "open") return services.filter((s) => s.status === "open");
        return services;
    }, [services, tab]);

    const call = async (id: string, path: string, method: string, body?: unknown) => {
        setBusy(id);
        setError("");
        try {
            const res = await fetch(path, {
                method,
                headers: body ? {"Content-Type": "application/json"} : undefined,
                body: body ? JSON.stringify(body) : undefined,
            });
            const json = await res.json().catch(() => null);
            if (!res.ok) {
                setError(typeof json?.error === "string" ? json.error : "That didn't work. Try again.");
                return false;
            }
            await load();
            return true;
        } catch {
            setError("Couldn't reach the API. Is the backend up?");
            return false;
        } finally {
            setBusy(null);
        }
    };

    const accept = (s: ClubService) => call(s._id, `/api/community/services/${s._id}/accept`, "POST");
    const withdraw = (s: ClubService) => {
        if (!window.confirm("Release this service so someone else can take it?")) return;
        void call(s._id, `/api/community/services/${s._id}/withdraw`, "POST");
    };

    const pickImage = async (file: File | undefined) => {
        if (!file) return;
        setForm((f) => ({...f, uploading: true}));
        setError("");
        try {
            const url = await uploadImage(file);
            setForm((f) => ({...f, imageUrl: url}));
        } catch (e) {
            setError(e instanceof Error ? e.message : "Upload failed.");
        } finally {
            setForm((f) => ({...f, uploading: false}));
        }
    };

    const submitWork = async (s: ClubService) => {
        const needsGithub = s.type === "bug";
        const needsImage = s.type === "design";
        if (!form.note.trim()) {
            setError("Add a note about what you delivered.");
            return;
        }
        if (needsGithub && !/^https?:\/\//i.test(form.githubLink.trim())) {
            setError("Bug fixes need a GitHub link starting with http(s)://");
            return;
        }
        if (needsImage && !form.imageUrl) {
            setError("Design work needs the finished image.");
            return;
        }
        const ok = await call(s._id, `/api/community/services/${s._id}/submit`, "POST", {
            note: form.note.trim(),
            githubLink: form.githubLink.trim() || null,
            imageUrl: form.imageUrl || null,
        });
        if (ok) {
            setForm({note: "", githubLink: "", imageUrl: "", uploading: false});
            setSubmittingId(null);
        }
    };

    return (
        <>
            <Navbar />
            <header className="relative overflow-hidden bg-white border-b border-gray-100">
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{background: "linear-gradient(120deg, rgba(19,197,221,0.08) 0%, rgba(255,255,255,0) 55%)"}}
                />
                <div className="relative max-w-6xl mx-auto px-4 lg:px-0 py-14 md:py-16">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan mb-3">Relate Marketplace</p>
                    <h1 className="tracking-tight leading-[1.05] text-navy">
                        <span className="block text-3xl md:text-5xl font-black">Skills at work.</span>
                        <span className="block mt-1.5 text-xl md:text-3xl font-light italic text-cyan">
                            Claim it. Ship it. Get it approved.
                        </span>
                    </h1>
                    <p className="mt-4 max-w-2xl text-slate-gray leading-relaxed">
                        The team posts real tasks here — bug fixes, design work and practical jobs. Claim one,
                        deliver your work, and an admin reviews it. One member per service, no bidding, no payment
                        in the app — just work that gets done.
                    </p>
                    <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-gray">
                        {["Claim one at a time", "Bug fixes link to GitHub", "Designs share the finished image"].map((t) => (
                            <li key={t} className="inline-flex items-center gap-1.5">
                                <LuCheck className="text-cyan"/> {t}
                            </li>
                        ))}
                    </ul>
                    {user?.role === "admin" ? (
                        <Link
                            href="/admin/services"
                            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-dark hover:underline"
                        >
                            Manage services in the admin console <LuArrowRight/>
                        </Link>
                    ) : null}
                </div>
            </header>

            <main className="bg-ghost-white min-h-[50vh] px-4 py-10">
                <div className="mx-auto max-w-6xl">
                    {error ? (
                        <p className="mb-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
                    ) : null}

                    <div className="mb-8 flex flex-wrap justify-center gap-2">
                        {TABS.map((t) => (
                            <button
                                key={t.key}
                                onClick={() => setTab(t.key)}
                                className={`min-h-11 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors ${
                                    tab === t.key
                                        ? "bg-cyan text-white shadow-md"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {visible === null ? (
                        <p className="rounded-2xl border border-dashed border-gray-300 bg-white py-12 text-center text-sm text-slate-gray">
                            <LuLoaderCircle className="mx-auto mb-2 animate-spin text-xl text-cyan"/> Loading services…
                        </p>
                    ) : visible.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-14 text-center">
                            <LuBriefcase className="mx-auto mb-3 text-3xl text-slate-gray"/>
                            <p className="font-semibold text-navy">
                                {tab === "mine"
                                    ? "You haven't claimed a service yet"
                                    : tab === "open"
                                      ? "No open services right now"
                                      : "No services yet"}
                            </p>
                            <p className="mt-1 text-sm text-slate-gray">
                                {tab === "mine"
                                    ? "Accept an open service and it shows up here."
                                    : "New tasks posted by the team appear on the Open tab."}
                            </p>
                            {tab !== "open" ? (
                                <button
                                    onClick={() => setTab("open")}
                                    className="mt-4 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-cyan-dark hover:underline"
                                >
                                    Browse open services <LuArrowRight/>
                                </button>
                            ) : null}
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                            {visible.map((s) => {
                                const type = TYPE_META[s.type] ?? TYPE_META.other;
                                const TypeIcon = type.icon;
                                const mine = !!s.isClaimedByMe;
                                const isOpenForm = submittingId === s._id;
                                return (
                                    <article
                                        key={s._id}
                                        className="flex flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                                    >
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-alice-blue px-2.5 py-0.5 text-xs font-semibold text-navy">
                                                <TypeIcon/> {type.label}
                                            </span>
                                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_CLS[s.status]}`}>
                                                {STATUS_LABEL[s.status]}
                                            </span>
                                            {mine ? (
                                                <span className="rounded-full bg-cyan/15 px-2.5 py-0.5 text-xs font-bold text-cyan-dark">
                                                    Yours
                                                </span>
                                            ) : null}
                                        </div>

                                        <h2 className="mt-3 text-lg font-bold text-navy">{s.title}</h2>
                                        <p className="mt-1 text-xs text-slate-gray">
                                            {s.posterName} · {dateText(s.createdAt)}
                                            {s.acceptedByName && s.status !== "open"
                                                ? ` · ${mine ? "you are" : `${s.acceptedByName} is`} working on it`
                                                : ""}
                                        </p>
                                        <p className="mt-3 flex-1 whitespace-pre-line text-sm leading-relaxed text-gray-700">
                                            {s.description}
                                        </p>

                                        {s.submission ? (
                                            <div className="mt-3 rounded-xl bg-alice-blue/60 p-3.5">
                                                <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-gray">
                                                    Submitted work · {dateText(s.submission.submittedAt)}
                                                </p>
                                                <p className="mt-1.5 whitespace-pre-line text-sm text-gray-700">
                                                    {s.submission.note}
                                                </p>
                                                <div className="mt-2 flex flex-wrap gap-3">
                                                    {s.submission.githubLink ? (
                                                        <a
                                                            href={s.submission.githubLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-dark hover:underline"
                                                        >
                                                            <LuExternalLink/> View pull request
                                                        </a>
                                                    ) : null}
                                                    {s.submission.imageUrl ? (
                                                        <a
                                                            href={s.submission.imageUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm font-semibold text-cyan-dark hover:underline"
                                                        >
                                                            View design →
                                                        </a>
                                                    ) : null}
                                                </div>
                                            </div>
                                        ) : null}

                                        {s.review ? (
                                            <p className={`mt-2 text-xs font-semibold ${s.review.approved ? "text-emerald-700" : "text-orange-700"}`}>
                                                {s.review.approved
                                                    ? "Approved by the admin."
                                                    : "Sent back for changes."}
                                                {s.review.note ? ` ${s.review.note}` : ""}
                                            </p>
                                        ) : null}

                                        <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-50 pt-4">
                                            {!authLoading && s.status === "open" ? (
                                                user ? (
                                                    <button
                                                        disabled={busy === s._id}
                                                        onClick={() => accept(s)}
                                                        className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-cyan px-4 py-2 text-sm font-bold text-white shadow-md shadow-cyan/25 transition hover:bg-cyan-dark disabled:opacity-50"
                                                    >
                                                        {busy === s._id ? <LuLoaderCircle className="animate-spin"/> : <LuCheck/>}
                                                        Accept this service
                                                    </button>
                                                ) : (
                                                    <SignInCta label="accept services"/>
                                                )
                                            ) : null}

                                            {!authLoading && s.status === "accepted" && mine ? (
                                                <>
                                                    <button
                                                        onClick={() => {
                                                            setSubmittingId(isOpenForm ? null : s._id);
                                                            setError("");
                                                        }}
                                                        className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy-soft"
                                                    >
                                                        <LuUpload/> {isOpenForm ? "Close form" : "Submit work"}
                                                    </button>
                                                    <button
                                                        disabled={busy === s._id}
                                                        onClick={() => withdraw(s)}
                                                        className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-ghost-white disabled:opacity-50"
                                                    >
                                                        Withdraw
                                                    </button>
                                                </>
                                            ) : null}

                                            {!authLoading && s.status === "accepted" && !mine ? (
                                                <p className="text-sm text-slate-gray">
                                                    Another member is working on this one.
                                                </p>
                                            ) : null}

                                            {!authLoading && s.status === "submitted" && mine ? (
                                                <p className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-gray">
                                                    <LuRefreshCw/> Waiting for the admin to review your work.
                                                </p>
                                            ) : null}
                                        </div>

                                        {isOpenForm ? (
                                            <div className="mt-3 rounded-xl border border-gray-100 bg-ghost-white p-4">
                                                <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-slate-gray">
                                                    Submit your work
                                                </p>
                                                <label className="block">
                                                    <span className="mb-1 block text-xs font-semibold text-gray-600">
                                                        What did you deliver?
                                                    </span>
                                                    <textarea
                                                        value={form.note}
                                                        onChange={(e) => setForm((f) => ({...f, note: e.target.value}))}
                                                        rows={3}
                                                        placeholder="Summary of the fix or design, and anything to check."
                                                        className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none transition focus:border-cyan focus:ring-2 focus:ring-cyan/20"
                                                    />
                                                </label>

                                                {s.type !== "design" ? (
                                                    <label className="mt-3 block">
                                                        <span className="mb-1 block text-xs font-semibold text-gray-600">
                                                            GitHub link {s.type === "bug" ? <span className="text-red-500">(required)</span> : <span className="text-gray-400">(optional)</span>}
                                                        </span>
                                                        <input
                                                            value={form.githubLink}
                                                            onChange={(e) => setForm((f) => ({...f, githubLink: e.target.value}))}
                                                            inputMode="url"
                                                            placeholder="https://github.com/…/pull/123"
                                                            className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none transition focus:border-cyan focus:ring-2 focus:ring-cyan/20"
                                                        />
                                                    </label>
                                                ) : null}

                                                {s.type !== "bug" ? (
                                                    <div className="mt-3">
                                                        <span className="mb-1 block text-xs font-semibold text-gray-600">
                                                            Design image {s.type === "design" ? <span className="text-red-500">(required)</span> : <span className="text-gray-400">(optional)</span>}
                                                        </span>
                                                        {form.imageUrl ? (
                                                            <div className="flex flex-wrap items-center gap-3">
                                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                <img src={form.imageUrl} alt="Design preview" className="h-20 rounded-lg border border-gray-200 object-cover"/>
                                                                <button
                                                                    onClick={() => setForm((f) => ({...f, imageUrl: ""}))}
                                                                    className="text-sm font-semibold text-red-500 hover:underline"
                                                                >
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-dashed border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-600 transition hover:border-cyan hover:text-cyan-dark">
                                                                {form.uploading ? <LuLoaderCircle className="animate-spin"/> : <LuUpload/>}
                                                                {form.uploading ? "Uploading…" : "Choose image"}
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    className="hidden"
                                                                    onChange={(e) => void pickImage(e.target.files?.[0])}
                                                                />
                                                            </label>
                                                        )}
                                                    </div>
                                                ) : null}

                                                <div className="mt-4 flex gap-2">
                                                    <button
                                                        disabled={busy === s._id || form.uploading}
                                                        onClick={() => submitWork(s)}
                                                        className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-cyan px-4 py-2 text-sm font-bold text-white shadow-md shadow-cyan/25 transition hover:bg-cyan-dark disabled:opacity-50"
                                                    >
                                                        {busy === s._id ? <LuLoaderCircle className="animate-spin"/> : <LuCheck/>}
                                                        Send for review
                                                    </button>
                                                    <button
                                                        onClick={() => setSubmittingId(null)}
                                                        className="inline-flex min-h-11 items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-ghost-white"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : null}
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
