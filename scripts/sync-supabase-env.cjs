/**
 * One-off dev script: copy the Supabase project credentials (URL + anon key)
 * from the mobile app's env files into the website's .env.local so the site
 * talks to the SAME Supabase project as the mobile app.
 *
 * Values are copied on disk — never printed to stdout.
 */
const fs = require("fs");
const path = require("path");

const MOBILE_ENV_DIR = "C:/Users/Me/Documents/GitHub/relateWorld/frontend";
const WEBSITE_ENV = "C:/Users/Me/Documents/GitHub/relateWorld_website/.env.local";

const mobileCandidates = [".env", ".env.local", ".env.development", ".env.production"];
const webCandidates = [".env.local", ".env"];

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

function upsert(lines, existing, name, value) {
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith(name + "=")) {
      existing[name] = i;
      return;
    }
  }
  existing[name] = lines.length;
  lines.push("");
}

const baseCommented = lines.map((l) => (l.startsWith("`" ...
