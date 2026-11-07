"use client";

import { AnimatePresence, motion, useAnimate } from "motion/react";
import { useEffect, useRef, useState } from "react";
import s from "./MorphButton.module.css";
import { tap, useStill } from "./util";

type State = "idle" | "loading" | "done";

export default function MorphButton() {
  const [state, setState] = useState<State>("idle");
  const [count, setCount] = useState(2);
  const [bag, animateBag] = useAnimate();
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const still = useStill();

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const add = () => {
    if (state !== "idle") return;
    tap();
    setState("loading");
    timers.current.push(setTimeout(() => {
      setState("done");
      setCount((c) => c + 1);
      tap(16);
      if (!still) animateBag(bag.current, { scale: [1, 1.3, 1] }, { duration: 0.35, ease: [0.23, 1, 0.32, 1] });
    }, 900));
    timers.current.push(setTimeout(() => setState("idle"), 2600));
  };

  const t = still ? { duration: 0 } : { type: "spring" as const, bounce: 0.15, duration: 0.45 };

  return (
    <div className={s.wrap}>
      <div className={s.card}>
        <div className={s.photo} aria-hidden="true"><span className={s.shirt} /></div>
        <div className={s.info}>
          <div className={s.row}>
            <div><h2>Linen overshirt</h2><p>Sand · Medium</p></div>
            <span className={s.bag} ref={bag}>
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M6 8h12l-1 12H7L6 8z M9 8V6a3 3 0 016 0v2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>
              <b className="tnum">{count}</b><span className="sr-only"> items in bag</span>
            </span>
          </div>
          <p className={s.price}>₦38,500</p>
          <motion.button
            layout
            transition={t}
            type="button"
            className={s.btn}
            data-state={state}
            onClick={add}
            style={{ borderRadius: 999 }}
            aria-live="polite"
            aria-busy={state === "loading"}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {state === "idle" && <motion.span key="i" className={s.label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>Add to bag</motion.span>}
              {state === "loading" && <motion.span key="l" className={s.spinner} role="img" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }} transition={{ duration: 0.18 }} aria-label="Adding" />}
              {state === "done" && (
                <motion.span key="d" className={s.label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  Added to bag
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
