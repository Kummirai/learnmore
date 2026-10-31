/**
 * Sprout Tweens Programming Portal — the 4-Year Evolving Profile curriculum.
 *
 * Students build ONE personal website that grows with them:
 *   Year 1 (age 9)   — HTML foundations + CSS basics ("The Digital Identity")
 *   Year 2 (age 10)  — Grids, flexbox & forms ("The Showcase & Hobby Hub")
 *   Year 3 (age 11)  — JavaScript DOM & logic ("The Interactive Profile")
 *   Year 4 (age 12)  — Multi-page architecture ("The Master Showcase Hub")
 *
 * Nothing is ever discarded — each year's starter code carries the previous
 * year's work forward. Milestones are validated against live sandbox code by
 * declarative regex rules; quizzes are 3-question concept checks.
 */

export type SandboxPane = "html" | "css" | "js";

export type SandboxRule = {
  pane: SandboxPane;
  /** Regex source, matched case-insensitively. */
  pattern: string;
  /** Kid-friendly message shown when the rule fails. */
  message: string;
  /** Minimum matches required (default 1). */
  minMatches?: number;
  /** Year 4 only: restrict the match to one page id (default: all pages). */
  page?: string;
};

export type PortalMilestone = {
  id: string;
  title: string;
  brief: string;
  /** Present = tested in the sandbox. Absent = manual reflective checkbox. */
  rules?: SandboxRule[];
};

export type PortalQuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explain: string;
};

export type PortalQuiz = {
  id: string;
  title: string;
  questions: PortalQuizQuestion[];
};

export type PortalLesson = {
  id: string;
  title: string;
  /** Short study note the student reads before coding the milestone. */
  body: string;
  /** Optional runnable snippet shown in monospace. */
  example?: { lang: string; code: string };
};

export type SandboxPage = { id: string; label: string; html: string };

export type PortalStarter = {
  html: string;
  css: string;
  js: string;
  /** Year 4 multi-page set. When present the sandbox shows page tabs. */
  pages?: SandboxPage[];
};

export type PortalYear = {
  year: 1 | 2 | 3 | 4;
  age: number;
  title: string;
  subtitle: string;
  focus: string;
  profileAddition: string;
  concepts: string[];
  /** Blueprint §5 Smart Saver targets for this age (rand). */
  savingsTarget: { weekly: number; annual: number; cumulative: number };
  /** Curated external resources — the platform hosts no code playground. */
  resources: { label: string; url: string }[];
  lessons: PortalLesson[];
  starter: PortalStarter;
  milestones: PortalMilestone[];
  quiz: PortalQuiz;
};

/* ── Gamification constants (mirrored by the backend) ──────────────────── */

export const MILESTONE_XP = 50;
export const QUIZ_XP_PER_POINT = 25;
export const MASTER_BADGE_XP = 200;
export const QUIZ_PASS_SCORE = 2;
export const QUIZ_TOTAL = 3;
export const LEVEL_XP = 200;
export const TOTAL_MILESTONES = 16;
export const TOTAL_QUIZZES = 4;

export const PORTAL_PATH =
  "/sprout-tweens/skills/sprout_03_programming/learn";
export const PORTAL_SKILL_ID = "sprout_03_programming";
export const MASTER_BADGE_NAME = "Sprout Tweens Master Web Builder Badge";

export type PortalProgress = {
  skillId: string;
  xp: number;
  milestones: string[];
  quizzes: Record<
    string,
    { score: number; total: number; attempts: number; passed: boolean }
  >;
  masterBadgeAwarded: boolean;
  streak: { current: number; longest: number; lastActiveDate: string | null };
};

export function milestoneKey(year: number, id: string) {
  return `${year}:${id}`;
}

export function levelFromXp(xp: number) {
  const safe = Math.max(0, xp);
  const level = Math.floor(safe / LEVEL_XP) + 1;
  const into = safe % LEVEL_XP;
  return {
    level,
    into,
    needed: LEVEL_XP - into,
    pct: Math.round((into / LEVEL_XP) * 100),
  };
}

/* ── Sandbox code composition + validation ─────────────────────────────── */

export type SandboxCode = {
  html: string;
  css: string;
  js: string;
  pages?: SandboxPage[];
};

/** Build the single-document preview the sandbox iframe renders. */
export function composePreview(code: {
  html: string;
  css: string;
  js: string;
}): string {
  const cssBlock = code.css.trim()
    ? `<style>\n${code.css}\n</style>`
    : "";
  const jsBlock = code.js.trim()
    ? `<script>\ntry {\n${code.js}\n} catch (err) {\n  console.error(err);\n}\n</script>`
    : "";
  let html = code.html || "<!DOCTYPE html><html><body></body></html>";
  if (/<\/body>/i.test(html)) {
    html = html.replace(/<\/body>/i, `${cssBlock}\n${jsBlock}\n</body>`);
  } else {
    html = `${html}\n${cssBlock}\n${jsBlock}`;
  }
  return html;
}

