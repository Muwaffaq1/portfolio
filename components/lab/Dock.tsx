"use client";

import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import s from "./Dock.module.css";
import { tap, useStill } from "./util";

const apps = [
  { name: "Notes", bg: "linear-gradient(160deg,#ffe58a,#f5b72f)", glyph: "✎" },
  { name: "Mail", bg: "linear-gradient(160deg,#7cc4ff,#2d7ff9)", glyph: "✉" },
  { name: "Music", bg: "linear-gradient(160deg,#ff8a8a,#e5364d)", glyph: "♪" },
  { name: "Maps", bg: "linear-gradient(160deg,#9be59b,#2fa85a)", glyph: "◭" },
  { name: "Photos", bg: "conic-gradient(from 90deg,#ffb347,#ff6f61,#6fb1fc,#7be495,#ffb347)", glyph: "" },
  { name: "Wallet", bg: "linear-gradient(160deg,#3b3b3b,#111)", glyph: "▤" },
  { name: "Weather", bg: "linear-gradient(160deg,#9fd3ff,#4e8cf7)", glyph: "☀" },
];

function Icon({ app, mouseX, still, base }: { app: (typeof apps)[number]; mouseX: MotionValue<number>; still: boolean; base: number }) {
  const ref = useRef<HTMLButtonElement>(null);
  const distance = useTransform(mouseX, (x) => {
    const b = ref.current?.getBoundingClientRect();
    return b ? x - (b.left + b.width / 2) : Infinity;
  });
  const target = useTransform(distance, [-160, 0, 160], [base, still ? base : base * 1.75, base]);
  const size = useSpring(target, { stiffness: 320, damping: 26, mass: 0.6 });
  return (
    <motion.button
      ref={ref}
      type="button"
      className={s.icon}
      style={{ width: size, height: size, background: app.bg }}
      whileTap={still ? undefined : { y: [0, -14, 0], transition: { duration: 0.4 } }}
      onClick={() => tap()}
      aria-label={app.name}
    >
      <span aria-hidden="true">{app.glyph}</span>
      <span className={s.tip} aria-hidden="true">{app.name}</span>
    </motion.button>
  );
}

export default function Dock() {
  const mouseX = useMotionValue(Infinity);
  const still = useStill();
  // Smaller icons on narrow screens so all seven fit; touch screens get the tap bounce instead.
  const [base, setBase] = useState(48);
  useEffect(() => { setBase(matchMedia("(max-width: 480px)").matches ? 36 : 48); }, []);
  return (
    <div className={s.wrap}>
      <div className={s.desktop} aria-hidden="true"><b>Hover along the dock</b><span>On a phone, tap an icon</span></div>
      <motion.nav className={s.dock} onMouseMove={(e) => mouseX.set(e.clientX)} onMouseLeave={() => mouseX.set(Infinity)} aria-label="Apps">
        {apps.map((a) => <Icon key={a.name} app={a} mouseX={mouseX} still={still} base={base} />)}
      </motion.nav>
    </div>
  );
}
