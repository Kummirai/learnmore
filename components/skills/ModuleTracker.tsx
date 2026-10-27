"use client";

import { useEffect, useRef, useState } from "react";
import {
  LuCamera,
  LuCircle,
  LuCircleCheck,
  LuLoaderCircle,
  LuLogIn,
} from "react-icons/lu";
import { useAuth } from "@/components/AuthProvider";
import { uploadToCloudinary } from "@/lib/cloudinary";
import type { ModuleProgress, Skill, SkillModule } from "@/lib/skills";

type RowMap = Record<string, ModuleProgress | undefined>;

const MAX_BYTES = 4 * 1024 * 1024;

/**
 * Curriculum-module tracker for skill detail pages that carry `skill.modules`
 * (Pulse's four tracks and Prime's Smart Saver). Each module can be marked
 * complete and its practical deliverable proved with a photo — saved to
 * `module_progress` through GET/POST /api/skills/<skillId>/modules, which the
 * next.config rewrite proxies to the backend.
 */
export default function ModuleTracker({
  skill,
  clubSlug,
  accent,
}: {
  skill: Skill;
  clubSlug: string;
  accent: string;
}) {
  const { user } = useAuth();
  const modules = skill.modules ?? [];
  const [rows, setRows] = useState<RowMap>({});
  const [loaded, setLoaded] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const pendingModule = useRef<SkillModule | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    fetch(`/api/skills/${encodeURIComponent(skill.id)}/modules`, {
      cache: "no-store",
    })
      .then(async (res) => {
        if (!res.ok) return [] as ModuleProgress[];
        const json = await res.json().catch(() => ({ data: [] }));
        return (json?.data ?? []) as ModuleProgress[];
      })
      .then((list) => {
        if (cancelled) return;
        const map: RowMap = {};
        for (const row of list) map[row.moduleId] = row;
        setRows(map);
        setLoaded(true);
      })
      .catch(() => {
        if (cancelled) return;
        setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [user, skill.id]);

  async function persist(moduleId: string, patch: Record<string, unknown>) {
    const res = await fetch(`/api/skills/${encodeURIComponent(skill.id)}/modules`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ moduleId, ...patch }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json?.error || "Could not save — try again.");
    return json.data as ModuleProgress;
  }

  async function toggleComplete(mod: SkillModule) {
    const prev = rows[mod.id];
    const nextCompleted = !(prev?.completed ?? false);
    setBusyId(mod.id);
    setError(null);
    setRows((r) => ({
      ...r,
      [mod.id]: {
        ...prev,
        moduleId: mod.id,
        completed: nextCompleted,
        deliverableSubmitted: prev?.deliverableSubmitted ?? false,
        deliverableUrl: prev?.deliverableUrl ?? null,
      },
    }));
    try {
      const saved = await persist(mod.id, { completed: nextCompleted });
      setRows((r) => ({ ...r, [mod.id]: saved }));
    } catch (e) {
      setRows((r) => {
        const next = { ...r };
        if (prev) next[mod.id] = prev;
        else delete next[mod.id];
        return next;
      });
      setError(e instanceof Error ? e.message : "Could not save — try again.");
    } finally {
      setBusyId(null);
    }
  }

  function pickDeliverable(mod: SkillModule) {
    pendingModule.current = mod;
    fileRef.current?.click();
  }

  async function onFileChosen(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    const mod = pendingModule.current;
    pendingModule.current = null;
    if (!file || !mod) return;
    if (!file.type.startsWith("image/")) {
      setError("Choose a JPEG, PNG, WebP or AVIF image.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("That image is over 4 MB — pick a smaller one.");
      return;
    }
    setBusyId(mod.id);
    setError(null);
    try {
      const url = await uploadToCloudinary(file, "relate/deliverables");
      const saved = await persist(mod.id, {
        deliverableUrl: url,
        deliverableSubmitted: true,
      });
      setRows((r) => ({ ...r, [mod.id]: saved }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed — try again.");
    } finally {
      setBusyId(null);
    }
  }

  const done = modules.filter((mod) => rows[mod.id]?.completed).length;
  const pct = modules.length ? Math.round((done / modules.length) * 100) : 0;
  const allDone = modules.length > 0 && done === modules.length;
  const showLoading = !!user && !loaded;

  const statusStyle = (row?: ModuleProgress) =>
    row?.completed
      ? "bg-emerald-50 text-emerald-700"
      : row?.deliverableSubmitted
        ? "bg-cyan-50 text-cyan-700"
        : "bg-gray-100 text-gray-500";
  const statusLabel = (row?: ModuleProgress) =>
    row?.completed
      ? "Complete"
      : row?.deliverableSubmitted
        ? "In progress"
        : "Not started";

  return (
    <section
      aria-label={"Curriculum modules"}
      className={"rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"}
    >
      <input
        ref={fileRef}
        type={"file"}
        accept={"image/jpeg,image/png,image/webp,image/avif"}
        className={"hidden"}
        onChange={onFileChosen}
        tabIndex={-1}
        aria-hidden={true}
      />

      <div className={"flex items-start justify-between gap-4"}>
        <div>
          <span
            className={"text-xs uppercase tracking-widest font-medium"}
            style={{ color: accent }}
          >
            Modules
          </span>
          <h2 className={"mt-1 text-lg font-bold text-navy"}>
            {done} of {modules.length} modules complete
          </h2>
        </div>
        <span
          className={
            "shrink-0 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider " +
            (allDone
              ? "bg-emerald-50 text-emerald-700"
              : done > 0
                ? "bg-cyan-50 text-cyan-700"
                : "bg-gray-100 text-gray-500")
          }
        >
          {allDone ? "Complete" : done > 0 ? "In progress" : "Not started"}
        </span>
      </div>

      <div className={"mt-4"}>
        <div className={"h-2 w-full overflow-hidden rounded-full bg-gray-100"}>
          <div
            className={
              "h-2 rounded-full transition-all " +
              (allDone ? "bg-emerald-500" : "bg-cyan-500")
            }
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className={"mt-1.5 text-xs text-gray-500"}>
          <span className={"font-bold text-navy"}>{pct}% complete</span>
          {" · "}tick each module off as you finish it
        </p>
      </div>

      {showLoading ? (
        <div className={"mt-5 flex items-center gap-2 text-sm text-gray-500"}>
          <LuLoaderCircle className={"animate-spin"} /> Loading your progress…
        </div>
      ) : !user ? (
        <div
          className={
            "mt-5 rounded-xl border border-cyan-200 bg-alice-blue p-4"
          }
        >
          <p className={"text-base font-bold text-navy"}>Track your modules</p>
          <p className={"mt-1 text-sm text-gray-600 leading-relaxed"}>
            Sign in to mark modules complete, attach deliverables, and keep
            your progress with your account.
          </p>
          <a
            href={`/signin?next=${encodeURIComponent(`/${clubSlug}/skills/${skill.id}`)}`}
            className={
              "mt-3 inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy/90 transition-colors"
            }
          >
            <LuLogIn /> Sign in to start
          </a>
        </div>
      ) : null}

      {user && !showLoading && error ? (
        <p
          role={"alert"}
          className={
            "mt-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700"
          }
        >
          {error}
        </p>
      ) : null}

      <ol className={"mt-5 space-y-3"}>
        {modules.map((mod) => {
          const row = rows[mod.id];
          const busy = busyId === mod.id;
          return (
            <li
              key={mod.id}
              className={
                "rounded-xl border p-4 " +
                (row?.completed
                  ? "border-emerald-200 bg-emerald-50/40"
                  : "border-gray-200 bg-white")
              }
            >
              <div className={"flex items-center gap-3"}>
                <span
                  className={
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-400"
                  }
                >
                  {mod.order}
                </span>
                <h3 className={"flex-1 text-sm font-bold text-navy"}>
                  {mod.title}
                </h3>
                <span
                  className={
                    "shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider " +
                    statusStyle(row)
                  }
                >
                  {statusLabel(row)}
                </span>
              </div>

              <p className={"mt-2 text-sm text-gray-600 leading-relaxed"}>
                {mod.description}
              </p>
              <p className={"mt-1.5 flex items-center gap-1.5 text-xs text-gray-400"}>
                <LuCamera aria-hidden={true} /> ≈ {mod.durationMinutes} min
              </p>

              <div
                className={
                  "mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3"
                }
              >
                <p
                  className={
                    "text-[10px] font-bold uppercase tracking-widest text-gray-400"
                  }
                >
                  Practical deliverable
                </p>
                <p className={"mt-1 text-sm text-navy leading-relaxed"}>
                  {mod.deliverableDescription}
                </p>

                {row?.deliverableUrl ? (
                  <div className={"mt-2.5 flex items-center gap-3"}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={row.deliverableUrl}
                      alt={"Deliverable proof"}
                      className={
                        "h-12 w-12 rounded-md border border-gray-200 object-cover"
                      }
                    />
                    <div className={"min-w-0"}>
                      <p className={"text-xs font-bold text-emerald-700"}>
                        Proof attached
                      </p>
                      <p className={"truncate text-[11px] text-gray-500"}>
                        {row.deliverableUrl}
                      </p>
                    </div>
                  </div>
                ) : null}

                <button
                  type={"button"}
                  onClick={() => pickDeliverable(mod)}
                  disabled={busy}
                  className={
                    "mt-2.5 inline-flex items-center gap-2 rounded-lg border border-cyan-300 bg-white px-3 py-2 text-xs font-semibold text-cyan-700 hover:border-cyan-500 transition-colors disabled:opacity-60"
                  }
                >
                  {busy ? (
                    <LuLoaderCircle className={"animate-spin"} />
                  ) : (
                    <LuCamera />
                  )}
                  {busy
                    ? "Saving…"
                    : row?.deliverableUrl
                      ? "Replace photo"
                      : "Attach photo proof"}
                </button>
              </div>

              <button
                type={"button"}
                onClick={() => void toggleComplete(mod)}
                disabled={busy}
                aria-pressed={row?.completed ?? false}
                className={
                  "mt-3 flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm font-semibold transition-colors disabled:opacity-60 " +
                  (row?.completed ? "text-emerald-700" : "text-navy")
                }
              >
                {busy ? (
                  <LuLoaderCircle className={"animate-spin"} />
                ) : row?.completed ? (
                  <LuCircleCheck />
                ) : (
                  <LuCircle />
                )}
                {row?.completed ? "Module complete" : "Mark module complete"}
              </button>
            </li>
          );
        })}
      </ol>

      {user && !showLoading && busyId ? (
        <p className={"mt-3 flex items-center gap-2 text-xs text-gray-500"}>
          <LuLoaderCircle className={"animate-spin"} /> Saving…
        </p>
      ) : null}
    </section>
  );
}
