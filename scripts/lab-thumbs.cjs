// Makes the Playground previews: each experiment is captured on its own, then composed
// for the 4:3 card it appears in, and saved as a small WebP.
//   phone:   the screen rises from the bottom edge, large enough to read
//   browser: the window fills the width and is cropped at the bottom
//   stage:   the piece sits centred with room around it
// Usage: node scripts/lab-thumbs.cjs [slug ...]   (needs `npm run dev` on :3000; Playwright from ~/Desktop/treeti)
const path = require("node:path");
const fs = require("node:fs");
const { chromium } = require(path.join(process.env.HOME, "Desktop/treeti/node_modules/playwright"));

const base = process.env.BASE || "http://localhost:3000";
const out = path.join(__dirname, "../public/playground/lab");
const src = fs.readFileSync(path.join(__dirname, "../lib/lab.ts"), "utf8");
const all = [...src.matchAll(/slug: "([^"]+)"[^\n]*?frame: "(phone|browser|stage)"/g)].map((m) => ({ slug: m[1], frame: m[2] }));
const only = process.argv.slice(2);
const pieces = only.length ? all.filter((p) => only.includes(p.slug)) : all;

const W = 960, H = 720; // shown at about 360px wide, so this is sharp on 2x screens

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 1100 }, deviceScaleFactor: 2, colorScheme: "light" });
  const page = await ctx.newPage();
  const composer = await ctx.newPage();
  const report = [];

  for (const { slug, frame } of pieces) {
    const errors = [];
    const onErr = (e) => errors.push(String(e.message || e).slice(0, 160));
    page.on("pageerror", onErr);
    const res = await page.goto(`${base}/playground/${slug}/`, { waitUntil: "networkidle" });
    // Hide the dev badge and make everything around the piece transparent, so only the piece is captured.
    await page.addStyleTag({ content: "nextjs-portal{display:none!important} html,body,.wrap,main,.lab-stage{background:transparent!important;box-shadow:none!important;border-color:transparent!important} .lab-stage::after{display:none!important} .lab-phone,.lab-browser{box-shadow:none!important}" });
    await page.waitForTimeout(1600);
    const el = page.locator(".lab-stage > *").first();
    const shot = await el.screenshot({ omitBackground: true, animations: "disabled" });
    page.off("pageerror", onErr);

    const dataUrl = "data:image/png;base64," + shot.toString("base64");
    const webp = await composer.evaluate(async ({ dataUrl, frame, W, H }) => {
      const img = new Image();
      img.src = dataUrl;
      await img.decode();
      const c = document.createElement("canvas");
      c.width = W; c.height = H;
      const g = c.getContext("2d");
      // The design canvas: warm light grey with a faint dot grid, as on the experiment pages.
      g.fillStyle = "#f3f3f1"; g.fillRect(0, 0, W, H);
      g.fillStyle = "#deded9";
      for (let y = 9; y < H; y += 18) for (let x = 9; x < W; x += 18) { g.beginPath(); g.arc(x, y, 1, 0, Math.PI * 2); g.fill(); }
      let w, h, x, y;
      if (frame === "phone") { w = 500; h = (img.height / img.width) * w; x = (W - w) / 2; y = 64; }
      else if (frame === "browser") { w = 832; h = (img.height / img.width) * w; x = (W - w) / 2; y = 72; }
      else { const s = Math.min(800 / img.width, 600 / img.height); w = img.width * s; h = img.height * s; x = (W - w) / 2; y = (H - h) / 2; }
      // A soft floor shadow under the piece.
      g.save();
      g.shadowColor = "rgba(0,0,0,.16)"; g.shadowBlur = 48; g.shadowOffsetY = 18;
      g.drawImage(img, x, y, w, h);
      g.restore();
      return c.toDataURL("image/webp", 0.84);
    }, { dataUrl, frame, W, H });

    fs.writeFileSync(path.join(out, `${slug}.webp`), Buffer.from(webp.split(",")[1], "base64"));
    const old = path.join(out, `${slug}.jpg`);
    if (fs.existsSync(old)) fs.rmSync(old);
    const kb = Math.round(fs.statSync(path.join(out, `${slug}.webp`)).size / 1024);
    report.push(`${res.status()} ${slug} (${frame}, ${kb} KB)${errors.length ? "  ERRORS: " + errors.join(" | ") : ""}`);
  }
  await browser.close();
  console.log(report.join("\n"));
})().catch((e) => { console.error(e); process.exit(1); });
