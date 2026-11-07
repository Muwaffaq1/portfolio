"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import s from "./CardToDetail.module.css";
import { Icon } from "./icons";
import { tap, useStill } from "./util";

type Stay = { id: string; name: string; place: string; price: string; nights: string; about: string; sky: [string, string]; land: [string, string]; sun: string };
const stays: Stay[] = [
  { id: "a", name: "Lake House", place: "Jabi, Abuja", price: "₦68,000", nights: "per night", about: "Two rooms over the water, with a deck that catches the evening light. Boats leave from the jetty at the end of the garden.", sky: ["#2a3b5c", "#e88a5a"], land: ["#2e4a3c", "#16261d"], sun: "#ffcf8a" },
  { id: "b", name: "Dune Cabin", place: "Kano", price: "₦42,000", nights: "per night", about: "A clay cabin at the edge of the city, cool inside all afternoon. Breakfast is brought to the door at seven.", sky: ["#4b2d1c", "#f0b26b"], land: ["#a8622f", "#5a2f15"], sun: "#ffe2a8" },
  { id: "c", name: "Hill Retreat", place: "Obudu", price: "₦95,000", nights: "per night", about: "High on the plateau, where mornings start in the clouds. A path from the porch leads to the canopy walk.", sky: ["#1d2a3a", "#7fa6c9"], land: ["#2f5a46", "#132a20"], sun: "#e9f2ff" },
  { id: "d", name: "Beach Hut", place: "Lekki, Lagos", price: "₦77,000", nights: "per night", about: "A wooden hut a short walk from the sand, with a hammock, an outdoor shower and the sound of the sea at night.", sky: ["#1b2f4a", "#f39a74"], land: ["#2d6f8f", "#123649"], sun: "#ffd7a3" },
];

function Art({ st }: { st: Stay }) {
  return (
    <svg viewBox="0 0 160 110" preserveAspectRatio="xMidYMid slice" className={s.art} aria-hidden="true">
      <defs>
        <linearGradient id={`sky-${st.id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={st.sky[0]} /><stop offset="1" stopColor={st.sky[1]} /></linearGradient>
        <linearGradient id={`land-${st.id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={st.land[0]} /><stop offset="1" stopColor={st.land[1]} /></linearGradient>
      </defs>
      <rect width="160" height="110" fill={`url(#sky-${st.id})`} />
      <circle cx="112" cy="58" r="16" fill={st.sun} opacity=".9" />
      <path d="M0 74 Q30 58 60 70 T120 64 T160 70 V110 H0z" fill={`url(#land-${st.id})`} opacity=".75" />
      <path d="M0 86 Q40 74 80 84 T160 80 V110 H0z" fill={`url(#land-${st.id})`} />
      <rect x="34" y="70" width="22" height="14" fill="#1a120c" opacity=".7" /><path d="M31 71 L45 62 L59 71z" fill="#1a120c" opacity=".7" />
    </svg>
  );
}

export default function CardToDetail() {
  const [open, setOpen] = useState<Stay | null>(null);
  const still = useStill();
  const closeBtn = useRef<HTMLButtonElement>(null);
  const lastCard = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    closeBtn.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(null); };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open]);
  useEffect(() => { if (!open) lastCard.current?.focus({ preventScroll: true }); }, [open]);

  return (
    // One spring for every shared element, so the image, title and price travel together.
    <MotionConfig transition={still ? { duration: 0 } : { type: "spring", bounce: 0.15, duration: 0.5 }}>
      <div className={s.wrap}>
        <header className={s.head}><b>Places to stay</b><span>4 stays this weekend</span></header>
        <ul className={s.grid}>
          {stays.map((st) => (
            <li key={st.id}>
              <motion.button
                type="button"
                layoutId={`card-${st.id}`}
                className={s.card}
                style={{ borderRadius: 16 }}
                onClick={(e) => { lastCard.current = e.currentTarget; setOpen(st); tap(8); }}
                aria-label={`${st.name}, ${st.place}, ${st.price} ${st.nights}. Open`}
              >
                <motion.span layoutId={`img-${st.id}`} className={s.imgWrap} style={{ borderRadius: 12 }}><Art st={st} /></motion.span>
                <span className={s.meta}>
                  <motion.b layoutId={`name-${st.id}`} className={s.name}>{st.name}</motion.b>
                  <motion.span layoutId={`place-${st.id}`} className={s.place}>{st.place}</motion.span>
                  <motion.span layoutId={`price-${st.id}`} className={s.price}><b>{st.price}</b> {st.nights}</motion.span>
                </span>
              </motion.button>
            </li>
          ))}
        </ul>

        <AnimatePresence>
          {open && (
            <>
              <motion.div key="dim" className={s.dim} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: still ? 0 : 0.2 }} onClick={() => setOpen(null)} aria-hidden="true" />
              <motion.div key="detail" layoutId={`card-${open.id}`} className={s.detail} style={{ borderRadius: 20 }} role="dialog" aria-modal="true" aria-label={open.name}>
                <motion.span layoutId={`img-${open.id}`} className={s.hero} style={{ borderRadius: 14 }}><Art st={open} /></motion.span>
                <div className={s.detailBody}>
                  <div className={s.detailTop}>
                    <div>
                      <motion.b layoutId={`name-${open.id}`} className={s.dName}>{open.name}</motion.b>
                      <motion.span layoutId={`place-${open.id}`} className={s.place}><Icon name="pin" size={13} /> {open.place}</motion.span>
                    </div>
                    <motion.span layoutId={`price-${open.id}`} className={s.price}><b>{open.price}</b> {open.nights}</motion.span>
                  </div>
                  {/* The text that only exists in the detail fades in after the move, and out first */}
                  <motion.p className={s.about} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0, transition: { delay: still ? 0 : 0.15, duration: 0.25 } }} exit={{ opacity: 0, transition: { duration: 0.08 } }}>{open.about}</motion.p>
                  <motion.div className={s.cta} initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: still ? 0 : 0.2 } }} exit={{ opacity: 0, transition: { duration: 0.08 } }}>
                    <span><Icon name="star" size={14} stroke={2.2} /> 4.9 · 128 reviews</span>
                    <button type="button" className={s.book} onClick={() => setOpen(null)}>Reserve</button>
                  </motion.div>
                </div>
                <motion.button ref={closeBtn} type="button" className={s.close} onClick={() => setOpen(null)} aria-label="Close" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, transition: { duration: 0.06 } }}>
                  <Icon name="close" size={16} stroke={2.2} />
                </motion.button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
