"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import s from "./DataTable.module.css";
import { Icon } from "./icons";
import { WebShell } from "./WebShell";
import { tap, useStill } from "./util";

type Status = "Paid" | "Sent" | "Overdue" | "Draft";
type Row = { id: string; customer: string; amount: number; status: Status; due: string; dueSort: number };
const seed: Row[] = [
  ["INV-0042", "Oshoke Studio", 450000, "Paid", "2 Nov", 2],
  ["INV-0041", "Nkem Foods", 128500, "Overdue", "28 Oct", -3],
  ["INV-0040", "Garki Grill", 76000, "Sent", "9 Nov", 9],
  ["INV-0039", "Wuse Dental", 312000, "Paid", "30 Oct", -1],
  ["INV-0038", "Jabi Books", 54200, "Draft", "15 Nov", 15],
  ["INV-0037", "Maitama Florals", 98000, "Overdue", "25 Oct", -6],
  ["INV-0036", "Kubwa Motors", 1240000, "Sent", "12 Nov", 12],
  ["INV-0035", "Asokoro Tailors", 67500, "Paid", "21 Oct", -10],
  ["INV-0034", "Lugbe Bakery", 23800, "Sent", "7 Nov", 7],
].map(([id, customer, amount, status, due, dueSort]) => ({ id, customer, amount, status, due, dueSort }) as Row);

type Col = "customer" | "amount" | "status" | "due";
const colNames: Record<Col, string> = { customer: "Customer", amount: "Amount", status: "Status", due: "Due" };
const statuses: Status[] = ["Paid", "Sent", "Overdue", "Draft"];
const naira = (n: number) => "₦" + n.toLocaleString("en-NG");

