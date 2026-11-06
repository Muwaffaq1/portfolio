// Takes a still preview of each finished site: node scripts/shots.cjs
const path = require("node:path");
const { chromium } = require(path.join(process.env.HOME, "Desktop/treeti/node_modules/playwright"));
const sites = {
  "sarki-energy": "https://sarki-energy-site.yusufmuwaffaq17.workers.dev",
  almutamir: "https://almutamir-site.yusufmuwaffaq17.workers.dev",
  "el-eclass": "http://127.0.0.1:3300",
};
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1.5 });
  for (const [name, url] of Object.entries(sites)) {
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 240000 });
      await page.addStyleTag({ content: "nextjs-portal{display:none!important}" });
      await page.waitForTimeout(2500);
      await page.screenshot({ path: path.join(__dirname, `../public/work/${name}.jpg`), type: "jpeg", quality: 80 });
      console.log("ok", name);
    } catch (e) { console.log("failed", name, e.message.split("\n")[0]); }
  }
  await browser.close();
})();
