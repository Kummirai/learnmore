/**
 * Supabase server-side client for RelateWorld.
 *
 * The website and the mobile app share the SAME Supabase project so reading
 * plan content, per-club progress, club ownership and quiz leaderboards are one
 * source of truth. Env values are copied from the mobile app's
 * `EXPO_PUBLIC_SUPABASE_URL`/`EXPO_PUBLIC_SUPABASE_ANON_KEY` into the website's
 * `.env.local` as `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
 *
 * NOTE: When Supabase is not configured (e.g. local dev without .env.local)
 * every accessor returns `null` so pages degrade gracefully to the local seed
 * data in `lib/reading-plans.ts` instead of crashing.
 */

import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  "";
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_KEY ||
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.EXPO_PUBLIC_SUPABASE_KEY ||
  "";

export const isSupabaseConfigured = !!(SUPABASE_URL && SUPABASE_ANON_KEY);

export type ClubRow = {
  id: string;
  slug: string;
  name: string;
  group: string; // "sprout" | "surge" | "pulse" | "adults"
  ageRange: string;
  tagline: string;
  gradient: [string, string];
  accent: string;
  accentDark: string;
};

export type ReadingPlanRow = {
  id: string;
  slug: string;
  title: string;
  kind: string; // "bible-reading" | "marriage" | ...
  category: string;
  days: number;
  description: string;
  cover: string;
  gradient: [string, string];
};

export type PlanSectionRow = {
  id: string;
  plan_slug: string;
  slug: string;
  ord: number;
  book: string;
  start_ch: number;
  end_ch: number;
};

export type ReadingProgressRow = {
  id: string;
  user_id: string;
  section_id: string;
  completed_days: number[];
  done_at: string;
};

export type ClubLockRow = {
  user_id: string;
  club_slug: string;
  immut_title: string;
};

// A tiny typed wrapper around the raw supabase-js client. Queries return null
// whenever Supabase is not configured so callers fall back to seed data.
const client = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

export function getSupabase() {
  return client;
}
