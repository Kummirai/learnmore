/**
 * One-off dev script: copy the Supabase project credentials (URL + anon key)
 * from the mobile app's env files into the website's .env.local so the site
 * talks to the SAME Supabase project as the mobile app.
 *
 * Values are copied on disk — never printed to stdout.
 */
/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS script (.cjs) */
const fs = require("fs");
const path = require("path");

const MOBILE_ENV_DIR = path.join(__dirname, "..", "..", "mobile_app");
const WEBSITE_ENV = path.join(__dirname, "..", ".env.local");

const mobileCandidates = [".env", ".env.local", ".env.development", ".env.production"];

function readLines(file) {
  try {
    return fs.readFileSync(file, "utf8").split("\n");
  } catch {
    return [];
  }
}

function findValue(dir, files, keys) {
  for (const file of files) {
    for (const line of readLines(path.join(dir, file))) {
      const match = line.match(/^([A-Za-z0-9_]+)=(.*)$/);
      if (!match) continue;
      if (keys.includes(match[1]) && match[2].trim()) return match[2].trim();
    }
  }
  return null;
}

function upsert(lines, existing, name, value) {
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith(name + "=")) {
      existing[name] = i;
      lines[i] = `${name}=${value}`;
      return;
    }
  }
  existing[name] = lines.length;
  lines.push(`${name}=${value}`);
}

const url = findValue(MOBILE_ENV_DIR, mobileCandidates, [
  "EXPO_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
]);
const key = findValue(MOBILE_ENV_DIR, mobileCandidates, [
  "EXPO_PUBLIC_SUPABASE_ANON_KEY",
  "EXPO_PUBLIC_SUPABASE_KEY",
  "EXPO_PUBLIC_SUPABASE_ANON",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
]);

if (!url || !key) {
  console.error("Supabase URL/anon key not found in the mobile env files. Nothing written.");
  process.exit(1);
}

const lines = readLines(WEBSITE_ENV);
const existing = {};
upsert(lines, existing, "NEXT_PUBLIC_SUPABASE_URL", url);
upsert(lines, existing, "NEXT_PUBLIC_SUPABASE_ANON_KEY", key);

fs.writeFileSync(WEBSITE_ENV, lines.join("\n"), "utf8");
console.log("Updated web .env.local with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
