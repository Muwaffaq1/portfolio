"use client";

import { useState } from "react";
import s from "./Aurora.module.css";

export default function Aurora() {
  const [hue, setHue] = useState(150);
  return (
    <div className={s.wrap} style={{ ["--h" as string]: hue }}>
      <div className={s.sky} aria-hidden="true"><i /><i /><i /><i /></div>
      <div className={s.copy}>
        <p className={s.k}>Northern Lights · Live</p>
        <h2 className={s.h}>Quiet things,<br />beautifully made.</h2>
      </div>
      <label className={s.control}>
        <span>Hue</span>
        <input type="range" min={0} max={360} value={hue} onChange={(e) => setHue(Number(e.target.value))} aria-label="Aurora hue" />
      </label>
    </div>
  );
}
