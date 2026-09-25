"use client";

import Link from "next/link";
import RequireAuth from "@/components/RequireAuth";
import ReadingPlanEditor from "@/components/admin/ReadingPlanEditor";

export default function AdminReadingPlanNewPage() {
  return (
    <RequireAuth title="New reading plan">
      <section
        className="flex-1 px-4 py-10 md:py-14"
        style={{ background: "linear-gradient(115deg, #f5f8fb 0%, #eff5f9 60%, #f5f8fb 100%)" }}
      >
        <div className="max-w-7xl mx-auto space-y-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-cyan">Reading plans</p>
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-navy">New reading plan</h1>
              <p className="mt-0.5 text-sm text-slate-gray">
                Author days, verses and reading content — like a season guide, but built day-by-day.
              </p>
            </div>
            <Link
              href="/admin/reading-plans"
              className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-alice-blue"
            >
              Back to list
            </Link>
          </div>
          <ReadingPlanEditor />
        </div>
      </section>
    </RequireAuth>
  );
}