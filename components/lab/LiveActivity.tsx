"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import s from "./LiveActivity.module.css";
import { Icon } from "./icons";
import { tap, useStill } from "./util";

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
  // The island morphs like Apple's: springy, because it's a fluid, physical object.
  const morph = still ? { duration: 0 } : { type: "spring" as const, bounce: 0.32, duration: 0.6 };
  const R = 15, C = 2 * Math.PI * R;

  return (
    <div className={s.screen}>
      <div className={s.wall} aria-hidden="true"><i /><i /><i /></div>
      <p className={s.date}>Saturday 7 November</p>
      <p className={s.time}>9:41</p>

      <motion.button
        layout
        transition={morph}
        type="button"
        className={s.island}
        data-open={open}
        style={{ borderRadius: open ? 44 : 22 }}
        onClick={() => { setOpen(!open); tap(open ? 6 : 14); }}
        aria-expanded={open}
        aria-label={open ? "Collapse delivery status" : `Delivery arriving in ${mins} minutes. Expand`}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {open ? (
            <motion.span key="open" className={s.open} initial={{ opacity: 0, scale: 0.9, filter: "blur(6px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} exit={{ opacity: 0, scale: 0.9, filter: "blur(6px)", transition: { duration: 0.12 } }} transition={{ duration: 0.3, delay: still ? 0 : 0.1 }}>
              <span className={s.row}>
                <span className={s.logo} aria-hidden="true"><Icon name="bowl" size={24} /></span>
                <span className={s.who}><b>Oshoke is on the way</b><span>Jollof bowl · Suya Spot</span></span>
                <span className={s.eta}><b className="tnum">{mins}</b><span>min</span></span>
              </span>
              <span className={s.route} aria-hidden="true">
                <i className={s.routeFill} style={{ width: `${8 + progress * 84}%` }} />
                <span className={s.bike} style={{ left: `${8 + progress * 84}%` }}><Icon name="scooter" size={16} stroke={2} /></span>
                <span className={s.home}><Icon name="home" size={14} stroke={2} /></span>
              </span>
              <span className={s.actions} aria-hidden="true"><span><Icon name="message" size={16} /> Message</span><span className={s.call}><Icon name="phone" size={16} /> Call</span></span>
            </motion.span>
          ) : (
            <motion.span key="closed" className={s.closed} initial={{ opacity: 0, filter: "blur(4px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} exit={{ opacity: 0, transition: { duration: 0.08 } }} transition={{ duration: 0.2, delay: still ? 0 : 0.15 }}>
              <span className={s.lead} aria-hidden="true"><Icon name="scooter" size={14} stroke={2.2} /></span>
              <svg className={s.ring} viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r={R} className={s.ringTrack} /><circle cx="18" cy="18" r={R} className={s.ringFill} strokeDasharray={C} strokeDashoffset={C * (1 - progress)} /></svg>
              <span className={`${s.trail} tnum`}>{mins}m</span>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <div className={s.notes} aria-hidden="true">
        <div className={s.note}><span className={`${s.app} ${s.chop}`}><Icon name="bowl" size={20} /></span><span><b>Order picked up</b><span>Oshoke collected your order from Suya Spot.</span></span><em>now</em></div>
        <div className={`${s.note} ${s.back}`}><span className={`${s.app} ${s.msg}`}><Icon name="message" size={20} /></span><span><b>Oshoke</b><span>Are we still on for Saturday?</span></span><em>9m</em></div>
      </div>
      <div className={s.dock} aria-hidden="true"><span><Icon name="flashlight" size={22} /></span><span><Icon name="camera" size={22} /></span></div>
    </div>
  );
}
