"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import s from "./MusicScrubber.module.css";
import { useStill } from "./util";

const LENGTH = 214; // seconds
const fmt = (t: number) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;

export default function MusicScrubber() {
  const [t, setT] = useState(63);
  const [playing, setPlaying] = useState(false);
  const wave = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const still = useStill();

  // A fixed, song-like waveform: louder in the chorus, quieter in the bridge.
  const bars = useMemo(() => Array.from({ length: 56 }, (_, i) => {
    const env = 0.45 + 0.35 * Math.sin(i / 6) + (i > 20 && i < 34 ? 0.2 : 0) - (i > 40 && i < 46 ? 0.25 : 0);
    const n = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
    return Math.max(0.12, Math.min(1, env * (0.6 + 0.5 * n)));
  }), []);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setT((v) => (v + 0.25 >= LENGTH ? 0 : v + 0.25)), 250);
    return () => clearInterval(id);
  }, [playing]);

  const seek = (x: number) => {
    const b = wave.current?.getBoundingClientRect();
    if (b) setT(Math.min(LENGTH, Math.max(0, ((x - b.left) / b.width) * LENGTH)));
  };
  const p = t / LENGTH;

  return (
    <div className={s.screen}>
      <div className={s.art} aria-hidden="true"><span className={s.sun} /><span className={s.hill} /></div>
      <div className={s.meta}><h2>Harmattan</h2><p>Lagos Tape Club</p></div>

      <div
        ref={wave}
        className={s.wave}
        role="slider"
        tabIndex={0}
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={LENGTH}
        aria-valuenow={Math.round(t)}
        aria-valuetext={`${fmt(t)} of ${fmt(LENGTH)}`}
        onPointerDown={(e) => { dragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); seek(e.clientX); }}
        onPointerMove={(e) => { if (dragging.current) seek(e.clientX); }}
        onPointerUp={() => { dragging.current = false; }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") setT((v) => Math.min(LENGTH, v + 5));
          if (e.key === "ArrowLeft") setT((v) => Math.max(0, v - 5));
        }}
      >
        {bars.map((h, i) => <i key={i} className={i / bars.length < p ? s.played : undefined} style={{ height: `${Math.round(h * 100)}%` }} />)}
      </div>
      <div className={s.times}><span className="tnum">{fmt(t)}</span><span className="tnum">-{fmt(LENGTH - t)}</span></div>

      <div className={s.controls}>
        <button type="button" className={s.small} onClick={() => setT((v) => Math.max(0, v - 15))} aria-label="Back 15 seconds">↺15</button>
        <button type="button" className={s.play} onClick={() => setPlaying(!playing)} aria-label={playing ? "Pause" : "Play"}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={playing ? "pause" : "play"}
              className={s.icon}
              initial={{ scale: 0.5, opacity: 0, filter: "blur(4px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              exit={{ scale: 0.5, opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: still ? 0 : 0.18 }}
              aria-hidden="true"
            >
              {playing ? <svg viewBox="0 0 24 24" width="30" height="30"><rect x="6" y="5" width="4" height="14" rx="1.5" fill="currentColor" /><rect x="14" y="5" width="4" height="14" rx="1.5" fill="currentColor" /></svg>
                : <svg viewBox="0 0 24 24" width="30" height="30"><path d="M8 5.5v13a1 1 0 001.5.86l10.5-6.5a1 1 0 000-1.72L9.5 4.64A1 1 0 008 5.5z" fill="currentColor" /></svg>}
            </motion.span>
          </AnimatePresence>
        </button>
        <button type="button" className={s.small} onClick={() => setT((v) => Math.min(LENGTH, v + 15))} aria-label="Forward 15 seconds">15↻</button>
      </div>
    </div>
  );
}
