"use client";

import { animate, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import s from "./CardStack.module.css";
import { Icon, type IconName } from "./icons";
import { tap, useStill } from "./util";

const cards = [
  { name: "Everyday", kind: "Debit", last: "4821", balance: 248560, style: s.mint },
  { name: "Savings", kind: "Debit", last: "0193", balance: 1250000, style: s.glacier },
  { name: "Travel", kind: "Virtual", last: "7710", balance: 86400, style: s.coral },
  { name: "Business", kind: "Debit", last: "3002", balance: 3420900, style: s.onyx },
];
const activity: [IconName, string, string, string, string][] = [
  ["bag", "Kora Coffee", "Today, 08:12", "−₦4,500", s.brown],
  ["arrowDown", "Oshoke", "Yesterday · Transfer", "+₦85,000", s.green],
  ["car", "Ride to Wuse", "Yesterday", "−₦3,200", s.blue],
];
const actions: [IconName, string][] = [["plus", "Top up"], ["snow", "Freeze"], ["eye", "Details"], ["gear", "Settings"]];
const naira = (n: number) => "₦" + Math.round(n).toLocaleString("en-NG");

export default function CardStack() {
  const [order, setOrder] = useState([0, 1, 2, 3]);
  const still = useStill();
  const bal = useMotionValue(cards[0].balance);
  const balText = useTransform(bal, naira);
  const front = cards[order[0]];

  // Tilt: pointer position → springs, so the card leans toward you and settles back softly.
  const px = useMotionValue(0), py = useMotionValue(0);
  const rx = useSpring(useTransform(py, [-0.5, 0.5], [10, -10]), { stiffness: 220, damping: 22 });
  const ry = useSpring(useTransform(px, [-0.5, 0.5], [-14, 14]), { stiffness: 220, damping: 22 });
  const frontEl = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const c = animate(bal, front.balance, still ? { duration: 0 } : { duration: 0.7, ease: [0.23, 1, 0.32, 1] });
    return () => c.stop();
  }, [front.balance, bal, still]);

  const onMove = (e: React.PointerEvent) => {
    const el = frontEl.current;
    if (!el || still || e.pointerType !== "mouse") return;
    const b = el.getBoundingClientRect();
    const x = (e.clientX - b.left) / b.width, y = (e.clientY - b.top) / b.height;
    px.set(x - 0.5); py.set(y - 0.5);
    // Glare and foil read these directly: no React re-render per pointer move.
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
    el.style.setProperty("--hue", `${Math.round(x * 120 + y * 60)}deg`);
  };
  const onLeave = () => { px.set(0); py.set(0); frontEl.current?.style.setProperty("--glare", "0"); };
  const onEnter = () => frontEl.current?.style.setProperty("--glare", "1");

  const bringToFront = (i: number) => {
    if (order[0] === i) return;
    setOrder([i, ...order.filter((x) => x !== i)]);
    tap();
  };
  const sendToBack = () => { setOrder([...order.slice(1), order[0]]); tap(); };

  return (
    <div className={s.screen}>
      <header className={s.head}>
        <b>Cards</b>
        <span className={s.add} aria-hidden="true"><Icon name="plus" size={20} /></span>
      </header>
      <div className={s.deck} onPointerMove={onMove} onPointerLeave={onLeave} onPointerEnter={onEnter}>
        {cards.map((c, i) => {
          const pos = order.indexOf(i);
          const isFront = pos === 0;
          return (
            <motion.button
              key={c.last}
              ref={isFront ? (el) => { frontEl.current = el; } : undefined}
              type="button"
              className={`${s.card} ${c.style}`}
              style={{ zIndex: 10 - pos, rotateX: isFront ? rx : 0, rotateY: isFront ? ry : 0, transformPerspective: 900 }}
              animate={{ y: pos * -22, scale: 1 - pos * 0.05 }}
              transition={still ? { duration: 0 } : { type: "spring", bounce: 0.18, duration: 0.55 }}
              drag={isFront ? "y" : false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.45}
              onDragEnd={(_, info) => { if (info.offset.y > 70 || info.velocity.y > 600) sendToBack(); }}
              onClick={() => bringToFront(i)}
              aria-label={`${c.name} card ending ${c.last}${isFront ? ", in front" : ". Bring to front"}`}
              aria-pressed={isFront}
            >
              <span className={s.texture} aria-hidden="true" />
              <span className={s.foil} aria-hidden="true" />
              <span className={s.glare} aria-hidden="true" />
              <span className={s.cardTop}>
                <span className={s.mark} aria-hidden="true"><i /><i /></span>
                <svg className={s.contactless} viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M8.5 7.5a6.5 6.5 0 010 9M12 5a10 10 0 010 14M15.5 2.5a13.5 13.5 0 010 19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
              </span>
              <span className={s.cardBottom}>
                <span><span className={s.cardName}>{c.name}</span><span className={s.number}>•• {c.last}</span></span>
                <span className={s.kind}>{c.kind}</span>
              </span>
            </motion.button>
          );
        })}
      </div>

      <section className={s.panel} aria-live="polite">
        <span className={s.k}>{front.name} balance</span>
        <motion.b className={s.balance}>{balText}</motion.b>
        <div className={s.actions} aria-hidden="true">
          {actions.map(([icon, label]) => <span key={label}><i><Icon name={icon} size={20} /></i>{label}</span>)}
        </div>
      </section>

      <section className={s.recent}>
        <h2>Recent</h2>
        <ul aria-label="Recent activity">
          {activity.map(([icon, n, d, a, tone]) => (
            <li key={n}>
              <span className={`${s.avatar} ${tone}`} aria-hidden="true"><Icon name={icon} size={18} /></span>
              <span className={s.txt}><b>{n}</b><span>{d}</span></span>
              <b className={a.startsWith("+") ? s.in : undefined}>{a}</b>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
