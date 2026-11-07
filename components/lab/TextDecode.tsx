"use client";

import { useEffect, useRef, useState } from "react";
import s from "./TextDecode.module.css";
import { useStill } from "./util";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=?";

// Letters settle left to right over ~420ms; until a letter settles it shows a random glyph.
function Decode({ text, className, trigger }: { text: string; className?: string; trigger: number }) {
  const [out, setOut] = useState(text);
  const still = useStill();
  const raf = useRef(0);

  useEffect(() => {
    if (still || trigger === 0) { setOut(text); return; }
    const start = performance.now();
    const step = (now: number) => {
      const t = now - start;
      const settled = Math.floor(t / (420 / text.length));
      setOut(text.split("").map((c, i) => (c === " " || i < settled ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)])).join(""));
      if (settled < text.length) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [trigger, text, still]);

  return <span className={className} aria-hidden="true">{out}</span>;
}

function Word({ text }: { text: string }) {
  const [n, setN] = useState(0);
  return (
    <a href="#" className={s.link} onMouseEnter={() => setN((v) => v + 1)} onFocus={() => setN((v) => v + 1)} onClick={(e) => e.preventDefault()} aria-label={text}>
      <Decode text={text} trigger={n} />
    </a>
  );
}

export default function TextDecode() {
  const [n, setN] = useState(1);
  return (
    <div className={s.wrap}>
      <nav className={s.nav} aria-label="Demo navigation">
        {["Work", "Studio", "Journal", "Contact"].map((w) => <Word key={w} text={w} />)}
      </nav>
      <h2 className={s.head} aria-label="Signals in the noise">
        <Decode text="SIGNALS IN" trigger={n} />
        <Decode text="THE NOISE" trigger={n} className={s.accent} />
      </h2>
      <button type="button" className={s.replay} onClick={() => setN((v) => v + 1)}>Replay</button>
    </div>
  );
}
