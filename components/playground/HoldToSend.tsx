"use client";

import { useEffect, useRef, useState } from "react";

// Hold to send: money only moves after a deliberate 1.5s hold. A tap can be an accident; a hold can't.
// The fill is a clip-path on an overlay (1.5s linear while held, 200ms ease-out snap-back on release),
// so it's interruptible and runs off the main thread. Works with touch, mouse, Space and Enter.
const HOLD_MS = 1500;

export function HoldToSend() {
  const [state, setState] = useState<"idle" | "holding" | "sent">("idle");
  const [hint, setHint] = useState("Press and hold to send");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const started = useRef(0);

  useEffect(() => () => clearTimeout(timer.current), []);

  function start() {
    if (state !== "idle") return;
    started.current = Date.now();
    setState("holding");
    setHint("Keep holding…");
    timer.current = setTimeout(() => {
      try { navigator.vibrate?.(20); } catch {}
      setState("sent");
      setHint("₦25,000 is on its way to Oshoke.");
    }, HOLD_MS);
  }

  function cancel() {
    if (state !== "holding") return;
    clearTimeout(timer.current);
    setState("idle");
    // A quick tap gets told how this button works; a long-but-early release gets encouragement.
    setHint(Date.now() - started.current < 300 ? "Hold it, don't tap. Money moves only after a full hold." : "Almost. Keep holding until it fills.");
  }

  function reset() {
    setState("idle");
    setHint("Press and hold to send");
  }

  return (
    <div className="pg-stage pg-light">
      <div className="hts-card">
        <span className="hts-k">You're sending</span>
        <b className="hts-amt">₦25,000<small>.00</small></b>
        <span className="hts-to">to Oshoke · GTBank ·· 4821</span>
      </div>
      {state === "sent" ? (
        <button type="button" className="hts-btn sent" onClick={reset}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Sent · Send again
        </button>
      ) : (
        <button
          type="button"
          className={state === "holding" ? "hts-btn holding" : "hts-btn"}
          aria-label="Send ₦25,000 to Oshoke. Press and hold for one and a half seconds."
          aria-describedby="hts-hint"
          onPointerDown={(e) => { e.currentTarget.setPointerCapture?.(e.pointerId); start(); }}
          onPointerUp={cancel}
          onPointerCancel={cancel}
          onLostPointerCapture={cancel}
          onKeyDown={(e) => { if ((e.key === " " || e.key === "Enter") && !e.repeat) { e.preventDefault(); start(); } }}
          onKeyUp={(e) => { if (e.key === " " || e.key === "Enter") cancel(); }}
          onBlur={cancel}
          onContextMenu={(e) => e.preventDefault()}
        >
          <span className="hts-fill" aria-hidden="true" />
          <span className="hts-label">Hold to send ₦25,000</span>
        </button>
      )}
      <span id="hts-hint" className="hts-hint" aria-live="polite">{hint}</span>
    </div>
  );
}
