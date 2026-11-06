// Records short clips of the real products in use, for the work tiles.
// Usage: node scripts/record.cjs <treeti|pharmaquest|attik|all>
// Needs Playwright (borrowed from ~/Desktop/treeti) and ffmpeg.
const path = require("node:path");
const fs = require("node:fs");
const { execFileSync } = require("node:child_process");
const { chromium } = require(path.join(process.env.HOME, "Desktop/treeti/node_modules/playwright"));

const out = path.join(__dirname, "../public/work");
const tmp = path.join(__dirname, "../.recordings");
const phone = { width: 390, height: 844 };
const desktop = { width: 1280, height: 800 };
const pause = (page, ms) => page.waitForTimeout(ms);

async function record(name, viewport, run, colorScheme = "light") {
  fs.mkdirSync(tmp, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport,
    colorScheme,
    deviceScaleFactor: 2,
    recordVideo: { dir: tmp, size: viewport },
  });
  const page = await context.newPage();
  // Shows each tap as a soft dot, so the recording reads as someone using the app.
  await page.addInitScript(() => {
    addEventListener("pointerdown", (e) => {
      const d = document.createElement("div");
      d.style.cssText = `position:fixed;left:${e.clientX - 18}px;top:${e.clientY - 18}px;width:36px;height:36px;border-radius:50%;background:rgba(0,0,0,.18);box-shadow:0 0 0 2px rgba(255,255,255,.7);pointer-events:none;z-index:2147483647;transition:transform .45s,opacity .45s`;
      document.documentElement.appendChild(d);
      requestAnimationFrame(() => { d.style.transform = "scale(1.6)"; d.style.opacity = "0"; });
      setTimeout(() => d.remove(), 500);
    }, true);
  });
  await run(page);
  const video = page.video();
  await context.close();
  await browser.close();
  const raw = await video.path();
  const mp4 = path.join(out, `${name}.mp4`);
  // Trim the blank first second, speed up 1.25x, scale for the tiles.
  execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-ss", "1", "-i", raw, "-vf", `setpts=PTS/1.25,scale=${viewport.width}:-2,fps=30`, "-an", "-c:v", "libx264", "-crf", "26", "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart", mp4]);
  execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-ss", "2", "-i", mp4, "-frames:v", "1", "-q:v", "3", path.join(out, `${name}.jpg`)]);
  fs.rmSync(raw);
  console.log(`${name}: ${(fs.statSync(mp4).size / 1024).toFixed(0)} KB`);
}

