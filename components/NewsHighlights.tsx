import { LuChevronRight } from "react-icons/lu";
import Link from "next/link";

const posts = [
  {
    title: "RelateWorld Achieves 100% Pass Rate",
    excerpt:
      "For the fifth consecutive year, all our Grade 7 learners passed with flying colours.",
    date: "12 Dec 2025",
    tag: "Achievement",
    color: "bg-ice-blue text-navy-dark",
  },
  {
    title: "New Computer Lab Opened",
    excerpt:
      "Thanks to our sponsors, learners now have access to 30 new computers for digital literacy.",
    date: "5 Nov 2025",
    tag: "Facilities",
    color: "bg-blue-100 text-blue-700",
  },
  {
    title: "Grade R Outdoor Classroom Launch",
    excerpt:
      "Our new outdoor learning space lets foundation phase learners explore nature while learning.",
    date: "20 Oct 2025",
    tag: "Foundation Phase",
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
              From Our School
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
