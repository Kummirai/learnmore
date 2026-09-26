import PublicationReader from "@/components/publications/PublicationReader"
import {getClub} from "@/constants/relate"
import {getPublication, getPublications} from "@/lib/publications"

const SERIES_TO_CLUB: Record<string, string> = {
    footsteps: "surge",
    rooted: "sprout",
}

export default async function MagazinePage({slug}: {slug: string}) {
    const clubSlug = SERIES_TO_CLUB[slug]
    const club = clubSlug ? getClub(clubSlug) : undefined
    const publications = club ? await getPublications(club.slug) : []
    const magazines = publications.filter((p) => p.kind === "magazine")
    const doc = magazines[0] ? await getPublication(magazines[0].id) : null

    if (!doc) {
        return (
            <section className={"flex-1 px-4 py-12"}>
                <div className={"max-w-4xl mx-auto"}>

                    <h1 className={"text-3xl font-semibold text-gray-800"}>Season guide not found</h1>
                </div>
            </section>
        )
    }

    return <PublicationReader doc={doc} club={club}/>
}