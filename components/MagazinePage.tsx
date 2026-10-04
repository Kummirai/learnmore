import PublicationReader from "@/components/publications/PublicationReader"
import DataError from "@/components/DataError"
import type {RelateClub} from "@/constants/relate"
import {getClub} from "@/lib/clubs"
import {getPublication, getPublications} from "@/lib/publications"

const SERIES_TO_CLUB: Record<string, string> = {
    footsteps: "surge",
    rooted: "sprout",
}

export default async function MagazinePage({slug}: {slug: string}) {
    const clubSlug = SERIES_TO_CLUB[slug]
    let club: RelateClub | undefined
    let catalogueFailed = false
    try {
        club = clubSlug ? await getClub(clubSlug) : undefined
    } catch {
        // The guide itself is still readable without the club document — the
        // page below then renders without club theming rather than failing.
        catalogueFailed = true
    }
    const publications = clubSlug ? await getPublications(clubSlug) : []
    const magazines = publications.filter((p) => p.kind === "magazine")
    const doc = magazines[0] ? await getPublication(magazines[0].id) : null

    if (!doc) {
        return (
            <section className={"flex-1 px-4 py-12"}>
                <div className={"max-w-4xl mx-auto"}>
                    {catalogueFailed ? (
                        <DataError label={"This season guide"}/>
                    ) : (
                        <h1 className={"text-3xl font-semibold text-gray-800"}>
                            Season guide not found
                        </h1>
                    )}
                </div>
            </section>
        )
    }

    return <PublicationReader doc={doc} club={club}/>
}
