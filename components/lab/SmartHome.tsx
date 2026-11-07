"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import s from "./SmartHome.module.css";
import { tap, useStill } from "./util";

export default function SmartHome() {
  const [temp, setTemp] = useState(22);
  const [dir, setDir] = useState(1);
  const [lights, setLights] = useState(true);
  const [bright, setBright] = useState(70);
  const [fan, setFan] = useState(false);
  const [scene, setScene] = useState("Evening");
  const still = useStill();

  const change = (d: number) => {
    setDir(d);
    setTemp((t) => Math.min(30, Math.max(16, t + d)));
    tap(6);
  };

  return (
    <div className={s.screen} data-lights={lights}>
      <header className={s.head}><p>Home · Living room</p><h2>Good evening</h2></header>

      <div className={s.grid}>
        <section className={`${s.tile} ${s.temp}`} aria-label="Air conditioning">
          <span className={s.k}>Cooling to</span>
          <div className={s.tempRow}>
            <button type="button" className={s.step} onClick={() => change(-1)} aria-label="Cooler">−</button>
            <span className={s.value}>
              <span className="sr-only" aria-live="polite">{temp} degrees</span>
              <AnimatePresence mode="popLayout" initial={false} custom={dir}>
                <motion.b
                  key={temp}
                  className="tnum"
                  custom={dir}
                  initial={{ y: still ? 0 : dir > 0 ? 18 : -18, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: still ? 0 : dir > 0 ? -18 : 18, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 36 }}
                  aria-hidden="true"
                >
                  {temp}°
                </motion.b>
              </AnimatePresence>
            </span>
            <button type="button" className={s.step} onClick={() => change(1)} aria-label="Warmer">+</button>
          </div>
          <span className={s.sub}>Room is 26° · Eco on</span>
        </section>

        <section className={`${s.tile} ${s.lightsTile}`} aria-label="Lights">
          <button type="button" className={s.toggle} aria-pressed={lights} onClick={() => { setLights(!lights); tap(); }}>
            <span className={s.bulb} aria-hidden="true">💡</span>
            <span><b>Lights</b><span>{lights ? `${bright}%` : "Off"}</span></span>
          </button>
          <input type="range" min={5} max={100} value={bright} disabled={!lights} onChange={(e) => setBright(Number(e.target.value))} className={s.range} style={{ ["--p" as string]: `${bright}%` }} aria-label="Brightness" />
        </section>

        <section className={s.tile} aria-label="Fan">
          <button type="button" className={s.toggle} aria-pressed={fan} onClick={() => { setFan(!fan); tap(); }}>
            <span className={`${s.fan} ${fan ? s.spin : ""}`} aria-hidden="true">✢</span>
            <span><b>Fan</b><span>{fan ? "Speed 2" : "Off"}</span></span>
          </button>
        </section>

        <section className={s.tile} aria-label="Front door">
          <div className={s.toggle} aria-hidden="true"><span className={s.lock}>🔒</span><span><b>Front door</b><span>Locked</span></span></div>
        </section>
      </div>

      <div className={s.scenes} role="radiogroup" aria-label="Scenes">
        {["Morning", "Evening", "Movie", "Away"].map((n) => (
          <button key={n} type="button" role="radio" aria-checked={scene === n} className={s.scene} onClick={() => setScene(n)}>{n}</button>
        ))}
      </div>
    </div>
  );
}
