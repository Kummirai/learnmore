"use client"

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LuLoaderCircle } from "react-icons/lu";
import QuizSession from "@/components/bible-quiz/QuizSession";

function PlayInner() {
    const searchParams = useSearchParams();
    const club = searchParams.get("club") ?? undefined;

    return <QuizSession initialClub={club} />;
}

export default function PlayPage() {
    return (
        <main className="min-h-screen bg-alice-blue">
            <Suspense
                fallback={
                    <section className="flex-1 px-4 py-24 flex items-center justify-center bg-alice-blue">
                        <div className="flex items-center gap-3 text-slate-gray">
                            <LuLoaderCircle className="animate-spin text-2xl" />
                            <span className="text-sm">Setting up your round…</span>
                        </div>
                    </section>
                }
            >
                <PlayInner />
            </Suspense>
        </main>
    );
}