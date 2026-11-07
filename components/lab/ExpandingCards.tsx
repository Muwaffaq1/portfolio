"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import s from "./ExpandingCards.module.css";
import { useStill } from "./util";

const places = [
  { id: "zanzibar", name: "Zanzibar", country: "Tanzania", nights: "5 nights from ₦1.2m", art: s.artSea, about: "White sand on the east coast, spice farms inland and Stone Town's carved doors at sunset. Best from June to October." },
  { id: "marrakech", name: "Marrakech", country: "Morocco", nights: "4 nights from ₦980k", art: s.artSand, about: "Riads around quiet courtyards, the souks by day and Jemaa el-Fnaa by night. Cooler from October to April." },
  { id: "cape", name: "Cape Town", country: "South Africa", nights: "6 nights from ₦1.6m", art: s.artMountain, about: "Table Mountain at sunrise, penguins at Boulders Beach and wine country an hour away. Warmest from December to March." },
];

export default function ExpandingCards() {
  const [open, setOpen] = useState<string | null>(null);
  const still = useStill();
  const lastCard = useRef<HTMLButtonElement | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const place = places.find((p) => p.id === open);
  const t = still ? { duration: 0 } : { type: "spring" as const, bounce: 0.12, duration: 0.5 };

  useEffect(() => {
    if (!open) return;
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(null); };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => { if (!open) lastCard.current?.focus({ preventScroll: true }); }, [open]);

  return (
    <div className={s.screen}>
      <header className={s.head}><p>Where next?</p><h2>Trips for you</h2></header>
      <ul className={s.list}>
        {places.map((p) => (
          <li key={p.id}>
            <motion.button
              layoutId={`card-${p.id}`}
              transition={t}
              type="button"
              className={s.card}
              onClick={(e) => { lastCard.current = e.currentTarget; setOpen(p.id); }}
              style={{ borderRadius: 24 }}
              aria-label={`${p.name}, ${p.country}. ${p.nights}`}
            >
              <motion.span layoutId={`art-${p.id}`} transition={t} className={`${s.art} ${p.art}`} aria-hidden="true" />
              <motion.span layoutId={`text-${p.id}`} transition={t} className={s.cardText}><b>{p.name}</b><span>{p.country} · {p.nights}</span></motion.span>
            </motion.button>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {place && (
          <motion.div layoutId={`card-${place.id}`} transition={t} className={s.detail} style={{ borderRadius: 0 }} role="dialog" aria-modal="true" aria-label={place.name}>
            <motion.span layoutId={`art-${place.id}`} transition={t} className={`${s.art} ${s.artBig} ${place.art}`} aria-hidden="true" />
            <motion.div layoutId={`text-${place.id}`} transition={t} className={s.cardText}><b>{place.name}</b><span>{place.country} · {place.nights}</span></motion.div>
            <motion.p className={s.about} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, transition: { delay: still ? 0 : 0.18 } }} exit={{ opacity: 0, transition: { duration: 0.08 } }}>{place.about}</motion.p>
            <motion.span className={s.book} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, transition: { delay: still ? 0 : 0.24 } }} exit={{ opacity: 0, transition: { duration: 0.08 } }} aria-hidden="true">See dates</motion.span>
            <button ref={closeBtn} type="button" className={s.close} onClick={() => setOpen(null)} aria-label={`Close ${place.name}`}>×</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
