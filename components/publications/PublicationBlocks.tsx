import type { PubBlock, ReadingPart, ReadingBodyItem } from "@/lib/publications"

function ChecklistCard({title, items}: {title?: string; items?: string[]}) {
    return (
        <div className={"rounded-xl border border-cyan/25 bg-alice-blue/60 p-4 md:p-5"}>
            {title && (
                <p className={"text-[11px] font-bold uppercase tracking-[0.18em] text-cyan mb-2.5"}>
                    {title}
                </p>
            )}
            <ul className={"space-y-2"}>
                {items?.map((item, i) => (
                    <li key={i} className={"flex gap-3 text-sm text-gray-700 leading-snug"}>
                        <span className={"mt-0.5 size-4 shrink-0 grid place-items-center rounded border border-cyan text-cyan"}>
                            <span className={"text-[10px] leading-none"}>✓</span>
                        </span>
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    )
}

function PrayCard({title, items}: {title?: string; items?: string[]}) {
    return (
        <div className={"rounded-xl bg-navy text-white p-4 md:p-5"}>
            {title && (
                <p className={"text-[11px] font-bold uppercase tracking-[0.18em] text-cyan mb-2.5"}>
                    {title}
                </p>
            )}
            <ul className={"space-y-2"}>
                {items?.map((item, i) => (
                    <li key={i} className={"flex gap-3 text-sm text-white/85 leading-snug"}>
                        <span className={"mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan"}/>
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    )
}

function NewsList({items}: {items?: string[]}) {
    return (
        <ul className={"space-y-2.5"}>
            {items?.map((item, i) => (
                <li key={i} className={"flex gap-3 text-[15px] text-gray-700 leading-relaxed"}>
                    <span className={"mt-2.5 size-1.5 shrink-0 rounded-full bg-cyan"}/>
                    {item}
                </li>
            ))}
        </ul>
    )
}

function ReadingInline({blocks}: {blocks?: PubBlock[]}) {
    if (!blocks?.length) return null
    return (
        <>
            {blocks.map((b, i) => {
                if (b.type === "image" && b.uri) {
                    return (
                        <img key={i} src={b.uri} alt=""
                             className={"w-full rounded-xl object-cover max-h-72"}/>
                    )
                }
                if (b.type === "quote") {
                    return (
                        <figure key={i} className={"my-2 border-l-2 border-cyan pl-4"}>
                            <blockquote className={"text-[15px] md:text-base font-medium text-navy italic leading-relaxed"}>
                                {b.text}
                            </blockquote>
                            {(b.by || b.source) && (
                                <figcaption className={"mt-1 text-[11px] uppercase tracking-widest text-gray-400 font-medium"}>
                                    {[b.by, b.source].filter(Boolean).join(" · ")}
                                </figcaption>
                            )}
                        </figure>
                    )
                }
                return <PubBlockView key={i} block={b}/>
            })}
        </>
    )
}

function ReadingIntro({part}: {part?: ReadingPart}) {
    if (!part || (!part.hook && !part.thesis)) return null
    return (
        <>
            <ReadingInline blocks={part.beforeHook}/>
            {part.hook && (
                <p className={"text-[15px] md:text-base text-gray-700 leading-relaxed"}>{part.hook}</p>
            )}
            <ReadingInline blocks={part.afterHook}/>
            {part.thesis && (
                <p className={"border-l-4 border-cyan pl-4 font-semibold text-navy text-[15px] md:text-base leading-relaxed"}>
                    {part.thesis}
                </p>
            )}
            <ReadingInline blocks={part.afterThesis}/>
        </>
    )
}

function ReadingBody({items}: {items?: ReadingBodyItem[]}) {
    if (!items?.length) return null
    return (
        <>
            {items.map((item, i) => (
                <div key={i}>
                    <ReadingInline blocks={item.beforeTopic}/>
                    {item.topic && (
                        <p className={"font-bold text-navy text-[15px] md:text-base leading-snug"}>
                            {item.topic}
                        </p>
                    )}
                    <ReadingInline blocks={item.afterTopic}/>
                    {item.support?.map((s) => (
                        <p key={s} className={"text-[15px] md:text-base text-gray-700 leading-relaxed"}>{s}</p>
                    ))}
                    <ReadingInline blocks={item.afterSupport}/>
                    {item.closing && (
                        <p className={"text-[15px] md:text-base italic text-gray-600 leading-relaxed"}>{item.closing}</p>
                    )}
                    <ReadingInline blocks={item.afterClosing}/>
                </div>
            ))}
        </>
    )
}

function ReadingConclusion({part}: {part?: ReadingPart}) {
    if (!part || (!part.restate && !part.whyItMatters && !part.closing)) return null
    return (
        <>
            <ReadingInline blocks={part.beforeRestate}/>
            {part.restate && (
                <p className={"border-l-4 border-cyan pl-4 font-semibold text-navy text-[15px] md:text-base leading-relaxed"}>
                    {part.restate}
                </p>
            )}
            <ReadingInline blocks={part.afterRestate}/>
            {part.whyItMatters && (
                <p className={"text-[15px] md:text-base text-gray-700 leading-relaxed"}>{part.whyItMatters}</p>
            )}
            <ReadingInline blocks={part.afterWhyItMatters}/>
            {part.closing && (
                <p className={"text-[15px] md:text-base font-semibold text-navy leading-relaxed"}>{part.closing}</p>
            )}
            <ReadingInline blocks={part.afterClosing}/>
        </>
    )
}

function ReadingView({block}: {block: PubBlock}) {
    const s = block.structure
    if (!s) return null
    return (
        <div className={"space-y-4"}>
            <ReadingIntro part={s.intro}/>
            <ReadingBody items={s.body}/>
            <ReadingConclusion part={s.conclusion}/>
        </div>
    )
}

function QuoteBlock({text, by}: {text?: string; by?: string}) {
    return (
        <figure className={"my-4 text-center"}>
            <span aria-hidden className={"block text-5xl leading-none text-cyan"}>“</span>
            <blockquote className={"text-xl md:text-2xl font-medium text-navy leading-snug"}>
                {text}
            </blockquote>
            {by && (
                <figcaption className={"mt-3 text-[11px] uppercase tracking-[0.2em] text-gray-400 font-medium"}>
                    {by}
                </figcaption>
            )}
        </figure>
    )
}

function QuizBlock({block}: {block: PubBlock}) {
    const options = block.options ?? []
    const correct = options[block.correctIndex ?? 0]

    return (
        <details className={"group rounded-xl border border-dashed border-gray-300 bg-white p-4 md:p-5 open:border-cyan"}>
            <summary className={"flex items-center justify-between gap-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden"}>
                <span>
                    <span className={"block text-[11px] font-bold uppercase tracking-[0.18em] text-cyan"}>
                        Daily quiz
                    </span>
                    <span className={"mt-0.5 block font-semibold text-navy text-sm"}>
                        {block.question}
                    </span>
                </span>
                <span className={"shrink-0 text-sm text-cyan group-open:rotate-180 transition-transform"}>▼</span>
            </summary>
            <div className={"mt-4 space-y-3"}>
                <ol className={"space-y-1.5"}>
                    {options.map((opt, i) => (
                        <li key={i} className={"flex items-start gap-2.5 text-sm text-gray-700 leading-snug"}>
                            <span className={"mt-0.5 size-5 shrink-0 grid place-items-center rounded bg-alice-blue text-[11px] font-bold text-navy"}>
                                {String.fromCharCode(65 + i)}
                            </span>
                            {opt}
                        </li>
                    ))}
                </ol>
                <div className={"rounded-lg bg-ice-blue/60 border border-cyan/20 p-3"}>
                    <p className={"text-[11px] font-bold uppercase tracking-widest text-cyan"}>Correct answer</p>
                    <p className={"text-sm text-navy mt-1 font-medium"}>{correct}</p>
                    {block.explain && (
                        <p className={"text-sm text-gray-600 mt-2 leading-relaxed"}>{block.explain}</p>
                    )}
                </div>
            </div>
        </details>
    )
}

function ReflectionBlock({block}: {block: PubBlock}) {
    return (
        <div className={"rounded-xl bg-alice-blue border border-gray-100 p-4 md:p-5"}>
            <p className={"text-[11px] font-bold uppercase tracking-[0.18em] text-cyan mb-2"}>Reflect</p>
            <p className={"text-sm text-gray-700 italic leading-relaxed"}>{block.prompt}</p>
            {block.placeholder && (
                <div className={"mt-4 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-400 italic"}>
                    {block.placeholder}
                </div>
            )}
        </div>
    )
}

export default function PubBlockView({block}: {block: PubBlock}) {
    switch (block.type) {
        case "heading":
            return <h3 className={"text-lg font-bold text-navy"}>{block.text}</h3>
        case "paragraph":
            return <p className={"text-[15px] md:text-base text-gray-700 leading-relaxed"}>{block.text}</p>
        case "checklist":
            return <ChecklistCard title={block.title} items={block.items}/>
        case "pray":
            return <PrayCard title={block.title} items={block.items}/>
        case "list":
            return <NewsList items={block.items}/>
        case "quote":
            return <QuoteBlock text={block.text} by={block.by}/>
        case "quiz":
            return <QuizBlock block={block}/>
        case "reflection":
            return <ReflectionBlock block={block}/>
        case "reading":
            return <ReadingView block={block}/>
        case "image":
            return block.uri ? (
                <img src={block.uri} alt="" className={"w-full rounded-xl object-cover"}/>
            ) : null
        default:
            return block.text ? (
                <p className={"text-[15px] md:text-base text-gray-700 leading-relaxed"}>{block.text}</p>
            ) : null
    }
}

export function PubBlocks({blocks}: {blocks: PubBlock[]}) {
    return (
        <>
            {blocks.map((block, i) => (
                <PubBlockView key={`${block.type}-${i}`} block={block}/>
            ))}
        </>
    )
}