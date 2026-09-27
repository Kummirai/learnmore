import Link from "next/link";
import { LuChevronRight } from "react-icons/lu";

const articles = [
  {
    title: "RelateWorld Achieves 100% Pass Rate for 5th Year",
    excerpt:
      "All 68 Grade 7 learners passed the year-end examinations with flying colours, continuing our tradition of academic excellence.",
    date: "12 Dec 2025",
    tag: "Achievement",
    color: "bg-ice-blue text-navy-dark",
    author: "Mrs. S. Johnson",
  },
  {
    title: "New Computer Lab Transforms Digital Learning",
    excerpt:
      "Thanks to generous donations from local businesses, our new 30-station computer lab is now fully operational.",
    date: "5 Nov 2025",
    tag: "Facilities",
    color: "bg-blue-100 text-blue-700",
    author: "Mr. P. du Toit",
  },
  {
    title: "Outdoor Classroom Opens for Foundation Phase",
    excerpt:
      "Grade R to 3 learners can now enjoy lessons in our new outdoor learning space, complete with a vegetable garden.",
    date: "20 Oct 2025",
    tag: "Foundation Phase",
    color: "bg-purple-100 text-purple-700",
    author: "Ms. E. Chen",
  },
  {
    title: "School Choir Wins Regional Competition",
    excerpt:
      "Our 45-member choir took first place at the Regional Schools Music Festival, impressing judges with their harmonies.",
    date: "8 Oct 2025",
    tag: "Arts",
    color: "bg-pink-100 text-pink-700",
    author: "Mrs. K. Mokoena",
  },
  {
    title: "Chess Team Brings Home Trophy",
    excerpt:
      "The RelateWorld chess team won the Inter-School Chess Tournament, with three learners earning individual medals.",
    date: "22 Sep 2025",
    tag: "Achievement",
    color: "bg-ice-blue text-navy-dark",
    author: "Mr. D. Okafor",
  },
  {
    title: "Heritage Day: A Celebration of Diversity",
    excerpt:
      "Learners dressed in traditional attire and shared cultural foods, music, and stories from their heritage.",
    date: "15 Sep 2025",
    tag: "Event",
    color: "bg-orange-100 text-orange-700",
    author: "Mrs. P. Naidoo",
  },
  {
    title: "Parent-Teacher Conference Success",
    excerpt:
      "Record attendance at our Term 3 parent-teacher meetings, with over 95% of parents attending.",
    date: "1 Sep 2025",
    tag: "Community",
    color: "bg-cyan-100 text-cyan-700",
    author: "Mr. M. Williams",
  },
  {
    title: "Winter Sports Day Results",
    excerpt:
      "Green House took the overall trophy at this year's Winter Sports Day, with record participation across all grades.",
    date: "15 Jun 2025",
    tag: "Sports",
    color: "bg-amber-100 text-amber-700",
    author: "Mr. S. Chen",
  },
];

const tags = [...new Set(articles.map((a) => a.tag))];

export default function NewsPage() {
  return (
    <section className={"flex-1 px-4 py-12"}>
      <div className={"max-w-4xl mx-auto"}>
        <div className={"text-center mb-10"}>
          <h1
            className={"text-3xl md:text-4xl font-semibold text-gray-800 mb-3"}
          >
            School News
          </h1>
          <p className={"text-gray-500 max-w-xl mx-auto"}>
            Stay updated with the latest happenings at RelateWorld Primary
            School.
          </p>
        </div>

        <div className={"flex flex-wrap gap-2 mb-8"}>
          <span
            className={
              "text-xs px-3 py-1 rounded bg-ice-blue text-navy-dark font-medium"
            }
          >
            All
          </span>
          {tags.map((t) => (
            <span
              key={t}
              className={
                "text-xs px-3 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer transition"
              }
            >
              {t}
            </span>
          ))}
        </div>

        <div className={"space-y-6"}>
          {articles.map((a, i) => (
            <article
              key={i}
              className={
                "bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              }
            >
              <div className={"flex items-start gap-4"}>
                <div className={"flex-1 min-w-0"}>
                  <div className={"flex items-center gap-2 mb-2 flex-wrap"}>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded ${a.color}`}
                    >
                      {a.tag}
                    </span>
                    <span className={"text-xs text-gray-400"}>{a.date}</span>
                  </div>
                  <h2 className={"text-lg font-semibold text-gray-800 mb-2"}>
                    {a.title}
                  </h2>
                  <p className={"text-sm text-gray-600 leading-relaxed mb-3"}>
                    {a.excerpt}
                  </p>
                  <div className={"flex items-center justify-between"}>
                    <span className={"text-xs text-gray-400"}>
                      By {a.author}
                    </span>
                    <Link
                      href={"#"}
                      className={
                        "inline-flex min-h-11 items-center text-xs text-cyan font-medium gap-1 hover:gap-2 transition-all"
                      }
                    >
                      Read More <LuChevronRight />
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
