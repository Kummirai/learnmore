import {notFound} from "next/navigation"
import type {Metadata} from "next"
import PublicationReader from "@/components/publications/PublicationReader"
import {getClub} from "@/lib/clubs"
import {getPublication} from "@/lib/publications"
import {clipText} from "@/lib/seo"

export const dynamic = "force-dynamic"

export async function generateMetadata({params}: {params: Promise<{id: string}>}): Promise<Metadata> {
    const {id} = await params
    const doc = await getPublication(id)
    if (!doc) return {}
    const title = doc.title ?? (doc.series ? `${doc.series}${doc.issue ? ` · ${doc.issue}` : ""}` : doc.id)
    return {
        title: `${title}`,
        description: doc.summary ? clipText(doc.summary) : undefined,
        alternates: {canonical: `/library/${doc.id}`},
    }
}

export default async function PublicationPage({
    params,
}: {
    params: Promise<{id: string}>
}) {
    const {id} = await params
    const doc = await getPublication(id)

    if (!doc) {
        notFound()
    }

    const club = doc.clubSlug ? await getClub(doc.clubSlug).catch(() => undefined) : undefined

    return <PublicationReader doc={doc} club={club}/>
}