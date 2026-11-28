import Link from "next/link";
import { newsPosts } from "@/lib/news";

const posts = newsPosts.slice(0, 3);

export default function NewsHighlights() {
  return (
    <section
      className={"reveal px-6 py-24 md:px-4 md:py-32"}
      style={{ background: "linear-gradient(150deg, #fff8e3 0%, #ffffff 70%)" }}
    >
      <div className={"max-w-6xl mx-auto"}>
        <div
          className={
            "mx-auto mb-10 flex max-w-2xl flex-col items-center gap-4 text-center"
          }
        >
          <p
            className={
              "text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan"
            }
          >
            Latest news
          </p>
          <h2 className={"text-3xl font-semibold text-navy md:text-4xl"}>
            From the Relate community
          </h2>
          <Link href={"/news"} className={"link-chevron"}>
            View all
          </Link>
        </div>
        <div
          className={
            "reveal reveal-stagger grid grid-cols-1 gap-6 md:grid-cols-3"
          }
        >
          {posts.map((p) => (
            <article
              key={p.slug}
              className={
                "stagger-item hover-lift rounded-2xl border border-black/5 bg-white p-6"
              }
            >
              <span
                className={`inline-block text-xs font-medium px-2 py-0.5 rounded ${p.color} mb-3`}
              >
                {p.tag}
              </span>
              <h3 className={"text-base font-semibold text-navy mb-2"}>
                {p.title}
              </h3>
              <p className={"text-sm text-navy/70 leading-relaxed mb-3"}>
                {p.excerpt}
              </p>
              <p className={"text-xs text-navy/70"}>{p.dateLabel}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
