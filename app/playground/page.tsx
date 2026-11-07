import Link from "next/link";
import { Header } from "@/components/Header";
import { Shot } from "@/components/Shot";
import { LabGrid } from "@/components/lab/LabGrid";
import { lab } from "@/lib/lab";
import { playground, site } from "@/lib/content";

export const metadata = {
  title: `Playground — ${site.name}`,
  description: "Small experiments in mobile, web and motion, most of them live. Plus screens from my projects and concepts.",
};

export default function Playground() {
  const live = lab.filter((p) => p.live).length;
  return (
    <div className="wrap">
      <Header name={site.name} />
      <main>
        <div className="cs-head">
          <Link className="cs-back" href="/">← Home</Link>
          <h1 className="cs-title">Playground</h1>
          <p className="cs-sum">{lab.length} small experiments in mobile, web and motion, each built to answer one question. {live} of them are live, so open one and try it.</p>
        </div>

        <section aria-label="Experiments" className="lab-index">
          <LabGrid items={lab} />
        </section>

        <section aria-labelledby="sc-h" style={{ marginTop: 64 }}>
          <div className="sh"><h2 id="sc-h">Screens</h2><span className="hint">From projects and concepts</span></div>
          <div className="gallery">
            {playground.filter((s) => !s.live).map((s) => <Shot key={s.src} item={s} />)}
          </div>
        </section>
      </main>
      <footer><Link href="/">← Home</Link><Link href="/#contact">Get in touch →</Link></footer>
    </div>
  );
}
