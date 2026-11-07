import Link from "next/link";
import { Header } from "@/components/Header";
import { LabGrid } from "@/components/lab/LabGrid";
import { lab } from "@/lib/lab";
import { site } from "@/lib/content";

export const metadata = {
  title: `Playground — ${site.name}`,
  description: "Small experiments in mobile, web and motion, most of them live.",
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
          <p className="cs-sum">{lab.length} small experiments in mobile, web and motion, each built to answer one question. {live === lab.length ? "All of them are live" : `${live} of them are live`}, so open one and try it.</p>
        </div>

        <section aria-label="Experiments" className="lab-index">
          <LabGrid items={lab} />
        </section>
      </main>
      <footer><Link href="/">← Home</Link><Link href="/#contact">Get in touch →</Link></footer>
    </div>
  );
}
