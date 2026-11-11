"use client";

import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import site from "@/content/site.json";
import s from "./MobileMenu.module.css";

const pages = [
  { href: "/#work", label: "Work", match: (p: string) => p.startsWith("/work/") },
  { href: "/systems/", label: "Design systems", match: (p: string) => p.startsWith("/systems") },
  { href: "/playground/", label: "Playground", match: (p: string) => p.startsWith("/playground") },
  { href: "/about/", label: "About", match: (p: string) => p.startsWith("/about") },
  { href: "/#contact", label: "Contact", match: () => false },
];

type Props = { light: boolean; onTheme: () => void; paused: boolean; onPause: () => void };

// Phones only. A floating pill that grows into a sheet: pages, quick actions, and the theme and motion switches.
export function MobileMenu({ light, onTheme, paused, onPause }: Props) {
  const [open, setOpen] = useState(false);
  const [away, setAway] = useState(false);
  const pathname = usePathname() ?? "/";
  const reduce = useReducedMotion();
  const calm = reduce || paused;
  const sheet = useRef<HTMLDivElement>(null);
  const pill = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  // One surface, two shapes: the pill and the sheet share a layout id, so one morphs into the other.
  const morph = calm ? { duration: 0.15 } : { type: "spring" as const, bounce: 0.18, duration: 0.42 };

  const close = () => setOpen(false);

  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      try { navigator.vibrate?.(8); } catch {}
      document.documentElement.style.overflow = "hidden";
      const first = sheet.current?.querySelector<HTMLElement>("a, button");
      const t = setTimeout(() => first?.focus({ preventScroll: true }), calm ? 0 : 180);
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") { e.preventDefault(); close(); }
        if (e.key === "Tab" && sheet.current) {
          // Keep focus inside the sheet while it's open.
          const items = [...sheet.current.querySelectorAll<HTMLElement>("a, button")];
          const i = items.indexOf(document.activeElement as HTMLElement);
          if (e.shiftKey && i <= 0) { e.preventDefault(); items[items.length - 1]?.focus(); }
          else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0]?.focus(); }
        }
      };
      addEventListener("keydown", onKey);
      return () => { clearTimeout(t); removeEventListener("keydown", onKey); document.documentElement.style.overflow = ""; };
    }
    if (wasOpen.current) {
      wasOpen.current = false;
      const t = setTimeout(() => pill.current?.focus({ preventScroll: true }), calm ? 0 : 260);
      return () => clearTimeout(t);
    }
  }, [open, calm]);

  // Close when the page changes (a link was followed), and bring the pill back.
  useEffect(() => { setOpen(false); setAway(false); }, [pathname]);

  // Steps aside while you scroll down to read, and slides back the moment you scroll up.
  useEffect(() => {
    let last = scrollY;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = scrollY;
        if (Math.abs(y - last) < 6) return; // ignore tiny jitters
        const focused = pill.current === document.activeElement;
        setAway(y > last && y > 120 && !focused);
        last = y;
      });
    };
    addEventListener("scroll", onScroll, { passive: true });
    return () => { removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); };
  }, []);

  const item = (i: number) => (calm
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.12 } }
    : {
        initial: { opacity: 0, y: 14, filter: "blur(6px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)" },
        transition: { delay: 0.1 + i * 0.035, type: "spring" as const, bounce: 0.2, duration: 0.45 },
      });

  return (
    <div className={s.root}>
      <LayoutGroup>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="scrim"
              className={s.scrim}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.18 } }}
              transition={{ duration: calm ? 0.1 : 0.25 }}
              onClick={close}
              aria-hidden="true"
            />
          )}
        </AnimatePresence>

        {open ? (
          <motion.div
            ref={sheet}
            key="sheet"
            layoutId="mm-surface"
            className={s.sheet}
            style={{ borderRadius: 28 }}
            transition={morph}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            drag={calm ? false : "y"}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.06, bottom: 0.6 }}
            onDragEnd={(_, info) => { if (info.offset.y > 90 || info.velocity.y > 500) close(); }}
          >
            <span className={s.handle} aria-hidden="true" />
            <motion.div className={s.head} {...item(0)}>
              <img className={s.photo} src="/me.jpg" alt="" width={40} height={40} />
              <span className={s.who}><b>{site.name}</b><span>{site.location}</span></span>
              <button type="button" className={s.close} onClick={close} aria-label="Close menu">
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              </button>
            </motion.div>

            <nav aria-label="Pages">
              <ol className={s.pages}>
                {pages.map((p, i) => {
                  const current = p.match(pathname);
                  return (
                    <motion.li key={p.href} {...item(i + 1)}>
                      <Link href={p.href} className={s.page} aria-current={current ? "page" : undefined} onClick={close}>
                        <span className={s.num}>{String(i + 1).padStart(2, "0")}</span>
                        <span className={s.label}>{p.label}</span>
                        <span className={s.arrow} aria-hidden="true">{current ? <i className={s.here} /> : "→"}</span>
                      </Link>
                    </motion.li>
                  );
                })}
              </ol>
            </nav>

            <motion.div className={s.quick} {...item(pages.length + 1)}>
              <a href={`mailto:${site.contact.email}`} className={s.chip}>Email</a>
              <a href={site.contact.resume} className={s.chip} download>Résumé</a>
            </motion.div>

            <motion.div className={s.switches} {...item(pages.length + 2)}>
              <button type="button" className={s.switch} data-track="theme_toggle" onClick={onTheme} aria-label={light ? "Switch to dark mode" : "Switch to light mode"}>
                <span className={s.switchIcon} aria-hidden="true">
                  {light
                    ? <svg viewBox="0 0 24 24" width="16" height="16"><path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z" fill="currentColor" /></svg>
                    : <svg viewBox="0 0 24 24" width="16" height="16"><circle cx="12" cy="12" r="4.5" fill="currentColor" /><path d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8L6 18M18 6l1.8-1.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>}
                </span>
                {light ? "Dark mode" : "Light mode"}
              </button>
              <button type="button" className={s.switch} data-track="motion_toggle" onClick={onPause} aria-pressed={paused} aria-label={paused ? "Play moving content" : "Pause moving content"}>
                <span className={s.switchIcon} aria-hidden="true">
                  {paused
                    ? <svg viewBox="0 0 24 24" width="16" height="16"><path d="M8 5v14l11-7L8 5z" fill="currentColor" /></svg>
                    : <svg viewBox="0 0 24 24" width="16" height="16"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor" /></svg>}
                </span>
                {paused ? "Play motion" : "Pause motion"}
              </button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.button
            ref={pill}
            key="pill"
            type="button"
            layoutId="mm-surface"
            className={s.pill}
            style={{ borderRadius: 24 }}
            transition={morph}
            onClick={() => setOpen(true)}
            animate={{ y: away ? 90 : 0, opacity: away ? 0 : 1 }}
            onFocus={() => setAway(false)}
            aria-haspopup="dialog"
            data-track="menu_open"
            aria-expanded={false}
            whileTap={calm ? undefined : { scale: 0.96 }}
          >
            <motion.span className={s.pillInner} initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: calm ? 0 : 0.3, duration: 0.18 } }}>
              <svg className={s.icon} viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M4 9h16M4 15h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              <span>Menu</span>
            </motion.span>
          </motion.button>
        )}
      </LayoutGroup>
    </div>
  );
}
