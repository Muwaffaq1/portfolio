import site from "@/content/site.json";

// For businesses hiring for a project. Prices show only when set in site.json.
export function Services() {
  return (
    <section id="services" aria-labelledby="sv-h">
      <div className="sh"><h2 id="sv-h">Work with me</h2><span className="hint">For businesses and founders</span></div>
      <p className="lead">I take products from first sketch to launch: the design, the build and the film that announces it, all from one person.</p>
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
  );
}
