"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import s from "./AiPrompt.module.css";
import { useStill } from "./util";

const answers: Record<string, string> = {
  "Plan a weekend in Lagos": "Saturday: start at Nike Art Gallery in Lekki before the crowds, then lunch at a buka on Admiralty Way. Spend the afternoon at Tarkwa Bay; boats leave from Tarzan Jetty. Sunday: brunch on Victoria Island, a walk across Lekki–Ikoyi Link Bridge at sunset, and an early night before Monday traffic.",
  "Summarise this week's spending": "You spent ₦86,400 this week, 12% less than last week. Food was the biggest category at ₦41,000, mostly delivery on Tuesday and Thursday. Transport dropped by ₦9,000. If next week looks like this one, you'll finish the month ₦22,000 under budget.",
  "Write a polite payment reminder": "Hi Tunde, I hope your week is going well. A quick reminder that the ₦150,000 from 2 October is due this Friday. If anything has changed, just let me know and we can agree a new date. Thank you!",
};
const fallback = "Here's a first pass. I'd start by listing what has to happen, pick the one thing that unblocks the rest, and do that first. Tell me more about the goal and I can make this specific.";

export default function AiPrompt() {
  const [input, setInput] = useState("");
  const [asked, setAsked] = useState<string | null>(null);
  const [phase, setPhase] = useState<"idle" | "thinking" | "streaming" | "done">("idle");
  const [shown, setShown] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const still = useStill();
  const answer = asked ? answers[asked] ?? fallback : "";
  const words = answer.split(" ");

  useEffect(() => () => clearTimeout(timer.current), []);

  useEffect(() => {
    if (phase !== "streaming") return;
    if (shown >= words.length) { setPhase("done"); return; }
    timer.current = setTimeout(() => setShown((n) => n + (still ? words.length : 1)), still ? 0 : 38);
    return () => clearTimeout(timer.current);
  }, [phase, shown, words.length, still]);

  const ask = (q: string) => {
    if (!q.trim()) return;
    setAsked(q.trim());
    setInput("");
    setShown(0);
    setPhase("thinking");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setPhase("streaming"), still ? 0 : 700);
  };

  const stop = () => { clearTimeout(timer.current); setPhase("done"); };

  return (
    <div className={s.app}>
      {!asked ? (
        <div className={s.hero}>
          <span className={s.mark} aria-hidden="true">✦</span>
          <h2>What should we work on?</h2>
        </div>
      ) : (
        <div className={s.thread}>
          <p className={s.user}>{asked}</p>
          <div className={s.reply}>
            <span className={s.avatar} aria-hidden="true">✦</span>
            <AnimatePresence mode="wait" initial={false}>
              {phase === "thinking" ? (
                <motion.span key="t" className={s.thinking} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Thinking</motion.span>
              ) : (
                <motion.p key="a" className={s.answer} initial={{ opacity: 0 }} animate={{ opacity: 1 }} aria-hidden={phase !== "done"}>
                  {words.slice(0, shown).join(" ")}
                  {phase === "streaming" && <span className={s.caret} aria-hidden="true" />}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <p className="sr-only" aria-live="polite">{phase === "done" ? words.slice(0, shown).join(" ") : phase === "thinking" ? "Thinking" : ""}</p>
        </div>
      )}

      <form className={s.box} onSubmit={(e) => { e.preventDefault(); ask(input); }}>
        <label className="sr-only" htmlFor="ai-q">Ask anything</label>
        <textarea id="ai-q" className={s.input} rows={2} value={input} placeholder="Ask anything" onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ask(input); } }} />
        <div className={s.boxRow}>
          <span className={s.model}>Margin · Fast</span>
          {phase === "thinking" || phase === "streaming" ? (
            <button type="button" className={s.send} onClick={stop} aria-label="Stop answering"><span className={s.stopIcon} /></button>
          ) : (
            <button type="submit" className={s.send} disabled={!input.trim()} aria-label="Send">↑</button>
          )}
        </div>
      </form>
      {!asked && (
        <div className={s.chips}>
          {Object.keys(answers).map((q) => <button key={q} type="button" onClick={() => ask(q)}>{q}</button>)}
        </div>
      )}
      {asked && phase === "done" && <button type="button" className={s.newChat} onClick={() => { setAsked(null); setPhase("idle"); }}>New question</button>}
    </div>
  );
}
