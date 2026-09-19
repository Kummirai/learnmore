import Link from "next/link"
import {LuArrowLeft} from "react-icons/lu"
import {FaWhatsapp} from "react-icons/fa"
import {CLUBS, getClub, getMagazinesForClub} from "@/constants/relate"

export default function ClubPage({slug}: {slug: string}) {
    const club = getClub(slug)

    if (!club) {
        return (
            <section className={"flex-1 px-4 py-12"}>
                <div className={"max-w-4xl mx-auto"}>
                    <Link href={"/"}
                          className={"inline-flex items-center gap-1 text-sm text-cyan hover:text-cyan-dark mb-6 transition-colors"}>
                        <LuArrowLeft/> Back to Home
                    </Link>
                    <h1 className={"text-3xl font-semibold text-gray-800"}>Club not found</h1>
                </div>
            </section>
        )
    }

    const magazines = getMagazinesForClub(club.slug)
    const numericAge = club.ageRange.match(/^[\d–+ ]+/) ? club.ageRange : null

    return (
        <section className={"flex-1 px-4 py-12"}>
            <div className={"max-w-6xl mx-auto"}>
                <Link href={"/"}
                      className={"inline-flex items-center gap-1 text-sm text-cyan hover:text-cyan-dark mb-6 transition-colors"}>
                    <LuArrowLeft/> Back to Home
                </Link>

                <div className={"relative overflow-hidden rounded-2xl text-white shadow-sm mb-6"}
                     style={{backgroundColor: club.colorDark}}>
                    <div className={"absolute inset-0"}
                         style={{background: `linear-gradient(115deg, ${club.color} 0%, ${club.colorDark} 40%, #1d2a4d 82%, #151f3a 100%)`}}/>
                    <div className={"absolute -top-32 -right-24 size-96 rounded-full blur-3xl opacity-30"}
                         style={{backgroundColor: club.color}}/>
                    <div className={"absolute -right-20 -top-28 size-[26rem] rounded-full border"}
                         style={{borderColor: `${club.color}55`}}/>
                    <div className={"absolute -right-12 -top-20 size-72 rounded-full border"}
                         style={{borderColor: `${club.color}33`}}/>
                    <div className={"absolute -top-10 right-4 h-px w-64"}
                         style={{background: `linear-gradient(90deg, transparent, ${club.color})`}}/>
                    {numericAge && (
                        <div className={"absolute -bottom-12 right-4 hidden select-none md:block"}>
                            <span className={"block font-black leading-none tracking-tighter"}
                                  style={{fontSize: "clamp(8rem, 18vw, 13rem)", color: club.color, opacity: 0.16}}>
                                {numericAge.replace(" yrs", "").trim()}
                            </span>
                        </div>
                    )}

                    <div className={"relative px-6 py-12 md:px-12 md:py-16"}>
                        <div className={"flex flex-wrap items-center gap-3"}>
                            <span className={"inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-1.5 rounded-full text-[11px] uppercase tracking-widest text-white/90 font-medium"}>
                                <span className={"size-2 rounded-full"} style={{backgroundColor: club.color}}/>
                                {club.group}
                            </span>
                            <span className={"bg-white/10 backdrop-blur px-3 py-1.5 rounded-full text-[11px] uppercase tracking-widest text-white/90 font-medium"}>
                                {club.ageRange}
                            </span>
                        </div>

                        <h1 className={"mt-6 text-5xl md:text-7xl font-black tracking-tight leading-none"}>
                            {club.name}
                        </h1>
                        <p className={"mt-4 text-xl md:text-2xl font-medium"}
                           style={{color: club.color}}>
                            {club.tagline}
                        </p>
                        <p className={"mt-4 max-w-xl text-sm md:text-base text-white/80 leading-relaxed"}>
                            {club.description}
                        </p>

                        <div className={"mt-8 flex flex-wrap items-center gap-3"}>
                            <a
                                href={club.whatsappGroupLink}
                                target={"_blank"}
                                rel={"noopener noreferrer"}
                                className={"inline-flex items-center gap-2 bg-white text-navy px-6 py-3 rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors"}>
                                <FaWhatsapp/> Join on WhatsApp
                            </a>
                            <a
                                href={"#programs"}
                                className={"inline-flex items-center gap-2 border border-white/25 text-white px-6 py-3 rounded-lg font-semibold text-sm hover:border-white/60 transition-colors"}>
                                Explore programs
                            </a>
                        </div>

                        <div className={"mt-10 pt-6 border-t border-white/15 flex flex-wrap items-center gap-x-10 gap-y-4 text-sm"}>
                            <div>
                                <span className={"block text-[11px] uppercase tracking-widest text-white/50 mb-0.5"}>Group</span>
                                <span className={"font-medium"}>{club.group}</span>
                            </div>
                            <div>
                                <span className={"block text-[11px] uppercase tracking-widest text-white/50 mb-0.5"}>Age</span>
                                <span className={"font-medium"}>{club.ageRange}</span>
                            </div>
                            <div>
                                <span className={"block text-[11px] uppercase tracking-widest text-white/50 mb-0.5"}>Programs</span>
                                <span className={"font-medium"}>{club.programs.length}</span>
                            </div>
                            {magazines.map((m) => (
                                <Link key={m.slug} href={`/${m.slug}`}
                                      className={"ml-auto inline-flex items-center gap-2 font-medium text-white hover:text-cyan-light transition-colors"}>
                                    <span className={"text-[11px] uppercase tracking-widest text-white/50"}>Reading guide</span>
                                    {m.series} →
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <div id={"programs"} className={"text-center mb-8 scroll-mt-8"}>
                    <h2 className={"text-2xl font-semibold text-gray-800 mb-2"}>Programs &amp; Activities</h2>
                    <p className={"text-gray-500 text-sm max-w-xl mx-auto"}>
                        Everything {club.name} runs for {club.group.toLowerCase()} — join any program, no experience needed.
                    </p>
                </div>

                <div className={"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"}>
                    {club.programs.map((p) => (
                        <div key={p.name}
                             className={"bg-white rounded-xl p-6 shadow-sm border-l-4 transition-shadow hover:shadow-md"}
                             style={{borderLeftColor: club.color}}>
                            <h3 className={"font-semibold text-gray-800 mb-1"}>{p.name}</h3>
                            <p className={"text-sm text-cyan-dark font-medium mb-2"}>{p.blurb}</p>
                            <p className={"text-sm text-gray-600 leading-relaxed"}>{p.detail}</p>
                        </div>
                    ))}
                </div>

                {CLUBS.length > 1 && (
                    <div className={"mt-12 bg-alice-blue rounded-xl p-8 text-center"}>
                        <h2 className={"text-xl font-semibold text-gray-800 mb-5"}>Explore more clubs</h2>
                        <div className={"flex flex-wrap justify-center gap-3"}>
                            {CLUBS.filter((c) => c.slug !== club.slug).map((c) => (
                                <Link key={c.slug} href={`/${c.slug}`}
                                      className={"inline-flex items-center gap-2 bg-white border border-gray-200 text-navy px-4 py-2 rounded-lg text-sm font-medium hover:border-cyan hover:text-cyan-dark transition-colors"}>
                                    <span className={"size-2.5 rounded-full"} style={{backgroundColor: c.color}}/>
                                    {c.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}