import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { ContactLinks } from "@/components/Contact";
import { Experience } from "@/components/Experience";
import { Header } from "@/components/Header";
import { site } from "@/lib/content";

export const metadata = {
  title: `About — ${site.name}`,
  description: `${site.name}, ${site.role}, working remotely.`,
};

// Drop a square photo at public/me.jpg and it appears here automatically.
const hasPhoto = fs.existsSync(path.join(process.cwd(), "public/me.jpg"));

export default function About() {
  return (
    <div className="wrap">
      <Header name={site.name} />
      <main>
        <div className="about-head">
          {hasPhoto ? <img className="portrait" src="/me.jpg" alt={site.name} /> : <span className="portrait empty" aria-hidden="true">{site.name.charAt(0)}</span>}
          <div className="cs-head" style={{ paddingTop: 0 }}>
            <Link className="cs-back" href="/">← Home</Link>
            <h1 className="cs-title">About me</h1>
            <p className="cs-sum">{site.role}, working remotely. Designing products for 4+ years.</p>
            <div className="links" style={{ marginTop: 6 }}>
              <a href={site.contact.resume} download>Résumé</a>
              <a href={site.contact.call} target="_blank" rel="noreferrer">Book a call</a>
            </div>
          </div>
        </div>

        <dl className="facts-grid">
          {site.facts.map((f) => (
            <div key={f.k}><dt>{f.k}</dt><dd>{f.v}</dd></div>
          ))}
        </dl>

        <div className="prose" style={{ marginTop: 32 }}>
          <p>I studied computer science, so I&apos;ve always cared how things work as much as how they look. I&apos;ve worked across sports tech, marketplaces and finance apps: Nūring&apos;s grip-sensing glove, a live bidding marketplace with its own virtual wallet at HoBeei, and money apps like QuickPay and treeti.</p>
          <p>I work best close to the product. I design in Figma, build in code, and make the launch film at the end, which means fewer handoffs and fewer things lost between them. I hold a simple rule: if I wouldn&apos;t want to use it, it isn&apos;t finished.</p>
          <p>Away from the screen, I&apos;m usually at the gym or in the kitchen. I train most mornings, and I love cooking for friends and family. Both reward the same things good design does: showing up every day, and getting the small details right.</p>
        </div>

        <section aria-labelledby="pr-h">
          <div className="sh"><h2 id="pr-h">What I care about</h2></div>
          <ol className="how">
            {site.principles.map((p, i) => (
              <li key={p.title}><span className="tnum">{String(i + 1).padStart(2, "0")}</span><b>{p.title}</b><span className="d">{p.line}</span></li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="ai-h">
          <div className="sh"><h2 id="ai-h">Where AI fits</h2></div>
          <ul className="ai">{site.ai.map((line) => <li key={line}>{line}</li>)}</ul>
        </section>

        <section aria-labelledby="ex-h">
          <div className="sh"><h2 id="ex-h">Experience</h2><span className="hint">{site.experience.length} roles</span></div>
          <Experience detail />
        </section>

        <section aria-labelledby="ed-h">
          <div className="sh"><h2 id="ed-h">Education</h2></div>
          <ul className="list">
            {site.education.map((e) => (
              <li key={e.what}><span><span className="n">{e.what}</span><span className="d">{e.where}</span></span><span className="r">{e.when}</span></li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="l-h">
          <div className="sh"><h2 id="l-h">Outside work</h2></div>
          <div className="life">
            {site.life.map((p) => (
              <figure key={p.src} className="life-item">
                <img src={p.src} alt={p.caption} loading="lazy" />
                <figcaption>{p.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section aria-labelledby="t-h">
          <div className="sh"><h2 id="t-h">Tools</h2></div>
          <p className="lead">Figma (variables, components, prototyping), Framer, Next.js, React, Astro, Tailwind, Supabase, Cloudflare, Claude Code and Figma MCP, HyperFrames for launch films.</p>
        </section>

        <section aria-labelledby="g-h">
          <div className="sh"><h2 id="g-h">Get in touch</h2></div>
          <ContactLinks />
        </section>
      </main>
      <footer><Link href="/">← Home</Link><Link href="/#contact">Get in touch →</Link></footer>
    </div>
  );
}
