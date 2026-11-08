"use client";

import { AdminHeader } from "@/components/admin/ui";
import AppraisalList from "@/components/appraisals/AppraisalList";

export default function AdminAppraisalsPage() {
    return (
        <div>
            <AdminHeader
                eyebrow="Performance"
                title="Appraisals"
                sub="Allocate seasonal appraisals, review submissions and publish scores."
            />
            <AppraisalList adminBase="/admin" allocation />
        </div>
    );
}
