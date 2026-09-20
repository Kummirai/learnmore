import Link from "next/link"
import PageHero from "@/components/PageHero"
import {PubBlocks} from "@/components/publications/PublicationBlocks"
import type {PubDocument, PubWeek} from "@/lib/publications"
import type {RelateClub} from "@/constants/relate"

function formatDayDate(date?: string): string {
    if (!date) return ""
    const d = new Date(`${date}T00:00:00Z`)
    if (Number.isNaN(d.getTime())) return date
    return d.toLocaleDateString("en-GB", {month: "short", day: "numeric", timeZone: "UTC"})
}

function DayCard({week, day}: {week: PubWeek; day: NonNullable<PubWeek["days"]>[number]}) {
    const label =
        day.day !== undefined ? `Day ${day.day}` : week.index !== undefined ? `Week ${week.index}` : ""

    return (
        <div className={"border-t border-gray-100 pt-5"}>
            <header className={"flex flex-wrap items-baseline gap-x-3 gap-y-1"}>
                <h4 className={"font-bold text-navy text-base"}>{day.title}</h4>
                {label && (
                    <span className={"text-[11px] uppercase tracking-widest text-cyan font-bold"}>
                        {label}
                        {day.weekday ? ` · ${day.weekday}` : ""}
                    </span>
                )}
                {day.date && (
                    <span className={"ml-auto text-xs text-gray-400 font-medium"}>
                        {formatDayDate(day.date)}
                    </span>
                )}
            </header>
            {day.verse?.text && (
                <figure className={"my-4 rounded-r-xl border-l-[3px] border-cyan bg-alice-blue/40 py-3 pl-4 pr-3"}>
                    <blockquote className={"text-[15px] italic text-gray-700 leading-relaxed"}>
                        {day.verse.text}
                    </blockquote>
                    {day.verse.by && (
                        <figcaption className={"mt-1.5 text-[11px] uppercase tracking-[0.18em] text-cyan font-bold"}>
                            {day.verse.by}
                        </figcaption>
                    )}
                </figure>
            )}
            {day.blocks && day.blocks.length > 0 && (
                <div className={"space-y-4"}>
                    <PubBlocks blocks={day.blocks}/>
                </div>
            )}
        </div>
    )
}

function WeekCard({week}: {week: PubWeek}) {
    const weekNumber = String(week.index ?? 0).padStart(2, "0")

    return (
        <section className={"rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden"}>
            <header className={"bg-navy px-5 md:px-6 py-4 text-white flex flex-wrap items-center gap-x-4 gap-y-1"}>
                <span className={"text-[11px] font-black tracking-[0.2em] text-cyan"}>

                    W{weekNumber}
                </span>
                <div>
                    <h3 className={"font-bold text-lg leading-tight"}>{week.title ?? week.theme}</h3>
                    {week.theme && week.theme !== week.title && (
                        <p className={"text-white/70 text-xs mt-0.5"}>{week.theme}</p>
                    )}
                </div>
            </header>
            <div className={"px-5 md:px-6 py-5"}>
                {week.intro && week.intro.length > 0 && (
                    <div className={"mb-5 space-y-3"}>
                        <PubBlocks blocks={week.intro}/>
                    </div>
                )}
                <div className={"space-y-0"}>
                    {week.days?.map((day, i) => (
                        <DayCard key={i} week={week} day={day}/>
                    ))}
                </div>
            </div>
        </section>
    )
}

type PublicationReaderProps = {
    doc: PubDocument
    club?: RelateClub
}

export default function PublicationReader({doc, club}: PublicationReaderProps) {
    const isMagazine = doc.kind === "magazine"
    const seasonLabel = doc.season?.label ?? doc.issue

    return (
        <>
            <PageHero
                title={doc.title ?? doc.series ?? "Publication"}
                tagline={doc.theme}
                description={doc.summary}
                watermark={doc.year ? String(doc.year) : undefined}
                chips={(doc.tags ?? []).slice(0, 3).map((tag) => ({label: tag}))}
                meta={[
                    {label: "Kind", value: isMagazine ? "Season Study Guide" : "Bulletin"},
                    {label: "Club", value: club?.name ?? doc.clubSlug ?? "—"},
                    {label: "Season", value: seasonLabel ?? "—"},
                ]}
                metaEnd={
                    club && (
                        <Link href={`/${club.slug}`}
                              className={"inline-flex items-center gap-2 font-medium text-white hover:text-cyan-light transition-colors"}>
                            <span className={"text-[11px] uppercase tracking-widest text-white/50"}>Reading for</span>
                            {club.name} →
                        </Link>
                    )
                }
                bgImage={doc.cover}
            />

            <section className={"flex-1 px-4 py-12"}>
                <div className={"max-w-3xl mx-auto"}>
                    {doc.blocks && doc.blocks.length > 0 && (
                        <div className={"mb-10 rounded-2xl border border-gray-100 bg-alice-blue/40 p-6 md:p-8"}>
                            <div className={"space-y-4"}>
                                <PubBlocks blocks={doc.blocks}/>
                            </div>
                        </div>
                    )}

                    {isMagazine && doc.weeks && doc.weeks.length > 0 && (
                        <div className={"space-y-8"}>
                            {doc.weeks.map((week, i) => (
                                <WeekCard key={i} week={week}/>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    )
}