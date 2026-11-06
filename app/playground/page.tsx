import Link from "next/link";
import { Header } from "@/components/Header";
import { playground, site } from "@/lib/content";

export const metadata = {
  title: `Playground — ${site.name}`,
  description: "UI explorations, screens and details.",
};

export default function Playground() {
  return (
    <div className="wrap">
      <Header name={site.name} />
      <main>
        <div className="cs-head">
          <Link className="cs-back" href="/">← Home</Link>
          <h1 className="cs-title">Playground</h1>
          <p className="cs-sum">UI explorations, screens and small details from my projects and experiments.</p>
        </div>
        <div className="gallery">
          {playground.map((s) => (
            <figure key={s.src} className="shot">
              <img src={s.src} alt={`${s.title}, ${s.project}`} loading="lazy" />
              <figcaption><b>{s.title}</b><span>{s.project}</span></figcaption>
            </figure>
          ))}
        </div>
      </main>
      <footer><Link href="/">← Home</Link><Link href="/#contact">Get in touch →</Link></footer>
    </div>
  );
}
