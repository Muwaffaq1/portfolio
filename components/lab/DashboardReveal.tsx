"use client";

import { animate, motion, useInView, useMotionValue, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import s from "./DashboardReveal.module.css";
import { useStill } from "./util";

const ease = [0.23, 1, 0.32, 1] as const;

function Count({ to, prefix = "", suffix = "", run, delay }: { to: number; prefix?: string; suffix?: string; run: number; delay: number }) {
  const v = useMotionValue(0);
  const text = useTransform(v, (n) => `${prefix}${Math.round(n).toLocaleString("en-NG")}${suffix}`);
  const still = useStill();
  useEffect(() => {
    if (run === 0) return;
    v.set(0);
    const c = animate(v, to, still ? { duration: 0 } : { duration: 0.8, ease, delay });
    return () => c.stop();
  }, [run, to, v, still, delay]);
  return <motion.b className="tnum">{text}</motion.b>;
}

const line = "M0 70 C 30 66, 50 40, 80 46 S 130 62, 160 38 S 220 18, 250 28 S 300 12, 320 8";
const bars = [42, 58, 36, 70, 64, 88, 76];

export default function DashboardReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [run, setRun] = useState(0);
  const still = useStill();
  useEffect(() => { if (inView) setRun(1); }, [inView]);

  const k = run; // remount the drawn pieces on replay
  return (
    <div className={s.app} ref={ref}>
      <div className={s.top}><h2>This week</h2><button type="button" onClick={() => setRun((r) => r + 1)}>Replay</button></div>
      <div className={s.kpis}>
        <div><span>Revenue</span><Count to={4280000} prefix="₦" run={run} delay={0} /><em className={s.up}>+12%</em></div>
        <div><span>Orders</span><Count to={1284} run={run} delay={0.06} /><em className={s.up}>+8%</em></div>
        <div><span>Refunds</span><Count to={3} suffix="%" run={run} delay={0.12} /><em className={s.down}>−1 pt</em></div>
      </div>
      <div className={s.charts}>
        <div className={s.card}>
          <span className={s.label}>Revenue, last 30 days</span>
          <svg viewBox="0 0 320 80" className={s.lineSvg} aria-hidden="true" key={`l${k}`}>
            <motion.path d={line} className={s.line} initial={{ pathLength: still ? 1 : 0 }} animate={{ pathLength: run ? 1 : 0 }} transition={{ duration: still ? 0 : 0.9, ease, delay: 0.15 }} />
          </svg>
        </div>
        <div className={s.card}>
          <span className={s.label}>Orders by day</span>
          <div className={s.bars} aria-hidden="true" key={`b${k}`}>
            {bars.map((h, i) => (
              <motion.i key={i} style={{ height: `${h}%`, originY: 1 }} initial={{ scaleY: still ? 1 : 0 }} animate={{ scaleY: run ? 1 : 0 }} transition={{ duration: still ? 0 : 0.5, ease, delay: 0.2 + i * 0.04 }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
