"use client";

import {useCallback, useEffect, useMemo, useState} from "react";
import Link from "next/link";
import {
    LuArrowRight,
    LuBuilding2,
    LuCheck,
    LuLoaderCircle,
    LuLogIn,
} from "react-icons/lu";
import Navbar from "@/components/Navbar";
import {useAuth} from "@/components/AuthProvider";

type OfficeStatus = "open" | "filled" | "closed";
type ApplicationStatus = "pending" | "approved" | "rejected";
type Tab = "open" | "mine";

type Office = {
    _id: string;
    title: string;
    description: string;
    area: string | null;
    clubSlug: string | null;
    status: OfficeStatus;
    createdAt: string;
    myApplication?: Application | null;
};

type Application = {
    _id: string;
    officeId: string;
    officeTitle: string;
    motivation: string;
    status: ApplicationStatus;
    reviewNote: string | null;
    createdAt: string;
    office?: {_id: string; title: string; status: OfficeStatus} | null;
};

const OFFICE_CLS: Record<OfficeStatus, string> = {
    open: "bg-emerald-50 text-emerald-700",
    filled: "bg-alice-blue text-navy",
    closed: "bg-gray-100 text-slate-gray",
};

const OFFICE_LABEL: Record<OfficeStatus, string> = {
    open: "Open",
    filled: "Filled",
    closed: "Closed",
};

const APP_CLS: Record<ApplicationStatus, string> = {
    pending: "bg-orange-50 text-orange-700",
    approved: "bg-emerald-50 text-emerald-700",
    rejected: "bg-red-50 text-red-600",
};

const APP_LABEL: Record<ApplicationStatus, string> = {
    pending: "Under review",
    approved: "Approved",
    rejected: "Not approved",
};

const TABS: {key: Tab; label: string}[] = [
    {key: "open", label: "Open offices"},
    {key: "mine", label: "My applications"},
];

function dateText(value?: string | null): string {
    if (!value) return "—";
    const d = new Date(value);
    return Number.isNaN(d.getTime())
        ? "—"
        : d.toLocaleDateString(undefined, {month: "short", day: "numeric", year: "numeric"});
}

