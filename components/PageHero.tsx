import Navbar from "@/components/Navbar"

type Chip = {dot?: boolean; label: string}
type MetaItem = {label: string; value: React.ReactNode}

type PageHeroProps = {
    title: string
    tagline?: string
    description?: string
    watermark?: string
    chips?: Chip[]
    actions?: React.ReactNode
    meta?: MetaItem[]
    metaEnd?: React.ReactNode
    titleSize?: string
    extra?: React.ReactNode
    /** Optional full-bleed photo background (fades to dark on the left for text legibility). */
    bgImage?: string
    /** Optional pill pinned to the far right of the chips row (like the homepage carousel). */
    chipsEnd?: React.ReactNode
    /** Set false on pages whose layout already renders a Navbar (avoids a double navbar). */
    navbar?: boolean
}

export default function PageHero({title, tagline, description, watermark, chips = [], actions, meta, metaEnd, titleSize = "clamp(3rem, 10vw, 7.5rem)", extra, bgImage, chipsEnd, navbar = true}: PageHeroProps) {
    const showMetaBar = (meta?.length ?? 0) > 0 || metaEnd

    return (
        <section
            className={"relative min-h-screen w-full overflow-hidden"}
            style={bgImage
                ? {
                    backgroundImage: `linear-gradient(100deg, rgba(21,31,58,0.97) 0%, rgba(21,31,58,0.9) 45%, rgba(21,31,58,0.55) 75%, rgba(21,31,58,0.35) 100%), url(${bgImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }
                : {background: "linear-gradient(115deg, var(--club-accent) 0%, var(--club-accent-dark) 38%, #1d2a4d 80%, #151f3a 100%)"}}>
            {navbar && <Navbar overlay/>}

            <div className={"absolute -top-32 -right-24 size-96 rounded-full blur-3xl opacity-30"}
                 style={{backgroundColor: "var(--club-accent)"}}/>
            <div className={"absolute bottom-10 -left-24 size-96 rounded-full blur-3xl opacity-20"}
                 style={{backgroundColor: "var(--club-accent)"}}/>
            <div className={"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[560px] rounded-full opacity-10 blur-3xl"}
                 style={{backgroundColor: "var(--club-accent)"}}/>
            <div className={"absolute -right-20 -top-28 size-[30rem] rounded-full border"}
                 style={{borderColor: "color-mix(in srgb, var(--club-accent) 40%, transparent)"}}/>
            <div className={"absolute -right-12 -top-20 size-[21rem] rounded-full border"}
                 style={{borderColor: "color-mix(in srgb, var(--club-accent) 22%, transparent)"}}/>
            <div className={"absolute -top-10 right-4 h-px w-96"}
                 style={{background: "linear-gradient(90deg, transparent, var(--club-accent))"}}/>
            {watermark && (
                <div className={"absolute bottom-0 right-4 hidden pb-0.5 select-none md:block"}>
                    <span className={"block font-black leading-none tracking-tighter text-[color:var(--club-accent)]"}
                          style={{fontSize: "clamp(9rem, 24vw, 16rem)", opacity: 0.14}}>
                        {watermark}
                    </span>
                </div>
            )}

            <div className={"relative z-10 max-w-6xl mx-auto w-full px-4 sm:px-6 min-h-screen flex flex-col justify-center py-24"}>
                <div className={"flex flex-col gap-5 md:gap-6"}>
                    {/* Always render the chips row (like the homepage hero) so titles start at the same height; an empty row reserves the pill height for whitespace. */}
                    <div className={"flex flex-wrap items-center gap-3"}>
                        {chips.map((chip, i) => (
                            <span key={i}
                                  className={"inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-1.5 rounded-full text-[11px] uppercase tracking-widest text-white/90 font-medium"}>
                                {chip.dot && <span className={"size-2 rounded-full"} style={{backgroundColor: "var(--club-accent)"}}/>}
                                {chip.label}
                            </span>
                        ))}
                        {chipsEnd && (
                            <span className={"ml-auto inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-1.5 rounded-full text-[11px] tracking-wide text-white/90 font-medium"}>
                                {chipsEnd}
                            </span>
                        )}
                        {chips.length === 0 && !chipsEnd && <span aria-hidden className={"h-[30px]"}/>}
                    </div>

                    <h1 className={"font-black tracking-tight leading-none text-white"} style={{fontSize: titleSize}}>
                        {title}
                    </h1>
                    {tagline && (
                        <p className={"text-xl md:text-2xl font-medium"}
                           style={{color: "var(--club-accent)", filter: "brightness(1.15)"}}>
                            {tagline}
                        </p>
                    )}
                    {description && (
                        <p className={"max-w-xl text-sm md:text-base text-white/80 leading-relaxed"}>
                            {description}
                        </p>
                    )}

                    {actions && (
                        <div className={"flex flex-wrap items-center gap-3 mt-2"}>
                            {actions}
                        </div>
                    )}

                    {showMetaBar && (
                        <div className={"mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center gap-x-10 gap-y-4 text-sm"}>
                            {meta?.map((m) => (
                                <div key={m.label}>
                                    <span className={"block text-[11px] uppercase tracking-widest text-white/70 mb-0.5"}>{m.label}</span>
                                    <span className={"font-semibold text-white"}>{m.value}</span>
                                </div>
                            ))}
                            {metaEnd && <div className={"ml-auto flex flex-wrap items-center gap-x-8 gap-y-2"}>{metaEnd}</div>}
                        </div>
                    )}

                    {extra}
                </div>
            </div>
        </section>
    )
}