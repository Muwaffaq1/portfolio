"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import s from "./MusicScrubber.module.css";
import { Icon } from "./icons";
import { tap, useStill } from "./util";

const LENGTH = 214; // seconds
const fmt = (t: number) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;

function Art({ className }: { className?: string }) {
  return (
    <span className={className} aria-hidden="true">
      <span className={s.sky} /><span className={s.sun} /><span className={s.hillBack} /><span className={s.hill} /><span className={s.grain} />
    </span>
  );
}

export default function MusicScrubber() {
  const [t, setT] = useState(63);
  const [playing, setPlaying] = useState(false);
  const [scrub, setScrub] = useState(false);
  const wave = useRef<HTMLDivElement>(null);
  const still = useStill();

  // A fixed, song-like waveform: louder in the chorus, quieter in the bridge.
  const bars = useMemo(() => Array.from({ length: 64 }, (_, i) => {
    const env = 0.45 + 0.35 * Math.sin(i / 6) + (i > 22 && i < 38 ? 0.22 : 0) - (i > 44 && i < 50 ? 0.25 : 0);
    const n = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
    return Math.round(Math.max(0.1, Math.min(1, env * (0.6 + 0.5 * n))) * 100);
  }), []);

  useEffect(() => {
    if (!playing || scrub) return;
    const id = setInterval(() => setT((v) => (v + 0.25 >= LENGTH ? 0 : v + 0.25)), 250);
    return () => clearInterval(id);
  }, [playing, scrub]);

  const seek = (x: number) => {
    const b = wave.current?.getBoundingClientRect();
    if (b) setT(Math.min(LENGTH, Math.max(0, ((x - b.left) / b.width) * LENGTH)));
  };
  const p = t / LENGTH;

  return (
    <div className={s.screen}>
      {/* The art, blurred and enlarged, becomes the light of the whole screen */}
      <Art className={s.bleed} />
      <span className={s.veil} aria-hidden="true" />

      
      <motion.div className={s.artWrap} animate={{ scale: playing ? 1 : 0.86 }} transition={still ? { duration: 0 } : { type: "spring", bounce: 0.25, duration: 0.6 }}>
        <Art className={s.art} />
      </motion.div>

      <div className={s.meta}>
        <div><h2>Harmattan</h2><p>Lagos Tape Club</p></div>
        <span className={s.metaBtns} aria-hidden="true"><span className={s.more}><Icon name="heart" size={18} /></span><span className={s.more}><Icon name="more" size={20} stroke={3.4} /></span></span>
      </div>

      <div
        ref={wave}
        className={s.wave}
        data-scrub={scrub}
        role="slider"
        tabIndex={0}
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={LENGTH}
        aria-valuenow={Math.round(t)}
        aria-valuetext={`${fmt(t)} of ${fmt(LENGTH)}`}
        onPointerDown={(e) => { setScrub(true); e.currentTarget.setPointerCapture(e.pointerId); seek(e.clientX); tap(4); }}
        onPointerMove={(e) => { if (scrub) seek(e.clientX); }}
        onPointerUp={() => setScrub(false)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") setT((v) => Math.min(LENGTH, v + 5));
          if (e.key === "ArrowLeft") setT((v) => Math.max(0, v - 5));
        }}
      >
        {bars.map((h, i) => <i key={i} className={i / bars.length < p ? s.played : undefined} style={{ height: `${h}%` }} />)}
      </div>
      <div className={s.times}><span className="tnum">{fmt(t)}</span><span className="tnum">-{fmt(LENGTH - t)}</span></div>

      <div className={s.controls}>
        <button type="button" className={s.skip} onClick={() => { setT((v) => Math.max(0, v - 15)); tap(); }} aria-label="Back 15 seconds">
          <svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true"><path d="M11.5 6.2v11.6a.6.6 0 01-.95.5L3.6 12.5a.6.6 0 010-1L10.55 5.7a.6.6 0 01.95.5zm9 0v11.6a.6.6 0 01-.95.5L12.6 12.5a.6.6 0 010-1l6.95-5.8a.6.6 0 01.95.5z" fill="currentColor" /></svg>
        </button>
        <motion.button type="button" className={s.play} onClick={() => { setPlaying(!playing); tap(10); }} whileTap={still ? undefined : { scale: 0.88 }} aria-label={playing ? "Pause" : "Play"}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={playing ? "pause" : "play"}
              className={s.icon}
              initial={{ scale: 0.4, opacity: 0, filter: "blur(4px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              exit={{ scale: 0.4, opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: still ? 0 : 0.2 }}
              aria-hidden="true"
            >
              {playing ? <svg viewBox="0 0 24 24" width="44" height="44"><rect x="6" y="4.5" width="4.2" height="15" rx="1.3" fill="currentColor" /><rect x="13.8" y="4.5" width="4.2" height="15" rx="1.3" fill="currentColor" /></svg>
                : <svg viewBox="0 0 24 24" width="44" height="44"><path d="M7.5 5.3v13.4a1 1 0 001.52.85l10.7-6.7a1 1 0 000-1.7L9.02 4.45A1 1 0 007.5 5.3z" fill="currentColor" /></svg>}
            </motion.span>
          </AnimatePresence>
        </motion.button>
        <button type="button" className={s.skip} onClick={() => { setT((v) => Math.min(LENGTH, v + 15)); tap(); }} aria-label="Forward 15 seconds">
          <svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true"><path d="M12.5 6.2v11.6a.6.6 0 00.95.5l6.95-5.8a.6.6 0 000-1L13.45 5.7a.6.6 0 00-.95.5zm-9 0v11.6a.6.6 0 00.95.5l6.95-5.8a.6.6 0 000-1L4.45 5.7a.6.6 0 00-.95.5z" fill="currentColor" /></svg>
        </button>
      </div>
      <div className={s.volume} aria-hidden="true"><Icon name="speakerLow" size={16} /><i><b /></i><Icon name="speakerHigh" size={18} /></div>
      <div className={s.bottomRow} aria-hidden="true"><Icon name="message" size={22} /><Icon name="airplay" size={22} /><Icon name="list" size={22} /></div>
    </div>
  );
}
