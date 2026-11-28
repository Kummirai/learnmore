export type NewsTag =
  | "Care & Connect"
  | "Clubs"
  | "Education"
  | "Reading Guides"
  | "Prayer"
  | "Store"
  | "Sports";

export type NewsPost = {
  slug: string;
  title: string;
  excerpt: string;
  /** ISO date used for ordering. */
  date: string;
  dateLabel: string;
  tag: NewsTag;
  /** Tailwind chip classes for the tag. */
  color: string;
  href?: string;
  cta?: string;
};

/** Newest first — the homepage highlights the first three. */
export const newsPosts: NewsPost[] = [
  {
    slug: "care-connect-day-2026",
    title: "Care & Connect Day closes the club year",
    excerpt:
      "Every club, one local need. On Saturday 5 and Sunday 6 December the whole family shows up to serve — and 50% of club collections goes straight to the harvest.",
    date: "2026-12-05",
    dateLabel: "5–6 Dec 2026",
    tag: "Care & Connect",
    color: "bg-teal-100 text-teal-700",
    href: "/care-connect-day",
    cta: "How the day works",
  },
  {
    slug: "club-season",
    title: "The club year: March to November",
    excerpt:
      "All seven clubs meet weekly from March through November — games, real conversations and practical skills — then the year closes with Care & Connect Day in December.",
    date: "2026-11-24",
    dateLabel: "24 Nov 2026",
    tag: "Clubs",
    color: "bg-cyan-100 text-cyan-700",
    href: "/#clubs",
    cta: "Find your club",
  },
  {
    slug: "school-kit-term-2-2027",
    title: "Relate School Kit returns in Term 2",
    excerpt:
      "South African public schools reopen for the second term on Tuesday 6 April 2027. School Kit stationery packs and Homework Weekend sessions resume with the new term.",
    date: "2026-11-18",
    dateLabel: "18 Nov 2026",
    tag: "Education",
    color: "bg-amber-100 text-amber-800",
    href: "/education",
    cta: "Explore Education",
  },
  {
    slug: "footsteps-rooted",
    title: "Footsteps and Rooted are ready for the season",
    excerpt:
      "Thirteen weeks of daily verses, try-its and prayers for Surge and Sprout are live in the app — one short step every day.",
    date: "2026-11-10",
    dateLabel: "10 Nov 2026",
    tag: "Reading Guides",
    color: "bg-blue-100 text-blue-700",
    href: "/footsteps",
    cta: "Open Footsteps",
  },
  {
    slug: "six-prayer-moments",
    title: "Six prayer moments, every day",
    excerpt:
      "Daily prayer times, a verse every morning and a shared prayer wall keep the rhythm going between meetups — free, wherever you are.",
    date: "2026-10-28",
    dateLabel: "28 Oct 2026",
    tag: "Prayer",
    color: "bg-purple-100 text-purple-700",
    href: "/prayer",
    cta: "See prayer times",
  },
  {
    slug: "relate-store-gear",
    title: "New gear in the Relate Store",
    excerpt:
      "Every purchase funds clubs and community programmes. Browse the range and order on WhatsApp — we’ll sort the rest.",
    date: "2026-10-14",
    dateLabel: "14 Oct 2026",
    tag: "Store",
    color: "bg-orange-100 text-orange-700",
    href: "/store",
    cta: "Visit the store",
  },
  {
    slug: "sports-squads",
    title: "Squads are open for the season",
    excerpt:
      "Sports teams run alongside the clubs — weekend sessions in soccer, netball and movement games where children learn teamwork and stay active.",
    date: "2026-09-30",
    dateLabel: "30 Sep 2026",
    tag: "Sports",
    color: "bg-rose-100 text-rose-700",
    href: "/sports",
    cta: "See the squads",
  },
];