function paneSource(pane: SandboxPane, code: SandboxCode): string {
  if (pane === "css") return code.css;
  if (pane === "js") return code.js;
  if (code.pages?.length) return code.pages.map((p) => p.html).join("\n");
  return code.html;
}

function pageSource(page: string | undefined, code: SandboxCode): string {
  if (!page || !code.pages?.length) return paneSource("html", code);
  const found = code.pages.find((p) => p.id === page);
  return found?.html ?? "";
}

export type RuleResult = { rule: SandboxRule; passed: boolean; found: number };

export function validateRules(
  rules: SandboxRule[],
  code: SandboxCode,
): { ok: boolean; results: RuleResult[] } {
  const results: RuleResult[] = rules.map((rule) => {
    let source: string;
    if (rule.pane === "html" && rule.page) source = pageSource(rule.page, code);
    else source = paneSource(rule.pane, code);
    let found = 0;
    try {
      const re = new RegExp(rule.pattern, "gi");
      found = (source.match(re) ?? []).length;
    } catch {
      found = 0;
    }
    const min = rule.minMatches ?? 1;
    return { rule, passed: found >= min, found };
  });
  return { ok: results.every((r) => r.passed), results };
}

/** First incomplete milestone that has testable rules, for "Test Code". */
export function nextTestableMilestone(
  year: PortalYear,
  doneKeys: Set<string>,
): PortalMilestone | undefined {
  return year.milestones.find(
    (m) => m.rules?.length && !doneKeys.has(milestoneKey(year.year, m.id)),
  );
}

/* ── Local draft persistence (browser only) ────────────────────────────── */

const DRAFT_PREFIX = "sprout-programming-portal:v1:";

export function loadDraft(year: PortalYear): PortalStarter {
  if (typeof window === "undefined") return year.starter;
  try {
    const raw = window.localStorage.getItem(DRAFT_PREFIX + year.year);
    if (!raw) return year.starter;
    const saved = JSON.parse(raw) as Partial<PortalStarter>;
    return {
      html: typeof saved.html === "string" ? saved.html : year.starter.html,
      css: typeof saved.css === "string" ? saved.css : year.starter.css,
      js: typeof saved.js === "string" ? saved.js : year.starter.js,
      pages: year.starter.pages
        ? year.starter.pages.map((page) => {
            const savedPage = saved.pages?.find((p) => p.id === page.id);
            return {
              ...page,
              html:
                typeof savedPage?.html === "string"
                  ? savedPage.html
                  : page.html,
            };
          })
        : undefined,
    };
  } catch {
    return year.starter;
  }
}

export function saveDraft(year: number, code: PortalStarter): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(DRAFT_PREFIX + year, JSON.stringify(code));
  } catch {
    /* quota or private mode — drafts are best-effort */
  }
}

/* ── The 4-year curriculum ─────────────────────────────────────────────── */

const YEAR_1_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>My Digital Identity</title>
</head>
<body>

  <!-- MILESTONE 1: top navbar — "Hi, I'm ..." -->
  

  <!-- MILESTONE 2: hero with your photo + welcome greeting -->
  

  <!-- MILESTONE 3: biography — grade, favourite subject, goals -->
  

  <!-- MILESTONE 4: footer with © and the Sprout Club tag -->
  

</body>
</html>`;

const YEAR_1_CSS = `/* Year 1 — colours, fonts, spacing, borders */
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f4f7f6;
  color: #0B2545;
}

/* TODO: style your navbar, hero, bio and footer.
   Try: background-color, color, font-family,
        margin, padding and border. */`;

const YEAR_2_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>The Showcase &amp; Hobby Hub</title>
</head>
<body>

  <header>
    <nav>Hi, I'm a Tween Coder</nav>
  </header>

  <main>
    <h1>Welcome to my Hub!</h1>

    <!-- MILESTONE 1: Hobby & Gallery grid (side-by-side cards) -->
    <section class="gallery">
      
    </section>

    <!-- MILESTONE 2: Likes vs Dislikes comparison -->
    <section class="compare">
      
    </section>

    <!-- MILESTONE 4: Fan Feedback / Contact Me form -->
    <section class="feedback">
      
    </section>
  </main>

  <footer>&copy; 2026 · Sprout Tweens Club</footer>

</body>
</html>`;

const YEAR_2_CSS = `body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f4f7f6;
  color: #0B2545;
}

header {
  background-color: #0B2545;
  color: #ffffff;
  padding: 1rem 1.5rem;
}

.gallery {
  /* MILESTONE 1: turn this into a CSS grid of cards */
}

/* MILESTONE 3: add a :hover effect that makes cards glow teal */`;

const YEAR_3_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>The Interactive Profile</title>
</head>
<body>

  <header>
    <nav>
      Hi, I'm a Tween Coder
      <!-- MILESTONE 1: dark/light toggle button -->
      
    </nav>
  </header>

  <main>
    <h1>My Interactive Profile</h1>

    <!-- MILESTONE 2: click counter / fun facts widget -->
    <section id="fun-facts">
      
    </section>

    <!-- MILESTONE 3: mini calculator (age in days) -->
    <section id="calculator">
      
    </section>

    <!-- MILESTONE 4: personalised welcome banner -->
    <section id="welcome">
      
    </section>
  </main>

  <footer>&copy; 2026 · Sprout Tweens Club</footer>

