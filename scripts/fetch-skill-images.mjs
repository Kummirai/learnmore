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
import { createHash } from "node:crypto";
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
  "ms-office": "office desk documents paperwork",
  "cv-writing": "resume document desk",
  "interview-skills": "two colleagues talking office",
  "public-speaking": "speaker podium audience",
  "study-skills": "student studying books",
  "first-aid": "first aid kit",
  "financial-literacy": "calculator money paperwork",
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
  "budgeting-anchor": "money savings budget",
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
  "financial-planning-spark": "money banknotes paper",
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
  "smart-saver-master": "wallet banknotes cash",
  "office-specialist": "children computer classroom",
  "code-creator": "kids coding robot",
  "first-responder": "paramedic emergency service",
  "financial-strategist": "financial charts planning",
  "productivity-master": "planner calendar desk",
  "software-engineer": "programmer coding screen",
  "media-communications": "camera photography video",
};

/** Round-2 query fixes for images that came back blank, blurry or off-topic. */
const OVERRIDES = {
  "advanced-communication": "microphone radio studio",
  "budgeting-anchor": "piggy bank coins savings",
  "budgeting-together": "couple bills kitchen table",
  budgeting: "money notes hand",
  "career-growth": "business stairs building success",
  "code-creator": "children computer class learning",
  communication: "friends talking coffee table",
  "conflict-resolution-synergy": "handshake agreement business",
  "conflict-resolution": "couple talking",
  "cooking-on-a-budget": "grocery shopping",
  "cv-job-search": "job application paperwork desk",
  "cv-linkedin": "woman laptop working office",
  "cv-writing": "writing notes pen paper desk",
  "digital-explorer": "person using tablet device",
  "digital-skills-anchor": "computer keyboard typing hands",
  entrepreneurship: "small business shop owner",
  "faith-resilience": "sunrise hope mountain silhouette",
  "faith-together": "hands praying together church",
  "financial-legacy": "coins stack growth savings",
  "financial-planning-anchor": "financial report documents desk",
  "first-aid": "first aid",
  "first-aid-anchor": "bandage arm",
  "goal-setting": "target dartboard goal success",
  "health-wellness": "healthy salad vegetables fresh",
  "health-wellness-synergy": "woman running",
  "home-management": "laundry basket cleaning home",
  "intimacy-connection": "couple holding hands love",
  "investing-basics": "business report chart",
  "investing-synergy": "gold coins stack",
  "leadership-prime": "team meeting",
  "leadership-synergy": "teamwork",
  "life-saver-specialist": "lifeguard swimming pool rescue",
  "life-saver": "life ring buoy water safety",
  "media-communications": "video camera filming crew",
  mentoring: "teacher student tutoring desk",
  "mentoring-couples": "women conversation",
  networking: "business people networking event",
  "office-specialist": "printer papers office",
  "parenting-prep": "pregnant woman holding belly",
  "public-speaking": "speaker microphone stage audience",
  "public-speaking-pulse": "conference presenter stage talk",
  "time-management": "alarm clock",
};

Object.assign(QUERIES, OVERRIDES);

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

/** Grayscale stdev — low values mean a flat/blank crop that reads as no image. */
async function grayStdev(buf) {
  const { data } = await sharp(buf)
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let s = 0;
  let ss = 0;
  for (const v of data) {
    s += v;
    ss += v * v;
  }
  const n = data.length;
  const mean = s / n;
  return Math.sqrt(ss / n - mean * mean);
}

const MIN_STDEV = 40;

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

  // pixels already used by skills we are NOT refetching are off-limits
  const wantedIds = new Set(wanted.map((s) => s.id));
  const usedHashes = new Set();
  for (const s of skills) {
    if (wantedIds.has(s.id)) continue;
    try {
      const data = await readFile(path.join(OUT_DIR, `${s.id}.jpg`));
      usedHashes.add(createHash("sha1").update(data).digest("hex"));
    } catch {
      // no existing file
    }
  }

  for (const skill of wanted) {
    const file = path.join(OUT_DIR, `${skill.id}.jpg`);
    if (!force && credits[skill.id] && !idArgs.length) continue;

    const query = QUERIES[skill.id];
    if (!query) {
      rows.push(`${skill.id.padEnd(24)} NO QUERY`);
      continue;
    }

    let best = null;
    for (const candidate of (await search(query)).slice(0, 4)) {
      try {
        const buf = await download(candidate.url);
        for (const position of ["attention", "entropy"]) {
          const data = await sharp(buf)
            .resize(1200, 750, { fit: "cover", position })
            .jpeg({ quality: 80, mozjpeg: true })
            .toBuffer();
          const sd = await grayStdev(data);
          if (sd < MIN_STDEV) continue;
          // never ship the same pixels to two different skills
          const hash = createHash("sha1").update(data).digest("hex");
          if (usedHashes.has(hash)) continue;
          if (!best || sd > best.sd) best = { candidate, data, sd, hash };
        }
      } catch {
        // try the next candidate
      }
    }

    let done = false;
    if (best) {
      await writeFile(file, best.data);
      usedHashes.add(best.hash);
      credits[skill.id] = {
        title: best.candidate.title ?? "",
        creator: best.candidate.creator ?? "",
        license: best.candidate.license ?? "",
        licenseVersion: best.candidate.license_version ?? "",
        licenseUrl: best.candidate.license_url ?? "",
        source: best.candidate.source ?? "",
        page: best.candidate.foreign_landing_url ?? "",
      };
      rows.push(
        `${skill.id.padEnd(24)} ${((best.candidate.title ?? "")).slice(0, 30).padEnd(32)} [${best.candidate.license}] ${best.candidate.source} sd=${best.sd.toFixed(0)}`,
      );
      done = true;
    }
    if (!done) rows.push(`${skill.id.padEnd(24)} REJECTED (${query})`);
  }

  await writeFile(CREDITS, JSON.stringify(credits, null, 2) + "\n");
  console.log(rows.join("\n"));
  console.log(`\n${Object.keys(credits).length} skills have credits recorded`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
