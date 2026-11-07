"use client";

import { useLayoutEffect, useRef, useState } from "react";
import s from "./WeekCalendar.module.css";
import { Icon } from "./icons";
import { WebShell } from "./WebShell";
import { tap } from "./util";

type Ev = { id: string; title: string; who: string; day: number; start: number; len: number; tone: "blue" | "green" | "amber" | "rose" };
const START = 8 * 60, END = 18 * 60, SNAP = 15, HOUR = 44; // minutes, and pixels per hour
const days = ["Mon 3", "Tue 4", "Wed 5", "Thu 6", "Fri 7"];
const seed: Ev[] = [
  { id: "a", title: "Design review", who: "Oshoke, Nkem", day: 0, start: 9 * 60 + 30, len: 60, tone: "blue" },
  { id: "b", title: "Lunch with Oshoke", who: "Kora Coffee", day: 1, start: 12 * 60 + 30, len: 75, tone: "amber" },
  { id: "c", title: "Payroll run", who: "Finance", day: 2, start: 10 * 60, len: 45, tone: "green" },
  { id: "d", title: "Client call", who: "Garki Grill", day: 0, start: 14 * 60, len: 45, tone: "rose" },
  { id: "e", title: "Sprint planning", who: "Product team", day: 3, start: 9 * 60, len: 90, tone: "blue" },
  { id: "f", title: "Invoice follow-ups", who: "Oshoke", day: 4, start: 15 * 60, len: 60, tone: "green" },
];
const fmt = (m: number) => { const h = Math.floor(m / 60), mm = m % 60; return `${h > 12 ? h - 12 : h}:${String(mm).padStart(2, "0")}${h >= 12 ? "pm" : "am"}`; };
const snap = (m: number) => Math.round(m / SNAP) * SNAP;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export default function WeekCalendar() {
  const [events, setEvents] = useState(seed);
  const [drag, setDrag] = useState<{ id: string; mode: "move" | "size" } | null>(null);
  const [said, setSaid] = useState("");
  const [count, setCount] = useState(5);
  const grid = useRef<HTMLDivElement>(null);
  const origin = useRef({ x: 0, y: 0, start: 0, len: 0, day: 0 });

  // On a narrow screen the week shows three days, so each column stays wide enough to read.
  useLayoutEffect(() => {
    const el = grid.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setCount(el.clientWidth < 330 ? 3 : 5));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const update = (id: string, patch: Partial<Ev>) => setEvents((es) => es.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  const describe = (e: Ev) => `${e.title}, ${days[e.day]}, ${fmt(e.start)} to ${fmt(e.start + e.len)}`;

  const down = (e: React.PointerEvent, ev: Ev, mode: "move" | "size") => {
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    origin.current = { x: e.clientX, y: e.clientY, start: ev.start, len: ev.len, day: ev.day };
    setDrag({ id: ev.id, mode });
    tap(6);
  };
  const move = (e: React.PointerEvent, ev: Ev) => {
    if (!drag || drag.id !== ev.id || !grid.current) return;
    const o = origin.current;
    const dMin = ((e.clientY - o.y) / HOUR) * 60;
    if (drag.mode === "size") {
      const len = clamp(snap(o.len + dMin), SNAP * 2, END - ev.start);
      if (len !== ev.len) { update(ev.id, { len }); tap(3); }
    } else {
      const colW = grid.current.clientWidth / count;
      const day = clamp(o.day + Math.round((e.clientX - o.x) / colW), 0, count - 1);
      const start = clamp(snap(o.start + dMin), START, END - ev.len);
      if (start !== ev.start || day !== ev.day) { update(ev.id, { start, day }); tap(3); }
    }
  };
  const up = (ev: Ev) => { if (drag) { setSaid(`Moved: ${describe(ev)}`); setDrag(null); } };

  const key = (e: React.KeyboardEvent, ev: Ev) => {
    const k = e.key;
    let patch: Partial<Ev> | null = null;
    if (e.shiftKey && k === "ArrowDown") patch = { len: clamp(ev.len + SNAP, SNAP * 2, END - ev.start) };
    else if (e.shiftKey && k === "ArrowUp") patch = { len: clamp(ev.len - SNAP, SNAP * 2, END - ev.start) };
    else if (k === "ArrowDown") patch = { start: clamp(ev.start + SNAP, START, END - ev.len) };
    else if (k === "ArrowUp") patch = { start: clamp(ev.start - SNAP, START, END - ev.len) };
    else if (k === "ArrowRight") patch = { day: clamp(ev.day + 1, 0, count - 1) };
    else if (k === "ArrowLeft") patch = { day: clamp(ev.day - 1, 0, count - 1) };
    if (!patch) return;
    e.preventDefault();
    const next = { ...ev, ...patch };
    update(ev.id, patch);
    setSaid(describe(next));
  };

  const hours = Array.from({ length: (END - START) / 60 }, (_, i) => START / 60 + i);

  return (
    <WebShell
      dark
      active="Schedule"
      title="November 2026"
      actions={<>
        <span className={s.navBtns} aria-hidden="true"><span><Icon name="back" size={14} stroke={2} /></span><span><Icon name="chevron" size={14} stroke={2} /></span></span>
        <span className={s.today} aria-hidden="true">Today</span>
      </>}
    >
      <div className={s.body}>
        <p className={s.hint}>Drag an event to move it, or pull its bottom edge to make it longer. With the keyboard: arrows move it, Shift and arrows change its length.</p>
        <div className={s.cal} style={{ ["--days" as string]: count }}>
          <div className={s.head} aria-hidden="true">
            <span />
            {days.slice(0, count).map((d, i) => <span key={d} className={i === 1 ? s.isToday : undefined}>{d.split(" ")[0]} <b>{d.split(" ")[1]}</b></span>)}
          </div>
          <div className={s.scroll}>
            <div className={s.gutter} aria-hidden="true">{hours.map((h) => <span key={h} style={{ height: HOUR }}>{h > 12 ? h - 12 : h} {h >= 12 ? "pm" : "am"}</span>)}</div>
            <div ref={grid} className={s.grid} style={{ height: hours.length * HOUR }} role="list" aria-label="Events this week">
              {Array.from({ length: count }, (_, i) => <span key={i} className={s.col} style={{ left: `${(i / count) * 100}%`, width: `${100 / count}%` }} aria-hidden="true" />)}
              {hours.map((h, i) => <span key={h} className={s.row} style={{ top: i * HOUR }} aria-hidden="true" />)}
              <span className={s.now} style={{ top: ((11 * 60 + 20 - START) / 60) * HOUR, left: `${(1 / count) * 100}%`, width: `${100 / count}%` }} aria-hidden="true"><i /></span>
              {events.filter((ev) => ev.day < count).map((ev) => (
                <div
                  key={ev.id}
                  role="listitem"
                  tabIndex={0}
                  aria-label={`${describe(ev)}. ${ev.who}`}
                  className={`${s.ev} ${s[ev.tone]} ${ev.len < 60 ? s.short : ""}`}
                  data-drag={drag?.id === ev.id}
                  style={{ top: ((ev.start - START) / 60) * HOUR + 1, height: (ev.len / 60) * HOUR - 2, left: `calc(${(ev.day / count) * 100}% + 3px)`, width: `calc(${100 / count}% - 6px)` }}
                  onPointerDown={(e) => down(e, ev, "move")}
                  onPointerMove={(e) => move(e, ev)}
                  onPointerUp={() => up(ev)}
                  onPointerCancel={() => up(ev)}
                  onKeyDown={(e) => key(e, ev)}
                >
                  <b>{ev.title}</b>
                  <span className="tnum">{fmt(ev.start)} – {fmt(ev.start + ev.len)}</span>
                  {ev.len >= 60 && <span>{ev.who}</span>}
                  <i className={s.handle} onPointerDown={(e) => down(e, ev, "size")} onPointerMove={(e) => move(e, ev)} onPointerUp={() => up(ev)} aria-hidden="true" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="sr-only" aria-live="polite">{said}</p>
      </div>
    </WebShell>
  );
}
