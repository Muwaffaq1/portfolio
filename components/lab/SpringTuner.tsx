"use client";

import { animate, motion, useMotionValue } from "motion/react";
import { useMemo, useRef, useState } from "react";
import s from "./SpringTuner.module.css";
import { tap, useStill } from "./util";

type Spring = { stiffness: number; damping: number; mass: number };
const presets: Record<string, Spring> = {
  Gentle: { stiffness: 120, damping: 20, mass: 1 },
  Snappy: { stiffness: 520, damping: 40, mass: 1 },
  Bouncy: { stiffness: 300, damping: 10, mass: 1 },
};
const r1 = (n: number) => Math.round(n * 10) / 10;

// Simulate the spring from 0 to 1 and record where it is every few milliseconds.
function simulate({ stiffness, damping, mass }: Spring) {
  const dt = 1 / 600, total = 1.6, pts: number[] = [];
  let x = 0, v = 0, settled = total;
  for (let t = 0, i = 0; t <= total; t += dt, i++) {
    const a = (-stiffness * (x - 1) - damping * v) / mass;
    v += a * dt; x += v * dt;
    if (i % 8 === 0) pts.push(x);
    if (settled === total && Math.abs(x - 1) < 0.005 && Math.abs(v) < 0.05) settled = t;
  }
  return { pts, settled, peak: Math.max(...pts) };
}

const sliders: { key: keyof Spring; label: string; min: number; max: number; step: number; hint: string }[] = [
  { key: "stiffness", label: "Stiffness", min: 40, max: 800, step: 10, hint: "How hard it pulls back" },
  { key: "damping", label: "Damping", min: 4, max: 80, step: 1, hint: "How much it resists" },
  { key: "mass", label: "Mass", min: 0.3, max: 4, step: 0.1, hint: "How heavy it feels" },
];

export default function SpringTuner() {
  const [spring, setSpring] = useState<Spring>(presets.Bouncy);
  const x = useMotionValue(0), y = useMotionValue(0);
  const area = useRef<HTMLDivElement>(null);
  const still = useStill();
  const sim = useMemo(() => simulate(spring), [spring]);
  const W = 300, H = 120;
  const path = useMemo(() => {
    const top = Math.max(1.3, sim.peak);
    return sim.pts.map((p, i) => `${i ? "L" : "M"} ${r1((i / (sim.pts.length - 1)) * W)} ${r1(H - (p / top) * (H - 10))}`).join(" ");
  }, [sim]);
  const target = useMemo(() => r1(H - (1 / Math.max(1.3, sim.peak)) * (H - 10)), [sim]);

  const release = (vx = 0, vy = 0) => {
    const t = still ? { duration: 0 } : { type: "spring" as const, ...spring };
    animate(x, 0, { ...t, velocity: vx });
    animate(y, 0, { ...t, velocity: vy });
  };
  // Throw the ball from a corner, so you can see the spring without dragging.
  const play = () => { x.set(-120); y.set(-60); release(); tap(6); };

  const preset = Object.entries(presets).find(([, p]) => p.stiffness === spring.stiffness && p.damping === spring.damping && p.mass === spring.mass)?.[0];
  const overshoot = Math.max(0, Math.round((sim.peak - 1) * 100));

  return (
    <div className={s.wrap}>
      <div className={s.left}>
        <div ref={area} className={s.area}>
          <span className={s.target} aria-hidden="true" />
          <motion.button
            type="button"
            className={s.ball}
            style={{ x, y }}
            drag
            dragConstraints={area}
            dragElastic={0.2}
            dragMomentum={false}
            onDragEnd={(_, info) => release(info.velocity.x, info.velocity.y)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); play(); } }}
            whileDrag={{ scale: 1.08 }}
            aria-label="Spring ball. Drag and let go, or press Enter to throw it"
          />
          <p className={s.areaHint}>Drag the ball and let go</p>
        </div>
        <div className={s.graph}>
          <div className={s.graphHead}>
            <span>Position over time</span>
            <span className="tnum">{sim.settled >= 1.6 ? "Still moving at 1.6s" : `Settles in ${Math.round(sim.settled * 1000)}ms`}{overshoot ? ` · ${overshoot}% overshoot` : ""}</span>
          </div>
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className={s.svg} role="img" aria-label={`The spring overshoots by ${overshoot}% and settles in ${Math.round(sim.settled * 1000)} milliseconds`}>
            <line x1="0" x2={W} y1={target} y2={target} className={s.rest} />
            <path d={path} className={s.curve} />
          </svg>
        </div>
      </div>

      <div className={s.panel}>
        <div className={s.presets} role="radiogroup" aria-label="Presets">
          {Object.keys(presets).map((n) => (
            <button key={n} type="button" role="radio" aria-checked={preset === n} onClick={() => { setSpring(presets[n]); }}>{n}</button>
          ))}
        </div>
        {sliders.map((sl) => (
          <label key={sl.key} className={s.slider}>
            <span className={s.sliderHead}><b>{sl.label}</b><span className="tnum">{spring[sl.key]}</span></span>
            <input type="range" min={sl.min} max={sl.max} step={sl.step} value={spring[sl.key]} onChange={(e) => setSpring({ ...spring, [sl.key]: Number(e.target.value) })} style={{ ["--p" as string]: `${((spring[sl.key] - sl.min) / (sl.max - sl.min)) * 100}%` }} />
            <span className={s.sliderHint}>{sl.hint}</span>
          </label>
        ))}
        <button type="button" className={s.play} onClick={play}>Throw it</button>
        <code className={s.code}>{`{ type: "spring", stiffness: ${spring.stiffness}, damping: ${spring.damping}, mass: ${spring.mass} }`}</code>
      </div>
    </div>
  );
}
