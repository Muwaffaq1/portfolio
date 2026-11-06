"use client";

import { motion } from "motion/react";
import { useRef, useState } from "react";

// The QuickPay "Send money · Home" screen (Figma node 86:700), rebuilt from its
// components with the file's real Light and Dark variable values.

type Mode = "light" | "dark" | "ar";

const copy = {
  en: {
    search: "Search", wallet: "Wallet · NGN", details: "Account details", add: "Add money", send: "Send",
    bills: "Pay bills", request: "Request", seeAll: "See all", back: "2% back on data",
    rows: [["Adaeze Okafor", "2:41 PM · Transfer"], ["Tunde Bakare", "11:02 AM · Transfer"], ["Ikeja Electric", "Pending · 9:15 AM"]],
    billers: ["Airtime", "Data", "Electricity", "TV"],
    tabs: ["Home", "Payments", "Cards", "Rewards", "Account"],
  },
  ar: {
    search: "بحث", wallet: "المحفظة · NGN", details: "تفاصيل الحساب", add: "إضافة أموال", send: "إرسال",
    bills: "دفع الفواتير", request: "طلب", seeAll: "عرض الكل", back: "استرداد 2% على البيانات",
    rows: [["Adaeze Okafor", "2:41 م · تحويل"], ["Tunde Bakare", "11:02 ص · تحويل"], ["Ikeja Electric", "قيد الانتظار · 9:15 ص"]],
    billers: ["رصيد", "بيانات", "كهرباء", "تلفاز"],
    tabs: ["الرئيسية", "المدفوعات", "البطاقات", "المكافآت", "الحساب"],
  },
};

const tokens = {
  light: [["color/bg/canvas", "#f7f6f2"], ["color/bg/hero", "#d63f06"], ["color/bg/brand-subtle", "#fff4ed"], ["color/text/primary", "#2d2b28"]],
  dark: [["color/bg/canvas", "#111110"], ["color/bg/hero", "#8f2a0c"], ["color/bg/brand-subtle", "#3d1005"], ["color/text/primary", "#f7f7f5"]],
};

const Icon = ({ name, size = 24 }: { name: string; size?: number }) => (
  <span className="qi" style={{ width: size, height: size, WebkitMaskImage: `url(/qp-icons/${name}.svg)`, maskImage: `url(/qp-icons/${name}.svg)` }} aria-hidden="true" />
);

function Amount({ whole, kobo, tone }: { whole: string; kobo: string; tone?: "in" }) {
  return (
    <span className={tone === "in" ? "qh-amt in" : "qh-amt"} dir="ltr">
      {whole}<small>{kobo}</small>
    </span>
  );
}

