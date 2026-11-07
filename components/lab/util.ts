"use client";

import { useEffect, useState } from "react";
import { motionPaused, onMotionChange } from "@/lib/motion";

// A short vibration on phones that support it. Silent everywhere else.
export function tap(ms = 10) {
  try { navigator.vibrate?.(ms); } catch {}
}

// True when the visitor pressed Pause in the header or prefers reduced motion.
export function useStill() {
  const [still, setStill] = useState(false);
  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setStill(mq.matches || motionPaused());
    sync();
    mq.addEventListener("change", sync);
    const off = onMotionChange(sync);
    return () => { mq.removeEventListener("change", sync); off(); };
  }, []);
  return still;
}

export const spring = { type: "spring", bounce: 0.2, duration: 0.5 } as const;
export const snappy = { type: "spring", stiffness: 520, damping: 40 } as const;
