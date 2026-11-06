"use client";

import { AnimatePresence, animate, motion, useInView, useMotionValue, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// Three QuickPay moments, prototyped with the app's real tokens and specified
// precisely enough for iOS and Android engineers to build to the frame.

const ease = [0.23, 1, 0.32, 1] as const;
const tap = () => {
  try {
    navigator.vibrate?.(12);
  } catch {}
};

type Row = [string, string];

function Spec({ rows }: { rows: Row[] }) {
  return (
    <dl className="spec">
      {rows.map(([k, v]) => (
        <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
      ))}
    </dl>
  );
}

function BalanceReveal() {
  const [shown, setShown] = useState(true);
  const reduce = useReducedMotion();
  const amount = "₦248,560";
  return (
    <div className="ms-stage ms-hero">
      <span className="ms-k">Wallet · NGN</span>
      <button type="button" className="ms-balance" onClick={() => { setShown(!shown); tap(); }} aria-label={shown ? "Hide balance" : "Show balance"}>
        <AnimatePresence mode="popLayout" initial={false}>
          {shown ? (
            <motion.span key="shown" className="ms-digits" aria-label="₦248,560.75">
              {amount.split("").map((c, i) => (
                <motion.span
                  key={i}
                  initial={reduce ? { opacity: 0 } : { y: "70%", opacity: 0, filter: "blur(4px)" }}
                  animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                  exit={reduce ? { opacity: 0 } : { y: "-40%", opacity: 0, filter: "blur(4px)", transition: { duration: 0.12 } }}
                  transition={reduce ? { duration: 0.15 } : { type: "spring", stiffness: 380, damping: 30, delay: i * 0.02 }}
                >{c}</motion.span>
              ))}
              <small>.75</small>
            </motion.span>
          ) : (
            <motion.span key="hidden" className="ms-digits" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.1 } }} transition={{ duration: 0.18 }}>
              ₦ ••••••
            </motion.span>
          )}
        </AnimatePresence>
      </button>
      <span className="ms-hint">Tap the balance</span>
    </div>
  );
}

function SendSuccess() {
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const reduce = useReducedMotion();
  function send() {
    if (state !== "idle") return setState("idle");
    tap();
    setState("sending");
    setTimeout(() => { setState("sent"); tap(); }, 700);
  }
  return (
    <div className="ms-stage ms-light">
      <AnimatePresence mode="wait" initial={false}>
        {state === "sent" ? (
          <motion.div key="sent" className="ms-sent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
            <motion.svg viewBox="0 0 56 56" width="56" height="56" initial={reduce ? false : { scale: 0.85 }} animate={{ scale: 1 }} transition={{ type: "spring", duration: 0.45, bounce: 0.25 }}>
              <circle cx="28" cy="28" r="28" fill="#16a34a" />
              <motion.path d="M17 29l7 7 15-16" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
                initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.32, ease, delay: 0.08 }} />
            </motion.svg>
            <motion.b initial={reduce ? false : { y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3, ease, delay: 0.16 }}>Money sent</motion.b>
            <motion.span initial={reduce ? false : { y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3, ease, delay: 0.22 }}>₦25,000 is on its way to Adaeze.</motion.span>
            <button type="button" className="ms-btn ghost" onClick={send}>Send again</button>
          </motion.div>
        ) : (
          <motion.div key="confirm" className="ms-confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
            <span className="ms-k dark">Confirm transfer</span>
            <b className="ms-amt">₦25,000<small>.00</small></b>
            <span className="ms-sub">to Adaeze Chioma Okafor · GTBank</span>
            <button type="button" className="ms-btn" onClick={send} disabled={state === "sending"}>
              {state === "sending" ? <span className="ms-spin" aria-label="Sending" /> : "Confirm and send"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FreezeCard() {
  const [frozen, setFrozen] = useState(false);
  const reduce = useReducedMotion();
  return (
    <div className="ms-stage ms-light">
      <motion.div className="ms-card" animate={reduce ? {} : { scale: frozen ? 0.98 : 1 }} transition={{ type: "spring", stiffness: 420, damping: 32 }}>
        <span className="ms-card-top"><b>QuickPay</b><i>Virtual</i></span>
        <span className="ms-card-num">•••• 4291</span>
        <AnimatePresence>
          {frozen && (
            <motion.span className="ms-frost" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.18, ease } }} transition={{ duration: 0.24, ease }}>
              <motion.span className="ms-flake" initial={reduce ? false : { scale: 0.6, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}>❄</motion.span>
              Card frozen
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
      <button type="button" className="ms-btn" onClick={() => { setFrozen(!frozen); tap(); }}>{frozen ? "Unfreeze card" : "Freeze card"}</button>
    </div>
  );
}

const ACTIONS = 136; // two 68px actions behind the row
const snap = { type: "spring", stiffness: 500, damping: 40 } as const;

function SwipeRow() {
  const x = useMotionValue(0);
  const reduce = useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const inView = useInView(stage, { once: true, amount: 0.8 });
  const [done, setDone] = useState("");
  const past = useRef(false);
  const open = (to: number) => animate(x, to, reduce ? { duration: 0.12 } : snap);

  // The first time the row is on screen it peeks 28px open, once, to show it can be swiped.
  useEffect(() => {
    if (!inView || reduce) return;
    const t = setTimeout(async () => {
      await animate(x, -28, { type: "spring", stiffness: 400, damping: 30 });
      animate(x, 0, { type: "spring", stiffness: 400, damping: 30, delay: 0.15 });
    }, 400);
    return () => clearTimeout(t);
  }, [inView, reduce, x]);

  function act(label: string) {
    tap();
    setDone(label);
    open(0);
  }

  return (
    <div className="ms-stage ms-light" ref={stage}>
      <div className="ms-row-wrap">
        <div className="ms-actions">
          <button type="button" className="ms-act" onClick={() => act("Send opens with ₦5,000 to Adaeze filled in")}>Repeat</button>
          <button type="button" className="ms-act alt" onClick={() => act("Split opens with ₦5,000 to divide")}>Split</button>
        </div>
        <motion.div
          className="ms-row"
          style={{ x }}
          drag="x"
          dragConstraints={{ left: -ACTIONS, right: 0 }}
          dragElastic={0.12}
          dragMomentum={false}
          onDrag={() => {
            const now = x.get() < -ACTIONS / 2;
            if (now !== past.current) { past.current = now; tap(); }
          }}
          onDragEnd={(_, info) => {
            const shouldOpen = x.get() < -ACTIONS / 2 || info.velocity.x < -500;
            const shouldClose = info.velocity.x > 500;
            open(shouldOpen && !shouldClose ? -ACTIONS : 0);
          }}
          tabIndex={0}
          role="button"
          aria-label="Transfer to Adaeze, ₦5,000. Press Enter for Repeat and Split"
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(x.get() < 0 ? 0 : -ACTIONS); } if (e.key === "Escape") open(0); }}
        >
          <span className="ms-avatar">AO</span>
          <span className="ms-row-text"><b>Adaeze Okafor</b><i>Today, 09:41</i></span>
          <span className="ms-row-amt">−₦5,000</span>
        </motion.div>
      </div>
      <span className="ms-hint">{done || "Swipe the payment left"}</span>
    </div>
  );
}

