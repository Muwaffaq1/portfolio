"use client";

import { useEffect, useState } from "react";
import { motionPaused, onMotionChange } from "@/lib/motion";

// The greeting changes language every few seconds, and each change glitches for 240ms,
// stepping like comic frames. The first word loads still. With reduced motion it stays on the first word.
export function Greeting({ words }: { words: string[] }) {
  const [tick, setTick] = useState(0);

  // Stops when reduced motion is on, or when someone presses Pause in the header.
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let id: ReturnType<typeof setInterval> | undefined;
    const sync = () => {
      clearInterval(id);
      if (!motionPaused()) id = setInterval(() => setTick((t) => t + 1), 2800);
    };
    sync();
    const off = onMotionChange(sync);
    return () => { clearInterval(id); off(); };
  }, []);

  const word = words[tick % words.length];
  return (
    <span className="greet">
      {/* Keying on the tick remounts the glitch so it replays on every change. */}
      {tick === 0 ? word : <Glitch key={tick} text={word} />}
    </span>
  );
}

export function Glitch({ text, loop = false }: { text: string; loop?: boolean }) {
  return (
    <span className={loop ? "glitch loop" : "glitch"}>
      <span className="g-main">{text}</span>
      <span className="g-a" aria-hidden="true">{text}</span>
      <span className="g-b" aria-hidden="true">{text}</span>
    </span>
  );
}
