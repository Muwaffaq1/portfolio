"use client";

import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import s from "./BottomSheet.module.css";
import { Icon, type IconName } from "./icons";
import { tap, useStill } from "./util";

// A small drawn photo: sky, far trees, water and a jetty, in three times of day.
function Photo({ v }: { v: 0 | 1 | 2 }) {
  const sky = [["#bfe0f5", "#eaf5fb"], ["#f7c58f", "#fde9cf"], ["#9ec7a5", "#d6ead2"]][v];
  return (
    <svg viewBox="0 0 120 90" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs><linearGradient id={`sky${v}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={sky[0]} /><stop offset="1" stopColor={sky[1]} /></linearGradient></defs>
      <rect width="120" height="90" fill={`url(#sky${v})`} />
      {v === 1 && <circle cx="84" cy="40" r="10" fill="#fff1d6" />}
      <path d="M0 48 Q10 36 20 46 T40 44 T60 42 T80 46 T100 40 T120 46 V60 H0z" fill={v === 2 ? "#3f7a4f" : "#5d8f62"} />
      <rect y="56" width="120" height="34" fill={v === 1 ? "#d79b62" : "#7fb3cf"} />
      <path d="M0 62 H120 M10 70 H60 M50 78 H110" stroke="#fff" strokeOpacity=".35" strokeWidth="1.2" />
      {v !== 2 && <path d="M70 56 L94 84 M78 56 L102 84" stroke="#6b4a2b" strokeWidth="2" />}
      {v === 2 && <g fill="#2f5e3c"><circle cx="30" cy="40" r="14" /><circle cx="48" cy="34" r="16" /><rect x="38" y="44" width="3" height="16" fill="#5a3b22" /></g>}
    </svg>
  );
}

const actions: [IconName, string, string?][] = [["car", "12 min", "go"], ["phone", "Call"], ["globe", "Website"], ["more", "More"]];

// Three stops, measured from the top of the screen.
export default function BottomSheet() {
  const box = useRef<HTMLDivElement>(null);
  const [h, setH] = useState(760);
  const PEEK = 236;
  const stops = [h - PEEK, h * 0.42, 60]; // peek, half, full
  const [stop, setStop] = useState(0);
  const y = useMotionValue(h - PEEK);
  const dim = useTransform(y, [stops[1], stops[2]], [0, 0.35]);
  const still = useStill();

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => { const nh = el.clientHeight; setH(nh); y.set(nh - PEEK); };
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
        <svg viewBox="0 0 375 760" preserveAspectRatio="xMidYMid slice">
          <rect width="375" height="760" fill="#f3f1ec" />
          {/* City blocks */}
          <g fill="#e8e5de">
            {Array.from({ length: 30 }, (_, i) => <rect key={i} x={(i % 5) * 80 - 10} y={Math.floor(i / 5) * 130 - 20} width="62" height="104" rx="4" />)}
          </g>
          {/* Parkland and the lake */}
          <path d="M120 230 C 190 190, 330 210, 360 300 C 390 400, 300 470, 200 460 C 110 450, 70 300, 120 230z" fill="#cfe8c4" />
          <path d="M165 280 C 210 250, 300 270, 310 330 C 320 390, 250 420, 200 405 C 150 390, 130 310, 165 280z" fill="#a9d3ec" />
          <path d="M-20 520 C 80 500, 200 560, 400 520" fill="none" stroke="#a9d3ec" strokeWidth="10" />
          {/* Roads: a light casing under a white fill, and one main road in yellow */}
          <g fill="none" strokeLinecap="round">
            <path d="M-20 160 H400 M60 -20 V780 M-20 600 H400 M300 -20 V780" stroke="#dcd8cf" strokeWidth="12" />
            <path d="M-20 160 H400 M60 -20 V780 M-20 600 H400 M300 -20 V780" stroke="#fff" strokeWidth="9" />
            <path d="M-20 90 C 120 120, 220 60, 400 110" stroke="#e8c76a" strokeWidth="12" />
            <path d="M-20 90 C 120 120, 220 60, 400 110" stroke="#fbe39a" strokeWidth="9" />
          </g>
          <g fontFamily="-apple-system, system-ui, sans-serif" fontSize="10" fill="#7d7a73" letterSpacing=".04em">
            <text x="210" y="342" fill="#4a86ad" fontStyle="italic">Jabi Lake</text>
            <text x="70" y="154">OBAFEMI AWOLOWO WAY</text>
            <text x="150" y="80" fill="#8a6d1f">AHMADU BELLO WAY</text>
          </g>
        </svg>
        <span className={s.pin}><Icon name="star" size={14} stroke={2.2} /></span>
        <span className={s.me} />
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
          <div><h2>Jabi Lake Park</h2><p>Park · Jabi, Abuja</p></div>
          <span className={s.close} aria-hidden="true"><Icon name="close" size={16} stroke={2.2} /></span>
        </div>
        <div className={s.actions} aria-hidden="true">
          {actions.map(([icon, label, kind]) => <span key={label} className={kind === "go" ? s.go : undefined}><Icon name={icon} size={20} stroke={kind === "go" ? 2 : 1.8} />{label}</span>)}
        </div>
        <dl className={s.facts}>
          <div><dt>Hours</dt><dd className={s.open}>Open</dd></div>
          <div><dt>Rating</dt><dd><Icon name="star" size={13} stroke={2.4} /> 4.7</dd></div>
          <div><dt>Distance</dt><dd>2.4 km</dd></div>
        </dl>
        <div className={s.photos} aria-hidden="true"><Photo v={0} /><Photo v={1} /><Photo v={2} /></div>
        <h3>About</h3>
        <p className={s.about}>A lakeside park with a walking loop, boat rides at weekends and food stalls along the north shore. Busiest after 5pm.</p>
        <h3>Popular times</h3>
        <div className={s.bars} aria-hidden="true">{[20, 35, 30, 45, 60, 85, 70, 40].map((v, i) => <i key={i} style={{ height: v + "%" }} />)}</div>
      </motion.section>
    </div>
  );
}
