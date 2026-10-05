import Link from "next/link"
import Image from "next/image"
import {LuArrowRight} from "react-icons/lu"
import type {PubSummary} from "@/lib/publications"

/** Real covers are 1410×2250 — keep the tile on that ratio so grids stay even. */
const COVER_RATIO = "aspect-[1410/2250]"

function seasonLabel(pub: PubSummary): string {
    const season = pub.season
    if (season?.name && season.year) return `${season.name} ${season.year}`
    if (season?.name) return season.name
    if (season?.year) return String(season.year)
    if (pub.month && pub.year) return `${pub.month} ${pub.year}`
    if (pub.year) return String(pub.year)
    return pub.month ?? ""
}

export default function PublicationCard({pub, clubName}: {pub: PubSummary; clubName: string}) {
    const title = pub.theme ?? pub.title ?? pub.id
    const label = seasonLabel(pub)

    return (
        <Link href={`/library/${pub.id}`}
              title={label ? `${clubName} — ${label}` : clubName}
              className={
                  "group relative block w-full overflow-hidden bg-navy shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:shadow-xl hover:ring-2 hover:ring-(--club-accent)"
              }>
            <div className={`relative w-full ${COVER_RATIO} overflow-hidden`}>
                {pub.cover ? (
                    <Image src={pub.cover}
                         alt={`${title} cover`}
                         fill
                         sizes="(max-width: 768px) 50vw, 25vw"
                         className={
                             "absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                         }/>
                ) : (
                    <div
                        className={"absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center text-white"}
                        style={{
                            backgroundImage:
                                "linear-gradient(155deg, var(--club-accent) 0%, var(--club-accent-dark) 100%)",
                        }}>
                        <span
                            className={
                                "text-lg font-black uppercase leading-none tracking-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)] md:text-xl"
                            }>
                            {clubName}
                        </span>
                        {label && (
                            <span
                                className={
                                    "text-[10px] font-semibold uppercase leading-none tracking-[0.25em] text-white/85"
                                }>
                                {label}
                            </span>
                        )}
                    </div>
                )}

                <span
                    aria-hidden="true"
                    className={
                        "pointer-events-none absolute inset-0 grid place-items-center bg-navy/45 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    }>
                    <span className={"grid size-10 place-items-center rounded-full bg-white/95 text-navy shadow-lg"}>
                        <LuArrowRight className={"size-5 transition-transform duration-300 group-hover:translate-x-0.5"}/>
                    </span>
                </span>
            </div>
        </Link>
    )
}
