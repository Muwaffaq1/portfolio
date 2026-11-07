"use client";

import { AnimatePresence, motion, useAnimate } from "motion/react";
import { useState } from "react";
import s from "./RollingAmount.module.css";
import { tap, useStill } from "./util";

const MAX = 7; // digits, up to ₦9,999,999

export default function RollingAmount() {
  const [digits, setDigits] = useState("25000");
  const [dir, setDir] = useState<1 | -1>(1);
  const [scope, animate] = useAnimate();
  const still = useStill();

  const press = (k: string) => {
    tap(6);
    if (k === "del") { setDir(-1); setDigits((d) => (d.length > 1 ? d.slice(0, -1) : "0")); return; }
    if (digits.length >= MAX || (digits === "0" && k === "0")) {
      if (!still) animate(scope.current, { x: [0, -10, 9, -6, 4, 0] }, { duration: 0.38 });
      tap(30);
      return;
    }
    setDir(1);
    setDigits((d) => (d === "0" ? k : d + k));
  };

  // Format with commas, and key every character by its position and value,
  // so digits that didn't change stay put and only the new ones roll.
  const formatted = Number(digits).toLocaleString("en-NG");
  const keyed = formatted.split("").map((c, i) => ({ c, key: `${i}-${c}` }));

  return (
    <div className={s.screen}>
      <p className={s.k}>Send to Adaeze</p>
      <div className={s.amount} ref={scope} role="status" aria-label={`₦${formatted}`}>
        <span className={s.cur} aria-hidden="true">₦</span>
        <AnimatePresence initial={false} mode="popLayout" custom={dir}>
          {keyed.map(({ c, key }) => (
            <motion.span
              key={key}
              layout="position"
              className={c === "," ? s.comma : s.digit}
              custom={dir}
              variants={{
                enter: (d: number) => ({ y: d > 0 ? "60%" : "-60%", opacity: 0, filter: "blur(3px)" }),
                center: { y: "0%", opacity: 1, filter: "blur(0px)" },
                exit: (d: number) => ({ y: d > 0 ? "-60%" : "60%", opacity: 0, filter: "blur(3px)" }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={still ? { duration: 0 } : { type: "spring", stiffness: 520, damping: 34 }}
              aria-hidden="true"
            >
              {c}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
      <p className={s.sub}>Balance ₦248,560 · No fee</p>
      <div className={s.chips} aria-hidden="true"><span>₦5,000</span><span>₦10,000</span><span>₦50,000</span></div>
      <div className={s.pad}>
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"].map((k, i) =>
          k === "" ? <span key="blank" /> : (
            <button key={k} type="button" className={s.key} onClick={() => press(k)} aria-label={k === "del" ? "Delete" : k}>
              {k === "del" ? <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M9 6h10a1 1 0 011 1v10a1 1 0 01-1 1H9l-5-6 5-6z M12 10l4 4m0-4l-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" /></svg> : k}
            </button>
          ),
        )}
      </div>
      <span className={s.cta} aria-hidden="true">Continue</span>
    </div>
  );
}
