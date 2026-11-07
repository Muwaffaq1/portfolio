import s from "./Loaders.module.css";

const items = [
  { name: "Dots", el: <span className={s.dots}><i /><i /><i /></span> },
  { name: "Orbit", el: <span className={s.orbit}><i /></span> },
  { name: "Morph", el: <span className={s.morph} /> },
  { name: "Bars", el: <span className={s.bars}><i /><i /><i /><i /><i /></span> },
  { name: "Ring", el: <span className={s.ring} /> },
  { name: "Pulse", el: <span className={s.pulse}><i /><i /></span> },
];

export default function Loaders() {
  return (
    <div className={s.grid}>
      {items.map((it) => (
        <figure key={it.name} className={s.cell}>
          <span className={s.box} role="img" aria-label={`${it.name} loader`}>{it.el}</span>
          <figcaption>{it.name}</figcaption>
        </figure>
      ))}
    </div>
  );
}
