import fs from "node:fs";
import path from "node:path";
import site from "@/content/site.json";

// Every project is one JSON file in content/projects. A case study is an
// optional MDX file of the same name in content/case-studies.

// `frame` wraps the preview: "phone" for app recordings, "browser" for websites.
export type Preview =
  | { type: "video"; src: string; poster?: string; frame?: "phone" | "browser"; url?: string; wide?: boolean }
  | { type: "image"; src: string; frame?: "phone" | "browser"; url?: string; wide?: boolean };

export type Status = "live" | "client" | "completed" | "redesign" | "concept" | "in-progress" | "confidential" | null;

export type Project = {
  slug: string;
  name: string;
  summary: string;
  industry: string;
  year: string;
  status: Status;
  tags: string[];
  featured: boolean;
  order: number;
  preview?: Preview;
  link?: string;
  caseStudy?: { role: string; timeline: string; tools: string; result: string };
  hasCaseStudy: boolean;
};

const projectsDir = path.join(process.cwd(), "content/projects");
const caseStudiesDir = path.join(process.cwd(), "content/case-studies");

// A case study with an unfilled number (a table cell reading "TODO") is still a draft:
// it stays out of the site until it's finished, then appears on its own.
function isDraft(slug: string) {
  const file = path.join(caseStudiesDir, `${slug}.mdx`);
  return fs.existsSync(file) && /"TODO"/.test(fs.readFileSync(file, "utf8"));
}

export function getProjects(): Project[] {
  return fs
    .readdirSync(projectsDir)
    .filter((file) => file.endsWith(".json") && !isDraft(file.replace(/\.json$/, "")))
    .map((file) => {
      const slug = file.replace(/\.json$/, "");
      const data = JSON.parse(fs.readFileSync(path.join(projectsDir, file), "utf8"));
      const hasCaseStudy = fs.existsSync(path.join(caseStudiesDir, `${slug}.mdx`));
      return { slug, ...data, hasCaseStudy } as Project;
    })
    .sort((a, b) => a.order - b.order);
}

export function getProject(slug: string): Project | undefined {
  return getProjects().find((project) => project.slug === slug);
}

export const statusLabel: Record<Exclude<Status, null>, string> = {
  live: "Live",
  client: "Client work",
  completed: "Completed",
  redesign: "Redesign",
  concept: "Concept",
  "in-progress": "In progress",
  confidential: "On request",
};

export type DesignSystem = {
  slug: string;
  name: string;
  summary: string;
  cover: string;
  order: number;
  facts: { role: string; timeline: string; tools: string; scope: string };
  stats: { value: string; label: string }[];
};

// Each design system is content/systems/<slug>.json plus its article, <slug>.mdx.
export function getSystems(): DesignSystem[] {
  const dir = path.join(process.cwd(), "content/systems");
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => ({ slug: file.replace(/\.json$/, ""), ...JSON.parse(fs.readFileSync(path.join(dir, file), "utf8")) }))
    .sort((a, b) => a.order - b.order);
}

// Playground shots: add an image to public/playground and a line to content/playground.json.
import playgroundData from "@/content/playground.json";
// href: where the card links (a live experiment on /playground). live: a captured experiment, shown without a phone frame.
export type PlaygroundItem = { src: string; title: string; project: string; href?: string; live?: boolean };
export const playground = playgroundData as PlaygroundItem[];

export { site };
