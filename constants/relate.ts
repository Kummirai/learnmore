/** The three-pillar framework every club above Sprout is built on. */
export type RelatePillar = "Shift" | "Sanctuary" | "Connect";

export const PILLARS: RelatePillar[] = ["Shift", "Sanctuary", "Connect"];

export type RelateProgram = {
  name: string;
  blurb: string;
  detail: string;
  /** Which pillar the program sits under. Sprout programs stay ungrouped. */
  pillar?: RelatePillar;
};

export type RelateClub = {
  slug: string;
  name: string;
  group: string;
  ageRange: string;
  tagline: string;
  description: string;
  heroImage: string;
  color: string;
  colorDark: string;
  whatsappGroupLink: string;
  programs: RelateProgram[];
  parentSlug?: string;
  mission?: string;
  vision?: string;
  /** Club-specific name for each pillar (e.g. Surge's Shift pillar = "Runway"). */
  pillarLabels?: Record<RelatePillar, string>;
};

/** Group a club's programs by pillar. Clubs whose programs carry no pillar
 *  (Sprout) come back as a single unnamed group. */
export function programsByPillar(
  club: RelateClub,
): { pillar: RelatePillar | null; label: string | null; programs: RelateProgram[] }[] {
  const grouped: {
    pillar: RelatePillar | null;
    label: string | null;
    programs: RelateProgram[];
  }[] = PILLARS.map((pillar) => ({
    pillar,
    label: club.pillarLabels?.[pillar] ?? null,
    programs: club.programs.filter((p) => p.pillar === pillar),
  })).filter((g) => g.programs.length > 0);

  const ungrouped = club.programs.filter((p) => !p.pillar);
  if (ungrouped.length > 0) grouped.push({ pillar: null, label: null, programs: ungrouped });
  return grouped;
}

/** URL segment for a program name, shared by the club page links, the
 *  /[club]/[program] route and the sitemap so all three agree. */
export function programSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type RelateSport = "Football" | "Netball" | "Volleyball";

export type RelateTeam = {
  id: string;
  clubSlug: string;
  sport: RelateSport;
  name: string;
  initials: string;
  tagline: string;
  /** Squad crest — a square image carrying the club name and the sport. */
  logo?: string;
};

export type MagazineEdition = {
  label: string;
  ageRange: string;
  clubSlug: string;
  summary: string;
  weekTitles: string[];
};

export type RelateMagazine = {
  slug: string;
  series: string;
  clubName: string;
  clubSlug: string;
  theme: string;
  seasonLabel: string;
  cover: string;
  coverLines: string[];
  summary: string;
  editions: MagazineEdition[];
};

export const MAGAZINES: RelateMagazine[] = [
  {
    slug: "footsteps",
    series: "Footsteps",
    clubName: "Surge",
    clubSlug: "surge",
    theme: "The Jesus Way",
    seasonLabel: "Spring 2026 · Sep 1 – Nov 30",
    cover: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=1600&q=85",
    coverLines: [
      "Walk with Jesus for thirteen weeks",
      "The way, the truth, the life",
      "Follow the footsteps",
    ],
    summary:
      "Spring 2026 study guide for Surge: thirteen weeks of walking the Jesus way — the call, the beatitudes, the lower love, the cross, the sending. One verse and one daily read for every day of the season.",
    editions: [
      {
        label: "Footsteps",
        ageRange: "16–21 yrs",
        clubSlug: "surge",
        summary:
          "The Surge study guide — a daily read for every day of the Spring 2026 season.",
        weekTitles: [
          "The call",
          "Blessed foundations",
          "Love that goes lower",
          "Truth that sets free",
          "Money and the kingdom",
          "Prayer that persists",
          "The cross-shaped life",
          "Faith for the long road",
          "Forgiveness without limit",
          "The kingdom in you",
          "Communion and joining",
          "Sent ones",
          "Hope that holds",
        ],
      },
    ],
  },
  {
    slug: "rooted",
    series: "Rooted",
    clubName: "Sprout",
    clubSlug: "sprout",
    theme: "Roots & Shoots",
    seasonLabel: "Spring 2026 · Sep 1 – Nov 30",
    cover: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=1600&q=85",
    coverLines: [
      "A seed is not in a hurry",
      "Thirteen weeks to a strong tree",
      "Grow where you're planted",
    ],
    summary:
      "The Spring 2026 study guide for Sprout children and teens — three age-graded editions growing from a tiny seed to a tree with deep roots. A verse, a try-it and a prayer for every day of the season.",
    editions: [
      {
        label: "Rooted — Kids",
        ageRange: "6–8 yrs",
        clubSlug: "sprout",
        summary:
          "From a tiny seed to a tree with deep roots — one verse and one try-it for every day of the season.",
        weekTitles: [
          "The tiniest seed",
          "Water and roots",
          "Sunlight",
          "Good soil",
          "Pulling weeds",
          "The strong sprout",
          "The straight stem",
          "Reaching leaves",
          "The patient bud",
          "Opening blossoms",
          "Sweet fruit",
          "Deep roots in storms",
          "The giving garden",
        ],
      },
      {
        label: "Rooted — Tweens",
        ageRange: "9–11 yrs",
        clubSlug: "sprout",
        summary:
          "The hidden root, living water, storms, pruning and fruit — with a verse and a try-it for every day.",
        weekTitles: [
          "The hidden root",
          "Living water",
          "The sun above",
          "The taproot",
          "Storm weather",
          "The pruning year",
          "One trunk",
          "Spreading branches",
          "Scattering seeds",
          "Seasonal fruit",
          "Tree by the water",
          "Rings of the season",
          "The giving grove",
        ],
      },
      {
        label: "Rooted — Teens",
        ageRange: "12–15 yrs",
        clubSlug: "sprout",
        summary:
          "Belonging, doubt, identity, storms and fruit — growing up with a verse and a try-it for every day.",
        weekTitles: [
          "Chosen family",
          "Honest questions",
          "The drought",
          "Image bearers",
          "Bent trunks",
          "Grafted in",
          "Growth rings",
          "The trellis",
          "Humble seeds",
          "Daily fruit",
          "Winter rest",
          "Waiting sap",
          "The grove",
        ],
      },
    ],
  },
];

export function getMagazine(slug: string): RelateMagazine | undefined {
  return MAGAZINES.find((m) => m.slug === slug);
}

export function getMagazinesForClub(clubSlug: string): RelateMagazine[] {
  return MAGAZINES.filter((m) => m.clubSlug === clubSlug);
}

export type StoreCategory = "All" | "Apparel" | "Accessories" | "Home & Study";

export type StoreItem = {
  id: string;
  category: Exclude<StoreCategory, "All">;
  name: string;
  price: number;
  image: string;
  blurb: string;
  offerPrice?: number;
  rating?: number;
  sizes?: string[];
  images?: string[];
  details?: string[];
};

export const STORE_CATEGORIES: StoreCategory[] = [
  "All",
  "Apparel",
  "Accessories",
  "Home & Study",
];
