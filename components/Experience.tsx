import site from "@/content/site.json";

// Career timeline from content/site.json -> experience, newest first.
export function Experience({ detail = false }: { detail?: boolean }) {
  return (
    <ol className="timeline">
      {site.experience.map((e) => (
        <li key={e.company + e.when}>
          <span className="tl-when tnum">{e.when}</span>
          <div className="tl-body">
            <span><span className="n">{e.role}</span><span className="d">{e.company}</span></span>
            {detail && <span className="tl-where">{e.where}</span>}
            <span className="d tl-line">{e.line}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}
