"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { IconType } from "react-icons";
import {
    LuBell,
    LuBellRing,
    LuBriefcase,
    LuBuilding2,
    LuCalendarDays,
    LuCheckCheck,
    LuClipboardCheck,
    LuFileText,
    LuFlame,
    LuHandHeart,
    LuLifeBuoy,
    LuMessageSquare,
    LuShoppingBag,
    LuWallet,
} from "react-icons/lu";
import { useAuth } from "./AuthProvider";
import { notificationsApi, type AppNotification } from "@/lib/notifications";

const TYPE_META: Partial<Record<string, { icon: IconType; tone: string }>> = {
    help_reply: { icon: LuMessageSquare, tone: "bg-[#d4eef5] text-[#1d2a4d]" },
    help_assigned: { icon: LuLifeBuoy, tone: "bg-[#d1fae5] text-[#065f46]" },
    prayer_request: { icon: LuFlame, tone: "bg-[#fbf3d9] text-[#b45309]" },
    request_comment: { icon: LuMessageSquare, tone: "bg-[#fbf3d9] text-[#b45309]" },
    group_comment: { icon: LuMessageSquare, tone: "bg-[#fee2e2] text-[#b91c1c]" },
    event_rsvp: { icon: LuCalendarDays, tone: "bg-[#e0e7ff] text-[#4338ca]" },
    payment_recorded: { icon: LuShoppingBag, tone: "bg-[#d1fae5] text-[#065f46]" },
    financial_report: { icon: LuWallet, tone: "bg-[#d4eef5] text-[#1d2a4d]" },
    new_sponsorship: { icon: LuHandHeart, tone: "bg-[#fbf3d9] text-[#b45309]" },
    appraisal_assigned: { icon: LuClipboardCheck, tone: "bg-[#d4eef5] text-[#1d2a4d]" },
    board_meeting_scheduled: { icon: LuCalendarDays, tone: "bg-[#e0e7ff] text-[#4338ca]" },
    board_minutes_published: { icon: LuFileText, tone: "bg-[#d1fae5] text-[#047857]" },
    board_action_assigned: { icon: LuCheckCheck, tone: "bg-[#fef3c7] text-[#b45309]" },
    service_posted: { icon: LuBriefcase, tone: "bg-[#d4eef5] text-[#1d2a4d]" },
    office_posted: { icon: LuBuilding2, tone: "bg-[#d4eef5] text-[#1d2a4d]" },
};

