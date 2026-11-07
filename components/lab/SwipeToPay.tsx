"use client";

import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import s from "./SwipeToPay.module.css";
import { tap, useStill } from "./util";

export default function SwipeToPay() {
  const track = useRef<HTMLDivElement>(null);
  const [max, setMax] = useState(240);
  const [paid, setPaid] = useState(false);
  const x = useMotionValue(0);
  const labelOpacity = useTransform(x, [0, max * 0.6], [1, 0]);
  const fill = useTransform(x, (v) => `${Math.max(0, v) + 56}px`);
  const still = useStill();

  useLayoutEffect(() => {
    const el = track.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setMax(el.clientWidth - 64));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  function finish() {
    setPaid(true);
    tap(20);
    animate(x, max, still ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 40 });
  }

  function reset() {
    setPaid(false);
    animate(x, 0, still ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 36 });
  }

  return (
    <div className={s.screen}>
      <div className={s.top}>
        <span className={s.logo} aria-hidden="true">K</span>
        <p className={s.k}>Paying</p>
        <h2 className={s.merchant}>Kora Coffee</h2>
        <p className={s.amount}>₦4,500<small>.00</small></p>
        <dl className={s.rows}>
          <div><dt>Flat white</dt><dd>₦3,000</dd></div>
          <div><dt>Banana bread</dt><dd>₦1,500</dd></div>
          <div><dt>From</dt><dd>Wallet ·· 4821</dd></div>
        </dl>
      </div>

      <div className={s.track} ref={track} data-paid={paid}>
        <motion.div className={s.fill} style={{ width: fill }} aria-hidden="true" />
        <motion.span className={s.label} style={{ opacity: paid ? 0 : labelOpacity }} aria-hidden="true">Swipe to pay ₦4,500</motion.span>
        {paid && <span className={s.done} role="status">Paid ₦4,500</span>}
        <motion.button
          type="button"
          className={s.knob}
          style={{ x }}
          drag={paid ? false : "x"}
          dragConstraints={{ left: 0, right: max }}
          dragElastic={{ left: 0, right: 0.12 }}
          dragMomentum={false}
          onDragEnd={(_, info) => {
            if (x.get() > max * 0.85 || (info.velocity.x > 900 && x.get() > max * 0.5)) finish();
            else animate(x, 0, { type: "spring", stiffness: 400, damping: 30, velocity: info.velocity.x });
          }}
          onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && !paid) { e.preventDefault(); finish(); } }}
          aria-label={paid ? "Paid" : "Pay ₦4,500 to Kora Coffee. Swipe right, or press Enter"}
          disabled={paid}
        >
          {paid ? (
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          )}
        </motion.button>
      </div>
      <span className={s.resetSlot}>{paid && <button type="button" className={s.reset} onClick={reset}>Pay again</button>}</span>
    </div>
  );
}
