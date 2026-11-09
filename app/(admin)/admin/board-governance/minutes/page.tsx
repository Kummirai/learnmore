"use client";

import {useCallback, useEffect, useState} from "react";
import {LuClock3} from "react-icons/lu";
import {AdminHeader} from "@/components/admin/ui";
import BoardTabs from "@/components/admin/board/BoardTabs";
import SecretaryMinutesUploadForm from "@/components/admin/board/SecretaryMinutesUploadForm";
import {
    boardApi,
    type BoardMeeting,
    type BoardMember,
} from "@/lib/board";

export default function BoardMinutesPage() {
    const [meetings, setMeetings] = useState<BoardMeeting[]>([]);
    const [members, setMembers] = useState<BoardMember[]>([]);
    const [minutedCount, setMinutedCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const load = useCallback(async () => {
        try {
            setError("");
            const [past, archive] = await Promise.all([
                boardApi.listMeetings("past"),
                boardApi.listMinutes(),
            ]);
            const logged = new Set((archive.data || []).map((entry) => entry.meetingId));
            setMembers(archive.boardMembers || past.boardMembers || []);
            setMinutedCount(logged.size);
            setMeetings(
                (past.data || []).filter(
                    (meeting) => meeting.status !== "CANCELLED" && !logged.has(meeting._id),
                ),
            );
        } catch (e) {
            setError(e instanceof Error ? e.message : "Could not load meetings.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void Promise.resolve().then(() => load());
    }, [load]);

    return (
        <div>
            <AdminHeader
                eyebrow="Governance"
                title="Log minutes"
                sub="Record attendance, decisions, the signed document and the action items raised."
            />
            <BoardTabs/>

            <div className="mb-4 flex items-start gap-3 rounded-2xl border border-cyan/25 bg-cyan/5 p-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-cyan">
                    <LuClock3/>
                </span>
                <div>
                    <p className="text-sm font-semibold text-navy">The 48-hour rule</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-gray">
                        Minutes are due within 48 hours of a sitting. Anything logged later is
                        still accepted, but flagged as late in the archive.
                    </p>
                    {minutedCount > 0 ? (
                        <p className="mt-1 text-xs font-semibold text-cyan">
                            {minutedCount} sitting{minutedCount === 1 ? "" : "s"} already minuted
                        </p>
                    ) : null}
                </div>
            </div>

            {error ? (
                <p className="mb-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            ) : null}

            {loading ? (
                <div className="space-y-4">
                    <div className="h-64 animate-pulse rounded-2xl border border-gray-100 bg-white"/>
                    <div className="h-40 animate-pulse rounded-2xl border border-gray-100 bg-white"/>
                </div>
            ) : (
                <SecretaryMinutesUploadForm
                    meetings={meetings}
                    boardMembers={members}
                    onPublished={() => void load()}
                />
            )}
        </div>
    );
}
