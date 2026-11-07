"use client";

import { motion } from "motion/react";
import { useMemo, useState } from "react";
import s from "./HabitHeatmap.module.css";
import { tap, useStill } from "./util";

const WEEKS = 12;
const DAYS = WEEKS * 7;
const today = new Date(2026, 10, 7); // the demo's "today"
const dateOf = (i: number) => { const d = new Date(today); d.setDate(d.getDate() - (DAYS - 1 - i)); return d; };
const label = (d: Date) => d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });

export default function HabitHeatmap() {
  // A believable history: mostly done, with a few gaps, and the last stretch unbroken.
  const initial = useMemo(() => Array.from({ length: DAYS }, (_, i) => {
    if (i > DAYS - 9) return i < DAYS - 1; // last week done, today not yet
    const n = Math.abs(Math.sin(i * 78.233) * 43758.5453) % 1;
    return n > 0.28;
  }), []);
  const [done, setDone] = useState(initial);
  const [bumped, setBumped] = useState<number | null>(null);
  const still = useStill();

  const streak = (() => { let n = 0; for (let i = DAYS - 1; i >= 0; i--) { if (done[i]) n++; else if (i === DAYS - 1) continue; else break; } return n; })();
  const best = (() => { let b = 0, c = 0; for (const d of done) { c = d ? c + 1 : 0; b = Math.max(b, c); } return b; })();
  const total = done.filter(Boolean).length;

  const toggle = (i: number) => {
    setDone((d) => d.map((v, j) => (j === i ? !v : v)));
    setBumped(i);
    tap(done[i] ? 6 : 14);
  };

  return (
    <div className={s.screen}>
      <header className={s.head}>
        <span className={s.icon} aria-hidden="true">📖</span>
        <div><h2>Read 20 pages</h2><p>Every day · since August</p></div>
      </header>
      <div className={s.stats}>
        <div><b className="tnum">{streak}</b><span>day streak</span></div>
        <div><b className="tnum">{best}</b><span>best streak</span></div>
        <div><b className="tnum">{Math.round((total / DAYS) * 100)}%</b><span>of days</span></div>
      </div>
      <div className={s.grid} role="group" aria-label="Last 12 weeks">
        {done.map((v, i) => (
          <motion.button
            key={i}
            type="button"
            className={`${s.day} ${v ? s.on : ""} ${i === DAYS - 1 ? s.today : ""}`}
            onClick={() => toggle(i)}
            aria-pressed={v}
            aria-label={`${label(dateOf(i))}${i === DAYS - 1 ? ", today" : ""}`}
            animate={bumped === i && !still ? { scale: [1, 0.7, 1.15, 1] } : { scale: 1 }}
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
          />
        ))}
      </div>
      <div className={s.legend} aria-hidden="true"><span>12 weeks ago</span><span>Today</span></div>
      <button type="button" className={s.cta} onClick={() => toggle(DAYS - 1)}>{done[DAYS - 1] ? "Done for today ✓" : "Mark today as done"}</button>
    </div>
  );
}
