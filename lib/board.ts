/**
 * Board governance — the wire contract shared with the backend's /api/board
 * routes and the mobile app's board service.
 */

export type RsvpStatus = "ATTENDING" | "APOLOGY" | "PENDING";
export type MeetingStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED";
export type TaskStatus = "PENDING" | "IN_PROGRESS" | "DONE";

export type BoardMember = {
    id: string;
    name: string;
    email: string;
    role: string;
};

export type BoardRsvp = {
    userId: string;
    name: string;
    role: string;
    status: RsvpStatus;
};

export type MeetingCounts = {
    attending: number;
    apologies: number;
    pending: number;
    total: number;
};

export type BoardMeeting = {
    _id: string;
    title: string;
    scheduledDate: string | null;
    location: string;
    agenda: string[];
    rsvps: BoardRsvp[];
    status: MeetingStatus;
    createdAt: string | null;
    updatedAt: string | null;
    counts: MeetingCounts;
};

export type BoardActionItem = {
    taskId: string;
    assigneeId: string;
    assigneeName: string;
    taskDescription: string;
    dueDate: string | null;
    status: TaskStatus;
};

export type TaskCounts = {
    pending: number;
    inProgress: number;
    done: number;
    total: number;
};

export type BoardMinutes = {
    _id: string;
    meetingId: string;
    meetingTitle: string;
    meetingDate: string | null;
    publishedBy: string;
    publishedByName: string;
    publishedAt: string | null;
    hoursAfterMeeting: number | null;
    within48h: boolean;
    summary: string;
    minutesDocumentUrl: string;
    actionItems: BoardActionItem[];
    createdAt: string | null;
    updatedAt: string | null;
    counts: TaskCounts;
};

export type MeetingListResponse = {
    data: BoardMeeting[];
    boardMembers: BoardMember[];
    currentUserId?: string;
};

export type MinutesListResponse = {
    data: BoardMinutes[];
    boardMembers: BoardMember[];
    currentUserId?: string;
};

export type AttendanceInput = { userId: string; status: "ATTENDING" | "APOLOGY" };

export type ActionItemInput = {
    assigneeId: string;
    taskDescription: string;
    dueDate?: string | null;
};

export type PublishMinutesInput = {
    meetingId: string;
    summary: string;
    minutesDocumentUrl: string;
    attendance: AttendanceInput[];
    actionItems: ActionItemInput[];
};

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(path, {
        cache: "no-store",
        credentials: "same-origin",
        ...init,
    });
    const json = await res.json().catch(() => null);
    if (!res.ok) {
        throw new Error(json?.error || "Something went wrong. Please try again.");
    }
    return json as T;
}

export const boardApi = {
    listMeetings: (scope: "upcoming" | "past" | "all" = "upcoming") =>
        apiFetch<MeetingListResponse>(`/api/board/meetings?scope=${scope}`),

    createMeeting: (input: {
        title: string;
        scheduledDate: string;
        location: string;
        agenda: string[];
    }) =>
        apiFetch<{ data: BoardMeeting }>("/api/board/meetings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input),
        }),

    updateMeeting: (
        id: string,
        input: Partial<{
            title: string;
            scheduledDate: string;
            location: string;
            agenda: string[];
            status: MeetingStatus;
        }>,
    ) =>
        apiFetch<{ data: BoardMeeting }>(`/api/board/meetings/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input),
        }),

    rsvp: (id: string, status: "ATTENDING" | "APOLOGY") =>
        apiFetch<{ data: BoardMeeting }>(`/api/board/meetings/${id}/rsvp`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        }),

    listMinutes: (search = "", filter = "all") =>
        apiFetch<MinutesListResponse>(
            `/api/board/minutes?filter=${encodeURIComponent(filter)}&search=${encodeURIComponent(search)}`,
        ),

    publishMinutes: (input: PublishMinutesInput) =>
        apiFetch<{ data: BoardMinutes }>("/api/board/minutes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input),
        }),

    updateTask: (minutesId: string, taskId: string, status: TaskStatus) =>
        apiFetch<{ data: { task: BoardActionItem | null; counts: TaskCounts } }>(
            `/api/board/minutes/${minutesId}/tasks/${taskId}`,
            {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            },
        ),

    /** Sends the signed PDF or image to the backend, which stores it in Cloudinary. */
    uploadMinutesDocument: async (file: File) => {
        const body = new FormData();
        body.append("file", file);
        const res = await fetch("/api/board/uploads", { method: "POST", body });
        const json = await res.json().catch(() => null);
        if (!res.ok || !json?.url) {
            throw new Error(json?.error || "Upload failed. Please try again.");
        }
        return json as { url: string; path: string; fileName: string | null };
    },
};

export function meetingDateLabel(value: string | null): string {
    if (!value) return "Date to be confirmed";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString("en-ZA", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function shortDateLabel(value: string | null): string {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("en-ZA", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}
