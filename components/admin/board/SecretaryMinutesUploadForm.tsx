"use client";

import {useState} from "react";
import {LuFilePlus2, LuPlus, LuX} from "react-icons/lu";
import {Button, Card, Field, Input, Select, TextArea} from "@/components/admin/ui";
import {
    boardApi,
    shortDateLabel,
    type BoardMeeting,
    type BoardMember,
} from "@/lib/board";

type TaskDraft = {
    key: string;
    description: string;
    assigneeId: string;
    dueDate: string;
};

function newTask(assigneeId: string): TaskDraft {
    return {
        key: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        description: "",
        assigneeId,
        dueDate: "",
    };
}

export default function SecretaryMinutesUploadForm({
    meetings,
    boardMembers,
    onPublished,
}: {
    meetings: BoardMeeting[];
    boardMembers: BoardMember[];
    onPublished: () => void;
}) {
    const [meetingId, setMeetingId] = useState(meetings[0]?._id ?? "");
    const [attendance, setAttendance] = useState<Record<string, "ATTENDING" | "APOLOGY">>({});
    const [summary, setSummary] = useState("");
    const [documentUrl, setDocumentUrl] = useState("");
    const [documentName, setDocumentName] = useState("");
    const [uploading, setUploading] = useState(false);
    const [tasks, setTasks] = useState<TaskDraft[]>([]);
    const [publishing, setPublishing] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const activeMeeting = meetings.find((m) => m._id === meetingId) ?? meetings[0] ?? null;

    const statusFor = (memberId: string): "ATTENDING" | "APOLOGY" => {
        const chosen = attendance[memberId];
        if (chosen) return chosen;
        const rsvp = activeMeeting?.rsvps.find((r) => r.userId === memberId);
        return rsvp?.status === "APOLOGY" ? "APOLOGY" : "ATTENDING";
    };

    const mark = (memberId: string, status: "ATTENDING" | "APOLOGY") => {
        setAttendance((current) => ({...current, [memberId]: status}));
    };

    const upload = async (file: File | undefined) => {
        if (!file) return;
        setError("");
        setUploading(true);
        try {
            const uploaded = await boardApi.uploadMinutesDocument(file);
            setDocumentUrl(uploaded.url);
            setDocumentName(uploaded.fileName || file.name);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const updateTask = (key: string, patch: Partial<TaskDraft>) => {
        setTasks((current) => current.map((task) => (task.key === key ? {...task, ...patch} : task)));
    };

    const publish = async () => {
        setError("");
        setSuccess("");
        if (!activeMeeting) {
            setError("Choose the meeting these minutes belong to.");
            return;
        }
        if (!documentUrl.trim()) {
            setError("Upload the signed minutes or paste a document link.");
            return;
        }
        if (!summary.trim()) {
            setError("Record the key decisions from the meeting.");
            return;
        }

        const filled = tasks.filter((task) => task.description.trim() || task.assigneeId);
        const incomplete = filled.find((task) => !task.description.trim() || !task.assigneeId);
        if (incomplete) {
            setError("Every action item needs a task and an assignee.");
            return;
        }

        setPublishing(true);
        try {
            await boardApi.publishMinutes({
                meetingId: activeMeeting._id,
                summary: summary.trim(),
                minutesDocumentUrl: documentUrl.trim(),
                attendance: boardMembers.map((member) => ({
                    userId: member.id,
                    status: statusFor(member.id),
                })),
                actionItems: filled.map((task) => ({
                    assigneeId: task.assigneeId,
                    taskDescription: task.description.trim(),
                    dueDate: task.dueDate.trim() || null,
                })),
            });
            setSummary("");
            setDocumentUrl("");
            setDocumentName("");
            setAttendance({});
            setTasks([]);
            setSuccess("Minutes published — the board was notified and action items are on their trackers.");
            onPublished();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Could not publish the minutes.");
        } finally {
            setPublishing(false);
        }
    };

    if (!meetings.length) {
        return (
            <Card className="text-center">
                <p className="text-sm font-semibold text-navy">No past meetings to minute</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-gray">
                    Minutes are logged for meetings that have already taken place. Schedule
                    one from the Meetings tab first.
                </p>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <Card>
                <h2 className="text-sm font-bold text-navy">Log meeting minutes</h2>
                <p className="mb-4 mt-1 text-xs leading-relaxed text-slate-gray">
                    Minutes are due within 48 hours. Late logs are still accepted and flagged
                    in the archive.
                </p>

                <div className="space-y-3">
                    <Field label="Meeting">
                        <Select
                            value={activeMeeting?._id ?? ""}
                            onChange={(e) => setMeetingId(e.target.value)}
                        >
                            {meetings.map((meeting) => (
                                <option key={meeting._id} value={meeting._id}>
                                    {meeting.title} — {shortDateLabel(meeting.scheduledDate)}
                                </option>
                            ))}
                        </Select>
                    </Field>

                    <div>
                        <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-slate-gray">
                            Attendance register
                        </span>
                        <div className="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white">
                            {boardMembers.map((member) => {
                                const status = statusFor(member.id);
                                return (
                                    <div
                                        key={member.id}
                                        className="flex items-center justify-between gap-3 px-3 py-2.5"
                                    >
                                        <span className="min-w-0 truncate text-sm text-gray-700">
                                            {member.name}
                                        </span>
                                        <div className="flex shrink-0 gap-1.5">
                                            {(["ATTENDING", "APOLOGY"] as const).map((option) => {
                                                const on = status === option;
                                                return (
                                                    <button
                                                        key={option}
                                                        type="button"
                                                        onClick={() => mark(member.id, option)}
                                                        className={`rounded-full border px-3 py-1 text-[11px] font-semibold transition ${
                                                            on
                                                                ? option === "ATTENDING"
                                                                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                                                    : "border-rose-200 bg-rose-50 text-rose-700"
                                                                : "border-gray-200 bg-white text-slate-gray hover:bg-alice-blue"
                                                        }`}
                                                    >
                                                        {option === "ATTENDING" ? "Present" : "Apology"}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <Field label="Summary & key decisions">
                        <TextArea
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            placeholder="Budget approved, safeguarding policy adopted, Q1 venue confirmed…"
                            maxLength={20000}
                            className="min-h-[120px]"
                        />
                    </Field>

                    <div>
                        <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-slate-gray">
                            Signed minutes
                        </span>
                        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-alice-blue px-4 py-4 text-sm font-medium text-slate-gray transition hover:border-cyan/50 hover:text-navy">
                            <LuFilePlus2 className="text-cyan"/>
                            {uploading ? "Uploading…" : "Choose a PDF or photo of the signed minutes"}
                            <input
                                type="file"
                                accept="application/pdf,image/png,image/jpeg,image/webp,image/heic,image/heif"
                                className="hidden"
                                disabled={uploading}
                                onChange={(e) => void upload(e.target.files?.[0])}
                            />
                        </label>
                        {documentName ? (
                            <p className="mt-1.5 truncate text-xs font-semibold text-cyan">{documentName}</p>
                        ) : null}
                        <p className="mt-1 text-xs text-gray-400">
                            PDFs and images up to 4&nbsp;MB are stored securely for the archive.
                        </p>
                        <div className="mt-2">
                            <Input
                                value={documentUrl}
                                onChange={(e) => {
                                    setDocumentUrl(e.target.value);
                                    if (!e.target.value) setDocumentName("");
                                }}
                                placeholder="…or paste a PDF / document link"
                            />
                        </div>
                    </div>
                </div>
            </Card>

            <Card>
                <h2 className="text-sm font-bold text-navy">Action items</h2>
                <p className="mb-3 mt-1 text-xs leading-relaxed text-slate-gray">
                    Assign each task to a board member; they can move it from pending to done
                    on the tracker.
                </p>

                <div className="space-y-3">
                    {tasks.map((task, index) => (
                        <div key={task.key} className="rounded-xl border border-gray-200 bg-alice-blue/60 p-3">
                            <div className="mb-2 flex items-center justify-between">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-gray">
                                    Task {index + 1}
                                </span>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setTasks((current) => current.filter((t) => t.key !== task.key))
                                    }
                                    className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700"
                                >
                                    <LuX className="text-sm"/> Remove
                                </button>
                            </div>
                            <div className="grid gap-2 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <Input
                                        value={task.description}
                                        onChange={(e) =>
                                            updateTask(task.key, {description: e.target.value})
                                        }
                                        placeholder="What must be done?"
                                        maxLength={600}
                                    />
                                </div>
                                <Field label="Assignee">
                                    <Select
                                        value={task.assigneeId}
                                        onChange={(e) =>
                                            updateTask(task.key, {assigneeId: e.target.value})
                                        }
                                    >
                                        <option value="">Choose a member</option>
                                        {boardMembers.map((member) => (
                                            <option key={member.id} value={member.id}>
                                                {member.name}
                                            </option>
                                        ))}
                                    </Select>
                                </Field>
                                <Field label="Due date">
                                    <Input
                                        type="date"
                                        value={task.dueDate}
                                        onChange={(e) => updateTask(task.key, {dueDate: e.target.value})}
                                    />
                                </Field>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={() => setTasks((current) => [...current, newTask(boardMembers[0]?.id || "")])}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-cyan/30 bg-cyan/5 px-3.5 py-2 text-xs font-semibold text-cyan transition hover:bg-cyan/10"
                >
                    <LuPlus className="text-sm"/> Add action item
                </button>
            </Card>

            {error ? (
                <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            ) : null}
            {success ? (
                <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{success}</p>
            ) : null}

            <div className="flex justify-end">
                <Button onClick={publish} disabled={publishing || uploading} variant="accent">
                    {publishing ? "Publishing…" : "Publish minutes & notify board"}
                </Button>
            </div>
        </div>
    );
}
