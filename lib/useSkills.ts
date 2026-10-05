"use client";

import { useEffect, useState } from "react";
import { loadSkills, type SkillsCatalog } from "@/lib/skills";

type UseSkillsState = {
  skills: SkillsCatalog | null;
  loading: boolean;
  error: string | null;
};

const SKILLS_ERROR =
  "The skills framework couldn't be loaded — check your connection and try again.";

/** Client view of the skills catalog: loading first, an explicit error if it fails. */
export function useSkills(clubSlug: string): UseSkillsState {
  const [state, setState] = useState<UseSkillsState>({
    skills: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    loadSkills(clubSlug).then(
      (skills) => {
        if (!cancelled) setState({ skills, loading: false, error: null });
      },
      () => {
        if (!cancelled) {
          setState({ skills: null, loading: false, error: SKILLS_ERROR });
        }
      },
    );
    return () => {
      cancelled = true;
    };
  }, [clubSlug]);

  return state;
}
