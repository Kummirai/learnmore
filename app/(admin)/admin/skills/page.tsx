"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AdminHeader, Badge, Select } from "@/components/admin/ui";
import { useSkills } from "@/lib/useSkills";
import { LuExternalLink, LuSearch } from "react-icons/lu";

type Status = "not_started" | "in_progress" | "complete";

type Row = {
    userId: string;
    skillId: string;
    clubSlug: string;
    name: string;
    email: string;
    status: Status;
    criteriaDone: number;
    criteriaTotal: number;
    requirementsDone: number;
    requirementsTotal: number;
    completedAt: string | null;
    updatedAt: string | null;
};

/** Empty filter = every record, whatever skill it belongs to. */
const ALL_SKILLS = "";

export default function AdminSkillsPage() {
    return (
        <section
            className="flex-1 px-4 py-10 md:py-14"
            style={{ background: "linear-gradient(115deg, #f5f8fb 0%, #eff5f9 60%, #f5f8fb 100%)" }}
        >
            <div className="max-w-6xl mx-auto">
                <SkillsBody />
            </div>
        </section>
    );
}

function SkillsBody() {
    const [clubSlug, setClubSlug] = useState<string>("sprout");
    const [filterSkillId, setFilterSkillId] = useState<string>(ALL_SKILLS);
    const [payload, setPayload] = useState<{ skill: string; clubSlug: string; rows: Row[] } | null>(null);
    const [error, setError] = useState("");
    const [query, setQuery] = useState("");
    const { skills, loading: skillsLoading, error: skillsError } = useSkills(clubSlug);
    const effectiveSkillId = clubSlug !== (payload?.clubSlug ?? clubSlug) ? ALL_SKILLS : filterSkillId;

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const qs = new URLSearchParams();
                qs.set("club", clubSlug);
                if (effectiveSkillId) qs.set("skill", effectiveSkillId);
                const res = await fetch(`/api/admin/skills?${qs.toString()}`);
                const json = await res.json().catch(() => null);
                if (cancelled) return;
                if (!res.ok) {
                    setError(typeof json?.error === "string" ? json.error : "Couldn't load skill progress.");
                    setPayload({ skill: effectiveSkillId, clubSlug, rows: [] });
                    return;
                }
                setError("");
                setPayload({ skill: effectiveSkillId, clubSlug, rows: Array.isArray(json?.data) ? json.data : [] });
            } catch {
                if (cancelled) return;
                setError("Couldn't reach the API. Is the backend up?");
                setPayload({ skill: effectiveSkillId, clubSlug, rows: [] });
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [effectiveSkillId, clubSlug]);

    const loading = payload === null || payload.skill !== effectiveSkillId || payload.clubSlug !== clubSlug;
    const rows = useMemo(
        () => (payload && payload.skill === effectiveSkillId && payload.clubSlug === clubSlug ? payload.rows : []),
        [payload, effectiveSkillId, clubSlug],
    );
    const entry = effectiveSkillId ? skills?.getSkill(effectiveSkillId) : undefined;

    const view = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return rows;
        return rows.filter((r) => r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q));
    }, [rows, query]);

    const stats = useMemo(() => {
        const people = new Set(rows.map((r) => r.userId)).size;
        const complete = rows.filter((r) => r.status === "complete").length;
        const proven = rows.reduce((sum, r) => sum + r.criteriaDone, 0);
        const criteria = rows.reduce((sum, r) => sum + r.criteriaTotal, 0);
        return {
            people,
            complete,
            inProgress: rows.filter((r) => r.status === "in_progress").length,
            pct: criteria ? Math.round((proven / criteria) * 100) : 0,
        };
    }, [rows]);

    if (skillsError || skillsLoading || !skills) {
        return (
            <div className="bg-white rounded-2xl shadow-xl p-5 md:p-7">
                <AdminHeader
                    eyebrow={capitalize(clubSlug)}
                    title="Skills Progress"
                    sub="Every participant's progress through the skills framework — criteria proven and requirements signed off."
                />
                <p
                    className={`rounded-lg px-4 py-2.5 text-sm ${
                        skillsError ? "bg-red-50 text-red-600" : "bg-alice-blue text-slate-gray"
                    }`}
                >
                    {skillsError ?? "Loading the skills framework…"}
                </p>
                {skillsError && <p className="mt-3 text-xs text-gray-400">Reload the page to try again.</p>}
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl p-5 md:p-7">
            <AdminHeader
                eyebrow={capitalize(clubSlug)}
                title="Skills Progress"
                sub="Every participant's progress through the skills framework — criteria proven and requirements signed off."
                actions={
                    <>
                        <label className="relative">
                            <span className="sr-only">Filter by club</span>
                            <Select value={clubSlug} onChange={(e) => setClubSlug(e.target.value)}>
                                <option value="sprout">Sprout</option>
                                <option value="surge">Surge</option>
                                <option value="pulse">Pulse</option>
                                <option value="prime">Prime</option>
                                <option value="anchor">Anchor</option>
                                <option value="spark">Spark</option>
                                <option value="synergy">Synergy</option>
                            </Select>
                        </label>
                        <label className="relative">
                            <span className="sr-only">Filter by skill</span>
                            <Select value={effectiveSkillId} onChange={(e) => setFilterSkillId(e.target.value)}>
                                <option value={ALL_SKILLS}>All skills</option>
                                {skills.levels.map((level) => (
                                    <optgroup key={level.id} label={level.name}>
                                        {skills.skillsByLevel(level.id).map((skill) => (
                                            <option key={skill.id} value={skill.id}>
                                                {skill.name}
                                            </option>
                                        ))}
                                    </optgroup>
                                ))}
                            </Select>
                        </label>
                        <label className="relative">
                            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search members…"
                                className="w-52 rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/20 transition"
                            />
                        </label>
                        <Link
                            href={`/${clubSlug}/skills`}
                            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-alice-blue transition"
                        >
                            <LuExternalLink className="text-sm" /> Public skills
                        </Link>
                    </>
                }
            />

            {error && <p className="mb-4 rounded-lg bg-red-50 text-red-600 text-sm px-4 py-2.5">{error}</p>}

            <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                <Stat label="Participants" value={String(stats.people)} />
                <Stat label="Completed" value={String(stats.complete)} />
                <Stat label="In progress" value={String(stats.inProgress)} />
                <Stat label="Criteria proven" value={`${stats.pct}%`} />
            </div>

            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-widest text-slate-gray">
                    {entry ? `${skills.levelById[entry.levelId]?.name ?? ""} · ${entry.name}` : `All skills in ${capitalize(clubSlug)}`}
                    <span className="ml-2 normal-case tracking-normal text-gray-400">
                        {view.length} record{view.length === 1 ? "" : "s"}
                    </span>
                </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-100">
                <table className="w-full min-w-[820px] text-left text-sm">
                    <thead>
                        <tr className="border-b border-gray-100 bg-alice-blue/60 text-[11px] uppercase tracking-widest text-slate-gray">
                            <th className="px-4 py-3 font-semibold">Member</th>
                            {!effectiveSkillId && <th className="px-4 py-3 font-semibold">Skill</th>}
                            <th className="px-4 py-3 font-semibold">Criteria</th>
                            <th className="px-4 py-3 font-semibold">Requirements</th>
                            <th className="px-4 py-3 font-semibold">Status</th>
                            <th className="px-4 py-3 text-right font-semibold">Updated</th>
                        </tr>
                    </thead>
                    <tbody>
                        {view.map((row) => {
                            const skill = skills.getSkill(row.skillId);
                            const pct = row.criteriaTotal ? Math.round((row.criteriaDone / row.criteriaTotal) * 100) : 0;
                            return (
                                <tr
                                    key={`${row.userId}-${row.skillId}`}
                                    className="border-b border-gray-50 last:border-0 transition-colors hover:bg-alice-blue/40"
                                >
                                    <td className="px-4 py-3.5">
                                        <span className="font-semibold text-navy">{row.name}</span>
                                        <div className="text-xs text-gray-400">{row.email}</div>
                                    </td>
                                    {!effectiveSkillId && (
                                        <td className="px-4 py-3.5">
                                            <span className="flex items-center gap-2">
                                                <span
                                                    aria-hidden="true"
                                                    className="size-2.5 shrink-0 rounded-full"
                                                    style={{ backgroundColor: skill ? (skills.levelById[skill.levelId]?.color ?? "#cbd5e1") : "#cbd5e1" }}
                                                />
                                                <span className="text-gray-700">{skill?.name ?? row.skillId}</span>
                                            </span>
                                            <div className="text-xs text-gray-400">{skill ? skills.levelById[skill.levelId]?.name : "—"}</div>
                                        </td>
                                    )}
                                    <td className="px-4 py-3.5">
                                        <div className="flex items-center gap-2">
                                            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-100">
                                                <div
                                                    className={`h-full rounded-full ${pct === 100 ? "bg-emerald-500" : "bg-cyan"}`}
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-semibold text-navy">
                                                {row.criteriaDone}/{row.criteriaTotal} · {pct}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <span className="font-semibold text-navy">{row.requirementsDone}</span>
                                        <span className="text-gray-400"> of {row.requirementsTotal}</span>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <Badge tone={row.status === "complete" ? "gold" : row.status === "in_progress" ? "sky" : "slate"}>
                                            {row.status === "complete"
                                                ? "Complete"
                                                : row.status === "in_progress"
                                                  ? "In progress"
                                                  : "Not started"}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3.5 text-right text-xs text-gray-400">
                                        {row.updatedAt
                                            ? new Date(row.updatedAt).toLocaleDateString(undefined, {
                                                  month: "short",
                                                  day: "numeric",
                                              })
                                            : "—"}
                                    </td>
                                </tr>
                            );
                        })}
                        {loading && (
                            <tr>
                                <td colSpan={effectiveSkillId ? 6 : 7} className="px-4 py-10 text-center text-sm text-slate-gray">
                                    Loading skill progress…
                                </td>
                            </tr>
                        )}
                        {!loading && view.length === 0 && (
                            <tr>
                                <td colSpan={effectiveSkillId ? 6 : 7} className="px-4 py-10 text-center text-sm text-slate-gray">
                                    {query ? `No members match "${query}".` : "No one has started this skill yet."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-gray-400">
                    Read-only roll-up: 500 most recently updated records, newest first.
                </p>
                <div className="flex flex-wrap gap-1.5">
                    {skills.skills.map((e) => (
                        <button
                            key={e.id}
                            type="button"
                            onClick={() => setFilterSkillId(e.id)}
                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                                effectiveSkillId === e.id
                                    ? "bg-navy text-white"
                                    : "bg-alice-blue text-slate-gray hover:bg-cyan/30"
                            }`}
                            title={`${skills.levelById[e.levelId]?.name ?? ""} · ${e.name}`}
                        >
                            {e.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

function Stat({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl border border-gray-100 bg-alice-blue/40 px-4 py-3">
            <p className="text-[11px] uppercase tracking-widest text-slate-gray">{label}</p>
            <p className="mt-0.5 text-lg font-bold text-navy">{value}</p>
        </div>
    );
}

function capitalize(str: string): string {
    return str
        .replace(/^./, (c) => c.toUpperCase())
        .replace(/-./g, (m) => m[1].toUpperCase());
}