export default function OfficesPage() {
    const {user, loading: authLoading} = useAuth();
    const [tab, setTab] = useState<Tab>("open");
    const [offices, setOffices] = useState<Office[] | null>(null);
    const [applications, setApplications] = useState<Application[] | null>(null);
    const [error, setError] = useState("");
    const [busy, setBusy] = useState<string | null>(null);
    const [applyingId, setApplyingId] = useState<string | null>(null);
    const [motivation, setMotivation] = useState("");

    const load = useCallback(async () => {
        try {
            const res = await fetch("/api/community/offices", {cache: "no-store"});
            const json = await res.json().catch(() => null);
            if (!res.ok) {
                setError(typeof json?.error === "string" ? json.error : "Couldn't load offices.");
                setOffices([]);
                return;
            }
            setError("");
            setOffices(Array.isArray(json?.data) ? json.data : []);
        } catch {
            setError("Couldn't reach the API. Is the backend up?");
            setOffices([]);
        }
    }, []);

    const loadMine = useCallback(async () => {
        try {
            const res = await fetch("/api/community/offices/mine", {cache: "no-store"});
            const json = await res.json().catch(() => null);
            setApplications(res.ok && Array.isArray(json?.data) ? json.data : []);
        } catch {
            setApplications([]);
        }
    }, []);

    useEffect(() => {
        if (authLoading) return;
        if (!user) return;
        (async () => {
            await load();
        })();
    }, [authLoading, user, load]);

    useEffect(() => {
        if (authLoading || !user || tab !== "mine") return;
        (async () => {
            await loadMine();
        })();
    }, [authLoading, user, tab, loadMine]);

    const visibleOffices = useMemo(() => {
        if (!offices) return null;
        return offices.filter((o) => o.status !== "closed");
    }, [offices]);

    const apply = async (office: Office) => {
        if (motivation.trim().length < 20) {
            setError("Write at least 20 characters on why you'd like this office.");
            return;
        }
        setBusy(office._id);
        setError("");
        try {
            const res = await fetch(`/api/community/offices/${office._id}/apply`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({motivation: motivation.trim()}),
            });
            const json = await res.json().catch(() => null);
            if (!res.ok) {
                setError(typeof json?.error === "string" ? json.error : "Couldn't send your application.");
                return;
            }
            setMotivation("");
            setApplyingId(null);
            await load();
        } catch {
            setError("Couldn't reach the API. Is the backend up?");
        } finally {
            setBusy(null);
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
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan mb-3">
                        Relate Community
                    </p>
                    <h1 className="tracking-tight leading-[1.05] text-navy">
                        <span className="block text-3xl md:text-5xl font-black">Step into a role.</span>
                        <span className="block mt-1.5 text-xl md:text-3xl font-light italic text-cyan">
                            Offices open, applications open.
                        </span>
                    </h1>
                    <p className="mt-4 max-w-2xl text-slate-gray leading-relaxed">
                        Volunteer offices are real responsibilities with a real handover — coordinate a club,
                        welcome newcomers, look after the data. Apply with a short note on why you want it;
                        admins review every application.
                    </p>
                    <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-gray">
                        {["No experience needed", "Short application note", "Admins reply on every one"].map((t) => (
                            <li key={t} className="inline-flex items-center gap-1.5">
                                <LuCheck className="text-cyan"/> {t}
                            </li>
                        ))}
                    </ul>
                    {user?.role === "admin" ? (
                        <Link
                            href="/admin/offices"
                            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-dark hover:underline"
                        >
                            Manage offices in the admin console <LuArrowRight/>
                        </Link>
                    ) : null}
                </div>
            </header>

            <main className="bg-ghost-white min-h-[50vh] px-4 py-10">
                <div className="mx-auto max-w-6xl">
                    {error ? (
                        <p className="mb-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
                    ) : null}

                    {authLoading ? (
                        <p className="rounded-2xl border border-dashed border-gray-300 bg-white py-12 text-center text-sm text-slate-gray">
                            <LuLoaderCircle className="mx-auto mb-2 animate-spin text-xl text-cyan"/> Loading…
                        </p>
                    ) : !user ? (
                        <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-14 text-center">
                            <LuBuilding2 className="mx-auto mb-3 text-3xl text-slate-gray"/>
                            <p className="font-semibold text-navy">Sign in to see open offices</p>
                            <p className="mt-1 text-sm text-slate-gray">
                                Volunteer offices are for signed-in Relate members — it takes a moment.
                            </p>
                            <Link
                                href="/signin"
                                className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg bg-cyan px-6 py-3 text-sm font-bold text-white shadow-md shadow-cyan/25 transition hover:bg-cyan-dark"
                            >
                                <LuLogIn/> Sign in
                            </Link>
                        </div>
                    ) : (
                        <>
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

                            {tab === "open" ? (
                                visibleOffices === null ? (
                                    <p className="rounded-2xl border border-dashed border-gray-300 bg-white py-12 text-center text-sm text-slate-gray">
                                        <LuLoaderCircle className="mx-auto mb-2 animate-spin text-xl text-cyan"/> Loading offices…
                                    </p>
                                ) : visibleOffices.length === 0 ? (
                                    <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-14 text-center">
                                        <LuBuilding2 className="mx-auto mb-3 text-3xl text-slate-gray"/>
                                        <p className="font-semibold text-navy">No open offices right now</p>
                                        <p className="mt-1 text-sm text-slate-gray">
                                            When the team posts volunteer offices they show up here.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {visibleOffices.map((o) => {
                                            const app = o.myApplication;
                                            const activeApp = app && app.status !== "rejected" ? app : null;
                                            const isOpenForm = applyingId === o._id;
                                            return (
                                                <article
                                                    key={o._id}
                                                    className="flex flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                                                >
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        {o.area ? (
                                                            <span className="rounded-full bg-alice-blue px-2.5 py-0.5 text-xs font-semibold text-navy">
                                                                {o.area}
                                                            </span>
                                                        ) : null}
                                                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${OFFICE_CLS[o.status]}`}>
                                                            {OFFICE_LABEL[o.status]}
                                                        </span>
                                                        {app ? (
                                                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${APP_CLS[app.status]}`}>
                                                                Your application: {APP_LABEL[app.status]}
                                                            </span>
                                                        ) : null}
                                                    </div>

                                                    <h2 className="mt-3 text-lg font-bold text-navy">{o.title}</h2>
                                                    <p className="mt-1 text-xs text-slate-gray">Posted {dateText(o.createdAt)}</p>
                                                    <p className="mt-3 flex-1 whitespace-pre-line text-sm leading-relaxed text-gray-700">
                                                        {o.description}
                                                    </p>

                                                    <div className="mt-4 border-t border-gray-50 pt-4">
                                                        {o.status === "open" && !activeApp ? (
                                                            isOpenForm ? (
                                                                <div>
                                                                    <label className="block">
                                                                        <span className="mb-1 block text-xs font-semibold text-gray-600">
                                                                            Why do you want it?{" "}
                                                                            <span className="font-normal text-gray-400">
                                                                                ({motivation.trim().length}/20 min)
                                                                            </span>
                                                                        </span>
                                                                        <textarea
                                                                            value={motivation}
                                                                            onChange={(e) => setMotivation(e.target.value)}
                                                                            rows={3}
                                                                            placeholder="A short note on your interest and availability."
                                                                            className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none transition focus:border-cyan focus:ring-2 focus:ring-cyan/20"
                                                                        />
                                                                    </label>
                                                                    <div className="mt-3 flex gap-2">
                                                                        <button
                                                                            disabled={busy === o._id}
                                                                            onClick={() => apply(o)}
                                                                            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-cyan px-4 py-2 text-sm font-bold text-white shadow-md shadow-cyan/25 transition hover:bg-cyan-dark disabled:opacity-50"
                                                                        >
                                                                            {busy === o._id ? (
                                                                                <LuLoaderCircle className="animate-spin"/>
                                                                            ) : (
                                                                                <LuCheck/>
                                                                            )}
                                                                            Send application
                                                                        </button>
                                                                        <button
                                                                            onClick={() => {
                                                                                setApplyingId(null);
                                                                                setMotivation("");
                                                                            }}
                                                                            className="inline-flex min-h-11 items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-ghost-white"
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <button
                                                                    onClick={() => {
                                                                        setApplyingId(o._id);
                                                                        setError("");
                                                                    }}
                                                                    className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-cyan px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-cyan/25 transition hover:bg-cyan-dark"
                                                                >
                                                                    Apply for this office <LuArrowRight/>
                                                                </button>
                                                            )
                                                        ) : activeApp ? (
                                                            <p className="text-sm text-slate-gray">
                                                                {activeApp.status === "pending"
                                                                    ? "Your application is with the admins — you'll hear back either way."
                                                                    : activeApp.status === "approved"
                                                                      ? "You have this office — thank you!"
                                                                      : "This one wasn't a fit this time — you can apply again."}
                                                            </p>
                                                        ) : (
                                                            <p className="text-sm text-slate-gray">
                                                                This office has been filled.
                                                            </p>
                                                        )}
                                                    </div>
                                                </article>
                                            );
                                        })}
                                    </div>
                                )
                            ) : applications === null ? (
                                <p className="rounded-2xl border border-dashed border-gray-300 bg-white py-12 text-center text-sm text-slate-gray">
                                    <LuLoaderCircle className="mx-auto mb-2 animate-spin text-xl text-cyan"/> Loading your applications…
                                </p>
                            ) : applications.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-14 text-center">
                                    <LuCheck className="mx-auto mb-3 text-3xl text-slate-gray"/>
                                    <p className="font-semibold text-navy">You haven&rsquo;t applied yet</p>
                                    <p className="mt-1 text-sm text-slate-gray">
                                        Apply for an open office and track it here.
                                    </p>
                                    <button
                                        onClick={() => setTab("open")}
                                        className="mt-4 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-cyan-dark hover:underline"
                                    >
                                        Browse open offices <LuArrowRight/>
                                    </button>
                                </div>
                            ) : (
                                <div className="grid gap-3">
                                    {applications.map((a) => (
                                        <div key={a._id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                                            <div className="flex flex-wrap items-start justify-between gap-3">
                                                <div>
                                                    <p className="font-semibold text-navy">{a.office?.title || a.officeTitle}</p>
                                                    <p className="mt-0.5 text-xs text-slate-gray">Applied {dateText(a.createdAt)}</p>
                                                </div>
                                                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${APP_CLS[a.status]}`}>
                                                    {APP_LABEL[a.status]}
                                                </span>
                                            </div>
                                            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-gray-700">
                                                {a.motivation}
                                            </p>
                                            {a.reviewNote ? (
                                                <p className="mt-2 text-xs text-slate-gray">Admin: {a.reviewNote}</p>
                                            ) : null}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </>
    );
}
