"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function Header({ name }: { name: string }) {
  const [light, setLight] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Sticks to the top. Slides away while you scroll down to read, and comes back as soon as you scroll up.
  useEffect(() => {
    let last = scrollY;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = scrollY;
        setScrolled(y > 8);
        if (Math.abs(y - last) < 6) return; // ignore tiny jitters
        const header = document.querySelector(".top");
        const focused = header?.contains(document.activeElement);
        setHidden(y > last && y > 160 && !focused);
        last = y;
      });
    };
    addEventListener("scroll", onScroll, { passive: true });
    return () => { removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); };
  }, []);

  useEffect(() => {
    const saved = document.documentElement.dataset.theme;
    setLight(saved ? saved === "light" : matchMedia("(prefers-color-scheme: light)").matches);
  }, []);

  function toggle() {
    const next = light ? "dark" : "light";
    const apply = () => {
      document.documentElement.dataset.theme = next;
      setLight(!light);
    };
    try {
      localStorage.setItem("theme", next);
    } catch {}
    // Cross-fade the whole page where the browser supports view transitions;
    // elsewhere, and with reduced motion, the switch stays instant.
    if (document.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.startViewTransition(apply);
    } else {
      apply();
    }
  }

  return (
    <header className={`top${hidden ? " away" : ""}${scrolled ? " stuck" : ""}`} onFocus={() => setHidden(false)}>
      <Link className="me" href="/">
        <img className="av" src="/me.jpg" alt="" width={28} height={28} />
        {name}
      </Link>
      <nav>
        <Link href="/#work">Work</Link>
        <Link href="/#systems">Systems</Link>
        <Link href="/playground/">Playground</Link>
        <Link href="/about/">About</Link>
        <Link href="/#contact">Contact</Link>
      </nav>
      <button type="button" onClick={toggle} aria-label="Switch light or dark">
        {light ? "Dark" : "Light"}
      </button>
    </header>
  );
}
