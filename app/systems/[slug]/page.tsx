import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { getSystems, site } from "@/lib/content";

export function generateStaticParams() {
  return getSystems().map((s) => ({ slug: s.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/systems/[slug]">) {
  const { slug } = await params;
  const system = getSystems().find((s) => s.slug === slug);
  return { title: system ? `${system.name} design system — ${site.name}` : site.name, description: system?.summary };
}

export default async function SystemArticle({ params }: PageProps<"/systems/[slug]">) {
  const { slug } = await params;
  const system = getSystems().find((s) => s.slug === slug);
  if (!system) notFound();

  const { default: Body } = await import(`@/content/systems/${slug}.mdx`);

  return (
    <div className="wrap">
      <Header name={site.name} />
      <main>
        <div className="cs-head">
          <Link className="cs-back" href="/#systems">← Design systems</Link>
          <h1 className="cs-title">{system.name} design system</h1>
          <p className="cs-sum">{system.summary}</p>
        </div>
        <div className="stats">
          {system.stats.map((s) => (
            <div key={s.label}><b className="tnum">{s.value}</b><span>{s.label}</span></div>
          ))}
        </div>
        <dl className="facts">
          <div><dt>Role</dt><dd>{system.facts.role}</dd></div>
          <div><dt>Timeline</dt><dd>{system.facts.timeline}</dd></div>
          <div><dt>Tools</dt><dd>{system.facts.tools}</dd></div>
          <div><dt>Scope</dt><dd>{system.facts.scope}</dd></div>
        </dl>
        <article className="prose"><Body /></article>
      </main>
      <footer><Link href="/#systems">← Design systems</Link><Link href="/#contact">Get in touch →</Link></footer>
    </div>
  );
}
