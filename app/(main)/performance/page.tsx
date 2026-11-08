"use client";

import RequireAuth from "@/components/RequireAuth";
import MemberPage from "@/components/member/MemberPage";
import PerformanceView from "@/components/performance/PerformanceView";

export default function PerformancePage() {
    return (
        <RequireAuth
            title="Organisation performance"
            next="/performance"
            blurb="Sign in to see how Relate is tracking this season."
        >
            <MemberPage
                eyebrow="Performance"
                title="Organisation performance"
                sub="Coffer progress, income mix and seasonal appraisal scores."
            >
                <PerformanceView />
            </MemberPage>
        </RequireAuth>
    );
}
