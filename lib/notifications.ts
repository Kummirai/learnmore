/**
 * In-app notifications — the wire contract shared with the backend's
 * /api/notifications routes and the mobile app's notification service.
 */

export type NotificationData = {
    requestId?: string;
    section?: string;
    tab?: string;
    filter?: string;
    itemId?: string;
    reportId?: string;
    appraisalId?: string;
    period?: string;
};

export type AppNotification = {
    _id: string;
    type: string;
    title: string;
    body: string;
    data?: NotificationData;
    read: boolean;
    createdAt: string;
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

export const notificationsApi = {
    /** Current member's notifications, newest first, plus the unread count. */
    list: () => apiFetch<{ data: AppNotification[]; unread: number }>("/api/notifications"),

    /** Lightweight unread count for the bell badge. */
    unreadCount: () => apiFetch<{ unread: number }>("/api/notifications/unread"),

    markAllRead: () => apiFetch<{ success: boolean }>("/api/notifications", { method: "POST" }),

    /** Marks ONE notification as read and returns the remaining unread count. */
    markRead: (id: string) =>
        apiFetch<{ success: boolean; unread: number }>(`/api/notifications/${id}`, {
            method: "POST",
        }),
};
