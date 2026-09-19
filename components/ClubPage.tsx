import Link from "next/link"
import {LuArrowLeft} from "react-icons/lu"
import {FaWhatsapp} from "react-icons/fa"
import {CLUBS, getClub, getClubClass, getClubClasses, getMagazinesForClub} from "@/constants/relate"

export default function ClubPage({slug}: {slug: string}) {
    const club = getClub(slug) ?? getClubClass(slug)

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
    const classes = getClubClasses(club.slug)
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
                            {club.parentSlug && getClub(club.parentSlug) && (
                                <Link href={`/${club.parentSlug}`}
                                      className={"ml-auto inline-flex items-center gap-2 font-medium text-white hover:text-cyan-light transition-colors"}>
                                    <span className={"text-[11px] uppercase tracking-widest text-white/50"}>Part of</span>
                                    {getClub(club.parentSlug)!.name} ←
                                </Link>
                            )}
                            {!club.parentSlug && magazines.map((m) => (
                                <Link key={m.slug} href={`/${m.slug}`}
                                      className={"ml-auto inline-flex items-center gap-2 font-medium text-white hover:text-cyan-light transition-colors"}>
                                    <span className={"text-[11px] uppercase tracking-widest text-white/50"}>Reading guide</span>
                                    {m.series} →
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {classes.length > 0 && (
                    <div className={"mb-10"}>
                        <span className={"text-xs uppercase tracking-widest text-cyan font-medium"}>Age groups</span>
                        <h2 className={"text-2xl md:text-3xl font-semibold text-gray-800 mt-1 mb-2"}>
                            {club.name} runs in three age groups
                        </h2>
                        <p className={"text-gray-500 text-sm max-w-xl mb-6"}>
                            Pick the band that fits your child — each has its own leaders, rhythm and weekly program.
                        </p>
                        <div className={"border-t border-gray-200"}>
                            {classes.map((c) => (
                                <Link key={c.slug} href={`/${c.slug}`}
                                      className={"group flex items-center gap-5 md:gap-8 py-6 border-b border-gray-200 hover:bg-alice-blue/70 transition-colors"}>
                                    <div className={"w-20 md:w-28 shrink-0"}>
                                        <span className={"block font-black tracking-tight leading-none"}
                                              style={{color: c.color, fontSize: "clamp(2.25rem, 5vw, 3.25rem)"}}>
                                            {c.ageRange.split(" yrs")[0]}
                                        </span>
                                    </div>
                                    <div className={"flex-1"}>
                                        <h3 className={"font-bold text-gray-800 text-lg leading-snug"}>{c.name}</h3>
                                        <p className={"text-sm text-gray-500 leading-snug"}>{c.tagline}</p>
                                    </div>
                                    <span className={"shrink-0 text-sm font-semibold text-cyan group-hover:text-cyan-dark transition-colors"}>
                                        View programs
                                        <span className={"inline-block ml-1 group-hover:translate-x-1 transition-transform"}>→</span>
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                <div id={"programs"} className={"scroll-mt-8 mb-10"}>
                    <span className={"text-xs uppercase tracking-widest text-cyan font-medium"}>What happens here</span>
                    <h2 className={"text-2xl md:text-3xl font-semibold text-gray-800 mt-1"}>Programs &amp; Activities</h2>
                    <p className={"text-gray-500 text-sm mt-2 max-w-xl"}>
                        {club.programs.length} programs for {club.group.toLowerCase()} — one weekly flagship, then the whole menu of ways to be involved.
                    </p>
                </div>

                {club.programs[0] && (
                    <div className={"relative overflow-hidden rounded-2xl text-white mb-10 shadow-sm"}
                         style={{backgroundColor: club.colorDark}}>
                        <div className={"absolute inset-0"}
                             style={{background: `linear-gradient(120deg, ${club.colorDark} 20%, #1d2a4d 100%)`}}/>
                        <div className={"absolute -right-16 -top-20 size-64 rounded-full blur-3xl opacity-25"}
                             style={{backgroundColor: club.color}}/>
                        <div
                            className={"relative px-6 py-8 md:px-10 md:py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5"}>
                            <div>
                                <span className={"text-[11px] uppercase tracking-widest font-medium"}
                                      style={{color: club.color}}>
                                    The weekly flagship
                                </span>
                                <h3 className={"mt-1 text-2xl md:text-3xl font-bold tracking-tight"}>
                                    {club.programs[0].name}
                                </h3>
                                <p className={"mt-2 text-white/80 text-sm md:text-base max-w-xl leading-relaxed"}>
                                    {club.programs[0].blurb}
                                </p>
                            </div>
                            <div className={"shrink-0 self-start md:self-center"}>
                                <a
                                    href={club.whatsappGroupLink}
                                    target={"_blank"}
                                    rel={"noopener noreferrer"}
                                    className={"inline-flex items-center gap-2 bg-white text-navy px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors"}>
                                    <FaWhatsapp/> Join {club.name}
                                </a>
                            </div>
                        </div>
                    </div>
                )}

                {club.programs.length > 1 && (
                    <>
                        <h3 className={"text-sm font-semibold text-gray-400 uppercase tracking-widest mb-2"}>
                            More ways to be involved
                        </h3>
                        <div className={"grid grid-cols-1 md:grid-cols-2 gap-x-12"}>
                            {club.programs.slice(1).map((p) => (
                                <div key={p.name}
                                     className={"flex items-baseline gap-3 py-4 border-b border-gray-100"}>
                                    <span className={"size-2 shrink-0 rounded-full self-center"}
                                          style={{backgroundColor: club.color}}/>
                                    <div>
                                        <h4 className={"font-medium text-gray-800 text-[15px]"}>{p.name}</h4>
                                        <p className={"text-sm text-gray-500 leading-snug"}>{p.blurb}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

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