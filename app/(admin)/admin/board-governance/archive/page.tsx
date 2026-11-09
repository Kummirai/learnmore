"use client";

import {AdminHeader} from "@/components/admin/ui";
import BoardTabs from "@/components/admin/board/BoardTabs";
import MinutesArchiveAndTaskTracker from "@/components/admin/board/MinutesArchiveAndTaskTracker";

export default function BoardArchivePage() {
    return (
        <div>
            <AdminHeader
                eyebrow="Governance"
                title="Minutes archive"
                sub="Every published sitting, its decisions and the action items still open."
            />
            <BoardTabs/>
            <MinutesArchiveAndTaskTracker/>
        </div>
    );
}
