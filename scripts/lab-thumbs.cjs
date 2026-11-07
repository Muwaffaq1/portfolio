// Captures each Playground experiment as a thumbnail and reports page errors.
// Usage: node scripts/lab-thumbs.cjs [slug ...]   (needs `npm run dev` on :3000; Playwright from ~/Desktop/treeti)
const path = require("node:path");
const fs = require("node:fs");
const { execFileSync } = require("node:child_process");
const { chromium } = require(path.join(process.env.HOME, "Desktop/treeti/node_modules/playwright"));

const base = process.env.BASE || "http://localhost:3000";
const out = path.join(__dirname, "../public/playground/lab");
const src = fs.readFileSync(path.join(__dirname, "../lib/lab.ts"), "utf8");
const all = [...src.matchAll(/slug: "([^"]+)"/g)].map((m) => m[1]);
const only = process.argv.slice(2);
const slugs = only.length ? all.filter((s) => only.includes(s)) : all;

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 1000 }, deviceScaleFactor: 2, colorScheme: "dark" });
  const page = await ctx.newPage();
  const report = [];
  for (const slug of slugs) {
    const errors = [];
    const onErr = (e) => errors.push(String(e.message || e).slice(0, 160));
    const onCon = (m) => { if (m.type() === "error") errors.push(m.text().slice(0, 160)); };
    page.on("pageerror", onErr);
    page.on("console", onCon);
    const res = await page.goto(`${base}/playground/${slug}/`, { waitUntil: "networkidle" });
    await page.addStyleTag({ content: "nextjs-portal{display:none!important}" }).catch(() => {});
    await page.waitForTimeout(1600);
    const stage = page.locator(".lab-stage");
    const png = path.join(out, `${slug}.png`);
    if (await stage.count()) await stage.screenshot({ path: png });
    const jpg = path.join(out, `${slug}.jpg`);
    if (fs.existsSync(png)) {
      execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", png, "-vf", "scale=900:-2:flags=lanczos", "-q:v", "3", jpg]);
      fs.rmSync(png);
    }
    page.off("pageerror", onErr);
    page.off("console", onCon);
    report.push(`${res.status()} ${slug}${errors.length ? "  ERRORS: " + errors.join(" | ") : ""}`);
  }
  await browser.close();
  console.log(report.join("\n"));
})().catch((e) => { console.error(e); process.exit(1); });
