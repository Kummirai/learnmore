"use client";

import {useCallback, useEffect, useState} from "react";
import Link from "next/link";
import {
    LuArrowRight,
    LuCalendarDays,
    LuCheckCheck,
    LuClipboardList,
    LuMapPin,
    LuTrash2,
    LuVideo,
} from "react-icons/lu";
import {AdminHeader} from "@/components/admin/ui";
import BoardTabs from "@/components/admin/board/BoardTabs";
import MeetingSchedulerForm from "@/components/admin/board/MeetingSchedulerForm";
import {
    boardApi,
    meetingDateLabel,
    type BoardMeeting,
    type BoardMinutes,
} from "@/lib/board";

const LINKS = [
    {
        href: "/admin/board-governance/minutes",
        label: "Log minutes",
        body: "Attendance, decisions, the signed document and action items.",
        icon: LuClipboardList,
    },
    {
        href: "/admin/board-governance/archive",
        label: "Minutes",
        body: "Browse past sittings and track every action item to done.",
        icon: LuCalendarDays,
    },
];

export default function BoardGovernancePage() {
    const [meetings, setMeetings] = useState<BoardMeeting[]>([]);
    const [minutes, setMinutes] = useState<BoardMinutes[]>([]);
    const [userId, setUserId] = useState("");
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState("");
    const [error, setError] = useState("");
    const [reasons, setReasons] = useState<Record<string, string>>({});

    const load = useCallback(async () => {
        try {
            setError("");
            const [upcoming, archive] = await Promise.all([
                boardApi.listMeetings("upcoming"),
                boardApi.listMinutes(),
            ]);
            setMeetings(upcoming.data || []);
            setUserId(upcoming.currentUserId || "");
            setMinutes(archive.data || []);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Could not load the board calendar.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void Promise.resolve().then(() => load());
    }, [load]);

    const respond = async (meeting: BoardMeeting, status: "ATTENDING" | "APOLOGY") => {
        if (busy) return;
        setBusy(meeting._id);
        try {
            const existing = meeting.rsvps.find((r) => r.userId === userId)?.reason || "";
            const reason =
                status === "APOLOGY" ? (reasons[meeting._id] ?? existing).trim() : undefined;
            const res = await boardApi.rsvp(meeting._id, status, reason);
            setMeetings((current) =>
                current.map((item) => (item._id === meeting._id ? res.data : item)),
            );
            const mine = res.data.rsvps.find((r) => r.userId === userId);
            setReasons((current) => ({...current, [meeting._id]: mine?.reason || ""}));
        } catch (e) {
            setError(e instanceof Error ? e.message : "Could not save your RSVP.");
        } finally {
            setBusy("");
        }
    };

    const removeMeeting = async (meeting: BoardMeeting) => {
        if (
            !window.confirm(
                `Delete "${meeting.title}"? It leaves the schedule and the board is told.`,
            )
        ) {
            return;
        }
        setBusy(meeting._id);
        try {
            await boardApi.deleteMeeting(meeting._id);
            setMeetings((current) => current.filter((item) => item._id !== meeting._id));
        } catch (e) {
            setError(e instanceof Error ? e.message : "Could not delete the meeting.");
        } finally {
            setBusy("");
        }
    };

    const openActions = minutes.reduce((sum, entry) => sum + entry.counts.total - entry.counts.done, 0);

    const metrics = [
        {label: "Upcoming sittings", value: loading ? "—" : String(meetings.length)},
        {label: "Minuted sittings", value: loading ? "—" : String(minutes.length)},
        {label: "Open actions", value: loading ? "—" : String(openActions)},
    ];

    return (
        <div>
            <AdminHeader
                eyebrow="Governance"
                title="Board & Meetings"
                sub="Schedule sittings, log minutes within 48 hours and keep every action accountable to a person and a date."
            />
            <BoardTabs/>

            <div className="grid gap-2.5 sm:grid-cols-3">
                {metrics.map((metric) => (
                    <div key={metric.label} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                        <p className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-slate-gray">
                            {metric.label}
                        </p>
                        <p className="mt-2 text-2xl font-semibold leading-none text-navy">{metric.value}</p>
                    </div>
                ))}
            </div>

            {error ? (
                <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            ) : null}

            <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
                <MeetingSchedulerForm
                    onCreated={(meeting) => setMeetings((current) => [meeting, ...current])}
                />

                <div className="space-y-3">
                    {LINKS.map((link) => {
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="group flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:border-cyan/40"
                            >
                                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-alice-blue text-navy">
                                    <Icon/>
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="block text-sm font-semibold text-navy">{link.label}</span>
                                    <span className="mt-0.5 block text-xs leading-relaxed text-slate-gray">
                                        {link.body}
                                    </span>
                                </span>
                                <LuArrowRight className="mt-1 shrink-0 text-slate-gray transition group-hover:translate-x-0.5 group-hover:text-navy"/>
                            </Link>
                        );
                    })}
                    <div className="rounded-2xl border border-dashed border-gray-200 bg-alice-blue/60 p-4">
                        <p className="flex items-center gap-1.5 text-xs font-semibold text-navy">
                            <LuCheckCheck className="text-cyan"/> The 48-hour rule
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-slate-gray">
                            Minutes are due within 48 hours of a sitting. Late logs are accepted
                            but flagged in the archive.
                        </p>
                    </div>
                </div>
            </div>

            <section className="mt-8">
                <div className="mb-2.5 flex items-end justify-between">
                    <h2 className="text-sm font-semibold text-navy">Upcoming sittings</h2>
                    <span className="text-xs text-slate-gray">
                        {loading ? "Loading…" : `${meetings.length} scheduled`}
                    </span>
                </div>

                {loading ? (
                    <div className="space-y-3">
                        {[0, 1].map((index) => (
                            <div key={index} className="h-40 animate-pulse rounded-2xl border border-gray-100 bg-white"/>
                        ))}
                    </div>
                ) : meetings.length === 0 ? (
                    <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center">
                        <p className="text-sm font-semibold text-navy">Nothing on the calendar</p>
                        <p className="mt-1 text-xs text-slate-gray">
                            Schedule the next sitting above and everyone on the board is notified.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {meetings.map((meeting) => {
                            const mine = meeting.rsvps.find((r) => r.userId === userId);
                            const myStatus = mine?.status ?? "PENDING";
                            return (
                                <article
                                    key={meeting._id}
                                    className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5"
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <h3 className="text-sm font-bold text-navy">{meeting.title}</h3>
                                            <p className="mt-0.5 text-xs text-slate-gray">
                                                {meetingDateLabel(meeting.scheduledDate)}
                                            </p>
                                            <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-gray">
                                                <LuMapPin className="text-[11px]"/> {meeting.location}
                                            </p>
                                            {meeting.meetingLink ? (
                                                <a
                                                    href={meeting.meetingLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-cyan px-3 py-1 text-[11px] font-bold text-navy transition hover:bg-cyan-dark"
                                                >
                                                    <LuVideo className="text-[12px]"/> Join online
                                                </a>
                                            ) : null}
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                                                {meeting.counts.attending} attending
                                            </span>
                                            <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold text-rose-700">
                                                {meeting.counts.apologies} apologies
                                            </span>
                                            <span className="rounded-full bg-alice-blue px-2.5 py-0.5 text-[11px] font-semibold text-slate-gray">
                                                {meeting.counts.pending} awaiting
                                            </span>
                                        </div>
                                    </div>

                                    {meeting.agenda.length > 0 ? (
                                        <ol className="mt-3 space-y-1 border-t border-gray-100 pt-3">
                                            {meeting.agenda.map((item, index) => (
                                                <li key={`${meeting._id}-agenda-${index}`} className="space-y-1">
                                                    <div className="flex gap-2 text-sm text-gray-700">
                                                        <span className="w-4 shrink-0 text-xs font-bold leading-5 text-cyan">
                                                            {index + 1}
                                                        </span>
                                                        <span className="leading-5">{item.text}</span>
                                                    </div>
                                                    {item.subs.map((sub, subIndex) => (
                                                        <div
                                                            key={`${meeting._id}-agenda-${index}-${subIndex}`}
                                                            className="flex gap-2 pl-4 text-xs text-slate-gray"
                                                        >
                                                            <span className="w-6 shrink-0 font-semibold leading-5 text-cyan">
                                                                {`${index + 1}${String.fromCharCode(97 + subIndex)}`}
                                                            </span>
                                                            <span className="leading-5">{sub}</span>
                                                        </div>
                                                    ))}
                                                </li>
                                            ))}
                                        </ol>
                                    ) : null}

                                    <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3">
                                        <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-gray">
                                            Your RSVP
                                        </span>
                                        {(["ATTENDING", "APOLOGY"] as const).map((status) => {
                                            const on = myStatus === status;
                                            return (
                                                <button
                                                    key={status}
                                                    type="button"
                                                    disabled={!!busy}
                                                    onClick={() => void respond(meeting, status)}
                                                    className={`rounded-full border px-3.5 py-1 text-xs font-semibold transition ${
                                                        on
                                                            ? status === "ATTENDING"
                                                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                                                : "border-rose-200 bg-rose-50 text-rose-700"
                                                            : "border-gray-200 bg-white text-slate-gray hover:bg-alice-blue"
                                                    }`}
                                                >
                                                    {busy === meeting._id
                                                        ? "Saving…"
                                                        : status === "ATTENDING"
                                                          ? "Attending"
                                                          : "Apology"}
                                                </button>
                                            );
                                        })}
                                        <button
                                            type="button"
                                            disabled={!!busy}
                                            onClick={() => void removeMeeting(meeting)}
                                            className="ml-auto inline-flex items-center gap-1 rounded-full border border-rose-200 bg-white px-3 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-50"
                                        >
                                            <LuTrash2 className="text-[12px]"/> Delete
                                        </button>
                                    </div>

                                    {myStatus === "APOLOGY" ? (
                                        <div className="mt-2.5 flex flex-wrap items-center gap-2">
                                            <input
                                                value={reasons[meeting._id] ?? mine?.reason ?? ""}
                                                onChange={(e) =>
                                                    setReasons((current) => ({
                                                        ...current,
                                                        [meeting._id]: e.target.value,
                                                    }))
                                                }
                                                placeholder="Reason for your apology (optional)"
                                                maxLength={300}
                                                className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 outline-none transition focus:border-cyan/50"
                                            />
                                            <button
                                                type="button"
                                                disabled={!!busy}
                                                onClick={() => void respond(meeting, "APOLOGY")}
                                                className="rounded-full border border-navy/15 btn-signin px-3.5 py-1.5 text-xs font-semibold text-white transition hover:brightness-95"
                                            >
                                                Save reason
                                            </button>
                                        </div>
                                    ) : null}
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
}
