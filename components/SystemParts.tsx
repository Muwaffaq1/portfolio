// Building blocks used inside the design system articles (content/systems/*.mdx).
import { ZoomFigure } from "./ZoomFigure";

export function Figure({ src, caption, wide }: { src: string; caption: string; wide?: boolean }) {
  return <ZoomFigure src={src} caption={caption} wide={wide} />;
}

type Token = { name: string; value: string };

// Shows how a raw value becomes a named role and then a component property.
export function TokenFlow({ steps }: { steps: { label: string; tokens: Token[] }[] }) {
  return (
    <div className="flow">
      {steps.map((step, i) => (
        <div key={step.label} className="flow-step">
          <span className="flow-label">{String(i + 1).padStart(2, "0")} · {step.label}</span>
          {step.tokens.map((t) => (
            <span key={t.name + t.value} className={t.value.startsWith("#") ? "flow-token" : "flow-token plain"}>
              {t.value.startsWith("#") && <i style={{ background: t.value }} />}
              <code>{t.name}</code>
              <em>{t.value}</em>
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

export function Swatches({ tokens }: { tokens: Token[] }) {
  return (
    <div className="swatches">
      {tokens.map((t) => (
        <span key={t.name} className="swatch">
          <i style={{ background: t.value }} />
          <code>{t.name}</code>
          <em>{t.value}</em>
        </span>
      ))}
    </div>
  );
}

// A simple table for case studies; the first column is the row's label.
// Table cells are plain strings from MDX; [text](url) inside one becomes a real link.
function Cell({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (!m) return part;
        const external = m[2].startsWith("http");
        return <a key={i} href={m[2]} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>{m[1]}</a>;
      })}
    </>
  );
}

export function Table({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    // Focusable so a table that scrolls sideways on a phone can be scrolled by keyboard too.
    <div className="table-wrap" tabIndex={0} role="region" aria-label={`Table: ${head.filter(Boolean).join(", ")}`}>
      <table>
        {/* An empty header still gets a name for screen readers; the first cell of each row is its row header. */}
        <thead><tr>{head.map((h, i) => <th key={i} scope="col">{h || <span className="sr-only">Item</span>}</th>)}</tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>{r.map((c, j) => (j === 0 ? <th key={j} scope="row"><strong><Cell text={c} /></strong></th> : <td key={j}><Cell text={c} /></td>))}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// A row of phone screens with captions, used for states.
export function Screens({ items }: { items: { src: string; caption: string }[] }) {
  return (
    <div className="screens">
      {items.map((s) => (
        <figure key={s.src}>
          <img src={s.src} alt={s.caption} loading="lazy" />
          <figcaption>{s.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}
