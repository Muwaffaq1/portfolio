"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import s from "./CardToDetail.module.css";
import { Icon } from "./icons";
import { tap, useStill } from "./util";

type Stay = { id: string; name: string; place: string; price: string; nights: string; about: string; photo: string; alt: string };
// Photos from Unsplash (Unsplash License): Cosmin Gurau, Rémi Jacquaint, Filip Zrnzević, Zoltan Tasi.
const stays: Stay[] = [
  { id: "a", name: "Mill House", place: "Lakeside", price: "₦68,000", nights: "per night", photo: "/playground/stays/lake.jpg", alt: "A wooden house and an old mill on a still lake at sunset", about: "Two rooms over the water, with a deck that catches the evening light. A rowing boat waits at the end of the garden." },
  { id: "b", name: "Dune House", place: "Desert edge", price: "₦42,000", nights: "per night", photo: "/playground/stays/desert.jpg", alt: "A small stone house alone on pale sand under a clear sky", about: "A stone house where the sand begins, cool inside all afternoon. Breakfast is brought to the door at seven." },
  { id: "c", name: "Hill Cabin", place: "Highlands", price: "₦95,000", nights: "per night", photo: "/playground/stays/hill.jpg", alt: "A wooden cabin on a green hillside, with forest and low cloud behind it", about: "High on the hill, where mornings start in the clouds. A path from the porch runs down through the forest." },
  { id: "d", name: "Beach Hut", place: "On the coast", price: "₦77,000", nights: "per night", photo: "/playground/stays/beach.jpg", alt: "A teal wooden beach hut beside a fishing boat under a stormy sky", about: "A wooden hut a few steps from the shore, with an outdoor shower and the sound of the sea at night." },
];

function Photo({ st, alt }: { st: Stay; alt?: boolean }) {
  // `layout` lets Motion correct the photo's scale while its frame changes shape, so it never stretches mid-flight.
  return <motion.img layout src={st.photo} alt={alt ? st.alt : ""} width={1200} height={750} className={s.art} draggable={false} />;
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
                <motion.span layoutId={`img-${st.id}`} className={s.imgWrap} style={{ borderRadius: 12 }}><Photo st={st} /></motion.span>
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
                <motion.span layoutId={`img-${open.id}`} className={s.hero} style={{ borderRadius: 14 }}><Photo st={open} alt /></motion.span>
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
