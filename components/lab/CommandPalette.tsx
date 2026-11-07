"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import s from "./CommandPalette.module.css";
import { Icon, type IconName } from "./icons";
import { useStill } from "./util";

type Cmd = { id: string; group: string; label: string; icon: IconName; keys?: string[] };
const commands: Cmd[] = [
  { id: "inv", group: "Go to", label: "Invoices", icon: "doc", keys: ["G", "I"] },
  { id: "cus", group: "Go to", label: "Customers", icon: "users", keys: ["G", "C"] },
  { id: "pay", group: "Go to", label: "Payouts", icon: "arrowDown", keys: ["G", "P"] },
  { id: "new", group: "Actions", label: "New invoice", icon: "plus", keys: ["N"] },
  { id: "remind", group: "Actions", label: "Send reminders for overdue invoices", icon: "bell", keys: ["R"] },
  { id: "export", group: "Actions", label: "Export this month as CSV", icon: "download", keys: ["⌘", "E"] },
];
const examples = ["overdue invoices from Nkem over ₦50,000 last month", "paid invoices this week", "invoices from Oshoke under ₦20,000"];

type Chip = { field: string; op: string; value: string };
// A tiny, honest parser: turns plain words into the filters a search would actually run.
function parse(q: string): Chip[] {
  const t = q.toLowerCase(), out: Chip[] = [];
  const status = t.match(/\b(overdue|paid|draft|unpaid)\b/);
  if (status) out.push({ field: "Status", op: "is", value: status[1][0].toUpperCase() + status[1].slice(1) });
  const from = q.match(/from\s+([A-Z][\w-]+)/);
  if (from) out.push({ field: "Customer", op: "is", value: from[1] });
  const amt = t.match(/\b(over|above|under|below)\s*₦?\s*([\d,]+k?)/);
  if (amt) out.push({ field: "Amount", op: /over|above/.test(amt[1]) ? "is above" : "is below", value: "₦" + amt[2].toUpperCase() });
  const date = t.match(/\b(last month|this month|this week|last week|today)\b/);
  if (date) out.push({ field: "Date", op: "is", value: date[1][0].toUpperCase() + date[1].slice(1) });
  return out;
}
const fuzzy = (q: string, t: string) => { let i = 0; for (const ch of t.toLowerCase()) if (ch === q[i]) i++; return i === q.length; };

export default function CommandPalette() {
  const [open, setOpen] = useState(true);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const [ran, setRan] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const listId = useId();
  const still = useStill();

  const chips = useMemo(() => parse(q), [q]);
  const results = useMemo(() => (chips.length ? [] : commands.filter((c) => fuzzy(q.toLowerCase().replace(/\s/g, ""), c.label))), [q, chips.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen((o) => !o); } };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => { if (open) { setActive(0); input.current?.focus({ preventScroll: true }); } }, [open]);

  const close = () => { setOpen(false); opener.current?.focus(); };
  const run = (label: string) => { setRan(label); setQ(""); close(); };

  return (
    <div className={s.app}>
      <div className={s.page} aria-hidden={open}>
        <header className={s.bar}><b><span className={s.logo} />Ledger</b><button type="button" ref={opener} className={s.trigger} onClick={() => setOpen(true)}><Icon name="search" size={14} /><span>Search or ask</span><kbd>⌘K</kbd></button></header>
        <h3 className={s.pageTitle}>Invoices</h3>
        <div className={s.rows}>{["INV-0042 · Nkem Foods", "INV-0041 · Oshoke Studio", "INV-0040 · Garki Grill"].map((r, i) => <div key={r}><span className={s.dot} style={{ background: ["#f08a24", "#22a35a", "#3b82f6"][i] }} />{r}<em>{["Overdue", "Paid", "Sent"][i]}</em></div>)}</div>
        <p className={s.ran} role="status">{ran ? <>Ran “{ran}”</> : "Press ⌘K or Ctrl+K"}</p>
      </div>

      {open && (
        <div className={s.overlay} onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
          <div className={s.palette} role="dialog" aria-modal="true" aria-label="Search">
            <div className={s.inputRow}>
              <Icon name="search" size={17} />
              <input
                ref={input}
                className={s.input}
                value={q}
                placeholder="Search, or describe what you need"
                onChange={(e) => { setQ(e.target.value); setActive(0); }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, Math.max(results.length - 1, 0))); }
                  if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
                  if (e.key === "Enter") { if (chips.length) run(q); else if (results[active]) run(results[active].label); }
                  if (e.key === "Escape") close();
                }}
                role="combobox"
                aria-expanded="true"
                aria-controls={listId}
                aria-activedescendant={!chips.length && results[active] ? `${listId}-${results[active].id}` : undefined}
                aria-label="Search"
              />
            </div>

            {chips.length > 0 ? (
              <div className={s.section}>
                <span className={s.label}>Generated search</span>
                <div className={s.chips} aria-live="polite">
                  <AnimatePresence initial={false}>
                    {chips.map((c, i) => (
                      <motion.span key={c.field} className={s.chipWrap} initial={still ? false : { opacity: 0, y: 4, filter: "blur(3px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0 }} transition={{ duration: 0.22, delay: still ? 0 : i * 0.05 }}>
                        {i > 0 && <span className={s.and}>AND</span>}
                        <span className={s.chip}><i className={s.cdot} />{c.field}</span><span className={s.op}>{c.op}</span><span className={s.chip}>{c.value}</span>
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>
                <button type="button" className={s.runBtn} onClick={() => run(q)}>Show {chips.length === 4 ? 3 : 12} invoices <kbd>↵</kbd></button>
              </div>
            ) : (
              <ul className={s.list} id={listId} role="listbox" aria-label="Commands">
                {results.length === 0 && <li className={s.empty}>Nothing matches “{q}”</li>}
                {results.map((c, i) => (
                  <li key={c.id} role="presentation">
                    {(i === 0 || results[i - 1].group !== c.group) && <span className={s.label} aria-hidden="true">{c.group}</span>}
                    <div id={`${listId}-${c.id}`} role="option" aria-selected={i === active} className={s.item} onMouseMove={() => setActive(i)} onClick={() => run(c.label)}>
                      <span className={s.itemText}><Icon name={c.icon} size={16} className={s.itemIcon} />{c.label}</span>
                      {c.keys && <span className={s.keys} aria-hidden="true">{c.keys.map((k) => <kbd key={k}>{k}</kbd>)}</span>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {!chips.length && !q && (
              <div className={s.tryRow}>
                <span className={s.label}>Try asking</span>
                {examples.slice(0, 2).map((ex) => <button key={ex} type="button" className={s.try} onClick={() => { setQ(ex); input.current?.focus(); }}><Icon name="sparkle" size={14} />{ex}</button>)}
              </div>
            )}
            <div className={s.foot} aria-hidden="true"><span>Navigate <kbd>↑</kbd><kbd>↓</kbd></span><span>Run <kbd>↵</kbd></span><span>Close <kbd>esc</kbd></span></div>
          </div>
        </div>
      )}
    </div>
  );
}
