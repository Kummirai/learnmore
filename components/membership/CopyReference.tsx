"use client";

import { useEffect, useRef, useState } from "react";
import { LuCheck, LuCopy } from "react-icons/lu";

/**
 * Copy-to-clipboard for the membership ID — the code a leader looks a member
 * up by, so it should be one tap away on every surface.
 */
export default function CopyReference({
  value,
  className = "",
}: {
  value: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      return;
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy membership ID ${value}`}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-3 min-h-11 text-xs font-bold uppercase tracking-widest transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan ${
        copied ? "bg-gold-500 text-navy-dark" : "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white"
      } ${className}`}
    >
      {copied ? <LuCheck className="text-sm" /> : <LuCopy className="text-sm" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
