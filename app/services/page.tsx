import Link from "next/link";
import { ContactLinks } from "@/components/Contact";
import { Header } from "@/components/Header";
import { site } from "@/lib/content";

export const metadata = {
  title: `Work with me — ${site.name}`,
  description: "For businesses and founders: website design and build, product design and design systems, launch films, and launch care, from one person.",
};

// For businesses hiring for a project. Prices show only when set in site.json.
export default function Services() {
  return (
    <div className="wrap">
      <Header name={site.name} />
      <main>
        <div className="cs-head">
          <Link className="cs-back" href="/">← Home</Link>
          <h1 className="cs-title">Work with me</h1>
          <p className="cs-sum">For businesses and founders. I take products from first sketch to launch: the design, the build and the film that announces it, all from one person.</p>
        </div>

        <section aria-labelledby="sv-h" style={{ paddingTop: 40 }}>
          <div className="sh"><h2 id="sv-h">What I offer</h2></div>
          <ul className="list">
            {site.services.map((s) => (
              <li key={s.name}>
                <span><span className="n">{s.name}</span><span className="d">{s.line}</span></span>
                <span className="r">{s.price || "Quote on request"}</span>
              </li>
            ))}
          </ul>
          <ol className="steps-row">
            {site.process.map((step, i) => (
              <li key={step}><span className="tnum">{String(i + 1).padStart(2, "0")}</span>{step}</li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="how-h">
          <div className="sh"><h2 id="how-h">How I work</h2></div>
          <ol className="how">
            {site.how.map((h, i) => (
              <li key={h.step}><span className="tnum">{String(i + 1).padStart(2, "0")}</span><b>{h.step}</b><span className="d">{h.line}</span></li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="go-h">
          <div className="sh"><h2 id="go-h">Start a project</h2></div>
          <p className="lead">{site.contact.reply}</p>
          <ContactLinks only={["Email", "Book a call", "LinkedIn"]} />
        </section>
      </main>
      <footer><Link href="/">← Home</Link><Link href="/#contact">Get in touch →</Link></footer>
    </div>
  );
}