</body>
</html>`;

const YEAR_3_CSS = `body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f4f7f6;
  color: #0B2545;
  transition: background-color 0.3s, color 0.3s;
}

header {
  background-color: #0B2545;
  color: #ffffff;
  padding: 1rem 1.5rem;
}

/* MILESTONE 1: a .dark theme your toggle can switch on the body */`;

const YEAR_3_JS = `// Year 3 — JavaScript powers everything interactive.

// MILESTONE 1: find your toggle button and swap the theme on click.
//   document.getElementById(...)  +  addEventListener("click", ...)

// MILESTONE 2: click counter — increase a number and show it with
//   innerText (or textContent) every time a button is clicked.

// MILESTONE 3: age-in-days calculator — a function, some maths and an
//   if/else check to keep the answer sensible.

// MILESTONE 4: welcome popup — ask the visitor's name with prompt(...),
//   then write a custom greeting into your banner.`;

const YEAR_4_INDEX = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Home · My Master Hub</title>
</head>
<body>

  <nav class="site-nav">
    <a href="index.html">Home</a>
    <a href="about.html">About</a>
    <a href="projects.html">Projects</a>
    <a href="contact.html">Contact</a>
  </nav>

  <main>
    <h1>Hi, I'm a Tween Web Builder!</h1>
    <p>Welcome to my master showcase hub — four years in the making.</p>
    <!-- Highlight cards linking into your other pages -->
    
  </main>

  <footer>&copy; 2026 · Sprout Tweens Club</footer>

</body>
</html>`;

const YEAR_4_ABOUT = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>About · My Master Hub</title>
</head>
<body>

  <nav class="site-nav">
    <a href="index.html">Home</a>
    <a href="about.html">About</a>
    <a href="projects.html">Projects</a>
    <a href="contact.html">Contact</a>
  </nav>

  <main>
    <h1>About Me</h1>
    <p>My grade, my favourite subject and my goals — the long version.</p>
    <!-- MILESTONE 2: add your grade timeline here -->
    
  </main>

  <footer>&copy; 2026 · Sprout Tweens Club</footer>

</body>
</html>`;

const YEAR_4_PROJECTS = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Projects · My Master Hub</title>
</head>
<body>

  <nav class="site-nav">
    <a href="index.html">Home</a>
    <a href="about.html">About</a>
    <a href="projects.html">Projects</a>
    <a href="contact.html">Contact</a>
  </nav>

  <main>
    <h1>My Project Gallery</h1>
    <p>Every widget from four years, collected in one place.</p>
    <!-- MILESTONE 2: gallery cards for your widgets -->
    
  </main>

  <footer>&copy; 2026 · Sprout Tweens Club</footer>

</body>
</html>`;

const YEAR_4_CONTACT = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Contact · My Master Hub</title>
</head>
<body>

  <nav class="site-nav">
    <a href="index.html">Home</a>
    <a href="about.html">About</a>
    <a href="projects.html">Projects</a>
    <a href="contact.html">Contact</a>
  </nav>

  <main>
    <h1>Fan Feedback</h1>
    <!-- MILESTONE 2: bring back your feedback form -->
    
  </main>

  <footer>&copy; 2026 · Sprout Tweens Club</footer>

</body>
</html>`;

const YEAR_4_CSS = `/* One shared stylesheet — every page links to these rules. */
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f4f7f6;
  color: #0B2545;
}

.site-nav {
  background-color: #0B2545;
  padding: 1rem 1.5rem;
  display: flex;
  gap: 1rem;
}

.site-nav a {
  color: #ffffff;
  text-decoration: none;
}

.site-nav a:hover {
  color: #008080;
}

/* MILESTONE 3: add an @media query so phones get a stacked layout */`;

const YEAR_4_JS = `// Small shared script — keep it light and useful.
document.addEventListener("DOMContentLoaded", function () {
  // TODO: a tiny interactive touch that works on every page.
});`;

