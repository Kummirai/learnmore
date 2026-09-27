import type { MetadataRoute } from "next";
import { CLUBS, MAGAZINES, STORE_ITEMS, SUB_CLUBS, SPORTS_TEAMS, programSlug } from "@/constants/relate";
import { READING_PLANS } from "@/constants/readingPlans";
import { getSquad, playerSlug } from "@/constants/squads";

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
  { path: "/bible-quiz", changeFrequency: "weekly", priority: 0.8 },
  { path: "/bible-quiz/play", changeFrequency: "weekly", priority: 0.5 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const main = MAIN_PAGES.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));

  const clubs = [...CLUBS, ...SUB_CLUBS].map((club) => ({
    url: `${SITE_URL}/${club.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  const clubPrograms = [...CLUBS, ...SUB_CLUBS].flatMap((club) =>
    club.programs.map((program) => ({
      url: `${SITE_URL}/${club.slug}/${programSlug(program.name)}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))
  );

  const clubMagazines = CLUBS.map((club) => ({
    url: `${SITE_URL}/magazines/${club.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const magazines = MAGAZINES.flatMap((mag) => [
    { url: `${SITE_URL}/${mag.slug}`, lastModified, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${SITE_URL}/library/${mag.slug}`, lastModified, changeFrequency: "monthly" as const, priority: 0.7 },
  ]);

  const plans = READING_PLANS.map((plan) => ({
    url: `${SITE_URL}/plans/${plan.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const storeItems = STORE_ITEMS.map((item) => ({
    url: `${SITE_URL}/store/${item.id}`,
    lastModified,
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  const sportsTeams = SPORTS_TEAMS.map((team) => ({
    url: `${SITE_URL}/sports/${team.id}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const sportsPlayers = SPORTS_TEAMS.flatMap((team) =>
    (getSquad(team.id)?.players ?? []).map((player) => ({
      url: `${SITE_URL}/sports/${team.id}/${playerSlug(player.name)}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    }))
  );

  return [
    ...main,
    ...clubs,
    ...clubPrograms,
    ...clubMagazines,
    ...magazines,
    ...plans,
    ...storeItems,
    ...sportsTeams,
    ...sportsPlayers,
  ];
}