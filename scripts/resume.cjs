// Renders both résumés to PDF (A4, selectable text, live links):
//   resume/resume.html                   -> public/muwaffaq-yusuf-resume.pdf                   (product designer)
//   resume/resume-design-engineer.html   -> public/muwaffaq-yusuf-resume-design-engineer.pdf   (design engineer)
// Usage: node scripts/resume.cjs   (Playwright is borrowed from ~/Desktop/treeti, like record.cjs)
const path = require("node:path");
const { chromium } = require(path.join(process.env.HOME, "Desktop/treeti/node_modules/playwright"));

const builds = [
  ["resume.html", "muwaffaq-yusuf-resume.pdf"],
  ["resume-design-engineer.html", "muwaffaq-yusuf-resume-design-engineer.pdf"],
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (const [src, pdf] of builds) {
    await page.goto("file://" + path.join(__dirname, "../resume", src), { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const out = path.join(__dirname, "../public", pdf);
    await page.pdf({ path: out, format: "A4", preferCSSPageSize: true, printBackground: true });
    console.log("Wrote", out);
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