export default function DataTable() {
  const [rows, setRows] = useState(seed);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Status | null>(null);
  const [sort, setSort] = useState<{ col: Col; dir: 1 | -1 }>({ col: "due", dir: 1 });
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [hidden, setHidden] = useState<Set<Col>>(new Set());
  const [menu, setMenu] = useState(false);
  const [note, setNote] = useState("");
  const all = useRef<HTMLInputElement>(null);
  const still = useStill();

  const view = useMemo(() => {
    const t = q.trim().toLowerCase();
    const out = rows.filter((r) => (!filter || r.status === filter) && (!t || r.customer.toLowerCase().includes(t) || r.id.toLowerCase().includes(t)));
    const key = (r: Row) => (sort.col === "amount" ? r.amount : sort.col === "due" ? r.dueSort : r[sort.col]);
    return [...out].sort((a, b) => (key(a) > key(b) ? 1 : key(a) < key(b) ? -1 : 0) * sort.dir);
  }, [rows, q, filter, sort]);

  const visiblePicked = view.filter((r) => picked.has(r.id)).length;
  useEffect(() => { if (all.current) all.current.indeterminate = visiblePicked > 0 && visiblePicked < view.length; }, [visiblePicked, view.length]);

  const toggle = (id: string) => setPicked((p) => { const n = new Set(p); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const toggleAll = () => setPicked(visiblePicked === view.length ? new Set() : new Set(view.map((r) => r.id)));
  const sortBy = (col: Col) => setSort((st) => ({ col, dir: st.col === col ? (st.dir === 1 ? -1 : 1) : 1 }));
  const markPaid = () => { setRows((rs) => rs.map((r) => (picked.has(r.id) ? { ...r, status: "Paid" } : r))); setNote(`${picked.size} marked paid`); setPicked(new Set()); tap(10); };
  const exportRows = () => { setNote(`Exported ${picked.size} ${picked.size === 1 ? "row" : "rows"} as CSV`); setPicked(new Set()); tap(10); };
  useEffect(() => { if (!note) return; const t = setTimeout(() => setNote(""), 2400); return () => clearTimeout(t); }, [note]);

  const show = (c: Col) => !hidden.has(c);
  const th = (c: Col) => show(c) && (
    <th key={c} className={s[c]} aria-sort={sort.col === c ? (sort.dir === 1 ? "ascending" : "descending") : "none"}>
      <button type="button" onClick={() => sortBy(c)}>
        {colNames[c]}
        <Icon name="chevronDown" size={13} stroke={2.2} className={s.sortIcon} data-on={sort.col === c} data-dir={sort.dir} />
      </button>
    </th>
  );

  return (
    <WebShell
      active="Transactions"
      title="Invoices"
      actions={<span className={s.newBtn} aria-hidden="true"><Icon name="plus" size={15} stroke={2} />New invoice</span>}
    >
      <div className={s.body}>
        <div className={s.toolbar}>
          <label className={s.search}>
            <Icon name="search" size={14} />
            <span className="sr-only">Search invoices</span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" />
          </label>
          <div className={s.chips} role="group" aria-label="Filter by status">
            {statuses.map((st) => (
              <button key={st} type="button" aria-pressed={filter === st} onClick={() => setFilter(filter === st ? null : st)}>
                <i className={s[`dot${st}`]} aria-hidden="true" />{st}
                {filter === st && <Icon name="close" size={12} stroke={2.4} />}
              </button>
            ))}
          </div>
          <div className={s.colWrap}>
            <button type="button" className={s.colBtn} aria-expanded={menu} aria-haspopup="true" onClick={() => setMenu(!menu)}><Icon name="list" size={14} />Columns</button>
            <AnimatePresence>
              {menu && (
                <motion.div
                  className={s.menu}
                  initial={still ? false : { opacity: 0, scale: 0.96, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.1 } }}
                  transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
                  onKeyDown={(e) => { if (e.key === "Escape") setMenu(false); }}
                >
                  {(Object.keys(colNames) as Col[]).map((c) => (
                    <label key={c}>
                      <input type="checkbox" checked={show(c)} disabled={c === "customer"} onChange={() => setHidden((h) => { const n = new Set(h); if (n.has(c)) n.delete(c); else n.add(c); return n; })} />
                      {colNames[c]}
                    </label>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className={s.tableWrap}>
          <table className={s.table}>
            <caption className="sr-only">Invoices, sorted by {colNames[sort.col]}</caption>
            <thead>
              <tr>
                <th className={s.check}><input ref={all} type="checkbox" checked={view.length > 0 && visiblePicked === view.length} onChange={toggleAll} aria-label="Select all invoices" /></th>
                <th className={s.idCol}>Invoice</th>
                {(["customer", "amount", "status", "due"] as Col[]).map(th)}
              </tr>
            </thead>
            <tbody>
              {view.map((r) => (
                <tr key={r.id} data-picked={picked.has(r.id)}>
                  <td className={s.check}><input type="checkbox" checked={picked.has(r.id)} onChange={() => toggle(r.id)} aria-label={`Select ${r.id}, ${r.customer}`} /></td>
                  <td className={s.idCol}>{r.id}</td>
                  {show("customer") && <td className={s.customer}>{r.customer}</td>}
                  {show("amount") && <td className={s.amount}>{naira(r.amount)}</td>}
                  {show("status") && <td className={s.status}><span className={`${s.badge} ${s[`b${r.status}`]}`}>{r.status}</span></td>}
                  {show("due") && <td className={s.due}>{r.due}</td>}
                </tr>
              ))}
              {view.length === 0 && <tr><td colSpan={6} className={s.empty}>No invoices match. <button type="button" onClick={() => { setQ(""); setFilter(null); }}>Clear filters</button></td></tr>}
            </tbody>
          </table>
        </div>
        <p className={s.count}>{view.length} of {rows.length} invoices</p>

        <AnimatePresence>
          {picked.size > 0 && (
            <motion.div
              className={s.bulk}
              role="toolbar"
              aria-label="Bulk actions"
              initial={still ? false : { y: 24, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 24, opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            >
              <span className={s.sel}><b className="tnum">{picked.size}</b> selected</span>
              <button type="button" onClick={markPaid}><Icon name="check" size={14} stroke={2.2} />Mark paid</button>
              <button type="button" onClick={exportRows}><Icon name="download" size={14} />Export</button>
              <button type="button" className={s.clear} onClick={() => setPicked(new Set())} aria-label="Clear selection"><Icon name="close" size={14} stroke={2.2} /></button>
            </motion.div>
          )}
        </AnimatePresence>
        <p className={s.note} role="status">{note}</p>
      </div>
    </WebShell>
  );
}
