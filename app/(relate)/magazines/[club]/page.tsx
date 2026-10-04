import {notFound} from "next/navigation"
import type {Metadata} from "next"
import type {CSSProperties} from "react"
import PublicationLibrary from "@/components/publications/PublicationLibrary"
import {getClub} from "@/lib/clubs"
import {getPublications} from "@/lib/publications"

export const dynamic = "force-dynamic"

export async function generateMetadata({params}: {params: Promise<{club: string}>}): Promise<Metadata> {
    const {club: slug} = await params
    const club = await getClub(slug).catch(() => undefined)
    if (!club) return {}
    return {
        title: `${club.name} Season Guides`,
        description: `Season guides, magazines and bulletins for the ${club.name} club (${club.ageRange}).`,
        alternates: {canonical: `/magazines/${club.slug}`},
    }
}

export default async function ClubMagazinesPage({
    params,
}: {
    params: Promise<{club: string}>
}) {
    const {club: slug} = await params
    const club = await getClub(slug).catch(() => undefined)

    if (!club) {
        notFound()
    }

    const publications = await getPublications(club.slug)
    const numericAge = club.ageRange.match(/^[\d–+ ]+/) ? club.ageRange : null
    const clubVars = {
        "--club-accent": club.color,
        "--club-accent-dark": club.colorDark,
    } as CSSProperties

    return (
        <>
            <section className="px-4 pt-16 pb-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                        {club.name} Season Guides
                    </h1>
                    <p className="mt-2 text-gray-600 max-w-2xl">
                        Read {club.name}’s season study guide and bulletin — open to everyone, no account needed.
                    </p>
                </div>
            </section>

            <section style={clubVars} className={"flex-1 px-4 py-12"}>
                <div className={"max-w-6xl mx-auto"}>
                    <span className={"text-xs uppercase tracking-widest text-(--club-accent) font-medium"}>Library</span>
                    <h2 className={"text-2xl md:text-3xl font-semibold text-gray-800 mt-1 mb-2"}>
                        Season Guides &amp; Bulletins
                    </h2>
                    {publications.length > 0 ? (
                        <PublicationLibrary publications={publications} clubName={club.name}/>
                    ) : (
                        <p className={"text-gray-500 text-sm mt-4"}>
                            No season guides published for {club.name} yet — check back soon.
                        </p>
                    )}
                </div>
            </section>
        </>
    )
}