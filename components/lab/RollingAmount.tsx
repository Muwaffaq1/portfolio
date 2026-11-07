"use client";

import { AnimatePresence, motion, useAnimate } from "motion/react";
import { useState } from "react";
import s from "./RollingAmount.module.css";
import { Icon } from "./icons";
import { tap, useStill } from "./util";

const MAX = 7; // digits, up to ₦9,999,999
const BALANCE = 248560;

export default function RollingAmount() {
  const [digits, setDigits] = useState("25000");
  const [dir, setDir] = useState<1 | -1>(1);
  const [scope, animate] = useAnimate();
  const still = useStill();
  const value = Number(digits);
  const over = value > BALANCE;

  const shake = () => { if (!still) animate(scope.current, { x: [0, -10, 9, -6, 4, 0] }, { duration: 0.38 }); tap(30); };
  const press = (k: string) => {
    tap(6);
    if (k === "del") { setDir(-1); setDigits((d) => (d.length > 1 ? d.slice(0, -1) : "0")); return; }
    if (digits.length >= MAX || (digits === "0" && k === "0")) { shake(); return; }
    const nextValue = Number(digits === "0" ? k : digits + k);
    setDir(1);
    setDigits(String(nextValue));
    if (nextValue > BALANCE && value <= BALANCE) shake();
  };
  const setTo = (n: number) => { setDir(n >= value ? 1 : -1); setDigits(String(n)); tap(8); };

  // Format with commas, and key every character by its position and value,
  // so digits that didn't change stay put and only the new ones roll.
  const formatted = value.toLocaleString("en-NG");
  const keyed = formatted.split("").map((c, i) => ({ c, key: `${i}-${c}` }));

  return (
    <div className={s.screen}>
      <header className={s.nav}>
        <span className={s.round} aria-hidden="true"><Icon name="close" size={18} /></span>
        <span className={s.to}>
          <span className={s.avatar} aria-hidden="true">O</span>
          <span><b>Oshoke</b><span>@oshoke</span></span>
        </span>
        <span className={s.round} aria-hidden="true"><Icon name="more" size={20} stroke={2.6} /></span>
      </header>

      <div className={s.amountWrap}>
        <div className={s.amount} ref={scope} role="status" aria-label={`₦${formatted}`} data-zero={value === 0} data-over={over}>
          <span className={s.cur} aria-hidden="true">₦</span>
          <AnimatePresence initial={false} mode="popLayout" custom={dir}>
            {keyed.map(({ c, key }) => (
              <motion.span
                key={key}
                layout="position"
                className={c === "," ? s.comma : s.digit}
                custom={dir}
                variants={{
                  enter: (d: number) => ({ y: d > 0 ? "55%" : "-55%", opacity: 0, filter: "blur(4px)" }),
                  center: { y: "0%", opacity: 1, filter: "blur(0px)" },
                  exit: (d: number) => ({ y: d > 0 ? "-55%" : "55%", opacity: 0, filter: "blur(4px)" }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={still ? { duration: 0 } : { type: "spring", stiffness: 520, damping: 36 }}
                aria-hidden="true"
              >
                {c}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
        <p className={s.sub} data-over={over}>
          {over ? "More than your balance" : <>₦{BALANCE.toLocaleString("en-NG")} available</>}
          <span aria-hidden="true">·</span>
          <button type="button" className={s.max} onClick={() => setTo(BALANCE)}>Send all</button>
        </p>
      </div>

      <div className={s.quick}>
        {[5000, 10000, 50000].map((n) => (
          <button key={n} type="button" onClick={() => setTo(n)} aria-pressed={value === n}>₦{n.toLocaleString("en-NG")}</button>
        ))}
      </div>

      <label className={s.note}>
        <span className="sr-only">What&apos;s it for?</span>
        <input placeholder="What's it for?" maxLength={40} />
      </label>

      <div className={s.pad}>
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"].map((k) =>
          k === "" ? <span key="blank" /> : (
            <button key={k} type="button" className={s.key} onClick={() => press(k)} aria-label={k === "del" ? "Delete" : k}>
              {k === "del" ? <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d="M9 6h10a1 1 0 011 1v10a1 1 0 01-1 1H9l-5-6 5-6z M12 10l4 4m0-4l-4 4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round" /></svg> : k}
            </button>
          ),
        )}
      </div>
      <button type="button" className={s.cta} disabled={value === 0 || over}>Review</button>
    </div>
  );
}
