"use client";

import { AdminHeader } from "@/components/admin/ui";
import PerformanceView from "@/components/performance/PerformanceView";

export default function AdminPerformancePage() {
    return (
        <div>
            <AdminHeader
                eyebrow="Performance"
                title="Organisation performance"
                sub="Coffer progress, income mix and seasonal appraisal scores — built from published reports."
            />
            <PerformanceView admin basePath="/admin" />
        </div>
    );
}
