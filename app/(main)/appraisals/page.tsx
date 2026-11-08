"use client";

import RequireAuth from "@/components/RequireAuth";
import MemberPage from "@/components/member/MemberPage";
import AppraisalList from "@/components/appraisals/AppraisalList";

export default function AppraisalsPage() {
    return (
        <RequireAuth
            title="Seasonal appraisals"
            next="/appraisals"
            blurb="Sign in to complete and track your seasonal appraisals."
        >
            <MemberPage
                eyebrow="Performance"
                title="Seasonal appraisals"
                sub="Complete the form your admin allocates, then track its review."
            >
                <AppraisalList />
            </MemberPage>
        </RequireAuth>
    );
}
