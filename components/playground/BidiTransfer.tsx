"use client";

import { useState } from "react";

// One transfer screen in English and Arabic, side by side. Pick a rule to highlight what it changes in both.
// The layout uses logical CSS (inline-start/end), so the same markup mirrors with dir="rtl".
type Lang = "en" | "ar";

const copy = {
  en: { title: "Review transfer", step: "Step 2 of 3", to: "To", name: "Oshoke", bank: "Emirates NBD", amount: "Amount", fee: "Fee", free: "Free", arrives: "Arrives", instantly: "Instantly", ref: "Reference", refValue: "Rent · November", date: "Date", today: "Today,", button: "Send", currency: "AED" },
  ar: { title: "مراجعة التحويل", step: "الخطوة 2 من 3", to: "إلى", name: "أوشوكي", bank: "بنك الإمارات دبي الوطني", amount: "المبلغ", fee: "الرسوم", free: "مجانًا", arrives: "الوصول", instantly: "فورًا", ref: "المرجع", refValue: "الإيجار · نوفمبر", date: "التاريخ", today: "اليوم،", button: "إرسال", currency: "درهم" },
};

const rules = [
  { id: 1, title: "The layout mirrors", line: "Start and end swap. It's built with logical CSS (inline-start, inline-end), so one layout serves both." },
  { id: 2, title: "Directional icons flip", line: "The back arrow and the row chevron point the other way, because they mean \"go back\" and \"go forward\"." },
  { id: 3, title: "Meaningful icons don't", line: "The clock and the tick mean the same in any direction, so they stay as they are." },
  { id: 4, title: "Numbers stay left to right", line: "Amounts, the IBAN and the time are isolated as left-to-right inside Arabic text, so they never scramble." },
  { id: 5, title: "Progress fills from the start", line: "Step 2 of 3 fills from the right in Arabic, the direction people read." },
  { id: 6, title: "Arabic type needs room", line: "A typeface made for Arabic, a taller line height, and no letter-spacing or capitals, which break joined letters." },
];

function Screen({ lang, hl }: { lang: Lang; hl: number | null }) {
  const t = copy[lang];
  const h = (r: number) => (hl === r ? " hl" : "");
  const iban = "AE07 •••• 3456";
  return (
    <div className={`bd-phone bd-${lang}`} dir={lang === "ar" ? "rtl" : "ltr"} lang={lang}>
      <div className={"bd-bar" + h(1)}>
        <span className={"bd-icon flip" + h(2)} aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
        <b className={"bd-title" + h(6)}>{t.title}</b>
        <span className="bd-icon" aria-hidden="true" />
      </div>
      <div className={"bd-progress" + h(5)} role="progressbar" aria-valuemin={1} aria-valuemax={3} aria-valuenow={2} aria-valuetext={t.step} aria-label={t.title}><i /><i /><i className="off" /></div>
      <span className="bd-step">{t.step}</span>

      <div className={"bd-to" + h(1)}>
        <span className="bd-avatar" aria-hidden="true">{lang === "ar" ? "أ" : "O"}</span>
        <span className="bd-to-text">
          <span className="bd-k">{t.to}</span>
          <b>{t.name}</b>
          <span className="bd-sub">{t.bank} · <bdi dir="ltr" className={"bd-num" + h(4)}>{iban}</bdi></span>
        </span>
        <span className={"bd-icon flip" + h(2)} aria-hidden="true">
          <svg viewBox="0 0 24 24" width="16" height="16"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
      </div>

      <div className="bd-amount">
        <span className="bd-k">{t.amount}</span>
        {lang === "ar" ? (
          <b><bdi dir="ltr" className={"bd-num" + h(4)}>250.00</bdi> {t.currency}</b>
        ) : (
          <b>{t.currency} <bdi dir="ltr" className={"bd-num" + h(4)}>250.00</bdi></b>
        )}
      </div>

      <dl className="bd-rows">
        <div className={h(1).trim()}><dt>{t.fee}</dt><dd>{t.free}</dd></div>
        <div><dt>{t.arrives}</dt><dd>
          <span className={"bd-icon" + h(3)} aria-hidden="true"><svg viewBox="0 0 24 24" width="14" height="14"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M12 7.5V12l3 2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></span>
          {t.instantly}
        </dd></div>
        <div><dt>{t.ref}</dt><dd>{t.refValue}</dd></div>
        <div><dt>{t.date}</dt><dd>{t.today} <bdi dir="ltr" className={"bd-num" + h(4)}>9:41</bdi></dd></div>
      </dl>

      <span className={"bd-btn" + h(6)} aria-hidden="true">
        <span className={"bd-icon" + h(3)}><svg viewBox="0 0 24 24" width="16" height="16"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
        {t.button} {lang === "ar" ? <><bdi dir="ltr" className={"bd-num" + h(4)}>250</bdi> {t.currency}</> : <>{t.currency} <bdi dir="ltr" className={"bd-num" + h(4)}>250</bdi></>}
      </span>
    </div>
  );
}

export function BidiTransfer() {
  const [hl, setHl] = useState<number | null>(1);
  return (
    <div className="bd">
      <div className="pg-stage bd-stage">
        <Screen lang="en" hl={hl} />
        <Screen lang="ar" hl={hl} />
      </div>
      <div className="bd-rules" role="group" aria-label="What changes in Arabic">
        {rules.map((r) => (
          <button key={r.id} type="button" aria-pressed={hl === r.id} onClick={() => setHl(hl === r.id ? null : r.id)} className="bd-rule">
            <span className="bd-n">{r.id}</span>
            <span><b>{r.title}</b><span>{r.line}</span></span>
          </button>
        ))}
      </div>
    </div>
  );
}
