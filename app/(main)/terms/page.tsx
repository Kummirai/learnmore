import type { Metadata } from "next";
import { LuFileText } from "react-icons/lu";
import { TERMS_DOC } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The agreement between you and RelateWorld for using the community service.",
};

export default function TermsPage() {
  const doc = TERMS_DOC;
  return (
    <section className={"reveal flex-1 px-4 py-16 md:py-24"}>
      <div className={"max-w-4xl mx-auto"}>
        <div className={"text-center mb-12"}>
          <div
            className={
              "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium mb-6 bg-[color:var(--club-accent-soft)] text-[color:var(--club-accent)]"
            }
          >
            <LuFileText />
            <span>Our agreement with you</span>
          </div>
          <h1 className={"text-4xl md:text-5xl font-semibold text-navy mb-4"}>
            {doc.title}
          </h1>
          <p className={"text-sm text-navy/60"}>{doc.updated}</p>
        </div>

        <p className={"text-lg leading-relaxed text-navy/80 mb-10 text-center"}>
          {doc.intro}
        </p>

        <div className={"space-y-6"}>
          {doc.sections.map((section) => (
            <div
              key={section.heading}
              className={"bg-white rounded-2xl p-6 md:p-8 shadow-sm"}
            >
              <h2 className={"text-xl font-semibold text-navy mb-3"}>
                {section.heading}
              </h2>
              <p className={"leading-relaxed text-navy/80"}>{section.body}</p>
              {section.bullets?.length ? (
                <ul className={"mt-4 space-y-2"}>
                  {section.bullets.map((point) => (
                    <li
                      key={point}
                      className={"flex items-start gap-3 text-navy/80"}
                    >
                      <span
                        className={"mt-2 size-1.5 rounded-full bg-[color:var(--club-accent)] shrink-0"}
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
