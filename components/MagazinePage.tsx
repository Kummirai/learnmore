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
                tagline={`${magazine.seasonLabel} · ${magazine.clubName}`}
                description={magazine.summary}
                chips={magazine.coverLines.map((line) => ({label: line}))}
                titleSize={"clamp(3rem, 9vw, 6.5rem)"}
                meta={[{label: "Theme", value: magazine.theme}]}
                actions={
                    <Link href={`/${magazine.clubSlug}`}
                          className={"inline-flex items-center gap-2 border border-white/25 text-white px-6 py-3 rounded-lg font-semibold text-sm hover:border-white/60 transition-colors"}>
                        Read more about {magazine.clubName} →
                    </Link>
                }
            />

            <section className={"flex-1 px-4 py-12"}>
                <div className={"max-w-6xl mx-auto"}>
                    <div className={"grid grid-cols-1 md:grid-cols-5 gap-6 mb-10"}>
                        <div className={"md:col-span-2"}>
                            <div className={"bg-navy rounded-2xl p-3 shadow-sm"}>
                                <img
                                    src={magazine.cover}
                                    alt={`${magazine.series} cover`}
                                    className={"w-full rounded-xl object-cover aspect-[3/4]"}
                                />
                            </div>
                        </div>
                        <div className={"md:col-span-3"}>
                            <div className={"flex flex-wrap gap-3 mb-4"}>
                                <span className={"text-sm font-semibold text-navy bg-alice-blue px-4 py-2 rounded-lg"}>
                                    Season Study Guide
                                </span>
                                <span className={"text-sm font-semibold text-navy bg-alice-blue px-4 py-2 rounded-lg"}>
                                    {magazine.editions.length} editions
                                </span>
                            </div>
                        </div>
                    </div>

                    {magazine.editions.map((edition) => (
                        <div key={edition.label} className={"mb-8"}>
                            <div className={"bg-white rounded-xl shadow-sm p-6 md:p-8"}>
                                <div className={"flex flex-wrap items-baseline justify-between gap-2 mb-1"}>
                                    <h2 className={"text-xl font-semibold text-gray-800"}>{edition.label}</h2>
                                    <span className={"text-sm text-gray-500"}>{edition.ageRange}</span>
                                </div>
                                <p className={"text-sm text-gray-600 mb-5"}>{edition.summary}</p>
                                <div className={"flex flex-wrap gap-2"}>
                                    {edition.weekTitles.map((week, i) => (
                                        <span key={week}
                                              className={"inline-flex items-center gap-1.5 text-xs bg-alice-blue text-navy-dark px-3 py-1.5 rounded-full"}>
                                            <span className={"text-cyan font-semibold"}>W{i + 1}</span>
                                            {week}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    )
}