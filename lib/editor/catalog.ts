import { CLUBS as WEBSITE_CLUBS, SUB_CLUBS } from "@/constants/relate";

export type ClubEntry = {
  slug: string;
  name: string;
  color: string;
};

/** Every club and sub-club the site knows about, used by the admin editor. */
export const CLUBS: ClubEntry[] = [...WEBSITE_CLUBS, ...SUB_CLUBS].map((c) => ({
  slug: c.slug,
  name: c.name,
  color: c.color,
}));

export const clubName = (slug?: string | null): string =>
  slug ? (CLUBS.find((c) => c.slug === slug)?.name ?? slug) : "Relate";

/** Magazine series offered today. "Relate" is the no-club umbrella series. */
export const SERIES = ["Relate", "Rooted", "Footsteps", "Hearth"];

export const PUBLICATION_KINDS = ["magazine", "bulletin"] as const;

export const SEASON_NAMES = ["Spring", "Summer", "Autumn", "Winter"];

export const BLOCK_TYPES = [
  { type: "paragraph", label: "Paragraph" },
  { type: "heading", label: "Heading" },
  { type: "quote", label: "Quote" },
  { type: "image", label: "Image" },
  { type: "list", label: "Bullet list" },
  { type: "checklist", label: "Checklist" },
  { type: "quiz", label: "Quiz" },
  { type: "reflection", label: "Reflection" },
  { type: "pray", label: "Prayer" },
] as const;