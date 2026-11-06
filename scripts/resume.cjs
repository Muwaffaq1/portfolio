// Renders resume/resume.html to public/muwaffaq-yusuf-resume.pdf (A4, selectable text, live links).
// Usage: node scripts/resume.cjs   (Playwright is borrowed from ~/Desktop/treeti, like record.cjs)
const path = require("node:path");
const { chromium } = require(path.join(process.env.HOME, "Desktop/treeti/node_modules/playwright"));

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto("file://" + path.join(__dirname, "../resume/resume.html"), { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const out = path.join(__dirname, "../public/muwaffaq-yusuf-resume.pdf");
  await page.pdf({ path: out, format: "A4", preferCSSPageSize: true, printBackground: true });
  await browser.close();
  console.log("Wrote", out);
})().catch((e) => { console.error(e); process.exit(1); });
