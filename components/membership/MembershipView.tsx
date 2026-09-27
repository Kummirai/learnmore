"use client";

import { useSyncExternalStore } from "react";
import {
  MEMBER_STORAGE_KEY,
  parseMembershipJson,
  subscribeMembershipLocal,
  type Membership,
} from "@/lib/membership";
import MemberDashboard from "./MemberDashboard";
import MembershipJoinPrompt from "./MembershipJoinPrompt";

/**
 * The membership page, from the browser's point of view.
 *
 * The server renders from the cookie it can see; when that's missing we read
 * the localStorage copy the join form writes — the record belongs to the
 * device that registered, and outlives the cookie. Cached so React sees one
 * stable object per record, and kept in sync with other tabs.
 */
let rawCache: string | null | undefined;
let recordCache: Membership | null;

function readStored(): Membership | null {
  if (typeof window === "undefined") return null;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(MEMBER_STORAGE_KEY);
  } catch {
    raw = null; // storage unavailable — show the join prompt
  }
  if (raw !== rawCache) {
    rawCache = raw;
    recordCache = parseMembershipJson(raw ?? undefined);
  }
  return recordCache;
}

function subscribe(onStoreChange: () => void) {
  return subscribeMembershipLocal(onStoreChange);
}

const readOnServer = () => null;

export default function MembershipView({
  member,
}: {
  member: Membership | null;
}) {
  const stored = useSyncExternalStore(subscribe, readStored, readOnServer);
  const record = member ?? stored;

  if (!record) return <MembershipJoinPrompt />;
  return <MemberDashboard member={record} />;
}
