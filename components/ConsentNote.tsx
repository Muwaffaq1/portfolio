"use client";

import { useEffect, useState } from "react";
import { analyticsOn, getConsent, setConsent } from "@/lib/analytics";
import s from "./ConsentNote.module.css";

// A quiet note in the corner, not a popup: the page works the same whether or not it's answered.
// Visits are measured either way; a yes only lets the site remember a returning visitor.
export function ConsentNote() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!analyticsOn || getConsent()) return;
    const t = setTimeout(() => setShow(true), 2500);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;
  const answer = (yes: boolean) => { setConsent(yes); setShow(false); };

  return (
    <div className={s.note} role="region" aria-label="Analytics choice">
      <p>Can I remember your visit? It shows me which work people find useful. No ads, nothing sold.</p>
      <div className={s.actions}>
        <button type="button" className={s.yes} onClick={() => answer(true)}>Allow</button>
        <button type="button" className={s.no} onClick={() => answer(false)}>No thanks</button>
      </div>
    </div>
  );
}
