"use client";

import { AnimatePresence, motion } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import s from "./ColourTabs.module.css";
import { useStill } from "./util";

const tabs = [
  { id: "overview", label: "Overview", body: "Revenue is up 12% this month, mostly from repeat customers in Lagos and Abuja." },
  { id: "activity", label: "Activity", body: "14 invoices paid this week. Two are overdue by more than 7 days." },
  { id: "members", label: "Members", body: "6 people on the team. Kemi joined on Monday as finance lead." },
  { id: "settings", label: "Settings", body: "Payouts go to your GTBank account every Friday at 9am." },
];

// Two identical tab lists: the top one is coloured and clipped to the active tab.
// Moving the clip reveals the colour exactly, with no colour transitions to time.
export default function ColourTabs() {
  const [active, setActive] = useState(0);
  const [clip, setClip] = useState("inset(0 100% 0 0 round 999px)");
  const base = useRef<HTMLDivElement>(null);
  const btns = useRef<(HTMLButtonElement | null)[]>([]);
  const still = useStill();

  useLayoutEffect(() => {
    const wrap = base.current, el = btns.current[active];
    if (!wrap || !el) return;
    const w = wrap.offsetWidth;
    const left = el.offsetLeft, right = w - (el.offsetLeft + el.offsetWidth);
    setClip(`inset(0 ${(right / w) * 100}% 0 ${(left / w) * 100}% round 999px)`);
  }, [active]);

  const onKey = (e: React.KeyboardEvent) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const n = (active + dir + tabs.length) % tabs.length;
    setActive(n);
    btns.current[n]?.focus();
  };

  return (
    <div className={s.wrap}>
      <div className={s.tabs}>
        <div className={s.list} ref={base} role="tablist" aria-label="Account sections" onKeyDown={onKey}>
          {tabs.map((t, i) => (
            <button
              key={t.id}
              ref={(el) => { btns.current[i] = el; }}
              type="button"
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={i === active}
              aria-controls={`panel-${t.id}`}
              tabIndex={i === active ? 0 : -1}
              className={s.tab}
              onClick={() => setActive(i)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className={`${s.list} ${s.overlay}`} style={{ clipPath: clip, transition: still ? "none" : undefined }} aria-hidden="true">
          {tabs.map((t) => <span key={t.id} className={s.tab}>{t.label}</span>)}
        </div>
      </div>
      <div className={s.panelWrap}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={tabs[active].id}
            id={`panel-${tabs[active].id}`}
            role="tabpanel"
            aria-labelledby={`tab-${tabs[active].id}`}
            className={s.panel}
            initial={{ opacity: 0, y: 6, filter: "blur(2px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -4, transition: { duration: 0.1 } }}
            transition={{ duration: still ? 0 : 0.2 }}
          >
            {tabs[active].body}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
