"use client"

import {useMemo, useState} from "react"
import {LuBookOpen} from "react-icons/lu"
import {PubBlocks} from "@/components/publications/PublicationBlocks"
import type {PubDocument, PubWeek} from "@/lib/publications"

type FlattenedDay = {
    weekIndex: number
    dayIndex: number
    day: NonNullable<PubWeek["days"]>[number]
}

function formatDayDate(date?: string): string {
    if (!date) return ""
    const d = new Date(`${date}T00:00:00Z`)
    if (Number.isNaN(d.getTime())) return date
    return d.toLocaleDateString("en-GB", {month: "short", day: "numeric", timeZone: "UTC"})
}

function todayStr(): string {
    const d = new Date()
    const m = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${d.getFullYear()}-${m}-${day}`
}

const navBtn =
    "inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"

export default function MagazineReader({doc}: {doc: PubDocument}) {
    const weeks = useMemo(() => doc.weeks ?? [], [doc.weeks])

    const days: FlattenedDay[] = useMemo(
        () =>
            weeks.flatMap((week, weekIndex) =>
                (week.days ?? []).map((day, dayIndex) => ({weekIndex, dayIndex, day})),
            ),
        [weeks],
    )

    const weekOffsets = useMemo(() => {
        return weeks.reduce<{offsets: number[]; cursor: number}>(
            (state, week) => ({
                offsets: [...state.offsets, state.cursor],
                cursor: state.cursor + (week.days?.length ?? 0),
            }),
            {offsets: [], cursor: 0},
        ).offsets
    }, [weeks])

    const [pos, setPos] = useState<number>(() => {
        if (days.length === 0) return 0
        const today = todayStr()
        const idx = days.findIndex(({day}) => day.date === today)
        return idx >= 0 ? idx : -1
    })

    if (weeks.length === 0 || days.length === 0) {
        return (
            <div className={"max-w-3xl mx-auto space-y-6"}>
                {doc.blocks && doc.blocks.length > 0 && <PubBlocks blocks={doc.blocks}/>}
            </div>
        )
    }

    const today = todayStr()
    const current = pos >= 0 && pos < days.length ? days[pos] : null
    const nextIdx = days.findIndex(({day}) => (day.date ?? "") > today)
    const week = current ? (weeks[current.weekIndex] as PubWeek) : null
    const weekDayCount = week?.days?.length ?? 0
    const jumpTo = (weekIndex: number, dayIndex: number) =>
        setPos(Math.min(weekOffsets[weekIndex] + dayIndex, days.length - 1))

    return (
        <div className={"max-w-3xl mx-auto"}>
            <div className={"rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden mb-10"}>
                <div className={"flex items-center justify-between gap-2 px-4 md:px-5 py-4"}>
                    <button
                        onClick={() => setPos(pos - 1)}
                        disabled={pos <= 0}
                        className={`${navBtn} border border-gray-200 text-navy hover:bg-alice-blue hover:border-(--club-accent)`}
                    >
                        <span aria-hidden>←</span> Prev
                    </button>
                    <div className={"text-center min-w-0"}>
                        <span className={"block text-[10px] uppercase tracking-[0.2em] text-(--club-accent) font-bold"}>
                            Now reading
                        </span>
                        <p className={"font-bold text-navy mt-0.5 min-w-0"}>
                            {current ? `Week ${current.weekIndex + 1} · Day ${current.dayIndex + 1}` : "Nothing to read yet"}
                            {current && <span className={"text-gray-400 font-medium"}> of {days.length}</span>}
                        </p>
                    </div>
                    <button
                        onClick={() => setPos(pos + 1)}
                        disabled={pos < 0 || pos >= days.length - 1}
                        className={`${navBtn} border border-gray-200 text-navy hover:bg-alice-blue hover:border-(--club-accent)`}
                    >
                        Next <span aria-hidden>→</span>
                    </button>
                </div>

                <div className={"px-4 md:px-5 pb-4"}>
                    <p className={"text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-2"}>Jump to week</p>
                    <div className={"flex flex-wrap gap-1.5"}>
                        {weeks.map((w, wi) => (
                            <button
                                key={wi}
                                onClick={() => jumpTo(wi, 0)}
                                        className={`rounded-lg px-3 py-2.5 min-h-11 text-xs font-bold transition-colors ${
                                    wi === current?.weekIndex
                                        ? "bg-navy text-white"
                                        : "bg-alice-blue text-navy hover:bg-ice-blue"
                                }`}
                            >
                                W{String(wi + 1).padStart(2, "0")}
                            </button>
                        ))}
                    </div>

                    {week && weekDayCount > 0 && (
                        <>
                            <p className={"text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mt-4 mb-2"}>
                                Days in week {(current?.weekIndex ?? 0) + 1}
                            </p>
                            <div className={"flex flex-wrap gap-1.5"}>
                                {(week.days ?? []).map((d, di) => (
                                    <button
                                        key={di}
                                        onClick={() => jumpTo(current?.weekIndex ?? 0, di)}
                                className={`rounded-lg px-3 py-2.5 min-h-11 text-xs font-bold transition-colors ${
                                            di === current?.dayIndex
                                                ? "bg-(--club-accent) text-navy"
                                                : "bg-alice-blue text-navy hover:bg-ice-blue"
                                        }`}
                                    >
                                        Day {di + 1}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {week && week.intro && week.intro.length > 0 && (
                <div className={"rounded-2xl bg-alice-blue/50 border border-gray-100 p-5 md:p-6 mb-6"}>
                    <p className={"text-[11px] font-bold uppercase tracking-[0.18em] text-(--club-accent) mb-2"}>
                        {week.title ?? `Week ${(current?.weekIndex ?? 0) + 1}`}
                    </p>
                    <div className={"space-y-3"}>
                        <PubBlocks blocks={week.intro}/>
                    </div>
                </div>
            )}

            {!current ? (
                <div className={"rounded-3xl border border-dashed border-gray-200 bg-alice-blue/40 px-6 py-14 md:py-16 text-center"}>
                    <span className={"mx-auto grid size-16 place-items-center rounded-2xl bg-white border border-gray-100 shadow-sm text-(--club-accent)"}>
                        <LuBookOpen className={"text-2xl"}/>
                    </span>
                    <h2 className={"mt-5 font-black tracking-tight text-navy text-2xl"}>
                        Today’s reading isn’t ready yet
                    </h2>
                    <p className={"mt-2 max-w-md mx-auto text-gray-500 text-sm leading-relaxed"}>
                        We’re still preparing {doc.series ?? "this season"}’s pages — it will be available here on its day. Pick any week or day above to start reading now.
                    </p>
                    <div className={"mt-6 flex flex-wrap justify-center gap-3"}>
                        {nextIdx >= 0 && (
                            <button
                                onClick={() => setPos(nextIdx)}
                                className={"inline-flex items-center gap-1.5 bg-navy text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-navy-soft transition-colors"}>
                                Go to next reading <span aria-hidden>→</span>
                            </button>
                        )}
                        <button
                            onClick={() => setPos(0)}
                            className={"inline-flex items-center gap-1.5 border border-gray-200 bg-white text-navy px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-alice-blue transition-colors"}>
                            Start from Day 1
                        </button>
                    </div>
                </div>
            ) : (
                <article className={"pb-8"}>
                    <header className={"flex flex-wrap items-baseline gap-x-3 gap-y-1"}>
                        <h2 className={"font-black tracking-tight text-navy text-2xl md:text-3xl"}>{current.day.title}</h2>
                        <span className={"text-[11px] uppercase tracking-widest text-(--club-accent) font-bold"}>
                            {current.day.weekday ? `${current.day.weekday} · ` : ""}Day {current.day.day ?? current.dayIndex + 1}
                        </span>
                        {current.day.date && (
                            <span className={"ml-auto text-sm text-gray-400 font-medium"}>
                                {formatDayDate(current.day.date)}
                            </span>
                        )}
                    </header>

                    {current.day.verse?.text && (
                        <figure className={"my-5 rounded-r-xl border-l-[3px] border-(--club-accent) bg-alice-blue/40 py-3 pl-4 pr-3"}>
                            <blockquote className={"text-[15px] italic text-gray-700 leading-relaxed"}>
                                {current.day.verse.text}
                            </blockquote>
                            {current.day.verse.by && (
                                <figcaption className={"mt-1.5 text-[11px] uppercase tracking-[0.18em] text-(--club-accent) font-bold"}>
                                    {current.day.verse.by}
                                </figcaption>
                            )}
                        </figure>
                    )}

                    {current.day.blocks && current.day.blocks.length > 0 && (
                        <div className={"space-y-4"}>
                            <PubBlocks blocks={current.day.blocks}/>
                        </div>
                    )}
                </article>
            )}
        </div>
    )
}