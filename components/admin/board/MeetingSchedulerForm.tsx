"use client";

import {useState} from "react";
import {LuCalendarPlus, LuPlus, LuX} from "react-icons/lu";
import {Button, Card, Field, Input} from "@/components/admin/ui";
import {boardApi, type BoardMeeting} from "@/lib/board";

function todayIso(): string {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${now.getFullYear()}-${month}-${day}`;
}

function combine(date: string, time: string): string | null {
    const parsed = new Date(`${date.trim()}T${(time || "09:00").trim()}:00`);
    return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

export default function MeetingSchedulerForm({
    onCreated,
}: {
    onCreated: (meeting: BoardMeeting) => void;
}) {
    const [title, setTitle] = useState("");
    const [date, setDate] = useState(todayIso());
    const [time, setTime] = useState("09:00");
    const [location, setLocation] = useState("Relate World HQ");
    const [agenda, setAgenda] = useState<string[]>([""]);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const submit = async () => {
        setError("");
        setSuccess("");
        if (!title.trim()) {
            setError("Give the meeting a clear title.");
            return;
        }
        const scheduledDate = combine(date, time);
        if (!scheduledDate) {
            setError("Choose a valid date and time.");
            return;
        }
        setSaving(true);
        try {
            const res = await boardApi.createMeeting({
                title: title.trim(),
                scheduledDate,
                location: location.trim(),
                agenda: agenda.map((item) => item.trim()).filter(Boolean),
            });
            setTitle("");
            setAgenda([""]);
            setSuccess("Meeting scheduled — every board member was notified by app, push and email.");
            onCreated(res.data);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Could not schedule the meeting.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Card>
            <div className="mb-1 flex items-center gap-2">
                <LuCalendarPlus className="text-cyan"/>
                <h2 className="text-sm font-bold text-navy">Schedule a board meeting</h2>
            </div>
            <p className="mb-4 text-xs leading-relaxed text-slate-gray">
                Board members are the admin team — everyone is invited, and told again by
                app, push and email when the details change.
            </p>

            <div className="space-y-3">
                <Field label="Meeting title">
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Q4 Seasonal Board Sync & Budget Audit"
                        maxLength={160}
                    />
                </Field>

                <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Date">
                        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)}/>
                    </Field>
                    <Field label="Time">
                        <Input type="time" value={time} onChange={(e) => setTime(e.target.value)}/>
                    </Field>
                </div>

                <Field label="Location">
                    <Input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Relate World HQ / Virtual"
                        maxLength={160}
                    />
                </Field>

                <div>
                    <div className="mb-1.5 flex items-center justify-between">
                        <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-gray">
                            Agenda
                        </span>
                        <button
                            type="button"
                            onClick={() => setAgenda((current) => [...current, ""])}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-cyan hover:text-cyan-dark"
                        >
                            <LuPlus className="text-sm"/> Add point
                        </button>
                    </div>
                    <div className="space-y-2">
                        {agenda.map((item, index) => (
                            <div key={`agenda-${index}`} className="flex items-center gap-2">
                                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-alice-blue text-[10px] font-bold text-navy">
                                    {index + 1}
                                </span>
                                <Input
                                    value={item}
                                    onChange={(e) =>
                                        setAgenda((current) =>
                                            current.map((entry, i) => (i === index ? e.target.value : entry)),
                                        )
                                    }
                                    placeholder="Budget review, safeguarding update…"
                                    maxLength={240}
                                />
                                <button
                                    type="button"
                                    aria-label="Remove agenda point"
                                    onClick={() =>
                                        setAgenda((current) =>
                                            current.length === 1 ? [""] : current.filter((_, i) => i !== index),
                                        )
                                    }
                                    className="grid size-8 shrink-0 place-items-center rounded-lg text-slate-gray transition hover:bg-alice-blue hover:text-navy"
                                >
                                    <LuX/>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {error ? (
                <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            ) : null}
            {success ? (
                <p className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{success}</p>
            ) : null}

            <div className="mt-4 flex justify-end">
                <Button onClick={submit} disabled={saving} variant="accent">
                    {saving ? "Scheduling…" : "Schedule & notify board"}
                </Button>
            </div>
        </Card>
    );
}