export function ModeDemo() {
  const [mode, setMode] = useState<Mode>("light");
  const [pick, setPick] = useState<Mode>("light");
  const [fading, setFading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const ar = mode === "ar";

  // Colours already cross-fade through the variables. A direction flip would
  // jump the whole layout, so fade the screen out, flip, and fade back in.
  function choose(next: Mode) {
    setPick(next);
    clearTimeout(timer.current);
    const flips = (next === "ar") !== (mode === "ar");
    if (!flips || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMode(next);
      setFading(false);
      return;
    }
    setFading(true);
    timer.current = setTimeout(() => {
      setMode(next);
      setFading(false);
    }, 120);
  }
  const t = ar ? copy.ar : copy.en;
  const rows = tokens[mode === "dark" ? "dark" : "light"];
  const amounts: [string, string, "in" | undefined][] = [["−₦25,000", ".00", undefined], ["+₦150,000", ".00", "in"], ["−₦10,000", ".00", undefined]];

  return (
    <div className="demo">
      <div className="qh-phone">
        <div className={fading ? "qh fading" : "qh"} data-mode={mode === "dark" ? "dark" : "light"} dir={ar ? "rtl" : "ltr"} lang={ar ? "ar" : "en"}>
          <div className="qh-hero">
            <div className="qh-status" dir="ltr"><span>9:41</span><i /><i /><i className="bat" /></div>
            <div className="qh-top">
              <span className="qh-av">AO</span>
              <span className="qh-search"><Icon name="search" size={18} />{t.search}</span>
              <span className="qh-glass"><Icon name="qr" size={20} /></span>
              <img src="/qp-icons/bell-button.svg" alt="" width={40} height={40} />
            </div>
            <div className="qh-balance">
              <span>{t.wallet}</span>
              <span className="qh-big" dir="ltr">₦248,560<small>.75</small></span>
              <span className="qh-pill">{t.details}</span>
              <img src="/qp-icons/pager.svg" alt="" width={30} height={22} />
            </div>
          </div>
          <div className="qh-actions">
            {[["plus", t.add, true], ["send", t.send, true], ["receipt", t.bills, false], ["hand-coins", t.request, false]].map(([icon, label, primary]) => (
              <span key={icon as string} className="qh-act">
                <span className={primary ? "qh-circle primary" : "qh-circle"}><Icon name={icon as string} /></span>
                {label}
              </span>
            ))}
          </div>
          <div className="qh-content">
            <div className="qh-card">
              {t.rows.map(([name, sub], i) => (
                <div key={name} className="qh-row">
                  <span className={i === 2 ? "qh-av muted" : "qh-av"}>
                    {i === 2 ? <Icon name="lightning" size={20} /> : name.split(" ").map((w) => w[0]).join("")}
                    <span className="qh-badge"><Icon name={i === 1 ? "arrow-down-left" : "arrow-up-right"} size={10} /></span>
                  </span>
                  <span className="qh-text"><b>{name}</b><span className={i === 2 ? "warn" : undefined}>{sub}</span></span>
                  <Amount whole={amounts[i][0]} kobo={amounts[i][1]} tone={amounts[i][2]} />
                </div>
              ))}
              <span className="qh-see">{t.seeAll}</span>
            </div>
            <div className="qh-card qh-bills">
              <div className="qh-bills-head"><b>{t.bills}</b><span>{t.back}</span></div>
              <div className="qh-billers">
                {["airtime", "data", "electricity", "tv"].map((icon, i) => (
                  <span key={icon}><span className="qh-circle"><Icon name={icon} size={28} /></span>{t.billers[i]}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="qh-tabs">
            {["tab-home", "tab-payments", "tab-cards", "tab-rewards", "tab-account"].map((icon, i) => (
              <span key={icon} className={i === 0 ? "on" : undefined}><Icon name={icon} />{t.tabs[i]}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="demo-side">
        <p className="demo-title">QuickPay · Home</p>
        <p className="note" style={{ marginTop: -6 }}>The real Home screen from the Figma file, rebuilt in code from its components. Light and Dark swap the design tokens; Arabic also flips the layout right to left.</p>
        <div className="seg" role="group" aria-label="Mode">
          {(["light", "dark", "ar"] as Mode[]).map((m) => (
            <button key={m} type="button" aria-pressed={pick === m} onClick={() => choose(m)}>
              {pick === m && (
                <motion.span layoutId="seg-pill" className="seg-pill" transition={{ type: "tween", duration: 0.2, ease: [0.23, 1, 0.32, 1] }} />
              )}
              <span className="seg-label">{m === "light" ? "Light" : m === "dark" ? "Dark" : "عربي"}</span>
            </button>
          ))}
        </div>
        <p className="tok">
          {rows.map(([name, value]) => (
            <span key={name}><i style={{ background: value }} />{name} {value}</span>
          ))}
          <span>direction {ar ? "rtl" : "ltr"}</span>
        </p>
        <p className="note">Light and Dark values come straight from QuickPay&apos;s Figma variables. The Arabic layout is built here in code to show right-to-left support.</p>
      </div>
    </div>
  );
}
