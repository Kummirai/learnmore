import type { Metadata } from "next";
import { LuCookie } from "react-icons/lu";
import { COOKIE_DOC } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "The cookies RelateWorld uses, why we use them, and how to change your cookie choice.",
  alternates: { canonical: "/cookies" },
};

export default function CookiesPage() {
  const doc = COOKIE_DOC;
  return (
    <section className={"reveal flex-1 px-4 py-16 md:py-24"}>
      <div className={"mx-auto max-w-4xl"}>
        <div className={"mb-12 text-center"}>
          <div
            className={
              "mb-6 inline-flex items-center gap-2 rounded-full bg-[color:var(--club-accent-soft)] px-4 py-1.5 text-sm font-medium text-[color:var(--club-accent)]"
            }
          >
            <LuCookie />
            <span>Small files, clear choices</span>
          </div>
          <h1 className={"mb-4 text-4xl font-semibold text-navy md:text-5xl"}>
            {doc.title}
          </h1>
          <p className={"text-sm text-navy/60"}>{doc.updated}</p>
        </div>

        <p className={"mb-10 text-center text-lg leading-relaxed text-navy/80"}>
          {doc.intro}
        </p>

        <div className={"space-y-6"}>
          {doc.sections.map((section) => (
            <div
              key={section.heading}
              className={"rounded-2xl bg-white p-6 shadow-sm md:p-8"}
            >
              <h2 className={"mb-3 text-xl font-semibold text-navy"}>
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
                        className={"mt-2 size-1.5 shrink-0 rounded-full bg-[color:var(--club-accent)]"}
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
