import Link from "next/link";
import { LuArrowLeft, LuBookOpen, LuFileText, LuListTree } from "react-icons/lu";
import {
  chapters,
  badgeStyles,
  type ManualSection,
} from "@/constants/relateManual";

function Badge({ badge }: { badge: ManualSection["badge"] }) {
  if (!badge) return null;
  const s = badgeStyles[badge];
  if (!s) return null;
  return (
    <span
      className={
        "inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
      }
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      {badge}
    </span>
  );
}

function SectionBody({ section }: { section: ManualSection }) {
  return (
    <div className={"space-y-3"}>
      {section.body && (
        <p className={"text-gray-600 text-sm leading-relaxed"}>{section.body}</p>
      )}
      {section.note && (
        <p className={"text-gray-500 text-xs bg-cyan/5 border border-cyan/15 rounded-lg px-3 py-2.5 leading-relaxed"}>
          {section.note}
        </p>
      )}
      {section.list && (
        <ul className={"space-y-1.5"}>
          {section.list.map((li, i) => (
            <li key={i} className={"flex gap-2 text-sm text-gray-600 leading-relaxed"}>
              <span className={"text-cyan mt-px shrink-0"}>›</span>
              {li}
            </li>
          ))}
        </ul>
      )}
      {section.tags && (
        <div className={"flex flex-wrap gap-1.5"}>
          {section.tags.map((t, i) => (
            <span
              key={i}
              className={"text-[10px] uppercase tracking-wider text-gray-400 font-medium"}
            >
              #{t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ManualPage() {
  return (
    <section className={"flex-1 px-4 py-12"}>
      <div className={"max-w-5xl mx-auto"}>
        <Link
          href={"/about"}
          className={"inline-flex items-center gap-1 text-sm text-cyan hover:text-cyan-dark mb-6 transition-colors"}
        >
          <LuArrowLeft/> Back to About
        </Link>

        <div className={"text-center mb-12"}>
          <h1 className={"text-3xl md:text-4xl font-semibold text-gray-800 mb-3"}>
            The Relate Manual
          </h1>
          <p className={"text-gray-500 max-w-xl mx-auto"}>
            The heart, mind, and operational framework of our organization —
            for board members, volunteers, sponsors, and partners.
          </p>
        </div>

        <div className={"lg:grid lg:grid-cols-12 lg:gap-8"}>
          <aside className={"hidden lg:block lg:col-span-3"}>
            <nav className={"sticky top-24 space-y-1"}>
              <p className={"text-[11px] uppercase tracking-wider text-gray-400 font-semibold mb-3"}>
                Table of Contents
              </p>
              {chapters.map((c) => (
                <a
                  key={c.id}
                  href={`#${c.id}`}
                  className={"block text-gray-600 hover:text-cyan transition-colors py-0.5"}
                >
                  <span className={"text-cyan font-mono text-xs mr-1.5"}>
                    {String(chapters.indexOf(c) + 1).padStart(2, "0")}
                  </span>
                  {c.title}
                </a>
              ))}
            </nav>
          </aside>

          <div className={"lg:col-span-9 space-y-8"}>
            {chapters.map((chapter, ci) => (
              <article
                key={chapter.id}
                id={chapter.id}
                className={"bg-white rounded-xl p-8 md:p-10 shadow-sm scroll-mt-24"}
              >
                <header className={"mb-6"}>
                  <p className={"text-cyan font-mono text-xs mb-2"}>
                    Chapter {String(ci + 1).padStart(2, "0")}
                  </p>
                  <h2 className={"text-xl md:text-2xl font-semibold text-gray-800 mb-2"}>
                    {chapter.title}
                  </h2>
                  {chapter.tagline && (
                    <p className={"text-gray-500 text-sm mb-3"}>{chapter.tagline}</p>
                  )}
                  {chapter.content && (
                    <p className={"text-gray-600 text-sm leading-relaxed whitespace-pre-line"}>
                      {chapter.content}
                    </p>
                  )}
                </header>

                <div className={"space-y-5"}>
                  {chapter.sections.map((s, i) => (
                    <section
                      key={i}
                      className={
                        s.highlight
                          ? "bg-cyan/5 border border-cyan/15 rounded-lg p-5"
                          : "border-t border-gray-100 pt-5"
                      }
                    >
                      <div className={"flex flex-wrap items-center gap-2 mb-2"}>
                        <h3 className={"font-semibold text-gray-800 text-sm"}>
                          {s.title}
                        </h3>
                        {s.badge && <Badge badge={s.badge}/>}
                      </div>
                      <SectionBody section={s}/>
                    </section>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className={"mt-10 bg-white rounded-xl p-6 shadow-sm border-l-4 border-cyan"}>
          <div className={"flex items-start gap-3"}>
            <LuFileText className={"text-xl text-cyan shrink-0 mt-0.5"}/>
            <p className={"text-gray-600 text-sm"}>
              Every section above is pulled live from the Relate Manual data
              used in the Relate mobile app — so the website manual always
              matches the handbook volunteers read.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
