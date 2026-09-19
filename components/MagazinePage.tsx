import Link from "next/link"
import {LuArrowLeft, LuBookOpen} from "react-icons/lu"
import {getMagazine} from "@/constants/relate"

export default function MagazinePage({slug}: {slug: string}) {
    const magazine = getMagazine(slug)

    if (!magazine) {
        return (
            <section className={"flex-1 px-4 py-12"}>
                <div className={"max-w-4xl mx-auto"}>
                    <Link href={"/"}
                          className={"inline-flex items-center gap-1 text-sm text-cyan hover:text-cyan-dark mb-6 transition-colors"}>
                        <LuArrowLeft/> Back to Home
                    </Link>
                    <h1 className={"text-3xl font-semibold text-gray-800"}>Magazine not found</h1>
                </div>
            </section>
        )
    }

    return (
        <section className={"flex-1 px-4 py-12"}>
            <div className={"max-w-6xl mx-auto"}>
                <Link href={"/"}
                      className={"inline-flex items-center gap-1 text-sm text-cyan hover:text-cyan-dark mb-6 transition-colors"}>
                    <LuArrowLeft/> Back to Home
                </Link>

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
                    <div className={"md:col-span-3 flex flex-col justify-center"}>
                        <div className={"inline-flex items-center gap-2 text-xs uppercase tracking-widest text-cyan font-medium mb-2"}>
                            <LuBookOpen/> Season Study Guide
                        </div>
                        <h1 className={"text-3xl md:text-4xl font-semibold text-gray-800 mb-1"}>{magazine.series}</h1>
                        <p className={"text-cyan-dark font-medium mb-3"}>{magazine.seasonLabel} &middot; {magazine.clubName}</p>
                        <div className={"flex flex-wrap gap-2 mb-4"}>
                            {magazine.coverLines.map((line) => (
                                <span key={line}
                                      className={"text-xs bg-ice-blue text-navy-dark px-3 py-1 rounded-full font-medium"}>{line}</span>
                            ))}
                        </div>
                        <p className={"text-gray-600 text-sm leading-relaxed mb-6"}>{magazine.summary}</p>
                        <div className={"flex flex-wrap gap-3"}>
                            <span className={"text-sm font-semibold text-navy bg-alice-blue px-4 py-2 rounded-lg"}>
                                Theme: {magazine.theme}
                            </span>
                            <Link
                                href={`/${magazine.clubSlug}`}
                                className={"text-sm font-semibold text-cyan hover:text-cyan-dark transition-colors self-center"}>
                                Read more about {magazine.clubName} →
                            </Link>
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
    )
}