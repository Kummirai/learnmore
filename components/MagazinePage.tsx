import Link from "next/link"
import PageHero from "@/components/PageHero"
import {getMagazine} from "@/constants/relate"

export default function MagazinePage({slug}: {slug: string}) {
    const magazine = getMagazine(slug)

    if (!magazine) {
        return (
            <section className={"flex-1 px-4 py-12"}>
                <div className={"max-w-4xl mx-auto"}>
                    <Link href={"/"}
                          className={"inline-flex items-center gap-1 text-sm text-cyan hover:text-cyan-dark mb-6 transition-colors"}>
                        Back to Home
                    </Link>
                    <h1 className={"text-3xl font-semibold text-gray-800"}>Magazine not found</h1>
                </div>
            </section>
        )
    }

    return (
        <>
            <PageHero
                title={magazine.series}
                tagline={magazine.theme}
                description={magazine.summary}
                watermark={"13"}
                titleSize={"clamp(3rem, 10vw, 7.5rem)"}
                meta={[
                    {label: "Club", value: magazine.clubName},
                    {label: "Season", value: magazine.seasonLabel},
                    {label: "Editions", value: magazine.editions.length},
                ]}
                metaEnd={
                    <Link href={`/${magazine.clubSlug}`}
                          className={"inline-flex items-center gap-2 font-medium text-white hover:text-cyan-light transition-colors"}>
                        <span className={"text-[11px] uppercase tracking-widest text-white/50"}>Reading for</span>
                        {magazine.clubName} →
                    </Link>
                }
                actions={
                    <Link href={`/${magazine.clubSlug}`}
                          className={"inline-flex items-center gap-2 bg-white text-navy px-6 py-3 rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors"}>
                        Read more about {magazine.clubName} →
                    </Link>
                }
                bgImage={magazine.cover}
            />

            <section className={"flex-1 px-4 py-12 bg-white"}>
                <div className={"max-w-6xl mx-auto"}>
                    {/* Overview: cover + intro */}
                    <div className={"grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-10 mb-12 items-start"}>
                        <div className={"md:col-span-2"}>
                            <div className={"bg-navy rounded-2xl p-3 shadow-lg md:sticky md:top-24"}>
                                <img
                                    src={magazine.cover}
                                    alt={`${magazine.series} cover`}
                                    className={"w-full rounded-xl object-cover aspect-[3/4]"}
                                />
                            </div>
                        </div>
                        <div className={"md:col-span-3 md:pt-2"}>
                            <p className={"text-[11px] font-bold uppercase tracking-[0.2em] text-cyan mb-2"}>
                                Season Study Guide
                            </p>
                            <h2 className={"text-3xl md:text-4xl font-black tracking-tight text-navy mb-3"}>
                                {magazine.series}
                            </h2>
                            <p className={"text-gray-600 leading-relaxed mb-5"}>{magazine.summary}</p>
                            <div className={"flex flex-wrap gap-2 mb-7"}>
                                <span className={"inline-flex items-center gap-2 text-xs font-semibold text-navy bg-alice-blue px-3.5 py-2 rounded-full"}>
                                    <span className={"size-2 rounded-full bg-cyan"}/>
                                    {magazine.clubName}
                                </span>
                                <span className={"inline-flex items-center gap-2 text-xs font-semibold text-navy bg-alice-blue px-3.5 py-2 rounded-full"}>
                                    {magazine.seasonLabel}
                                </span>
                                <span className={"inline-flex items-center gap-2 text-xs font-semibold text-navy bg-alice-blue px-3.5 py-2 rounded-full"}>
                                    {magazine.editions.length} {magazine.editions.length === 1 ? "edition" : "editions"}
                                </span>
                            </div>
                            <Link
                                href={`/${magazine.clubSlug}`}
                                className={"inline-flex items-center gap-2 bg-navy text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-navy-soft transition-colors"}>
                                Explore {magazine.clubName} →
                            </Link>
                        </div>
                    </div>

                    {/* Editions with week grids */}
                    <div className={"grid gap-6"}>
                        {magazine.editions.map((edition) => (
                            <div key={edition.label} className={"bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"}>
                                <div className={"flex flex-wrap items-center justify-between gap-3 px-6 md:px-8 py-5 bg-alice-blue/50 border-b border-gray-100"}>
                                    <h3 className={"text-lg font-bold text-navy"}>{edition.label}</h3>
                                    <span className={"text-xs font-semibold text-navy bg-white border border-gray-200 px-3 py-1.5 rounded-full"}>
                                        {edition.ageRange}
                                    </span>
                                </div>
                                <div className={"px-6 md:px-8 pt-5"}>
                                    <p className={"text-sm text-gray-600 leading-relaxed"}>{edition.summary}</p>
                                </div>
                                <div className={"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 px-6 md:px-8 py-5"}>
                                    {edition.weekTitles.map((week, i) => (
                                        <div key={week}
                                             className={"flex items-center gap-3 rounded-xl bg-alice-blue/60 px-4 py-3 hover:bg-ice-blue/60 transition-colors"}>
                                            <span className={"text-[11px] font-black text-cyan w-8 shrink-0"}>
                                                W{String(i + 1).padStart(2, "0")}
                                            </span>
                                            <span className={"text-sm text-gray-700 leading-snug"}>{week}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}