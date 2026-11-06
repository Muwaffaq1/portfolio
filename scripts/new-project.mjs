#!/usr/bin/env node
// Adds a project: npm run new -- "Project name"
// Creates content/projects/<slug>.json and, with --case-study, an MDX case study.
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const withCaseStudy = args.includes("--case-study");
const name = args.filter((a) => !a.startsWith("--")).join(" ").trim();

if (!name) {
  console.error('Usage: npm run new -- "Project name" [--case-study]');
  process.exit(1);
}

const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const root = path.resolve(import.meta.dirname, "..");
const projectFile = path.join(root, "content/projects", `${slug}.json`);

if (fs.existsSync(projectFile)) {
  console.error(`content/projects/${slug}.json already exists.`);
  process.exit(1);
}

const orders = fs
  .readdirSync(path.join(root, "content/projects"))
  .map((f) => JSON.parse(fs.readFileSync(path.join(root, "content/projects", f), "utf8")).order ?? 0);

const project = {
  name,
  summary: "One line about what it is",
  industry: "Industry",
  year: `’${String(new Date().getFullYear()).slice(2)}`,
  status: null,
  tags: [],
  featured: false,
  order: Math.max(0, ...orders) + 1,
  preview: { type: "image", src: `/work/${slug}.png` },
  ...(withCaseStudy && {
    caseStudy: { role: "Your role", timeline: "Month Year", tools: "Figma, Next.js", result: "One line on the outcome" },
  }),
};

fs.writeFileSync(projectFile, JSON.stringify(project, null, 2) + "\n");
console.log(`Created content/projects/${slug}.json`);

if (withCaseStudy) {
  const mdx = path.join(root, "content/case-studies", `${slug}.mdx`);
  fs.writeFileSync(
    mdx,
    "## Why I wanted this to exist\n\n\n## The problem\n\n\n## Key decisions\n\n\n## What shipped vs what was designed\n\n",
  );
  console.log(`Created content/case-studies/${slug}.mdx`);
}

console.log(`Add a preview to public/work/${slug}.png (or .mp4 with "type": "video").`);
