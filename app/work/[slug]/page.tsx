import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { WorkTile } from "@/components/WorkTile";
import { getProject, getProjects, site, statusLabel } from "@/lib/content";

export function generateStaticParams() {
  return getProjects().filter((p) => p.hasCaseStudy).map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  return { title: project ? `${project.name} — ${site.name}` : site.name, description: project?.summary };
}

export default async function CaseStudy({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project || !project.hasCaseStudy) notFound();

  const { default: Body } = await import(`@/content/case-studies/${slug}.mdx`);
  const facts = project.caseStudy;

  return (
    <div className="wrap">
      <Header name={site.name} />
      <main>
        <div className="cs-head">
          <Link className="cs-back" href="/#work">← All work</Link>
          <h1 className="cs-title">{project.name}</h1>
          <p className="cs-sum">{project.summary}</p>
        </div>
        <div className="cs-stage">
          <WorkTile project={{ ...project, hasCaseStudy: false, link: undefined }} statusText={project.status ? statusLabel[project.status] : undefined} />
        </div>
        {facts && (
          <dl className="facts">
            <div><dt>Role</dt><dd>{facts.role}</dd></div>
            <div><dt>Timeline</dt><dd>{facts.timeline}</dd></div>
            <div><dt>Tools</dt><dd>{facts.tools}</dd></div>
            <div><dt>Result</dt><dd>{facts.result}</dd></div>
          </dl>
        )}
        {project.link && <p className="links" style={{ marginBottom: 32 }}><a href={project.link} target="_blank" rel="noreferrer">Open the live product ↗</a></p>}
        <article className="prose"><Body /></article>
      </main>
      <footer><Link href="/#work">← All work</Link><Link href="/#contact">Get in touch →</Link></footer>
    </div>
  );
}
