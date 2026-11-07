"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import s from "./PrayerTimes.module.css";

// Sample times for Abuja in early November (not live).
const prayers = [
  { name: "Fajr", ar: "الفجر", time: "05:07" },
  { name: "Sunrise", ar: "الشروق", time: "06:20" },
  { name: "Dhuhr", ar: "الظهر", time: "12:05" },
  { name: "Asr", ar: "العصر", time: "15:24" },
  { name: "Maghrib", ar: "المغرب", time: "17:53" },
  { name: "Isha", ar: "العشاء", time: "19:04" },
];
const mins = (hhmm: string) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };

// Great-circle initial bearing from Abuja to the Kaaba, in degrees from north.
const toRad = (d: number) => (d * Math.PI) / 180;
const QIBLA = (() => {
  const [φ1, λ1, φ2, λ2] = [9.0765, 7.3986, 21.4225, 39.8262].map(toRad);
  const y = Math.sin(λ2 - λ1) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);
  return (((Math.atan2(y, x) * 180) / Math.PI) + 360) % 360;
})();

export default function PrayerTimes() {
  const [now, setNow] = useState<number | null>(null);
  const heading = useMotionValue(0); // where the phone points, degrees from north
  const smooth = useSpring(heading, { stiffness: 220, damping: 26 });
  const dial = useTransform(smooth, (h) => -h);
  const arrow = useTransform(smooth, (h) => QIBLA - h);
  const [headingNow, setHeadingNow] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const drag = useRef<{ start: number; from: number } | null>(null);

  useEffect(() => {
    const tick = () => { const d = new Date(); setNow(d.getHours() * 60 + d.getMinutes() + d.getSeconds() / 60); };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => heading.on("change", (v) => setHeadingNow(Math.round(((v % 360) + 360) % 360))), [heading]);

  const t = now ?? mins("13:30");
  const list = prayers.filter((p) => p.name !== "Sunrise");
  const nextIdx = list.findIndex((p) => mins(p.time) > t);
  const next = nextIdx === -1 ? list[0] : list[nextIdx];
  const prev = nextIdx <= 0 ? list[list.length - 1] : list[nextIdx - 1];
  const nextAt = mins(next.time) + (nextIdx === -1 ? 1440 : 0);
  const prevAt = mins(prev.time) - (nextIdx === 0 ? 1440 : 0);
  const left = nextAt - t;
  const progress = Math.min(1, Math.max(0, (t - prevAt) / (nextAt - prevAt)));
  const R = 64, C = 2 * Math.PI * R;
  const hh = Math.floor(left / 60), mm = Math.floor(left % 60), ss = Math.floor((left * 60) % 60);

  const angleAt = (x: number, y: number) => {
    const b = box.current!.getBoundingClientRect();
    return (Math.atan2(x - (b.left + b.width / 2), -(y - (b.top + b.height / 2))) * 180) / Math.PI;
  };

  return (
    <div className={s.screen}>
      <header className={s.head}><p>Abuja · Sample times</p><h2>Prayer times</h2></header>

      <div className={s.next}>
        <svg viewBox="0 0 150 150" className={s.ring} aria-hidden="true">
          <circle cx="75" cy="75" r={R} className={s.track} />
          <circle cx="75" cy="75" r={R} className={s.fill} strokeDasharray={C} strokeDashoffset={C * (1 - progress)} />
        </svg>
        <div className={s.nextText} aria-live="off">
          <span>Next</span>
          <b>{next.name}</b>
          <span className="tnum">{now === null ? "--:--" : `${hh > 0 ? `${hh}h ` : ""}${String(mm).padStart(2, "0")}m ${String(ss).padStart(2, "0")}s`}</span>
        </div>
      </div>

      <ul className={s.list}>
        {prayers.map((p) => (
          <li key={p.name} className={p.name === next.name ? s.current : p.name === "Sunrise" ? s.muted : undefined}>
            <span><b>{p.name}</b><span lang="ar" dir="rtl" className={s.ar}>{p.ar}</span></span>
            <span className="tnum">{p.time}</span>
          </li>
        ))}
      </ul>

      <div className={s.compassRow}>
        <div
          ref={box}
          className={s.compass}
          role="slider"
          tabIndex={0}
          aria-label="Phone direction. The arrow points to the qibla"
          aria-valuemin={0}
          aria-valuemax={359}
          aria-valuenow={headingNow}
          aria-valuetext={`Facing ${headingNow}°. Qibla is ${Math.round(QIBLA)}° from north`}
          onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); drag.current = { start: angleAt(e.clientX, e.clientY), from: heading.get() }; }}
          onPointerMove={(e) => { if (drag.current) heading.set(drag.current.from - (angleAt(e.clientX, e.clientY) - drag.current.start)); }}
          onPointerUp={() => { drag.current = null; }}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") heading.set(heading.get() + 10);
            if (e.key === "ArrowLeft") heading.set(heading.get() - 10);
          }}
        >
          <motion.div className={s.dial} style={{ rotate: dial }} aria-hidden="true">
            <span className={s.n}>N</span><span className={s.e}>E</span><span className={s.s}>S</span><span className={s.w}>W</span>
          </motion.div>
          <motion.div className={s.arrow} style={{ rotate: arrow }} aria-hidden="true"><i /><b>🕋</b></motion.div>
        </div>
        <div className={s.compassText}><b className="tnum">{Math.round(QIBLA)}°</b><span>Qibla from north. Drag the compass to turn it.</span></div>
      </div>
    </div>
  );
}
