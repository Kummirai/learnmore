"use client";

import {useState} from "react";
import {LuCalendarPlus, LuCornerDownRight, LuPlus, LuX} from "react-icons/lu";
import {Button, Card, Field, Input} from "@/components/admin/ui";
import {boardApi, type AgendaItem, type BoardMeeting} from "@/lib/board";

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
    const [agenda, setAgenda] = useState<AgendaItem[]>([{text: "", subs: []}]);
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
                agenda: agenda
                    .map((item) => ({
                        text: item.text.trim(),
                        subs: item.subs.map((sub) => sub.trim()).filter(Boolean),
                    }))
                    .filter((item) => item.text),
            });
            setTitle("");
            setAgenda([{text: "", subs: []}]);
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
                            onClick={() =>
                                setAgenda((current) => [...current, {text: "", subs: []}])
                            }
                            className="inline-flex items-center gap-1 text-xs font-semibold text-cyan hover:text-cyan-dark"
                        >
                            <LuPlus className="text-sm"/> Add point
                        </button>
                    </div>
                    <div className="space-y-3">
                        {agenda.map((item, index) => {
                            const patch = (next: Partial<AgendaItem>) =>
                                setAgenda((current) =>
                                    current.map((entry, i) => (i === index ? {...entry, ...next} : entry)),
                                );
                            return (
                                <div key={`agenda-${index}`} className="space-y-1.5">
                                    <div className="flex items-center gap-2">
                                        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-alice-blue text-[10px] font-bold text-navy">
                                            {index + 1}
                                        </span>
                                        <Input
                                            value={item.text}
                                            onChange={(e) => patch({text: e.target.value})}
                                            placeholder="Budget review, safeguarding update…"
                                            maxLength={240}
                                        />
                                        <button
                                            type="button"
                                            aria-label="Remove agenda point"
                                            onClick={() =>
                                                setAgenda((current) =>
                                                    current.length === 1
                                                        ? [{text: "", subs: []}]
                                                        : current.filter((_, i) => i !== index),
                                                )
                                            }
                                            className="grid size-8 shrink-0 place-items-center rounded-lg text-slate-gray transition hover:bg-alice-blue hover:text-navy"
                                        >
                                            <LuX/>
                                        </button>
                                    </div>

                                    {item.subs.map((sub, subIndex) => (
                                        <div
                                            key={`agenda-${index}-sub-${subIndex}`}
                                            className="flex items-center gap-2 pl-8"
                                        >
                                            <span className="w-6 shrink-0 text-[10px] font-semibold text-cyan">
                                                {`${index + 1}${String.fromCharCode(97 + subIndex)}`}
                                            </span>
                                            <Input
                                                value={sub}
                                                onChange={(e) =>
                                                    patch({
                                                        subs: item.subs.map((entry, i) =>
                                                            i === subIndex ? e.target.value : entry,
                                                        ),
                                                    })
                                                }
                                                placeholder="Sub-point detail"
                                                maxLength={240}
                                            />
                                            <button
                                                type="button"
                                                aria-label={`Remove sub-point ${index + 1}${String.fromCharCode(97 + subIndex)}`}
                                                onClick={() =>
                                                    patch({subs: item.subs.filter((_, i) => i !== subIndex)})
                                                }
                                                className="grid size-8 shrink-0 place-items-center rounded-lg text-slate-gray transition hover:bg-alice-blue hover:text-navy"
                                            >
                                                <LuX/>
                                            </button>
                                        </div>
                                    ))}

                                    <button
                                        type="button"
                                        onClick={() => patch({subs: [...item.subs, ""]})}
                                        className="ml-8 inline-flex items-center gap-1 text-[11px] font-semibold text-cyan hover:text-cyan-dark"
                                    >
                                        <LuCornerDownRight className="text-xs"/> Add sub-point
                                    </button>
                                </div>
                            );
                        })}
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
