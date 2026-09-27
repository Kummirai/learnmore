"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  MEMBER_COOKIE,
  MEMBER_STORAGE_KEY,
  parseMembership,
  parseMembershipJson,
  subscribeMembershipLocal,
} from "@/lib/membership";

function readIsMember(): boolean {
  try {
    const rawCookie = document.cookie
      .split("; ")
      .find((c) => c.startsWith(`${MEMBER_COOKIE}=`));
    if (rawCookie && parseMembership(rawCookie.slice(MEMBER_COOKIE.length + 1)))
      return true;
    const local = window.localStorage.getItem(MEMBER_STORAGE_KEY);
    if (local && parseMembershipJson(local)) return true;
  } catch {
    // storage unavailable — treat as not a member
  }
  return false;
}

/**
 * A Join CTA that swaps itself out once this browser holds a membership
 * record: members see "My membership" (or nothing, when memberLabel is null)
 * instead of being asked to join again.
 */
export default function JoinCta({
  href,
  className,
  children,
  memberLabel = "My membership",
  onClick,
  style,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
  memberLabel?: string | null;
  onClick?: () => void;
  style?: React.CSSProperties;
}) {
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // Re-check on sign-in, sign-out and writes from other tabs.
    const sync = () => {
      const next = readIsMember();
      if (!cancelled) setIsMember(next);
    };
    Promise.resolve().then(sync);
    const stop = subscribeMembershipLocal(sync);
    return () => {
      cancelled = true;
      stop();
    };
  }, []);

  if (isMember) {
    if (memberLabel === null) return null;
    return (
      <Link href="/membership" className={className} onClick={onClick} style={style}>
        {memberLabel}
      </Link>
    );
  }
  return (
    <Link href={href} className={className} onClick={onClick} style={style}>
      {children}
    </Link>
  );
}
