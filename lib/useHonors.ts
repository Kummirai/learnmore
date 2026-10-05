/**
 * @deprecated Use lib/useSkills.ts instead.
 * The honors system is being replaced by the club-agnostic skills system.
 * This hook will be removed in a future release.
 */
"use client";

import { useEffect, useState } from "react";
import { loadHonors, type Honors } from "@/lib/honors";

const HONORS_ERROR =
  "The honors framework couldn't be loaded — check your connection and try again.";

/** Client view of the framework: loading first, an explicit error if it fails. */
export function useHonors(): {
  honors: Honors | null;
  loading: boolean;
  error: string | null;
} {
  const [state, setState] = useState<{
    honors: Honors | null;
    loading: boolean;
    error: string | null;
  }>({ honors: null, loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    loadHonors().then(
      (honors) => {
        if (!cancelled) setState({ honors, loading: false, error: null });
      },
      () => {
        if (!cancelled) {
          setState({ honors: null, loading: false, error: HONORS_ERROR });
        }
      },
    );
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
