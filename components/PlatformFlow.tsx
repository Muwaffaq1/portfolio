"use client";

import { Roboto } from "next/font/google";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

// QuickPay's send flow adapted to iOS and Android. Both phones share the tokens, amounts, copy and
// states; what changes is the platform layer: navigation and back, sheets, biometrics, type and haptics.

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-roboto" });

type Platform = "ios" | "android";
const steps = ["Amount", "Confirm", "Verify", "Sent"] as const;

const notes: Record<number, { ios: string; android: string }> = {
  0: {
    ios: "Back chevron with the previous screen's name; swipe from the left edge to go back. Title centred in SF Pro.",
    android: "Top app bar with a back arrow and a left-aligned title in Roboto. The system back gesture does the same.",
  },
  1: {
    ios: "A page sheet with a grabber. The screen behind recedes, and Cancel sits in the sheet's top bar.",
    android: "A Material 3 modal bottom sheet with a drag handle and a scrim. Back or a tap on the scrim closes it.",
  },
  2: {
    ios: "Face ID through the system prompt (LocalAuthentication), with Use PIN instead as the fallback.",
    android: "BiometricPrompt from androidx.biometric, strong biometrics only, with Use PIN as its negative button.",
  },
  3: {
    ios: "Success haptic: UINotificationFeedbackGenerator, .success. Done returns Home, never to the PIN step.",
    android: "Success haptic: HapticFeedbackConstants.CONFIRM. System back goes Home, because the send stack is cleared.",
  },
};

const Chevron = () => (
  <svg width="12" height="20" viewBox="0 0 12 20" aria-hidden="true"><path d="M10 2 2 10l8 8" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const Arrow = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12H5m6-7-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const FaceId = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
    <path d="M4 18V10a6 6 0 0 1 6-6h8M46 4h8a6 6 0 0 1 6 6v8M60 46v8a6 6 0 0 1-6 6h-8M18 60h-8a6 6 0 0 1-6-6v-8" />
    <path d="M22 24v5M42 24v5M32 24v13h-3M24 44c4.5 4 11.5 4 16 0" />
  </svg>
);
const Fingerprint = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="M6.5 4.6A9 9 0 0 1 20.9 12M3.1 12a9 9 0 0 1 1.5-5M17.5 20.5A12 12 0 0 0 19 15M8 20a12 12 0 0 1-2-7 6 6 0 0 1 12 0v1M12 13v1a16 16 0 0 0 2.3 8M9.5 21a17 17 0 0 1-1.5-7 4 4 0 0 1 8 0" />
  </svg>
);
const Check = () => (
  <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true"><circle cx="28" cy="28" r="28" fill="var(--ok)" /><path d="M17 29l7 7 15-16" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

function StatusBar({ p }: { p: Platform }) {
  return (
    <div className={`pf-status ${p}`} aria-hidden="true">
      <span>9:41</span>
      {p === "ios" ? <><i /><i /><i className="bat" /></> : <><i className="dot" /><i className="dot" /><i className="bat" /></>}
    </div>
  );
}

function TopBar({ p, title }: { p: Platform; title: string }) {
  return p === "ios" ? (
    <div className="pf-nav ios"><span className="pf-back"><Chevron /> Home</span><b>{title}</b><span /></div>
  ) : (
    <div className="pf-nav android"><span className="pf-icon"><Arrow /></span><b>{title}</b></div>
  );
}

function AmountScreen({ p }: { p: Platform }) {
  return (
    <div className="pf-body">
      <TopBar p={p} title="Send money" />
      <div className="pf-to"><span className="pf-av">AO</span><span>Adaeze Okafor · GTBank</span></div>
      <div className="pf-amt">₦25,000<small>.00</small></div>
      <div className="pf-bal">Balance ₦248,560.75</div>
      <div className="pf-keys" aria-hidden="true">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "⌫"].map((k) => <span key={k}>{k}</span>)}
      </div>
      <span className="pf-btn">Continue</span>
    </div>
  );
}

function ConfirmSheet({ p, children }: { p: Platform; children?: React.ReactNode }) {
  return (
    <div className={`pf-sheet ${p}`}>
      {p === "ios" ? (
        <><span className="pf-grab" /><div className="pf-sheet-bar"><span>Cancel</span><b>Confirm</b><span /></div></>
      ) : (
        <><span className="pf-handle" /><b className="pf-sheet-title">Confirm transfer</b></>
      )}
      <div className="pf-amt sm">₦25,000<small>.00</small></div>
      <dl className="pf-rows">
        <div><dt>To</dt><dd>Adaeze Okafor</dd></div>
        <div><dt>Bank</dt><dd>GTBank · 0123456789</dd></div>
        <div><dt>Fee</dt><dd>₦0.00</dd></div>
        <div><dt>Arrives</dt><dd>Usually instant</dd></div>
      </dl>
      <span className="pf-btn">Confirm and send</span>
      {children}
    </div>
  );
}

function Screen({ p, step }: { p: Platform; step: number }) {
  if (step === 3) {
    return (
      <div className="pf-body pf-done">
        <Check />
        <b>₦25,000 sent</b>
        <span>To Adaeze Okafor at GTBank. It usually arrives in a few seconds.</span>
        <span className="pf-btn ghost">Share receipt</span>
        <span className="pf-btn">Done</span>
      </div>
    );
  }
  return (
    <>
      <div className={step > 0 ? `pf-under ${p}` : "pf-under flat"}><AmountScreen p={p} /></div>
      {step > 0 && <div className={`pf-scrim ${p}`} />}
      {step > 0 && <ConfirmSheet p={p} />}
      {step === 2 && p === "ios" && (
        <div className="pf-faceid"><FaceId /><span>Face ID</span></div>
      )}
      {step === 2 && p === "android" && (
        <div className="pf-bio">
          <b>Confirm ₦25,000 to Adaeze</b>
          <span>Use your fingerprint</span>
          <span className="pf-print"><Fingerprint /></span>
          <span className="pf-neg">Use PIN</span>
        </div>
      )}
      {step === 2 && p === "ios" && <span className="pf-fallback">Use PIN instead</span>}
    </>
  );
}

function Phone({ p, step }: { p: Platform; step: number }) {
  const reduce = useReducedMotion();
  return (
    <figure className="pf-figure">
      <div className={`pf-phone ${p} ${p === "android" ? roboto.variable : ""}`} role="img" aria-label={`${p === "ios" ? "iOS" : "Android"}: ${steps[step]} step. ${notes[step][p]}`}>
        <div className="pf-screen">
          <StatusBar p={p} />
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={step} className="pf-stage" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0.1 : 0.18 }}>
              <Screen p={p} step={step} />
            </motion.div>
          </AnimatePresence>
          <span className={`pf-home ${p}`} />
        </div>
      </div>
      <figcaption><b>{p === "ios" ? "iOS" : "Android"}</b> {notes[step][p]}</figcaption>
    </figure>
  );
}

export function PlatformFlow() {
  const [step, setStep] = useState(0);
  return (
    <div className="pf">
      <div className="seg pf-steps" role="group" aria-label="Step in the send flow">
        {steps.map((s, i) => (
          <button key={s} type="button" aria-pressed={step === i} onClick={() => setStep(i)}>
            {i + 1} · {s}
          </button>
        ))}
      </div>
      <div className="pf-pair">
        <Phone p="ios" step={step} />
        <Phone p="android" step={step} />
      </div>
      <button type="button" className="pf-next" onClick={() => setStep((step + 1) % steps.length)}>
        {step === steps.length - 1 ? "Start again" : `Next: ${steps[step + 1]}`}
      </button>
    </div>
  );
}
