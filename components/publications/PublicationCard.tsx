import Link from "next/link"
import type {PubSummary} from "@/lib/publications"

export default function PublicationCard({pub}: {pub: PubSummary}) {
    const meta = [pub.series, pub.season?.label ?? pub.issue].filter(Boolean).join(" · ")

    return (
        <Link href={`/library/${pub.id}`}
              className={"group flex flex-col w-[200px] overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all"}>
            <div className={"relative h-[300px] bg-navy overflow-hidden"}>
                {pub.cover ? (
                    <img src={pub.cover} alt={`${pub.title ?? pub.id} cover`}
                         className={"absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"}/>
                ) : (
                    <div className={"absolute inset-0 grid place-items-center"}>
                        <span className={"text-4xl font-black tracking-tight text-white/30"}>
                            {pub.series?.charAt(0) ?? pub.kind.charAt(0)}
                        </span>
                    </div>
                )}
            </div>
            <div className={"shrink-0 bg-white px-3 py-3"}>
                <span className={"block text-[9px] font-bold uppercase tracking-widest text-cyan-dark"}>
                    {meta || pub.kind}
                </span>
                <h3 className={"mt-1 font-bold text-navy leading-snug line-clamp-3 text-[15px]"}>
                    {pub.theme ?? pub.title ?? pub.id}
                </h3>
                <span className={"mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-cyan-dark group-hover:text-navy transition-colors"}>
                    Read <span className={"group-hover:translate-x-0.5 transition-transform"}>→</span>
                </span>
            </div>
        </Link>
    )
}