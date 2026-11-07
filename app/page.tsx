import Link from "next/link";
import { ContactLinks, ContactSection } from "@/components/Contact";
import { Experience } from "@/components/Experience";
import { Greeting } from "@/components/Greeting";
import { KindWords } from "@/components/KindWords";
import { Header } from "@/components/Header";
import { LocalTime } from "@/components/LocalTime";
import { lab } from "@/lib/lab";
import { Rich } from "@/components/Rich";
import { WorkTile } from "@/components/WorkTile";
import { getProjects, site, statusLabel, type Project } from "@/lib/content";

function status(project: Project) {
  return project.status ? statusLabel[project.status] : undefined;
}

// Three experiments, one from each kind: web, motion and mobile.
const featuredLab = ["money-dashboard", "spring-tuner", "card-stack"].map((slug) => lab.find((p) => p.slug === slug)!);

// Six sections, in the order a hiring manager reads: who, the work, the craft, the career, what people say, how to reach me.
export default function Home() {
  const projects = getProjects();
  const featured = projects.filter((p) => p.featured);
  const more = projects.filter((p) => !p.featured);

  return (
    <div className="wrap">
      <Header name={site.name} />
      <main>
        <div className="hero">
          <h1><Greeting words={site.greetings} /> I&apos;m {site.name}.</h1>
          <div className="meta">
            <span>{site.role}</span>
            <span className="sep">·</span>
            <span>{site.location} <LocalTime timeZone={site.timezone} /></span>
          </div>
          <div className="intro">
            {site.intro.map((p) => <p key={p}><Rich text={p} /></p>)}
          </div>
          <ContactLinks only={["Email", "Book a call", "Résumé"]} />
        </div>

        <section id="work" aria-labelledby="w-h">
          <div className="sh"><h2 id="w-h">Selected work</h2><span className="hint">Each product, in use</span></div>
          <div className="tiles">
            {featured.map((p) => <WorkTile key={p.slug} project={p} statusText={status(p)} />)}
          </div>
          <ul className="list more-work" aria-label="More work">
            {more.map((p) => {
              const href = p.hasCaseStudy ? `/work/${p.slug}/` : p.link;
              const tags = [status(p), ...(p.tags ?? [])].filter(Boolean).slice(0, 2).join(" · ");
              return (
                <li key={p.slug}>
                  {href ? (
                    <Link href={href}><span className="n">{p.name}</span><span className="d">{p.summary}</span></Link>
                  ) : (
                    <span><span className="n">{p.name}</span><span className="d">{p.summary}</span></span>
                  )}
                  <span className="r">{tags}</span>
                </li>
              );
            })}
          </ul>
        </section>

        <section id="playground" aria-labelledby="p-h">
          <div className="sh"><h2 id="p-h">Playground</h2><Link className="hint" href="/playground/">See all {lab.length} experiments →</Link></div>
          <ul className="lab-grid home-lab">
            {featuredLab.map((p) => (
              <li key={p.slug}>
                <Link href={`/playground/${p.slug}/`} className="lab-card">
                  <span className="lab-thumb"><img src={`/playground/lab/${p.slug}.jpg`} alt="" loading="lazy" /></span>
                  <span className="lab-card-text"><b>{p.title}</b><span>{p.question}</span><span className="lab-card-tags">{p.kind}{p.live ? " · Live" : ""}</span></span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section id="experience" aria-labelledby="ex-h">
          <div className="sh"><h2 id="ex-h">Experience</h2><Link className="hint" href="/about/">More about me →</Link></div>
          <Experience />
          <p className="note exp-note">Nūring&apos;s web app and engineering work are confidential; I&apos;m happy to walk you through them on a call. The <Link href="/systems/nuring/">Nūring design system</Link> has a full write-up.</p>
        </section>

        <KindWords />
        <ContactSection />
      </main>

      <footer>
        <span>© {new Date().getFullYear()} {site.name}</span>
        <span><Link href="/services/">Work with me</Link> · <Link href="/systems/">Design systems</Link></span>
      </footer>
    </div>
  );
}
