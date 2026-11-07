"use client";

import { Reorder, useDragControls } from "motion/react";
import { useState } from "react";
import s from "./ReorderList.module.css";
import { tap, useStill } from "./util";

type Item = { id: string; title: string; time: string; tone: string };

const initial: Item[] = [
  { id: "gym", title: "Gym, upper body", time: "6:30", tone: "#ff8a3d" },
  { id: "standup", title: "Team standup", time: "9:00", tone: "#3e63dd" },
  { id: "review", title: "Design review", time: "11:00", tone: "#0f6e56" },
  { id: "lunch", title: "Lunch with Tolu", time: "13:00", tone: "#e5484d" },
  { id: "ship", title: "Ship the release", time: "16:00", tone: "#c28a00" },
];

function Row({ item, index, move, count, still }: { item: Item; index: number; move: (from: number, to: number) => void; count: number; still: boolean }) {
  const controls = useDragControls();
  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={controls}
      className={s.row}
      whileDrag={still ? undefined : { scale: 1.03, boxShadow: "0 18px 30px -12px rgba(0,0,0,.35)" }}
      transition={still ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 40 }}
      onDragStart={() => tap(8)}
    >
      <span className={s.bar} style={{ background: item.tone }} aria-hidden="true" />
      <span className={s.text}><b>{item.title}</b><span className="tnum">{item.time}</span></span>
      <button
        type="button"
        className={s.handle}
        onPointerDown={(e) => controls.start(e)}
        onKeyDown={(e) => {
          if (e.key === "ArrowUp" && index > 0) { e.preventDefault(); move(index, index - 1); }
          if (e.key === "ArrowDown" && index < count - 1) { e.preventDefault(); move(index, index + 1); }
        }}
        aria-label={`Move ${item.title}, position ${index + 1} of ${count}. Use the up and down arrows`}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
      </button>
    </Reorder.Item>
  );
}

export default function ReorderList() {
  const [items, setItems] = useState(initial);
  const [announce, setAnnounce] = useState("");
  const still = useStill();

  const move = (from: number, to: number) => {
    const next = [...items];
    const [it] = next.splice(from, 1);
    next.splice(to, 0, it);
    setItems(next);
    setAnnounce(`${it.title} moved to position ${to + 1}`);
    // Keep focus on the handle that moved.
    requestAnimationFrame(() => (document.querySelectorAll(`.${s.handle}`)[to] as HTMLElement | undefined)?.focus());
  };

  return (
    <div className={s.screen}>
      <header className={s.head}><p>Saturday</p><h2>Today&apos;s plan</h2></header>
      <Reorder.Group axis="y" values={items} onReorder={setItems} className={s.list}>
        {items.map((it, i) => <Row key={it.id} item={it} index={i} move={move} count={items.length} still={still} />)}
      </Reorder.Group>
      <p className={s.hint}>Drag a row by its handle.</p>
      <p className="sr-only" aria-live="polite">{announce}</p>
    </div>
  );
}
