// Analytics. Runs once in the browser, before the app becomes interactive.
// PostHog itself loads later, when the browser is idle, so it never delays the page.
// The listeners below are cheap: they turn the clicks that matter into named events.
import { analyticsOn, loadAnalytics, track } from "@/lib/analytics";

let path = location.pathname;
let depth = 0; // deepest quarter reached on the current case study
let played = false; // first interaction with the current Playground piece

const isCaseStudy = (p: string) => /^\/(work|systems)\/[^/]+/.test(p);
const slugOf = (p: string) => p.split("/").filter(Boolean)[1];

function onPage(p: string) {
  path = p;
  depth = 0;
  played = false;
  if (/^\/playground\/[^/]+/.test(p)) track("playground_open", { piece: slugOf(p) });
}

if (analyticsOn) {
  try {
    onPage(path);

    const idle = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 2000));
    idle(() => void loadAnalytics(), { timeout: 4000 });

    // Links and buttons that matter. Captured on the way down, so it still fires when a link navigates away.
    document.addEventListener("click", (e) => {
      const el = e.target instanceof Element ? e.target : null;
      if (!el) return;
      const where = el.closest("section[id], header, footer, [role=dialog]");
      const from = where?.id || where?.getAttribute("aria-label") || where?.tagName.toLowerCase() || "page";

      const named = el.closest<HTMLElement>("[data-track]");
      if (named) track(named.dataset.track!, { from });

      const a = el.closest("a");
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      if (/resume.*\.pdf/.test(href)) track("resume_download", { from });
      else if (href.startsWith("mailto:")) track("email_click", { from });
      else if (href.includes("calendly.com")) track("book_call_click", { from });
      else if (href.includes("linkedin.com")) track("linkedin_click", { from });
      else if (href.includes("github.com")) track("github_click", { from });
      else if (/^https?:/.test(href) && new URL(href).host !== location.host) track("outbound_click", { url: href, host: new URL(href).host, from });
    }, { capture: true });

    // Films with controls (the launch and system films), not the silent previews on the tiles.
    document.addEventListener("play", (e) => {
      const v = e.target;
      if (v instanceof HTMLVideoElement && v.controls) track("film_play", { film: v.getAttribute("src"), page: path });
    }, { capture: true });

    // How far people read each case study, in quarters.
    addEventListener("scroll", () => {
      if (!isCaseStudy(path)) return;
      const max = document.documentElement.scrollHeight - innerHeight;
      if (max <= 0) return;
      const q = Math.min(4, Math.floor(((scrollY / max) * 100 + 1) / 25));
      if (q > depth) {
        for (let d = depth + 1; d <= q; d++) track("case_study_read", { slug: slugOf(path), depth: d * 25 });
        depth = q;
      }
    }, { passive: true });

    // First touch on a Playground piece.
    document.addEventListener("pointerdown", (e) => {
      if (played || !(e.target instanceof Element) || !e.target.closest(".lab-stage")) return;
      played = true;
      track("playground_interact", { piece: slugOf(path) });
    }, { capture: true, passive: true });
  } catch {}
}

export function onRouterTransitionStart(url: string) {
  if (!analyticsOn) return;
  try {
    const p = new URL(url, location.href).pathname;
    if (p !== path) onPage(p);
  } catch {}
}
