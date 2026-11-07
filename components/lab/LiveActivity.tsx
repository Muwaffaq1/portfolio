"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import s from "./LiveActivity.module.css";
import { spring, tap, useStill } from "./util";

const TOTAL = 240; // seconds until arrival

export default function LiveActivity() {
  const [open, setOpen] = useState(false);
  const [left, setLeft] = useState(TOTAL);
  const still = useStill();

  useEffect(() => {
    const id = setInterval(() => setLeft((l) => (l <= 1 ? TOTAL : l - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  const mins = Math.ceil(left / 60);
  const progress = 1 - left / TOTAL;
  const t = still ? { duration: 0 } : spring;

  return (
    <div className={s.screen}>
      <p className={s.date}>Saturday, 7 November</p>
      <p className={s.time}>9:41</p>
      <motion.button
        layout
        transition={t}
        type="button"
        className={s.island}
        data-open={open}
        style={{ borderRadius: open ? 40 : 22 }}
        onClick={() => { setOpen(!open); tap(); }}
        aria-expanded={open}
        aria-label={open ? "Collapse delivery status" : `Delivery arriving in ${mins} minutes. Expand`}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {open ? (
            <motion.span key="open" className={s.open} initial={{ opacity: 0, filter: "blur(4px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} exit={{ opacity: 0, transition: { duration: 0.1 } }} transition={{ duration: 0.25, delay: still ? 0 : 0.08 }}>
              <span className={s.row}>
                <span className={s.avatar} aria-hidden="true">AY</span>
                <span className={s.who}><b>Ayo is on the way</b><span>Jollof bowl · Suya Spot</span></span>
                <span className={s.eta}><b className="tnum">{mins}</b><span>min</span></span>
              </span>
              <span className={s.track} aria-hidden="true"><motion.i animate={{ scaleX: progress }} transition={{ duration: 0.6, ease: "linear" }} /></span>
              <span className={s.actions} aria-hidden="true"><span>Message</span><span>Call</span></span>
            </motion.span>
          ) : (
            <motion.span key="closed" className={s.closed} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.08 } }} transition={{ duration: 0.2, delay: still ? 0 : 0.12 }}>
              <span className={s.dot} aria-hidden="true" />
              <span className="tnum">{mins} min</span>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
      <p className={s.hint}>Tap the pill</p>
    </div>
  );
}
