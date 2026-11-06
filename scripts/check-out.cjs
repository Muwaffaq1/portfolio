// Runs before every deploy: stops if raw phone photos (which carry GPS) are in the build.
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const bad = [];
(function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const file = path.join(dir, name);
    if (fs.statSync(file).isDirectory()) { walk(file); continue; }
    if (/\.(heic|heif|mov|dng)$/i.test(name) || /^(IMG_|PXL_|DSC|MVIMG)/i.test(name)) { bad.push(file); continue; }
    if (/\.(jpe?g)$/i.test(name) && process.platform === "darwin") {
      const lat = execFileSync("mdls", ["-raw", "-name", "kMDItemLatitude", file]).toString().trim();
      if (lat && lat !== "(null)") bad.push(`${file} (has GPS location)`);
    }
  }
})(path.join(__dirname, "../out"));

if (bad.length) {
  console.error("Deploy stopped. These files look like original phone photos:\n" + bad.join("\n"));
  process.exit(1);
}
console.log("Photo check passed.");
