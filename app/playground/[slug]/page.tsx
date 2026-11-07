import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { pieces } from "@/components/lab/pieces";
import { lab, labBySlug } from "@/lib/lab";
import { site } from "@/lib/content";

export const dynamicParams = false;
export function generateStaticParams() {
  return lab.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = labBySlug(slug);
  return p ? { title: `${p.title} — Playground — ${site.name}`, description: p.question } : {};
}

export default async function LabPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = labBySlug(slug);
  const Piece = pieces[slug];
  if (!p || !Piece) notFound();
  const i = lab.indexOf(p);
  const prev = lab[(i - 1 + lab.length) % lab.length];
  const next = lab[(i + 1) % lab.length];

  return (
    <div className="wrap">
      <Header name={site.name} />
      <main>
        <div className="cs-head">
          <Link className="cs-back" href="/playground/">← Playground</Link>
          <h1 className="cs-title">{p.title}</h1>
          <p className="cs-sum">{p.question}</p>
          <p className="lab-tags"><span>{p.kind}</span><span>{p.live ? "Live · try it" : "Visual"}</span><span className="tnum">{String(i + 1).padStart(2, "0")} / {lab.length}</span></p>
        </div>

        <div className={`lab-stage frame-${p.frame}`}>
          {p.frame === "phone" ? (
            <div className="lab-phone"><div className="lab-screen"><Piece /></div></div>
          ) : p.frame === "browser" ? (
            <div className="lab-browser"><div className="lab-browser-bar" aria-hidden="true"><i /><i /><i /></div><div className="lab-browser-body"><Piece /></div></div>
          ) : (
            <Piece />
          )}
        </div>

        <section aria-labelledby="how-h" className="lab-how">
          <div className="sh"><h2 id="how-h">How it works</h2></div>
          <ul className="pg-notes">{p.notes.map((n) => <li key={n}>{n}</li>)}</ul>
        </section>

        <nav className="lab-pager" aria-label="More experiments">
          <Link href={`/playground/${prev.slug}/`}>← {prev.title}</Link>
          <Link href={`/playground/${next.slug}/`}>{next.title} →</Link>
        </nav>
      </main>
      <footer><Link href="/playground/">← Playground</Link><Link href="/#contact">Get in touch →</Link></footer>
    </div>
  );
}
