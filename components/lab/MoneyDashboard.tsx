"use client";

import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import s from "./MoneyDashboard.module.css";
import { Icon, type IconName } from "./icons";
import { WebShell } from "./WebShell";
import { useStill } from "./util";

type Range = "7D" | "30D" | "12M";
const N = 30; // every range is drawn with the same number of points, so the line can morph between them
const r1 = (n: number) => Math.round(n * 10) / 10; // identical on server and client

// A deterministic, money-shaped series: a drift, a slow wave and a little noise.
function series(seed: number, start: number, drift: number, wave: number) {
  return Array.from({ length: N }, (_, i) => {
    const noise = (Math.abs(Math.sin((i + 1) * 12.9898 * seed) * 43758.5453) % 1) - 0.5;
    return Math.round(start + drift * i + wave * Math.sin(i / 3.2 + seed) + noise * wave * 0.9);
  });
}
const data: Record<Range, { values: number[]; labels: string[]; ticks: string[]; inflow: number; outflow: number; change: number }> = {
  "7D": { values: series(1.3, 4610000, 7200, 42000), labels: Array.from({ length: N }, (_, i) => `${["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][Math.floor(i / 4.3)]} ${String(8 + ((i * 5) % 12)).padStart(2, "0")}:00`), ticks: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], inflow: 640000, outflow: 412000, change: 4.9 },
  "30D": { values: series(2.7, 4180000, 21000, 120000), labels: Array.from({ length: N }, (_, i) => `${i + 1} Oct`), ticks: ["1 Oct", "8 Oct", "15 Oct", "22 Oct", "30 Oct"], inflow: 2840000, outflow: 2190000, change: 15.3 },
  "12M": { values: series(4.1, 2100000, 92000, 260000), labels: Array.from({ length: N }, (_, i) => ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"][Math.min(11, Math.floor(i / 2.5))]), ticks: ["Nov", "Jan", "Mar", "May", "Jul", "Sep"], inflow: 31200000, outflow: 28700000, change: 129.6 },
};
const W = 600, H = 200, PAD = 12;

function geometry(values: number[]) {
  const min = Math.min(...values), max = Math.max(...values);
  const pts = values.map((v, i) => [r1((i / (N - 1)) * W), r1(PAD + (1 - (v - min) / (max - min || 1)) * (H - PAD * 2))] as const);
  // Catmull-Rom to cubic Bézier: a smooth line with the same commands for every range.
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] ?? p2;
    d += ` C ${r1(p1[0] + (p2[0] - p0[0]) / 6)} ${r1(p1[1] + (p2[1] - p0[1]) / 6)} ${r1(p2[0] - (p3[0] - p1[0]) / 6)} ${r1(p2[1] - (p3[1] - p1[1]) / 6)} ${p2[0]} ${p2[1]}`;
  }
  return { pts, line: d, area: `${d} L ${W} ${H} L 0 ${H} Z` };
}

const naira = (n: number) => "₦" + Math.round(n).toLocaleString("en-NG");
const short = (n: number) => (n >= 1e6 ? `₦${(n / 1e6).toFixed(2)}M` : `₦${Math.round(n / 1000)}k`);

function Rolling({ value, format }: { value: number; format: (n: number) => string }) {
  const mv = useMotionValue(value);
  const text = useTransform(mv, format);
  const still = useStill();
  useEffect(() => { const c = animate(mv, value, still ? { duration: 0 } : { duration: 0.6, ease: [0.23, 1, 0.32, 1] }); return () => c.stop(); }, [value, mv, still]);
  return <motion.span>{text}</motion.span>;
}

function Spark({ values, tone }: { values: number[]; tone: "pos" | "neg" }) {
  const g = useMemo(() => geometry(values), [values]);
  return <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className={`${s.spark} ${s[tone]}`} aria-hidden="true"><path d={g.line} /></svg>;
}

const txns: [IconName, string, string, number][] = [
  ["arrowDown", "Oshoke Studio", "Invoice INV-0042 paid", 450000],
  ["bag", "Kora Coffee", "Card ·· 4821", -4500],
  ["users", "Payroll", "6 people", -1860000],
  ["bolt", "Abuja Electricity", "Direct debit", -38200],
];

