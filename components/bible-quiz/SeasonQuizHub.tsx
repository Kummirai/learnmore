"use client"

import Link from "next/link";
import { useState } from "react";
import { FaArrowRight, FaBookOpen, FaCircleCheck, FaCrown, FaMedal, FaTrophy } from "react-icons/fa6";
import { LuChevronDown } from "react-icons/lu";
import { mergeGroupBoard, seedForClub, type BibleQuizSectionBoard } from "@/lib/bible-quiz";
import { currentSeason, SEASON_QUIZ } from "@/lib/season";
import type { QuizLogRow } from "@/lib/reading-plans";

type ClubSection = {
  slug: string;
  name: string;
  tagline: string;
  accent: string;
  group: string[];
};

const SECTIONS: ClubSection[] = [
  {
    slug: "sprout",
    name: "Sprout",
    tagline: "Children · 6–15",
    accent: "#f97316",
    group: ["sprout-kids", "sprout-tweens", "sprout-teens"],
  },
  { slug: "surge", name: "Surge", tagline: "Young Youth · 16–21", accent: "#06b6d4", group: ["surge"] },
  { slug: "pulse", name: "Pulse", tagline: "Youth · 21–33", accent: "#8b5cf6", group: ["pulse"] },
  { slug: "prime", name: "Prime", tagline: "Singles · 33+", accent: "#1e3a8a", group: ["prime"] },
  { slug: "anchor", name: "Anchor", tagline: "Single Parents", accent: "#1e3a8a", group: ["anchor"] },
];

const SLUG_TO_SECTION = new Map<string, ClubSection>();
for (const s of SECTIONS) for (const g of s.group) SLUG_TO_SECTION.set(g, s);

const PLAN_SLUG = "pentateuch-in-60-days";
const MEDALS = ["🥇", "🥈", "🥉", "4", "5"];
const VISIBLE_LOGS = 3;

