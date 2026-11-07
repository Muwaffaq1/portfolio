"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import s from "./ButtonStates.module.css";
import { Icon } from "./icons";
import { tap, useStill } from "./util";

const HOLD = 1500; // ms to confirm a delete

// Hold to delete: a red fill creeps across while you hold. Let go early and it snaps back.
function HoldToDelete() {
  const [holding, setHolding] = useState(false);
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const still = useStill();

  const start = () => {
    if (done) return;
    setHolding(true);
    tap(6);
    timer.current = setTimeout(() => { setDone(true); setHolding(false); tap(30); }, still ? 0 : HOLD);
  };
  const stop = () => { clearTimeout(timer.current); setHolding(false); };
  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <div className={s.demo}>
      <span className={s.label}>Hold to delete</span>
      <div className={s.row}>
        <div className={s.file}><span className={s.fileIc}><Icon name="doc" size={16} /></span><span><b>Q3 report.pdf</b><span>{done ? "Moved to Trash" : "2.4 MB"}</span></span></div>
        {done ? (
          <button type="button" className={s.undo} onClick={() => setDone(false)}><Icon name="undo" size={15} />Undo</button>
        ) : (
          <button
            type="button"
            className={s.hold}
            data-holding={holding}
            onPointerDown={start}
            onPointerUp={stop}
            onPointerLeave={stop}
            onPointerCancel={stop}
            onKeyDown={(e) => { if ((e.key === " " || e.key === "Enter") && !e.repeat && !holding) { e.preventDefault(); start(); } }}
            onKeyUp={(e) => { if (e.key === " " || e.key === "Enter") stop(); }}
            onContextMenu={(e) => e.preventDefault()}
            aria-label="Delete Q3 report. Hold for one and a half seconds"
          >
            <span className={s.holdBase}><Icon name="trash" size={15} />Delete</span>
            <span className={s.holdFill} aria-hidden="true"><Icon name="trash" size={15} />Delete</span>
          </button>
        )}
      </div>
      <p className="sr-only" role="status">{done ? "Q3 report deleted" : ""}</p>
    </div>
  );
}

// Send: idle → sending → sent, in the same footprint. Content swaps with a blur so the two never look like two objects.
function SendButton() {
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const still = useStill();
  useEffect(() => {
    if (state === "sending") { const t = setTimeout(() => { setState("sent"); tap(16); }, still ? 0 : 1400); return () => clearTimeout(t); }
    if (state === "sent") { const t = setTimeout(() => setState("idle"), 1800); return () => clearTimeout(t); }
  }, [state, still]);

  const content = {
    idle: <><Icon name="send" size={16} stroke={2} />Send invoice</>,
    sending: <><span className={s.spinner} aria-hidden="true" />Sending</>,
    sent: <><Icon name="check" size={16} stroke={2.4} />Sent to Oshoke</>,
  }[state];

  return (
    <div className={s.demo}>
      <span className={s.label}>Send, then confirm</span>
      <button type="button" className={s.send} data-state={state} onClick={() => { if (state === "idle") { setState("sending"); tap(8); } }} aria-disabled={state !== "idle"}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={state}
            className={s.sendInner}
            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
            transition={still ? { duration: 0 } : { type: "spring", bounce: 0, duration: 0.3 }}
          >
            {content}
          </motion.span>
        </AnimatePresence>
      </button>
      <p className="sr-only" role="status">{state === "sending" ? "Sending invoice" : state === "sent" ? "Invoice sent to Oshoke" : ""}</p>
    </div>
  );
}

// Copy: the icon swaps to a tick and back. Small, fast, and it never moves the text beside it.
function CopyButton() {
  const [copied, setCopied] = useState(false);
  const still = useStill();
  useEffect(() => { if (!copied) return; const t = setTimeout(() => setCopied(false), 1600); return () => clearTimeout(t); }, [copied]);
  return (
    <div className={s.demo}>
      <span className={s.label}>Copy</span>
      <div className={s.copyRow}>
        <code>tally.ng/pay/oshoke</code>
        <button type="button" className={s.copy} onClick={() => { setCopied(true); tap(6); try { navigator.clipboard?.writeText("tally.ng/pay/oshoke"); } catch {} }} aria-label={copied ? "Copied" : "Copy payment link"}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span key={String(copied)} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }} transition={{ duration: still ? 0 : 0.16, ease: [0.23, 1, 0.32, 1] }} className={copied ? s.ok : undefined}>
              <Icon name={copied ? "check" : "copy"} size={15} stroke={copied ? 2.4 : 1.8} />
            </motion.span>
          </AnimatePresence>
        </button>
      </div>
    </div>
  );
}

export default function ButtonStates() {
  return (
    <div className={s.wrap}>
      <HoldToDelete />
      <SendButton />
      <CopyButton />
    </div>
  );
}
