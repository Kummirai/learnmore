/**
 * Fetches a royalty-free photo for every skill in the framework.
 *
 * Skills come from ../backend/scripts/skills-import.json; each one is searched
 * against Openverse's CC0 / public-domain pool (StockSnap, Rawpixel, Nappy),
 * downloaded, cropped to 1200x750 and written to
 * public/images/skills/<skillId>.jpg with provenance in
 * public/images/skills/CREDITS.json.
 *
 *   node scripts/fetch-skill-images.mjs           # only missing skills
 *   node scripts/fetch-skill-images.mjs --force   # re-fetch everything
 *   node scripts/fetch-skill-images.mjs --id python --id cooking
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const WEB = path.dirname(HERE);
const SKILLS_JSON = path.join(WEB, "..", "backend", "scripts", "skills-import.json");
const OUT_DIR = path.join(WEB, "public", "images", "skills");
const CREDITS = path.join(OUT_DIR, "CREDITS.json");

const SEARCH = "https://api.openverse.org/v1/images/";
const SOURCE_CHAIN = [
  "stocksnap,rawpixel,nappy",
  "rawpixel,stocksnap",
  "",
];
const LICENSE_CHAIN = ["cc0,pdm", "cc0,pdm,by"];
const UA = { "User-Agent": "relateworld-skills/1.0" };

/** Curated search terms — one per skill id, tuned for a literal photo match. */
const QUERIES = {
  python: "computer code screen programming",
  "web-design": "website design laptop screen",
  "ms-office": "spreadsheet document laptop",
  "cv-writing": "resume document desk",
  "interview-skills": "job interview handshake",
  "public-speaking": "speaker podium audience",
  "study-skills": "student studying books",
  "first-aid": "first aid kit",
  "financial-literacy": "money coins budget",
  leadership: "business team leader meeting",
  "career-readiness": "office professional working",
  "cv-linkedin": "professional laptop typing",
  "financial-planning": "financial planning calculator",
  budgeting: "budget calculator money",
  "investing-basics": "stock market chart",
  entrepreneurship: "startup entrepreneur working",
  "public-speaking-pulse": "conference speaker presentation",
  "digital-skills": "typing laptop keyboard",
  networking: "business people conversation",
  mentoring: "two people talking guidance",
  "financial-freedom": "savings jar coins",
  investing: "stock market graph",
  "career-growth": "business growth stairs",
  "health-wellness": "yoga meditation wellness",
  cooking: "cooking kitchen chef",
  "home-management": "home interior living room",
  "digital-skills-prime": "hands using tablet",
  "leadership-prime": "leader team office",
  "mentoring-prime": "coffee conversation people",
  "faith-foundations": "open bible reading",
  parenting: "parent child family",
  "budgeting-anchor": "household bills paperwork",
  "financial-planning-anchor": "calculator money desk",
  "cv-job-search": "job application office",
  "time-management": "clock time management desk",
  "cooking-on-a-budget": "grocery vegetables kitchen",
  "first-aid-anchor": "bandage care hands",
  "counselling-basics": "counselling conversation support",
  "digital-skills-anchor": "laptop working home",
  "faith-resilience": "praying hands hope",
  communication: "couple talking together",
  "conflict-resolution": "couple discussion resolution",
  "budgeting-together": "couple finances planning",
  "financial-planning-spark": "piggy bank savings",
  "home-setup": "moving boxes new home",
  "cooking-together": "couple cooking kitchen",
  "parenting-prep": "nursery baby room",
  "faith-together": "couple praying together",
  "intimacy-connection": "couple holding hands",
  "goal-setting": "writing goals notebook",
  "advanced-communication": "people conversation listening",
  "conflict-resolution-synergy": "handshake agreement",
  "financial-legacy": "savings family money",
  "investing-synergy": "investment growth chart",
  "parenting-teens": "teenager parents talking",
  "marriage-enrichment": "married couple walking",
  "leadership-synergy": "team leadership meeting",
  "mentoring-couples": "group discussion circle",
  "health-wellness-synergy": "healthy lifestyle walking",
  "faith-legacy": "family home together",
  "life-saver": "child first aid safety",
  "smart-saver": "piggy bank coins child",
  "digital-explorer": "child using tablet",
  "logic-builder": "child building blocks puzzle",
  "life-saver-specialist": "emergency responder training",
  "smart-saver-master": "money savings jar",
  "office-specialist": "children computer classroom",
  "code-creator": "kids coding robot",
  "first-responder": "paramedic emergency service",
  "financial-strategist": "financial charts planning",
  "productivity-master": "planner calendar desk",
  "software-engineer": "programmer coding screen",
  "media-communications": "camera photography video",
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function search(query) {
  for (const source of SOURCE_CHAIN) {
    for (const license of LICENSE_CHAIN) {
      const params = new URLSearchParams({
        q: query,
        license,
        page_size: "8",
        ...(source ? { source } : {}),
      });
      const res = await fetch(`${SEARCH}?${params}`, { headers: UA });
      await sleep(3200); // stay under the 20 searches/minute burst limit
      if (!res.ok) continue;
      const json = await res.json();
      const rows = Array.isArray(json.results) ? json.results : [];
      const good = rows.filter(
        (r) =>
          typeof r.url === "string" &&
          r.url.startsWith("http") &&
          (!r.width || r.width >= 900),
      );
      if (good.length) return good;
    }
  }
  return [];
}

async function download(url) {
  const res = await fetch(url, { headers: UA });
  if (!res.ok) throw new Error(`download ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  const argv = process.argv.slice(2);
  const force = argv.includes("--force");
  const idArgs = argv.reduce(
    (acc, a, i) => (a === "--id" ? [...acc, argv[i + 1]] : acc),
    [],
  );

  const doc = JSON.parse(await readFile(SKILLS_JSON, "utf8"));
  const skills = [...new Map(
    doc.clubs.flatMap((c) => c.skills.map((s) => [s.id, s])),
  ).values()];
  const wanted = idArgs.length
    ? skills.filter((s) => idArgs.includes(s.id))
    : skills;

  await mkdir(OUT_DIR, { recursive: true });
  const credits = JSON.parse(await readFile(CREDITS, "utf8").catch(() => "{}"));

  const rows = [];
  for (const skill of wanted) {
    const file = path.join(OUT_DIR, `${skill.id}.jpg`);
    if (!force && credits[skill.id] && !idArgs.length) continue;

    const query = QUERIES[skill.id];
    if (!query) {
      rows.push(`${skill.id.padEnd(24)} NO QUERY`);
      continue;
    }

    let done = false;
    for (const candidate of (await search(query)).slice(0, 3)) {
      try {
        const buf = await download(candidate.url);
        await sharp(buf)
          .resize(1200, 750, { fit: "cover", position: "attention" })
          .jpeg({ quality: 80, mozjpeg: true })
          .toFile(file);
        credits[skill.id] = {
          title: candidate.title ?? "",
          creator: candidate.creator ?? "",
          license: candidate.license ?? "",
          licenseVersion: candidate.license_version ?? "",
          licenseUrl: candidate.license_url ?? "",
          source: candidate.source ?? "",
          page: candidate.foreign_landing_url ?? "",
        };
        rows.push(
          `${skill.id.padEnd(24)} ${(candidate.title ?? "").slice(0, 34).padEnd(36)} [${candidate.license}] ${candidate.source}`,
        );
        done = true;
        break;
      } catch {
        // try the next candidate
      }
    }
    if (!done) rows.push(`${skill.id.padEnd(24)} FAILED (${query})`);
  }

  await writeFile(CREDITS, JSON.stringify(credits, null, 2) + "\n");
  console.log(rows.join("\n"));
  console.log(`\n${Object.keys(credits).length} skills have credits recorded`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
