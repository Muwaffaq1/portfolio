import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { pieces } from "@/components/lab/pieces";
import { lab, labBySlug } from "@/lib/lab";
import { site } from "@/lib/content";

export const dynamicParams = false;

// About 70% of the Playground is dark. Dark phone screens get a white status bar,
// and dark web pieces get a dark window bar.
const darkScreens = new Set(["card-stack", "swipe-to-pay", "music-scrubber", "smart-home", "command-palette", "ai-prompt", "money-dashboard", "week-calendar", "spring-tuner", "card-to-detail", "button-states"]);
// Live Activity draws its own island, because the island is the experiment.
const ownIsland = new Set<string>();

function StatusBar({ tone, timeOnly }: { tone: "dark" | "light"; timeOnly?: boolean }) {
  return (
    <div className="lab-status" data-tone={tone} aria-hidden="true">
      <span>9:41</span>
      {!timeOnly && <span className="icons">
        <svg width="18" height="12" viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx="1" fill="currentColor" /><rect x="5" y="5.5" width="3" height="6.5" rx="1" fill="currentColor" /><rect x="10" y="3" width="3" height="9" rx="1" fill="currentColor" /><rect x="15" y="0" width="3" height="12" rx="1" fill="currentColor" /></svg>
        <svg width="16" height="12" viewBox="0 0 16 12"><path d="M8 11.5l2.2-2.6a3.3 3.3 0 00-4.4 0L8 11.5zM3.6 6.6a6.6 6.6 0 018.8 0l1.4-1.6a8.8 8.8 0 00-11.6 0l1.4 1.6zM1.4 4a10 10 0 0113.2 0L16 2.4a12.2 12.2 0 00-16 0L1.4 4z" fill="currentColor" /></svg>
        <svg width="26" height="12" viewBox="0 0 26 12"><rect x=".5" y=".5" width="22" height="11" rx="3.5" fill="none" stroke="currentColor" opacity=".4" /><rect x="2" y="2" width="17" height="8" rx="2" fill="currentColor" /><path d="M24 4v4a2 2 0 000-4z" fill="currentColor" opacity=".4" /></svg>
      </span>}
    </div>
  );
}
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
            <div className="lab-phone"><div className="lab-screen"><StatusBar tone={darkScreens.has(slug) ? "dark" : "light"} timeOnly={ownIsland.has(slug)} />{!ownIsland.has(slug) && <span className="lab-island" aria-hidden="true" />}<Piece /></div></div>
          ) : p.frame === "browser" ? (
            <div className={`lab-browser${darkScreens.has(slug) ? " is-dark" : ""}`}><div className="lab-browser-bar" aria-hidden="true"><i /><i /><i /></div><div className="lab-browser-body"><Piece /></div></div>
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
