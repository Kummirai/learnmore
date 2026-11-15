"use client";

import { useEffect } from "react";

/**
 * Toggles `.reveal` elements as they enter and leave the viewport, so the
 * fade-up plays again whether the visitor is scrolling down or back up.
 * Mounted once in the root layout; sections opt in with `className="reveal"`.
 * Honours prefers-reduced-motion and degrades to fully visible without JS.
 */
export default function RevealObserver() {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const root = document.documentElement;
    root.classList.add("reveal-ready");

    const show = (el: Element) => el.setAttribute("data-visible", "true");
    const hide = (el: Element) => el.removeAttribute("data-visible");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll(".reveal").forEach(show);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) show(entry.target);
          else hide(entry.target);
        }
      },
      { threshold: 0, rootMargin: "0px 0px -8% 0px" },
    );

    const scan = (scope: ParentNode) => {
      scope.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    };

    scan(document);

    // Pages are server-rendered; catch anything React adds on navigation.
    const mutation = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (node.nodeType !== 1 || !(node instanceof Element)) continue;
          if (node.matches(".reveal")) observer.observe(node);
          scan(node);
        }
      }
    });
    mutation.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutation.disconnect();
      root.classList.remove("reveal-ready");
    };
  }, []);

  return null;
}
