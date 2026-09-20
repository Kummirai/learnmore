import {notFound} from "next/navigation"
import PageHero from "@/components/PageHero"
import PublicationCard from "@/components/publications/PublicationCard"
import {getClub, getClubClass} from "@/constants/relate"
import {getPublications} from "@/lib/publications"

export const dynamic = "force-dynamic"

export default async function ClubMagazinesPage({
    params,
}: {
    params: Promise<{club: string}>
}) {
    const {club: slug} = await params
    const club = getClub(slug) ?? getClubClass(slug)

    if (!club) {
        notFound()
    }

    const publications = await getPublications(club.slug)
    const numericAge = club.ageRange.match(/^[\d–+ ]+/) ? club.ageRange : null

    return (
        <>
            <PageHero
                title={`${club.name} Magazines`}
                tagline={club.tagline}
                description={`Read ${club.name}’s season study guide and bulletin — open to everyone, no account needed.`}
                watermark={numericAge ? numericAge.replace(" yrs", "").trim() : undefined}
                bgImage={club.heroImage}
            />

            <section className={"flex-1 px-4 py-12"}>
                <div className={"max-w-6xl mx-auto"}>
                    <span className={"text-xs uppercase tracking-widest text-cyan font-medium"}>Library</span>
                    <h2 className={"text-2xl md:text-3xl font-semibold text-gray-800 mt-1 mb-2"}>
                        Magazines &amp; Bulletins
                    </h2>
                    {publications.length > 0 ? (
                        <div className={"flex flex-wrap gap-3 md:gap-4"}>
                            {publications.map((pub) => (
                                <PublicationCard key={pub.id} pub={pub}/>
                            ))}
                        </div>
                    ) : (
                        <p className={"text-gray-500 text-sm mt-4"}>
                            No magazines published for {club.name} yet — check back soon.
                        </p>
                    )}
                </div>
            </section>
        </>
    )
}