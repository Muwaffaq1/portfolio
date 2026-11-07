"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import s from "./CommandPalette.module.css";

type Cmd = { id: string; group: string; label: string; hint?: string; keys?: string[] };

const commands: Cmd[] = [
  { id: "dash", group: "Go to", label: "Dashboard", keys: ["G", "D"] },
  { id: "inv", group: "Go to", label: "Invoices", keys: ["G", "I"] },
  { id: "cus", group: "Go to", label: "Customers", keys: ["G", "C"] },
  { id: "new", group: "Actions", label: "New invoice", hint: "Start a blank invoice", keys: ["N"] },
  { id: "theme", group: "Actions", label: "Switch light or dark", hint: "Changes this demo only", keys: ["T"] },
  { id: "copy", group: "Actions", label: "Copy link to this page", keys: ["⌘", "L"] },
  { id: "help", group: "Help", label: "Keyboard shortcuts", keys: ["?"] },
];

// Letters in order, not necessarily together: "nwin" finds "New invoice".
const fuzzy = (q: string, t: string) => {
  let i = 0;
  for (const ch of t.toLowerCase()) if (ch === q[i]) i++;
  return i === q.length;
};

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const [dark, setDark] = useState(false);
  const [ran, setRan] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const listId = useId();

  const results = useMemo(() => commands.filter((c) => fuzzy(q.toLowerCase().replace(/\s/g, ""), c.label)), [q]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen((o) => !o); }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => { if (open) { setQ(""); setActive(0); input.current?.focus(); } }, [open]);

  const close = () => { setOpen(false); opener.current?.focus(); };
  const run = (c: Cmd) => {
    if (c.id === "theme") setDark((d) => !d);
    setRan(c.label);
    close();
  };

  let lastGroup = "";

  return (
    <div className={s.app} data-dark={dark}>
      <aside className={s.side} aria-hidden="true"><b>Ledger</b><span>Dashboard</span><span>Invoices</span><span>Customers</span></aside>
      <div className={s.main}>
        <button type="button" ref={opener} className={s.trigger} onClick={() => setOpen(true)}>
          <span>Search or run a command</span><kbd>⌘K</kbd>
        </button>
        <h2 className={s.h}>Good morning, Amina</h2>
        <div className={s.kpis} aria-hidden="true"><span><b>₦4.2m</b>Unpaid</span><span><b>18</b>Invoices due</span><span><b>96%</b>On time</span></div>
        <p className={s.ran} role="status">{ran ? <>Ran “{ran}”</> : "Press ⌘K or Ctrl+K"}</p>
      </div>

      {open && (
        <div className={s.overlay} onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
          <div className={s.palette} role="dialog" aria-modal="true" aria-label="Command palette">
            <input
              ref={input}
              className={s.input}
              value={q}
              placeholder="Type a command or search"
              onChange={(e) => { setQ(e.target.value); setActive(0); }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
                if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
                if (e.key === "Enter" && results[active]) run(results[active]);
                if (e.key === "Escape") close();
              }}
              role="combobox"
              aria-expanded="true"
              aria-controls={listId}
              aria-activedescendant={results[active] ? `${listId}-${results[active].id}` : undefined}
              aria-label="Command"
            />
            <ul className={s.list} id={listId} role="listbox" aria-label="Commands">
              {results.length === 0 && <li className={s.empty}>No commands match “{q}”</li>}
              {results.map((c, i) => {
                const header = c.group !== lastGroup ? c.group : null;
                lastGroup = c.group;
                return (
                  <li key={c.id} role="presentation">
                    {header && <span className={s.group} aria-hidden="true">{header}</span>}
                    <div
                      id={`${listId}-${c.id}`}
                      role="option"
                      aria-selected={i === active}
                      className={s.item}
                      onMouseMove={() => setActive(i)}
                      onClick={() => run(c)}
                    >
                      <span><b>{c.label}</b>{c.hint && <span className={s.hint}>{c.hint}</span>}</span>
                      {c.keys && <span className={s.keys} aria-hidden="true">{c.keys.map((k) => <kbd key={k}>{k}</kbd>)}</span>}
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className={s.foot} aria-hidden="true"><span><kbd>↑</kbd><kbd>↓</kbd> to move</span><span><kbd>↵</kbd> to run</span><span><kbd>esc</kbd> to close</span></div>
          </div>
        </div>
      )}
    </div>
  );
}
