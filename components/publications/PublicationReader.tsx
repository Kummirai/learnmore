import type {CSSProperties} from "react"
import {Suspense} from "react"
import Navbar from "@/components/Navbar"
import MagazineReader from "@/components/publications/MagazineReader"
import {PubBlocks} from "@/components/publications/PublicationBlocks"
import type {PubDocument} from "@/lib/publications"
import type {RelateClub} from "@/constants/relate"

type PublicationReaderProps = {
    doc: PubDocument
    club?: RelateClub
}

export default function PublicationReader({doc, club}: PublicationReaderProps) {
    const isMagazine = doc.kind === "magazine"
    const seasonLabel = doc.season?.label ?? doc.issue
    const heading = doc.theme ?? doc.title ?? doc.series ?? "Publication"
    // Readers arrive ready to read, so the page opens on the content itself.
    // The accent vars stay for the club-coloured rules and icons below.
    const clubVars = {
        "--club-accent": club?.color,
        "--club-accent-dark": club?.colorDark,
    } as CSSProperties

    return (
        <>
            <Navbar/>

            <section style={clubVars} className={"flex-1 px-4 pt-8 pb-12"}>
                <header className={"max-w-3xl mx-auto mb-8"}>
                    <p className={"text-[11px] font-bold uppercase tracking-[0.2em] text-(--club-accent-dark)"}>
                        {[isMagazine ? "Season Guide" : "Bulletin", club?.name ?? doc.clubSlug, seasonLabel]
                            .filter(Boolean)
                            .join(" · ")}
                    </p>
                    <h1 className={"mt-2 text-4xl md:text-6xl font-black tracking-tight leading-[1.05] text-navy"}>
                        {heading}
                    </h1>
                    {doc.series && (
                        <p className={"mt-2 text-base font-semibold text-(--club-accent-dark)"}>
                            {doc.series}
                        </p>
                    )}
                    {doc.summary && (
                        <p className={"mt-3 text-sm leading-relaxed text-slate-gray"}>
                            {doc.summary}
                        </p>
                    )}
                </header>

                {isMagazine && doc.weeks && doc.weeks.length > 0 ? (
                    <Suspense fallback={null}>
                        <MagazineReader key={doc.id} doc={doc}/>
                    </Suspense>
                ) : (
                    <div className={"max-w-3xl mx-auto"}>
                        {doc.blocks && doc.blocks.length > 0 && (
                            <div className={"space-y-6"}>
                                <PubBlocks blocks={doc.blocks}/>
                            </div>
                        )}
                    </div>
                )}
            </section>
        </>
    )
}
