"use client";

import { motion } from "motion/react";
import { useRef, useState } from "react";
import s from "./BudgetSlider.module.css";
import { tap, useStill } from "./util";

const MIN = 100000, MAX = 500000, STEP = 5000, SPENT = 182000;
const naira = (n: number) => "₦" + n.toLocaleString("en-NG");
const R = 70, C = 2 * Math.PI * R;

export default function BudgetSlider() {
  const [budget, setBudget] = useState(250000);
  const last = useRef(budget);
  const still = useStill();
  const used = Math.min(SPENT / budget, 1);
  const tone = SPENT > budget ? s.over : used > 0.85 ? s.close : s.ok;
  const left = budget - SPENT;
  const pct = (budget - MIN) / (MAX - MIN);

  const set = (v: number) => {
    const snapped = Math.min(MAX, Math.max(MIN, Math.round(v / STEP) * STEP));
    if (snapped !== last.current) { tap(4); last.current = snapped; }
    setBudget(snapped);
  };

  return (
    <div className={`${s.screen} ${tone}`}>
      <p className={s.k}>Monthly budget · Food</p>
      <div className={s.ringWrap}>
        <svg viewBox="0 0 180 180" className={s.ring} aria-hidden="true">
          <circle cx="90" cy="90" r={R} className={s.trackC} />
          <motion.circle cx="90" cy="90" r={R} className={s.fillC} strokeDasharray={C} animate={{ strokeDashoffset: C * (1 - used) }} transition={still ? { duration: 0 } : { type: "spring", stiffness: 200, damping: 30 }} />
        </svg>
        <div className={s.ringText}>
          <b className="tnum">{Math.round(used * 100)}%</b>
          <span>used</span>
        </div>
      </div>
      <p className={s.status} aria-live="polite">
        {left >= 0 ? <>You have <b className="tnum">{naira(left)}</b> left this month</> : <>You're <b className="tnum">{naira(-left)}</b> over budget</>}
      </p>

      <div className={s.sliderBlock}>
        <div className={s.bubbleRow} aria-hidden="true"><span className={s.bubble} style={{ left: `calc(${pct} * (100% - 28px) + 14px)` }}>{naira(budget)}</span></div>
        <input
          type="range" min={MIN} max={MAX} step={STEP} value={budget}
          className={s.range}
          style={{ ["--p" as string]: pct }}
          onChange={(e) => set(Number(e.target.value))}
          onKeyDown={(e) => {
            if (e.shiftKey && (e.key === "ArrowRight" || e.key === "ArrowUp")) { e.preventDefault(); set(budget + STEP * 5); }
            if (e.shiftKey && (e.key === "ArrowLeft" || e.key === "ArrowDown")) { e.preventDefault(); set(budget - STEP * 5); }
          }}
          aria-label="Monthly food budget"
          aria-valuetext={naira(budget)}
        />
        <div className={s.scale} aria-hidden="true"><span>₦100k</span><span>₦300k</span><span>₦500k</span></div>
      </div>

      <ul className={s.cats} aria-label="Spent so far">
        <li><span><i style={{ background: "#ff9f43" }} />Groceries</span><b className="tnum">₦96,000</b></li>
        <li><span><i style={{ background: "#54a0ff" }} />Eating out</span><b className="tnum">₦61,000</b></li>
        <li><span><i style={{ background: "#c8d6e5" }} />Delivery</span><b className="tnum">₦25,000</b></li>
      </ul>
    </div>
  );
}
