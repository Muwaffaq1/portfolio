"use client";

import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import s from "./CardStack.module.css";
import { snappy, tap, useStill } from "./util";

const cards = [
  { name: "Everyday", brand: "Mint", last: "4821", balance: 248560, style: s.mint },
  { name: "Savings", brand: "Glacier", last: "0193", balance: 1250000, style: s.glacier },
  { name: "Travel", brand: "Coral", last: "7710", balance: 86400, style: s.coral },
  { name: "Business", brand: "Onyx", last: "3002", balance: 3420900, style: s.onyx },
];

const naira = (n: number) => "₦" + Math.round(n).toLocaleString("en-NG");

export default function CardStack() {
  const [order, setOrder] = useState([0, 1, 2, 3]);
  const still = useStill();
  const bal = useMotionValue(cards[0].balance);
  const balText = useTransform(bal, naira);
  const front = cards[order[0]];

  useEffect(() => {
    const c = animate(bal, front.balance, still ? { duration: 0 } : { duration: 0.6, ease: [0.23, 1, 0.32, 1] });
    return () => c.stop();
  }, [front.balance, bal, still]);

  const bringToFront = (i: number) => {
    if (order[0] === i) return;
    setOrder([i, ...order.filter((x) => x !== i)]);
    tap();
  };
  const sendToBack = () => { setOrder([...order.slice(1), order[0]]); tap(); };

  return (
    <div className={s.screen}>
      <header className={s.head}><b>Cards</b><span>4 cards</span></header>
      <div className={s.deck}>
        {cards.map((c, i) => {
          const pos = order.indexOf(i);
          const isFront = pos === 0;
          return (
            <motion.button
              key={c.last}
              type="button"
              className={`${s.card} ${c.style}`}
              style={{ zIndex: 10 - pos }}
              animate={{ y: pos * -22, scale: 1 - pos * 0.06, opacity: pos > 2 ? 0.6 : 1 }}
              transition={still ? { duration: 0 } : snappy}
              drag={isFront ? "y" : false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.5}
              onDragEnd={(_, info) => { if (info.offset.y > 70 || info.velocity.y > 600) sendToBack(); }}
              onClick={() => bringToFront(i)}
              aria-label={`${c.name} card ending ${c.last}${isFront ? ", in front" : ". Bring to front"}`}
              aria-pressed={isFront}
            >
              <span className={s.cardTop}><b>{c.brand}</b><span>{c.name}</span></span>
              <span className={s.chip} aria-hidden="true" />
              <span className={s.cardBottom}><span className="tnum">•••• {c.last}</span><span className={s.network} aria-hidden="true"><i /><i /></span></span>
            </motion.button>
          );
        })}
      </div>
      <div className={s.balance} aria-live="polite">
        <span>{front.name} balance</span>
        <motion.b className="tnum">{balText}</motion.b>
      </div>
      <p className={s.hint}>Tap a card behind to bring it forward. Drag the front card down to send it back.</p>
    </div>
  );
}
