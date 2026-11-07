"use client";

import type { ReactNode } from "react";
import s from "./WebShell.module.css";
import { Icon, type IconName } from "./icons";

// The shared frame for the web pieces: one invented product ("Tally"), so the dashboard,
// the table and the calendar read as screens from the same app.
const nav: [IconName, string][] = [["home", "Overview"], ["receipt", "Transactions"], ["users", "Customers"], ["calendar", "Schedule"], ["card", "Cards"]];

export function WebShell({ active, title, actions, children, dark }: { active: string; title: string; actions?: ReactNode; children: ReactNode; dark?: boolean }) {
  return (
    <div className={s.frame}>
    <div className={`${s.app} ${dark ? s.dark : ""}`}>
      <aside className={s.side} aria-label="Tally">
        <div className={s.brand}><span className={s.logo} aria-hidden="true" />Tally</div>
        <div className={s.search} aria-hidden="true"><Icon name="search" size={14} />Search<kbd>⌘K</kbd></div>
        <nav aria-label="Sections">
          {nav.map(([icon, label]) => (
            <span key={label} className={s.item} aria-current={label === active ? "page" : undefined}><Icon name={icon} size={16} />{label}</span>
          ))}
        </nav>
        <div className={s.me}><span className={s.avatar} aria-hidden="true">O</span><span><b>Oshoke</b><span>Oshoke Studio</span></span></div>
      </aside>
      <div className={s.main}>
        <header className={s.top}>
          <h2 className={s.title}>{title}</h2>
          <div className={s.actions}>{actions}</div>
        </header>
        {children}
      </div>
    </div>
    </div>
  );
}
