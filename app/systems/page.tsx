import Link from "next/link";
import { Header } from "@/components/Header";
import { ModeDemo } from "@/components/ModeDemo";
import { getSystems, site } from "@/lib/content";

export const metadata = {
  title: `Design systems — ${site.name}`,
  description: "Token-based design systems for QuickPay and Nūring, each with a full write-up, and a live demo of one component in light, dark and Arabic.",
};

export default function Systems() {
  const systems = getSystems();
  return (
    <div className="wrap">
      <Header name={site.name} />
      <main>
        <div className="cs-head">
          <Link className="cs-back" href="/">← Home</Link>
          <h1 className="cs-title">Design systems</h1>
          <p className="cs-sum">I build the tokens first, so dark mode and Arabic become a setting, not a redesign. Each system has a full write-up: why it was needed, how it&apos;s structured, the rules, and what it changed.</p>
        </div>

        <section aria-label="Systems" style={{ paddingTop: 32 }}>
          <div className="systems">
            {systems.map((s) => (
              <Link key={s.slug} className="system" href={`/systems/${s.slug}/`}>
                <div className="system-cover"><img src={s.cover} alt="" /></div>
                <div className="row"><b>{s.name}</b><span className="ext">Read the write-up →</span></div>
                <span className="d">{s.summary}</span>
                <div className="mini-stats">
                  {s.stats.map((st) => <span key={st.label}><b className="tnum">{st.value}</b> {st.label}</span>)}
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section aria-labelledby="demo-h">
          <div className="sh"><h2 id="demo-h">Try it</h2><span className="hint">QuickPay, live in code</span></div>
          <p className="lead">The same component in three modes. Light and Dark swap the design tokens; Arabic also flips the layout right to left.</p>
          <ModeDemo />
        </section>
      </main>
      <footer><Link href="/">← Home</Link><Link href="/#contact">Get in touch →</Link></footer>
    </div>
  );
}
