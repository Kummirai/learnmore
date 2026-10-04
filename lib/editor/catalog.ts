export type ClubEntry = {
  slug: string;
  name: string;
  color: string;
};

/** Magazine series offered today. "Relate" is the no-club umbrella series. */
export const SERIES = ["Relate", "Rooted", "Footsteps"];

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