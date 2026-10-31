"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { type PortalProgress, milestoneKey } from "@/lib/programming-portal";

/**
 * Client state for the Sprout Tweens Programming Portal.
 *
 * Loads GET /api/programming-portal on sign-in. Progression is read-only here:
 * milestones are approved by an instructor from the admin panel, so this hook
 * exposes only the approved record.
 */
export function useProgrammingPortal() {
  const { user } = useAuth();
  // The web User type carries no id — email is the stable per-account key.
  const sessionKey = user?.email ?? null;
  const [progress, setProgress] = useState<PortalProgress | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadedFor, setLoadedFor] = useState<string | null>(sessionKey);

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
          setLoadError(json?.error ?? "Sign in to see your progress.");
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
  const error = signedIn ? loadError : null;

  const isMilestoneDone = useCallback(
    (year: number, id: string) =>
      !!current && current.milestones.includes(milestoneKey(year, id)),
    [current],
  );

  return {
    user,
    progress: current,
    loading,
    error,
    isMilestoneDone,
  };
}
