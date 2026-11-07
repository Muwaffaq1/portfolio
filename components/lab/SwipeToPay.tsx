"use client";

import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import s from "./SwipeToPay.module.css";
import { Icon } from "./icons";
import { tap, useStill } from "./util";

const KNOB = 56, PAD = 4;

export default function SwipeToPay() {
  const track = useRef<HTMLDivElement>(null);
  const [max, setMax] = useState(260);
  const [paid, setPaid] = useState(false);
  const x = useMotionValue(0);
  const labelOpacity = useTransform(x, [0, max * 0.5], [1, 0]);
  const fill = useTransform(x, (v) => `${Math.max(0, v) + KNOB + PAD * 2}px`);
  const still = useStill();

  useLayoutEffect(() => {
    const el = track.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setMax(el.clientWidth - KNOB - PAD * 2));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  function finish() {
    tap(24);
    animate(x, max, still ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 40 });
    setTimeout(() => setPaid(true), still ? 0 : 220);
  }
  function reset() {
    setPaid(false);
    animate(x, 0, { duration: 0 });
  }

  return (
    <div className={s.screen}>
      <header className={s.nav}>
        <span className={s.round} aria-hidden="true"><Icon name="back" size={20} /></span>
        <b>Confirm payment</b>
        <span />
      </header>

      <div className={s.merchant}>
        <span className={s.logo} aria-hidden="true">
          <svg viewBox="0 0 32 32" width="30" height="30"><path d="M16 5c-5 0-8 5-8 11s3 11 8 11 8-5 8-11S21 5 16 5z" fill="#f3d3ac" /><path d="M16 6c-2 4 2 6 0 10s2 7 0 10" fill="none" stroke="#5a3418" strokeWidth="1.8" strokeLinecap="round" /></svg>
        </span>
        <b>Kora Coffee</b>
        <span>Wuse II, Abuja</span>
        <p className={s.amount}><span>₦</span>4,500</p>
      </div>

      <div className={s.list}>
        <div><span className={s.ic}><Icon name="card" /></span><span className={s.dt}>From</span><span className={s.dd}>Everyday ·· 4821</span><Icon name="chevron" size={16} className={s.chev} /></div>
        <div><span className={s.ic}><Icon name="receipt" /></span><span className={s.dt}>For</span><span className={s.dd}>Flat white, banana bread</span></div>
        <div><span className={s.ic}><Icon name="bolt" size={18} /></span><span className={s.dt}>Fee</span><span className={s.dd}>Free</span></div>
      </div>

      <div className={s.bottom}>
        <div className={s.track} ref={track}>
          <motion.div className={s.fill} style={{ width: fill }} aria-hidden="true" />
          <motion.span className={s.label} style={{ opacity: labelOpacity }} aria-hidden="true">
            <span className={s.shine}>Slide to pay ₦4,500</span>
          </motion.span>
          <motion.button
            type="button"
            className={s.knob}
            style={{ x }}
            drag={paid ? false : "x"}
            dragConstraints={{ left: 0, right: max }}
            dragElastic={{ left: 0, right: 0.1 }}
            dragMomentum={false}
            whileTap={{ scale: 0.95 }}
            onDragEnd={(_, info) => {
              if (x.get() > max * 0.85 || (info.velocity.x > 900 && x.get() > max * 0.5)) finish();
              else animate(x, 0, { type: "spring", stiffness: 420, damping: 32, velocity: info.velocity.x });
            }}
            onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && !paid) { e.preventDefault(); finish(); } }}
            aria-label="Pay ₦4,500 to Kora Coffee. Slide right, or press Enter"
          >
            <Icon name="arrowRight" size={22} stroke={2.2} />
          </motion.button>
        </div>
        <p className={s.secure}><Icon name="faceid" size={16} /> Face ID confirms when you let go</p>
      </div>

      <AnimatePresence>
        {paid && (
          <motion.div className={s.done} role="status" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: still ? 0 : 0.25 }}>
            <motion.span className={s.badge} initial={still ? false : { scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", bounce: 0.4, duration: 0.5, delay: 0.05 }}>
              <svg viewBox="0 0 24 24" width="40" height="40" aria-hidden="true"><motion.path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: still ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: still ? 0 : 0.35, delay: 0.2 }} /></svg>
            </motion.span>
            <motion.div className={s.doneText} initial={still ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.3 }}>
              <b>₦4,500 paid</b>
              <span>to Kora Coffee · Today, 9:41</span>
            </motion.div>
            <div className={s.doneActions}>
              <button type="button" className={s.ghost} onClick={reset}>View receipt</button>
              <button type="button" className={s.primary} onClick={reset}>Done</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