function timeAgo(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    if (Number.isNaN(diff)) return "";
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

/** Where a notification should land on the web app, mirroring the mobile deep links. */
function routeFor(n: AppNotification): string | null {
    if (n.type.startsWith("board_")) {
        const toArchive =
            n.type === "board_minutes_published" ||
            n.type === "board_minutes_deleted" ||
            n.type.startsWith("board_action");
        return `/admin/board-governance${toArchive ? "/archive" : ""}`;
    }
    if (n.type === "financial_report") return "/financials";
    if (n.type === "new_sponsorship") return "/admin/financials";
    if (n.type === "sponsorship_approved" || n.type === "sponsorship_rejected") {
        return "/financials";
    }
    if (n.type === "smart_saver_credit" || n.type === "smart_saver_withdrawal") {
        return "/savings";
    }
    if (n.data?.appraisalId) return "/appraisals";
    if (n.data?.section === "services") return "/services";
    if (n.data?.section === "offices") return "/offices";
    if (n.data?.requestId) return "/requests";
    if (
        n.type === "prayer_request" ||
        n.type === "prayer_prayed" ||
        n.type === "request_comment"
    ) {
        return "/prayer-requests";
    }
    if (n.data?.tab) return "/membership";
    return null;
}

export default function NotificationsMenu({
    dropUp = false,
    align = "right",
}: {
    dropUp?: boolean;
    align?: "left" | "right";
}) {
    const { user } = useAuth();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState<AppNotification[]>([]);
    const [unread, setUnread] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const rootRef = useRef<HTMLDivElement>(null);

    const loadList = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const res = await notificationsApi.list();
            setItems(res.data || []);
            setUnread(res.unread || 0);
        } catch {
            setError("Couldn’t load your notifications.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!user) return;
        let cancelled = false;
        const tick = () =>
            notificationsApi
                .unreadCount()
                .then((res) => {
                    if (!cancelled) setUnread(res.unread || 0);
                })
                .catch(() => undefined);
        void tick();
        const timer = window.setInterval(() => void tick(), 60_000);
        return () => {
            cancelled = true;
            window.clearInterval(timer);
        };
    }, [user]);

    useEffect(() => {
        if (!open) return;
        const onDown = (e: MouseEvent) => {
            if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    if (!user) return null;

    const openItem = async (n: AppNotification) => {
        if (!n.read) {
            setItems((prev) => prev.map((x) => (x._id === n._id ? { ...x, read: true } : x)));
            setUnread((u) => Math.max(0, u - 1));
            notificationsApi
                .markRead(n._id)
                .then((r) => setUnread(r.unread))
                .catch(() => {});
        }
        const route = routeFor(n);
        if (!route) return;
        setOpen(false);
        router.push(route);
    };

    const markAllRead = async () => {
        setItems((prev) => prev.map((x) => ({ ...x, read: true })));
        setUnread(0);
        try {
            await notificationsApi.markAllRead();
        } catch {
            void loadList();
        }
    };

    const toggle = () => {
        if (!open) void loadList();
        setOpen((o) => !o);
    };

    return (
        <div ref={rootRef} className="relative">
            <button
                type="button"
                onClick={toggle}
                aria-label={unread > 0 ? `Notifications, ${unread} unread` : "Notifications"}
                aria-expanded={open}
                className={
                    "relative grid size-10 place-items-center rounded-full bg-alice-blue transition-all " +
                    (open
                        ? "ring-2 ring-[color:var(--club-accent)]"
                        : "ring-1 ring-gray-200 hover:ring-gray-400")
                }
            >
                {unread > 0 ? (
                    <LuBellRing className="text-lg text-navy" />
                ) : (
                    <LuBell className="text-lg text-navy/70" />
                )}
                {unread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[color:var(--club-accent)] px-1 text-[10px] font-bold text-white">
                        {unread > 9 ? "9+" : unread}
                    </span>
                )}
            </button>

            {open && (
                <div
                    className={`absolute z-50 w-[22rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl ${
                        align === "left" ? "left-0" : "right-0"
                    } ${dropUp ? "bottom-full mb-2" : "top-full mt-2"}`}
                >
                    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                        <p className="text-sm font-semibold text-gray-800">Notifications</p>
                        {unread > 0 && (
                            <button
                                type="button"
                                onClick={markAllRead}
                                className="text-xs font-semibold text-[color:var(--club-accent-dark)] hover:underline"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="max-h-[60vh] overflow-y-auto">
                        {loading ? (
                            <p className="px-4 py-10 text-center text-sm text-gray-500">
                                Loading notifications…
                            </p>
                        ) : error ? (
                            <div className="px-4 py-8 text-center">
                                <p className="text-sm text-gray-600">{error}</p>
                                <button
                                    type="button"
                                    onClick={() => void loadList()}
                                    className="mt-2 text-sm font-semibold text-[color:var(--club-accent-dark)] hover:underline"
                                >
                                    Try again
                                </button>
                            </div>
                        ) : items.length === 0 ? (
                            <div className="px-4 py-10 text-center">
                                <LuBell className="mx-auto text-2xl text-gray-300" />
                                <p className="mt-2 text-sm font-medium text-gray-700">
                                    No notifications yet
                                </p>
                                <p className="mt-1 text-xs text-gray-500">
                                    Updates about your requests and community will land here.
                                </p>
                            </div>
                        ) : (
                            <ul>
                                {items.map((n) => {
                                    const meta = TYPE_META[n.type] || {
                                        icon: LuBell,
                                        tone: "bg-alice-blue text-[color:var(--club-accent-dark)]",
                                    };
                                    const Icon = meta.icon;
                                    return (
                                        <li key={n._id}>
                                            <button
                                                type="button"
                                                onClick={() => void openItem(n)}
                                                className={
                                                    "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-alice-blue " +
                                                    (n.read ? "" : "bg-[#f7fdff]")
                                                }
                                            >
                                                <span
                                                    className={`mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl ${meta.tone}`}
                                                >
                                                    <Icon className="text-base" />
                                                </span>
                                                <span className="min-w-0 flex-1">
                                                    <span className="flex items-center gap-1.5">
                                                        <span className="truncate text-[13px] font-semibold text-gray-800">
                                                            {n.title}
                                                        </span>
                                                        {!n.read && (
                                                            <span className="size-1.5 shrink-0 rounded-full bg-[color:var(--club-accent)]" />
                                                        )}
                                                    </span>
                                                    <span className="mt-0.5 block text-xs leading-5 text-gray-500">
                                                        {n.body}
                                                    </span>
                                                    <span className="mt-0.5 block text-[11px] text-gray-400">
                                                        {timeAgo(n.createdAt)}
                                                    </span>
                                                </span>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
