import { LuArrowUpRight, LuBadgeCheck, LuBookOpen, LuGraduationCap, LuLaptop } from "react-icons/lu";

const LINKS = [
  {
    icon: LuBookOpen,
    title: "Browse all free courses",
    body: "160+ self-paced courses across business, computer science, maths, science and more.",
    href: "https://www.saylor.org/CourseCatalog",
  },
  {
    icon: LuLaptop,
    title: "Computer Science · 17 courses",
    body: "Programming, software engineering and IT foundations to build on your club skills.",
    href: "https://learn.saylor.org/course/index.php?categoryid=9",
  },
  {
    icon: LuGraduationCap,
    title: "Specialization programs",
    body: "11 focused tracks built around in-demand workplace skills.",
    href: "https://learn.saylor.org/enrol/programs/catalogue/index.php",
  },
  {
    icon: LuBadgeCheck,
    title: "Certificates & college credit",
    body: "Free completion certificates, plus ACE-recommended credit through $5 proctored exams.",
    href: "https://www.saylor.org/Credit",
  },
];

const STATS = ["160+ free courses", "100% free", "Self-paced", "Free certificates"];

/**
 * Curated next-step learning — Saylor University (formerly Saylor Academy).
 * A nonprofit offering free, self-paced university-level courses since 2008.
 */
export default function GrowSkillsSection() {
  return (
    <section className="mt-4 border-t border-gray-100 pt-12" aria-labelledby="grow-skills">
      <div className="rounded-3xl bg-navy px-6 py-8 text-white md:px-10 md:py-10">
        <span className="inline-block rounded-full border border-cyan/40 bg-cyan/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-light">
          Grow your skills
        </span>
        <h2 id="grow-skills" className="mt-4 max-w-3xl text-2xl font-black leading-tight md:text-3xl">
          Free university-level learning with Saylor University
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/70 md:text-base">
          Formerly Saylor Academy, this nonprofit has offered tuition-free, self-paced courses
          since 2008. With 160+ courses and more than 3 million learners, it is a serious next
          step after the club curriculum — free certificates included, and ACE-recommended
          college credit available.
        </p>

        <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold uppercase tracking-wider text-white/60">
          {STATS.map((stat) => (
            <li key={stat} className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-cyan" aria-hidden="true" />
              {stat}
            </li>
          ))}
        </ul>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {LINKS.map(({ icon: Icon, title, body, href }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="group flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 transition-colors hover:border-cyan/50 hover:bg-white/10"
            >
              <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-cyan/15 text-cyan-light">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-3">
                  <span className="text-sm font-bold text-white">{title}</span>
                  <LuArrowUpRight className="size-4 shrink-0 text-white/40 transition-colors group-hover:text-cyan-light" aria-hidden="true" />
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-white/60">{body}</span>
              </span>
            </a>
          ))}
        </div>

        <p className="mt-5 text-[11px] leading-relaxed text-white/40">
          Saylor University is an independent nonprofit. Relate links to these free resources for
          ambitious learners — always confirm credit transfer with your own institution.
        </p>
      </div>
    </section>
  );
}
