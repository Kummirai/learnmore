"use client";

import { useParams } from "next/navigation";
import RequireAuth from "@/components/RequireAuth";
import MemberPage from "@/components/member/MemberPage";
import AppraisalDetailView from "@/components/appraisals/AppraisalDetail";

export default function AppraisalPage() {
    const params = useParams<{ id: string }>();
    const id = typeof params.id === "string" ? params.id : params.id?.[0] ?? "";

    return (
        <RequireAuth title="Seasonal appraisal" next={`/appraisals/${id}`}>
            <MemberPage eyebrow="Performance" title="Appraisal">
                <AppraisalDetailView id={id} backHref="/appraisals" backLabel="Back to appraisals" />
            </MemberPage>
        </RequireAuth>
    );
}
