import type {PubSummary} from "@/lib/publications"
import PublicationCard from "@/components/publications/PublicationCard"

function Label({children}: {children: React.ReactNode}) {
    return (
        <p className={"text-[11px] font-bold uppercase tracking-[0.2em] text-(--club-accent) mb-3"}>
            {children}
        </p>
    )
}

const GRID = "grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-5"

export default function PublicationLibrary({
                                           publications,
                                           clubName,
                                       }: {
    publications: PubSummary[]
    clubName: string
}) {
    const byYear = new Map<string, {magazines: PubSummary[]; bulletins: PubSummary[]}>()

    for (const pub of publications) {
        const year = pub.year ?? (pub.publishedAt ? new Date(pub.publishedAt).getFullYear() : null)
        const key = year === null ? "other" : String(year)
        const entry = byYear.get(key) ?? {magazines: [], bulletins: []}
        byYear.set(key, {
            magazines: pub.kind === "magazine" ? [...entry.magazines, pub] : entry.magazines,
            bulletins: pub.kind === "bulletin" ? [...entry.bulletins, pub] : entry.bulletins,
        })
    }

    const groups = [...byYear.entries()]
        .sort((a, b) => {
            if (a[0] === "other") return 1
            if (b[0] === "other") return -1
            return Number(b[0]) - Number(a[0])
        })
        .map(([key, entry]) => ({
            year: key,
            label: key === "other" ? "Other" : key,
            ...entry,
        }))

    if (groups.length === 0) return null

    return (
        <div className={"space-y-10"}>
            {groups.map(({year, label, magazines, bulletins}) => (
                <div key={year}>
                    <div className={"flex items-baseline gap-3 mb-4 border-b border-gray-200 pb-2"}>
                        <h3 className={"text-xl md:text-2xl font-semibold text-navy"}>{label}</h3>
                        {magazines.length > 0 && (
                            <span className={"text-sm text-gray-400"}>
                                {magazines.length} guide{magazines.length > 1 ? "s" : ""}
                            </span>
                        )}
                        {bulletins.length > 0 && (
                            <span className={"text-sm text-gray-400"}>
                                {bulletins.length} bulletin{bulletins.length > 1 ? "s" : ""}
                            </span>
                        )}
                    </div>

                    {magazines.length > 0 && (
                        <div className={"mb-6"}>
                            <Label>Season Guides</Label>
                            <div className={GRID}>
                                {magazines.map((pub) => (
                                    <PublicationCard key={pub.id} pub={pub} clubName={clubName}/>
                                ))}
                            </div>
                        </div>
                    )}

                    {bulletins.length > 0 && (
                        <div>
                            <Label>Bulletins</Label>
                            <div className={GRID}>
                                {bulletins.map((pub) => (
                                    <PublicationCard key={pub.id} pub={pub} clubName={clubName}/>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}