const moments: { title: string; why: string; demo: React.ReactNode; spec: Row[] }[] = [
  {
    title: "Balance reveal",
    why: "Showing a balance should feel deliberate and private, never like a glitch.",
    demo: <BalanceReveal />,
    spec: [
      ["Trigger", "Tap the balance, or the eye button"],
      ["Show", "Digits rise 70% → 0 with a 4px → 0 blur, 20ms apart, left to right"],
      ["Curve", "Spring, stiffness 380, damping 30 (settles in about 300ms)"],
      ["Hide", "Digits leave upward in 120ms; ₦ •••••• fades in over 180ms"],
      ["Haptic", "iOS: impact, light · Android: CLOCK_TICK"],
      ["Reduced motion", "Crossfade only, 150ms, no movement or blur"],
    ],
  },
  {
    title: "Send success",
    why: "The moment money leaves needs a clear, calm confirmation, not a celebration.",
    demo: <SendSuccess />,
    spec: [
      ["Trigger", "Confirm and send; success when the transfer is accepted"],
      ["Button", "Label → spinner, 150ms fade; stays pressed until the result"],
      ["Check", "Circle springs 0.85 → 1 (duration 450ms, bounce 0.25); tick draws over 320ms"],
      ["Text", "Title and line fade up 8px, 300ms, 60ms apart, after the tick starts"],
      ["Haptic", "iOS: notification, success · Android: CONFIRM"],
      ["Reduced motion", "Tick appears drawn; text fades without moving"],
    ],
  },
  {
    title: "Freeze card",
    why: "Freezing is a safety action, so the state change has to be impossible to miss.",
    demo: <FreezeCard />,
    spec: [
      ["Trigger", "Freeze card, or Unfreeze card"],
      ["Freeze", "Frost layer fades in over 240ms; card settles to 98% scale on a spring (stiffness 420, damping 32)"],
      ["Icon", "Snowflake springs from 60% and −30° (duration 500ms, bounce 0.3)"],
      ["Unfreeze", "Frost leaves faster, in 180ms, so the card feels ready at once"],
      ["Haptic", "iOS: impact, rigid · Android: REJECT on freeze, CONFIRM on unfreeze"],
      ["Reduced motion", "Frost fades; no scale or rotation"],
    ],
  },
  {
    title: "Swipe a payment",
    why: "Repeating or splitting a payment is common, so it should take one swipe, with a way in for people who can't swipe.",
    demo: <SwipeRow />,
    spec: [
      ["Gesture", "Horizontal drag on the row; vertical scroll wins if the first 10pt of movement is mostly vertical"],
      ["Open", "Past half the action width (68pt), or a flick faster than 500pt/s, snaps open; anything else snaps back"],
      ["Curve", "Spring, stiffness 500, damping 40; it keeps the finger's speed when released"],
      ["Edges", "Past the actions or to the right, the row follows at 12% of the finger (rubber band)"],
      ["Haptic", "A selection tick each time the row crosses the halfway point, so people feel it will open. iOS: selection · Android: SEGMENT_TICK"],
      ["Teaching", "The first time it's on screen, the row peeks 28pt open and back, once"],
      ["Without swiping", "VoiceOver and TalkBack list Repeat and Split as row actions; with a keyboard, Enter opens them and Escape closes them"],
      ["Reduced motion", "No peek; the row snaps in 120ms with no spring"],
    ],
  },
];

export function MotionSpecs() {
  return (
    <div className="ms">
      {moments.map((m) => (
        <section key={m.title} className="ms-item" aria-label={m.title}>
          {m.demo}
          <div className="ms-text">
            <b>{m.title}</b>
            <p>{m.why}</p>
            <Spec rows={m.spec} />
          </div>
        </section>
      ))}
    </div>
  );
}
