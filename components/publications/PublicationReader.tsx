import type {CSSProperties} from "react"
import PageHero from "@/components/PageHero"
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
    // The hero paints the club gradient rather than the cover, so the club
    // colours have to be in scope on the hero itself, not just the body below.
    const clubVars = {
        "--club-accent": club?.color,
        "--club-accent-dark": club?.colorDark,
    } as CSSProperties

    return (
        <>
            <PageHero
                title={heading}
                mobileTitle={heading.split(/\s+/).slice(0, 1).join(" ")}
                tagline={doc.series}
                description={doc.summary}
                watermark={doc.year ? String(doc.year) : undefined}
                meta={[
                    {label: "Kind", value: isMagazine ? "Season Study Guide" : "Bulletin"},
                    {label: "Club", value: club?.name ?? doc.clubSlug ?? "—"},
                    {label: "Season", value: seasonLabel ?? "—"},
                ]}
                style={clubVars}
            />

            <section style={clubVars} className={"flex-1 px-4 py-12"}>
                {isMagazine && doc.weeks && doc.weeks.length > 0 ? (
                    <MagazineReader key={doc.id} doc={doc}/>
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