export const PORTAL_YEARS: PortalYear[] = [
  {
    year: 1,
    age: 9,
    title: "The Digital Identity",
    subtitle: "HTML Foundations & CSS Basics",
    savingsTarget: { weekly: 16, annual: 800, cumulative: 2050 },
    resources: [
      { label: "MDN — HTML basics", url: "https://developer.mozilla.org/en-US/docs/Learn/HTML" },
      { label: "W3Schools — HTML tutorial", url: "https://www.w3schools.com/html/" },
      { label: "freeCodeCamp — Responsive Web Design", url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/" },
      { label: "Canva Design School", url: "https://www.canva.com/designschool/" },
    ],
    focus:
      "Write your first real web page — structure it with HTML tags and paint it with CSS colours, fonts and spacing.",
    profileAddition:
      "A navy/teal navbar, hero photo + greeting, biography section and Sprout Club footer.",
    concepts: [
      "<!DOCTYPE html>",
      "<html> <head> <body>",
      "<h1>–<h3>",
      "<p>",
      "<header> <nav> <main> <footer>",
      "<img src alt>",
      "background-color",
      "color",
      "font-family",
      "margin & padding",
      "border",
    ],
    lessons: [
      {
        id: "y1-lesson-1",
        title: "The page skeleton every website shares",
        body:
          "Every page starts the same way: <!DOCTYPE html> tells the browser this is modern HTML, <html> wraps everything, <head> holds settings like the page title, and <body> holds what people actually see.",
        example: {
          lang: "html",
          code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>My page</title>
  </head>
  <body>
    <!-- everything visitors see lives here -->
  </body>
</html>`,
        },
      },
      {
        id: "y1-lesson-2",
        title: "Headings, paragraphs & pictures",
        body:
          "<h1> is your biggest heading (use one per page), then <h2>, <h3>. <p> holds sentences. <img> needs two important attributes: src (the picture file) and alt (words describing it for screen readers and broken links).",
        example: {
          lang: "html",
          code: `<h1>Hi, I'm Themba!</h1>
<h2>About me</h2>
<p>I'm 9 and I love chess.</p>
<img src="me.jpg" alt="Smiling boy in a green shirt" />`,
        },
      },
      {
        id: "y1-lesson-3",
        title: "Sections that mean something",
        body:
          "<header> tops the page, <nav> holds your links, <main> wraps your unique content, and <footer> closes the page. Browsers and search engines understand these tags — they're better than plain <div>s.",
        example: {
          lang: "html",
          code: `<header>
  <nav>Hi, I'm Themba</nav>
</header>
<main> ... your story ... </main>
<footer>&copy; 2026 · Sprout Club</footer>`,
        },
      },
      {
        id: "y1-lesson-4",
        title: "Paint it with CSS",
        body:
          "CSS rules have a selector and braces: body { background-color: #0B2545; }. Try background-color, color (text), font-family, padding (space inside a box), margin (space outside) and border (a sharp outline).",
        example: {
          lang: "css",
          code: `body {
  background-color: #f4f7f6;
  color: #0B2545;
  font-family: Arial, sans-serif;
}
header {
  background-color: #0B2545;
  color: #ffffff;
  padding: 16px;
  border: 2px solid #008080;
}`,
        },
      },
    ],
    starter: {
      html: YEAR_1_HTML,
      css: YEAR_1_CSS,
      js: "",
    },
    milestones: [
      {
        id: "navbar",
        title: "Build the top navbar",
        brief:
          'Add a <header> with a <nav> that greets the world: "Hi, I\'m [Your Name]".',
        rules: [
          { pane: "html", pattern: "<header", message: "Add a <header> element to wrap the top of your page." },
          { pane: "html", pattern: "<nav", message: "Put your greeting inside a <nav> element." },
          { pane: "html", pattern: "Hi,?\\s+I'm", message: 'Your navbar needs the greeting text "Hi, I\'m ...".' },
        ],
      },
      {
        id: "hero",
        title: "Add the hero photo & greeting",
        brief:
          "A big <h1> welcome plus a profile <img> with helpful alt text.",
        rules: [
          { pane: "html", pattern: "<h1", message: "Add a big <h1> welcome heading in your hero." },
          { pane: "html", pattern: "<img[^>]+src", message: "Add an <img> with a src= for your profile photo." },
          { pane: "html", pattern: "<img[^>]+alt=", message: "Always describe your image with an alt= attribute." },
        ],
      },
      {
        id: "bio",
        title: "Write your biography",
        brief:
          "Use a <main> section with headings and paragraphs for grade, favourite subject and goals.",
        rules: [
          { pane: "html", pattern: "<main", message: "Wrap your main content in a <main> element." },
          { pane: "html", pattern: "<h2", message: "Add an <h2> subheading for your biography." },
          { pane: "html", pattern: "<p", minMatches: 2, message: "Write at least two <p> paragraphs about yourself." },
        ],
      },
      {
        id: "footer",
        title: "Finish the footer bar",
        brief:
          "Close the page with a <footer> holding the © line and the Sprout Club tag.",
        rules: [
          { pane: "html", pattern: "<footer", message: "Add a <footer> element at the bottom of your page." },
          { pane: "html", pattern: "(&copy;|©|copyright)", message: "Include a © (copyright) line in your footer." },
          { pane: "html", pattern: "sprout", message: "Tag your footer with the Sprout Club name." },
        ],
      },
    ],
    quiz: {
      id: "year-1",
      title: "Year 1 Concept Check",
      questions: [
        {
          id: "y1q1",
          prompt: "Which tag makes the biggest heading on a page?",
          options: ["<h6>", "<h1>", "<head>", "<p>"],
          correctIndex: 1,
          explain: "<h1> is the biggest heading. <head> holds page settings, not headings.",
        },
        {
          id: "y1q2",
          prompt: "Why do we add alt text to an <img>?",
          options: [
            "To make the image bigger",
            "To change the image colours",
            "To describe the image for screen readers and broken links",
            "alt text is not needed",
          ],
          correctIndex: 2,
          explain:
            "alt text describes the picture for people using screen readers — and shows if the image fails to load.",
        },
        {
          id: "y1q3",
          prompt: "Where do you write CSS rules like background-color?",
          options: [
            "Inside <h1> tags",
            "In a <style> block or stylesheet, inside CSS rules like body { }",
            "Only on the server",
            "In the <img> tag",
          ],
          correctIndex: 1,
          explain:
            "CSS lives in <style> blocks (or .css files) as selector rules such as body { background-color: ... }.",
        },
      ],
    },
  },
  {
    year: 2,
    age: 10,
    title: "The Showcase & Hobby Hub",
    subtitle: "Layouts, Grids & Forms",
    savingsTarget: { weekly: 20, annual: 1000, cumulative: 3050 },
    resources: [
      { label: "MDN — CSS layout", url: "https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout" },
      { label: "CSS-Tricks — Complete Guide to Grid", url: "https://css-tricks.com/snippets/css/complete-guide-grid/" },
      { label: "W3Schools — CSS tutorial", url: "https://www.w3schools.com/css/" },
      { label: "Google Sheets — formulas", url: "https://support.google.com/docs/answer/46973" },
    ],
    focus:
      "Level up your profile with side-by-side grids, hover effects and a real feedback form your visitors can fill in.",
    profileAddition:
      "A hobby gallery grid, likes-vs-dislikes cards and a Fan Feedback contact form.",
    concepts: [
      "<ul> <ol> <li>",
      "<div>",
      "display: flex",
      "display: grid",
      "grid-template-columns",
      ":hover",
      "<form> <label>",
      "<input type='text'>",
      "<textarea>",
      "<button type='submit'>",
    ],
    lessons: [
      {
        id: "y2-lesson-1",
        title: "Lists keep things tidy",
        body:
          "<ul> makes bullet points, <ol> numbers them. Every item sits in an <li>. Use them for likes, dislikes, hobbies — anything that is a set of things.",
        example: {
          lang: "html",
          code: `<ul>
  <li>Chess club</li>
  <li>Drawing</li>
  <li>Football</li>
</ul>`,
        },
      },
      {
        id: "y2-lesson-2",
        title: "Rows with flexbox, grids with grid",
        body:
          "display: flex lines children up in one row. display: grid + grid-template-columns makes real columns that wrap — perfect for a gallery of hobby cards. Change the number to change the columns!",
        example: {
          lang: "css",
          code: `.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.card {
  display: flex;
  flex-direction: column;
  padding: 12px;
}`,
        },
      },
      {
        id: "y2-lesson-3",
        title: "Hover makes it feel alive",
        body:
          "The :hover selector applies styles only while the mouse is over an element. Add a teal border or glow so your cards respond to visitors — tiny touches make a site feel real.",
        example: {
          lang: "css",
          code: `.card {
  border: 2px solid #30363d;
}
.card:hover {
  border-color: #008080;
  box-shadow: 0 0 12px rgba(0, 128, 128, 0.5);
}`,
        },
      },
      {
        id: "y2-lesson-4",
        title: "Forms that listen",
        body:
          "A form has <label> words telling visitors what to type, an <input> for short answers, a <textarea> for long ones, and <button type=\"submit\"> to send it. Always label your inputs — that's good accessibility.",
        example: {
          lang: "html",
          code: `<form>
  <label for="name">Your name</label>
  <input type="text" id="name" />

  <label for="msg">Message</label>
  <textarea id="msg"></textarea>

  <button type="submit">Send feedback</button>
</form>`,
        },
      },
    ],
    starter: {
      html: YEAR_2_HTML,
      css: YEAR_2_CSS,
      js: "",
    },
    milestones: [
      {
        id: "gallery-grid",
        title: "Build the hobby gallery grid",
        brief:
          "Turn your .gallery into a CSS grid of sharp-edged cards for sports, games, art or books.",
        rules: [
          { pane: "css", pattern: "display:\\s*grid", message: "Set display: grid on your gallery container." },
          { pane: "css", pattern: "grid-template-columns", message: "Choose columns with grid-template-columns." },
          { pane: "html", pattern: "<div", minMatches: 2, message: "Add at least two <div> cards inside your gallery." },
        ],
      },
      {
        id: "likes-dislikes",
        title: "Add Likes vs Dislikes cards",
        brief:
          "Use lists (<ul>/<li>) inside two comparison cards so visitors can see what you love and loathe.",
        rules: [
          { pane: "html", pattern: "likes", message: "Create a Likes card with the word 'Likes'." },
          { pane: "html", pattern: "dislikes", message: "Create a Dislikes card with the word 'Dislikes'." },
          { pane: "html", pattern: "<li", minMatches: 2, message: "List at least two items with <li> tags." },
        ],
      },
      {
        id: "hover-cards",
        title: "Make cards glow on hover",
        brief:
          "Add a :hover rule so cards light up in teal when the mouse moves over them.",
        rules: [
          { pane: "css", pattern: ":hover", message: "Add a :hover selector to your cards in CSS." },
        ],
      },
      {
        id: "feedback-form",
        title: "Create the Fan Feedback form",
        brief:
          "A <form> with a label, a text input, a <textarea> and a submit button.",
        rules: [
          { pane: "html", pattern: "<form", message: "Wrap your form in a <form> element." },
          { pane: "html", pattern: "<label", message: "Every input needs a <label>." },
          { pane: "html", pattern: "type=[\"']?text", message: "Add a text input: <input type=\"text\">." },
          { pane: "html", pattern: "<textarea", message: "Add a <textarea> for longer messages." },
          { pane: "html", pattern: "<button[^>]*type=[\"']?submit|<input[^>]+type=[\"']?submit", message: "Finish with a submit button." },
        ],
      },
    ],
    quiz: {
      id: "year-2",
      title: "Year 2 Concept Check",
      questions: [
        {
          id: "y2q1",
          prompt: "Which property turns a <div> into a grid container?",
          options: ["display: flex", "display: grid", "grid-line: on", "position: grid"],
          correctIndex: 1,
          explain:
            "display: grid makes the element a grid container. display: flex is the one-row flexbox layout.",
        },
        {
          id: "y2q2",
          prompt: "What does the :hover selector do?",
          options: [
            "Styles an element when the mouse is over it",
            "Deletes an element",
            "Loads a new page",
            "Styles an element only on Mondays",
          ],
          correctIndex: 0,
          explain: ":hover applies styles while the visitor's mouse is over the element.",
        },
        {
          id: "y2q3",
          prompt: "Which tag lets a visitor type a long message in a form?",
          options: ["<img>", "<textarea>", "<nav>", "<li>"],
          correctIndex: 1,
          explain: "<textarea> is the multi-line text box. <input type=\"text\"> is for short answers.",
        },
      ],
    },
  },
  {
    year: 3,
    age: 11,
    title: "The Interactive Profile",
    subtitle: "JavaScript DOM & Logic",
    savingsTarget: { weekly: 25, annual: 1250, cumulative: 4300 },
    resources: [
      { label: "MDN — JavaScript first steps", url: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps" },
      { label: "javascript.info", url: "https://javascript.info/" },
      { label: "freeCodeCamp — JavaScript Algorithms", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/" },
      { label: "Kevin Stratvert — Sheets tutorials", url: "https://www.youtube.com/@KevinStratvert" },
    ],
    focus:
      "Make your profile react — a theme toggle, a click counter, a mini calculator and a personalised welcome popup, all written in JavaScript.",
    profileAddition:
      "Dark/light mode toggle, fun-facts counter, age-in-days calculator and a visitor welcome popup.",
    concepts: [
      "let & const",
      "data types",
      "functions",
      "document.getElementById()",
      ".innerText",
      ".style",
      "onclick",
      "addEventListener('click')",
      "if / else",
    ],
    lessons: [
      {
        id: "y3-lesson-1",
        title: "Variables: boxes that hold values",
        body:
          "let makes a value that can change (a score, a counter). const makes one that never changes (your name, a colour). Text is a string in quotes, numbers are plain, true/false are booleans.",
        example: {
          lang: "js",
          code: `let clicks = 0;          // number — will change
const player = "Themba"; // string — never reassigned
const isMember = true;   // boolean`,
        },
      },
      {
        id: "y3-lesson-2",
        title: "Find and change the page (the DOM)",
        body:
          "Your script can reach into the page: document.getElementById('counter') grabs an element by its id. Then read or write it with .innerText (its text) or .style (its colours).",
        example: {
          lang: "js",
          code: `const banner = document.getElementById("welcome");
banner.innerText = "Welcome, friend!";
banner.style.color = "#008080";`,
        },
      },
      {
        id: "y3-lesson-3",
        title: "React to clicks with events",
        body:
          "addEventListener('click', myFunction) waits for a click, then runs your function. Put the element first, then the event name, then what should happen. This powers toggles, counters and popups.",
        example: {
          lang: "js",
          code: `let clicks = 0;
const btn = document.getElementById("count-btn");
const out = document.getElementById("counter");

btn.addEventListener("click", function () {
  clicks = clicks + 1;
  out.innerText = clicks;
});`,
        },
      },
      {
        id: "y3-lesson-4",
        title: "Decide with if/else, reuse with functions",
        body:
          "if runs code only when a condition is true; else handles the other case. Wrapping logic in a function means you can run it again and again — like an age-in-days calculator.",
        example: {
          lang: "js",
          code: `function toDays(years) {
  if (years < 0 || years > 120) {
    return "That age doesn't look right!";
  }
  return years * 365 + " days old";
}
toDays(10); // "3650 days old"`,
        },
      },
    ],
    starter: {
      html: YEAR_3_HTML,
      css: YEAR_3_CSS,
      js: YEAR_3_JS,
    },
    milestones: [
      {
        id: "theme-toggle",
        title: "Add the dark/light mode toggle",
        brief:
          "A button wired with JavaScript that swaps your whole profile's theme.",
        rules: [
          { pane: "html", pattern: "id=[\"']theme-toggle", message: 'Give your toggle button id="theme-toggle".' },
          { pane: "js", pattern: "getElementById", message: "Find the button with document.getElementById()." },
          { pane: "js", pattern: "(addEventListener|onclick)", message: "Run code when the button is clicked." },
          { pane: "js", pattern: "(classList|style)", message: "Change the theme with classList or .style." },
        ],
      },
      {
        id: "click-counter",
        title: "Build the click counter widget",
        brief: "Every click bumps a number you show with innerText.",
        rules: [
          { pane: "html", pattern: "id=[\"']counter", message: 'Add an element with id="counter" to show the number.' },
          { pane: "js", pattern: "(addEventListener\\([\"']click|onclick)", message: "Listen for clicks on your button." },
          { pane: "js", pattern: "(innerText|textContent)", message: "Update the screen with innerText or textContent." },
        ],
      },
      {
        id: "age-calculator",
        title: "Create the age-in-days calculator",
        brief:
          "A function with maths and an if/else check that turns an age in years into days.",
        rules: [
          { pane: "js", pattern: "function", message: "Wrap your logic in a function." },
          { pane: "js", pattern: "getElementById", message: "Read the visitor's age from an input with getElementById()." },
          { pane: "js", pattern: "if\\s*\\(", message: "Check the answer with an if (or if/else)." },
          { pane: "js", pattern: "[-+*/]", message: "Do some maths (* 365 is a good start!) to convert years to days." },
        ],
      },
      {
        id: "welcome-popup",
        title: "Craft the welcome popup",
        brief:
          "Ask the visitor's name with prompt(), then write a custom greeting into your banner.",
        rules: [
          { pane: "js", pattern: "prompt\\s*\\(", message: "Ask for the visitor's name with prompt()." },
          { pane: "js", pattern: "getElementById", message: "Grab your welcome banner with getElementById()." },
          { pane: "js", pattern: "(innerText|textContent)", message: "Write the greeting with innerText or textContent." },
        ],
      },
    ],
    quiz: {
      id: "year-3",
      title: "Year 3 Concept Check",
      questions: [
        {
          id: "y3q1",
          prompt: "Which method finds an element by its id?",
          options: [
            "document.querySelector()",
            "document.getElementById()",
            "document.findId()",
            "window.getElement()",
          ],
          correctIndex: 1,
          explain:
            "document.getElementById('counter') returns the element with that id so you can change it.",
        },
        {
          id: "y3q2",
          prompt: "What does addEventListener('click', ...) do?",
          options: [
            "Deletes the element when clicked",
            "Reloads the page",
            "Runs your function when the element is clicked",
            "Styles the element in teal",
          ],
          correctIndex: 2,
          explain:
            "It attaches a click handler — your function runs every time the visitor clicks that element.",
        },
        {
          id: "y3q3",
          prompt: "Which keyword creates a value that CAN change later?",
          options: ["const", "let", "static", "final"],
          correctIndex: 1,
          explain:
            "let is for values that change (like a counter). const is for values that never get reassigned.",
        },
      ],
    },
  },
  {
    year: 4,
    age: 12,
    title: "The Master Showcase Hub",
    subtitle: "Multi-Page Architecture & Publishing",
    savingsTarget: { weekly: 30, annual: 1500, cumulative: 5800 },
    resources: [
      { label: "MDN — Learn web development", url: "https://developer.mozilla.org/en-US/docs/Learn" },
      { label: "web.dev — Learn Design", url: "https://web.dev/learn/design" },
      { label: "GitHub Pages — publishing", url: "https://docs.github.com/en/pages" },
      { label: "Affinity — beginner tutorials", url: "https://affinity.serif.com/en-us/learn/" },
    ],
    focus:
      "Grow your profile into a real 4-page website, make it work on phones with media queries, then officially publish it for your Master badge.",
    profileAddition:
      "index, about, projects and contact pages — a connected multi-page site with one shared stylesheet.",
    concepts: [
      "<a href='...'>",
      "multi-page file structure",
      "@media queries",
      "external stylesheets",
      "code refactoring",
      "publishing",
    ],
    lessons: [
      {
        id: "y4-lesson-1",
        title: "One site, four files",
        body:
          "Split your hub into index.html (home), about.html, projects.html and contact.html. <a href=\"about.html\"> sends visitors there. The browser loads each file — they're separate pages, one website.",
        example: {
          lang: "html",
          code: `<nav class="site-nav">
  <a href="index.html">Home</a>
  <a href="about.html">About</a>
  <a href="projects.html">Projects</a>
  <a href="contact.html">Contact</a>
</nav>`,
        },
      },
      {
        id: "y4-lesson-2",
        title: "Refactor: one stylesheet for all pages",
        body:
          "Refactoring means improving code without changing what it does. Put every shared rule in styles.css and each page links it with <link rel=\"stylesheet\" href=\"styles.css\">. Change it once — all four pages update.",
        example: {
          lang: "html",
          code: `<head>
  <meta charset="UTF-8" />
  <title>Home · My Master Hub</title>
  <link rel="stylesheet" href="styles.css" />
</head>`,
        },
      },
      {
        id: "y4-lesson-3",
        title: "Responsive: phones get their own layout",
        body:
          "@media queries apply CSS only on certain screens. max-width means 'smaller than' — stack your navigation vertically under 600px so phones get a layout that fits.",
        example: {
          lang: "css",
          code: `.site-nav {
  display: flex;
  gap: 16px;
}
@media (max-width: 600px) {
  .site-nav {
    flex-direction: column;
    gap: 8px;
  }
}`,
        },
      },
      {
        id: "y4-lesson-4",
        title: "Publish: your ship-it checklist",
        body:
          "Before submitting: every page has an <h1> and real content, all links work, your @media query is in, and the design looks right in the preview at phone width. Then claim the Master Web Builder Badge.",
      },
    ],
    starter: {
      html: YEAR_4_INDEX,
      css: YEAR_4_CSS,
      js: YEAR_4_JS,
      pages: [
        { id: "index", label: "index.html", html: YEAR_4_INDEX },
        { id: "about", label: "about.html", html: YEAR_4_ABOUT },
        { id: "projects", label: "projects.html", html: YEAR_4_PROJECTS },
        { id: "contact", label: "contact.html", html: YEAR_4_CONTACT },
      ],
    },
    milestones: [
      {
        id: "hyperlinks",
        title: "Link your pages with hyperlinks",
        brief:
          "Use <a href=\"...\"> so visitors can travel between every page of your hub.",
        rules: [
          { pane: "html", pattern: "<a\\s+[^>]*href", minMatches: 3, message: "Add at least three <a href=\"...\"> links across your pages." },
          { pane: "html", pattern: "href=[\"']?about\\.html", message: "Include a link to about.html." },
          { pane: "html", pattern: "href=[\"']?projects\\.html", message: "Include a link to projects.html." },
          { pane: "html", pattern: "href=[\"']?contact\\.html", message: "Include a link to contact.html." },
        ],
      },
      {
        id: "four-pages",
        title: "Fill out all four pages",
        brief:
          "Give index, about, projects and contact real headings and content — no empty rooms.",
        rules: [
          { pane: "html", page: "index", pattern: "<h1", message: "index.html needs a <h1> heading." },
          { pane: "html", page: "about", pattern: "<h1", message: "about.html needs a <h1> heading." },
          { pane: "html", page: "projects", pattern: "<h1", message: "projects.html needs a <h1> heading." },
          { pane: "html", page: "contact", pattern: "<h1", message: "contact.html needs a <h1> heading." },
          { pane: "html", page: "about", pattern: "<p", message: "Tell your story on about.html with a <p>." },
        ],
      },
      {
        id: "responsive",
        title: "Make it phone-friendly",
        brief:
          "Add an @media query so your layout adapts on small screens.",
        rules: [
          { pane: "css", pattern: "@media", message: "Add an @media query to your shared stylesheet." },
          { pane: "css", pattern: "@media[^{]*\\(\\s*max-width", message: "Use a max-width condition so phones get the new layout." },
        ],
      },
      {
        id: "publish",
        title: "Polish & publish your hub",
        brief:
          "Check every page, tidy your code, then claim your Master Web Builder Badge below.",
      },
    ],
    quiz: {
      id: "year-4",
      title: "Year 4 Concept Check",
      questions: [
        {
          id: "y4q1",
          prompt: "Which attribute makes a link open another page?",
          options: ["src", "link", "href", "to"],
          correctIndex: 2,
          explain: "<a href=\"about.html\">About</a> sends visitors to about.html.",
        },
        {
          id: "y4q2",
          prompt: "What does an @media query let your site do?",
          options: [
            "Play music",
            "Change the layout for different screen sizes",
            "Send emails",
            "Delete old pages",
          ],
          correctIndex: 1,
          explain:
            "@media (max-width: ...) applies styles only on smaller screens — that's responsive design.",
        },
        {
          id: "y4q3",
          prompt: "Why share ONE stylesheet across all four pages?",
          options: [
            "It makes the internet faster",
            "It makes files bigger",
            "One shared file keeps colours and fonts consistent everywhere",
            "Browsers cannot read more than one file",
          ],
          correctIndex: 2,
          explain:
            "A shared stylesheet means one edit updates every page — the heart of refactoring.",
        },
      ],
    },
  },
];

export function getPortalYear(year: number): PortalYear | undefined {
  return PORTAL_YEARS.find((y) => y.year === year);
}

/** Milestone keys + quiz pass state → what still blocks the Master badge. */
export function masterBadgeGaps(progress: PortalProgress | null): string[] {
  const gaps: string[] = [];
  if (!progress) {
    gaps.push("Sign in and save your progress.");
    return gaps;
  }
  const done = new Set(progress.milestones);
  if (done.size < TOTAL_MILESTONES) {
    gaps.push(
      `${TOTAL_MILESTONES - done.size} milestone${TOTAL_MILESTONES - done.size === 1 ? "" : "s"} still to complete.`,
    );
  }
  const failed = PORTAL_YEARS.filter(
    (y) => !progress.quizzes[y.quiz.id]?.passed,
  );
  if (failed.length) {
    gaps.push(
      `Pass the concept check for Year ${failed.map((y) => y.year).join(", Year ")}.`,
    );
  }
  return gaps;
}