function boardFor(section: ClubSection): BibleQuizSectionBoard {
  return section.group.length === 1 ? seedForClub(section.group[0]) : mergeGroupBoard(section.group);
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

function fmtTime(ms: number): string {
  const s = Math.round(ms / 1000);
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

type OverviewRow = { rank: number; name: string; club: ClubSection; score: number; correct: number; total: number };

function buildOverview(boards: { section: ClubSection; board: BibleQuizSectionBoard }[]): OverviewRow[] {
  return boards
    .flatMap(({ board }) =>
      board.logs.map((log) => ({
        name: log.name,
        club: SLUG_TO_SECTION.get(log.clubSlug) ?? SECTIONS[0],
        score: log.score,
        correct: log.correct,
        total: log.total,
      })),
    )
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((row, i) => ({ rank: i + 1, ...row }));
}

function TopFiveRows({ board }: { board: BibleQuizSectionBoard }) {
  return (
    <ul className="divide-y divide-gray-50">
      {board.rows.map((row) => {
        const log = board.logs.find((l) => l.playerId === row.playerId);
        return (
          <li key={row.playerId} className="flex items-center gap-4 px-5 py-3">
            <span className="w-5 text-center text-sm font-black" style={{ color: row.accent }}>
              {row.rank}
            </span>
            <span className="text-sm">{MEDALS[row.rank - 1]}</span>
            <span className="flex-1 text-sm font-medium text-gray-800">{row.name}</span>
            {row.laurel && (
              <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: row.accent }}>
                laurel
              </span>
            )}
            <span className="text-xs text-gray-400">{log ? `${log.correct}/${log.total} correct` : "—"}</span>
            <span className="w-14 text-right text-sm font-black" style={{ color: row.accent }}>
              {log ? log.score : "—"}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export default function SeasonQuizHub() {
  const season = currentSeason();
  const meta = SEASON_QUIZ[season];
  const boards = SECTIONS.map((section) => ({ section, board: boardFor(section) }));
  const overview = buildOverview(boards);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  return (
    <div className="bg-white">
      {/* Book of the season */}
      <section className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
          <div className="grid md:grid-cols-2 rounded-3xl overflow-hidden border border-gray-100 shadow-sm bg-white">
            <div
              className="relative min-h-72 bg-navy-dark"
              style={{
                backgroundImage: `linear-gradient(120deg, rgba(21,31,58,0.98) 0%, rgba(29,42,77,0.85) 45%, rgba(245,184,46,0.55) 85%, rgba(245,184,46,0.25) 100%), url(${meta.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 flex items-end p-8">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#f5b82e]">Book of the season</span>
                  <p className="text-5xl font-black tracking-tight text-white mt-1">{meta.book}</p>
                  <p className="text-white/70 text-sm mt-2">read in 60 days · one section at a time</p>
                </div>
              </div>
            </div>
            <div className="p-8 md:p-10 flex flex-col justify-center">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#f5b82e]">{season} · {new Date().getFullYear()}</span>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-navy mt-2">Read the book. Unlock the quiz. Top the board.</h2>
              <p className="text-gray-500 text-sm leading-relaxed mt-3">{meta.blurb}</p>

              <ol className="mt-6 space-y-3">
                {[
                  ["Read", "five chapters of a section inside a reading plan"],
                  ["Unlock", "the inline quiz the moment the reading is done"],
                  ["Claim", "a top-five seat on your club's board"],
                ].map(([verb, rest], i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 size-6 grid place-items-center rounded-full bg-[#f5b82e]/15 text-[#b8860b] text-xs font-black">
                      {i + 1}
                    </span>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold text-navy">{verb}</span> — {rest}
                    </p>
                  </li>
                ))}
              </ol>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href={`/plans/${PLAN_SLUG}`}
                  className="inline-flex items-center gap-2 bg-navy text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-navy-dark transition-colors"
                >
                  <FaBookOpen /> Start reading {meta.book} <FaArrowRight className="text-xs" />
                </Link>
                <Link
                  href="#overview"
                  className="inline-flex items-center gap-2 border border-gray-200 text-navy px-6 py-3 rounded-lg font-semibold text-sm hover:border-gray-300 transition-colors"
                >
                  See the season&apos;s top 5
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* At-a-glance season top 5 */}
      <section id="overview" className="bg-alice-blue border-b border-gray-100 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
          <div className="flex items-baseline gap-3 mb-1">
            <FaTrophy className="text-xl text-[#b8860b]" />
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-navy">Season&apos;s top 5</h2>
          </div>
          <p className="text-sm text-slate-gray mb-6">The best scores across Sprout, Surge, Pulse, Prime and Anchor this week.</p>

          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 bg-[#f5b82e]/15">
              <div className="flex items-center gap-2">
                <FaCrown className="text-sm text-[#b8860b]" />
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#8a6d1a]">All clubs · combined</p>
              </div>
              <span className="text-[11px] text-gray-400">{overview.length} scored this week</span>
            </div>
            <ul className="divide-y divide-gray-50">
              {overview.map((row) => (
                <li key={`${row.club.slug}-${row.name}`} className="flex items-center gap-4 px-5 py-3">
                  <span className="w-5 text-center text-sm font-black text-navy">{row.rank}</span>
                  <span className="text-sm">{MEDALS[row.rank - 1]}</span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${row.club.accent}14`, color: row.club.accent }}>
                    {row.club.name}
                  </span>
                  <span className="flex-1 text-sm font-medium text-gray-800">{row.name}</span>
                  <span className="text-xs text-gray-400">
                    {row.correct}/{row.total} correct
                  </span>
                  <span className="w-14 text-right text-sm font-black text-navy">{row.score}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Per-club boards + logs */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 space-y-20">
          {boards.map(({ section, board }) => {
            const isOpen = expanded[section.slug] ?? false;
            const visibleLogs = isOpen ? board.logs : board.logs.slice(0, VISIBLE_LOGS);
            return (
              <div key={section.slug} id={section.slug} className="scroll-mt-24">
                <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <span className="size-3 rounded-full" style={{ backgroundColor: section.accent }} />
                    <div>
                      <h2 className="text-2xl md:text-3xl font-black tracking-tight text-navy">{section.name}</h2>
                      <p className="text-sm text-slate-gray">{section.tagline} · {section.group.length} roster{section.group.length === 1 ? "" : "s"}</p>
                    </div>
                  </div>
                  <Link href={`/${section.slug}`} className="text-sm font-semibold transition-colors" style={{ color: section.accent }}>
                    Visit {section.name} <FaArrowRight className="text-[11px] inline" />
                  </Link>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Top 5 board */}
                  <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4" style={{ backgroundColor: `${section.accent}14` }}>
                      <div className="flex items-center gap-2">
                        <FaCrown className="text-sm" style={{ color: section.accent }} />
                        <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: section.accent }}>
                          Top 5 · {section.name}
                        </p>
                      </div>
                      <Link
                        href={`/plans/${PLAN_SLUG}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors"
                        style={{ color: section.accent }}
                      >
                        <FaMedal className="text-[11px]" /> Open the plan <FaArrowRight className="text-[10px]" />
                      </Link>
                    </div>
                    <TopFiveRows board={board} />
                    <div className="px-5 py-3 border-t border-gray-50 bg-gray-50/60">
                      <p className="text-[11px] text-gray-400">board refreshes every Sunday · quiz unlocks inside the reading plan</p>
                    </div>
                  </div>

                  {/* Logs + view more */}
                  <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-50">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">This week&apos;s attempts</p>
                    </div>
                    <ul className="divide-y divide-gray-50">
                      {visibleLogs.map((log: QuizLogRow) => {
                        const club = SLUG_TO_SECTION.get(log.clubSlug);
                        return (
                          <li key={log.id} className="flex items-center gap-3 px-5 py-3">
                            <span className="size-8 grid place-items-center rounded-full text-xs font-bold" style={{ backgroundColor: `${club?.accent ?? "#999"}14`, color: club?.accent ?? "#666" }}>
                              {log.name.charAt(0)}
                            </span>
                            <span className="flex-1 min-w-0">
                              <span className="block text-sm font-medium text-gray-800 truncate">{log.name}</span>
                              <span className="block text-[11px] text-gray-400">{fmtDate(log.at)} · {fmtTime(log.milliseconds)}</span>
                            </span>
                            <span className="text-xs text-gray-400">{log.correct}/{log.total} correct</span>
                            <span className="w-14 text-right text-sm font-black" style={{ color: club?.accent ?? "#333" }}>
                              {log.score}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                    <div className="px-5 py-3 border-t border-gray-50 bg-gray-50/60 flex items-center justify-between">
                      <p className="text-[11px] text-gray-400">
                        {board.logs.length} attempt{board.logs.length === 1 ? "" : "s"} · {isOpen ? "full log" : "showing latest"}
                      </p>
                      <button
                        onClick={() => setExpanded((prev) => ({ ...prev, [section.slug]: !isOpen }))}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors"
                        style={{ color: section.accent }}
                      >
                        {isOpen ? "Show less" : `View more`}
                        <LuChevronDown className={`text-xs transition-transform ${isOpen ? "rotate-180" : ""}`} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/plans/${PLAN_SLUG}`}
                    className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: section.accent }}
                  >
                    Play the {season} quiz for {section.name} <FaArrowRight className="text-xs" />
                  </Link>
                  <span className="inline-flex items-center gap-2 text-xs text-gray-400">
                    <FaCircleCheck className="text-[#4ade80]" /> read five chapters in a section first
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}