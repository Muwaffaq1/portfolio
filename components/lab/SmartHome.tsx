"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import s from "./SmartHome.module.css";
import { Icon, type IconName } from "./icons";
import { tap, useStill } from "./util";

const MIN = 16, MAX = 30, SWEEP = 270, START = 135; // degrees: the dial runs from bottom-left to bottom-right
const R = 92, CX = 120, CY = 120;
const round = (n: number) => Math.round(n * 100) / 100; // identical on server and client
const polar = (deg: number, r = R) => { const a = (deg * Math.PI) / 180; return [round(CX + r * Math.cos(a)), round(CY + r * Math.sin(a))] as const; };
const arc = (from: number, to: number, r = R) => {
  const [x1, y1] = polar(from, r), [x2, y2] = polar(to, r);
  return `M ${x1} ${y1} A ${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${x2} ${y2}`;
};
// Cool to warm: the colour of the room follows the number.
const tone = (t: number) => { const k = (t - MIN) / (MAX - MIN); return `hsl(${210 - k * 180} 85% ${55 + k * 5}%)`; };

export default function SmartHome() {
  const [temp, setTemp] = useState(22);
  const [dir, setDir] = useState(1);
  const [lights, setLights] = useState(true);
  const [bright, setBright] = useState(70);
  const [fan, setFan] = useState(false);
  const [scene, setScene] = useState("Evening");
  const svg = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);
  const still = useStill();

  const set = (v: number) => {
    const n = Math.min(MAX, Math.max(MIN, Math.round(v)));
    if (n !== temp) { setDir(n > temp ? 1 : -1); tap(5); }
    setTemp(n);
  };
  const fromPointer = (x: number, y: number) => {
    const b = svg.current!.getBoundingClientRect();
    const px = ((x - b.left) / b.width) * 240, py = ((y - b.top) / b.height) * 240;
    let deg = (Math.atan2(py - CY, px - CX) * 180) / Math.PI; // -180..180, 0 = right
    deg = (deg - START + 360) % 360; // 0 at the dial's start
    if (deg > SWEEP) deg = deg > SWEEP + (360 - SWEEP) / 2 ? 0 : SWEEP; // snap the dead zone to the nearest end
    set(MIN + (deg / SWEEP) * (MAX - MIN));
  };

  const k = (temp - MIN) / (MAX - MIN);
  const knobDeg = START + k * SWEEP;
  const [kx, ky] = polar(knobDeg);
  const col = tone(temp);

  return (
    <div className={s.screen} data-lights={lights} style={{ ["--tone" as string]: col, ["--bright" as string]: lights ? bright / 100 : 0 }}>
      <span className={s.lamp} aria-hidden="true" />
      <header className={s.head}><div><p>Living room</p><h2>Climate</h2></div><span className={s.headBtn} aria-hidden="true"><Icon name="more" size={20} stroke={3} /></span></header>

      <section className={s.dialCard} aria-label="Air conditioning">
        <svg
          ref={svg}
          viewBox="0 0 240 240"
          className={s.dial}
          role="slider"
          tabIndex={0}
          aria-label="Temperature"
          aria-valuemin={MIN}
          aria-valuemax={MAX}
          aria-valuenow={temp}
          aria-valuetext={`${temp} degrees`}
          onPointerDown={(e) => { dragging.current = true; (e.currentTarget as SVGSVGElement).setPointerCapture(e.pointerId); fromPointer(e.clientX, e.clientY); }}
          onPointerMove={(e) => { if (dragging.current) fromPointer(e.clientX, e.clientY); }}
          onPointerUp={() => { dragging.current = false; }}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowUp") { e.preventDefault(); set(temp + 1); }
            if (e.key === "ArrowLeft" || e.key === "ArrowDown") { e.preventDefault(); set(temp - 1); }
          }}
        >
          <defs>
            <linearGradient id="sh-grad" x1="0" y1="1" x2="1" y2="1"><stop offset="0" stopColor="hsl(210 85% 55%)" /><stop offset=".55" stopColor="hsl(150 70% 55%)" /><stop offset="1" stopColor="hsl(30 90% 60%)" /></linearGradient>
          </defs>
          {Array.from({ length: 29 }, (_, i) => { const d = START + (i / 28) * SWEEP; const [x1, y1] = polar(d, 112); const [x2, y2] = polar(d, i % 7 === 0 ? 104 : 108); return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} className={i / 28 <= k ? s.tickOn : s.tick} />; })}
          <path d={arc(START, START + SWEEP)} className={s.track} />
          <path d={arc(START, Math.max(START + 0.01, knobDeg))} className={s.fill} stroke="url(#sh-grad)" />
          <circle cx={kx} cy={ky} r="13" className={s.knob} />
          <circle cx={kx} cy={ky} r="5" fill={col} />
        </svg>
        <div className={s.center}>
          <span className={s.k}>Cooling to</span>
          <span className={s.value}>
            <span className="sr-only" aria-live="polite">{temp} degrees</span>
            <AnimatePresence mode="popLayout" initial={false} custom={dir}>
              <motion.b key={temp} className="tnum" initial={{ y: still ? 0 : dir * 22, opacity: 0, filter: "blur(4px)" }} animate={{ y: 0, opacity: 1, filter: "blur(0px)" }} exit={{ y: still ? 0 : dir * -22, opacity: 0, filter: "blur(4px)" }} transition={{ type: "spring", stiffness: 500, damping: 36 }} aria-hidden="true">{temp}°</motion.b>
            </AnimatePresence>
          </span>
          <span className={s.sub}>Room 26° · Eco</span>
        </div>
      </section>

      <div className={s.grid}>
        <section className={`${s.tile}`} aria-label="Lights">
          <button type="button" className={s.toggle} aria-pressed={lights} onClick={() => { setLights(!lights); tap(); }}>
            <span className={s.bulb} aria-hidden="true"><Icon name="bulb" size={20} /></span>
            <span><b>Lights</b><span>{lights ? `${bright}%` : "Off"}</span></span>
          </button>
          <input type="range" min={5} max={100} value={bright} disabled={!lights} onChange={(e) => setBright(Number(e.target.value))} className={s.range} style={{ ["--p" as string]: `${bright}%` }} aria-label="Brightness" />
        </section>
        <section className={`${s.tile}`} aria-label="Fan">
          <button type="button" className={s.toggle} aria-pressed={fan} onClick={() => { setFan(!fan); tap(); }}>
            <span className={s.fan} aria-hidden="true"><Icon name="fan" size={20} className={fan ? s.spin : undefined} /></span>
            <span><b>Fan</b><span>{fan ? "Speed 2" : "Off"}</span></span>
          </button>
        </section>
      </div>

      <div className={s.scenes} role="radiogroup" aria-label="Scenes">
        {([["Morning", "sunrise"], ["Evening", "sunset"], ["Movie", "tv"], ["Away", "lock"]] as [string, IconName][]).map(([n, icon]) => (
          <button key={n} type="button" role="radio" aria-checked={scene === n} className={s.scene} onClick={() => { setScene(n); tap(); }}><Icon name={icon} size={20} />{n}</button>
        ))}
      </div>
    </div>
  );
}
