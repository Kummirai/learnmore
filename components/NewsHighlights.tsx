import { LuChevronRight } from "react-icons/lu";
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
    title: "The Bible Quiz Season Has Begun",
    excerpt:
      "Read the books, earn points on the leaderboard and battle it out at club — Sprout's quiz season is underway.",
    date: "15 Aug 2026",
    tag: "Sprout",
    color: "bg-blue-100 text-blue-700",
  },
  {
    title: "New Clubs Opened for Parents & Families",
    excerpt:
      "Anchor, Base and Nexus bring single parents, couples and families into the Relate family — every age now has a home.",
    date: "2 Aug 2026",
    tag: "Community",
    color: "bg-purple-100 text-purple-700",
  },
];

export default function NewsHighlights() {
  return (
    <section className={"py-16 md:py-20 bg-gray-50 px-4"}>
      <div className={"max-w-6xl mx-auto"}>
        <div className={"flex items-center justify-between mb-8"}>
          <div>
            <h4 className={"text-cyan font-medium mb-1"}>LATEST NEWS</h4>
            <h2 className={"text-2xl md:text-3xl font-semibold text-gray-800"}>
              From the Relate Community
            </h2>
          </div>
          <Link
            href={"/news"}
            className={
              "text-sm text-cyan font-medium flex items-center gap-1 hover:gap-2 transition-all"
            }
          >
            View All <LuChevronRight />
          </Link>
        </div>
        <div className={"grid grid-cols-1 md:grid-cols-3 gap-6"}>
          {posts.map((p, i) => (
            <div
              key={i}
              className={
                "bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow"
              }
            >
              <span
                className={`inline-block text-xs font-medium px-2 py-0.5 rounded ${p.color} mb-3`}
              >
                {p.tag}
              </span>
              <h3 className={"text-base font-semibold text-gray-800 mb-2"}>
                {p.title}
              </h3>
              <p className={"text-sm text-gray-600 leading-relaxed mb-3"}>
                {p.excerpt}
              </p>
              <p className={"text-xs text-gray-400"}>{p.date}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
