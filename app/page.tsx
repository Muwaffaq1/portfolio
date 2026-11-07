import Link from "next/link";
import { ContactLinks, ContactSection } from "@/components/Contact";
import { Experience } from "@/components/Experience";
import { Greeting } from "@/components/Greeting";
import { KindWords } from "@/components/KindWords";
import { Services } from "@/components/Services";
import { Header } from "@/components/Header";
import { LocalTime } from "@/components/LocalTime";
import { Lock } from "@/components/Lock";
import { Shot } from "@/components/Shot";
import { ModeDemo } from "@/components/ModeDemo";
import { Rich } from "@/components/Rich";
import { WorkTile } from "@/components/WorkTile";
import { getProjects, getSystems, playground, site, statusLabel, type Project } from "@/lib/content";

function status(project: Project) {
  return project.status ? statusLabel[project.status] : undefined;
}

function Card({ project }: { project: Project }) {
  const href = project.hasCaseStudy ? `/work/${project.slug}/` : project.link;
  const inner = (
    <>
      <div className="thumb">
        {project.preview?.type === "image" ? <img src={project.preview.src} alt="" loading="lazy" /> : <span>Preview soon</span>}
      </div>
      <div className="row">
        <b>{project.name}</b>
        <span className="r">
          {href?.startsWith("http") ? <span className="ext">Visit ↗</span> : status(project)}
        </span>
      </div>
      <span className="d">{project.summary}</span>
    </>
  );
  if (!href) return <div className="card">{inner}</div>;
  return href.startsWith("http") ? (
    <a className="card" href={href} target="_blank" rel="noreferrer">{inner}</a>
  ) : (
    <Link className="card" href={href}>{inner}</Link>
  );
}

export default function Home() {
  const projects = getProjects();
  const featured = projects.filter((p) => p.featured);
  const more = projects.filter((p) => !p.featured);
  const systems = getSystems();

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
          <ContactLinks />
          <p className="start-here">Hiring? Start here for <Link href="/for/product/">product design</Link>, <Link href="/for/front-end/">front-end</Link> or <Link href="/for/fintech/">fintech</Link> roles.</p>
        </div>

        <section id="work" aria-labelledby="w-h">
          <div className="sh"><h2 id="w-h">Selected work</h2><span className="hint">Each product, in use</span></div>
          <div className="tiles">
            {featured.map((p) => <WorkTile key={p.slug} project={p} statusText={status(p)} />)}
          </div>
        </section>

        <section aria-labelledby="m-h">
          <div className="sh"><h2 id="m-h">More work</h2></div>
          <div className="cards">
            {more.map((p) => <Card key={p.slug} project={p} />)}
          </div>
        </section>

        <section id="playground" aria-labelledby="p-h">
          <div className="sh"><h2 id="p-h">Playground</h2><Link className="hint" href="/playground/">See all explorations →</Link></div>
          <div className="shots" tabIndex={0} role="region" aria-label="Playground explorations, scroll sideways">
            {playground.slice(0, 6).map((s) => <Shot key={s.src} item={s} />)}
          </div>
        </section>

        <section id="nuring" aria-labelledby="nu-h">
          <div className="sh"><h2 id="nu-h">Currently</h2></div>
          <div className="nuring">
            <div className="nuring-head">
              <b>{site.nuring.role} at {site.nuring.company}</b>
              <span className="now-tag">Now</span>
            </div>
            <p><em>{site.nuring.tagline}</em> {site.nuring.summary}</p>
            <ul className="list">
              {site.nuring.work.map((w) => (
                <li key={w.name}>
                  <span><span className="n">{w.name}</span><span className="d">{w.line}</span></span>
                  <span className="r">{w.kind} · {"href" in w && w.href ? <Link href={w.href}>Read the write-up →</Link> : <Lock />}</span>
                </li>
              ))}
            </ul>
            <p className="note">The web app and engineering work are confidential. I&apos;m happy to walk you through them on a call.</p>
          </div>
        </section>

        <section id="experience" aria-labelledby="ex-h">
          <div className="sh"><h2 id="ex-h">Experience</h2><Link className="hint" href="/about/">More about me →</Link></div>
          <Experience />
        </section>

        <section id="systems" aria-labelledby="s-h">
          <div className="sh"><h2 id="s-h">Design systems</h2></div>
          <p className="lead">I build the tokens first, so dark mode and Arabic become a setting, not a redesign. Each system has a full write-up: why it was needed, how it&apos;s structured, the rules, and what it changed.</p>
          <div className="systems">
            {systems.map((s) => (
              <Link key={s.slug} className="system" href={`/systems/${s.slug}/`}>
                <div className="system-cover"><img src={s.cover} alt="" loading="lazy" /></div>
                <div className="row"><b>{s.name}</b><span className="ext">Read the write-up →</span></div>
                <span className="d">{s.summary}</span>
                <div className="mini-stats">
                  {s.stats.map((st) => <span key={st.label}><b className="tnum">{st.value}</b> {st.label}</span>)}
                </div>
              </Link>
            ))}
          </div>
          <div className="demo-wrap">
            <p className="lead" style={{ marginBottom: 16 }}>Try it on QuickPay: same component, three modes.</p>
            <ModeDemo />
          </div>
        </section>

        <section aria-labelledby="f-h">
          <div className="sh"><h2 id="f-h">Launch films</h2></div>
          {/* Films with a video get a player (sound on, never autoplays); the rest stay as a list until they're uploaded. */}
          {site.films.filter((f) => "video" in f && f.video).map((f) => (
            <div key={f.name} className={"wide" in f && f.wide ? "film wide" : "film"}>
              <video src={"video" in f ? f.video : undefined} poster={"poster" in f ? f.poster : undefined} controls playsInline preload="none" aria-label={`${f.name}: ${f.line}`} />
              <div className="film-text">
                <b>{f.name}</b>
                <span className="d">{f.line}{"length" in f && f.length ? ` · ${f.length}` : ""}</span>
                {"about" in f && f.about && <p>{f.about}</p>}
              </div>
            </div>
          ))}
          <ul className="list">
            {site.films.filter((f) => !("video" in f && f.video)).map((f) => (
              <li key={f.name}><span><span className="n">{f.name}</span><span className="d">{f.line}</span></span><span className="r">{f.kind}</span></li>
            ))}
          </ul>
        </section>

        <section id="process" aria-labelledby="a-h">
          <div className="sh"><h2 id="a-h">How I work</h2></div>
          <ol className="how">
            {site.how.map((h, i) => (
              <li key={h.step}><span className="tnum">{String(i + 1).padStart(2, "0")}</span><b>{h.step}</b><span className="d">{h.line}</span></li>
            ))}
          </ol>
          <p className="lead" style={{ margin: "28px 0 10px" }}>Where AI fits</p>
          <ul className="ai">{site.ai.map((line) => <li key={line}>{line}</li>)}</ul>
        </section>
        <KindWords />
        <Services />
        <ContactSection />
      </main>

      <footer>
        <span>© {new Date().getFullYear()} {site.name}</span>
        <span>Designed and built by me</span>
      </footer>
    </div>
  );
}
