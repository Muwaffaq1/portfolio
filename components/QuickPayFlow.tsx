"use client";

import { AnimatePresence, animate, motion, useInView, useMotionValue, useMotionValueEvent, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { motionPaused, onMotionChange } from "@/lib/motion";
import s from "./QuickPayFlow.module.css";

// QuickPay's Send money flow, rebuilt in code from the Figma file (tokens, type, Phosphor icons)
// so every step is connected: the press, the typed amount, the sheet, the PIN, the live steps,
// and a home screen that reflects the transfer. It plays itself; tap anywhere to take over.

type Screen = "home" | "sendto" | "amount" | "sending" | "sent";
type Move = "push" | "pop" | "fade";
type Sheet = null | "confirm" | "pin";

const START = 248560.75;
const naira = (n: number) => "₦" + Math.floor(n).toLocaleString("en-NG");
const kobo = (n: number) => "." + Math.round((n % 1) * 100).toString().padStart(2, "0");
const buzz = () => { try { navigator.vibrate?.(8); } catch {} };

function I({ n, size = 24, className }: { n: string; size?: number; className?: string }) {
  const url = `url(/qp/${n}.svg)`;
  return <span aria-hidden="true" className={`${s.icon} ${className ?? ""}`} style={{ width: size, height: size, WebkitMaskImage: url, maskImage: url }} />;
}

function Status({ light }: { light?: boolean }) {
  return (
    <div className={`${s.status} ${light ? s.onHero : ""}`} aria-hidden="true">
      <span>9:41</span>
      <i style={{ width: 17 }} /><i style={{ width: 16 }} /><i style={{ width: 25, height: 12, borderRadius: 3.5 }} />
    </div>
  );
}

function Amount({ value, size = "large", tone }: { value: number; size?: "hero" | "large" | "row"; tone?: "in" | "out" }) {
  return (
    <span className={`${s.amount} ${s[size]} ${tone === "in" ? s.in : ""}`}>
      {tone === "out" ? "−" : tone === "in" ? "+" : ""}{naira(value)}<small>{kobo(value)}</small>
    </span>
  );
}

function Keypad({ onKey, dot = true, demoPrefix }: { onKey: (k: string) => void; dot?: boolean; demoPrefix: string }) {
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", dot ? "." : "", "0", "del"];
  return (
    <div className={s.keypad}>
      {keys.map((k, i) => k === "" ? <span key={i} /> : (
        <button key={i} type="button" className={s.key} data-demo={`${demoPrefix}${k}`} onClick={() => onKey(k)} aria-label={k === "del" ? "Delete" : k}>
          {k === "del" ? <I n="backspace" size={26} /> : k}
        </button>
      ))}
    </div>
  );
}

function Row({ initials, name, sub, value, tone, pending, icon }: { initials?: string; name: string; sub: string; value: number; tone?: "in" | "out"; pending?: boolean; icon?: string }) {
  return (
    <div className={s.txn}>
      <span className={`${s.avatar} ${pending ? s.avatarSubtle : ""}`}>
        {icon ? <I n={icon} size={20} /> : initials}
        <span className={s.badge}><span><I n={tone === "in" ? "arrow-down-left" : "arrow-up-right"} size={10} /></span></span>
      </span>
      <span className={s.txnText}><b>{name}</b><small className={pending ? s.warn : ""}>{sub}</small></span>
      <Amount value={value} size="row" tone={tone} />
    </div>
  );
}

export function QuickPayFlow() {
  const reduce = useReducedMotion();
  const [screen, setScreen] = useState<Screen>("home");
  const [move, setMove] = useState<Move>("fade");
  const [sheet, setSheet] = useState<Sheet>(null);
  const [digits, setDigits] = useState("");
  const [pin, setPin] = useState(0);
  const [step, setStep] = useState(1); // sending: 1 approved, 2 sent to bank, 3 delivered
  const [sent, setSent] = useState(false);
  const [demo, setDemo] = useState(true);
  const [finger, setFinger] = useState({ x: 0, y: 0, on: false, down: false });
  const wrap = useRef<HTMLDivElement>(null);
  const balance = useMotionValue(START);
  const [shown, setShown] = useState(START);
  useMotionValueEvent(balance, "change", (v) => setShown(Math.round(v * 100) / 100));

  const amount = Number(digits || "0");
  const tooMuch = amount > START;
  const go = useCallback((to: Screen, how: Move) => { setMove(how); setScreen(to); }, []);

  const reset = useCallback(() => {
    setSheet(null); setDigits(""); setPin(0); setStep(1); setSent(false);
    balance.jump(START); go("home", "fade");
  }, [balance, go]);

  // One dispatcher for taps, whether a person or the demo makes them.
  const act = useCallback((id: string) => {
    buzz();
    if (id === "send") go("sendto", "push");
    else if (id === "back") go(screen === "amount" ? "sendto" : "home", "pop");
    else if (id === "recent-AO") { setDigits(""); go("amount", "push"); }
    else if (id.startsWith("chip-")) setDigits(id.slice(5));
    else if (id === "continue") { if (amount > 0 && !tooMuch) setSheet("confirm"); }
    else if (id === "sheet-close") setSheet(null);
    else if (id === "confirm") { setPin(0); setSheet("pin"); }
    else if (id.startsWith("pin-")) {
      const k = id.slice(4);
      if (k === "del") setPin((p) => Math.max(0, p - 1));
      else setPin((p) => Math.min(4, p + 1));
    } else if (id.startsWith("key-")) {
      const k = id.slice(4);
      if (k === "del") setDigits((d) => d.slice(0, -1));
      else if (k !== ".") setDigits((d) => (d === "" && k === "0") || d.length >= 7 ? d : d + k);
    } else if (id === "done" || id === "back-home") { setSent(true); go("home", "fade"); }
  }, [amount, tooMuch, go, screen]);

  // The demo reads the latest dispatcher through a ref, so it never acts on stale state.
  const actRef = useRef(act);
  actRef.current = act;

  // Four digits approve the payment: the sheet closes and the sending screen takes over.
  useEffect(() => {
    if (sheet !== "pin" || pin < 4) return;
    const t = setTimeout(() => { setSheet(null); setStep(1); go("sending", "fade"); }, 380);
    return () => clearTimeout(t);
  }, [pin, sheet, go]);

  // The sending steps tick through on their own, as the real payment would.
  useEffect(() => {
    if (screen !== "sending") return;
    const a = setTimeout(() => setStep(2), 1500);
    const b = setTimeout(() => setStep(3), 2300);
    const c = setTimeout(() => go("sent", "fade"), 3000);
    return () => { clearTimeout(a); clearTimeout(b); clearTimeout(c); };
  }, [screen, go]);

  // Back home after a transfer: the balance counts down to its new value.
  useEffect(() => {
    if (!sent || screen !== "home") return;
    const ctl = animate(balance, START - amount, { duration: reduce ? 0 : 0.9, ease: [0.23, 1, 0.32, 1], delay: reduce ? 0 : 0.35 });
    return () => ctl.stop();
  }, [sent, screen, amount, balance, reduce]);

  // ---- Demo: a finger walks through the flow, then it loops. Any real tap hands over control.
  const [paused, setPaused] = useState(false);
  const [loop, setLoop] = useState(0);
  useEffect(() => { setPaused(motionPaused()); return onMotionChange(() => setPaused(motionPaused())); }, []);
  // Only plays while on screen, and never for people who ask for reduced motion or pause the site.
  const inView = useInView(wrap, { amount: 0.35 });
  const running = demo && !paused && !reduce && inView;

  const pointAt = useCallback((id: string) => {
    const el = wrap.current?.querySelector<HTMLElement>(`[data-demo="${id}"]`);
    const box = wrap.current?.getBoundingClientRect();
    if (!el || !box) return false;
    const r = el.getBoundingClientRect();
    setFinger({ x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2, on: true, down: false });
    return true;
  }, []);

  useEffect(() => {
    if (!running) { setFinger((f) => ({ ...f, on: false })); return; }
    let cancelled = false;
    const wait = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));
    const tap = async (id: string, before = 520) => {
      if (cancelled) return;
      pointAt(id);
      await wait(before);
      if (cancelled) return;
      setFinger((f) => ({ ...f, down: true }));
      await wait(110);
      if (cancelled) return;
      actRef.current(id);
      setFinger((f) => ({ ...f, down: false }));
    };
    (async () => {
      reset();
      await wait(1400);
      await tap("send");
      await wait(700);
      await tap("recent-AO");
      await wait(600);
      for (const k of ["2", "5", "0", "0", "0"]) await tap(`key-${k}`, 230);
      await wait(400);
      await tap("continue");
      await wait(1300);
      await tap("confirm");
      await wait(500);
      for (const k of ["1", "9", "8", "4"]) await tap(`pin-${k}`, 210);
      setFinger((f) => ({ ...f, on: false }));
      await wait(4600); // sending steps, then "Money sent"
      await tap("done", 900);
      setFinger((f) => ({ ...f, on: false }));
      await wait(3800);
      if (!cancelled) setLoop((n) => n + 1); // and again
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, loop]);

  function takeOver(e: React.PointerEvent) {
    if (demo && e.isTrusted) { setDemo(false); setFinger((f) => ({ ...f, on: false })); }
  }

  // Motion: iOS-style push for navigation, a fade for the payment's own screens.
  const spring = reduce ? { duration: 0.15 } : move === "fade" ? { duration: 0.3, ease: [0.23, 1, 0.32, 1] as const } : { type: "spring" as const, duration: 0.5, bounce: 0 };
  const variants = {
    enter: (m: Move) => reduce || m === "fade" ? { x: 0, opacity: 0, scale: reduce ? 1 : 0.985 } : { x: m === "push" ? "100%" : "-30%", opacity: 1, scale: 1 },
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (m: Move) => reduce || m === "fade" ? { x: 0, opacity: 0, scale: 1 } : { x: m === "push" ? "-30%" : "100%", opacity: 1, scale: 1 },
  };

  const whole = digits === "" ? "₦0" : naira(amount);

  return (
    <div className={s.wrap} ref={wrap} role="group" aria-label="QuickPay Send money prototype">
      <div className={s.phone} onPointerDownCapture={takeOver} onKeyDownCapture={() => demo && setDemo(false)}>
        <div className={s.screen}>
          <AnimatePresence initial={false} custom={move}>
            <motion.div key={screen} className={`${s.page} ${move !== "fade" ? s.pushed : ""}`} custom={move} variants={variants} initial="enter" animate="center" exit="exit" transition={spring}>
              {screen === "home" && (
                <div className={s.home}>
                  <div className={s.heroBg}>
                    <Status light />
                    <div className={s.topRow}>
                      <span className={s.avatar}>AO</span>
                      <span className={s.search}><I n="magnifying-glass" size={18} />Search</span>
                      <span className={s.glass}><I n="qr-code" size={20} /></span>
                      <img src="/qp/bell-button.svg" width={40} height={40} alt="" />
                    </div>
                    <div className={s.balance}>
                      <span className={s.walletLabel}>Wallet · NGN</span>
                      <Amount value={shown} size="hero" />
                      <span className={s.pill}>Account details</span>
                      <img src="/qp/pager.svg" width={26} height={22} alt="" />
                    </div>
                  </div>
                  <div className={s.actions}>
                    {/* Only Send is wired up in this prototype, so the others aren't buttons */}
                    {[["plus", "Add money", true], ["paper-plane-tilt", "Send", true], ["receipt", "Pay bills", false], ["hand-coins", "Request", false]].map(([icon, label, primary]) => {
                      const inner = <><span className={primary ? s.circle : `${s.circle} ${s.circleSubtle}`}><I n={icon as string} /></span>{label}</>;
                      return label === "Send"
                        ? <button key="send" type="button" className={s.action} data-demo="send" onClick={() => act("send")}>{inner}</button>
                        : <span key={label as string} className={s.action}>{inner}</span>;
                    })}
                  </div>
                  <div className={s.content}>
                    <div className={s.card}>
                      <AnimatePresence initial={false}>
                        {sent && (
                          <motion.div key="new" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} transition={{ ...spring, delay: reduce ? 0 : 0.5 }} style={{ overflow: "hidden" }}>
                            <Row initials="AO" name="Adaeze Okafor" sub="Just now · Transfer" value={amount} tone="out" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <Row initials="AO" name="Adaeze Okafor" sub="2:41 PM · Transfer" value={25000} tone="out" />
                      <Row initials="TB" name="Tunde Bakare" sub="11:02 AM · Transfer" value={150000} tone="in" />
                      {!sent && <Row icon="lightning-row" name="Ikeja Electric" sub="Pending · 9:15 AM" value={10000} tone="out" pending />}
                      <span className={s.seeAll}>See all</span>
                    </div>
                    <div className={`${s.card} ${s.bills}`}>
                      <div className={s.billsHead}><b>Pay bills</b><small>2% back on data</small></div>
                      <div className={s.billers}>
                        {[["device-mobile", "Airtime"], ["wifi-high", "Data"], ["lightning", "Electricity"], ["television", "TV"]].map(([icon, label]) => (
                          <span key={label}><span className={`${s.circle} ${s.circleSubtle}`}><I n={icon} size={28} /></span>{label}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className={s.tabs}>
                    {[["house-fill", "Home"], ["arrows-left-right", "Payments"], ["credit-card", "Cards"], ["gift", "Rewards"], ["user", "Account"]].map(([icon, label], i) => (
                      <span key={label} className={i === 0 ? s.tabOn : ""}><I n={icon} />{label}</span>
                    ))}
                    <i className={s.indicator} />
                  </div>
                </div>
              )}

              {screen === "sendto" && (
                <div className={s.plain}>
                  <Status />
                  <div className={s.appBar}>
                    <button type="button" className={s.iconBtn} data-demo="back" onClick={() => act("back")} aria-label="Back"><I n="arrow-left" /></button>
                    <b>Send money</b>
                    <span className={s.iconBtn}><I n="question" /></span>
                  </div>
                  <div className={s.body}>
                    <span className={s.field}><I n="magnifying-glass" size={18} />Name, account number or phone</span>
                    <span className={s.over}>Recent</span>
                    <div className={s.recent}>
                      {[["AO", "Adaeze"], ["TB", "Tunde"], ["CN", "Chidi"], ["FI", "Fatima"]].map(([i, n]) => (
                        <button key={i} type="button" data-demo={`recent-${i}`} onClick={i === "AO" ? () => act("recent-AO") : undefined}>
                          <span className={`${s.avatar} ${s.avatarLg}`}>{i}</span>{n}
                        </button>
                      ))}
                    </div>
                    <div className={s.listCard}>
                      <div className={s.listRow}><span className={`${s.avatar} ${s.avatarSubtle}`}><I n="plus" size={20} /></span><span className={s.txnText}><b>Send to a new account</b><small>Any Nigerian bank or QuickPay user</small></span><I n="caret-right" size={20} className={s.muted} /></div>
                    </div>
                    <span className={s.over}>Saved recipients</span>
                    <div className={s.listCard}>
                      {[["KE", "Kemi Adeyemi", "GTBank · 0234567891"], ["MU", "Musa Ibrahim", "Access Bank · 0987654321"], ["NO", "Ngozi Okonkwo", "QuickPay · 0803 555 0192"]].map(([i, n, d]) => (
                        <div key={i} className={s.listRow}><span className={s.avatar}>{i}</span><span className={s.txnText}><b>{n}</b><small>{d}</small></span><I n="caret-right" size={20} className={s.muted} /></div>
                      ))}
                    </div>
                  </div>
                  <i className={s.indicator} />
                </div>
              )}

              {screen === "amount" && (
                <div className={s.plain}>
                  <Status />
                  <div className={s.appBar}>
                    <button type="button" className={s.iconBtn} onClick={() => act("back")} aria-label="Back"><I n="arrow-left" /></button>
                    <b>Send money</b>
                    <span className={s.iconBtn} />
                  </div>
                  <div className={s.body}>
                    <div className={s.recipient}><span className={s.avatar}>AO</span><span className={s.txnText}><b className={s.caps}>Adaeze Chioma Okafor</b><small>GTBank · 0234567891</small></span><span className={s.link}>Change</span></div>
                    <div className={s.entry} aria-live="polite">
                      <span className={`${s.amount} ${s.big} ${digits === "" ? s.empty : ""}`}>
                        {whole.split("").map((c, i) => (
                          <motion.span key={`${i}-${c}-${whole.length}`} initial={reduce ? false : { y: "45%", opacity: 0, filter: "blur(3px)" }} animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }} transition={{ type: "spring", duration: 0.35, bounce: 0.15 }} style={{ display: "inline-block" }}>{c}</motion.span>
                        ))}
                        <small>.00</small>
                      </span>
                      <span className={`${s.meta} ${tooMuch ? s.overLimit : ""}`}>{tooMuch ? "More than your balance of ₦248,560.75" : "Balance ₦248,560.75 · No fee · Arrives in seconds"}</span>
                    </div>
                    <div className={s.chips}>{["5000", "10000", "20000"].map((c) => <button key={c} type="button" onClick={() => act(`chip-${c}`)}>{naira(Number(c))}</button>)}</div>
                    <span className={`${s.field} ${s.note}`}>What’s it for? (optional)</span>
                    <button type="button" className={s.primary} data-demo="continue" disabled={amount === 0 || tooMuch} onClick={() => act("continue")}>Continue</button>
                  </div>
                  <Keypad onKey={(k) => act(`key-${k}`)} demoPrefix="key-" />
                  <i className={s.indicator} />
                </div>
              )}

              {screen === "sending" && (
                <div className={s.plain}>
                  <Status />
                  <div className={s.center}>
                    <span className={s.spinner} aria-hidden="true" />
                    <h3 className={s.title}>Sending {naira(amount)}</h3>
                    <p className={s.lead}>To Adaeze Okafor at GTBank. This usually takes a few seconds — you can leave this screen.</p>
                    <div className={`${s.listCard} ${s.steps}`} aria-live="polite">
                      {[["Payment approved", "PIN confirmed"], ["Sending to GTBank", "Usually instant"], ["Delivered", "We’ll show your receipt"]].map(([t, d], i) => {
                        const n = i + 1; const done = n <= step; const active = n === step + 1;
                        return (
                          <div key={t} className={`${s.step} ${done ? s.done : active ? s.active : ""}`}>
                            <span className={s.dot}>
                              <AnimatePresence initial={false}>{done && <motion.span key="c" initial={reduce ? false : { scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", duration: 0.35, bounce: 0.3 }}><I n="check-bold" size={12} /></motion.span>}</AnimatePresence>
                            </span>
                            <span className={s.txnText}><b>{t}</b><small>{d}</small></span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <button type="button" className={s.textBtn} onClick={() => act("back-home")}>Back to Home</button>
                  <i className={s.indicator} />
                </div>
              )}

              {screen === "sent" && (
                <div className={s.plain}>
                  <Status />
                  <div className={s.closeRow}><button type="button" className={s.iconBtn} onClick={() => act("done")} aria-label="Close"><I n="x" /></button></div>
                  <div className={s.center} style={{ paddingTop: 150 }}>
                    <motion.span className={s.success} initial={reduce ? false : { scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", duration: 0.5, bounce: 0.35 }}>
                      <span>
                        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><motion.path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.35, delay: 0.15, ease: [0.23, 1, 0.32, 1] }} /></svg>
                      </span>
                    </motion.span>
                    <h3 className={s.title}>Money sent</h3>
                    <p className={s.lead}>{naira(amount)} is on its way to Adaeze Okafor. It usually arrives in seconds.</p>
                    <div className={s.stack}>
                      <button type="button" className={s.primary} data-demo="done" onClick={() => act("done")}>Done</button>
                      <button type="button" className={s.secondary}>Share receipt</button>
                      <span className={s.link}>Send again</span>
                    </div>
                  </div>
                  <i className={s.indicator} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Confirm and PIN share one sheet, so it changes height instead of closing and reopening. */}
          <AnimatePresence>
            {sheet && <motion.div key="scrim" className={s.scrim} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} onClick={() => act("sheet-close")} />}
            {sheet && (
              <motion.div key="sheet" className={s.sheet} role="dialog" aria-label={sheet === "pin" ? "Enter your PIN" : "Confirm transfer"} initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={reduce ? { duration: 0.15 } : { type: "spring", duration: 0.45, bounce: 0 }} layout>
                <span className={s.grabber} />
                <AnimatePresence mode="popLayout" initial={false}>
                  {sheet === "confirm" ? (
                    <motion.div key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.12 } }}>
                      <div className={s.sheetHead}><b>Confirm transfer</b><button type="button" className={s.iconBtn} onClick={() => act("sheet-close")} aria-label="Close"><I n="x" /></button></div>
                      <div className={s.sheetHero}><Amount value={amount} size="large" /><small>to Adaeze Chioma Okafor</small></div>
                      <dl className={s.details}>
                        <div><dt>Bank</dt><dd>GTBank</dd></div>
                        <div><dt>Account number</dt><dd>0234567891</dd></div>
                        <div><dt>Fee</dt><dd>₦0.00</dd></div>
                        <div><dt>Note</dt><dd>Rent share</dd></div>
                      </dl>
                      <div className={s.payFrom}><I n="wallet" /><span className={s.txnText}><b>Pay from wallet</b><small>Balance ₦248,560.75</small></span><span className={s.link}>Change</span></div>
                      <button type="button" className={s.primary} data-demo="confirm" onClick={() => act("confirm")}>Confirm and send</button>
                    </motion.div>
                  ) : (
                    <motion.div key="pin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <div className={s.sheetHead}><b>Enter your PIN</b><button type="button" className={s.iconBtn} onClick={() => act("sheet-close")} aria-label="Close"><I n="x" /></button></div>
                      <p className={s.pinLead}>To send {naira(amount)} to Adaeze Okafor</p>
                      <div className={s.pinDots} aria-label={`${pin} of 4 digits entered`}>
                        {[0, 1, 2, 3].map((i) => <motion.i key={i} className={i < pin ? s.filled : ""} animate={i < pin && !reduce ? { scale: [1, 1.25, 1] } : { scale: 1 }} transition={{ duration: 0.22 }} />)}
                      </div>
                      <Keypad onKey={(k) => act(`pin-${k}`)} dot={false} demoPrefix="pin-" />
                    </motion.div>
                  )}
                </AnimatePresence>
                <i className={s.indicator} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* The demo's finger. Hidden once a person takes over. */}
      <motion.span className={s.finger} aria-hidden="true" initial={false} animate={{ x: finger.x - 22, y: finger.y - 22, opacity: finger.on ? 1 : 0, scale: finger.down ? 0.8 : 1 }} transition={{ x: { type: "spring", duration: 0.55, bounce: 0.1 }, y: { type: "spring", duration: 0.55, bounce: 0.1 }, opacity: { duration: 0.2 }, scale: { duration: 0.1 } }} />

      <div className={s.controls}>
        {demo ? (
          <span className={s.hint}>{paused || reduce ? "Tap the phone to try the flow yourself" : "Playing the flow. Tap the phone to try it yourself"}</span>
        ) : (
          <button type="button" className={s.replay} onClick={() => { setDemo(true); }}>Replay the demo</button>
        )}
        {!demo && <button type="button" className={s.replay} onClick={reset}>Start over</button>}
      </div>
    </div>
  );
}
