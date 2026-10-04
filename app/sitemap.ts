import type { MetadataRoute } from "next";
import { MAGAZINES, programSlug } from "@/constants/relate";
import { getClubsCatalog } from "@/lib/clubs";
import { listPublicReadingPlans } from "@/lib/reading-plans";
import { getSports } from "@/lib/sports";
import { getStoreItems } from "@/lib/store";

const SITE_URL = "https://relateworld.org";

const MAIN_PAGES: { path: string; changeFrequency: "yearly" | "monthly" | "weekly" | "daily" | "always" | "hourly" | "never"; priority: number }[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/team", changeFrequency: "monthly", priority: 0.7 },
  { path: "/volunteer", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.6 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.6 },
  { path: "/enroll", changeFrequency: "monthly", priority: 0.8 },
  { path: "/fees", changeFrequency: "monthly", priority: 0.7 },
  { path: "/prayer", changeFrequency: "daily", priority: 0.7 },
  { path: "/prayer-requests", changeFrequency: "monthly", priority: 0.7 },
  { path: "/requests", changeFrequency: "monthly", priority: 0.7 },
  { path: "/calendar", changeFrequency: "weekly", priority: 0.6 },
  { path: "/events", changeFrequency: "weekly", priority: 0.6 },
  { path: "/events/clubs", changeFrequency: "weekly", priority: 0.5 },
  { path: "/sports", changeFrequency: "weekly", priority: 0.7 },
  { path: "/join", changeFrequency: "monthly", priority: 0.6 },
  { path: "/news", changeFrequency: "weekly", priority: 0.6 },
  { path: "/announcements", changeFrequency: "daily", priority: 0.6 },
  { path: "/gallery", changeFrequency: "monthly", priority: 0.5 },
  { path: "/resources", changeFrequency: "monthly", priority: 0.6 },
  { path: "/store", changeFrequency: "monthly", priority: 0.7 },
  { path: "/plans", changeFrequency: "monthly", priority: 0.7 },
];

/**
 * The sitemap reads clubs, store, squads and reading plans from the API at
 * request time (the backend is the source of truth). A failed section is
 * omitted rather than served from stale bundled data.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const main = MAIN_PAGES.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));

  const [catalog, storeItems, sports, plans] = await Promise.all([
    getClubsCatalog().catch(() => null),
    getStoreItems().catch(() => []),
    getSports().catch(() => null),
    listPublicReadingPlans().catch(() => []),
  ]);

  const allClubs = catalog ? [...catalog.clubs, ...catalog.subClubs] : [];

  const clubs = (catalog?.clubs ?? []).map((club) => ({
    url: `${SITE_URL}/${club.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  const clubPrograms = allClubs.flatMap((club) =>
    club.programs.map((program) => ({
      url: `${SITE_URL}/${club.slug}/${programSlug(program.name)}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))
  );

  const clubMagazines = (catalog?.clubs ?? []).map((club) => ({
    url: `${SITE_URL}/magazines/${club.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const magazines = MAGAZINES.flatMap((mag) => [
    { url: `${SITE_URL}/${mag.slug}`, lastModified, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${SITE_URL}/library/${mag.slug}`, lastModified, changeFrequency: "monthly" as const, priority: 0.7 },
  ]);

  const planEntries = plans.map((plan) => ({
    url: `${SITE_URL}/plans/${plan.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const storeEntries = storeItems.map((item) => ({
    url: `${SITE_URL}/store/${item.id}`,
    lastModified,
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  const sportsTeams = (sports?.teams ?? []).map((team) => ({
    url: `${SITE_URL}/sports/${team.id}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const sportsPlayers = (sports?.teams ?? []).flatMap((team) => {
    if (!sports) return [];
    const seen = new Set<string>();
    const entries: MetadataRoute.Sitemap = [];
    for (const player of sports.getSquad(team.id)?.players ?? []) {
      const url = `${SITE_URL}/sports/${team.id}/${sports.playerSlug(player.name)}`;
      if (seen.has(url)) continue;
      seen.add(url);
      entries.push({
        url,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.4,
      });
    }
    return entries;
  });

  return [
    ...main,
    ...clubs,
    ...clubPrograms,
    ...clubMagazines,
    ...magazines,
    ...planEntries,
    ...storeEntries,
    ...sportsTeams,
    ...sportsPlayers,
  ];
}
