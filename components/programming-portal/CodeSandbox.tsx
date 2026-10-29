"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  LuCircleCheck,
  LuCircleX,
  LuLoaderCircle,
  LuPlay,
  LuRotateCcw,
  LuTestTubeDiagonal,
} from "react-icons/lu";
import {
  type PortalMilestone,
  type PortalStarter,
  type PortalYear,
  type SandboxCode,
  type SandboxPane,
  composePreview,
  loadDraft,
  nextTestableMilestone,
  saveDraft,
  validateRules,
} from "@/lib/programming-portal";

const PANES: { id: SandboxPane; label: string }[] = [
  { id: "html", label: "HTML" },
  { id: "css", label: "CSS" },
  { id: "js", label: "JS" },
];

/**
 * Live in-browser playground: left pane edits HTML/CSS/JS (plus page tabs in
 * Year 4), right pane renders a sandboxed iframe in real time. "Test Code"
 * scans the current draft against the selected milestone's rules and passes
 * control back up when every rule is satisfied.
 */
export default function CodeSandbox({
  year,
  selectedMilestoneId,
  doneKeys,
  onTestPass,
}: {
  year: PortalYear;
  selectedMilestoneId: string | null;
  doneKeys: Set<string>;
  onTestPass: (milestone: PortalMilestone) => void;
}) {
  const [code, setCode] = useState<PortalStarter>(() => ({ ...year.starter }));
  const [pane, setPane] = useState<SandboxPane>("html");
  const [pageId, setPageId] = useState<string>(
    year.starter.pages?.[0]?.id ?? "index",
  );
  const [preview, setPreview] = useState<string>(() =>
    composePreview({
      html: year.starter.pages?.[0]?.html ?? year.starter.html,
      css: year.starter.css,
      js: year.starter.js,
    }),
  );
  const [testResults, setTestResults] = useState<
    { milestone: PortalMilestone; ok: boolean; lines: { passed: boolean; message: string }[] } | null
  >(null);
  const [testing, setTesting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sandboxRef = useRef<HTMLDivElement>(null);

  // Hydrate any saved local draft after mount — localStorage only exists in
  // the browser, so seeding it during render would break SSR hydration.
  useEffect(() => {
    const draft = loadDraft(year);
    const changed =
      draft.html !== year.starter.html ||
      draft.css !== year.starter.css ||
      draft.js !== year.starter.js ||
      !!draft.pages?.some(
        (page, i) => page.html !== year.starter.pages?.[i]?.html,
      );
    if (!changed) return;
    /* eslint-disable react-hooks/set-state-in-effect */
    setCode(draft);
    setPageId(draft.pages?.[0]?.id ?? "index");
    setPreview(
      composePreview({
        html: draft.pages?.[0]?.html ?? draft.html,
        css: draft.css,
        js: draft.js,
      }),
    );
    /* eslint-enable react-hooks/set-state-in-effect */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeHtml = useMemo(() => {
    if (code.pages?.length) {
      return (
        code.pages.find((p) => p.id === pageId)?.html ?? code.pages[0]?.html ?? ""
      );
    }
    return code.html;
  }, [code, pageId]);

  const sandboxCode: SandboxCode = useMemo(
    () => ({
      html: activeHtml,
      css: code.css,
      js: code.js,
      pages: code.pages,
    }),
    [activeHtml, code],
  );

  // Live preview — debounced so typing stays smooth.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPreview(
        composePreview({ html: activeHtml, css: code.css, js: code.js }),
      );
      saveDraft(year.year, code);
    }, 450);
    return () => window.clearTimeout(timer);
  }, [activeHtml, code, year.year]);

  const updateHtml = useCallback(
    (value: string) => {
      setCode((prev) => {
        if (prev.pages?.length) {
          return {
            ...prev,
            pages: prev.pages.map((p) =>
              p.id === pageId ? { ...p, html: value } : p,
            ),
          };
        }
        return { ...prev, html: value };
      });
    },
    [pageId],
  );

  const editorValue =
    pane === "html" ? activeHtml : pane === "css" ? code.css : code.js;

  const setEditorValue = useCallback(
    (value: string) => {
      if (pane === "html") updateHtml(value);
      else if (pane === "css") setCode((prev) => ({ ...prev, css: value }));
      else setCode((prev) => ({ ...prev, js: value }));
    },
    [pane, updateHtml],
  );

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Tab") return;
    event.preventDefault();
    const el = event.currentTarget;
    const { selectionStart, value } = el;
    const next = `${value.slice(0, selectionStart)}  ${value.slice(selectionStart)}`;
    setEditorValue(next);
    requestAnimationFrame(() => {
      el.selectionStart = selectionStart + 2;
      el.selectionEnd = selectionStart + 2;
    });
  }

  const targetMilestone = useMemo(() => {
    if (!selectedMilestoneId) return undefined;
    return year.milestones.find(
      (m) => m.id === selectedMilestoneId && m.rules?.length,
    );
  }, [selectedMilestoneId, year]);

  function runTests() {
    const milestone =
      targetMilestone ?? nextTestableMilestone(year, doneKeys) ?? null;
    if (!milestone?.rules?.length) {
      setTestResults({
        milestone: {
          id: "none",
          title: "All milestones tested",
          brief: "",
        },
        ok: true,
        lines: [
          {
            passed: true,
            message: "Every testable milestone for this year already passed!",
          },
        ],
      });
      return;
    }
    setTesting(true);
    const { ok, results } = validateRules(milestone.rules, sandboxCode);
    setTestResults({
      milestone,
      ok,
      lines: results.map((r) => ({
        passed: r.passed,
        message: r.passed
          ? `${r.rule.message} ✓`
          : r.rule.message,
      })),
    });
    setTesting(false);
    if (ok) onTestPass(milestone);
  }

  function resetStarter() {
    const confirmed = window.confirm(
      "Reset this year's code back to the starter? Your current edits will be replaced.",
    );
    if (!confirmed) return;
    setCode(year.starter);
    setTestResults(null);
    saveDraft(year.year, year.starter);
    setPreview(
      composePreview({
        html: year.starter.pages?.[0]?.html ?? year.starter.html,
        css: year.starter.css,
        js: year.starter.js,
      }),
    );
    setPageId(year.starter.pages?.[0]?.id ?? "index");
  }

  return (
    <section
      ref={sandboxRef}
      className={"portal-card flex flex-col"}
      aria-label={"Live code sandbox"}
    >
      <div
        className={
          "flex flex-wrap items-center justify-between gap-3 border-b border-portal-line px-4 py-3"
        }
      >
        <div>
          <span
            className={
              "text-[11px] font-bold uppercase tracking-widest text-teal"
            }
          >
            Live sandbox
          </span>
          <h2 className={"mt-0.5 text-lg font-black text-white"}>
            Build your website
          </h2>
        </div>
        <div className={"flex flex-wrap items-center gap-2"}>
          <button
            type={"button"}
            onClick={() =>
              setPreview(
                composePreview({ html: activeHtml, css: code.css, js: code.js }),
              )
            }
            className={"portal-btn portal-btn-ghost !px-3 !py-2 text-xs"}
          >
            <LuPlay className={"size-4"} />
            Run
          </button>
          <button
            type={"button"}
            onClick={runTests}
            disabled={testing}
            className={"portal-btn portal-btn-primary !px-3 !py-2 text-xs"}
          >
            {testing ? (
              <LuLoaderCircle className={"size-4 animate-spin"} />
            ) : (
              <LuTestTubeDiagonal className={"size-4"} />
            )}
            Test Code
          </button>
          <button
            type={"button"}
            onClick={resetStarter}
            className={"portal-btn portal-btn-ghost !px-3 !py-2 text-xs"}
            aria-label={"Reset code to starter"}
          >
            <LuRotateCcw className={"size-4"} />
          </button>
        </div>
      </div>

      {targetMilestone ? (
        <p
          className={
            "border-b border-portal-line bg-teal/10 px-4 py-2 text-xs font-semibold text-teal-glow"
          }
        >
          Testing against: <strong>{targetMilestone.title}</strong>
        </p>
      ) : (
        <p
          className={
            "border-b border-portal-line bg-portal-ink px-4 py-2 text-xs text-white/50"
          }
        >
          Pick a milestone with “Test in sandbox”, then hit Test Code — the
          checker reads your real code.
        </p>
      )}

      <div className={"grid flex-1 grid-cols-1 lg:grid-cols-2"}>
        {/* Editor pane */}
        <div className={"flex min-h-[420px] flex-col border-b border-portal-line lg:border-b-0 lg:border-r"}>
          {code.pages?.length ? (
            <div
              className={
                "flex flex-wrap gap-1 border-b border-portal-line bg-portal-ink px-2 py-1.5"
              }
              role={"tablist"}
              aria-label={"Website pages"}
            >
              {code.pages.map((page) => (
                <button
                  key={page.id}
                  type={"button"}
                  role={"tab"}
                  aria-selected={page.id === pageId}
                  onClick={() => {
                    setPageId(page.id);
                    setPane("html");
                  }}
                  className={
                    "portal-tab !px-2.5 !py-1 font-code text-[11px]" +
                    (page.id === pageId ? "" : " !border-b-transparent")
                  }
                  style={
                    page.id === pageId
                      ? { borderBottomColor: "#008080", color: "#fff" }
                      : undefined
                  }
                >
                  {page.label}
                </button>
              ))}
            </div>
          ) : null}

          <div
            className={"flex gap-0 border-b border-portal-line bg-portal-ink"}
            role={"tablist"}
            aria-label={"Code panes"}
          >
            {PANES.map((item) => (
              <button
                key={item.id}
                type={"button"}
                role={"tab"}
                aria-selected={pane === item.id}
                onClick={() => setPane(item.id)}
                className={
                  "portal-tab font-code" + (pane === item.id ? "" : " !border-b-transparent")
                }
                style={
                  pane === item.id
                    ? { borderBottomColor: "#008080", color: "#fff" }
                    : undefined
                }
              >
                {item.label}
              </button>
            ))}
          </div>

          <textarea
            ref={textareaRef}
            value={editorValue}
            onChange={(event) => setEditorValue(event.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            aria-label={`${pane.toUpperCase()} editor${code.pages?.length && pane === "html" ? ` — ${pageId}.html` : ""}`}
            className={
              "font-code min-h-[360px] flex-1 resize-y bg-portal-ink p-4 text-[13px] leading-relaxed text-[#e6edf3] outline-none"
            }
          />
        </div>

        {/* Preview pane */}
        <div className={"flex min-h-[420px] flex-col bg-white"}>
          <div
            className={
              "flex items-center gap-2 border-b border-portal-line bg-deep-navy px-3 py-2"
            }
          >
            <span className={"size-2.5 bg-teal"} aria-hidden={"true"} />
            <span
              className={
                "font-code text-[11px] font-bold uppercase tracking-widest text-white/70"
              }
            >
              Live preview
            </span>
          </div>
          <iframe
            title={"Live preview of your website"}
            srcDoc={preview}
            sandbox={"allow-scripts allow-modals"}
            className={"min-h-[380px] flex-1 border-0 bg-white"}
          />
        </div>
      </div>

      {testResults ? (
        <div
          className={
            "border-t border-portal-line px-4 py-4" +
            (testResults.ok ? " bg-teal/10" : " bg-red-500/10")
          }
          role={"status"}
        >
          <p
            className={
              testResults.ok
                ? "flex items-center gap-2 text-sm font-black text-teal-glow"
                : "flex items-center gap-2 text-sm font-black text-red-400"
            }
          >
            {testResults.ok ? (
              <LuCircleCheck className={"size-4"} />
            ) : (
              <LuCircleX className={"size-4"} />
            )}
            {testResults.ok
              ? `All rules passed — ${testResults.milestone.title} complete!`
              : `Almost there — fix these in your code:`}
          </p>
          <ul className={"mt-2 space-y-1.5"}>
            {testResults.lines.map((line, i) => (
              <li
                key={i}
                className={
                  "font-code flex items-start gap-2 text-xs leading-relaxed " +
                  (line.passed ? "text-teal-glow/80" : "text-red-300")
                }
              >
                {line.passed ? (
                  <LuCircleCheck className={"mt-0.5 size-3.5 shrink-0"} />
                ) : (
                  <LuCircleX className={"mt-0.5 size-3.5 shrink-0"} />
                )}
                {line.message}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
