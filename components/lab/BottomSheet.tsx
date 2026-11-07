"use client";

import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import s from "./BottomSheet.module.css";
import { tap, useStill } from "./util";

// Three stops, measured from the top of the screen.
export default function BottomSheet() {
  const box = useRef<HTMLDivElement>(null);
  const [h, setH] = useState(720);
  const stops = [h - 150, h * 0.48, 70]; // peek, half, full
  const [stop, setStop] = useState(0);
  const y = useMotionValue(h - 150);
  const dim = useTransform(y, [stops[0], stops[2]], [0, 0.5]);
  const still = useStill();

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => { const nh = el.clientHeight; setH(nh); y.set(nh - 150); };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [y]);

  const go = (i: number, velocity = 0) => {
    setStop(i);
    tap();
    animate(y, stops[i], still ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 38, velocity });
  };

  const names = ["peek", "half", "full"];

  return (
    <div className={s.screen} ref={box}>
      <div className={s.map} aria-hidden="true">
        <svg viewBox="0 0 360 720" preserveAspectRatio="xMidYMid slice">
          <path d="M-20 180 C 80 140, 160 260, 380 200" className={s.road} />
          <path d="M60 -20 C 90 200, 40 420, 120 760" className={s.road} />
          <path d="M-20 470 C 120 430, 230 520, 380 470" className={s.roadSm} />
          <path d="M250 -20 C 230 240, 300 420, 260 760" className={s.roadSm} />
          <ellipse cx="200" cy="330" rx="70" ry="44" className={s.lake} />
        </svg>
        <span className={s.pin} />
      </div>
      <motion.div className={s.dim} style={{ opacity: dim }} onClick={() => go(0)} aria-hidden="true" />
      <motion.section
        className={s.sheet}
        style={{ y }}
        drag="y"
        dragConstraints={{ top: stops[2], bottom: stops[0] }}
        dragElastic={0.08}
        dragMomentum={false}
        onDragEnd={(_, info) => {
          // Project where a flick would land, then pick the nearest stop.
          const projected = y.get() + info.velocity.y * 0.2;
          const nearest = stops.reduce((best, st, i) => (Math.abs(st - projected) < Math.abs(stops[best] - projected) ? i : best), 0);
          go(nearest, info.velocity.y);
        }}
        aria-label="Place details"
      >
        <button type="button" className={s.handle} onClick={() => go((stop + 1) % 3)} aria-label={`Sheet is at ${names[stop]}. Move to ${names[(stop + 1) % 3]}`}><i /></button>
        <div className={s.title}>
          <div><h2>Jabi Lake Park</h2><p>Park · 2.4 km · Open until 10pm</p></div>
          <span className={s.rating}>4.7 ★</span>
        </div>
        <div className={s.actions} aria-hidden="true"><span className={s.primary}>Directions</span><span>Save</span><span>Share</span></div>
        <div className={s.photos} aria-hidden="true"><i /><i /><i /></div>
        <h3>About</h3>
        <p className={s.about}>A lakeside park with a walking loop, boat rides at weekends and food stalls along the north shore. Busiest after 5pm.</p>
        <h3>Popular times</h3>
        <div className={s.bars} aria-hidden="true">{[20, 35, 30, 45, 60, 85, 70, 40].map((v, i) => <i key={i} style={{ height: v + "%" }} />)}</div>
      </motion.section>
    </div>
  );
}
