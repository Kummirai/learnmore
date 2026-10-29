"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import {
  type PortalProgress,
  milestoneKey,
} from "@/lib/programming-portal";

export type XpCelebration = {
  /** Monotonic id so repeat awards re-trigger animations. */
  nonce: number;
  xp: number;
  label: string;
};

type PostResult = { progress: PortalProgress; gainedXp: number };

/**
 * Client state for the Sprout Tweens Programming Portal.
 *
 * Loads GET /api/programming-portal on sign-in and exposes optimistic
 * mutations for milestones, quizzes and the Master badge. Each successful
 * save emits an XP celebration the header can animate.
 */
export function useProgrammingPortal() {
  const { user } = useAuth();
  // The web User type carries no id — email is the stable per-account key.
  const sessionKey = user?.email ?? null;
  const [progress, setProgress] = useState<PortalProgress | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [loadedFor, setLoadedFor] = useState<string | null>(sessionKey);
  const [busy, setBusy] = useState(false);
  const [celebration, setCelebration] = useState<XpCelebration | null>(null);
  const nonceRef = useRef(0);

  useEffect(() => {
    if (!sessionKey) return;
    const key = sessionKey;
    let cancelled = false;
    fetch("/api/programming-portal", { cache: "no-store" })
      .then(async (res) => {
        const json = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (res.status === 401) {
          setProgress(null);
          setLoadError(json?.error ?? "Sign in to save your progress.");
          setLoadedFor(key);
          return;
        }
        if (!res.ok) {
          setLoadError(
            json?.error ?? "Could not load your progress — try again.",
          );
          setLoadedFor(key);
          return;
        }
        setProgress((json?.data ?? null) as PortalProgress | null);
        setLoadError(null);
        setLoadedFor(key);
      })
      .catch(() => {
        if (cancelled) return;
        setLoadError("Could not load your progress — check your connection.");
        setLoadedFor(key);
      });
    return () => {
      cancelled = true;
    };
  }, [sessionKey]);

  // Derived session view: signed-out or a different account shows the empty
  // state until its own fetch lands (no stale progress leaks across users).
  const signedIn = !!sessionKey;
  const current = signedIn && loadedFor === sessionKey ? progress : null;
  const loading = signedIn && loadedFor !== sessionKey;
  const error = actionError ?? (signedIn ? loadError : null);

  const celebrate = useCallback((xp: number, label: string) => {
    if (xp <= 0) return;
    nonceRef.current += 1;
    setCelebration({ nonce: nonceRef.current, xp, label });
  }, []);

  const clearCelebration = useCallback(() => setCelebration(null), []);

  const post = useCallback(
    async (
      body: Record<string, unknown>,
      label: string,
    ): Promise<PostResult> => {
      const res = await fetch("/api/programming-portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (res.status === 401) {
        throw new Error(json?.error ?? "Sign in to save your progress.");
      }
      if (!res.ok) {
        throw new Error(json?.error ?? "Could not save — try again.");
      }
      const data = json?.data as PortalProgress & { gainedXp?: number };
      const gainedXp = data?.gainedXp ?? 0;
      const { gainedXp: _drop, ...next } = data;
      void _drop;
      setProgress(next);
      setLoadError(null);
      if (sessionKey) setLoadedFor(sessionKey);
      celebrate(gainedXp, label);
      return { progress: next, gainedXp };
    },
    [celebrate, sessionKey],
  );

  const isMilestoneDone = useCallback(
    (year: number, id: string) =>
      !!current && current.milestones.includes(milestoneKey(year, id)),
    [current],
  );

  const setMilestone = useCallback(
    async (year: number, id: string, completed: boolean, label: string) => {
      setBusy(true);
      setActionError(null);
      try {
        return await post(
          { milestone: { year, id, completed } },
          completed ? label : "",
        );
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "Could not save — try again.";
        setActionError(message);
        throw e;
      } finally {
        setBusy(false);
      }
    },
    [post],
  );

  const submitQuiz = useCallback(
    async (year: number, id: string, score: number) => {
      setBusy(true);
      setActionError(null);
      try {
        return await post(
          { quiz: { year, id, score } },
          `Quiz +${score * 25} XP`,
        );
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "Could not save — try again.";
        setActionError(message);
        throw e;
      } finally {
        setBusy(false);
      }
    },
    [post],
  );

  const claimMasterBadge = useCallback(async () => {
    setBusy(true);
    setActionError(null);
    try {
      return await post({ claimMasterBadge: true }, "Master Badge +200 XP");
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Could not save — try again.";
      setActionError(message);
      throw e;
    } finally {
      setBusy(false);
    }
  }, [post]);

  return {
    user,
    progress: current,
    loading,
    error,
    busy,
    celebration,
    clearCelebration,
    isMilestoneDone,
    setMilestone,
    submitQuiz,
    claimMasterBadge,
  };
}
