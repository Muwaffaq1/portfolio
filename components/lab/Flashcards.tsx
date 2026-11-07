"use client";

import { AnimatePresence, motion, useMotionValue, useTransform, animate } from "motion/react";
import { useState } from "react";
import s from "./Flashcards.module.css";
import { tap, useStill } from "./util";

const words = [
  { ar: "سلام", tr: "salām", en: "peace" },
  { ar: "شكرًا", tr: "shukran", en: "thank you" },
  { ar: "قهوة", tr: "qahwa", en: "coffee" },
  { ar: "كتاب", tr: "kitāb", en: "book" },
  { ar: "صديق", tr: "ṣadīq", en: "friend" },
  { ar: "بيت", tr: "bayt", en: "house" },
];

function Card({ word, onDone, still }: { word: (typeof words)[number]; onDone: (knew: boolean) => void; still: boolean }) {
  const [flipped, setFlipped] = useState(false);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-14, 14]);
  const knewOpacity = useTransform(x, [20, 110], [0, 1]);
  const againOpacity = useTransform(x, [-110, -20], [1, 0]);

  const fling = (knew: boolean, velocity = 0) => {
    tap(knew ? 12 : 24);
    animate(x, knew ? 420 : -420, still ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 30, velocity });
    setTimeout(() => onDone(knew), still ? 0 : 180);
  };

  return (
    <motion.div
      className={s.card}
      style={{ x, rotate }}
      drag="x"
      dragSnapToOrigin
      dragElastic={0.9}
      onDragEnd={(_, info) => {
        if (info.offset.x > 100 || info.velocity.x > 600) fling(true, info.velocity.x);
        else if (info.offset.x < -100 || info.velocity.x < -600) fling(false, info.velocity.x);
      }}
      initial={{ scale: 0.94, y: 14, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      transition={{ duration: still ? 0 : 0.25 }}
    >
      <motion.span className={`${s.stamp} ${s.knew}`} style={{ opacity: knewOpacity }} aria-hidden="true">Knew it</motion.span>
      <motion.span className={`${s.stamp} ${s.again}`} style={{ opacity: againOpacity }} aria-hidden="true">Again</motion.span>
      <button
        type="button"
        className={s.flip}
        onClick={() => setFlipped(!flipped)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") { e.preventDefault(); fling(true); }
          if (e.key === "ArrowLeft") { e.preventDefault(); fling(false); }
        }}
        aria-label={flipped ? `${word.ar}, ${word.tr}, means ${word.en}. Right arrow if you knew it, left to try again` : `${word.ar}. Press to see the meaning`}
      >
        <motion.span className={s.inner} animate={{ rotateY: flipped ? 180 : 0 }} transition={still ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 28 }}>
          <span className={s.front}><span className={s.ar} lang="ar" dir="rtl">{word.ar}</span><span className={s.cue}>Tap to flip</span></span>
          <span className={s.back}><span className={s.en}>{word.en}</span><span className={s.tr}>{word.tr}</span><span className={s.arSmall} lang="ar" dir="rtl">{word.ar}</span></span>
        </motion.span>
      </button>
    </motion.div>
  );
}

export default function Flashcards() {
  const [i, setI] = useState(0);
  const [known, setKnown] = useState(0);
  const still = useStill();
  const done = i >= words.length;

  return (
    <div className={s.screen}>
      <header className={s.head}>
        <p>Arabic · Everyday words</p>
        <div className={s.progress} aria-label={`${Math.min(i, words.length)} of ${words.length} done`} role="img"><i style={{ width: `${(Math.min(i, words.length) / words.length) * 100}%` }} /></div>
      </header>
      <div className={s.deck}>
        {!done && words[i + 1] && <div className={`${s.card} ${s.under}`} aria-hidden="true" />}
        <AnimatePresence mode="popLayout">
          {done ? (
            <motion.div key="done" className={s.summary} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
              <b className="tnum">{known} / {words.length}</b>
              <span>words you knew</span>
              <button type="button" onClick={() => { setI(0); setKnown(0); }}>Start over</button>
            </motion.div>
          ) : (
            <Card key={i} word={words[i]} still={still} onDone={(k) => { if (k) setKnown((n) => n + 1); setI((n) => n + 1); }} />
          )}
        </AnimatePresence>
      </div>
      <p className={s.hint}>Swipe right if you knew it, left to see it again.</p>
    </div>
  );
}
