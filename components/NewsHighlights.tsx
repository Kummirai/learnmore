import Link from "next/link";

const posts = [
  {
    title: "Spring Season Reading Guides Are Live",
    excerpt:
      "Footsteps for Surge and Rooted for Sprout — thirteen weeks of daily verses, try-its and prayers are ready in the app.",
    date: "1 Sep 2026",
    tag: "Reading Guides",
    color: "bg-ice-blue text-navy-dark",
  },
  {
    title: "Sprout Camp Bookings Are Open",
    excerpt:
      "Four days of skills, hikes and campfires — leaders on hand to sign off requirements. Places are limited, so book early.",
    date: "15 Aug 2026",
    tag: "Sprout",
    color: "bg-blue-100 text-blue-700",
  },
  {
    title: "New Clubs Opened for Parents & Families",
    excerpt:
      "Anchor, Spark and Synergy bring single parents and couples of every stage into the Relate family — every season now has a home.",
    date: "2 Aug 2026",
    tag: "Community",
    color: "bg-purple-100 text-purple-700",
  },
];

export default function NewsHighlights() {
  return (
    <section className={"reveal bg-tile px-6 py-24 md:px-4 md:py-32"}>
      <div className={"max-w-6xl mx-auto"}>
        <div className={"mb-10 flex items-center justify-between gap-4"}>
          <div>
            <p
              className={
                "mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan"
              }
            >
              Latest news
            </p>
            <h2 className={"text-3xl font-semibold text-navy md:text-4xl"}>
              From the Relate community
            </h2>
          </div>
          <Link href={"/news"} className={"link-chevron"}>
            View all
          </Link>
        </div>
        <div className={"grid grid-cols-1 gap-6 md:grid-cols-3"}>
          {posts.map((p, i) => (
            <div
              key={i}
              className={
                "bg-white rounded-2xl p-6 border border-black/5 hover:shadow-lg transition-shadow"
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
              <p className={"text-xs text-navy/70"}>{p.date}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
