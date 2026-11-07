"use client";

import { useRef, useState } from "react";
import s from "./WireframeFinal.module.css";

function EventCard({ wire }: { wire?: boolean }) {
  return (
    <div className={`${s.card} ${wire ? s.wire : s.final}`} aria-hidden="true">
      <div className={s.cover}>{wire ? <span className={s.x} /> : <span className={s.sun} />}<span className={s.date}><b>14</b>DEC</span></div>
      <div className={s.body}>
        <span className={s.tag}>{wire ? "tag" : "Live music"}</span>
        <h3 className={s.title}>{wire ? "Event title goes here" : "Sunset Sessions at the Lake"}</h3>
        <p className={s.meta}>{wire ? "Location · time" : "Jabi Lake · 5:30pm"}</p>
        <div className={s.foot}>
          <span className={s.faces}><i /><i /><i /></span>
          <span className={s.going}>{wire ? "000 going" : "214 going"}</span>
          <span className={s.cta}>{wire ? "Button" : "Get tickets"}</span>
        </div>
      </div>
    </div>
  );
}

export default function WireframeFinal() {
  const [pos, setPos] = useState(50);
  const box = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const fromPointer = (x: number) => {
    const b = box.current?.getBoundingClientRect();
    if (b) setPos(Math.min(100, Math.max(0, ((x - b.left) / b.width) * 100)));
  };

  return (
    <div className={s.wrap}>
      <div
        className={s.compare}
        ref={box}
        onPointerDown={(e) => { dragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); fromPointer(e.clientX); }}
        onPointerMove={(e) => { if (dragging.current) fromPointer(e.clientX); }}
        onPointerUp={() => { dragging.current = false; }}
      >
        <EventCard wire />
        <div className={s.top} style={{ clipPath: `inset(0 0 0 ${pos}%)` }}><EventCard /></div>
        <div
          className={s.handle}
          style={{ left: `${pos}%` }}
          role="slider"
          tabIndex={0}
          aria-label="Compare wireframe and final design"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          aria-valuetext={`${Math.round(100 - pos)}% final design showing`}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 5));
            if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 5));
          }}
        >
          <span aria-hidden="true">‹ ›</span>
        </div>
      </div>
      <div className={s.labels} aria-hidden="true"><span>Wireframe</span><span>Final</span></div>
    </div>
  );
}
