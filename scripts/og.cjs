// Renders the link preview image (public/og.png): node scripts/og.cjs
const path = require("node:path");
const { chromium } = require(path.join(process.env.HOME, "Desktop/treeti/node_modules/playwright"));
const site = require("../content/site.json");

const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400;500&family=Geist+Mono&display=swap" rel="stylesheet">
<style>
  body{margin:0;width:1200px;height:630px;background:#0f0f0e;color:#edece8;font-family:"Schibsted Grotesk",sans-serif;display:flex;flex-direction:column;justify-content:space-between;padding:72px 80px;box-sizing:border-box;position:relative;overflow:hidden}
  .pill{display:inline-flex;align-items:center;gap:12px;height:44px;padding:0 20px;border-radius:999px;background:#181816;border:1px solid #262624;font-size:22px;width:fit-content}
  .dot{width:12px;height:12px;border-radius:50%;background:#6fcf97}
  h1{font-weight:500;font-size:76px;line-height:1.05;letter-spacing:-.03em;margin:0;max-width:960px}
  h1 span{color:#a09e98}
  .foot{display:flex;justify-content:space-between;align-items:flex-end;font-family:"Geist Mono",monospace;font-size:22px;color:#a09e98}
  .foot b{color:#edece8;font-weight:400}
</style></head><body>
  <span class="pill"><span class="dot"></span>Open to work</span>
  <h1>${site.name} <span>· ${site.role}.</span><br>I design, build and launch products I'd want to use.</h1>
  <div class="foot"><span><b>muwaffaq.pages.dev</b></span><span>${site.location} · GMT+1</span></div>
</body></html>`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(__dirname, "../public/og.png") });
  await browser.close();
  console.log("public/og.png");
})();