const flows = {
  // treeti's own demo mode, with synthetic people. Run it with:
  // AHD_ENABLE_DEMO=true next dev -p 3100 -H 127.0.0.1   (in ~/Desktop/treeti)
  treeti: () =>
    record("treeti", phone, async (page) => {
      const base = "http://127.0.0.1:3100";
      await page.addStyleTag({ content: "" }).catch(() => {});
      await page.goto(`${base}/demo`);
      // Hide the Next.js dev badge so it doesn't appear in the recording.
      await page.addStyleTag({ content: "nextjs-portal{display:none!important}" });
      await pause(page, 800);
      await page.getByRole("link", { name: /Open demonstration/ }).or(page.getByRole("button", { name: /Open demonstration/ })).first().click();
      await page.getByRole("link", { name: "New agreement", exact: true }).waitFor({ timeout: 60000 });
      await page.addStyleTag({ content: "nextjs-portal{display:none!important}" });
      await pause(page, 1400);
      await page.getByRole("link", { name: "New agreement", exact: true }).click();
      await pause(page, 700);
      await page.getByLabel("Principal amount").pressSequentially("250000", { delay: 90 });
      await page.getByLabel("Borrower’s full name").pressSequentially("Ahmad Ibrahim", { delay: 55 });
      await page.getByLabel("Email or phone number").pressSequentially("ahmad@example.test", { delay: 35 });
      await pause(page, 400);
      await page.getByRole("button", { name: "Continue", exact: true }).click();
      await pause(page, 800);
      await page.getByLabel("Repayment due date").fill("2027-06-30");
      await pause(page, 500);
      await page.getByRole("button", { name: "Continue", exact: true }).click();
      await pause(page, 1200);
      await page.mouse.wheel(0, 500);
      await pause(page, 900);
      await page.getByRole("checkbox", { name: /I confirm this loan is interest-free/ }).check();
      await pause(page, 600);
      await page.getByRole("button", { name: "Agree and send", exact: true }).click();
      await page.getByRole("heading", { name: "Ready to review together." }).waitFor();
      await pause(page, 2200);
    }),

  pharmaquest: () =>
    record("pharmaquest", phone, async (page) => {
      await page.goto("https://pharmaquest.pages.dev");
      await pause(page, 1500);
      const saved = page.getByRole("button", { name: "I’ve saved it" });
      if (await saved.isVisible().catch(() => false)) await saved.click();
      await pause(page, 900);
      await page.getByRole("button", { name: "Start Daily Run" }).click();
      await pause(page, 1500);
      await page.locator("button.press.items-start").nth(1).click();
      await pause(page, 700);
      await page.getByRole("button", { name: "Check answer" }).click();
      await pause(page, 1800);
      await page.mouse.wheel(0, 400);
      await pause(page, 1600);
      await page.getByRole("button", { name: /Continue|Next|Got it/ }).first().click();
      await pause(page, 2000);
    }, "dark"),

  axis: () =>
    record("axis", desktop, async (page) => {
      await page.goto("https://axisurban.framer.website");
      await pause(page, 2500);
      for (let i = 0; i < 7; i++) {
        await page.mouse.wheel(0, 450);
        await pause(page, 1100);
      }
      await pause(page, 800);
    }),

  // A full daily run with correct answers, so XP, a combo badge and the streak appear.
  "pharmaquest-game": () =>
    record("pharmaquest-game", phone, async (page) => {
      const bank = require(path.join(process.env.HOME, "Desktop/PharmaQuest/src/data/questions.json"));
      const shots = path.join(__dirname, "../public/work/pharmaquest");
      fs.mkdirSync(shots, { recursive: true });
      const snap = (name) => page.screenshot({ path: path.join(shots, `${name}.jpg`), type: "jpeg", quality: 82 });
      await page.goto("https://pharmaquest.pages.dev");
      await pause(page, 1200);
      const saved = page.getByRole("button", { name: "I’ve saved it" });
      if (await saved.isVisible().catch(() => false)) await saved.click();
      await pause(page, 600);
      await page.getByRole("button", { name: "Start Daily Run" }).click();
      let badgeShot = false;
      for (let i = 0; i < 15; i++) {
        await page.locator("button.press.items-start").first().waitFor();
        await pause(page, 500);
        const text = await page.locator("main").innerText();
        const q = bank.find((x) => text.includes(x.stem.slice(0, 60)));
        const want = q ? q.options[q.answer].slice(0, 40) : null;
        const opts = page.locator("button.press.items-start");
        const n = await opts.count();
        let hit = 0;
        for (let k = 0; k < n; k++) if (want && (await opts.nth(k).innerText()).includes(want)) { hit = k; break; }
        await opts.nth(hit).click();
        await pause(page, 350);
        await page.getByRole("button", { name: "Check answer" }).click();
        await pause(page, i < 2 ? 1400 : 700);
        if (i === 0) await snap("correct");
        // Clear any badge celebrations, then move on; a celebration can appear late.
        const keep = page.getByRole("button", { name: /Keep going/ });
        const next = page.getByRole("button", { name: /Continue|Next|Got it|See results|Finish/ }).first();
        for (let tries = 0; tries < 8; tries++) {
          if (await keep.isVisible().catch(() => false)) {
            await pause(page, 1600);
            if (!badgeShot) { await snap("badge"); badgeShot = true; }
            await pause(page, 1000);
            await keep.click();
            await pause(page, 500);
            continue;
          }
          if (await next.isVisible().catch(() => false)) { await next.click(); break; }
          await pause(page, 400);
        }
      }
      await pause(page, 1500);
      const keep = page.getByRole("button", { name: /Keep going/ });
      while (await keep.isVisible().catch(() => false)) { await pause(page, 1400); await keep.click(); await pause(page, 500); }
      await snap("results");
      await pause(page, 1800);
      await page.getByRole("button", { name: /Back to home/ }).click();
      await pause(page, 1200);
      await snap("home");
      await page.mouse.wheel(0, 900);
      await pause(page, 1000);
      await snap("mastery");
      await page.getByRole("button", { name: "Badges", exact: true }).first().click();
      await pause(page, 1500);
      await snap("badges");
      await page.mouse.wheel(0, 500);
      await pause(page, 1200);
    }, "dark"),

  attik: () =>
    record("attik", desktop, async (page) => {
      await page.goto("https://attik-concept-by-muwaffaq.pages.dev");
      await pause(page, 2500);
      for (let i = 0; i < 6; i++) {
        await page.mouse.wheel(0, 420);
        await pause(page, 1100);
      }
      await pause(page, 800);
    }),
};

(async () => {
  const which = process.argv[2] || "all";
  for (const [name, run] of Object.entries(flows)) if (which === "all" || which === name) await run();
})().catch((e) => { console.error(e); process.exit(1); });
