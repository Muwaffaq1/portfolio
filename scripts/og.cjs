// Renders the link preview image (public/og.png): node scripts/og.cjs
const path = require("node:path");
const { chromium } = require(path.join(process.env.HOME, "Desktop/treeti/node_modules/playwright"));
const site = require("../content/site.json");

const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400;500&family=Geist+Mono&display=swap" rel="stylesheet">
<style>
  body{margin:0;width:1200px;height:630px;background:#0f0f0e;color:#edece8;font-family:"Schibsted Grotesk",sans-serif;display:flex;flex-direction:column;justify-content:space-between;padding:72px 80px;box-sizing:border-box;position:relative;overflow:hidden}
  .mark{display:block;width:56px;height:56px}
  h1{font-weight:500;font-size:76px;line-height:1.05;letter-spacing:-.03em;margin:0;max-width:960px}
  h1 span{color:#a09e98}
  .foot{display:flex;justify-content:space-between;align-items:flex-end;font-family:"Geist Mono",monospace;font-size:22px;color:#a09e98}
  .foot b{color:#edece8;font-weight:400}
</style></head><body>
  <svg class="mark" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="7.5" fill="#1d1d1b"/><path d="M7 24V8h4.2L16 15.2 20.8 8H25v16h-3.6V14.1L16 22l-5.4-7.9V24z" fill="#edece8"/></svg>
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
