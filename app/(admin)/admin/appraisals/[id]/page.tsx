"use client";

import { useParams } from "next/navigation";
import AppraisalDetailView from "@/components/appraisals/AppraisalDetail";

export default function AdminAppraisalDetailPage() {
    const params = useParams<{ id: string }>();
    const id = typeof params.id === "string" ? params.id : params.id?.[0] ?? "";

    return (
        <AppraisalDetailView
            id={id}
            backHref="/admin/appraisals"
            backLabel="Back to appraisals"
        />
    );
}
