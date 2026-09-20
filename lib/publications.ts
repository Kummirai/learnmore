import { API_BASE } from "@/lib/config";

export type PublicationKind = "magazine" | "bulletin";

export type PubSeason = {
  name?: string;
  year?: number;
  label?: string;
  start?: string;
  end?: string;
};

export type PubBlock = {
  type: string;
  text?: string;
  by?: string;
  title?: string;
  items?: string[];
  question?: string;
  options?: string[];
  correctIndex?: number;
  explain?: string;
  prompt?: string;
  placeholder?: string;
  id?: string;
};

export type PubDay = {
  date?: string;
  day?: number;
  weekday?: string;
  title?: string;
  verse?: { text: string; by?: string };
  blocks?: PubBlock[];
};

export type PubWeek = {
  index?: number;
  title?: string;
  theme?: string;
  intro?: PubBlock[];
  days?: PubDay[];
};

export type PubSummary = {
  id: string;
  kind: PublicationKind;
  series?: string;
  clubSlug?: string;
  title?: string;
  issue?: string;
  month?: string;
  year?: number;
  cover?: string;
  summary?: string;
  tags?: string[];
  theme?: string;
  coverLines?: string[];
  season?: PubSeason;
  status?: string;
  publishedAt?: string;
};

export type PubDocument = PubSummary & {
  blocks?: PubBlock[];
  weeks?: PubWeek[];
};

const PUBLICATIONS_API = `${API_BASE}/api/publications`;

export async function getPublications(club?: string): Promise<PubSummary[]> {
  const url = club
    ? `${PUBLICATIONS_API}?club=${encodeURIComponent(club)}`
    : PUBLICATIONS_API;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];
    const data: unknown = await res.json();
    return Array.isArray(data) ? (data as PubSummary[]) : [];
  } catch {
    return [];
  }
}

export async function getPublication(id: string): Promise<PubDocument | null> {
  try {
    const res = await fetch(`${PUBLICATIONS_API}/${encodeURIComponent(id)}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data: unknown = await res.json();
    if (!data || typeof data !== "object") return null;
    const doc = data as PubDocument;
    return doc.id ? doc : null;
  } catch {
    return null;
  }
}