export default function MoneyDashboard() {
  const [range, setRange] = useState<Range>("30D");
  const [hover, setHover] = useState<number | null>(null);
  const svg = useRef<SVGSVGElement>(null);
  const still = useStill();
  const d = data[range];
  const g = useMemo(() => geometry(d.values), [d]);
  const i = hover ?? N - 1;
  const morph = still ? { duration: 0 } : { duration: 0.55, ease: [0.77, 0, 0.175, 1] as const };

  const pick = (clientX: number) => {
    const b = svg.current?.getBoundingClientRect();
    if (b) setHover(Math.max(0, Math.min(N - 1, Math.round(((clientX - b.left) / b.width) * (N - 1)))));
  };

  return (
    <WebShell
      dark
      active="Overview"
      title="Overview"
      actions={<>
        <div className={s.seg} role="radiogroup" aria-label="Range">
          {(["7D", "30D", "12M"] as Range[]).map((r) => (
            <button key={r} type="button" role="radio" aria-checked={range === r} onClick={() => { setRange(r); setHover(null); }}>
              {range === r && <motion.span layoutId="md-seg" className={s.segPill} transition={still ? { duration: 0 } : { type: "spring", bounce: 0.15, duration: 0.4 }} />}
              <span className={s.segText}>{r}</span>
            </button>
          ))}
        </div>
        <span className={s.btn} aria-hidden="true"><Icon name="download" size={15} />Export</span>
      </>}
    >
      <div className={s.body}>
        <section className={s.chartCard} aria-label="Balance">
          <div className={s.chartHead}>
            <div>
              <span className={s.k}>Total balance</span>
              <b className={s.big}><Rolling value={d.values[i]} format={naira} /></b>
              <span className={s.when} aria-live="polite">{hover === null ? <><span className={s.up}>+{d.change}%</span> this {range === "7D" ? "week" : range === "30D" ? "month" : "year"}</> : d.labels[i]}</span>
            </div>
          </div>
          <div className={s.plot}>
            <svg
              ref={svg}
              viewBox={`0 0 ${W} ${H}`}
              preserveAspectRatio="none"
              className={s.chart}
              tabIndex={0}
              role="img"
              aria-label={`Balance over ${range}, from ${naira(d.values[0])} to ${naira(d.values[N - 1])}. Use the arrow keys to read each point.`}
              onPointerMove={(e) => pick(e.clientX)}
              onPointerLeave={() => setHover(null)}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft") { e.preventDefault(); setHover(Math.max(0, i - 1)); }
                if (e.key === "ArrowRight") { e.preventDefault(); setHover(Math.min(N - 1, i + 1)); }
                if (e.key === "Escape") setHover(null);
              }}
              onBlur={() => setHover(null)}
            >
              <defs>
                <linearGradient id="md-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--w-accent)" stopOpacity=".32" /><stop offset="1" stopColor="var(--w-accent)" stopOpacity="0" /></linearGradient>
              </defs>
              {[0.25, 0.5, 0.75].map((y) => <line key={y} x1="0" x2={W} y1={H * y} y2={H * y} className={s.grid} />)}
              <motion.path initial={false} animate={{ d: g.area }} transition={morph} fill="url(#md-fill)" />
              <motion.path initial={false} animate={{ d: g.line }} transition={morph} className={s.line} />
            </svg>
            {hover !== null && (
              <>
                <span className={s.cross} style={{ left: `${(g.pts[i][0] / W) * 100}%` }} aria-hidden="true" />
                <span className={s.dot} style={{ left: `${(g.pts[i][0] / W) * 100}%`, top: `${(g.pts[i][1] / H) * 100}%` }} aria-hidden="true" />
              </>
            )}
          </div>
          <div className={s.ticks} aria-hidden="true">{d.ticks.map((t) => <span key={t}>{t}</span>)}</div>
        </section>

        <div className={s.kpis}>
          <div className={s.kpi}>
            <span className={s.k}><Icon name="arrowDown" size={14} /> Money in</span>
            <b><Rolling value={d.inflow} format={short} /></b>
            <Spark values={d.values} tone="pos" />
          </div>
          <div className={s.kpi}>
            <span className={s.k}><Icon name="send" size={14} /> Money out</span>
            <b><Rolling value={d.outflow} format={short} /></b>
            <Spark values={[...d.values].reverse()} tone="neg" />
          </div>
        </div>

        <section className={s.list} aria-label="Recent transactions">
          <div className={s.listHead}><b>Recent</b><span>View all</span></div>
          <ul>
            {txns.map(([icon, name, sub, amt]) => (
              <li key={name}>
                <span className={s.ic} aria-hidden="true"><Icon name={icon} size={15} /></span>
                <span className={s.txt}><b>{name}</b><span>{sub}</span></span>
                <b className={amt > 0 ? s.inAmt : undefined}>{amt > 0 ? "+" : "−"}{naira(Math.abs(amt))}</b>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </WebShell>
  );
}
