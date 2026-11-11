"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motionPaused, onMotionChange, setMotionPaused } from "@/lib/motion";
import { MobileMenu } from "@/components/MobileMenu";

export function Header({ name }: { name: string }) {
  const [light, setLight] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    setPaused(motionPaused());
    return onMotionChange(() => setPaused(motionPaused()));
  }, []);
  const [scrolled, setScrolled] = useState(false);

  // Pinned to the top at all times; once the page scrolls, it gets a frosted background and a hairline.
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setScrolled(scrollY > 8));
    };
    setScrolled(scrollY > 8); // a reload can restore a scrolled position before any scroll event
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
      // Recolour the phone's status bar and browser chrome to match.
      document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((m) => { m.content = next === "light" ? "#f4f3ef" : "#0f0f0e"; });
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
    <>
    <header className={`top${scrolled ? " stuck" : ""}`}>
      <Link className="me" href="/">
        <img className="av" src="/me.jpg" alt="" width={28} height={28} />
        {name}
      </Link>
      <nav>
        <Link href="/#work">Work</Link>
        <Link href="/systems/">Design systems</Link>
        <Link href="/playground/">Playground</Link>
        <Link href="/about/">About</Link>
        <Link href="/#contact">Contact</Link>
      </nav>
      <button type="button" className="motion-btn" data-track="motion_toggle" onClick={() => setMotionPaused(!paused)} aria-pressed={paused} aria-label={paused ? "Play moving content" : "Pause moving content"}>
        {paused ? "Play" : "Pause"}
      </button>
      <button type="button" data-track="theme_toggle" onClick={toggle} aria-label="Switch light or dark">
        {light ? "Dark" : "Light"}
      </button>
    </header>
    {/* On phones the menu lives in a floating pill instead */}
    <MobileMenu light={light} onTheme={toggle} paused={paused} onPause={() => setMotionPaused(!paused)} />
    </>
  );
}
